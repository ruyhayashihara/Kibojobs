import React from 'react';
import { useTranslation } from 'react-i18next';
import { Search, MapPin, Briefcase } from 'lucide-react';
import AdSlot from '../components/AdSlot.jsx';

const Home = () => {
  const { t } = useTranslation();

  return (
    <div className="bg-white">
      {/* Asymmetric Hero Section */}
      <section className="pt-28 pb-20 px-4 sm:px-6 lg:px-8 bg-base relative overflow-hidden min-h-[85vh] flex items-center">
        {/* Decorative Grid/Lines */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#cbd5e1_1px,transparent_1px),linear-gradient(to_bottom,#cbd5e1_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-20"></div>
        
        <div className="max-w-7xl mx-auto relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center w-full">
          
          <div className="lg:col-span-7 flex flex-col items-start pr-0 lg:pr-12">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-heading font-extrabold text-primary-dark mb-6 tracking-tighter leading-[1.05]">
              O Próximo Passo da Sua <br/>
              <span className="text-primary italic relative inline-block">
                Carreira Tech.
                <div className="absolute -bottom-2 left-0 w-full h-3 bg-accent opacity-40 -z-10 rotate-1"></div>
              </span>
            </h1>
            <p className="text-lg md:text-xl text-slate-600 mb-10 max-w-2xl leading-relaxed">
              Conectamos talentos excepcionais com as melhores empresas do mercado. Esqueça layouts básicos, encontre as vagas que movem o ponteiro da sua carreira.
            </p>
            
            {/* Search Box - Asymmetric Floating */}
            <div className="w-full bg-white p-3 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-slate-100 flex flex-col md:flex-row gap-3 relative z-30 transition-transform hover:-translate-y-1 duration-500">
              <div className="flex-1 relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="text"
                  className="w-full pl-12 pr-4 py-4 rounded-xl border-none focus:ring-2 focus:ring-accent focus:outline-none text-slate-900 bg-slate-50 placeholder-slate-400 font-medium transition-colors hover:bg-slate-100"
                  placeholder={t('home.search_placeholder')}
                />
              </div>
              <div className="w-full md:w-1/3 relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <MapPin className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="text"
                  className="w-full pl-12 pr-4 py-4 rounded-xl border-none focus:ring-2 focus:ring-accent focus:outline-none text-slate-900 bg-slate-50 placeholder-slate-400 font-medium transition-colors hover:bg-slate-100"
                  placeholder={t('home.location_placeholder')}
                />
              </div>
              <button className="btn-primary flex-shrink-0 md:px-8 text-primary-dark">
                {t('home.search_button')}
              </button>
            </div>
          </div>
          
          {/* Asymmetric Visual Element (Cards overlay) */}
          <div className="lg:col-span-5 hidden lg:block relative h-[500px] w-full mt-10 lg:mt-0">
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-accent rounded-full blur-[100px] opacity-20"></div>
             
             <div className="absolute top-10 right-0 w-80 bg-white p-6 rounded-2xl shadow-[0_20px_40px_-5px_rgba(0,0,0,0.1)] border border-slate-100 transform rotate-3 hover:rotate-0 hover:z-30 transition-all duration-500 z-20 hover:-translate-y-4">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-accent/20 rounded-xl flex items-center justify-center">
                    <Briefcase className="text-primary" size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 leading-tight">Engenheiro Fullstack</h4>
                    <p className="text-sm text-slate-500">Acme Corp</p>
                  </div>
                </div>
                <div className="mt-4 flex gap-2">
                   <span className="px-3 py-1 bg-slate-100 rounded-full text-xs font-semibold text-slate-600">Remoto</span>
                   <span className="px-3 py-1 bg-accent/20 rounded-full text-xs font-bold text-primary-dark">¥ 400k+</span>
                </div>
             </div>
             
             <div className="absolute bottom-20 left-10 w-80 bg-white/70 backdrop-blur-md p-6 rounded-2xl shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] border border-slate-100 transform -rotate-6 hover:rotate-0 hover:z-30 transition-all duration-500 z-10 hover:-translate-y-4">
                <div className="flex items-center gap-4 mb-4 opacity-80">
                  <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center">
                    <Briefcase className="text-slate-400" size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 leading-tight">UX Designer Sênior</h4>
                    <p className="text-sm text-slate-500">Creative Hub</p>
                  </div>
                </div>
             </div>
          </div>
          
        </div>
      </section>

      {/* Main Content */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <AdSlot size="leaderboard" />
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <Briefcase className="mr-2 text-primary" /> Vagas Recentes
            </h2>
            <div className="space-y-4">
              {/* Job Card Placeholder */}
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md hover:border-blue-300 transition-all duration-200 cursor-pointer">
                  <div className="flex justify-between items-start">
                    <div className="flex space-x-4">
                      <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Briefcase className="text-gray-400" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-gray-900">Desenvolvedor Frontend Senior</h3>
                        <p className="text-gray-600">TechCorp Inc.</p>
                        <div className="mt-2 flex items-center space-x-4 text-sm text-gray-500">
                          <span className="flex items-center"><MapPin className="w-4 h-4 mr-1" /> Tokyo, JP</span>
                          <span className="bg-blue-50 text-primary px-2 py-0.5 rounded font-medium">Remote</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-semibold text-gray-900">¥ 300.000 - ¥ 500.000</span>
                      <p className="text-xs text-gray-400 mt-1">Há 2 dias</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-8 text-center">
              <button className="btn-secondary">Ver todas as vagas</button>
            </div>
          </div>
          
          <div className="w-full lg:w-1/3">
            <div className="sticky top-24">
              <AdSlot size="sidebar" />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
