import { useParams, useNavigate } from 'react-router-dom';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useIssuesStore } from '@/store/issues';
import {
  MapPin,
  Calendar,
  Clock,
  User,
  Camera,
  ArrowLeft,
  UserPlus,
  RotateCcw,
  AlertTriangle,
  Loader2
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useEffect, useState } from 'react';

export default function IssueDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { issues, updateIssueStatus } = useIssuesStore();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Debug logging
  console.log('IssueDetails - id from params:', id);
  console.log('IssueDetails - issues in store:', issues.length);
  console.log('IssueDetails - issue ids in store:', issues.map(i => i.id));

  useEffect(() => {
    // Simulate loading time for store initialization
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  const issue = issues.find(i => i.id === id);

  console.log('IssueDetails - found issue:', issue);

  // Loading state
  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="p-6">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
              <p className="text-muted-foreground">Loading issue details...</p>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // Error state
  if (error) {
    return (
      <DashboardLayout>
        <div className="p-6">
          <div className="text-center">
            <AlertTriangle className="h-12 w-12 mx-auto mb-4 text-destructive" />
            <h1 className="text-2xl font-bold text-foreground mb-4">Error Loading Issue</h1>
            <p className="text-muted-foreground mb-4">{error}</p>
            <Button onClick={() => navigate('/issues')}>
              Back to Issues
            </Button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // Issue not found
  if (!issue) {
    return (
      <DashboardLayout>
        <div className="p-6">
          <div className="text-center">
            <AlertTriangle className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h1 className="text-2xl font-bold text-foreground mb-4">Issue Not Found</h1>
            <p className="text-muted-foreground mb-4">The issue you're looking for doesn't exist or may have been removed.</p>
            <Button onClick={() => navigate('/issues')}>
              Back to Issues
            </Button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const handleStatusUpdate = (newStatus) => {
    updateIssueStatus(issue.id, newStatus);
    toast({
      title: "Status updated",
      description: `Issue status changed to ${newStatus}`,
    });
  };

  const handleAssign = () => {
    navigate('/assign-worker', { state: { issueId: issue.id } });
  };

  const getStatusBadgeVariant = (status) => {
    switch (status) {
      case 'new': return 'default';
      case 'pending': return 'secondary';
      case 'completed': return 'outline';
      case 'reverted': return 'destructive';
      case 'manual': return 'outline';
      default: return 'secondary';
    }
  };

  const getPriorityBadgeVariant = (priority) => {
    switch (priority) {
      case 'high': return 'destructive';
      case 'medium': return 'default';
      case 'low': return 'secondary';
      default: return 'secondary';
    }
  };

  const formatDeadline = (deadline) => {
    const now = new Date();
    const diffTime = deadline.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return { text: `${Math.abs(diffDays)} days overdue`, variant: 'destructive' };
    } else if (diffDays === 0) {
      return { text: 'Due today', variant: 'secondary' };
    } else if (diffDays === 1) {
      return { text: 'Due tomorrow', variant: 'secondary' };
    } else {
      return { text: `${diffDays} days remaining`, variant: 'outline' };
    }
  };

  const deadlineInfo = formatDeadline(issue.deadline);

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => navigate('/issues')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Issues
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-foreground">{issue.title}</h1>
              <p className="text-muted-foreground">Issue #{issue.id}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant={getStatusBadgeVariant(issue.status)}>
              {issue.status}
            </Badge>
            <Badge variant={getPriorityBadgeVariant(issue.priority)}>
              {issue.priority} priority
            </Badge>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Issue Details */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle>Issue Description</CardTitle>
                <CardDescription>
                  Detailed information about the reported issue
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium text-foreground mb-2">Description</h4>
                  <p className="text-muted-foreground">{issue.description}</p>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium text-foreground mb-2">Location</h4>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      <span>{issue.location.address}</span>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-foreground mb-2">Category</h4>
                    <Badge variant="outline">{issue.category}</Badge>
                  </div>

                  <div>
                    <h4 className="font-medium text-foreground mb-2">Reported By</h4>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <User className="h-4 w-4" />
                      <span>{issue.reportedBy}</span>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-foreground mb-2">Date Reported</h4>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span>{issue.dateReported.toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Photos */}
            {issue.photos.length > 0 && (
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Camera className="h-5 w-5 text-primary" />
                    Issue Photos
                  </CardTitle>
                  <CardDescription>
                    Visual documentation of the reported issue
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4">
                    {issue.photos.map((photo, index) => (
                      <div key={index} className="aspect-video overflow-hidden rounded-lg border border-border">
                        <img
                          src={photo}
                          alt={`Issue photo ${index + 1}`}
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
                        />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Timeline & Status */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-primary" />
                  Timeline
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium text-foreground mb-2">Deadline</h4>
                  <Badge variant={deadlineInfo.variant}>
                    {deadlineInfo.text}
                  </Badge>
                  <p className="text-sm text-muted-foreground mt-1">
                    Due: {issue.deadline.toLocaleDateString()}
                  </p>
                </div>

                {issue.assignedTo && (
                  <div>
                    <h4 className="font-medium text-foreground mb-2">Assigned To</h4>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <User className="h-4 w-4" />
                      <span>{issue.assignedTo}</span>
                    </div>
                  </div>
                )}

                <div>
                  <h4 className="font-medium text-foreground mb-2">Current Status</h4>
                  <Badge variant={getStatusBadgeVariant(issue.status)} className="mb-2">
                    {issue.status}
                  </Badge>
                  <p className="text-xs text-muted-foreground">
                    Last updated: {new Date().toLocaleDateString()}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle>Actions</CardTitle>
                <CardDescription>
                  Manage this issue
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  onClick={handleAssign} 
                  className="w-full"
                  disabled={issue.status === 'completed'}
                >
                  <UserPlus className="h-4 w-4 mr-2" />
                  Assign Worker
                </Button>

                <div className="space-y-2">
                  <p className="text-sm font-medium text-foreground">Update Status:</p>
                  
                  {issue.status !== 'pending' && (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => handleStatusUpdate('pending')}
                      className="w-full"
                    >
                      Mark as Pending
                    </Button>
                  )}
                  
                  {issue.status !== 'completed' && (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => handleStatusUpdate('completed')}
                      className="w-full"
                    >
                      Mark as Completed
                    </Button>
                  )}
                  
                  {issue.status !== 'reverted' && (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => handleStatusUpdate('reverted')}
                      className="w-full"
                    >
                      <RotateCcw className="h-4 w-4 mr-2" />
                      Revert Issue
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}