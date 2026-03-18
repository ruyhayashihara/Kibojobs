import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../store/index';
// import { supabase } from '../lib/supabase';
import { Plus, Briefcase, Settings } from 'lucide-react';

const CompanyDashboard = () => {
  const { profile } = useAuthStore();
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    // mock active listings
    setJobs([
      { id: '1', title: 'Desenvolvedor React Pleno', status: 'active', views: 120, applications: 15 },
    ]);
  }, []);

  if (profile && profile.role !== 'company') {
    return <div className="p-10 text-center">Dashboard restrito para empresas.</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-heading font-bold text-gray-900">Painel da Empresa</h1>
        <button className="btn-primary flex items-center">
          <Plus size={20} className="mr-2" /> Nova Vaga
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="md:col-span-1">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sticky top-24">
            <nav className="space-y-2">
              <a href="#dashboard" className="flex items-center p-3 text-primary bg-blue-50 rounded-lg font-medium">
                <Briefcase className="mr-3" size={20} /> Vagas Publicadas
              </a>
              <a href="#perfil" className="flex items-center p-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
                <Settings className="mr-3 text-gray-400" size={20} /> Perfil da Empresa
              </a>
            </nav>
          </div>
        </div>
        
        <div className="md:col-span-3 space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
              <h3 className="font-bold text-gray-900">Suas Vagas Abertas</h3>
            </div>
            
            <div className="divide-y divide-gray-100">
              {jobs.map(job => (
                <div key={job.id} className="p-6 hover:bg-gray-50 transition-colors flex justify-between items-center">
                  <div>
                    <h4 className="font-bold text-gray-900 text-lg">{job.title}</h4>
                    <div className="flex space-x-4 mt-2 text-sm text-gray-500">
                      <span>Status: <strong className="text-green-600">Ativa</strong></span>
                      <span>Visualizações: {job.views}</span>
                      <span>Candidaturas: {job.applications}</span>
                    </div>
                  </div>
                  <div className="flex space-x-3 text-sm">
                    <button className="text-gray-600 hover:text-primary transition-colors">Editar</button>
                    <button className="text-red-600 hover:text-red-800 transition-colors">Pausar</button>
                  </div>
                </div>
              ))}
              {jobs.length === 0 && (
                <div className="p-8 text-center text-gray-500">
                  Nenhuma vaga publicada.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyDashboard;
