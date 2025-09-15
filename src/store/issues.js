import { create } from 'zustand';
import { realtimeDb } from '../lib/firebase';
import { ref, get, update, onValue, off, set } from 'firebase/database';
import { useWorkersStore } from "@/store/workers";

export const useIssuesStore = create((set, getState) => ({
  issues: [],
  selectedIssue: null,
  loading: false,
  error: null,

  // Real-time listener for all issues from Realtime Database
  fetchIssues: () => {
    set({ loading: true, error: null });
    const complaintsRef = ref(realtimeDb, 'complaints');

    // Remove any previous listener
    if (getState()._unsubscribeIssues) {
      getState()._unsubscribeIssues();
    }

    const onValueCallback = (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const issues = Object.entries(data).map(([id, issue]) => {
          let coordinates = [0, 0];
          if (issue.gps) {
            const parts = issue.gps.split(',').map(part => parseFloat(part.trim()));
            if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
              coordinates = parts;
            }
          }
          return {
            id,
            ...issue,
            dateReported: issue.dateTime ? new Date(issue.dateTime) : null,
            deadline: issue.deadline ? new Date(issue.deadline) : null,
            photos: issue.photos ? Object.values(issue.photos) : [],
            audio: issue.audio ? Object.values(issue.audio) : [],
            location: issue.location || 'N/A',
            coordinates
          };
        });
        set({ issues, loading: false });
      } else {
        set({ issues: [], loading: false });
      }
    };

    onValue(complaintsRef, onValueCallback);

    // Store unsubscribe function in state for cleanup
    set({
      _unsubscribeIssues: () => off(complaintsRef, 'value', onValueCallback)
    });
  },
  // Internal: store unsubscribe function for real-time listener
  _unsubscribeIssues: null,

  setSelectedIssue: (issue) => set({ selectedIssue: issue }),

  getIssuesByStatus: (status) => getState().issues.filter(issue => issue.status === status),

  updateIssueStatus: async (id, status) => {
    try {
      const issueRef = ref(realtimeDb, `complaints/${id}`);
      await update(issueRef, { status });
      set(state => ({
        issues: state.issues.map(issue =>
          issue.id === id ? { ...issue, status } : issue
        )
      }));
    } catch (error) {
      set({ error: error.message });
    }
  },

  // Add new complaint
  addComplaint: async (complaintData) => {
    // This would typically be handled by a form submission
    // For now, just refetch after adding
    await getState().fetchIssues();
  },

  // Assign worker to issue
  assignWorker: async (issueId, worker) => {
    try {
      // Fetch the latest worker data from the database
      const workerKey = worker.workerId || worker.id;
      const workerRef = ref(realtimeDb, `workers/${workerKey}`);
      const workerSnapshot = await get(workerRef);
      const workerData = workerSnapshot.exists() ? workerSnapshot.val() : {};

      // Prevent assignment if worker is already assigned
      if (workerData.assignedIssueId && workerData.assignedIssueId !== "") {
        throw new Error(
          `Worker is already assigned to issue ${workerData.assignedIssueId}. Unassign first.`
        );
      }

      // Fetch the latest issue data from the database
      const issueRef = ref(realtimeDb, `complaints/${issueId}`);
      const issueSnapshot = await get(issueRef);
      const issueData = issueSnapshot.exists() ? issueSnapshot.val() : {};

      // Prevent assignment if issue already has a worker assigned
      if (issueData.assignedTo && issueData.assignedTo !== "" && issueData.assignedTo !== workerKey) {
        throw new Error(
          `This issue is already assigned to another worker (${issueData.assignedTo}). Unassign first.`
        );
      }

      const assignedTo = workerKey;
      const assignedDate = new Date().toISOString();

      // Update the issue
      await update(issueRef, { assignedTo, status: 'Assigned', assignedDate });

      // Update the worker: set assignedIssueId
      await update(workerRef, { assignedIssueId: issueId });

      set(state => ({
        issues: state.issues.map(issue =>
          issue.id === issueId ? { ...issue, assignedTo, status: 'Assigned', assignedDate } : issue
        )
      }));
    } catch (error) {
      set({ error: error.message });
      throw error; // So UI can show toast
    }
  },

  // Unassign worker from issue
  unassignWorker: async (workerId) => {
    try {
      // 1. Find the issue currently assigned to this worker
      const issuesSnapshot = await get(ref(realtimeDb, 'complaints'));
      if (!issuesSnapshot.exists()) return;

      const issuesData = issuesSnapshot.val();
      let assignedIssueId = null;
      let assignedIssueKey = null;

      for (const [issueKey, issue] of Object.entries(issuesData)) {
        if (
          (typeof issue.assignedTo === "object"
            ? issue.assignedTo.id
            : issue.assignedTo) === workerId
        ) {
          assignedIssueId = issue.id || issueKey;
          assignedIssueKey = issueKey;
          break;
        }
      }

      // 2. Update the worker: set assignedIssueId to ""
      const workerRef = ref(realtimeDb, `workers/${workerId}`);
      await update(workerRef, { assignedIssueId: "" });

      // 3. Update the complaint: set assignedTo to "" and add previouslyAssignedWorker
      if (assignedIssueKey) {
        const complaintRef = ref(realtimeDb, `complaints/${assignedIssueKey}`);
        await update(complaintRef, {
          assignedTo: "",
          previouslyAssignedWorker: workerId,
        });
      }
    } catch (error) {
      set({ error: error.message });
      throw error;
    }
  },

  // When creating a new worker
  createWorker: async (workerId, workerData) => {
    try {
      const newWorker = {
        ...workerData,
        assignedIssueId: "", // Always add this field
      };
      await set(ref(realtimeDb, `workers/${workerId}`), newWorker);
    } catch (error) {
      set({ error: error.message });
    }
  }
}));

// Run this once in your admin panel or Node script

async function addAssignedIssueIdToAllWorkers() {
  const workersRef = ref(realtimeDb, "workers");
  const snapshot = await get(workersRef);
  if (snapshot.exists()) {
    const workers = snapshot.val();
    for (const workerId in workers) {
      if (!workers[workerId].assignedIssueId) {
        await update(ref(realtimeDb, `workers/${workerId}`), { assignedIssueId: "" });
      }
    }
  }
}
addAssignedIssueIdToAllWorkers();

