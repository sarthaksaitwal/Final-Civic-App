import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useIssuesStore } from '@/store/issues';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { 
  BarChart3, 
  TrendingUp, 
  Calendar,
  Users,
  Clock,
  CheckCircle,
  AlertTriangle,
  Download
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const COLORS = {
  new: '#3b82f6',      // primary blue
  pending: '#f59e0b',   // warning yellow
  completed: '#10b981', // success green
  reverted: '#ef4444',  // destructive red
  manual: '#8b5cf6'     // accent purple
};

export default function Reports() {
  const { issues } = useIssuesStore();

  // Process data for charts
  const statusData = [
    { name: 'New', value: issues.filter(i => i.status === 'new').length, color: COLORS.new },
    { name: 'Pending', value: issues.filter(i => i.status === 'pending').length, color: COLORS.pending },
    { name: 'Completed', value: issues.filter(i => i.status === 'completed').length, color: COLORS.completed },
    { name: 'Reverted', value: issues.filter(i => i.status === 'reverted').length, color: COLORS.reverted },
    { name: 'Manual', value: issues.filter(i => i.status === 'manual').length, color: COLORS.manual }
  ];

  const categoryData = Object.entries(
    issues.reduce((acc, issue) => {
      acc[issue.category] = (acc[issue.category] || 0) + 1;
      return acc;
    }, {})
  ).map(([name, value]) => ({ name, value }));

  const priorityData = [
    { name: 'High', value: issues.filter(i => i.priority === 'high').length, color: COLORS.reverted },
    { name: 'Medium', value: issues.filter(i => i.priority === 'medium').length, color: COLORS.pending },
    { name: 'Low', value: issues.filter(i => i.priority === 'low').length, color: COLORS.completed }
  ];

  // Monthly trend data (mock data for demonstration)
  const monthlyData = [
    { month: 'Jan', reported: 45, resolved: 42 },
    { month: 'Feb', reported: 38, resolved: 41 },
    { month: 'Mar', reported: 52, resolved: 38 },
    { month: 'Apr', reported: 41, resolved: 49 },
    { month: 'May', reported: 35, resolved: 44 },
    { month: 'Jun', reported: 29, resolved: 33 }
  ];

  const totalIssues = issues.length;
  const completedIssues = issues.filter(i => i.status === 'completed').length;
  const completionRate = Math.round((completedIssues / totalIssues) * 100);
  const avgResponseTime = '2.3 days';

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
          <p className="font-semibold">{`${label}: ${payload[0].value}`}</p>
          <p className="text-sm text-muted-foreground">
            {((payload[0].value / totalIssues) * 100).toFixed(1)}% of total
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-3xl font-bold text-foreground">Comprehensive insights into civic issue management</h3>
            
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export PDF
            </Button>
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export CSV
            </Button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="shadow-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Issues</p>
                  <p className="text-3xl font-bold text-foreground">{totalIssues}</p>
                </div>
                <div className="p-3 bg-primary/10 rounded-full">
                  <BarChart3 className="h-6 w-6 text-primary" />
                </div>
              </div>
              <div className="mt-2">
                <Badge variant="secondary" className="text-xs">
                  All time
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Completion Rate</p>
                  <p className="text-3xl font-bold text-success">{completionRate}%</p>
                </div>
                <div className="p-3 bg-success/10 rounded-full">
                  <CheckCircle className="h-6 w-6 text-success" />
                </div>
              </div>
              <div className="mt-2">
                <Badge variant="outline" className="text-xs text-success">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +5% from last month
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Avg Response Time</p>
                  <p className="text-3xl font-bold text-warning">{avgResponseTime}</p>
                </div>
                <div className="p-3 bg-warning/10 rounded-full">
                  <Clock className="h-6 w-6 text-warning" />
                </div>
              </div>
              <div className="mt-2">
                <Badge variant="outline" className="text-xs text-success">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  15% faster
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Active Workers</p>
                  <p className="text-3xl font-bold text-accent">24</p>
                </div>
                <div className="p-3 bg-accent/10 rounded-full">
                  <Users className="h-6 w-6 text-accent" />
                </div>
              </div>
              <div className="mt-2">
                <Badge variant="secondary" className="text-xs">
                  Available now
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts Section */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Status Distribution */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-primary" />
                Issue Status Distribution
              </CardTitle>
              <CardDescription>
                Breakdown of all issues by current status
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={statusData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value, percent }) => `${name}: ${value} (${(percent * 100).toFixed(0)}%)`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {statusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Priority Distribution */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-primary" />
                Priority Distribution
              </CardTitle>
              <CardDescription>
                Issues categorized by priority level
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={priorityData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value, percent }) => `${name}: ${value} (${(percent * 100).toFixed(0)}%)`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {priorityData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Monthly Trends */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              Monthly Trends
            </CardTitle>
            <CardDescription>
              Issues reported vs resolved over time
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="reported" fill={COLORS.pending} name="Reported" />
                  <Bar dataKey="resolved" fill={COLORS.completed} name="Resolved" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Category Breakdown */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-primary" />
              Issues by Category
            </CardTitle>
            <CardDescription>
              Distribution of issues across different categories
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {categoryData.map((category, index) => {
                const percentage = Math.round((category.value / totalIssues) * 100);
                return (
                  <div key={category.name} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium">{category.name}</span>
                      <span className="text-muted-foreground">
                        {category.value} ({percentage}%)
                      </span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div 
                        className="bg-primary h-2 rounded-full transition-all duration-300" 
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}