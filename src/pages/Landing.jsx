import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Users, BarChart3, Shield } from 'lucide-react';

export default function Landing() {
  const navigate = useNavigate();

  const features = [
    {
      icon: MapPin,
      title: 'Real-time Issue Tracking',
      description: 'Interactive maps showing live issue locations across the city'
    },
    {
      icon: Users,
      title: 'Citizen Engagement',
      description: 'Easy reporting system for citizens to submit civic issues'
    },
    {
      icon: BarChart3,
      title: 'Analytics Dashboard',
      description: 'Comprehensive reports and analytics for informed decision making'
    },
    {
      icon: Shield,
      title: 'Secure Administration',
      description: 'Role-based access control for municipal staff and administrators'
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <nav className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
              <MapPin className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">CivicTracker</span>
          </div>
          <Button variant="outline" onClick={() => navigate('/login')}>
            Sign In
          </Button>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center max-w-4xl mx-auto">
          <Badge variant="secondary" className="mb-6">
            Municipal Issue Management System
          </Badge>
          <h1 className="text-5xl font-bold text-foreground mb-6 leading-tight">
            Streamline Civic Issue
            <span className="gradient-primary bg-clip-text text-transparent block">
              Resolution & Tracking
            </span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Efficiently manage and track civic issues from report to resolution. 
            Real-time dashboards, interactive maps, and comprehensive analytics 
            for modern municipal administration.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              onClick={() => navigate('/login')}
              className="text-lg px-8 py-6"
            >
              Access Dashboard
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              className="text-lg px-8 py-6"
            >
              Learn More
            </Button>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Powerful Tools for Municipal Management
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Everything you need to efficiently manage civic issues and improve citizen services
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <Card key={index} className="shadow-card hover:shadow-hover transition-all duration-300">
              <CardHeader className="text-center">
                <div className="w-12 h-12 mx-auto bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-lg">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-muted/50 py-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-primary mb-2">2,847</div>
              <div className="text-muted-foreground">Issues Resolved</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-success mb-2">94%</div>
              <div className="text-muted-foreground">Resolution Rate</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-accent mb-2">48hrs</div>
              <div className="text-muted-foreground">Avg Response Time</div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t border-border py-8">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>&copy; 2024 CivicTracker. Municipal Issue Management System.</p>
        </div>
      </footer>
    </div>
  );
}