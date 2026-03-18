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
      <div className="flex justify-center items-center py-20 px-4 bg-gray-50 flex-grow">
        <div className="max-w-md w-full bg-white p-10 rounded-xl shadow-md border border-gray-100 text-center">
          <div className="mb-4 text-green-500 flex justify-center">
            <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Conta criada com sucesso!</h2>
          <p className="text-gray-600 mb-6">Redirecionando para o seu painel...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-50 flex-grow">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-md border border-gray-100">
        <div className="text-center">
          <h2 className="mt-2 text-3xl font-heading font-extrabold text-gray-900">
            Crie sua conta
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Já tem uma conta?{' '}
            <Link to="/login" className="font-medium text-primary hover:text-primary-dark">
              Acesse aqui
            </Link>
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          
          <div className="grid grid-cols-2 gap-4 mb-6">
            <button
              type="button"
              onClick={() => setType('seeker')}
              className={classNames('py-3 border rounded-lg flex flex-col items-center justify-center gap-2 transition-colors', {
                'border-primary bg-blue-50 text-primary ring-1 ring-primary': type === 'seeker',
                'border-gray-200 text-gray-500 hover:bg-gray-50': type !== 'seeker'
              })}
            >
              <User size={24} />
              <span className="font-medium text-sm">Candidato</span>
            </button>
            <button
              type="button"
              onClick={() => setType('company')}
              className={classNames('py-3 border rounded-lg flex flex-col items-center justify-center gap-2 transition-colors', {
                'border-primary bg-blue-50 text-primary ring-1 ring-primary': type === 'company',
                'border-gray-200 text-gray-500 hover:bg-gray-50': type !== 'company'
              })}
            >
              <Building size={24} />
              <span className="font-medium text-sm">Empresa</span>
            </button>
          </div>
          
          {/* hidden input to register the role */}
          <input type="hidden" value={type} {...register('role')} />

          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm border border-red-200">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                {type === 'company' ? 'Nome da Empresa' : 'Seu Nome Completo'}
              </label>
              <input
                {...register('name')}
                type="text"
                className={`mt-1 block w-full rounded-md border text-gray-900 px-3 py-2 focus:outline-none focus:ring-1 focus:border-primary focus:ring-primary ${errors.name ? 'border-red-300' : 'border-gray-300'}`}
              />
              {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">E-mail</label>
              <input
                {...register('email')}
                type="email"
                className={`mt-1 block w-full rounded-md border text-gray-900 px-3 py-2 focus:outline-none focus:ring-1 focus:border-primary focus:ring-primary ${errors.email ? 'border-red-300' : 'border-gray-300'}`}
              />
              {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Senha</label>
              <input
                {...register('password')}
                type="password"
                className={`mt-1 block w-full rounded-md border text-gray-900 px-3 py-2 focus:outline-none focus:ring-1 focus:border-primary focus:ring-primary ${errors.password ? 'border-red-300' : 'border-gray-300'}`}
                placeholder="Mínimo 6 caracteres"
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
              {loading ? 'Cadastrando...' : 'Criar Conta'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
