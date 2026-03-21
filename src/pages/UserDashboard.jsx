import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/index';
import { supabase } from '../lib/supabase';
import JobCard from '../components/JobCard.jsx';
import { Bookmark, User, Settings, Loader2, CheckCircle2 } from 'lucide-react';
import { useForm, Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import KanaInput from '../components/KanaInput.jsx';
import PostalCodeInput from '../components/PostalCodeInput.jsx';
import { JAPANESE_VISA_TYPES, PREFECTURES, validateKatakana, validateHiragana } from '../utils/japaneseUtils';

const UserDashboard = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { session, profile, setProfile } = useAuthStore();
  const [activeTab, setActiveTab] = useState('saved-jobs');
  const [savedJobs, setSavedJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [addressData, setAddressData] = useState({
    prefecture: '',
    city: '',
    town: ''
  });

  const { register, handleSubmit, control, reset, setValue, watch, formState: { errors } } = useForm({
    defaultValues: {
      name: '',
      family_name: '',
      given_name: '',
      family_name_kana: '',
      given_name_kana: '',
      address: '',
      phone: '',
      best_contact_time: '',
      contact_email: '',
      visa_type: '',
      visa_expiry_date: '',
      age: '',
      gender: '',
      postal_code: '',
      japanese_level_communication: 0,
      japanese_level_hiragana: 0,
      japanese_level_katakana: 0,
      japanese_level_kanji: 0
    }
  });

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      if (hash === 'profile' || hash === 'saved-jobs') {
        setActiveTab(hash);
      }
    };
    
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
          family_name: data.family_name || '',
          given_name: data.given_name || '',
          family_name_kana: data.family_name_kana || '',
          given_name_kana: data.given_name_kana || '',
          address: data.address || '',
          phone: data.phone || '',
          best_contact_time: data.best_contact_time || '',
          contact_email: data.contact_email || '',
          visa_type: data.visa_type || '',
          visa_expiry_date: data.visa_expiry_date || '',
          age: data.age || '',
          gender: data.gender || '',
          postal_code: data.postal_code || '',
          prefecture: data.prefecture || '',
          city: data.city || '',
          town: data.town || '',
          street: data.street || '',
          japanese_level_communication: data.japanese_level_communication || 0,
          japanese_level_hiragana: data.japanese_level_hiragana || 0,
          japanese_level_katakana: data.japanese_level_katakana || 0,
          japanese_level_kanji: data.japanese_level_kanji || 0
        });
        setAddressData({
          prefecture: data.prefecture || '',
          city: data.city || '',
          town: data.town || ''
        });
      } else if (error && error.code === 'PGRST116') {
        const newProfile = { id: userId, role: 'seeker', name: session?.user?.user_metadata?.name || '候補者' };
        await supabase.from('profiles').insert(newProfile);
        setProfile(newProfile);
      }
    };
    
    fetchProfileData();

    setSavedJobs([
      { id: '1', title: 'React Developer', companies: { name: 'Acme Corp' }, location: 'Tokyo', work_mode: 'hybrid', job_type: 'seishain', salary_min: 400000, salary_max: 600000 }
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

  useEffect(() => {
    if (profile && profile.role === 'company') {
      navigate('/company/dashboard', { replace: true });
    }
  }, [profile, navigate]);

  if (!session) {
    return <div className="p-10 text-center text-slate-500 font-medium">{t('common.loading')}</div>;
  }

  if (profile && profile.role === 'company') {
    return <div className="p-10 text-center text-slate-500 font-medium">リダイレクト中...</div>;
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
        <h1 className="text-3xl font-heading font-extrabold text-slate-900 mb-8 tracking-tight">{t('profile.title')}</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 p-6 sticky top-28">
              <div className="flex flex-col items-center text-center mb-8">
                 <div className="w-20 h-20 bg-accent/20 rounded-full flex items-center justify-center text-primary-dark mb-4">
                   <User size={36} />
                 </div>
                 <h2 className="font-heading font-extrabold text-xl text-slate-900">{profile?.name || '候補者'}</h2>
                 <p className="text-sm text-slate-500 font-medium mt-1">プロフィールと求人を管理</p>
              </div>
              
              <nav className="space-y-2">
                <a 
                  href="#saved-jobs" 
                  className={`flex items-center p-3 rounded-xl font-bold transition-all ${activeTab === 'saved-jobs' ? 'text-primary-dark bg-accent/20' : 'text-slate-600 hover:bg-slate-50'}`}
                >
                  <Bookmark className="mr-3" size={20} /> {t('profile.saved_jobs')}
                </a>
                <a 
                  href="#profile" 
                  className={`flex items-center p-3 rounded-xl font-bold transition-all ${activeTab === 'profile' ? 'text-primary-dark bg-accent/20' : 'text-slate-600 hover:bg-slate-50'}`}
                >
                  <Settings className="mr-3" size={20} /> {t('profile.edit_profile')}
                </a>
              </nav>
            </div>
          </div>
          
          <div className="lg:col-span-3">
            {activeTab === 'saved-jobs' && (
              <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 p-8">
                <h3 className="text-2xl font-extrabold font-heading text-slate-900 mb-8 tracking-tight">{t('profile.saved_jobs')}</h3>
                <div className="space-y-6">
                  {savedJobs.map(job => (
                    <div key={job.id} className="relative group">
                      <JobCard job={job} />
                      <button className="absolute top-4 right-4 text-slate-400 hover:text-red-500 bg-white border border-slate-100 p-2 rounded-xl shadow-sm hover:shadow-md transition-all z-10 opacity-0 group-hover:opacity-100">
                        削除
                      </button>
                    </div>
                  ))}
                  {savedJobs.length === 0 && (
                    <div className="text-center py-12">
                      <Bookmark className="mx-auto h-12 w-12 text-slate-300 mb-4" />
                      <p className="text-slate-500 font-medium">保存した求人がありません</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'profile' && (
              <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 p-8">
                <div className="flex justify-between items-center mb-8 border-b border-slate-100 pb-6">
                  <h3 className="text-2xl font-extrabold font-heading text-slate-900 tracking-tight">{t('profile.personal_info')}</h3>
                  {saveSuccess && (
                     <span className="flex items-center text-sm font-bold text-primary bg-primary/10 px-3 py-1.5 rounded-lg">
                       <CheckCircle2 size={16} className="mr-1.5" /> 保存しました！
                     </span>
                  )}
                </div>

                <form onSubmit={handleSubmit(onSubmitProfile)} className="space-y-8">
                  <div>
                    <h4 className="text-lg font-bold text-slate-900 mb-4 flex items-center"><User size={18} className="mr-2 text-primary" /> {t('profile.personal_info')}</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1.5">{t('profile.family_name')} <span className="text-red-500">*</span></label>
                        <input {...register('family_name', { required: true })} className="input-base" placeholder="山田" />
                        {errors.family_name && <span className="text-red-500 text-xs mt-1">{t('errors.required_field')}</span>}
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1.5">{t('profile.given_name')} <span className="text-red-500">*</span></label>
                        <input {...register('given_name', { required: true })} className="input-base" placeholder="太郎" />
                        {errors.given_name && <span className="text-red-500 text-xs mt-1">{t('errors.required_field')}</span>}
                      </div>
                      <div>
                        <KanaInput
                          label={t('profile.family_name_kana')}
                          value={watch('family_name_kana')}
                          onChange={(val) => setValue('family_name_kana', val)}
                          required
                        />
                      </div>
                      <div>
                        <KanaInput
                          label={t('profile.given_name_kana')}
                          value={watch('given_name_kana')}
                          onChange={(val) => setValue('given_name_kana', val)}
                          required
                        />
                      </div>
                      <div className="col-span-2">
                        <label className="block text-sm font-bold text-slate-700 mb-1.5">{t('profile.email')}</label>
                        <input type="email" {...register('contact_email')} className="input-base" placeholder="email@example.com" />
                      </div>
                      <div className="col-span-2">
                        <label className="block text-sm font-bold text-slate-700 mb-1.5">{t('profile.phone')}</label>
                        <input {...register('phone')} className="input-base" placeholder="090-1234-5678" />
                      </div>
                      <div className="col-span-2">
                        <label className="block text-sm font-bold text-slate-700 mb-1.5">{t('profile.best_contact_time')}</label>
                        <select {...register('best_contact_time')} className="input-base">
                          <option value="">選択...</option>
                          <option value="morning">{t('contact_time.morning')}</option>
                          <option value="afternoon">{t('contact_time.afternoon')}</option>
                          <option value="evening">{t('contact_time.evening')}</option>
                          <option value="any_time">{t('contact_time.any_time')}</option>
                        </select>
                      </div>
                      <div className="col-span-2 md:col-span-1">
                        <label className="block text-sm font-bold text-slate-700 mb-1.5">{t('profile.age')}</label>
                        <input type="number" {...register('age', { valueAsNumber: true })} className="input-base" placeholder="25" />
                      </div>
                      <div className="col-span-2 md:col-span-1">
                        <label className="block text-sm font-bold text-slate-700 mb-1.5">{t('profile.gender')}</label>
                        <select {...register('gender')} className="input-base">
                          <option value="">選択...</option>
                          <option value="male">{t('gender.male')}</option>
                          <option value="female">{t('gender.female')}</option>
                          <option value="other">{t('gender.other')}</option>
                          <option value="prefer_not_to_say">{t('gender.prefer_not_to_say')}</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <hr className="border-slate-100" />

                  <div>
                    <h4 className="text-lg font-bold text-slate-900 mb-4 flex items-center"><User size={18} className="mr-2 text-primary" /> {t('visa.title')}</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1.5">{t('visa.type')}</label>
                        <select {...register('visa_type')} className="input-base">
                          <option value="">選択...</option>
                          {JAPANESE_VISA_TYPES.map(visa => (
                            <option key={visa.value} value={visa.value}>{visa.label}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1.5">{t('visa.expiry_date')}</label>
                        <input type="date" {...register('visa_expiry_date')} className="input-base text-slate-500" />
                      </div>
                    </div>
                  </div>

                  <hr className="border-slate-100" />

                  <div>
                    <h4 className="text-lg font-bold text-slate-900 mb-4 flex items-center"><User size={18} className="mr-2 text-primary" /> {t('profile.address')}</h4>
                    <PostalCodeInput
                      postalCode={watch('postal_code')}
                      onChange={(val) => setValue('postal_code', val)}
                      onAddressFill={(addr) => {
                        setValue('prefecture', addr.prefecture);
                        setValue('city', addr.city);
                        setValue('town', addr.town);
                        setAddressData(addr);
                      }}
                      prefecture={addressData.prefecture}
                      city={addressData.city}
                      town={addressData.town}
                    />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                      <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1.5">{t('profile.street')}</label>
                        <input {...register('street')} className="input-base" placeholder="1-2-3" />
                      </div>
                    </div>
                  </div>

                  <hr className="border-slate-100" />

                  <div>
                    <h4 className="text-lg font-bold text-slate-900 mb-6 flex items-center"><User size={18} className="mr-2 text-primary" /> {t('japanese_level.title')}</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2">
                       {renderLvlSlider('japanese_level_communication', t('japanese_level.communication'), control)}
                       {renderLvlSlider('japanese_level_hiragana', t('japanese_level.hiragana'), control)}
                       {renderLvlSlider('japanese_level_katakana', t('japanese_level.katakana'), control)}
                       {renderLvlSlider('japanese_level_kanji', t('japanese_level.kanji'), control)}
                    </div>
                  </div>

                  <div className="pt-6 flex justify-end pb-8">
                    <button 
                      type="submit" 
                      disabled={loading}
                      className="btn-primary w-full md:w-auto min-w-[200px]"
                    >
                      {loading ? <Loader2 className="animate-spin mx-auto" size={24} /> : t('common.save')}
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
