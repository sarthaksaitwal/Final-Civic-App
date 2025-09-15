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
import 'leaflet/dist/leaflet.css';
import {
  Search,
  Filter,
  Calendar,
  MapPin,
  Clock,
  AlertTriangle,
  List,
  Map,
  Tag,
  Trash2,
  Droplet,
  Lightbulb,
  RotateCcw,
  Settings
} from 'lucide-react';

export default function Issues() {
  const location = useLocation();
  const navigate = useNavigate();
  const { issues, fetchIssues } = useIssuesStore();

  const [filteredIssues, setFilteredIssues] = useState(issues);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');

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
      filtered = filtered.filter(
        issue => (issue.status || '').toLowerCase() === statusFilter.toLowerCase()
      );
    }

    if (categoryFilter !== 'all') {
      filtered = filtered.filter(issue => issue.category === categoryFilter);
    }

    setFilteredIssues(filtered);
  }, [issues, searchTerm, statusFilter, categoryFilter]);

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

  // Helper to get issue type from token
  const ISSUE_TYPE_MAP = {
    RDG: "Road Damage",
    DRN: "Drainage & Sewage",
    WTR: "Water",
    GBG: "Garbage",
    SLT: "StreetLight",
  };

  const getIssueTypeFromToken = (id) => {
    if (!id) return "Unknown";
    const prefix = id.split("-")[0];
    return ISSUE_TYPE_MAP[prefix] || "Unknown";
  };

  const CATEGORY_ICON = {
    "Garbage": Trash2,
    "Water": Droplet,
    "StreetLight": Lightbulb,
    "Drainage & Sewage": RotateCcw,
    "Road Damage": Settings,
  };

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-center">
          <div>
            <h3 className="text-3xl font-bold text-foreground">Manage and track all civic issues</h3>
          </div>
        </div>

        {/* Filters */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-primary" />
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
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="Assigned">Assigned</SelectItem>
                  <SelectItem value="In Progress">In Progress</SelectItem>
                  <SelectItem value="Resolved">Resolved</SelectItem>
                  <SelectItem value="Review & Approve">Review & Approve</SelectItem>
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

              <Button 
                variant="outline" 
                onClick={() => {
                  setSearchTerm('');
                  setStatusFilter('all');
                  setCategoryFilter('all');
                }}
              >
                Clear Filters
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Issues List */}
        <div className="grid gap-4 mt-6">
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
                            {issue.title || getIssueTypeFromToken(issue.id) || 'Untitled Issue'}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            #{issue.id}
                          </p>
                        </div>
                        <Badge variant={getStatusBadgeVariant(issue.status)}>
                          {issue.status}
                        </Badge>
                      </div>

                      {/* <p className="text-muted-foreground">
                        {issue.description || 'No description provided'}
                      </p> */}

                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          {issue.location || 'N/A'}
                        </div>
                        {issue.dateReported && (
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            Reported: {issue.dateReported.toLocaleDateString("en-IN", { day: "2-digit", month: "2-digit", year: "2-digit" })}
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
                        {/* {issue.category && (
                          <Badge variant="outline">{issue.category}</Badge>
                        )} */}
                        {issue.priority && (
                          <Badge variant={getPriorityBadgeVariant(issue.priority)}>
                            {issue.priority} priority
                          </Badge>
                        )}
                        {/* {issue.assignedTo && (
                          <Badge variant="secondary">
                            Assigned to: {typeof issue.assignedTo === "object" ? issue.assignedTo.name : issue.assignedTo}
                          </Badge>
                        )} */}
                      </div>
                    </div>

                    {/* {issue.photos && issue.photos.length > 0 && (
                      <div className="ml-4">
                        <img
                          src={issue.photos[0]}
                          alt={issue.title}
                          className="w-20 h-20 object-cover rounded-lg border border-border"
                        />
                      </div>
                    )} */}
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
      </div>
    </DashboardLayout>
  );
}
