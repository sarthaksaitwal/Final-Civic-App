import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useIssuesStore } from '@/store/issues';
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
    title: 'Manual Issues',
    icon: Settings,
    color: 'bg-accent',
    textColor: 'text-accent-foreground'
  }
};

export default function Dashboard() {
  const { issues, getIssuesByStatus } = useIssuesStore();
  const navigate = useNavigate();

  const handleCategoryClick = (status) => {
    navigate('/issues', { state: { filterStatus: status } });
  };

  const recentIssues = issues.slice(0, 5);
  const totalIssues = issues.length;
  const completedIssues = getIssuesByStatus('completed').length;
  const completionRate = Math.round((completedIssues / totalIssues) * 100);

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
            <p className="text-muted-foreground">Overview of civic issues and system status</p>
          </div>
          <Badge variant="secondary" className="text-sm">
            Last updated: {new Date().toLocaleTimeString()}
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
                <CardDescription>
                  Real-time view of reported issues across the city
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <div className="h-[320px] rounded-b-lg overflow-hidden bg-muted/20 flex items-center justify-center relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-accent/5 to-primary/10" />
                  <div className="text-center z-10">
                    <MapPin className="h-12 w-12 text-primary mx-auto mb-4" />
                    <p className="text-lg font-semibold text-foreground mb-2">Interactive Map</p>
                    <p className="text-sm text-muted-foreground mb-4">
                      Real-time issue locations across the city
                    </p>
                    <div className="flex flex-wrap gap-2 justify-center">
                      {issues.slice(0, 6).map((issue) => (
                        <div key={issue.id} className="flex items-center gap-1 text-xs bg-card/80 px-2 py-1 rounded">
                          <div className={`h-2 w-2 rounded-full ${
                            issue.status === 'completed' ? 'bg-success' :
                            issue.status === 'pending' ? 'bg-warning' :
                            issue.status === 'new' ? 'bg-primary' :
                            'bg-destructive'
                          }`} />
                          <span className="text-muted-foreground">{issue.location.address.split(',')[0]}</span>
                        </div>
                      ))}
                    </div>
                  </div>
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
                        <p className="text-sm text-muted-foreground">{issue.location.address}</p>
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