import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../store/index';
import { supabase } from '../lib/supabase';
import JobCard from '../components/JobCard';
import { Bookmark, User } from 'lucide-react';

const UserDashboard = () => {
  const { profile } = useAuthStore();
  const [savedJobs, setSavedJobs] = useState([]);
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    // This would fetch saved jobs and applications linked to this user
    // mock for now
    setSavedJobs([
      { id: '1', title: 'Desenvolvedor React Pleno', companies: { name: 'Acme Corp' }, location: 'São Paulo, SP', work_mode: 'hybrid', job_type: 'CLT', salary_min: 8000, salary_max: 12000 }
    ]);
  }, []);

  if (profile && profile.role !== 'seeker') {
    return <div className="p-10 text-center">Dashboard restrito para candidatos.</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-3xl font-heading font-bold text-gray-900 mb-8">Meu Painel</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Sidebar */}
        <div className="md:col-span-1">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center space-x-4 mb-6">
               <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-primary">
                 <User size={32} />
               </div>
               <div>
                 <h2 className="font-bold text-gray-900">{profile?.name || 'Candidato'}</h2>
                 <p className="text-sm text-gray-500">Gerencie seu perfil</p>
               </div>
            </div>
            
            <nav className="space-y-2">
              <a href="#vagas-salvas" className="flex items-center p-3 text-primary bg-blue-50 rounded-lg font-medium">
                <Bookmark className="mr-3" size={20} /> Vagas Salvas
              </a>
              {/* <a href="#candidaturas" className="flex items-center p-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
                <Send className="mr-3 text-gray-400" size={20} /> Minhas Candidaturas
              </a> */}
              <a href="#perfil" className="flex items-center p-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
                <User className="mr-3 text-gray-400" size={20} /> Editar Perfil
              </a>
            </nav>
          </div>
        </div>
        
        {/* Main content */}
        <div className="md:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
            <h3 className="text-xl font-bold font-heading text-gray-900 mb-6">Vagas Salvas</h3>
            <div className="space-y-4">
              {savedJobs.map(job => (
                <div key={job.id} className="relative">
                  <JobCard job={job} />
                  <button className="absolute top-4 right-4 text-red-500 hover:text-red-700 bg-white p-1 rounded-full shadow-sm hover:shadow-md transition-all">
                    Remover
                  </button>
                </div>
              ))}
              {savedJobs.length === 0 && (
                <p className="text-gray-500">Você ainda não tem vagas salvas.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
