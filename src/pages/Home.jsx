import React from 'react';
import { useTranslation } from 'react-i18next';
import { Search, MapPin, Briefcase } from 'lucide-react';
import AdSlot from '../components/AdSlot.jsx';

const Home = () => {
  const { t } = useTranslation();

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-dark via-primary to-blue-500 py-20 px-4 sm:px-6 lg:px-8 text-white text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-extrabold mb-6 tracking-tight">
            {t('home.hero_title')}
          </h1>
          <p className="text-lg md:text-xl text-blue-100 mb-10 max-w-2xl mx-auto">
            {t('home.hero_subtitle')}
          </p>
          
          <div className="bg-white p-2 rounded-xl shadow-xl flex flex-col md:flex-row gap-2 max-w-3xl mx-auto">
            <div className="flex-1 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="w-full pl-10 pr-3 py-3 rounded-lg border-0 focus:ring-2 focus:ring-primary text-gray-900 bg-gray-50/50 placeholder-gray-500"
                placeholder={t('home.search_placeholder')}
              />
            </div>
            <div className="w-full md:w-1/3 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MapPin className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="w-full pl-10 pr-3 py-3 rounded-lg border-0 focus:ring-2 focus:ring-primary text-gray-900 bg-gray-50/50 placeholder-gray-500"
                placeholder={t('home.location_placeholder')}
              />
            </div>
            <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-8 rounded-lg transition duration-150 ease-in-out">
              {t('home.search_button')}
            </button>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
                          <span className="flex items-center"><MapPin className="w-4 h-4 mr-1" /> São Paulo, SP</span>
                          <span className="bg-blue-50 text-primary px-2 py-0.5 rounded font-medium">Remote</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-semibold text-gray-900">R$ 10.000 - R$ 15.000</span>
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
