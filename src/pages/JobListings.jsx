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
          { id: '1', title: 'Desenvolvedor React Pleno', companies: { name: 'Acme Corp' }, location: 'São Paulo, SP', work_mode: 'hybrid', job_type: 'CLT', salary_min: 8000, salary_max: 12000, is_featured: true, created_at: new Date().toISOString() },
          { id: '2', title: 'Engenheiro de Software Sênior', companies: { name: 'Global Tech' }, location: 'Remoto', work_mode: 'remote', job_type: 'PJ', salary_min: 15000, created_at: new Date(Date.now() - 86400000 * 2).toISOString() },
        ]);
      }
      setLoading(false);
    };
    
    fetchJobs();
  }, []);

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Search Header */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input type="text" placeholder="Cargo, palavra-chave ou empresa" className="w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary" />
            </div>
            <div className="flex-1 relative">
              <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input type="text" placeholder="Localização" className="w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary" />
            </div>
            <button className="bg-primary hover:bg-primary-dark text-white font-medium py-2 px-8 rounded-lg transition-colors">
              Buscar
            </button>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="w-full lg:w-1/4">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-24">
              <div className="flex items-center space-x-2 mb-6 border-b pb-4">
                <Filter size={20} className="text-gray-500" />
                <h3 className="font-bold text-gray-900">Filtros</h3>
              </div>
              
              <div className="space-y-6">
                <div>
                  <h4 className="font-medium text-sm text-gray-900 mb-3">Modelo de Trabalho</h4>
                  <div className="space-y-2">
                    {['Remoto', 'Híbrido', 'Presencial'].map(mode => (
                      <label key={mode} className="flex items-center">
                        <input type="checkbox" className="rounded text-primary focus:ring-primary border-gray-300" />
                        <span className="ml-2 text-sm text-gray-600">{mode}</span>
                      </label>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium text-sm text-gray-900 mb-3">Tipo de Contrato</h4>
                  <div className="space-y-2">
                    {['CLT', 'PJ', 'Freelance', 'Estágio'].map(type => (
                      <label key={type} className="flex items-center">
                        <input type="checkbox" className="rounded text-primary focus:ring-primary border-gray-300" />
                        <span className="ml-2 text-sm text-gray-600">{type}</span>
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
              <h2 className="text-xl font-bold text-gray-900">{jobs.length} vagas encontradas</h2>
              <select className="border-gray-300 rounded-md text-sm focus:border-primary focus:ring-primary">
                <option>Mais recentes</option>
                <option>Maior salário</option>
              </select>
            </div>
            
            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3].map(i => (
                  <div key={i} className="bg-white rounded-xl h-32 animate-pulse border border-gray-200"></div>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {jobs.map((job, index) => (
                  <React.Fragment key={job.id}>
                    <JobCard job={job} />
                    {index > 0 && index % 5 === 0 && (
                      <div className="py-2">
                         <AdSlot size="native" />
                      </div>
                    )}
                  </React.Fragment>
                ))}
              </div>
            )}
            
            {!loading && jobs.length === 0 && (
              <div className="bg-white text-center py-16 rounded-xl border border-gray-200">
                <p className="text-gray-500">Nenhuma vaga encontrada com os filtros atuais.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobListings;
