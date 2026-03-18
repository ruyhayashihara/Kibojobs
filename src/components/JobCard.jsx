import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Briefcase, Building } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export const formatCurrency = (value) => {
  if (!value) return null;
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
};

const JobCard = ({ job }) => {
  const isFeatured = job.is_featured;

  return (
    <Link 
      to={`/vagas/${job.id}`} 
      className={`block bg-white border ${isFeatured ? 'border-primary ring-1 ring-primary/20 shadow-md' : 'border-gray-200 hover:shadow-md hover:border-blue-300'} rounded-xl p-6 transition-all duration-200`}
    >
      <div className="flex justify-between items-start">
        <div className="flex space-x-4">
          <div className="w-14 h-14 bg-gray-50 border border-gray-100 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden">
            {job.companies?.logo_url ? (
               <img src={job.companies.logo_url} alt={job.companies.name} className="w-full h-full object-cover" />
            ) : (
               <Building className="text-gray-400" />
            )}
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="text-lg font-bold text-gray-900 group-hover:text-primary transition-colors">{job.title}</h3>
              {isFeatured && <span className="bg-primary/10 text-primary text-xs px-2 py-0.5 rounded font-medium">Destaque</span>}
            </div>
            
            <p className="text-gray-600 mt-1">{job.companies?.name}</p>
            
            <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-gray-500">
              <span className="flex items-center"><MapPin className="w-4 h-4 mr-1" /> {job.location || 'Não especificado'}</span>
              <span className="bg-blue-50 text-primary px-2 py-0.5 rounded font-medium">{job.work_mode}</span>
              <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded font-medium">{job.job_type}</span>
            </div>
          </div>
        </div>
        <div className="text-right flex flex-col justify-between h-full">
          {(job.salary_min || job.salary_max) && (
             <span className="text-sm font-semibold text-gray-900">
               {formatCurrency(job.salary_min)} {job.salary_max ? `- ${formatCurrency(job.salary_max)}` : ''}
             </span>
          )}
          <p className="text-xs text-gray-400 mt-2">
            {job.created_at ? formatDistanceToNow(new Date(job.created_at), { addSuffix: true, locale: ptBR }) : ''}
          </p>
        </div>
      </div>
    </Link>
  );
};

export default JobCard;
