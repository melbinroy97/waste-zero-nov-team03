import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Leaf, Mail, Lock, User, Building2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { LoadingButton } from '@/components/ui/LoadingButton';
import { alertToast } from '@/components/ui/AlertToast';
import type { UserRole } from '@/types';

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [selectedRole, setSelectedRole] = useState<UserRole>('volunteer');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const from = (location.state as { from?: { pathname: string } })?.from?.pathname || '/dashboard';

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isSignUp) {
        // Validate passwords match
        if (formData.password !== formData.confirmPassword) {
          alertToast.error({
            title: 'Passwords do not match',
            description: 'Please make sure your passwords match.',
          });
          setIsLoading(false);
          return;
        }

        if (formData.password.length < 6) {
          alertToast.error({
            title: 'Password too short',
            description: 'Password must be at least 6 characters.',
          });
          setIsLoading(false);
          return;
        }

        // Simulate signup
        await new Promise(resolve => setTimeout(resolve, 1000));
        await login(selectedRole);
        alertToast.success({
          title: 'Account created!',
          description: `Welcome to WasteZero as ${selectedRole === 'ngo' ? 'an NGO' : 'a Volunteer'}`,
        });
      } else {
        await login(selectedRole);
        alertToast.success({
          title: 'Welcome back!',
          description: `Logged in as ${selectedRole === 'ngo' ? 'NGO' : 'Volunteer'}`,
        });
      }
      
      const redirectPath = selectedRole === 'ngo' ? '/dashboard/ngo' : '/dashboard/volunteer';
      navigate(redirectPath, { replace: true });
    } catch (error) {
      alertToast.error({
        title: isSignUp ? 'Sign up failed' : 'Login failed',
        description: 'Please check your credentials and try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const toggleMode = () => {
    setIsSignUp(!isSignUp);
    setFormData({
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    });
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex lg:w-1/2 eco-gradient relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48Y2lyY2xlIGN4PSIzMCIgY3k9IjMwIiByPSIyIi8+PC9nPjwvZz48L3N2Zz4=')] opacity-30" />
        <div className="relative z-10 flex flex-col justify-center px-12 text-primary-foreground">
          <div className="flex items-center gap-3 mb-8">
            <div className="rounded-xl bg-white/20 p-3">
              <Leaf className="h-8 w-8" />
            </div>
            <span className="text-3xl font-bold">WasteZero</span>
          </div>
          <h1 className="text-4xl font-bold mb-4">
            {isSignUp ? (
              <>Start Your Journey<br />Towards Zero Waste</>
            ) : (
              <>Join the Movement<br />Towards Zero Waste</>
            )}
          </h1>
          <p className="text-lg opacity-90 max-w-md">
            Connect with volunteers and organizations making a real difference in reducing waste and protecting our environment.
          </p>
          <div className="mt-12 flex gap-8">
            <div>
              <div className="text-3xl font-bold">10K+</div>
              <div className="text-sm opacity-75">Volunteers</div>
            </div>
            <div>
              <div className="text-3xl font-bold">500+</div>
              <div className="text-sm opacity-75">NGOs</div>
            </div>
            <div>
              <div className="text-3xl font-bold">50K</div>
              <div className="text-sm opacity-75">Tons Recycled</div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Auth Form */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12 bg-background">
        <div className="w-full max-w-md space-y-8">
          {/* Mobile Logo */}
          <div className="flex lg:hidden items-center justify-center gap-2 mb-8">
            <div className="rounded-lg eco-gradient p-2">
              <Leaf className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="text-2xl font-bold text-foreground">WasteZero</span>
          </div>

          <div className="text-center lg:text-left">
            <h2 className="text-2xl font-bold text-foreground">
              {isSignUp ? 'Create your account' : 'Welcome back'}
            </h2>
            <p className="text-muted-foreground mt-1">
              {isSignUp 
                ? 'Join thousands making a difference' 
                : 'Sign in to continue to your dashboard'}
            </p>
          </div>

          {/* Role Selection */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setSelectedRole('volunteer')}
              className={`flex-1 py-3 px-4 rounded-xl border-2 text-sm font-medium transition-all flex items-center justify-center gap-2 ${
                selectedRole === 'volunteer'
                  ? 'border-primary bg-primary/5 text-primary'
                  : 'border-border bg-card text-muted-foreground hover:border-muted-foreground'
              }`}
            >
              <User className="h-4 w-4" />
              Volunteer
            </button>
            <button
              type="button"
              onClick={() => setSelectedRole('ngo')}
              className={`flex-1 py-3 px-4 rounded-xl border-2 text-sm font-medium transition-all flex items-center justify-center gap-2 ${
                selectedRole === 'ngo'
                  ? 'border-primary bg-primary/5 text-primary'
                  : 'border-border bg-card text-muted-foreground hover:border-muted-foreground'
              }`}
            >
              <Building2 className="h-4 w-4" />
              NGO
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name field - only for signup */}
            {isSignUp && (
              <div className="space-y-2">
                <Label htmlFor="name">
                  {selectedRole === 'ngo' ? 'Organization Name' : 'Full Name'}
                </Label>
                <div className="relative">
                  {selectedRole === 'ngo' ? (
                    <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  ) : (
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  )}
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    placeholder={selectedRole === 'ngo' ? 'Green Earth Foundation' : 'Alex Green'}
                    className="pl-10"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  className="pl-10"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                {!isSignUp && (
                  <a href="#" className="text-xs text-primary hover:underline">
                    Forgot password?
                  </a>
                )}
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  className="pl-10"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                />
              </div>
              {isSignUp && (
                <p className="text-xs text-muted-foreground">
                  Must be at least 6 characters
                </p>
              )}
            </div>

            {/* Confirm Password - only for signup */}
            {isSignUp && (
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    placeholder="••••••••"
                    className="pl-10"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
            )}

            <LoadingButton
              type="submit"
              className="w-full eco-gradient eco-glow"
              isLoading={isLoading}
              loadingText={isSignUp ? 'Creating account...' : 'Signing in...'}
            >
              {isSignUp ? 'Create account' : 'Sign in'}
            </LoadingButton>
          </form>

          {isSignUp && (
            <p className="text-xs text-center text-muted-foreground">
              By signing up, you agree to our{' '}
              <a href="#" className="text-primary hover:underline">Terms of Service</a>
              {' '}and{' '}
              <a href="#" className="text-primary hover:underline">Privacy Policy</a>
            </p>
          )}

          <p className="text-center text-sm text-muted-foreground">
            {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
            <button
              type="button"
              onClick={toggleMode}
              className="text-primary font-medium hover:underline"
            >
              {isSignUp ? 'Sign in' : 'Sign up'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
