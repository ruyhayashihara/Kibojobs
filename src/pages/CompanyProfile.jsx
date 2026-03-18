import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import JobCard from '../components/JobCard.jsx';
import { MapPin, Globe, Users, Building } from 'lucide-react';

const CompanyProfile = () => {
  const { slug } = useParams();
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCompany = async () => {
      setLoading(true);
      const { data: compData } = await supabase
        .from('companies')
        .select('*, jobs(*)')
        .eq('slug', slug)
        .single();
        
      if (compData) {
        setCompany(compData);
      } else {
        // mock
        setCompany({
          name: 'TechCorp Brasil',
          slug,
          description: 'A TechCorp é líder em inovação para o mercado de e-commerce na América Latina.',
          logo_url: null,
          banner_url: null,
          website: 'https://techcorp.com.br',
          location: 'São Paulo, SP',
          jobs: [
            { id: '1', title: 'Desenvolvedor Frontend', location: 'Remoto', work_mode: 'remote', job_type: 'CLT', salary_min: 8000, salary_max: 12000, company_id: '123' }
          ]
        });
      }
      setLoading(false);
    };
    
    fetchCompany();
  }, [slug]);

  if (loading) return <div className="py-20 text-center">Carregando...</div>;
  if (!company) return <div className="py-20 text-center text-gray-500">Empresa não encontrada</div>;

  return (
    <div className="bg-gray-50 min-h-screen pb-12">
      {/* Banner */}
      <div className="h-64 bg-primary relative overflow-hidden">
        {company.banner_url && (
          <img src={company.banner_url} alt="Banner" className="w-full h-full object-cover mix-blend-overlay" />
        )}
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 relative z-10">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
          <div className="flex flex-col md:flex-row gap-6 items-start">
            <div className="w-32 h-32 bg-white rounded-xl shadow-md border border-gray-100 flex items-center justify-center overflow-hidden flex-shrink-0">
              {company.logo_url ? (
                <img src={company.logo_url} alt={company.name} className="w-full h-full object-contain p-2" />
              ) : (
                <Building size={48} className="text-gray-300" />
              )}
            </div>
            
            <div className="flex-1">
              <h1 className="text-3xl font-heading font-bold text-gray-900 mb-2">{company.name}</h1>
              <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-4">
                {company.location && <span className="flex items-center"><MapPin size={16} className="mr-1.5" /> {company.location}</span>}
                {company.website && <a href={company.website} target="_blank" rel="noreferrer" className="flex items-center hover:text-primary"><Globe size={16} className="mr-1.5" /> Website</a>}
                <span className="flex items-center"><Users size={16} className="mr-1.5" /> 50-200 funcionários</span>
              </div>
              <p className="text-gray-700 max-w-3xl leading-relaxed">
                {company.description}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8">
          <h2 className="text-2xl font-bold font-heading text-gray-900 mb-6">Vagas Abertas na {company.name}</h2>
          
          <div className="space-y-4">
            {company.jobs?.length > 0 ? (
              company.jobs.map(job => (
                <JobCard key={job.id} job={{...job, companies: company}} />
              ))
            ) : (
              <div className="bg-white p-8 rounded-xl text-center border border-gray-200">
                <p className="text-gray-500">Nenhuma vaga aberta no momento.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyProfile;
