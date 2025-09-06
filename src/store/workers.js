import { create } from "zustand";
import { get, ref, update } from "firebase/database";
import { realtimeDb } from "@/lib/firebase";

export const useWorkersStore = create((set, get) => ({
  workers: [],
  selectedWorker: null,
  loading: false,
  error: null,

  // Fetch all workers from Realtime Database
  fetchWorkers: async () => {
    set({ loading: true, error: null });
    try {
      const snapshot = await get(ref(realtimeDb, 'workers'));
      if (snapshot.exists()) {
        const data = snapshot.val();
        const workers = Object.entries(data).map(([id, worker]) => ({
          id,
          ...worker
        }));
        set({ workers, loading: false });
      } else {
        set({ workers: [], loading: false });
      }
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  setSelectedWorker: (worker) => set({ selectedWorker: worker }),

  getWorkerById: (id) => get().workers.find(worker => worker.id === id),

  getAvailableWorkers: () => get().workers.filter(worker => worker.availability === 'Available'),

  assignWorkerToIssue: async (workerId, issueId, issueTitle) => {
    try {
      const workerRef = ref(realtimeDb, `workers/${workerId}`);
      const worker = get().getWorkerById(workerId);
      if (!worker) {
        set({ error: "Worker not found." });
        return;
      }
      // Fallback to empty array if assignedTasks is undefined
      const updatedTasks = [...(worker.assignedTasks || []), { id: issueId, title: issueTitle, status: 'in-progress' }];
      await update(workerRef, {
        currentTask: issueTitle,
        availability: 'Busy',
        assignedTasks: updatedTasks
      });
      set(state => ({
        workers: state.workers.map(w =>
          w.id === workerId
            ? {
                ...w,
                currentTask: issueTitle,
                availability: 'Busy',
                assignedTasks: updatedTasks
              }
            : w
        )
      }));
    } catch (error) {
      set({ error: error.message });
    }
  }
}));
