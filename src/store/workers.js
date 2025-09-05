import { create } from 'zustand';

// Mock workers data
const mockWorkers = [
  {
    id: 'W001',
    name: 'Rajesh Kumar',
    currentTask: 'Pothole on Main Street',
    availability: 'Available',
    location: 'Ranchi',
    assignedTasks: [
      { id: '1', title: 'Pothole on Main Street', status: 'in-progress' },
      { id: '2', title: 'Broken Street Light', status: 'completed' }
    ]
  },
  {
    id: 'W002',
    name: 'Priya Sharma',
    currentTask: 'Traffic Signal Malfunction',
    availability: 'Busy',
    location: 'Jamshedpur',
    assignedTasks: [
      { id: '4', title: 'Traffic Signal Malfunction', status: 'in-progress' }
    ]
  },
  {
    id: 'W003',
    name: 'Amit Singh',
    currentTask: 'None',
    availability: 'Available',
    location: 'Dhanbad',
    assignedTasks: []
  },
  {
    id: 'W004',
    name: 'Sunita Patel',
    currentTask: 'Graffiti Removal Required',
    availability: 'Busy',
    location: 'Bokaro',
    assignedTasks: [
      { id: '5', title: 'Graffiti Removal Required', status: 'in-progress' }
    ]
  },
  {
    id: 'W005',
    name: 'Vikram Rao',
    currentTask: 'Sidewalk Repair Needed',
    availability: 'Available',
    location: 'Deoghar',
    assignedTasks: [
      { id: '3', title: 'Sidewalk Repair Needed', status: 'completed' }
    ]
  }
];

export const useWorkersStore = create((set, get) => ({
  workers: mockWorkers,
  selectedWorker: null,
  setSelectedWorker: (worker) => set({ selectedWorker: worker }),
  getWorkerById: (id) => get().workers.find(worker => worker.id === id),
  getAvailableWorkers: () => get().workers.filter(worker => worker.availability === 'Available'),
  assignWorkerToIssue: (workerId, issueId, issueTitle) => set(state => ({
    workers: state.workers.map(worker =>
      worker.id === workerId
        ? {
            ...worker,
            currentTask: issueTitle,
            availability: 'Busy',
            assignedTasks: [...worker.assignedTasks, { id: issueId, title: issueTitle, status: 'in-progress' }]
          }
        : worker
    )
  }))
}));
