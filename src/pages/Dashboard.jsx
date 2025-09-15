import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useIssuesStore } from '@/store/issues';
import { Loader2 } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import {
  FileX,
  RotateCcw,
  Settings,
  AlertTriangle,
  CheckCircle,
  Lightbulb,
  Trash2,
  Droplet,
  Wrench,
  Waves, // If this fails, use Settings or another fallback
  MapPin,
  Calendar,
  TrendingUp,
  UserCheck
} from 'lucide-react';

const statusConfig = {
  Pending: {
    title: 'Pending',
    icon: RotateCcw,
    color: 'bg-yellow-100',
    textColor: 'text-yellow-700'
  },
  Assigned: {
    title: 'Assigned',
    icon: UserCheck,
    color: 'bg-purple-100',
    textColor: 'text-purple-700'
  },
  "In Progress": {
    title: 'In Progress',
    icon: Wrench,
    color: 'bg-blue-100',
    textColor: 'text-blue-700'
  },
  Resolved: {
    title: 'Resolved',
    icon: CheckCircle,
    color: 'bg-green-100',
    textColor: 'text-green-700'
  },
  "Review & Approve": {
    title: 'Review & Approve',
    icon: Settings,
    color: 'bg-accent',
    textColor: 'text-accent-foreground'
  }
};

const ISSUE_TYPE_MAP = {
  RDG: "Road Damage",
  DRN: "Drainage & Sewage",
  WTR: "Water",
  GBG: "Garbage",
  SLT: "StreetLight",
};

// Map categories to icons (use available icons only)
const CATEGORY_ICON = {
  "Road Damage": Settings,         // No Road icon, use Settings as fallback
  "Drainage & Sewage": RotateCcw,  // Or use Settings/Waves if available
  "Water": Droplet,
  "Garbage": Trash2,
  "StreetLight": Lightbulb,
  "Review & Approve": Wrench,
  "Unknown": FileX
};

const ISSUE_TYPE_ICON = {
  "Road Damage": FileX,
  "Drainage & Sewage": RotateCcw,
  "Water": Settings,
  "Garbage": AlertTriangle,
  "StreetLight": CheckCircle,
  "Unknown": FileX
};

const getIssueTypeFromToken = (id) => {
  if (!id) return "Unknown";
  const prefix = id.split("-")[0];
  return ISSUE_TYPE_MAP[prefix] || "Unknown";
};

const getIssueIcon = (type) => {
  return ISSUE_TYPE_ICON[type] || FileX;
};

export default function Dashboard() {
  const { issues, fetchIssues, loading } = useIssuesStore();
  const navigate = useNavigate();
  const [markerSize, setMarkerSize] = useState({ width: 20, height: 26 });

  const getIssuesByStatus = (status) =>
    issues.filter(issue => (issue.status || '').toLowerCase() === status.toLowerCase());

  // Fetch issues on mount
  useEffect(() => {
    fetchIssues();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only on mount, always subscribe

  // Responsive marker sizing
  useEffect(() => {
    const updateMarkerSize = () => {
      const width = window.innerWidth;
      if (width < 640) { // Mobile
        setMarkerSize({ width: 14, height: 18 });
      } else if (width < 1024) { // Tablet
        setMarkerSize({ width: 16, height: 20 });
      } else { // Desktop
        setMarkerSize({ width: 20, height: 26 });
      }
    };

    updateMarkerSize();
    window.addEventListener('resize', updateMarkerSize);
    return () => window.removeEventListener('resize', updateMarkerSize);
  }, []);

  const handleCategoryClick = (status) => {
    navigate('/issues', { state: { filterStatus: status } });
  };

  // Sort issues by dateReported descending (newest first)
  const sortedIssues = [...issues]
    .filter(issue => issue.dateReported instanceof Date)
    .sort((a, b) => b.dateReported - a.dateReported);

  // Get the latest 5 or 6 issues
  const recentIssues = sortedIssues.slice(0, 6);

  const allIssues = issues;
  const totalIssues = allIssues.length;
  const completedIssues = getIssuesByStatus('completed').length;
  const completionRate = totalIssues > 0 ? Math.round((completedIssues / totalIssues) * 100) : 0;

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-full">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <span className="ml-4 text-muted-foreground">Loading issues...</span>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="p-4 sm:p-8 md:p-12 space-y-8 bg-background min-h-screen">
        {/* Header */}
        <div className="flex flex-col items-start items-center justify-center gap-4 mb-4">
          <h3 className="text-2xl sm:text-3xl font-bold text-gray-800">Overview of Civic Issues and System Status</h3>
        </div>

        {/* Top Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Map */}
          <div className="lg:col-span-2">
            <Card className="h-[400px] shadow-card border border-gray-200 rounded-2xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-blue-800 text-lg sm:text-xl">
                  <MapPin className="h-5 w-5" />
                  Issue Locations Map
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0 border-t border-gray-200">
                <div className="h-[320px] w-full overflow-hidden rounded-b-2xl relative">
                  <MapContainer
                    center={[22.5937, 78.9629]} // Center of India
                    zoom={5} // Suitable zoom for India
                    scrollWheelZoom={true}
                    className="h-full w-full rounded-b-2xl"
                    style={{ position: "relative", zIndex: 1 }}
                  >
                    <TileLayer
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    {allIssues.filter(issue => Array.isArray(issue.coordinates) && issue.coordinates.length === 2 && issue.coordinates[0] !== 0 && issue.coordinates[1] !== 0 && !isNaN(issue.coordinates[0]) && !isNaN(issue.coordinates[1])).map((issue) => (
                      <Marker
                        key={issue.id}
                        position={issue.coordinates}
                        eventHandlers={{
                          click: () => navigate(`/issues/${issue.id}`),
                        }}
                      >
                        <Popup>
                          <div className="p-2">
                            <strong className="block text-sm font-semibold">{issue.title}</strong>
                            <span className="block text-xs text-gray-600">{issue.location}</span>
                            <span className="block text-xs mt-1">
                              Status: <Badge variant="outline" className="text-xs">{issue.status}</Badge>
                            </span>
                          </div>
                        </Popup>
                      </Marker>
                    ))}
                  </MapContainer>
                </div>
              </CardContent>
            </Card>
          </div>
          {/* Status Cards */}
          <div className="space-y-3">
            {Object.keys(statusConfig).map((status) => {
              const config = statusConfig[status];
              const count = issues.filter(issue => (issue.status || '').toLowerCase() === status.toLowerCase()).length;
              const IconComponent = config.icon;

              return (
                <Card
                  key={status}
                  className="cursor-pointer shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-1 border border-gray-200"
                  onClick={() => handleCategoryClick(status)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`p-2 rounded-lg ${config.color}`}>
                          <IconComponent className={`h-4 w-4 ${config.textColor}`} />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-800">
                            {config.title}
                          </p>
                          <p className="text-xs text-gray-600">
                            Click to view all
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-gray-900">{count}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Bottom Section - Recent Issues */}
        <div className="w-full">
          {/* Recent Issues List */}
          <Card className="shadow-lg border border-gray-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-blue-800">
                <Calendar className="h-5 w-5" />
                Recent Issues
              </CardTitle>
              <CardDescription>
                Latest reported issues requiring attention
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentIssues.length === 0 ? (
                  <div className="text-muted-foreground text-center">No recent issues.</div>
                ) : (
                  recentIssues.map((issue) => (
                    <div
                      key={issue.id}
                      className="flex justify-between items-start p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                      onClick={() => navigate(`/issues/${issue.id}`)}
                    >
                      <div className="flex flex-col gap-1 flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-base text-gray-900 truncate">
                            {issue.title || issue.name || getIssueTypeFromToken(issue.id) || "Untitled Issue"}
                          </span>
                          <Badge variant="outline" className="ml-2">
                            {issue.status}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600 text-sm">
                          <MapPin className="h-4 w-4" />
                          <span>{issue.location || "N/A"}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600 text-sm">
                          <Calendar className="h-4 w-4" />
                          <span>
                            {issue.dateReported instanceof Date
                              ? issue.dateReported.toLocaleDateString("en-IN", {
                                  day: "2-digit",
                                  month: "2-digit",
                                  year: "2-digit",
                                })
                              : "N/A"}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}

