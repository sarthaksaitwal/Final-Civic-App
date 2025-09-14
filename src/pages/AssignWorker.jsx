import { useNavigate, useLocation } from 'react-router-dom';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useWorkersStore } from '@/store/workers';
import { useIssuesStore } from '@/store/issues';
import { useToast } from '@/components/ui/use-toast';
import { useEffect, useState } from 'react';
import { Loader2, User, Filter } from 'lucide-react';

export default function AssignWorker() {
  const normalize = str => (str || '').toLowerCase().replace(/\s+/g, '');

  const navigate = useNavigate();
  const location = useLocation();
  const { workers, fetchWorkers } = useWorkersStore();
  const { assignWorker } = useIssuesStore();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [availabilityFilter, setAvailabilityFilter] = useState('all');
  const [locationFilter, setLocationFilter] = useState('all');
  // Set default department filter from navigation state, fallback to 'all'
  const [departmentFilter, setDepartmentFilter] = useState(
    location.state?.department || 'all'
  );

  // Get issueId from location state or query params
  const issueId = location.state?.issueId || null;

  useEffect(() => {
    fetchWorkers().finally(() => setIsLoading(false));
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (location.state?.department) {
      setDepartmentFilter(location.state.department);
    }
  }, [location.state?.department]);

  // Get unique locations and departments for filter
  const locations = [...new Set(workers.map(worker => worker.location))];
  let departments = [...new Set(workers.map(worker => worker.department).filter(Boolean))];

  // Ensure "StreetLight" is always present in the department filter
  if (!departments.includes("StreetLight")) {
    departments.push("StreetLight");
  }

  // Filter workers based on selected filters
  const filteredWorkers = workers.filter(worker => {
    const matchesAvailability = availabilityFilter === 'all' || worker.availability === availabilityFilter;
    const matchesLocation = locationFilter === 'all' || worker.location === locationFilter;
    const normalize = str => (str || '').toLowerCase().replace(/\s+/g, '');
    const matchesDepartment =
      departmentFilter === 'all' ||
      (normalize(worker.department) === normalize(departmentFilter));
    return matchesAvailability && matchesLocation && matchesDepartment;
  });

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="p-6 flex justify-center items-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        </div>
      </DashboardLayout>
    );
  }

  const handleWorkerClick = (worker) => {
    navigate(`/workers/${worker.id}`, { state: { issueId } });
  };

  console.log("Available worker departments:", workers.map(w => w.department));
  console.log("Default department filter:", departmentFilter);

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
              <div className="flex-1">
                <label className="text-sm font-medium mb-2 block">Department</label>
                <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    {departments.map((dept) => (
                      <SelectItem key={dept} value={normalize(dept)}>
                        {dept}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Workers List */}
        <div className="space-y-4">
          {filteredWorkers.length === 0 ? (
            <div className="text-muted-foreground text-center">No workers found.</div>
          ) : (
            filteredWorkers.map((worker) => (
              <Card
                key={worker.id}
                className="flex flex-col sm:flex-row items-center justify-between cursor-pointer shadow-card hover:shadow-lg transition-shadow p-4 gap-4"
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="font-semibold text-lg truncate">{worker.name || "Unnamed"}</div>
                  <div className="text-sm text-muted-foreground truncate">Department: {worker.department || "N/A"}</div>
                  <div className="text-sm text-muted-foreground truncate">Phone: {worker.phone || "N/A"}</div>
                  <div className="text-sm text-muted-foreground truncate">Pincode: {worker.pincode || "N/A"}</div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="w-full sm:w-auto"
                    onClick={() => handleWorkerClick(worker)}
                  >
                    View Details
                  </Button>
                  {issueId && (
                    <Button
                      size="sm"
                      variant="primary"
                      className="w-full sm:w-auto bg-gradient-to-r from-green-400 to-blue-500 hover:from-blue-500 hover:to-green-400 text-white font-semibold shadow-lg rounded-lg transition duration-300 ease-in-out"
                      onClick={async () => {
                        try {
                          await assignWorker(issueId, worker); // pass the full worker object!
                          toast({
                            title: "Worker Assigned",
                            description: `${worker.name} has been assigned to the issue.`,
                          });
                          navigate(`/issues/${issueId}`);
                        } catch (error) {
                          toast({
                            title: "Error",
                            description: "Failed to assign worker to the issue.",
                            variant: "destructive",
                          });
                        }
                      }}
                    >
                      Assign to Issue
                    </Button>
                  )}
                </div>
              </Card>
            ))
          )}
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

// Example navigation (from IssueDetails or elsewhere)
//navigate('/assign-worker', { state: { issueId: issue.id, department: issue.department } });
