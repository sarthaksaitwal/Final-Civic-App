import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useWorkersStore } from '@/store/workers';
import { useIssuesStore } from '@/store/issues';
import { useEffect, useState } from 'react';
import { Loader2, User, ArrowLeft, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function WorkerDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { getWorkerById, assignWorkerToIssue } = useWorkersStore();
  const { issues } = useIssuesStore();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);

  const issueId = location.state?.issueId || null;
  const worker = getWorkerById(id);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 300);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="p-6 flex justify-center items-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    );
  }

  if (!worker) {
    return (
      <DashboardLayout>
        <div className="p-6 text-center">
          <h1 className="text-2xl font-bold">Worker Not Found</h1>
          <Button onClick={() => navigate('/assign-worker')} className="mt-4">
            Back to Workers
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  const handleAssign = () => {
    if (!issueId) {
      toast({
        title: "No Issue Selected",
        description: "Please select an issue to assign this worker.",
      });
      return;
    }

    const issue = issues.find(i => i.id === issueId);
    if (!issue) {
      toast({
        title: "Issue Not Found",
        description: "The selected issue could not be found.",
      });
      return;
    }

    assignWorkerToIssue(worker.id, issueId, issue.title);
    toast({
      title: "Worker Assigned",
      description: `${worker.name} has been assigned to ${issue.title}`,
    });
    navigate(`/issues/${issueId}`);
  };

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => navigate('/assign-worker')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Workers
          </Button>
          <h1 className="text-3xl font-bold text-foreground">{worker.name}</h1>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Worker Information
              </CardTitle>
            </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <strong>Name:</strong> {worker.name}
                </div>
                <div>
                  <strong>Current Task:</strong> {worker.currentTask || 'None'}
                </div>
                <div>
                  <strong>Availability:</strong>{' '}
                  <Badge variant={worker.availability === 'Available' ? 'success' : 'destructive'}>
                    {worker.availability}
                  </Badge>
                </div>
                <div>
                  <strong>Location:</strong> {worker.location}
                </div>
              </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Assigned Tasks</CardTitle>
            </CardHeader>
            <CardContent>
              {worker.assignedTasks.length > 0 ? (
                <ul className="space-y-2">
                  {worker.assignedTasks.map((task) => (
                    <li key={task.id} className="flex items-center justify-between">
                      <span>{task.title}</span>
                      <Badge variant={task.status === 'completed' ? 'outline' : 'default'}>
                        {task.status}
                      </Badge>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-muted-foreground">No assigned tasks</p>
              )}
            </CardContent>
          </Card>
        </div>

        {issueId && (
          <div className="flex justify-center">
            <Button onClick={handleAssign} className="w-full max-w-md">
              <CheckCircle className="h-4 w-4 mr-2" />
              Assign to Issue
            </Button>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
