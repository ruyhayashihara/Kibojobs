import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Briefcase, Building } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export const formatCurrency = (value) => {
  if (!value) return null;
  return new Intl.NumberFormat('ja-JP', { style: 'currency', currency: 'JPY' }).format(value);
};

const JobCard = ({ job }) => {
  const isFeatured = job.is_featured;

  return (
    <Link 
      to={`/vagas/${job.id}`} 
      className={`block bg-white ${isFeatured ? 'border-primary ring-1 ring-primary/10 shadow-[0_8px_30px_rgb(0,0,0,0.06)]' : 'border-slate-100 hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:-translate-y-0.5'} border rounded-2xl p-6 transition-all duration-300 group`}
    >
      <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
        <div className="flex space-x-5 w-full">
          <div className="w-16 h-16 bg-slate-50 border border-slate-100/50 rounded-xl flex items-center justify-center flex-shrink-0 overflow-hidden p-2 group-hover:scale-105 transition-transform duration-300">
            {job.companies?.logo_url ? (
               <img src={job.companies.logo_url} alt={job.companies.name} className="w-full h-full object-contain" />
            ) : (
               <Building className="text-slate-300" size={32} />
            )}
          </div>
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <h3 className="text-xl font-heading font-extrabold text-slate-900 group-hover:text-primary transition-colors tracking-tight">{job.title}</h3>
              {isFeatured && <span className="bg-accent/20 text-primary-dark text-xs px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider">Top Vaga</span>}
            </div>
            
            <p className="text-slate-500 font-medium mb-3">{job.companies?.name}</p>
            
            <div className="flex flex-wrap items-center gap-2 text-sm">
              <span className="flex items-center text-slate-500 font-medium bg-slate-50 px-3 py-1 rounded-lg border border-slate-100/50">
                <MapPin className="w-4 h-4 mr-1.5 opacity-70" /> {job.location || 'Não especificado'}
              </span>
              <span className="bg-accent/10 border border-accent/20 text-primary-dark px-3 py-1 rounded-lg font-bold">
                {job.work_mode}
              </span>
              <span className="bg-slate-50 border border-slate-100/50 text-slate-600 px-3 py-1 rounded-lg font-medium">
                {job.job_type}
              </span>
            </div>
          </div>
        </div>
        
        <div className="text-left sm:text-right flex flex-row sm:flex-col justify-between items-center sm:items-end w-full sm:w-auto h-full pt-4 sm:pt-0 mt-4 sm:mt-0 border-t sm:border-t-0 border-slate-100">
          {(job.salary_min || job.salary_max) ? (
             <span className="text-base font-extrabold text-slate-900">
               {formatCurrency(job.salary_min)} {job.salary_max ? `- ${formatCurrency(job.salary_max)}` : ''}
             </span>
          ) : (
             <span className="text-sm font-medium text-slate-400">Salário a Combinar</span>
          )}
          
          <div className="flex items-center gap-4 mt-2">
            <p className="text-xs font-medium text-slate-400">
              {job.created_at ? formatDistanceToNow(new Date(job.created_at), { addSuffix: true, locale: ptBR }) : ''}
            </p>
            <span className="hidden sm:flex text-primary font-bold text-sm items-center opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
              Ver Detalhes &rarr;
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default JobCard;
