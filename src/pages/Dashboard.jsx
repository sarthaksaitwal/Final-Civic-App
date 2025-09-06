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
  Clock,
  CheckCircle,
  RotateCcw,
  Settings,
  MapPin,
  Calendar,
  TrendingUp
} from 'lucide-react';

const statusConfig = {
  new: {
    title: 'New Issues',
    icon: FileX,
    color: 'bg-primary',
    textColor: 'text-primary-foreground'
  },
  pending: {
    title: 'Pending Issues',
    icon: Clock,
    color: 'bg-warning',
    textColor: 'text-warning-foreground'
  },
  completed: {
    title: 'Completed Issues',
    icon: CheckCircle,
    color: 'bg-success',
    textColor: 'text-success-foreground'
  },
  reverted: {
    title: 'Reverted Issues',
    icon: RotateCcw,
    color: 'bg-destructive',
    textColor: 'text-destructive-foreground'
  },
  manual: {
    title: 'Review & Approve',
    icon: Settings,
    color: 'bg-accent',
    textColor: 'text-accent-foreground'
  }
};

export default function Dashboard() {

  const { issues, getIssuesByStatus, fetchIssues, loading } = useIssuesStore();
  const navigate = useNavigate();
  const [markerSize, setMarkerSize] = useState({ width: 20, height: 26 });

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

  // Show all issues, no location filter
  const allIssues = issues;
  const recentIssues = allIssues.slice(0, 5);
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
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-3xl font-bold text-foreground">Overview of civic issues and system status</h3>
         
          </div>
          <Badge variant="secondary" className="text-sm">
            {/* {new Date().toLocaleString()} */}
          </Badge>
        </div>

        {/* Top Section */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Map */}
          <div className="lg:col-span-2">
            <Card className="h-[400px] shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-primary" />
                  Issue Locations Map
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0 border-t border-border">
                <div className="h-[320px] w-full overflow-hidden rounded-b-lg">
                  <MapContainer
                    center={[23.3441, 85.3096]}
                    zoom={8}
                    scrollWheelZoom={true}
                    className="h-full w-full rounded-b-lg"
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
              const count = getIssuesByStatus(status).length;
              const IconComponent = config.icon;

              return (
                <Card
                  key={status}
                  className="cursor-pointer shadow-card hover:shadow-hover transition-all duration-200 transform hover:-translate-y-1"
                  onClick={() => handleCategoryClick(status)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`p-2 rounded-lg ${config.color}`}>
                          <IconComponent className={`h-4 w-4 ${config.textColor}`} />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-foreground">
                            {config.title}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Click to view all
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-foreground">{count}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Bottom Section - Recent Issues */}
        <div className="grid lg:grid-cols-4 gap-6">
          {/* Recent Issues List */}
          <div className="lg:col-span-3">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-primary" />
                  Recent Issues
                </CardTitle>
                <CardDescription>
                  Latest reported issues requiring attention
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentIssues.map((issue) => (
                    <div
                      key={issue.id}
                      className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
                      onClick={() => navigate(`/issues/${issue.id}`)}
                    >
                      <div className="flex-1">
                        <h4 className="font-medium text-foreground">{issue.title}</h4>
                        <p className="text-sm text-muted-foreground">{issue.location}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge variant="outline">{issue.category}</Badge>
                          <Badge
                            variant={issue.priority === 'high' ? 'destructive' :
                                   issue.priority === 'medium' ? 'default' : 'secondary'}
                          >
                            {issue.priority} priority
                          </Badge>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge variant="secondary">{issue.status}</Badge>
                        <p className="text-xs text-muted-foreground mt-1">
                          {issue.dateReported.toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Stats */}
          <div className="space-y-4">
            <Card className="shadow-card">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-success" />
                  Quick Stats
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm text-muted-foreground">Total Issues</span>
                      <span className="text-sm font-semibold">{totalIssues}</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div className="bg-primary h-2 rounded-full" style={{ width: '100%' }}></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm text-muted-foreground">Completed</span>
                      <span className="text-sm font-semibold">{completedIssues}</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div className="bg-success h-2 rounded-full" style={{ width: `${completionRate}%` }}></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm text-muted-foreground">Success Rate</span>
                      <span className="text-sm font-semibold text-success">{completionRate}%</span>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm text-muted-foreground">Avg Response</span>
                      <span className="text-sm font-semibold">2.3 days</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
