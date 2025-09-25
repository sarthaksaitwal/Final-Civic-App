import { useNavigate } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  MapPin, Users, BarChart3, Shield, Smartphone, Monitor, Wrench, TrendingUp, Star,
  Facebook, Twitter, Instagram, ArrowRight, CheckCircle, AlertTriangle, Clock, Eye, Target
} from 'lucide-react';

// Animated Counter Hook
function useAnimatedCounter(target, duration = 1200) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let start = 0;
    const end = target;
    if (start === end) return;
    let totalMilSecDur = parseInt(duration);
    let incrementTime = totalMilSecDur / end;
    let timer = setInterval(() => {
      start += 1;
      setCount(start);
      if (start === end) clearInterval(timer);
    }, incrementTime);
    return () => clearInterval(timer);
  }, [target, duration]);
  return count;
}

export default function Landing() {
  const navigate = useNavigate();
  const [analyticsVisible, setAnalyticsVisible] = useState(false);
  const analyticsRef = useRef(null);

  // Animate analytics section on scroll
  useEffect(() => {
    const onScroll = () => {
      if (!analyticsRef.current) return;
      const rect = analyticsRef.current.getBoundingClientRect();
      if (rect.top < window.innerHeight - 100) setAnalyticsVisible(true);
    };
    window.addEventListener('scroll', onScroll);
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Animated counters
  const issuesResolved = useAnimatedCounter(analyticsVisible ? 1247 : 0, 1200);
  const avgResponse = analyticsVisible ? "2.3h" : "0h";
  const activeCitizens = useAnimatedCounter(analyticsVisible ? 15892 : 0, 1200);
  const satisfaction = useAnimatedCounter(analyticsVisible ? 98 : 0, 1200);

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) element.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="bg-slate-900 text-white min-h-screen font-sans">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-slate-800/90 backdrop-blur-md shadow-lg">
        <nav className="container mx-auto flex items-center justify-between px-4 py-4">
          <div className="text-2xl font-extrabold text-white cursor-default select-none tracking-tight">CivicTrack</div>
          <ul className="hidden md:flex space-x-8 text-white font-semibold">
            <li className="cursor-pointer hover:text-blue-400 hover:underline transition" onClick={() => scrollToSection('hero')}>Home</li>
            <li className="cursor-pointer hover:text-blue-400 hover:underline transition" onClick={() => scrollToSection('challenge')}>Challenge</li>
            <li className="cursor-pointer hover:text-blue-400 hover:underline transition" onClick={() => scrollToSection('how-it-works')}>How It Works</li>
            <li className="cursor-pointer hover:text-blue-400 hover:underline transition" onClick={() => scrollToSection('features')}>Features</li>
            <li className="cursor-pointer hover:text-blue-400 hover:underline transition" onClick={() => scrollToSection('contact')}>Contact</li>
          </ul>
          <Button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow-blue-500/30 transition" onClick={() => navigate('/login')}>Sign In</Button>
        </nav>
      </header>

      {/* Hero Section */}
      <section id="hero" className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-900 via-purple-900 to-green-900 px-4 pt-24">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold mb-6 bg-gradient-to-r from-blue-400 via-purple-500 to-green-400 bg-clip-text text-transparent drop-shadow-lg animate-fade-in">
            CivicTrack — Empowering Citizens. Streamlining Cities.
          </h1>
          <p className="text-lg md:text-2xl mb-8 text-slate-300 animate-fade-in">Civic issue reporting and management platform.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-full font-semibold shadow-blue-500/30 transition-all duration-200">Get Started</Button>
            <Button size="lg" variant="outline" className="border-purple-500 text-purple-400 hover:bg-purple-500 hover:text-white px-8 py-4 rounded-full font-semibold transition-all duration-200">Learn More</Button>
          </div>
          <div className="flex flex-col md:flex-row items-center justify-center gap-8 mt-12">
            <div className="w-64 h-96 bg-slate-800 rounded-2xl border-2 border-dashed border-slate-600 flex flex-col items-center justify-center shadow-lg hover:shadow-blue-500/30 transition">
              <Smartphone className="w-16 h-16 text-slate-500" />
              <span className="mt-2 text-slate-500">Phone Mockup<br /><span className="text-xs text-slate-600">(Add your screenshot here)</span></span>
            </div>
            <div className="w-96 h-64 bg-slate-800 rounded-2xl border-2 border-dashed border-slate-600 flex flex-col items-center justify-center shadow-lg hover:shadow-green-500/30 transition">
              <Monitor className="w-16 h-16 text-slate-500" />
              <span className="mt-2 text-slate-500">Laptop Mockup<br /><span className="text-xs text-slate-600">(Add your screenshot here)</span></span>
            </div>
          </div>
        </div>
      </section>

      {/* The Challenge Section */}
      <section id="challenge" className="py-16 bg-slate-800">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-10">The Challenge</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="bg-slate-700 border-slate-600 hover:bg-slate-600 transition rounded-xl shadow-md hover:shadow-red-500/30">
              <CardHeader>
                <AlertTriangle className="w-12 h-12 text-red-400 mb-4" />
                <CardTitle className="text-lg md:text-xl">Lack of streamlined reporting</CardTitle>
              </CardHeader>
            </Card>
            <Card className="bg-slate-700 border-slate-600 hover:bg-slate-600 transition rounded-xl shadow-md hover:shadow-yellow-500/30">
              <CardHeader>
                <Clock className="w-12 h-12 text-yellow-400 mb-4" />
                <CardTitle className="text-lg md:text-xl">Slow municipal response times</CardTitle>
              </CardHeader>
            </Card>
            <Card className="bg-slate-700 border-slate-600 hover:bg-slate-600 transition rounded-xl shadow-md hover:shadow-blue-500/30">
              <CardHeader>
                <Eye className="w-12 h-12 text-blue-400 mb-4" />
                <CardTitle className="text-lg md:text-xl">Limited transparency</CardTitle>
              </CardHeader>
            </Card>
            <Card className="bg-slate-700 border-slate-600 hover:bg-slate-600 transition rounded-xl shadow-md hover:shadow-green-500/30">
              <CardHeader>
                <Target className="w-12 h-12 text-green-400 mb-4" />
                <CardTitle className="text-lg md:text-xl">Difficulty tracking issues</CardTitle>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-16 bg-slate-900">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-10">How It Works</h2>
          <div className="max-w-4xl mx-auto">
            {/* Step 1 */}
            <div className="flex flex-col md:flex-row items-center mb-8 group">
              <div className="flex-1 text-center md:text-left">
                <h3 className="text-xl md:text-2xl font-semibold mb-2 group-hover:text-blue-400 transition">1. Citizen Reports Issue</h3>
                <p className="text-slate-300">Citizens easily report issues via mobile app or web platform.</p>
              </div>
              <div className="w-64 h-48 bg-slate-800 rounded-xl border-2 border-dashed border-slate-600 flex flex-col items-center justify-center mx-4 shadow hover:shadow-blue-500/30 transition">
                <Smartphone className="w-16 h-16 text-slate-500" />
                <span className="mt-2 text-xs text-slate-600">Image Placeholder</span>
              </div>
            </div>
            <ArrowRight className="w-8 h-8 text-blue-400 mx-auto my-4 animate-fade-in" />
            {/* Step 2 */}
            <div className="flex flex-col md:flex-row items-center mb-8 group">
              <div className="w-64 h-48 bg-slate-800 rounded-xl border-2 border-dashed border-slate-600 flex flex-col items-center justify-center mx-4 order-2 md:order-1 shadow hover:shadow-purple-500/30 transition">
                <BarChart3 className="w-16 h-16 text-slate-500" />
                <span className="mt-2 text-xs text-slate-600">Image Placeholder</span>
              </div>
              <div className="flex-1 text-center md:text-right order-1 md:order-2">
                <h3 className="text-xl md:text-2xl font-semibold mb-2 group-hover:text-purple-400 transition">2. Automated Routing</h3>
                <p className="text-slate-300">AI categorizes and routes issues to appropriate departments.</p>
              </div>
            </div>
            <ArrowRight className="w-8 h-8 text-purple-400 mx-auto my-4 animate-fade-in" />
            {/* Step 3 */}
            <div className="flex flex-col md:flex-row items-center mb-8 group">
              <div className="flex-1 text-center md:text-left">
                <h3 className="text-xl md:text-2xl font-semibold mb-2 group-hover:text-green-400 transition">3. Department Coordination</h3>
                <p className="text-slate-300">Departments collaborate and assign field workers.</p>
              </div>
              <div className="w-64 h-48 bg-slate-800 rounded-xl border-2 border-dashed border-slate-600 flex flex-col items-center justify-center mx-4 shadow hover:shadow-green-500/30 transition">
                <Monitor className="w-16 h-16 text-slate-500" />
                <span className="mt-2 text-xs text-slate-600">Image Placeholder</span>
              </div>
            </div>
            <ArrowRight className="w-8 h-8 text-green-400 mx-auto my-4 animate-fade-in" />
            {/* Step 4 */}
            <div className="flex flex-col md:flex-row items-center mb-8 group">
              <div className="w-64 h-48 bg-slate-800 rounded-xl border-2 border-dashed border-slate-600 flex flex-col items-center justify-center mx-4 order-2 md:order-1 shadow hover:shadow-blue-500/30 transition">
                <CheckCircle className="w-16 h-16 text-slate-500" />
                <span className="mt-2 text-xs text-slate-600">Image Placeholder</span>
              </div>
              <div className="flex-1 text-center md:text-right order-1 md:order-2">
                <h3 className="text-xl md:text-2xl font-semibold mb-2 group-hover:text-blue-400 transition">4. Issue Resolution</h3>
                <p className="text-slate-300">Field workers resolve issues on-site with real-time updates.</p>
              </div>
            </div>
            <ArrowRight className="w-8 h-8 text-blue-400 mx-auto my-4 animate-fade-in" />
            {/* Step 5 */}
            <div className="flex flex-col md:flex-row items-center group">
              <div className="flex-1 text-center md:text-left">
                <h3 className="text-xl md:text-2xl font-semibold mb-2 group-hover:text-yellow-400 transition">5. Citizen Feedback</h3>
                <p className="text-slate-300">Citizens receive notifications and can provide feedback.</p>
              </div>
              <div className="w-64 h-48 bg-slate-800 rounded-xl border-2 border-dashed border-slate-600 flex flex-col items-center justify-center mx-4 shadow hover:shadow-yellow-500/30 transition">
                <Star className="w-16 h-16 text-slate-500" />
                <span className="mt-2 text-xs text-slate-600">Image Placeholder</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 bg-slate-800">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-10">Powerful Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: <MapPin className="w-12 h-12 text-blue-400 mx-auto mb-4" />, title: "Real-time tracking", desc: "Track issues as they happen with live updates and notifications." },
              { icon: <BarChart3 className="w-12 h-12 text-purple-400 mx-auto mb-4" />, title: "AI-powered categorization", desc: "Automatically categorize and prioritize issues using AI algorithms." },
              { icon: <TrendingUp className="w-12 h-12 text-green-400 mx-auto mb-4" />, title: "Data-driven analytics", desc: "Gain insights from comprehensive data analytics and reporting." },
              { icon: <Users className="w-12 h-12 text-blue-400 mx-auto mb-4" />, title: "Multi-channel support", desc: "Support for reporting via mobile, web, and social media channels." },
              { icon: <Shield className="w-12 h-12 text-purple-400 mx-auto mb-4" />, title: "Role-based access", desc: "Secure access control based on user roles and permissions." },
              { icon: <AlertTriangle className="w-12 h-12 text-green-400 mx-auto mb-4" />, title: "Escalation system", desc: "Automated escalation of unresolved issues to higher authorities." },
            ].map((f, i) => (
              <Card key={i} className="bg-slate-700 border-slate-600 hover:bg-slate-600 transition-all duration-200 hover:scale-105 rounded-xl shadow-md hover:shadow-blue-500/30">
                <CardHeader className="text-center">{f.icon}<CardTitle>{f.title}</CardTitle></CardHeader>
                <CardContent><p className="text-slate-300">{f.desc}</p></CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* App Showcase Section */}
      <section className="py-16 bg-slate-900">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-10">App Showcase</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-64 h-96 bg-slate-800 rounded-2xl border-2 border-dashed border-slate-600 flex flex-col items-center justify-center mx-auto mb-4 shadow hover:shadow-blue-500/30 transition">
                <Smartphone className="w-16 h-16 text-slate-500" />
                <span className="mt-2 text-xs text-slate-600">Mobile App Placeholder</span>
              </div>
              <h3 className="text-xl md:text-2xl font-semibold mb-2">Mobile App</h3>
              <p className="text-slate-300">Report issues on-the-go with our intuitive mobile interface.</p>
            </div>
            <div className="text-center">
              <div className="w-80 h-64 bg-slate-800 rounded-2xl border-2 border-dashed border-slate-600 flex flex-col items-center justify-center mx-auto mb-4 shadow hover:shadow-purple-500/30 transition">
                <Monitor className="w-16 h-16 text-slate-500" />
                <span className="mt-2 text-xs text-slate-600">Web Dashboard Placeholder</span>
              </div>
              <h3 className="text-xl md:text-2xl font-semibold mb-2">Web Dashboard</h3>
              <p className="text-slate-300">Comprehensive management tools for city administrators.</p>
            </div>
            <div className="text-center">
              <div className="w-64 h-96 bg-slate-800 rounded-2xl border-2 border-dashed border-slate-600 flex flex-col items-center justify-center mx-auto mb-4 shadow hover:shadow-green-500/30 transition">
                <Wrench className="w-16 h-16 text-slate-500" />
                <span className="mt-2 text-xs text-slate-600">Field Worker App Placeholder</span>
              </div>
              <h3 className="text-xl md:text-2xl font-semibold mb-2">Field Worker App</h3>
              <p className="text-slate-300">Equipped tools for efficient on-site issue resolution.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Real-time Analytics Section */}
      <section ref={analyticsRef} className="py-16 bg-slate-800">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-10">Real-time Analytics</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="bg-slate-700 border-slate-600 rounded-xl text-center shadow-lg hover:shadow-blue-500/30 transition">
              <CardContent className="pt-6">
                <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                  <TrendingUp className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-2">{issuesResolved.toLocaleString()}</h3>
                <p className="text-slate-300">Issues Resolved</p>
                <div className="mt-4 w-full h-8 bg-slate-800 rounded-lg flex items-center justify-center text-slate-600 text-xs animate-fade-in">[Graph Placeholder]</div>
              </CardContent>
            </Card>
            <Card className="bg-slate-700 border-slate-600 rounded-xl text-center shadow-lg hover:shadow-purple-500/30 transition">
              <CardContent className="pt-6">
                <div className="w-20 h-20 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                  <Clock className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-2">{avgResponse}</h3>
                <p className="text-slate-300">Avg Response Time</p>
                <div className="mt-4 w-full h-8 bg-slate-800 rounded-lg flex items-center justify-center text-slate-600 text-xs animate-fade-in">[Graph Placeholder]</div>
              </CardContent>
            </Card>
            <Card className="bg-slate-700 border-slate-600 rounded-xl text-center shadow-lg hover:shadow-green-500/30 transition">
              <CardContent className="pt-6">
                <div className="w-20 h-20 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                  <Users className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-2">{activeCitizens.toLocaleString()}</h3>
                <p className="text-slate-300">Active Citizens</p>
                <div className="mt-4 w-full h-8 bg-slate-800 rounded-lg flex items-center justify-center text-slate-600 text-xs animate-fade-in">[Graph Placeholder]</div>
              </CardContent>
            </Card>
            <Card className="bg-slate-700 border-slate-600 rounded-xl text-center shadow-lg hover:shadow-red-500/30 transition">
              <CardContent className="pt-6">
                <div className="w-20 h-20 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                  <AlertTriangle className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-2">{satisfaction}%</h3>
                <p className="text-slate-300">Satisfaction Rate</p>
                <div className="mt-4 w-full h-8 bg-slate-800 rounded-lg flex items-center justify-center text-slate-600 text-xs animate-fade-in">[Graph Placeholder]</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 bg-slate-900">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-10">What Our Users Say</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { name: "Sarah Johnson", role: "City Manager, Springfield", quote: "CivicTrack has transformed how we handle city issues. Response times are down, and citizen satisfaction is up!" },
              { name: "Mike Chen", role: "Resident, Metro City", quote: "As a citizen, I love being able to track my reported issues in real-time. It's empowering!" },
              { name: "Dr. Emily Rodriguez", role: "Urban Planner, Techville", quote: "The analytics dashboard gives us insights we never had before. Game-changer for urban management." },
            ].map((t, i) => (
              <Card key={i} className="bg-slate-800 border-slate-700 rounded-xl shadow hover:shadow-blue-500/30 transition">
                <CardContent className="pt-6">
                  <div className="flex mb-4">
                    <div className="w-12 h-12 bg-slate-700 rounded-full flex items-center justify-center mr-3">
                      <Users className="w-6 h-6 text-slate-500" />
                    </div>
                    {[...Array(5)].map((_, i) => <Star key={i} className="w-5 h-5 text-yellow-400 fill-current animate-fade-in" />)}
                  </div>
                  <p className="text-slate-300 mb-4">"{t.quote}"</p>
                  <p className="font-semibold">{t.name}</p>
                  <p className="text-slate-400 text-sm">{t.role}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Vision Section */}
      <section id="vision" className="py-16 bg-slate-800">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-10">Our Vision</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <Users className="w-16 h-16 text-blue-400 mx-auto mb-4" />
              <h3 className="text-xl md:text-2xl font-semibold mb-2">Empower Citizens</h3>
              <p className="text-slate-300">Give every resident a voice in shaping their city's future.</p>
            </div>
            <div>
              <BarChart3 className="w-16 h-16 text-purple-400 mx-auto mb-4" />
              <h3 className="text-xl md:text-2xl font-semibold mb-2">Smarter Governance</h3>
              <p className="text-slate-300">Leverage data and technology for efficient municipal operations.</p>
            </div>
            <div>
              <Target className="w-16 h-16 text-green-400 mx-auto mb-4" />
              <h3 className="text-xl md:text-2xl font-semibold mb-2">Stronger Communities</h3>
              <p className="text-slate-300">Build connected, responsive, and sustainable urban environments.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 border-t border-slate-800 py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-2xl font-bold mb-4">CivicTrack</h3>
              <p className="text-slate-400">Empowering citizens, streamlining cities.</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Navigation</h4>
              <ul className="space-y-2 text-slate-400">
                <li><a href="#" className="hover:text-white transition">Home</a></li>
                <li><a href="#" className="hover:text-white transition">Features</a></li>
                <li><a href="#" className="hover:text-white transition">About</a></li>
                <li><a href="#" className="hover:text-white transition">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-slate-400">
                <li><a href="#" className="hover:text-white transition">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition">Documentation</a></li>
                <li><a href="#" className="hover:text-white transition">API</a></li>
                <li><a href="#" className="hover:text-white transition">Status</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Connect</h4>
              <div className="flex space-x-4">
                <Facebook className="w-6 h-6 text-slate-400 hover:text-blue-400 cursor-pointer transition" />
                <Twitter className="w-6 h-6 text-slate-400 hover:text-blue-400 cursor-pointer transition" />
                <Instagram className="w-6 h-6 text-slate-400 hover:text-purple-400 cursor-pointer transition" />
              </div>
            </div>
          </div>
          <div className="border-t border-slate-800 mt-8 pt-8 text-center text-slate-400">
            <p>&copy; 2024 CivicTrack. All rights reserved.</p>
          </div>
        </div>
      </footer>
      {/* Animations */}
      <style>{`
        .animate-fade-in { animation: fadeIn 1s ease; }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        .animate-bounce { animation: bounce 1.2s infinite; }
        @keyframes bounce { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
        .animate-pulse { animation: pulse 1.5s infinite; }
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.6; } }
        .animate-spin-slow { animation: spin 2.5s linear infinite; }
        @keyframes spin { 100% { transform: rotate(360deg); } }
        .animate-shake { animation: shake 0.8s infinite; }
        @keyframes shake { 0%, 100% { transform: translateX(0); } 25% { transform: translateX(-4px); } 75% { transform: translateX(4px); } }
      `}</style>
    </div>
  );
}
