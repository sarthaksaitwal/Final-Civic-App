import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, Users, BarChart3, Shield } from 'lucide-react';
import landingBg from '@/images/landingpagebg3.jpg';

export default function Landing() {
  const navigate = useNavigate();

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) element.scrollIntoView({ behavior: 'smooth' });
  };

  const features = [
    {
      icon: MapPin,
      title: 'Real-time Issue Tracking',
      subtext: 'Stay Ahead with Live Updates',
      description: 'Track and visualize civic issues across the city in real-time.',
      highlights: [
        '📍 Interactive citywide maps',
        '⚡ Instant alerts when issues arise',
        '🗂️ Filter by category & location'
      ]
    },
    {
      icon: Users,
      title: 'Citizen Engagement',
      subtext: 'Empowering Every Citizen’s Voice',
      description: 'Make it simple for residents to report problems and stay informed.',
      highlights: [
        '📝 Quick 2-step issue reporting',
        '📸 Upload photos for better clarity',
        '📢 Receive instant status notifications'
      ]
    },
    {
      icon: BarChart3,
      title: 'Analytics Dashboard',
      subtext: 'Smarter Decisions with Data',
      description: 'Access powerful insights and performance metrics for better governance.',
      highlights: [
        '📊 Generate in-depth reports',
        '📈 Track resolution progress',
        '🔍 Identify recurring civic challenges'
      ]
    },
    {
      icon: Shield,
      title: 'Secure Administration',
      subtext: 'Robust Control, Seamless Access',
      description: 'Ensure safe and role-based system management for city staff.',
      highlights: [
        '🛡️ Role-based access permissions',
        '🔑 Secure staff authentication',
        '🔒 Centralized control panel'
      ]
    }
  ];

  return (
    <div className="relative min-h-screen">
      <div
        className="bg-fixed bg-cover bg-center absolute inset-0 z-0"
        style={{ backgroundImage: `url(${landingBg})` }}
      />
      <div className="absolute inset-0 bg-black/60 z-0" />
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md shadow-md">
        <nav className="container mx-auto flex items-center justify-between px-6 py-4">
          <div className="text-2xl font-extrabold text-black cursor-default select-none">CivicTrack</div>
          <ul className="flex space-x-8 text-black font-semibold">
            <li
              className="cursor-pointer hover:text-primary hover:underline transition-colors duration-200"
              onClick={() => scrollToSection('hero')}
            >
              About Us
            </li>
            <li
              className="cursor-pointer hover:text-primary hover:underline transition-colors duration-200"
              onClick={() => scrollToSection('features')}
            >
              Features
            </li>
            <li
              className="cursor-pointer hover:text-primary hover:underline transition-colors duration-200"
              onClick={() => scrollToSection('vision')}
            >
              Our Vision
            </li>
          </ul>
          <button
            className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/80 transition"
            onClick={() => navigate('/login')}
          >
            Sign In
          </button>
        </nav>
      </header>

      {/* Hero Section */}
      <section id="hero" className="relative min-h-screen flex items-center justify-center z-10">
        <div className="relative z-10 text-center text-white px-4">
          <h1 className="text-7xl font-extrabold mb-4">CivicTrack</h1>
          <p className="text-3xl mb-8 leading-relaxed tracking-wide">Track. Manage. Resolve.</p>
          <Button
            size="lg"
            className="bg-primary text-white px-12 py-6 font-bold hover:bg-primary-dark mb-8"
            onClick={() => navigate('/login')}
          >
            Admin Login
          </Button>
          <p className="text-xl max-w-2xl mx-auto leading-relaxed tracking-wide">
            CivicTrack empowers Jharkhand's citizens and authorities to report, monitor, and resolve civic issues effortlessly. From potholes to public services, get real-time updates, actionable insights, and improve governance efficiency—all in one platform.
          </p>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="container mx-auto px-4 py-20 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-extrabold text-white mb-4">
            Powerful Tools for Municipal Management
          </h2>
          <p className="text-lg text-white max-w-2xl mx-auto leading-relaxed tracking-wide">
            Everything you need to efficiently manage civic issues and improve citizen services
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="shadow-card hover:shadow-lg transition-transform duration-300 transform hover:scale-105 rounded-lg bg-white/30 backdrop-blur-md"
            >
              <CardHeader className="text-center">
                <div className="w-12 h-12 mx-auto bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-xl font-bold text-black">{feature.title}</CardTitle>
                <p className="text-sm text-black mb-2 leading-relaxed tracking-wide">{feature.subtext}</p>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center mb-4 text-base leading-relaxed tracking-wide text-black">{feature.description}</CardDescription>
                <ul className="list-disc list-inside text-left text-sm space-y-1 leading-relaxed text-black">
                  {feature.highlights.map((highlight, i) => (
                    <li key={i}>{highlight}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Our Vision Section */}
      <section id="vision" className="bg-muted/30 py-20 border-t border-border relative z-10">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-extrabold text-white mb-6">Our Vision</h2>
          <p className="text-lg text-white max-w-4xl mx-auto leading-relaxed tracking-wide">
            We are committed to building smarter, more connected cities by streamlining government operations and empowering citizens. Our platform grows with urban needs, enabling faster response times, data-driven insights, and transparent governance. Looking ahead, we will integrate AI-powered analytics and smart city infrastructure to create sustainable, future-ready municipalities.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t border-border py-8">
        <div className="container mx-auto px-4 text-center text-black">
          <p>&copy; 2024 CivicTrack. Municipal Issue Management System.</p>
        </div>
      </footer>
    </div>
  );
}