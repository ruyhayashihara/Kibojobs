import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import JobCard from '../components/JobCard.jsx';
import AdSlot from '../components/AdSlot.jsx';
import { Search, MapPin, Filter } from 'lucide-react';

const JobListings = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // mock for now
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
        // Fallback mock if data doesn't exist yet
        setJobs([
          { id: '1', title: 'Desenvolvedor React Pleno', companies: { name: 'Acme Corp' }, location: 'Tokyo, JP', work_mode: 'Híbrido', job_type: 'Full-time', salary_min: 400000, salary_max: 600000, is_featured: true, created_at: new Date().toISOString() },
          { id: '2', title: 'Engenheiro de Software Sênior', companies: { name: 'Global Tech' }, location: 'Remoto', work_mode: 'Remoto', job_type: 'Contract', salary_min: 700000, created_at: new Date(Date.now() - 86400000 * 2).toISOString() },
        ]);
      }
      setLoading(false);
    };
    
    fetchJobs();
  }, []);

  return (
    <div className="bg-base min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Search Header */}
        <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 p-3 mb-10 overflow-hidden">
          <div className="flex flex-col md:flex-row gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-3.5 h-6 w-6 text-slate-400" />
              <input type="text" placeholder="Cargo, palavra-chave ou empresa" className="w-full pl-12 pr-4 py-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-accent font-medium text-slate-900 outline-none transition-colors hover:bg-slate-100" />
            </div>
            <div className="flex-1 relative">
              <MapPin className="absolute left-4 top-3.5 h-6 w-6 text-slate-400" />
              <input type="text" placeholder="Localização" className="w-full pl-12 pr-4 py-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-accent font-medium text-slate-900 outline-none transition-colors hover:bg-slate-100" />
            </div>
            <button className="btn-primary">
              Buscar
            </button>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-10">
          {/* Filters Sidebar */}
          <div className="w-full lg:w-1/4">
            <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 p-8 sticky top-28">
              <div className="flex items-center space-x-3 mb-8 border-b border-slate-100 pb-5">
                <div className="p-2 bg-slate-50 rounded-lg">
                  <Filter size={20} className="text-slate-600" />
                </div>
                <h3 className="font-heading font-extrabold text-xl text-slate-900 tracking-tight">Filtros</h3>
              </div>
              
              <div className="space-y-8">
                <div>
                  <h4 className="font-bold text-slate-900 mb-4">Modelo de Trabalho</h4>
                  <div className="space-y-3">
                    {['Remoto', 'Híbrido', 'Presencial'].map(mode => (
                      <label key={mode} className="flex items-center cursor-pointer group">
                        <input type="checkbox" className="rounded border-slate-200 text-primary focus:ring-accent w-5 h-5 transition-shadow" />
                        <span className="ml-3 text-slate-600 font-medium group-hover:text-slate-900 transition-colors">{mode}</span>
                      </label>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="font-bold text-slate-900 mb-4">Tipo de Contrato</h4>
                  <div className="space-y-3">
                    {['CLT', 'PJ', 'Freelance', 'Estágio'].map(type => (
                      <label key={type} className="flex items-center cursor-pointer group">
                        <input type="checkbox" className="rounded border-slate-200 text-primary focus:ring-accent w-5 h-5 transition-shadow" />
                        <span className="ml-3 text-slate-600 font-medium group-hover:text-slate-900 transition-colors">{type}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Job Results */}
          <div className="flex-1">
            <div className="mb-6 flex justify-between items-center">
              <h2 className="text-2xl font-heading font-extrabold text-slate-900 tracking-tight">{jobs.length} vagas encontradas</h2>
              <select className="border-none bg-white shadow-sm ring-1 ring-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-accent py-2.5 px-4 outline-none">
                <option>Mais recentes</option>
                <option>Maior salário</option>
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
                <h3 className="text-xl font-bold text-slate-900 mb-2">Nenhuma vaga encontrada</h3>
                <p className="text-slate-500 font-medium">Tente ajustar seus filtros para ver mais resultados.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobListings;
