import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Briefcase, User, Building } from 'lucide-react';
import classNames from 'classnames';

const registerSchema = z.object({
  name: z.string().min(2, 'O nome deve ter pelo menos 2 caracteres'),
  email: z.string().email('E-mail inválido'),
  password: z.string().min(6, 'A senha deve ter pelo menos 6 caracteres'),
  role: z.enum(['seeker', 'company']),
});

const Register = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const defaultRole = searchParams.get('type') === 'company' ? 'company' : 'seeker';
  
  const [type, setType] = useState(defaultRole);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const { register, handleSubmit, formState: { errors }, watch } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      role: defaultRole
    }
  });

  const onSubmit = async (data) => {
    setLoading(true);
    setError(null);
    try {
      const { data: authData, error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            name: data.name,
            role: data.role,
          }
        }
      });

      if (error) throw error;
      
      if (authData?.user?.identities?.length === 0) {
        throw new Error("Este email já está cadastrado.");
      }

      setSuccess(true);
      setTimeout(() => {
        navigate('/dashboard');
      }, 3000);
      
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="flex justify-center items-center py-20 px-4 bg-base flex-grow">
        <div className="max-w-md w-full bg-surface p-12 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 text-center">
          <div className="mb-6 text-accent flex justify-center">
            <svg className="w-20 h-20 drop-shadow-sm" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          </div>
          <h2 className="text-3xl font-heading font-extrabold text-slate-900 mb-3 tracking-tight">Conta criada!</h2>
          <p className="text-slate-500 font-medium">Redirecionando para o seu painel mágico...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center py-12 px-4 sm:px-6 lg:px-8 bg-base flex-grow">
      <div className="max-w-md w-full space-y-8 bg-surface p-10 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100">
        <div className="text-center">
          <h2 className="mt-2 text-3xl font-heading font-extrabold text-slate-900 tracking-tight">
            Crie sua conta
          </h2>
          <p className="mt-2 text-sm text-slate-500 font-medium">
            Já tem uma conta?{' '}
            <Link to="/login" className="text-primary hover:text-primary-dark font-bold">
              Acesse aqui
            </Link>
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          
          <div className="grid grid-cols-2 gap-4 mb-6">
            <button
              type="button"
              onClick={() => setType('seeker')}
              className={classNames('py-4 border rounded-2xl flex flex-col items-center justify-center gap-2 transition-all duration-300', {
                'border-primary bg-primary/5 text-primary ring-1 ring-primary shadow-sm': type === 'seeker',
                'border-slate-100 text-slate-400 hover:bg-slate-50 hover:text-slate-600': type !== 'seeker'
              })}
            >
              <User size={28} />
              <span className="font-bold text-sm">Candidato</span>
            </button>
            <button
              type="button"
              onClick={() => setType('company')}
              className={classNames('py-4 border rounded-2xl flex flex-col items-center justify-center gap-2 transition-all duration-300', {
                'border-primary bg-primary/5 text-primary ring-1 ring-primary shadow-sm': type === 'company',
                'border-slate-100 text-slate-400 hover:bg-slate-50 hover:text-slate-600': type !== 'company'
              })}
            >
              <Building size={28} />
              <span className="font-bold text-sm">Empresa</span>
            </button>
          </div>
          
          {/* hidden input to register the role */}
          <input type="hidden" value={type} {...register('role')} />

          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm border border-red-200 font-medium">
              {error}
            </div>
          )}

          <div className="space-y-5">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">
                {type === 'company' ? 'Nome da Empresa' : 'Seu Nome Completo'}
              </label>
              <input
                {...register('name')}
                type="text"
                className={`block w-full rounded-xl border-none bg-slate-50 text-slate-900 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-accent transition-colors hover:bg-slate-100 ${errors.name ? 'ring-2 ring-red-300' : ''}`}
              />
              {errors.name && <p className="mt-1 text-xs text-red-500 font-medium">{errors.name.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">E-mail</label>
              <input
                {...register('email')}
                type="email"
                className={`block w-full rounded-xl border-none bg-slate-50 text-slate-900 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-accent transition-colors hover:bg-slate-100 ${errors.email ? 'ring-2 ring-red-300' : ''}`}
              />
              {errors.email && <p className="mt-1 text-xs text-red-500 font-medium">{errors.email.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Senha</label>
              <input
                {...register('password')}
                type="password"
                className={`block w-full rounded-xl border-none bg-slate-50 text-slate-900 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-accent transition-colors hover:bg-slate-100 ${errors.password ? 'ring-2 ring-red-300' : ''}`}
                placeholder="Mínimo 6 caracteres"
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
              {loading ? 'Cadastrando...' : 'Criar Conta'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
