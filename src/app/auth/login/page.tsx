'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '@/hooks/useAuth';
import { loginSchema, type LoginFormData } from '@/lib/validations';
import { Button, Input, Alert } from '@/components/ui';
import { Shield, Users } from 'lucide-react';

export default function LoginPage() {
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setError('');
    setLoading(true);

    try {
      await signIn(data.email, data.password);
      router.push('/dashboard');
    } catch {
      setError('E-mail ou senha incorretos. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="mx-auto h-16 w-16 bg-blue-600 rounded-full flex items-center justify-center">
            <Shield className="h-8 w-8 text-white" />
          </div>
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            SafeKids
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Sistema de Gestão de Presença
          </p>
        </div>

        <div className="bg-white py-8 px-6 shadow rounded-lg">
          <div className="flex items-center justify-center mb-6">
            <Users className="h-8 w-8 text-blue-600 mr-2" />
            <h3 className="text-xl font-semibold text-gray-900">
              Entrar no Sistema
            </h3>
          </div>

          {error && (
            <Alert variant="error" className="mb-6">
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <Input
              label="E-mail"
              type="email"
              {...register('email')}
              error={errors.email?.message}
              placeholder="seu@email.com"
              autoComplete="email"
            />

            <Input
              label="Senha"
              type="password"
              {...register('password')}
              error={errors.password?.message}
              placeholder="Sua senha"
              autoComplete="current-password"
            />

            <Button
              type="submit"
              className="w-full"
              loading={loading}
              disabled={loading}
            >
              Entrar
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Entre em contato com o administrador para obter suas credenciais
            </p>
          </div>
        </div>

        <div className="text-center">
          <p className="text-xs text-gray-500">
            © 2024 SafeKids. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </div>
  );
} 