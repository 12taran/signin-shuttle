import { useState, FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Mail, Lock, ArrowRight } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [focusedField, setFocusedField] = useState('');
  const { login, isLoading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }
        
        .fade-in {
          animation: fadeIn 0.6s ease-out;
        }
        
        .float {
          animation: float 3s ease-in-out infinite;
        }
        
        .input-focus {
          transition: all 0.3s ease;
        }
      `}</style>

      <div className="w-full max-w-md">
        {/* Floating Avatars */}
        <div className="flex justify-center gap-3 mb-8 fade-in">
          <div className="w-12 h-12 bg-gray-100 rounded-full overflow-hidden border-2 border-gray-200 float" style={{ animationDelay: '0s' }}>
            <img 
              src="https://www.shutterstock.com/image-vector/young-smiling-man-avatar-brown-600nw-2261401207.jpg" 
              alt="Avatar 1"
              className="w-full h-full"
            />
          </div>
          <div className="w-12 h-12 bg-gray-100 rounded-full overflow-hidden border-2 border-gray-200 float" style={{ animationDelay: '0.2s' }}>
            <img 
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTnYa7WPSH4QNQHFr_SEaeOaK9Mg4zEMrBsEw&s" 
              alt="Avatar 2"
              className="w-full h-full"
            />
          </div>
          <div className="w-12 h-12 bg-gray-100 rounded-full overflow-hidden border-2 border-gray-200 float" style={{ animationDelay: '0.4s' }}>
            <img 
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT2U2akySBgSHUK-foX-9SGFmLk6zEuGYNNqw&s" 
              alt="Avatar 3"
              className="w-full h-full"
            />
          </div>
        </div>

        <Card className="shadow-sm border-gray-200 fade-in" style={{ animationDelay: '0.2s' }}>
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-semibold text-center">Welcome back</CardTitle>
            <CardDescription className="text-center">
              Sign in to your employee account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <Alert variant="destructive" className="bg-rose-50 border-rose-200">
                  <AlertDescription className="text-rose-700">{error}</AlertDescription>
                </Alert>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className={`absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 transition-colors ${
                    focusedField === 'email' ? 'text-gray-900' : 'text-gray-400'
                  }`} />
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onFocus={() => setFocusedField('email')}
                    onBlur={() => setFocusedField('')}
                    disabled={isLoading}
                    className="pl-10 bg-gray-50 border-gray-300 focus:bg-white input-focus"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className={`absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 transition-colors ${
                    focusedField === 'password' ? 'text-gray-900' : 'text-gray-400'
                  }`} />
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onFocus={() => setFocusedField('password')}
                    onBlur={() => setFocusedField('')}
                    disabled={isLoading}
                    className="pl-10 bg-gray-50 border-gray-300 focus:bg-white input-focus"
                  />
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full bg-gray-900 hover:bg-gray-800 group" 
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Signing in...
                  </>
                ) : (
                  <>
                    Sign in
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </Button>

              <div className="text-center text-sm text-muted-foreground pt-2">
                Don't have an account?{' '}
                <Link to="/register" className="text-gray-900 hover:underline font-medium">
                  Create account
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>

        <p className="text-center text-xs text-gray-500 mt-6 fade-in" style={{ animationDelay: '0.4s' }}>
          By signing in, you agree to our Terms of Service
        </p>
      </div>
    </div>
  );
};

export default Login;