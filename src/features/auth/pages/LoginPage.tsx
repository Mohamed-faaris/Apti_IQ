import { useState } from 'react';
import type { FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuthActions } from '@convex-dev/auth/react';
import { useToast } from '../../../shared/hooks/useToast';
import { Button } from '../../../shared/ui/Button';
import { Input } from '../../../shared/ui/Input';
import { Card } from '../../../shared/ui/Card';
import { AuthBackground } from '../../../shared/ui/AuthBackground';

export const LoginPage = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const { signIn } = useAuthActions();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    try {
      const formData = new FormData(event.currentTarget);
      formData.set('flow', 'signIn');
      await signIn('password', formData);
      toast.success('Login successful!');
      navigate('/dashboard');
    } catch {
      toast.error('Login failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden">
      <AuthBackground />
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
        <Card>
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-primary mb-2">Welcome Back</h1>
            <p className="text-gray-600">Sign in to continue your learning journey</p>
          </div>

          <form onSubmit={onSubmit} className="space-y-4">
            <Input label="Email" type="email" name="email" placeholder="your@email.com" />
            <Input label="Password" type="password" name="password" placeholder="••••••••" showPasswordToggle />
            <Button type="submit" variant="primary" className="w-full" isLoading={isSubmitting}>
              Sign In
            </Button>
          </form>

          <p className="text-center mt-6 text-gray-600">
            Don't have an account?{' '}
            <Link to="/register" className="text-secondary hover:underline">
              Sign up
            </Link>
          </p>
        </Card>
      </motion.div>
    </div>
  );
};
