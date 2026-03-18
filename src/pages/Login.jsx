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
    <div className="flex justify-center items-center py-20 px-4 sm:px-6 lg:px-8 bg-base flex-grow">
      <div className="max-w-md w-full space-y-8 bg-surface p-10 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100">
        <div className="text-center">
          <div className="flex justify-center flex-col items-center mb-6">
            <div className="bg-accent/20 text-primary-dark p-3 rounded-2xl mb-2">
              <Briefcase size={32} />
            </div>
            <h2 className="mt-2 text-3xl font-heading font-extrabold text-slate-900 tracking-tight">
              Acesse sua conta
            </h2>
          </div>
          <p className="mt-2 text-sm text-slate-500">
            Ou{' '}
            <Link to="/cadastro" className="font-medium text-primary hover:text-primary-dark">
              crie uma nova conta gratuitamente
            </Link>
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm border border-red-200 font-medium">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">E-mail</label>
              <input
                {...register('email')}
                type="email"
                className={`mt-1 block w-full rounded-xl border-none bg-slate-50 text-slate-900 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-accent transition-colors hover:bg-slate-100 ${errors.email ? 'ring-2 ring-red-300' : ''}`}
                placeholder="seu@endereco.com"
              />
              {errors.email && <p className="mt-1 text-xs text-red-500 font-medium">{errors.email.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Senha</label>
              <input
                {...register('password')}
                type="password"
                className={`mt-1 block w-full rounded-xl border-none bg-slate-50 text-slate-900 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-accent transition-colors hover:bg-slate-100 ${errors.password ? 'ring-2 ring-red-300' : ''}`}
                placeholder="••••••••"
              />
              {errors.password && <p className="mt-1 text-xs text-red-500 font-medium">{errors.password.message}</p>}
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className={`group relative w-full flex justify-center py-3.5 px-4 text-sm font-bold rounded-xl text-primary-dark shadow-[0_4px_14px_0_rgba(190,242,100,0.39)] transition-all duration-300 ${loading ? 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none' : 'bg-accent hover:bg-accent-dark hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(190,242,100,0.23)] active:scale-95'}`}
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
