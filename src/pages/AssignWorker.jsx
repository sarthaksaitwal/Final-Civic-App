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
import { Loader2, User, Filter, Phone, MapPin, Briefcase, Hash, ShieldCheck } from 'lucide-react';

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
    location.state?.department
      ? workers.find(w => normalize(w.department) === normalize(location.state.department))
        ? normalize(location.state.department)
        : 'all'
      : 'all'
  );

  // Get issueId from location state or query params
  const issueId = location.state?.issueId || null;

  useEffect(() => {
    fetchWorkers().finally(() => setIsLoading(false));
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    // If department is provided in navigation state and exists in departments, set it as default
    if (location.state?.department) {
      const normalizedDept = normalize(location.state.department);
      if (departments.some(dept => normalize(dept) === normalizedDept)) {
        setDepartmentFilter(normalizedDept);
      } else {
        setDepartmentFilter('all');
      }
    }
    // eslint-disable-next-line
  }, [location.state?.department, workers]);

  // Get unique locations and departments for filter
  const locations = [...new Set(workers.map(worker => worker.location))];
  let departments = [...new Set(workers.map(worker => worker.department).filter(Boolean))];

  // Remove "StreetLight" from the department filter options if present
  departments = departments.filter(dept => dept !== "StreetLight");

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
                <Select
                  value={departmentFilter}
                  onValueChange={setDepartmentFilter}
                  disabled={!!location.state?.department} // Disable if department is set from navigation
                >
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
        <Card className="shadow-lg border border-gray-200">
          <CardHeader>
            {/* <CardTitle className="flex items-center gap-2 text-blue-800">
              <ShieldCheck className="h-5 w-5" />
              Available Workers
            </CardTitle> */}
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredWorkers.length === 0 ? (
                <div className="text-muted-foreground text-center">No workers found.</div>
              ) : (
                filteredWorkers.map((worker) => (
                  <div
                    key={worker.id}
                    className="flex justify-between items-start p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                    onClick={() => handleWorkerClick(worker)}
                  >
                    {/* Left: Worker details */}
                    <div className="flex flex-col gap-1 flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <User className="h-5 w-5 text-blue-600" />
                        <span className="font-bold text-lg text-gray-900 truncate">
                          {worker.name || "Unnamed"}
                        </span>
                      </div>
                      {/* Department and Phone horizontally aligned */}
                      <div className="flex flex-row gap-4">
                        <div className="flex items-center gap-2 text-gray-700 text-base font-semibold">
                          <Briefcase className="h-4 w-4" />
                          <span>{worker.department || "N/A"}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-700 text-base font-semibold">
                          <Phone className="h-4 w-4" />
                          <span>{worker.phone || "N/A"}</span>
                        </div>
                      </div>
                      {/* Location below */}
                      <div className="flex items-center gap-2 text-gray-600 text-sm">
                        <MapPin className="h-4 w-4" />
                        <span>{worker.location || "N/A"}</span>
                      </div>
                      {/* <div className="flex items-center gap-2 text-gray-600 text-sm">
                        <Hash className="h-4 w-4" />
                        <span>{worker.pincode || "N/A"}</span>
                      </div> */}
                    </div>
                    {/* Right: Actions */}
                    <div className="ml-4 flex flex-row items-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="w-full sm:w-auto"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleWorkerClick(worker);
                        }}
                      >
                        View Details
                      </Button>
                      {issueId && (
                        <Button
                          size="sm"
                          variant="primary"
                          className="w-full sm:w-auto bg-primary text-primary-foreground font-semibold shadow hover:bg-primary/90 rounded-xl transition-all duration-200"
                          onClick={async (e) => {
                            e.stopPropagation();
                            try {
                              await assignWorker(issueId, worker);
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
                  </div>
                ))
              )}
            </div>
            {filteredWorkers.length === 0 && (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No workers match the selected filters.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}

// Example navigation (from IssueDetails or elsewhere)
//navigate('/assign-worker', { state: { issueId: issue.id, department: issue.department } });
