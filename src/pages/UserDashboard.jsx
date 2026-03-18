import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/index';
import { supabase } from '../lib/supabase';
import JobCard from '../components/JobCard.jsx';
import { Bookmark, User, Settings, Loader2, CheckCircle2 } from 'lucide-react';
import { useForm, Controller } from 'react-hook-form';

const UserDashboard = () => {
  const navigate = useNavigate();
  const { session, profile, setProfile } = useAuthStore();
  const [activeTab, setActiveTab] = useState('vagas-salvas');
  const [savedJobs, setSavedJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const { register, handleSubmit, control, reset, formState: { errors } } = useForm({
    defaultValues: {
      name: '',
      address: '',
      phone: '',
      best_contact_time: '',
      contact_email: '',
      visa_type: '',
      visa_expiry_date: '',
      age: '',
      gender: '',
      japanese_level_communication: 0,
      japanese_level_hiragana: 0,
      japanese_level_katakana: 0,
      japanese_level_kanji: 0
    }
  });

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      if (hash === 'perfil' || hash === 'vagas-salvas') {
        setActiveTab(hash);
      }
    };
    
    // Set initial
    handleHashChange();
    
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  useEffect(() => {
    const fetchProfileData = async () => {
      const userId = profile?.id || session?.user?.id;
      if (!userId) return;

      const { data, error } = await supabase.from('profiles').select('*').eq('id', userId).single();
      if (data) {
        if (!profile) setProfile(data);
        reset({
          name: data.name || '',
          address: data.address || '',
          phone: data.phone || '',
          best_contact_time: data.best_contact_time || '',
          contact_email: data.contact_email || '',
          visa_type: data.visa_type || '',
          visa_expiry_date: data.visa_expiry_date || '',
          age: data.age || '',
          gender: data.gender || '',
          japanese_level_communication: data.japanese_level_communication || 0,
          japanese_level_hiragana: data.japanese_level_hiragana || 0,
          japanese_level_katakana: data.japanese_level_katakana || 0,
          japanese_level_kanji: data.japanese_level_kanji || 0
        });
      } else if (error && error.code === 'PGRST116') {
        // Tenta contornar se o trigger falhou e recria o profile manualmente
        const newProfile = { id: userId, role: 'seeker', name: session?.user?.user_metadata?.name || 'Candidato' };
        await supabase.from('profiles').insert(newProfile);
        setProfile(newProfile);
      }
    };
    
    fetchProfileData();

    // mock saved jobs
    setSavedJobs([
      { id: '1', title: 'Desenvolvedor React Pleno', companies: { name: 'Acme Corp' }, location: 'Tokyo, JP', work_mode: 'Híbrido', job_type: 'Full-time', salary_min: 400000, salary_max: 600000 }
    ]);
  }, [session, profile?.id, reset, setProfile]);

  const onSubmitProfile = async (data) => {
    try {
      setLoading(true);
      setSaveSuccess(false);

      const userId = profile?.id || session?.user?.id;
      if (!userId) {
        throw new Error("Sessão não autenticada. Faça login novamente.");
      }

      // Evita o erro do PostgreSQL de sintaxe inválida ("") para colunas do tipo date e numéricas
      const payload = { ...data };
      if (!payload.visa_expiry_date) {
        payload.visa_expiry_date = null;
      }
      if (payload.age === '' || isNaN(payload.age)) {
        payload.age = null;
      }

      const { error } = await supabase.from('profiles').update(payload).eq('id', userId);
      
      if (error) throw error;

      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
      if (payload.name !== profile?.name) {
        setProfile({ ...profile, name: payload.name });
      }
    } catch (err) {
      console.error("Erro ao salvar perfil:", err);
      alert("Erro ao salvar: " + (err.message || 'Verifique se as migrations foram rodadas no Supabase.'));
    } finally {
      setLoading(false);
    }
  };

  // Auto-redirect companies to their own dashboard (must be before any return)
  useEffect(() => {
    if (profile && profile.role === 'company') {
      navigate('/empresa/dashboard', { replace: true });
    }
  }, [profile, navigate]);

  if (!session) {
    return <div className="p-10 text-center text-slate-500 font-medium">Carregando painel do candidato...</div>;
  }

  if (profile && profile.role === 'company') {
    return <div className="p-10 text-center text-slate-500 font-medium">Redirecionando para o painel corporativo...</div>;
  }

  const renderLvlSlider = (name, label, control) => (
    <div className="mb-6 bg-slate-50 p-6 rounded-2xl border border-slate-100">
      <div className="flex justify-between mb-4">
        <label className="block text-sm font-bold text-slate-800">{label}</label>
      </div>
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <div>
            <input 
              type="range" 
              min="0" max="100" step="25" 
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-primary"
              {...field}
              onChange={(e) => field.onChange(parseInt(e.target.value))}
            />
            <div className="flex justify-between text-xs text-slate-400 mt-3 font-bold px-1">
              <span>0%</span>
              <span>25%</span>
              <span>50%</span>
              <span>75%</span>
              <span>100%</span>
            </div>
            <div className="text-center mt-2 font-extrabold text-primary-dark text-lg">{field.value}%</div>
          </div>
        )}
      />
    </div>
  );

  return (
    <div className="bg-base min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h1 className="text-3xl font-heading font-extrabold text-slate-900 mb-8 tracking-tight">Meu Painel</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 p-6 sticky top-28">
              <div className="flex flex-col items-center text-center mb-8">
                 <div className="w-20 h-20 bg-accent/20 rounded-full flex items-center justify-center text-primary-dark mb-4">
                   <User size={36} />
                 </div>
                 <h2 className="font-heading font-extrabold text-xl text-slate-900">{profile?.name || 'Candidato'}</h2>
                 <p className="text-sm text-slate-500 font-medium mt-1">Gerencie seu perfil e vagas</p>
              </div>
              
              <nav className="space-y-2">
                <a 
                  href="#vagas-salvas" 
                  className={`flex items-center p-3 rounded-xl font-bold transition-all ${activeTab === 'vagas-salvas' ? 'text-primary-dark bg-accent/20' : 'text-slate-600 hover:bg-slate-50'}`}
                >
                  <Bookmark className="mr-3" size={20} /> Vagas Salvas
                </a>
                <a 
                  href="#perfil" 
                  className={`flex items-center p-3 rounded-xl font-bold transition-all ${activeTab === 'perfil' ? 'text-primary-dark bg-accent/20' : 'text-slate-600 hover:bg-slate-50'}`}
                >
                  <Settings className="mr-3" size={20} /> Editar Perfil
                </a>
              </nav>
            </div>
          </div>
          
          {/* Main content */}
          <div className="lg:col-span-3">
            {activeTab === 'vagas-salvas' && (
              <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 p-8">
                <h3 className="text-2xl font-extrabold font-heading text-slate-900 mb-8 tracking-tight">Vagas Salvas</h3>
                <div className="space-y-6">
                  {savedJobs.map(job => (
                    <div key={job.id} className="relative group">
                      <JobCard job={job} />
                      <button className="absolute top-4 right-4 text-slate-400 hover:text-red-500 bg-white border border-slate-100 p-2 rounded-xl shadow-sm hover:shadow-md transition-all z-10 opacity-0 group-hover:opacity-100">
                        Remover
                      </button>
                    </div>
                  ))}
                  {savedJobs.length === 0 && (
                    <div className="text-center py-12">
                      <Bookmark className="mx-auto h-12 w-12 text-slate-300 mb-4" />
                      <p className="text-slate-500 font-medium">Você ainda não tem vagas salvas.</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'perfil' && (
              <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 p-8">
                <div className="flex justify-between items-center mb-8 border-b border-slate-100 pb-6">
                  <h3 className="text-2xl font-extrabold font-heading text-slate-900 tracking-tight">Informações de Cadastro</h3>
                  {saveSuccess && (
                     <span className="flex items-center text-sm font-bold text-primary bg-primary/10 px-3 py-1.5 rounded-lg">
                       <CheckCircle2 size={16} className="mr-1.5" /> Salvo com sucesso!
                     </span>
                  )}
                </div>

                <form onSubmit={handleSubmit(onSubmitProfile)} className="space-y-8">
                  {/* Dados Pessoais */}
                  <div>
                    <h4 className="text-lg font-bold text-slate-900 mb-4 flex items-center"><User size={18} className="mr-2 text-primary" /> Dados Pessoais</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="col-span-2 md:col-span-1">
                        <label className="block text-sm font-bold text-slate-700 mb-1.5">Nome Completo</label>
                        <input {...register('name', { required: true })} className="input-base" placeholder="Seu nome completo" />
                        {errors.name && <span className="text-red-500 text-xs mt-1">Nome é obrigatório</span>}
                      </div>
                      <div className="col-span-2 md:col-span-1">
                        <label className="block text-sm font-bold text-slate-700 mb-1.5">E-mail para Contato</label>
                        <input type="email" {...register('contact_email')} className="input-base" placeholder="email@exemplo.com" />
                      </div>
                      <div className="col-span-2">
                        <label className="block text-sm font-bold text-slate-700 mb-1.5">Endereço Completo no Japão</label>
                        <input {...register('address')} className="input-base" placeholder="Ex: Tokyo-to, Minato-ku..." />
                      </div>
                      <div className="col-span-2 md:col-span-1">
                        <label className="block text-sm font-bold text-slate-700 mb-1.5">Telefone</label>
                        <input {...register('phone')} className="input-base" placeholder="Ex: 090-1234-5678" />
                      </div>
                      <div className="col-span-2 md:col-span-1">
                        <label className="block text-sm font-bold text-slate-700 mb-1.5">Melhor Horário para Contato</label>
                        <select {...register('best_contact_time')} className="input-base">
                          <option value="">Selecione...</option>
                          <option value="Manhã (09:00 - 12:00)">Manhã (09:00 - 12:00)</option>
                          <option value="Tarde (13:00 - 18:00)">Tarde (13:00 - 18:00)</option>
                          <option value="Noite (Após 18:00)">Noite (Após 18:00)</option>
                          <option value="Qualquer horário">Qualquer horário</option>
                        </select>
                      </div>
                      <div className="col-span-2 md:col-span-1">
                        <label className="block text-sm font-bold text-slate-700 mb-1.5">Idade</label>
                        <input type="number" {...register('age', { valueAsNumber: true })} className="input-base" placeholder="Sua idade" />
                      </div>
                      <div className="col-span-2 md:col-span-1">
                        <label className="block text-sm font-bold text-slate-700 mb-1.5">Sexo</label>
                        <select {...register('gender')} className="input-base">
                          <option value="">Selecione...</option>
                          <option value="Masculino">Masculino</option>
                          <option value="Feminino">Feminino</option>
                          <option value="Masculino Trans">Masculino Trans</option>
                          <option value="Feminino Trans">Feminino Trans</option>
                          <option value="Não-Binário">Não-Binário</option>
                          <option value="Prefiro não informar">Prefiro não informar</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <hr className="border-slate-100" />

                  {/* Status de Visto */}
                  <div>
                    <h4 className="text-lg font-bold text-slate-900 mb-4 flex items-center"><User size={18} className="mr-2 text-primary" /> Status de Visto (Zaryo Card)</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1.5">Tipo de Visto</label>
                        <select {...register('visa_type')} className="input-base">
                          <option value="">Selecione seu visto...</option>
                          <option value="Residente Permanente (Eijusha)">Residente Permanente (Eijusha)</option>
                          <option value="Cônjuge de Japonês">Cônjuge de Japonês</option>
                          <option value="Residente de Longo Prazo (Teijusha)">Residente de Longo Prazo (Teijusha)</option>
                          <option value="Trabalho (Engenharia/Humanas/Intl)">Trabalho (Eng/Humanities/Intl)</option>
                          <option value="Estudante (Ryugaku)">Estudante (Ryugaku)</option>
                          <option value="Outro">Outro</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1.5">Data de Vencimento</label>
                        <input type="date" {...register('visa_expiry_date')} className="input-base text-slate-500" />
                      </div>
                    </div>
                  </div>

                  <hr className="border-slate-100" />

                  {/* Nível de Japonês */}
                  <div>
                    <h4 className="text-lg font-bold text-slate-900 mb-6 flex items-center"><User size={18} className="mr-2 text-primary" /> Proficiência em Japonês</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2">
                       {renderLvlSlider('japanese_level_communication', 'Nível de Comunicação (Fala/Escuta)', control)}
                       {renderLvlSlider('japanese_level_hiragana', 'Leitura e Escrita (Hiragana)', control)}
                       {renderLvlSlider('japanese_level_katakana', 'Leitura e Escrita (Katakana)', control)}
                       {renderLvlSlider('japanese_level_kanji', 'Leitura e Escrita (Kanji)', control)}
                    </div>
                  </div>

                  <div className="pt-6 flex justify-end pb-8">
                    <button 
                      type="submit" 
                      disabled={loading}
                      className="btn-primary w-full md:w-auto min-w-[200px]"
                    >
                      {loading ? <Loader2 className="animate-spin mx-auto" size={24} /> : 'Salvar Perfil'}
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
