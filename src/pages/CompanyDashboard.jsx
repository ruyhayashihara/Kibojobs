import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../store/index';
import { supabase } from '../lib/supabase';
import { useForm } from 'react-hook-form';
import { Building, PlusCircle, Briefcase, ExternalLink, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import classNames from 'classnames';

const CompanyDashboard = () => {
  const { session, profile } = useAuthStore();
  const [company, setCompany] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [activeTab, setActiveTab] = useState('minhas-vagas');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  useEffect(() => {
    const fetchData = async () => {
      const userId = profile?.id || session?.user?.id;
      if (!userId) return;
      
      // Get Company details
      const { data: compData } = await supabase
        .from('companies')
        .select('*')
        .eq('user_id', userId)
        .single();
        
      if (compData) {
        setCompany(compData);
        // Get Jobs
        const { data: jobsData } = await supabase
          .from('jobs')
          .select('*')
          .eq('company_id', compData.id)
          .order('created_at', { ascending: false });
        if (jobsData) setJobs(jobsData);
      }
      setLoading(false);
    };

    fetchData();
  }, [session, profile]);

  const onSubmitJob = async (data) => {
    try {
      setSubmitting(true);
      if (!company?.id) throw new Error("Aguarde, perfil da empresa sendo sincronizado...");

      const payload = {
        company_id: company.id,
        title: data.title,
        description: data.description,
        location: data.location,
        job_type: data.job_type,
        work_mode: data.work_mode,
        salary_min: data.salary_min ? parseInt(data.salary_min) : null,
        salary_max: data.salary_max ? parseInt(data.salary_max) : null,
        industry: data.industry || 'Geral',
        is_active: true
      };

      const { data: newJob, error } = await supabase.from('jobs').insert(payload).select().single();
      if (error) throw error;

      setSuccessMsg('Vaga publicada com sucesso no VagasJP!');
      setJobs([newJob, ...jobs]);
      reset();
      setTimeout(() => {
        setSuccessMsg('');
        setActiveTab('minhas-vagas');
      }, 3000);
    } catch (err) {
      console.error(err);
      alert('Erro ao publicar vaga. Verifique se as permissões (RLS) permitem a inserção na tabela jobs.');
    } finally {
      setSubmitting(false);
    }
  };

  if (!session) return <div className="p-20 text-center font-medium text-slate-500">Recuperando sessão...</div>;
  if (loading) return <div className="p-20 text-center font-medium text-slate-500">Recuperando painel corporativo...</div>;

  if (profile && profile.role !== 'company') {
    return <div className="p-20 text-center font-medium text-red-500">Acesso restrito. Sua conta cadastrada não é empresarial.</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex flex-col md:flex-row gap-8 items-start">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-surface rounded-3xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 flex-shrink-0 sticky top-28">
        <div className="text-center mb-8">
          <div className="w-20 h-20 mx-auto bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-4">
            <Building size={32} />
          </div>
          <h2 className="text-xl font-heading font-extrabold text-slate-900 leading-tight">{company?.name || 'Sua Empresa'}</h2>
          <p className="text-sm text-slate-500 mt-1 font-medium bg-slate-100 py-1 px-3 rounded-full inline-block mt-3">
            法人番号: {company?.corporate_number || 'Novo Registro'}
          </p>
        </div>

        <nav className="space-y-2">
          <button
            onClick={() => setActiveTab('minhas-vagas')}
            className={classNames('w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-bold text-sm transition-colors', {
              'bg-primary/10 text-primary': activeTab === 'minhas-vagas',
              'text-slate-600 hover:bg-slate-50': activeTab !== 'minhas-vagas'
            })}
          >
            <Briefcase size={20} />
            Minhas Vagas
          </button>
          <button
            onClick={() => setActiveTab('nova-vaga')}
            className={classNames('w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-bold text-sm transition-colors', {
              'bg-primary/10 text-primary': activeTab === 'nova-vaga',
              'text-slate-600 hover:bg-slate-50': activeTab !== 'nova-vaga'
            })}
          >
            <PlusCircle size={20} />
            Publicar Nova Vaga
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 min-w-0 bg-surface rounded-3xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100">
        
        {activeTab === 'minhas-vagas' && (
          <div>
            <div className="flex justify-between items-center mb-8">
              <div>
                <h1 className="text-2xl font-heading font-extrabold text-slate-900">Gerenciar Vagas</h1>
                <p className="text-slate-500 font-medium mt-1">Acompanhe as suas vagas ativas no VagasJP.</p>
              </div>
              <button 
                onClick={() => setActiveTab('nova-vaga')}
                className="bg-slate-900 text-white px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-slate-800 transition-colors shadow-sm"
               >
                 + Nova Vaga
              </button>
            </div>

            {jobs.length === 0 ? (
              <div className="py-20 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                <Briefcase size={40} className="mx-auto text-slate-300 mb-4" />
                <h3 className="text-lg font-bold text-slate-900 mb-2">Nenhuma vaga publicada</h3>
                <p className="text-slate-500 mb-4">Sua empresa ainda não possui anúncios ativos.</p>
                <button onClick={() => setActiveTab('nova-vaga')} className="text-primary font-bold hover:underline">
                  Publique sua primeira vaga
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {jobs.map(job => (
                  <div key={job.id} className="p-5 border border-slate-100 rounded-2xl flex flex-col sm:flex-row justify-between sm:items-center gap-4 hover:border-accent transition-colors bg-white">
                    <div>
                      <h3 className="font-bold text-slate-900 text-lg tracking-tight">{job.title}</h3>
                      <div className="flex items-center gap-3 mt-2 text-sm text-slate-500 font-medium">
                        <span className="flex items-center gap-1"><MapPin size={14} /> {job.location}</span>
                        <span>•</span>
                        <span className="capitalize">{job.work_mode}</span>
                        <span>•</span>
                        <span className={classNames('px-2 py-0.5 rounded-md text-xs', job.is_active ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500')}>
                          {job.is_active ? 'Ativa' : 'Pausada'}
                        </span>
                      </div>
                    </div>
                    <Link to={`/vagas/${job.id}`} className="flex items-center gap-2 text-sm font-bold text-primary hover:text-primary-dark">
                      Ver página <ExternalLink size={16} />
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'nova-vaga' && (
          <div>
            <h1 className="text-2xl font-heading font-extrabold text-slate-900 mb-8">Publicar Nova Vaga</h1>
            
            {successMsg && (
              <div className="mb-6 bg-green-50 text-green-700 p-4 rounded-2xl border border-green-200 font-bold flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                {successMsg}
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmitJob)} className="space-y-6 max-w-2xl">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Título da Vaga</label>
                <input
                  {...register('title', { required: true })}
                  type="text"
                  placeholder="Ex: Desenvolvedor Frontend React"
                  className="w-full rounded-xl bg-slate-50 border-none px-4 py-3 focus:ring-2 focus:ring-accent transition-colors hover:bg-slate-100"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Localização</label>
                  <input
                    {...register('location', { required: true })}
                    type="text"
                    placeholder="Ex: Tokyo, Japan"
                    className="w-full rounded-xl bg-slate-50 border-none px-4 py-3 focus:ring-2 focus:ring-accent transition-colors hover:bg-slate-100"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Modelo de Trabalho</label>
                  <select {...register('work_mode', { required: true })} className="w-full rounded-xl bg-slate-50 border-none px-4 py-3 focus:ring-2 focus:ring-accent transition-colors hover:bg-slate-100 cursor-pointer">
                    <option value="on-site">Presencial</option>
                    <option value="hybrid">Híbrido</option>
                    <option value="remote">Remoto</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Salário Mensal Mínimo (¥)</label>
                  <input
                    {...register('salary_min')}
                    type="number"
                    placeholder="300000"
                    className="w-full rounded-xl bg-slate-50 border-none px-4 py-3 focus:ring-2 focus:ring-accent transition-colors hover:bg-slate-100"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Salário Mensal Máximo (¥)</label>
                  <input
                    {...register('salary_max')}
                    type="number"
                    placeholder="500000"
                    className="w-full rounded-xl bg-slate-50 border-none px-4 py-3 focus:ring-2 focus:ring-accent transition-colors hover:bg-slate-100"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Tipo de Contrato</label>
                  <select {...register('job_type', { required: true })} className="w-full rounded-xl bg-slate-50 border-none px-4 py-3 focus:ring-2 focus:ring-accent transition-colors hover:bg-slate-100 cursor-pointer">
                    <option value="CLT">Seishain (Full-time)</option>
                    <option value="PJ">Keiyaku Shain (Contract)</option>
                    <option value="Freelance">Gyomu Itaku (Freelance)</option>
                    <option value="Estágio">Arubaito / Part-time</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Setor (Indústria)</label>
                  <input
                    {...register('industry')}
                    type="text"
                    placeholder="Ex: Tecnologia, Manufatura..."
                    className="w-full rounded-xl bg-slate-50 border-none px-4 py-3 focus:ring-2 focus:ring-accent transition-colors hover:bg-slate-100"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Descrição Completa e Requisitos</label>
                <textarea
                  {...register('description', { required: true })}
                  rows={8}
                  placeholder="Escreva sobre as responsabilidades, nível de japonês necessário (Ex: N2), se há suporte de visto e os principais benefícios..."
                  className="w-full rounded-xl bg-slate-50 border-none px-4 py-3 focus:ring-2 focus:ring-accent transition-colors hover:bg-slate-100 resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-4 bg-accent hover:bg-accent-dark text-primary-dark font-extrabold rounded-xl transition-all shadow-[0_4px_14px_0_rgba(190,242,100,0.39)] hover:shadow-[0_6px_20px_rgba(190,242,100,0.23)] active:scale-95 disabled:opacity-50 disabled:shadow-none"
              >
                {submitting ? 'Salvando Vaga e Sincronizando...' : 'Publicar Vaga Otimizada 🚀'}
              </button>
            </form>
          </div>
        )}
      </main>
    </div>
  );
};

export default CompanyDashboard;
