import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Briefcase } from 'lucide-react';

const loginSchema = z.object({
  email: z.string().email('E-mail inválido'),
  password: z.string().min(6, 'A senha deve ter pelo menos 6 caracteres'),
});

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // redirect to where they wanted to go or dashboard
  const from = location.state?.from?.pathname || '/dashboard';

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data) => {
    setLoading(true);
    setError(null);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });

      if (error) throw error;
      navigate(from, { replace: true });
    } catch (error) {
      setError(error.message === 'Invalid login credentials' ? 'Credenciais inválidas' : error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center py-20 px-4 sm:px-6 lg:px-8 bg-gray-50 flex-grow">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-md border border-gray-100">
        <div className="text-center">
          <div className="flex justify-center flex-col items-center mb-6">
            <div className="bg-primary text-white p-2 rounded-lg mb-2">
              <Briefcase size={32} />
            </div>
            <h2 className="mt-2 text-3xl font-heading font-extrabold text-gray-900">
              Acesse sua conta
            </h2>
          </div>
          <p className="mt-2 text-sm text-gray-600">
            Ou{' '}
            <Link to="/cadastro" className="font-medium text-primary hover:text-primary-dark">
              crie uma nova conta gratuitamente
            </Link>
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm border border-red-200">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">E-mail</label>
              <input
                {...register('email')}
                type="email"
                className={`mt-1 block w-full rounded-md border text-gray-900 px-3 py-2 focus:outline-none focus:ring-1 focus:border-primary focus:ring-primary ${errors.email ? 'border-red-300' : 'border-gray-300'}`}
                placeholder="seu@endereco.com"
              />
              {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Senha</label>
              <input
                {...register('password')}
                type="password"
                className={`mt-1 block w-full rounded-md border text-gray-900 px-3 py-2 focus:outline-none focus:ring-1 focus:border-primary focus:ring-primary ${errors.password ? 'border-red-300' : 'border-gray-300'}`}
                placeholder="••••••••"
              />
              {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password.message}</p>}
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className={`group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white ${loading ? 'bg-blue-400 cursor-not-allowed' : 'bg-primary hover:bg-primary-dark'} transition-colors duration-200`}
            >
              {loading ? 'Entrando...' : 'Entrar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
