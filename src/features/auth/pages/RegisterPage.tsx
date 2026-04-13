import { useState } from 'react';
import type { FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuthActions } from '@convex-dev/auth/react';
import { useAuthStore } from '../store/authStore';
import { useToast } from '../../../shared/hooks/useToast';
import { Button } from '../../../shared/ui/Button';
import { Input } from '../../../shared/ui/Input';
import { Card } from '../../../shared/ui/Card';
import { AuthBackground } from '../../../shared/ui/AuthBackground';

export const RegisterPage = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const { signIn } = useAuthActions();
  const setUser = useAuthStore((state) => state.setUser);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    try {
      const formData = new FormData(event.currentTarget);
      formData.set('flow', 'signUp');
      await signIn('password', formData);
      const email = String(formData.get('email') ?? '');
      const name = String(formData.get('name') ?? 'User');
      setUser({
        id: email,
        email,
        name,
        role: 'student',
        badges: [],
        createdAt: new Date().toISOString(),
      });
      toast.success('Registration successful!');
      navigate('/dashboard');
    } catch {
      toast.error('Registration failed. Please try again.');
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
            <h1 className="text-3xl font-bold text-primary mb-2">Create Account</h1>
            <p className="text-gray-600">Start your aptitude learning journey</p>
          </div>

          <form onSubmit={onSubmit} className="space-y-4">
            <Input label="Full Name" name="name" placeholder="John Doe" />
            <Input label="Email" type="email" name="email" placeholder="your@email.com" />
            <Input label="Password" type="password" name="password" placeholder="••••••••" showPasswordToggle />
            <Button type="submit" variant="primary" className="w-full" isLoading={isSubmitting}>
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
  );
};
