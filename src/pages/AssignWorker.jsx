import { useNavigate, useLocation } from 'react-router-dom';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useWorkersStore } from '@/store/workers';
import { useEffect, useState } from 'react';
import { Loader2, User, Filter } from 'lucide-react';

export default function AssignWorker() {
  const navigate = useNavigate();
  const location = useLocation();
  const { workers } = useWorkersStore();
  const [isLoading, setIsLoading] = useState(true);
  const [availabilityFilter, setAvailabilityFilter] = useState('all');
  const [locationFilter, setLocationFilter] = useState('all');

  // Get issueId from location state or query params
  const issueId = location.state?.issueId || null;

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 300);
    return () => clearTimeout(timer);
  }, []);

  // Get unique locations for filter
  const locations = [...new Set(workers.map(worker => worker.location))];

  // Filter workers based on selected filters
  const filteredWorkers = workers.filter(worker => {
    const matchesAvailability = availabilityFilter === 'all' || worker.availability === availabilityFilter;
    const matchesLocation = locationFilter === 'all' || worker.location === locationFilter;
    return matchesAvailability && matchesLocation;
  });

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="p-6 flex justify-center items-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    );
  }

  const handleWorkerClick = (worker) => {
    navigate(`/workers/${worker.id}`, { state: { issueId } });
  };

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        <h1 className="text-3xl font-bold text-foreground">Assign Worker</h1>

        {/* Filters */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filters
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="text-sm font-medium mb-2 block">Availability</label>
                <Select value={availabilityFilter} onValueChange={setAvailabilityFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select availability" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="Available">Available</SelectItem>
                    <SelectItem value="Busy">Busy</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex-1">
                <label className="text-sm font-medium mb-2 block">Location</label>
                <Select value={locationFilter} onValueChange={setLocationFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select location" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    {locations.map((loc) => (
                      <SelectItem key={loc} value={loc}>
                        {loc}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Workers List */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredWorkers.map((worker) => (
            <Card
              key={worker.id}
              className="flex flex-col sm:flex-row items-center justify-between cursor-pointer shadow-card hover:shadow-lg transition-shadow p-4 gap-4"
              onClick={() => handleWorkerClick(worker)}
            >
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <User className="h-8 w-8 text-primary shrink-0" />
                <div className="min-w-0">
                  <div className="font-semibold text-lg truncate">{worker.name}</div>
                  <div className="text-sm text-muted-foreground truncate">{worker.location}</div>
                  <div className="text-xs mt-1"><strong>Current Task:</strong> {worker.currentTask || 'None'}</div>
                </div>
              </div>
              <div className="flex flex-col items-end gap-2">
                <Badge variant={worker.availability === 'Available' ? 'success' : 'destructive'}>
                  {worker.availability}
                </Badge>
                <Button
                  size="sm"
                  variant="outline"
                  className="w-full sm:w-auto"
                  onClick={e => {
                    e.stopPropagation();
                    handleWorkerClick(worker);
                  }}
                >
                  View Details
                </Button>
              </div>
            </Card>
          ))}
        </div>

        {filteredWorkers.length === 0 && (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No workers match the selected filters.</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
