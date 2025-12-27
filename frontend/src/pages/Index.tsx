import { useNavigate } from 'react-router-dom';
import { Leaf, ArrowRight, Recycle, Users, TreePine } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-card/80 backdrop-blur-sm">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="rounded-lg eco-gradient p-2">
              <Leaf className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">WasteZero</span>
          </div>
          <Button onClick={() => navigate('/login')} className="eco-gradient eco-glow">
            Get Started
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 overflow-hidden">
        <div className="absolute inset-0 eco-gradient opacity-5" />
        <div className="container relative z-10 text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary mb-6">
            <Recycle className="h-4 w-4" />
            Join 10,000+ eco-warriors today
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight">
            Together, We Can{' '}
            <span className="">
              Eliminate Waste
            </span>
          </h1>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Connect volunteers with environmental organizations to make a real impact. 
            Track your contributions, join recycling drives, and help build a sustainable future.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              onClick={() => navigate('/login')}
              className="eco-gradient eco-glow text-lg px-8"
            >
              Start Volunteering
              <ArrowRight className="h-5 w-5 ml-2" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => navigate('/login')}
              className="text-lg px-8"
            >
              I'm an NGO
            </Button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-muted/30">
        <div className="container">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { value: '50K+', label: 'Tons Recycled', icon: Recycle },
              { value: '10K+', label: 'Active Volunteers', icon: Users },
              { value: '500+', label: 'Partner NGOs', icon: TreePine },
              { value: '1.2M', label: 'CO₂ Saved (kg)', icon: Leaf },
            ].map((stat) => (
              <div
                key={stat.label}
                className="rounded-2xl border border-border bg-card p-6 text-center card-shadow hover:card-shadow-hover transition-shadow"
              >
                <div className="inline-flex rounded-xl bg-primary/10 p-3 mb-4">
                  <stat.icon className="h-6 w-6 text-primary" />
                </div>
                <div className="text-3xl font-bold text-foreground mb-1">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">How It Works</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Whether you're a volunteer or an organization, WasteZero makes it easy to make a difference.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                title: 'Create Your Profile',
                description: 'Sign up as a volunteer or NGO and tell us about your skills and mission.',
              },
              {
                step: '02',
                title: 'Connect & Collaborate',
                description: 'Browse opportunities, apply to events, or create drives for your organization.',
              },
              {
                step: '03',
                title: 'Track Your Impact',
                description: 'See your real-time metrics: pickups completed, items recycled, CO₂ saved.',
              },
            ].map((feature) => (
              <div
                key={feature.step}
                className="rounded-2xl border border-border bg-card p-8 card-shadow hover:card-shadow-hover transition-all group"
              >
                <div className="text-4xl font-bold bg-clip-text text-transparent eco-gradient mb-4">
                  {feature.step}
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 eco-gradient relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48Y2lyY2xlIGN4PSIzMCIgY3k9IjMwIiByPSIyIi8+PC9nPjwvZz48L3N2Zz4=')] opacity-30" />
        <div className="container relative z-10 text-center">
          <h2 className="text-3xl font-bold text-primary-foreground mb-4">
            Ready to Make a Difference?
          </h2>
          <p className="text-primary-foreground/80 mb-8 max-w-xl mx-auto">
            Join thousands of volunteers and organizations working together for a cleaner planet.
          </p>
          <Button
            size="lg"
            onClick={() => navigate('/login')}
            className="bg-white text-primary hover:bg-white/90 text-lg px-8"
          >
            Get Started Today
            <ArrowRight className="h-5 w-5 ml-2" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-border">
        <div className="container flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Leaf className="h-5 w-5 text-primary" />
            <span className="font-semibold text-foreground">WasteZero</span>
          </div>
          <p className="text-sm text-muted-foreground">
            © 2024 WasteZero. Making the world cleaner, one pickup at a time.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
