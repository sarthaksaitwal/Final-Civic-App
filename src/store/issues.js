import { create } from 'zustand';

// Mock issues data
const mockIssues = [
  {
    id: '1',
    title: 'Pothole on Main Street',
    description: 'Large pothole causing traffic issues near intersection',
    status: 'pending',
    location: {
      address: '123 Main St, Ranchi',
      coordinates: [23.3441, 85.3096],
      state: 'Jharkhand'
    },
    dateReported: new Date('2024-01-15'),
    deadline: new Date('2024-02-15'),
    category: 'Roads & Infrastructure',
    priority: 'high',
    reportedBy: 'citizen@email.com',
    photos: ['https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300']
  },
  {
    id: '2',
    title: 'Broken Street Light',
    description: 'Street light not working on Oak Avenue',
    status: 'new',
    location: {
      address: '456 Oak Ave, Jamshedpur',
      coordinates: [22.8046, 86.2029],
      state: 'Jharkhand'
    },
    dateReported: new Date('2024-01-20'),
    deadline: new Date('2024-02-01'),
    category: 'Utilities',
    priority: 'medium',
    reportedBy: 'resident@email.com',
    photos: ['https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400&h=300']
  },
  {
    id: '3',
    title: 'Sidewalk Repair Needed',
    description: 'Cracked sidewalk poses safety hazard',
    status: 'completed',
    location: {
      address: '789 Pine St, Dhanbad',
      coordinates: [23.7957, 86.4304],
      state: 'Jharkhand'
    },
    dateReported: new Date('2024-01-10'),
    deadline: new Date('2024-01-25'),
    category: 'Sidewalks',
    priority: 'medium',
    reportedBy: 'shop@email.com',
    assignedTo: 'Worker #A101',
    photos: ['https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=400&h=300']
  },
  {
    id: '4',
    title: 'Traffic Signal Malfunction',
    description: 'Traffic light stuck on red at busy intersection',
    status: 'manual',
    location: {
      address: 'Elm St & 2nd Ave, Bokaro',
      coordinates: [23.6693, 86.1511],
      state: 'Jharkhand'
    },
    dateReported: new Date('2024-01-22'),
    deadline: new Date('2024-01-23'),
    category: 'Traffic Management',
    priority: 'high',
    reportedBy: 'police@city.gov',
    photos: ['https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400&h=300']
  },
  {
    id: '5',
    title: 'Graffiti Removal Required',
    description: 'Vandalism on public building wall',
    status: 'reverted',
    location: {
      address: '321 City Hall Plaza, Deoghar',
      coordinates: [24.4809, 86.6917],
      state: 'Jharkhand'
    },
    dateReported: new Date('2024-01-18'),
    deadline: new Date('2024-02-05'),
    category: 'Public Property',
    priority: 'low',
    reportedBy: 'maintenance@city.gov',
    photos: ['https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=400&h=300']
  }
];

export const useIssuesStore = create((set, get) => ({
  issues: mockIssues,
  selectedIssue: null,
  setSelectedIssue: (issue) => set({ selectedIssue: issue }),
  getIssuesByStatus: (status) => get().issues.filter(issue => issue.status === status),
  updateIssueStatus: (id, status) => set(state => ({
    issues: state.issues.map(issue =>
      issue.id === id ? { ...issue, status } : issue
    )
  }))
}));
