import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import JobCard from '../components/JobCard.jsx';
import AdSlot from '../components/AdSlot.jsx';
import { Search, MapPin, Filter } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { JAPANESE_JOB_TYPES, JAPANESE_WORK_MODES } from '../utils/japaneseUtils';

const JobListings = () => {
  const { t } = useTranslation();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('jobs')
        .select('*, companies(name, logo_url)')
        .eq('is_active', true)
        .order('is_featured', { ascending: false })
        .order('created_at', { ascending: false });
        
      if (!error && data) {
        setJobs(data);
      } else {
        setJobs([
          { id: '1', title: 'React Developer', companies: { name: 'Acme Corp' }, location: 'Tokyo', work_mode: 'hybrid', job_type: 'seishain', salary_min: 400000, salary_max: 600000, is_featured: true, created_at: new Date().toISOString() },
          { id: '2', title: 'Senior Engineer', companies: { name: 'Global Tech' }, location: 'Remote', work_mode: 'remote', job_type: 'keiyaku', salary_min: 700000, created_at: new Date(Date.now() - 86400000 * 2).toISOString() },
        ]);
      }
      setLoading(false);
    };
    
    fetchJobs();
  }, []);

  return (
    <div className="bg-base min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 p-3 mb-10 overflow-hidden">
          <div className="flex flex-col md:flex-row gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-3.5 h-6 w-6 text-slate-400" />
              <input type="text" placeholder={t('home.search_placeholder')} className="w-full pl-12 pr-4 py-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-accent font-medium text-slate-900 outline-none transition-colors hover:bg-slate-100" />
            </div>
            <div className="flex-1 relative">
              <MapPin className="absolute left-4 top-3.5 h-6 w-6 text-slate-400" />
              <input type="text" placeholder={t('home.location_placeholder')} className="w-full pl-12 pr-4 py-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-accent font-medium text-slate-900 outline-none transition-colors hover:bg-slate-100" />
            </div>
            <button className="btn-primary">
              {t('home.search_button')}
            </button>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-10">
          <div className="w-full lg:w-1/4">
            <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 p-8 sticky top-28">
              <div className="flex items-center space-x-3 mb-8 border-b border-slate-100 pb-5">
                <div className="p-2 bg-slate-50 rounded-lg">
                  <Filter size={20} className="text-slate-600" />
                </div>
                <h3 className="font-heading font-extrabold text-xl text-slate-900 tracking-tight">{t('jobs.filters')}</h3>
              </div>
              
              <div className="space-y-8">
                <div>
                  <h4 className="font-bold text-slate-900 mb-4">{t('jobs.work_mode')}</h4>
                  <div className="space-y-3">
                    {JAPANESE_WORK_MODES.map(mode => (
                      <label key={mode.value} className="flex items-center cursor-pointer group">
                        <input type="checkbox" className="rounded border-slate-200 text-primary focus:ring-accent w-5 h-5 transition-shadow" />
                        <span className="ml-3 text-slate-600 font-medium group-hover:text-slate-900 transition-colors">{mode.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="font-bold text-slate-900 mb-4">{t('jobs.contract_type')}</h4>
                  <div className="space-y-3">
                    {JAPANESE_JOB_TYPES.map(type => (
                      <label key={type.value} className="flex items-center cursor-pointer group">
                        <input type="checkbox" className="rounded border-slate-200 text-primary focus:ring-accent w-5 h-5 transition-shadow" />
                        <span className="ml-3 text-slate-600 font-medium group-hover:text-slate-900 transition-colors">{type.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex-1">
            <div className="mb-6 flex justify-between items-center">
              <h2 className="text-2xl font-heading font-extrabold text-slate-900 tracking-tight">{jobs.length}件の求人</h2>
              <select className="border-none bg-white shadow-sm ring-1 ring-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-accent py-2.5 px-4 outline-none">
                <option>新着順</option>
                <option>給与高い順</option>
              </select>
            </div>
            
            {loading ? (
              <div className="space-y-6">
                {[1, 2, 3].map(i => (
                  <div key={i} className="bg-white rounded-3xl h-40 animate-pulse border border-slate-100 shadow-sm"></div>
                ))}
              </div>
            ) : (
              <div className="space-y-6">
                {jobs.map((job, index) => (
                  <React.Fragment key={job.id}>
                    <JobCard job={job} />
                    {index > 0 && index % 5 === 0 && (
                      <div className="py-4">
                         <AdSlot size="native" />
                      </div>
                    )}
                  </React.Fragment>
                ))}
              </div>
            )}
            
            {!loading && jobs.length === 0 && (
              <div className="bg-white text-center py-24 rounded-3xl border border-slate-100 shadow-sm">
                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="text-slate-300" size={32} />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">{t('jobs.no_jobs_found')}</h3>
                <p className="text-slate-500 font-medium">{t('jobs.try_adjust_filters')}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobListings;
