import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuthStore } from '@/store/auth';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar,
  Shield,
  Settings,
  Clock,
  CheckCircle
} from 'lucide-react';

export default function Profile() {
  const { user } = useAuthStore();

  if (!user) return null;

  const profileStats = [
    { label: 'Issues Managed', value: '247', icon: CheckCircle, color: 'text-success' },
    { label: 'Active Cases', value: '12', icon: Clock, color: 'text-warning' },
    { label: 'Response Time', value: '2.1 hrs', icon: Clock, color: 'text-primary' },
    { label: 'Success Rate', value: '94%', icon: CheckCircle, color: 'text-success' }
  ];

  const recentActivity = [
    { 
      action: 'Resolved pothole issue #1234', 
      time: '2 hours ago',
      type: 'resolution'
    },
    { 
      action: 'Assigned street light repair to Worker #A101', 
      time: '4 hours ago',
      type: 'assignment'
    },
    { 
      action: 'Updated status of sidewalk repair #5678', 
      time: '1 day ago',
      type: 'update'
    },
    { 
      action: 'Created new manual issue for traffic signal', 
      time: '2 days ago',
      type: 'creation'
    }
  ];

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Profile</h1>
            <p className="text-muted-foreground">Manage your account settings and view activity</p>
          </div>
          <Button variant="outline">
            <Settings className="h-4 w-4 mr-2" />
            Edit Profile
          </Button>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Profile Information */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="shadow-card">
              <CardHeader className="text-center">
                <Avatar className="h-24 w-24 mx-auto mb-4">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback className="text-2xl">{user.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <CardTitle className="text-xl">{user.name}</CardTitle>
                <CardDescription>{user.role}</CardDescription>
                <Badge variant="secondary" className="mt-2">
                  <Shield className="h-3 w-3 mr-1" />
                  Administrator
                </Badge>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3 text-sm">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span>{user.email}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>+1 (555) 123-4567</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span>City Hall, Downtown</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>Joined March 2023</span>
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="text-lg">Performance Metrics</CardTitle>
                <CardDescription>Your recent activity summary</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {profileStats.map((stat, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <stat.icon className={`h-4 w-4 ${stat.color}`} />
                      <span className="text-sm text-muted-foreground">{stat.label}</span>
                    </div>
                    <span className="text-sm font-semibold">{stat.value}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Account Details */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5 text-primary" />
                  Account Information
                </CardTitle>
                <CardDescription>
                  Your account details and access permissions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Full Name</label>
                      <p className="text-sm font-semibold mt-1">{user.name}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Email Address</label>
                      <p className="text-sm font-semibold mt-1">{user.email}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Employee ID</label>
                      <p className="text-sm font-semibold mt-1">EMP-2023-{user.id.padStart(4, '0')}</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Department</label>
                      <p className="text-sm font-semibold mt-1">Public Works</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Role</label>
                      <p className="text-sm font-semibold mt-1">{user.role}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Access Level</label>
                      <p className="text-sm font-semibold mt-1">Administrator</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-primary" />
                  Recent Activity
                </CardTitle>
                <CardDescription>
                  Your latest actions and system interactions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivity.map((activity, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 border border-border rounded-lg">
                      <div className="mt-1">
                        {activity.type === 'resolution' && (
                          <CheckCircle className="h-4 w-4 text-success" />
                        )}
                        {activity.type === 'assignment' && (
                          <User className="h-4 w-4 text-primary" />
                        )}
                        {activity.type === 'update' && (
                          <Settings className="h-4 w-4 text-warning" />
                        )}
                        {activity.type === 'creation' && (
                          <Calendar className="h-4 w-4 text-accent" />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-foreground">
                          {activity.action}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {activity.time}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Permissions */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-primary" />
                  Access Permissions
                </CardTitle>
                <CardDescription>
                  Your current system permissions and access rights
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-2 border border-border rounded">
                      <span className="text-sm">View All Issues</span>
                      <Badge variant="outline" className="text-xs">Granted</Badge>
                    </div>
                    <div className="flex items-center justify-between p-2 border border-border rounded">
                      <span className="text-sm">Assign Workers</span>
                      <Badge variant="outline" className="text-xs">Granted</Badge>
                    </div>
                    <div className="flex items-center justify-between p-2 border border-border rounded">
                      <span className="text-sm">Update Issue Status</span>
                      <Badge variant="outline" className="text-xs">Granted</Badge>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-2 border border-border rounded">
                      <span className="text-sm">View Analytics</span>
                      <Badge variant="outline" className="text-xs">Granted</Badge>
                    </div>
                    <div className="flex items-center justify-between p-2 border border-border rounded">
                      <span className="text-sm">Manage Users</span>
                      <Badge variant="outline" className="text-xs">Granted</Badge>
                    </div>
                    <div className="flex items-center justify-between p-2 border border-border rounded">
                      <span className="text-sm">System Configuration</span>
                      <Badge variant="outline" className="text-xs">Granted</Badge>
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