import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useWorkersStore } from '@/store/workers';
import { useIssuesStore } from '@/store/issues';
import { useToast } from '@/components/ui/use-toast';
import { Loader2 } from 'lucide-react';
import { Badge } from "@/components/ui/badge";

export default function WorkerDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { workers, fetchWorkers } = useWorkersStore();
  const { assignWorker, fetchIssues } = useIssuesStore();
  const { toast } = useToast();
  const [worker, setWorker] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadWorker = async () => {
      try {
        if (workers.length === 0) {
          await fetchWorkers();
        }
        const foundWorker = workers.find(w => w.id === id);
        setWorker(foundWorker || null);
        setIsLoading(false);
      } catch (error) {
        setWorker(null);
        setIsLoading(false);
      }
    };
    loadWorker();
  }, [id, workers, fetchWorkers]);

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="p-6 flex justify-center items-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        </div>
      </DashboardLayout>
    );
  }

  if (!worker) {
    return (
      <DashboardLayout>
        <div className="p-6 text-center text-gray-600">
          Worker not found.
          <Button className="mt-4" onClick={() => navigate(-1)}>
            Go Back
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="p-6 max-w-3xl mx-auto space-y-6">
        <Button variant="ghost" onClick={() => navigate(-1)}>
          Back
        </Button>
        <Card className="shadow-card border border-gray-200 rounded-2xl bg-gray-50">
          <CardHeader className="bg-gray-100 border-b border-gray-200 rounded-t-2xl">
            <CardTitle className="text-2xl font-bold text-blue-700 flex items-center gap-2">
              <span>{worker.name || 'Unnamed Worker'}</span>
              <Badge variant={worker.availability === "Available" ? "success" : "secondary"}>
                {worker.availability || "Unknown"}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-muted-foreground mb-1">Department</div>
                <div className="font-medium">{worker.department || 'N/A'}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground mb-1">Phone</div>
                <div className="font-medium">{worker.phone || 'N/A'}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground mb-1">Pincode</div>
                <div className="font-medium">{worker.pincode || 'N/A'}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground mb-1">Current Task</div>
                <div className="font-medium">
                  {worker.currentTask && worker.currentTask !== "None" ? (
                    <span className="inline-flex items-center gap-2">
                      <Badge variant="outline" className="bg-blue-100 text-blue-700 border-blue-200">
                        {worker.currentTask}
                      </Badge>
                      <span className="text-xs text-gray-500">(Assigned)</span>
                    </span>
                  ) : (
                    <span className="text-gray-500">None</span>
                  )}
                </div>
              </div>
            </div>
            {/* Show assigned issue/task details if available */}
            {worker.currentTask && worker.currentTask !== "None" && (
              <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="font-semibold text-blue-800 mb-1 flex items-center gap-2">
                  Assigned to Task:
                  <Badge variant="secondary" className="ml-2">{worker.currentTask}</Badge>
                </div>
                <div className="text-sm text-gray-700">
                  This worker is currently assigned to the above issue/task.
                </div>
              </div>
            )}
          </CardContent>
        </Card>
        {/*
          Add "Assign to Issue" button if issueId is passed in location state
        */}
        {location.state?.issueId && (
          <Button
            variant="primary"
            className="mt-4"
            onClick={async () => {
              try {
                await assignWorker(location.state.issueId, worker); // pass the full worker object
                await fetchIssues(); // <-- force refresh
                toast({
                  title: "Worker Assigned",
                  description: `${worker.name} has been assigned to the issue.`,
                });
                navigate(`/issues/${location.state.issueId}`);
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
    </DashboardLayout>
  );
}
