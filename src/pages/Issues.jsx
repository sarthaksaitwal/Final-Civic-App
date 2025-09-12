import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useIssuesStore } from '@/store/issues';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import {
  Search,
  Filter,
  Calendar,
  MapPin,
  Clock,
  AlertTriangle,
  List,
  Map
} from 'lucide-react';

export default function Issues() {
  const location = useLocation();
  const navigate = useNavigate();
  const { issues, fetchIssues } = useIssuesStore();
  
  const [filteredIssues, setFilteredIssues] = useState(issues);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');

  // Get initial filter from navigation state
  useEffect(() => {
    const filterStatus = location.state?.filterStatus;
    if (filterStatus) {
      setStatusFilter(filterStatus);
    }
  }, [location.state]);

  // Fetch issues on component mount
  useEffect(() => {
    fetchIssues();
  }, [fetchIssues]);

  // Apply filters
  useEffect(() => {
    let filtered = issues;

    if (searchTerm) {
      filtered = filtered.filter(issue =>
        (issue.title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (issue.description || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (issue.location || '').toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(issue => issue.status === statusFilter);
    }

    if (categoryFilter !== 'all') {
      filtered = filtered.filter(issue => issue.category === categoryFilter);
    }

    if (priorityFilter !== 'all') {
      filtered = filtered.filter(issue => issue.priority === priorityFilter);
    }

    setFilteredIssues(filtered);
  }, [issues, searchTerm, statusFilter, categoryFilter, priorityFilter]);

  // Sort issues by dateReported descending (newest first)
  const sortedIssues = [...filteredIssues].sort((a, b) => {
    if (!a.dateReported || !b.dateReported) return 0;
    return b.dateReported - a.dateReported;
  });

  const categories = [...new Set(issues.map(issue => issue.category))];

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
    if (!deadline) return 'No deadline';
    const now = new Date();
    const diffTime = deadline.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) {
      return `${Math.abs(diffDays)} days overdue`;
    } else if (diffDays === 0) {
      return 'Due today';
    } else if (diffDays === 1) {
      return 'Due tomorrow';
    } else {
      return `${diffDays} days remaining`;
    }
  };

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-3xl font-bold text-foreground">Manage and track all civic issues</h3>

            {/* <h3 className="text-muted-foreground">
              {statusFilter !== 'all' 
                ? `Showing ${statusFilter} issues (${filteredIssues.length})` 
                : `Manage and track all civic issues (${filteredIssues.length} total)`
              }
            </h3> */}
          </div>
          <Button onClick={() => navigate('/dashboard')}>
            Back to Dashboard
          </Button>
        </div>

        {/* Filters */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5 text-primary" />
              Filters
            </CardTitle>
            <CardDescription>
              Search and filter issues by various criteria
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search issues..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All Statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="new">New</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="reverted">Reverted</SelectItem>
                  <SelectItem value="manual">Review & Approve</SelectItem>
                </SelectContent>
              </Select>

              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map(category => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All Priorities" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Priorities</SelectItem>
                  <SelectItem value="high">High Priority</SelectItem>
                  <SelectItem value="medium">Medium Priority</SelectItem>
                  <SelectItem value="low">Low Priority</SelectItem>
                </SelectContent>
              </Select>

              <Button 
                variant="outline" 
                onClick={() => {
                  setSearchTerm('');
                  setStatusFilter('all');
                  setCategoryFilter('all');
                  setPriorityFilter('all');
                }}
              >
                Clear Filters
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Issues View */}
        <Tabs defaultValue="list" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="list" className="flex items-center gap-2">
              <List className="h-4 w-4" />
              List View
            </TabsTrigger>
            <TabsTrigger value="map" className="flex items-center gap-2">
              <Map className="h-4 w-4" />
              Map View
            </TabsTrigger>
          </TabsList>

          <TabsContent value="list" className="mt-6">
            <div className="grid gap-4">
              {filteredIssues.length === 0 ? (
                <Card className="shadow-card">
                  <CardContent className="text-center py-8">
                    <div className="text-muted-foreground">
                      <AlertTriangle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p className="text-lg font-medium">No issues found</p>
                      <p>Try adjusting your filters or search terms.</p>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                sortedIssues.map((issue) => (
                  <Card
                    key={issue.id}
                    className="shadow-card hover:shadow-hover transition-all duration-200 cursor-pointer"
                    onClick={() => navigate(`/issues/${issue.id}`)}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 space-y-3">
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="text-lg font-semibold text-foreground">
                                {issue.title || 'Untitled Issue'}
                              </h3>
                              <p className="text-sm text-muted-foreground">
                                Issue #{issue.id}
                              </p>
                            </div>
                            <Badge variant={getStatusBadgeVariant(issue.status)}>
                              {issue.status}
                            </Badge>
                          </div>

                          <p className="text-muted-foreground">
                            {issue.description || 'No description provided'}
                          </p>

                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <MapPin className="h-4 w-4" />
                              {issue.location || 'N/A'}
                            </div>
                            {issue.dateReported && (
                              <div className="flex items-center gap-1">
                                <Calendar className="h-4 w-4" />
                                Reported: {issue.dateReported.toLocaleDateString()}
                              </div>
                            )}
                            {issue.deadline && (
                              <div className="flex items-center gap-1">
                                <Clock className="h-4 w-4" />
                                {formatDeadline(issue.deadline)}
                              </div>
                            )}
                          </div>

                          <div className="flex items-center gap-2">
                            {issue.category && (
                              <Badge variant="outline">{issue.category}</Badge>
                            )}
                            {issue.priority && (
                              <Badge variant={getPriorityBadgeVariant(issue.priority)}>
                                {issue.priority} priority
                              </Badge>
                            )}
                            {issue.assignedTo && (
                              <Badge variant="secondary">
                                Assigned to: {issue.assignedTo}
                              </Badge>
                            )}
                          </div>
                        </div>

                        {issue.photos && issue.photos.length > 0 && (
                          <div className="ml-4">
                            <img
                              src={issue.photos[0]}
                              alt={issue.title}
                              className="w-20 h-20 object-cover rounded-lg border border-border"
                            />
                          </div>
                        )}
                        {issue.audio && issue.audio.length > 0 && (
                          <div className="mt-2">
                            {issue.audio.map((audioUrl, index) => (
                              <audio key={index} controls className="w-full">
                                <source src={audioUrl} type="audio/mpeg" />
                                Your browser does not support the audio element.
                              </audio>
                            ))}
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          <TabsContent value="map" className="mt-6">
            <Card className="shadow-card">
              <CardContent className="p-0">
                <div className="h-96 w-full">
                  <MapContainer
                    center={[40.7128, -74.0060]}
                    zoom={10}
                    style={{ height: '100%', width: '100%' }}
                  >
                    <TileLayer
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    {filteredIssues.map((issue) => (
                      <Marker
                        key={issue.id}
                        position={
                          issue.coordinates && issue.coordinates.length === 2
                            ? issue.coordinates
                            : [0, 0]
                        }
                        eventHandlers={{
                          click: () => navigate(`/issues/${issue.id}`),
                        }}
                      >
                        <Popup>
                          <div className="p-2">
                            <h3 className="font-semibold">{issue.title || 'Untitled Issue'}</h3>
                            <p className="text-sm text-muted-foreground">
                              {issue.location || 'N/A'}
                            </p>
                          </div>
                        </Popup>
                      </Marker>
                    ))}
                  </MapContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
