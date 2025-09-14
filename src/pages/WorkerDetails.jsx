import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useWorkersStore } from '@/store/workers';
import { useIssuesStore } from '@/store/issues';
import { useToast } from '@/components/ui/use-toast';
import { Loader2, BadgeCheck, FileText, User, Phone, Briefcase, MapPin, Hash } from 'lucide-react';
import { Badge } from "@/components/ui/badge";

export default function WorkerDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { workers, fetchWorkers } = useWorkersStore();
  const { issues, fetchIssues } = useIssuesStore();
  const [worker, setWorker] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadWorker = async () => {
      try {
        if (workers.length === 0) {
          await fetchWorkers();
        }
        if (issues.length === 0) {
          await fetchIssues();
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
    // eslint-disable-next-line
  }, [id, workers.length, issues.length, fetchWorkers, fetchIssues]);

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center h-full min-h-[400px]">
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

  // Find assigned issue for this worker
  const assignedIssue = issues.find(
    (issue) =>
      (typeof issue.assignedTo === "object"
        ? issue.assignedTo.id
        : issue.assignedTo) === worker.id
  );

  // Determine availability
  const availability =
    assignedIssue && assignedIssue.status !== "completed"
      ? "Busy"
      : worker.availability || "Available";

  // --- Section: Header ---
  const headerSection = (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h2 className="text-2xl sm:text-3xl font-bold text-blue-700 flex items-center gap-2">
          <BadgeCheck className="h-7 w-7" />
          {worker.name || 'Unnamed Worker'}
        </h2>
        <div className="text-sm text-muted-foreground mt-1 font-bold gap-2">
          Worker ID: <span className="font-mono text-base sm:text-lg">{worker.id}</span>
        </div>
      </div>
      <Badge
        variant={availability === "Available" ? "success" : "secondary"}
        className="text-base px-4 py-1 rounded-full capitalize"
      >
        {availability}
      </Badge>
    </div>
  );

  // --- Section: Details ---
  const detailsSection = (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div className="flex items-center gap-2 text-gray-700">
        <Briefcase className="h-5 w-5 text-blue-700" />
        <span className="font-medium">Department:</span>
        <span>{worker.department || 'N/A'}</span>
      </div>
      <div className="flex items-center gap-2 text-gray-700">
        <Phone className="h-5 w-5 text-blue-700" />
        <span className="font-medium">Phone:</span>
        <span>{worker.phone || 'N/A'}</span>
      </div>
      <div className="flex items-center gap-2 text-gray-700">
        <MapPin className="h-5 w-5 text-blue-700" />
        <span className="font-medium">Location:</span>
        <span>{worker.location || 'N/A'}</span>
      </div>
      <div className="flex items-center gap-2 text-gray-700">
        <Hash className="h-5 w-5 text-blue-700" />
        <span className="font-medium">Pincode:</span>
        <span>{worker.pincode || 'N/A'}</span>
      </div>
    </div>
  );

  // --- Section: Assigned Issue ---
  const assignedSection = assignedIssue ? (
    <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
      <div className="font-semibold text-blue-800 mb-1 flex items-center gap-2">
        <FileText className="h-4 w-4" />
        Assigned to Issue:
        <span className="ml-2">{assignedIssue.title || assignedIssue.id}</span>
        <Badge variant="secondary" className="ml-2">{assignedIssue.status}</Badge>
      </div>
      <div className="text-sm text-gray-700">
        This worker is currently assigned to the above issue.
      </div>
      <Button
        className="mt-3"
        variant="outline"
        onClick={() => navigate(`/issues/${assignedIssue.id}`)}
      >
        View Issue Details
      </Button>
    </div>
  ) : (
    <div className="text-green-700 font-semibold">
      This worker is not currently assigned to any issue.
    </div>
  );

  return (
    <DashboardLayout>
      <div className="p-4 sm:p-8 md:p-12 max-w-4xl mx-auto space-y-8 bg-background rounded-xl shadow-none">
        {/* Header */}
        {headerSection}

        {/* Details Section */}
        <Card className="shadow-card border-2 border-gray-300 rounded-2xl bg-white">
          <CardHeader>
            <CardTitle className="text-lg font-bold text-blue-700 flex items-center gap-2">
              <User className="h-6 w-6 text-blue-700" />
              Worker Details
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">{detailsSection}</CardContent>
        </Card>

        {/* Assigned Issue Section */}
        <Card className="shadow-card border-2 border-gray-300 rounded-2xl bg-white">
          <CardHeader>
            <CardTitle className="text-lg font-bold text-blue-700 flex items-center gap-2">
              <FileText className="h-6 w-6 text-blue-700" />
              Assigned Issue
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">{assignedSection}</CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
