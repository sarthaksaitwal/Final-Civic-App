import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useIssuesStore } from "@/store/issues";
import { useToast } from "@/components/ui/use-toast";
import { MapPin, Calendar, Clock, ArrowLeft } from "lucide-react";

export default function IssueDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { issues, fetchIssues, updateIssueStatus } = useIssuesStore();
  const { toast } = useToast();

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Ensure issues are fetched if not already
  useEffect(() => {
    const loadIssue = async () => {
      try {
        if (issues.length === 0) {
          await fetchIssues();
        }
        setIsLoading(false);
      } catch (err) {
        console.error("Error fetching issue:", err);
        setError("Failed to load issue details.");
        setIsLoading(false);
      }
    };
    loadIssue();
  }, [fetchIssues, issues.length]);

  const issue = issues.find((i) => i.id === id);

  const handleStatusChange = (newStatus) => {
    updateIssueStatus(id, newStatus);
    toast({
      title: "Status Updated",
      description: `Issue status has been updated to ${newStatus}`,
    });
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center h-full">
          <p className="text-muted-foreground">Loading issue details...</p>
        </div>
      </DashboardLayout>
    );
  }

  if (error || !issue) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center h-full">
          <p className="text-muted-foreground">
            {error || "Issue not found."}
          </p>
        </div>
      </DashboardLayout>
    );
  }

  const getStatusBadgeVariant = (status) => {
    switch (status) {
      case "new":
        return "default";
      case "pending":
        return "secondary";
      case "completed":
        return "outline";
      case "reverted":
        return "destructive";
      case "manual":
        return "outline";
      default:
        return "secondary";
    }
  };

  const getPriorityBadgeVariant = (priority) => {
    switch (priority) {
      case "high":
        return "destructive";
      case "medium":
        return "default";
      case "low":
        return "secondary";
      default:
        return "secondary";
    }
  };

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        {/* Back Button */}
        <Button
          variant="ghost"
          className="flex items-center gap-2"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>

        {/* Issue Details Card */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>{issue.title}</span>
              <Badge variant={getStatusBadgeVariant(issue.status)}>
                {issue.status}
              </Badge>
            </CardTitle>
            <CardDescription>Issue #{issue.id}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">{issue.description}</p>

            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                {issue.location || "N/A"}
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                Reported:{" "}
                {issue.dateReported instanceof Date
                  ? issue.dateReported.toLocaleDateString()
                  : "N/A"}
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                Deadline:{" "}
                {issue.deadline instanceof Date
                  ? issue.deadline.toLocaleDateString()
                  : "N/A"}
              </div>
            </div>

            {/* Tags */}
            <div className="flex items-center gap-2">
              <Badge variant="outline">{issue.category}</Badge>
              <Badge variant={getPriorityBadgeVariant(issue.priority)}>
                {issue.priority} priority
              </Badge>
              {issue.assignedTo && (
                <Badge variant="secondary">Assigned to: {issue.assignedTo}</Badge>
              )}
            </div>

            {/* Photos */}
            {issue.photos && issue.photos.length > 0 && (
              <div className="flex gap-2 mt-4">
                {issue.photos.map((photoUrl, index) => (
                  <img
                    key={index}
                    src={photoUrl}
                    alt={`Photo ${index + 1}`}
                    className="w-32 h-32 object-cover rounded-lg border border-border"
                  />
                ))}
              </div>
            )}

            {/* Audio */}
            {issue.audio && issue.audio.length > 0 && (
              <div className="mt-4">
                {issue.audio.map((audioUrl, index) => (
                  <audio key={index} controls className="w-full">
                    <source src={audioUrl} type="audio/mpeg" />
                    Your browser does not support the audio element.
                  </audio>
                ))}
              </div>
            )}

            {/* Status Update Buttons & Assign to Worker Button */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mt-6 w-full">
              <div className="flex flex-row flex-wrap gap-2">
                {["pending", "completed", "reverted"].map((status) => (
                  <Button
                    key={status}
                    variant={
                      issue.status === status ? "default" : "outline"
                    }
                    onClick={() => handleStatusChange(status)}
                  >
                    Mark {status}
                  </Button>
                ))}
              </div>
              <Button
                variant="primary"
                className="w-full sm:w-auto"
                onClick={() => navigate('/assign-worker', { state: { issueId: id } })}
              >
                Assign to Worker
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
