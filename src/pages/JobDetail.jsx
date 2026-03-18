import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuthStore } from '../store/index';
import AdSlot from '../components/AdSlot.jsx';
import { formatCurrency } from '../components/JobCard.jsx';
import { MapPin, Briefcase, Building, DollarSign, Clock, Calendar, BookmarkPlus, Share2, ArrowLeft } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const JobDetail = () => {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const { session } = useAuthStore();

  useEffect(() => {
    const fetchJob = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('jobs')
        .select('*, companies(*)')
        .eq('id', id)
        .single();
        
      if (data) setJob(data);
      setLoading(false);
    };
    
    if (id !== '1' && id !== '2') fetchJob(); // temporary bypass for mock ids
    else {
      setJob({
        id, title: 'Desenvolvedor React Pleno', description: 'Experiência com React, Tailwind e Supabase necessário.\n\nBenefícios:\n- VR/VA\n- Plano de Saúde', 
        location: 'São Paulo, SP', work_mode: 'hybrid', job_type: 'CLT', salary_min: 8000, salary_max: 12000, created_at: new Date().toISOString(),
        companies: { name: 'Acme Corp', slug: 'acme-corp', description: 'Empresa líder em tech' }
      });
      setLoading(false);
    }
  }, [id]);

  const handleSaveJob = async () => {
    if (!session) {
      alert("Por favor, faça login como candidato para salvar vagas e mostrar interesse.");
      return;
    }

    // Check if user is seeker
    if (session.user.user_metadata?.role && session.user.user_metadata.role !== 'seeker') {
      alert("Apenas candidatos podem salvar vagas como favoritas.");
      return;
    }

    const { error } = await supabase.from('saved_jobs').insert({
      user_id: session.user.id,
      job_id: job.id
    });
    
    if (error) {
      if (error.code === '23505') {
        alert("Você já salvou esta vaga anteriormente!");
      } else {
        alert("Erro ao salvar vaga. O recurso pode estar indisponível no mock mode.");
        console.error(error);
      }
    } else {
      alert("Vaga salva com sucesso! Seu perfil (idade, sexo, idioma, etc.) agora está visível para a empresa.");
    }
  };

  if (loading) return <div className="py-20 text-center text-gray-500">Carregando...</div>;
  if (!job) return <div className="py-20 text-center text-gray-500">Vaga não encontrada</div>;

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <Link to="/vagas" className="inline-flex items-center text-gray-500 hover:text-primary mb-6 transition-colors font-medium">
          <ArrowLeft size={16} className="mr-1" /> Voltar para vagas
        </Link>
        
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          {/* Header */}
          <div className="p-8 border-b border-gray-100">
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
              <div className="flex gap-6 items-start">
                <div className="w-20 h-20 bg-gray-50 border border-gray-100 rounded-xl flex items-center justify-center flex-shrink-0 p-2 bg-white">
                  {job.companies?.logo_url ? (
                    <img src={job.companies.logo_url} alt={job.companies.name} className="w-full h-full object-contain" />
                  ) : (
                    <Building size={32} className="text-gray-400" />
                  )}
                </div>
                <div>
                  <h1 className="text-2xl md:text-3xl font-heading font-bold text-gray-900 mb-2">{job.title}</h1>
                  <Link to={`/empresa/${job.companies?.slug}`} className="text-lg text-primary hover:text-primary-dark transition-colors font-medium">
                    {job.companies?.name}
                  </Link>
                  <div className="mt-4 flex flex-wrap gap-4 text-sm text-gray-600">
                    <span className="flex items-center"><MapPin size={16} className="mr-1.5 text-gray-400" /> {job.location || 'Não especificado'}</span>
                    <span className="flex items-center"><Briefcase size={16} className="mr-1.5 text-gray-400" /> {job.work_mode} · {job.job_type}</span>
                    <span className="flex items-center"><DollarSign size={16} className="mr-1.5 text-gray-400" /> 
                      {job.salary_min ? `${formatCurrency(job.salary_min)} ${job.salary_max ? `- ${formatCurrency(job.salary_max)}` : ''}` : 'A combinar'}
                    </span>
                    <span className="flex items-center"><Clock size={16} className="mr-1.5 text-gray-400" /> 
                      Postado {job.created_at ? formatDistanceToNow(new Date(job.created_at), { addSuffix: true, locale: ptBR }) : ''}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-row md:flex-col gap-3 min-w-[200px]">
                <button className="flex-1 md:flex-none btn-primary py-3 px-6 text-center font-bold shadow-md hover:shadow-lg transition-all">
                  Candidatar-se
                </button>
                <div className="flex gap-2">
                  <button onClick={handleSaveJob} className="flex-1 flex justify-center items-center py-2 px-4 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
                    <BookmarkPlus size={20} className="mr-2 text-gray-500" /> Salvar
                  </button>
                  <button className="flex justify-center items-center p-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors tooltip" title="Compartilhar">
                    <Share2 size={20} className="text-gray-500" />
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col lg:flex-row">
            {/* Main Desc */}
            <div className="flex-1 p-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4 font-heading">Descrição da Vaga</h2>
              <div className="prose max-w-none text-gray-700 whitespace-pre-line">
                {job.description}
              </div>
            </div>
            
            {/* Sidebar info */}
            <div className="w-full lg:w-80 border-l border-gray-100 bg-gray-50 p-8">
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-6">Sobre a empresa</h3>
              <p className="text-sm text-gray-600 mb-6 line-clamp-4">
                {job.companies?.description || 'Descrição não disponível.'}
              </p>
              <Link to={`/empresa/${job.companies?.slug}`} className="text-sm text-primary font-medium hover:underline">
                Ver perfil completo &rarr;
              </Link>
              
              <div className="mt-10">
                <AdSlot size="sidebar" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDetail;
