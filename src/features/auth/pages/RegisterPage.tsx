import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { GoogleLogin, type CredentialResponse } from '@react-oauth/google';
import { api } from '../../../services/api';
import { useAuthStore } from '../store/authStore';
import { useToast } from '../../../shared/hooks/useToast';
import { Button } from '../../../shared/ui/Button';
import { Input } from '../../../shared/ui/Input';
import { Card } from '../../../shared/ui/Card';
import { AuthBackground } from '../../../shared/ui/AuthBackground';

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string(),
  role: z.enum(['student', 'teacher']).refine((val) => val !== undefined, {
    message: 'Please select your role',
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

type RegisterForm = z.infer<typeof registerSchema>;

export const RegisterPage = () => {
  const navigate = useNavigate();
  const setUser = useAuthStore((state) => state.setUser);
  const toast = useToast();
  const [selectedRole, setSelectedRole] = useState<'student' | 'teacher' | null>(null);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [googleUserData, setGoogleUserData] = useState<{ name: string; email: string } | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterForm) => {
    try {
      const user = await api.auth.register(data);
      setUser(user);
      toast.success('Registration successful!');
      
      // Redirect based on user role
      if (user.role === 'teacher') {
        navigate('/teacher/dashboard');
      } else if (user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    } catch {
      toast.error('Registration failed. Please try again.');
    }
  };

  const handleGoogleSuccess = async (credentialResponse: CredentialResponse) => {
    try {
      const credential = credentialResponse.credential;
      if (!credential) {
        toast.error('Google signup failed. Please try again.');
        return;
      }

      // Parse JWT token
      const base64Url = credential.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      const payload = JSON.parse(jsonPayload);

      // Store Google user data and show role selection modal
      setGoogleUserData({ name: payload.name, email: payload.email });
      setShowRoleModal(true);
    } catch (error) {
      console.error('Google signup error:', error);
      toast.error('Google signup failed. Please try again.');
    }
  };

  const handleRoleSelection = async (role: 'student' | 'teacher') => {
    if (!googleUserData) return;

    try {
      // Register with Google info and selected role
      const user = await api.auth.register({
        name: googleUserData.name,
        email: googleUserData.email,
        password: 'google-oauth',
        role: role,
      });
      
      setUser(user);
      toast.success(`Welcome, ${googleUserData.name}!`);
      
      // Redirect based on selected role
      if (role === 'teacher') {
        navigate('/teacher/dashboard');
      } else {
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Registration error:', error);
      toast.error('Registration failed. Please try again.');
      setShowRoleModal(false);
      setGoogleUserData(null);
    }
  };

  const handleGoogleError = () => {
    toast.error('Google signup failed. Please try again.');
  };

  return (
    <>
      {/* Role Selection Modal for Google Signup */}
      {showRoleModal && googleUserData && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg p-6 max-w-md w-full"
          >
            <h2 className="text-2xl font-bold text-primary mb-2">Select Your Role</h2>
            <p className="text-gray-600 mb-6">
              Welcome, {googleUserData.name}! Please choose how you'd like to use Apti!Q
            </p>

            <div className="grid grid-cols-2 gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleRoleSelection('student')}
                className="p-6 rounded-lg border-2 border-gray-200 hover:border-secondary hover:bg-secondary/10 transition-all"
              >
                <div className="text-center">
                  <div className="text-5xl mb-3">🎓</div>
                  <p className="font-bold text-primary text-lg">Student</p>
                  <p className="text-sm text-gray-600 mt-2">Learn & compete in aptitude tests</p>
                </div>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleRoleSelection('teacher')}
                className="p-6 rounded-lg border-2 border-gray-200 hover:border-secondary hover:bg-secondary/10 transition-all"
              >
                <div className="text-center">
                  <div className="text-5xl mb-3">👨‍🏫</div>
                  <p className="font-bold text-primary text-lg">Teacher</p>
                  <p className="text-sm text-gray-600 mt-2">Create & manage classes</p>
                </div>
              </motion.button>
            </div>

            <button
              onClick={() => {
                setShowRoleModal(false);
                setGoogleUserData(null);
              }}
              className="mt-4 w-full text-center text-sm text-gray-500 hover:text-gray-700"
            >
              Cancel
            </button>
          </motion.div>
        </div>
      )}

      <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden">
        <AuthBackground />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <Card>
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-primary mb-2">Create Account</h1>
              <p className="text-gray-600">Start your aptitude learning journey</p>
            </div>

            {/* Google Signup Button */}
            <div className="mb-6">
              <div className="flex justify-center">
                <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onError={handleGoogleError}
                  theme="outline"
                  size="large"
                  text="signup_with"
                  shape="rectangular"
                  width="100%"
                />
              </div>
            </div>

            {/* Divider */}
            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or sign up with email</span>
              </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* Role Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  I am a <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      setSelectedRole('student');
                      setValue('role', 'student');
                    }}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      selectedRole === 'student'
                        ? 'border-secondary bg-secondary/10 shadow-md'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="text-center">
                      <div className="text-4xl mb-2">🎓</div>
                      <p className="font-bold text-primary">Student</p>
                      <p className="text-xs text-gray-600 mt-1">Learn & compete</p>
                    </div>
                  </motion.button>

                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      setSelectedRole('teacher');
                      setValue('role', 'teacher');
                    }}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      selectedRole === 'teacher'
                        ? 'border-secondary bg-secondary/10 shadow-md'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="text-center">
                      <div className="text-4xl mb-2">👨‍🏫</div>
                      <p className="font-bold text-primary">Teacher</p>
                      <p className="text-xs text-gray-600 mt-1">Create & manage</p>
                    </div>
                  </motion.button>
                </div>
                {errors.role && (
                  <p className="text-red-500 text-sm mt-2">{errors.role.message}</p>
                )}
              </div>

              <Input
                label="Full Name"
                placeholder="John Doe"
                error={errors.name?.message}
                {...register('name')}
              />

              <Input
                label="Email"
                type="email"
                placeholder="your@email.com"
                error={errors.email?.message}
                {...register('email')}
              />

              <Input
                label="Password"
                type="password"
                placeholder="••••••••"
                error={errors.password?.message}
                showPasswordToggle
                {...register('password')}
              />

              <Input
                label="Confirm Password"
                type="password"
                placeholder="••••••••"
                error={errors.confirmPassword?.message}
                showPasswordToggle
                {...register('confirmPassword')}
              />

              <Button
                type="submit"
                variant="primary"
                className="w-full"
                isLoading={isSubmitting}
              >
                Sign Up
              </Button>
            </form>

            <p className="text-center mt-6 text-gray-600">
              Already have an account?{' '}
              <Link to="/login" className="text-secondary hover:underline">
                Sign in
              </Link>
            </p>
          </Card>
        </motion.div>
      </div>
    </>
  );
};
