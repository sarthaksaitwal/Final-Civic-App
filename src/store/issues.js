import { create } from 'zustand';
import { realtimeDb } from '../lib/firebase';
import { ref, get, update, onValue, off } from 'firebase/database';

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
  }
}));
