import React, { useState, useEffect } from "react";
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
import { MapPin, Calendar, Clock, ArrowLeft, CheckCircle } from "lucide-react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";

const ISSUE_TYPE_MAP = {
  RDG: "Road Damage",
  DRN: "Drainage & Sewage",
  WTR: "Water",
  GBG: "Garbage",
  SLT: "StreetLight",
};

export default function IssueDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { issues, fetchIssues, updateIssueStatus } = useIssuesStore();
  const { toast } = useToast();

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showMap, setShowMap] = useState(false);

  // Add state for photo modal
  const [openPhoto, setOpenPhoto] = useState(null);

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

  // Helper to get issue type from token
  const getIssueTypeFromToken = (id) => {
    if (!id) return "Unknown";
    const prefix = id.split("-")[0];
    return ISSUE_TYPE_MAP[prefix] || "Unknown";
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
      <div className="p-4 sm:p-6 md:p-8 max-w-5xl mx-auto space-y-6">
        {/* Back Button */}
        <div className="mb-2">
          <Button
            variant="ghost"
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-base sm:text-sm"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
        </div>

        {/* Issue Details Card */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <span className="text-xl sm:text-2xl font-bold break-words">
                {issue.title || getIssueTypeFromToken(issue.id) || "Untitled Issue"}
              </span>
              <Badge variant={getStatusBadgeVariant(issue.status)} className="self-start sm:self-center">
                {issue.status}
              </Badge>
            </CardTitle>
            <CardDescription className="text-sm mt-1">Issue #{issue.id}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">{issue.description}</p>

            <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-sm text-muted-foreground">
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
            <div className="flex flex-wrap items-center gap-2">
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
              <div className="flex flex-wrap gap-2 mt-4">
                {issue.photos.map((photoUrl, index) => (
                  <img
                    key={index}
                    src={photoUrl}
                    alt={`Photo ${index + 1}`}
                    className="w-28 h-28 object-cover rounded-lg border border-border cursor-pointer transition-transform duration-200 hover:scale-105 hover:shadow-lg"
                    onClick={() => setOpenPhoto(photoUrl)}
                    title="Click to view"
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
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mt-6 w-full">
              <div className="flex flex-row flex-wrap gap-2">
                {["pending", "completed", "reverted"].map((status) => (
                  <Button
                    key={status}
                    variant={issue.status === status ? "default" : "outline"}
                    onClick={() => handleStatusChange(status)}
                    className="px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                  >
                    Mark {status}
                  </Button>
                ))}
              </div>
              <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                <Button
                  variant="primary"
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-7 py-3 rounded-xl font-semibold text-base bg-primary text-primary-foreground shadow-lg hover:bg-primary/90 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-all duration-200"
                  onClick={() => navigate('/assign-worker', { state: { issueId: id } })}
                >
                  <CheckCircle className="h-5 w-5" />
                  Assign to Worker
                </Button>
                <Button
                  variant="primary"
                  onClick={() => setShowMap(true)}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-7 py-3 rounded-xl font-semibold text-base bg-primary text-primary-foreground shadow-lg hover:bg-primary/90 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-all duration-200"
                >
                  <MapPin className="h-5 w-5" />
                  View on Map
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Map Modal/Section */}
        {showMap && issue.coordinates && Array.isArray(issue.coordinates) && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="bg-white rounded-lg shadow-lg p-4 relative w-full max-w-xl">
              <button
                className="absolute top-2 right-2 text-gray-500 hover:text-red-500 text-2xl"
                onClick={() => setShowMap(false)}
                aria-label="Close map"
              >
                ✕
              </button>
              <h3 className="text-lg font-semibold mb-2">Issue Location</h3>
              <div className="h-80 w-full rounded-lg overflow-hidden">
                <MapContainer
                  center={issue.coordinates}
                  zoom={16}
                  style={{ height: "100%", width: "100%" }}
                >
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  <Marker position={issue.coordinates}>
                    <Popup>
                      {issue.title || "Issue Location"}
                    </Popup>
                  </Marker>
                </MapContainer>
              </div>
            </div>
          </div>
        )}

        {/* Photo Modal */}
        {openPhoto && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
            <div className="relative">
              <button
                className="absolute top-2 right-2 text-white bg-black/60 rounded-full p-2 hover:bg-black/90 transition"
                onClick={() => setOpenPhoto(null)}
                aria-label="Close photo"
              >
                ✕
              </button>
              <img
                src={openPhoto}
                alt="Full size"
                className="max-h-[80vh] max-w-[90vw] rounded-lg shadow-2xl border-4 border-white"
              />
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
