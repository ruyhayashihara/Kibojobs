import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '../store/index.js';
import LanguageSwitcher from './LanguageSwitcher.jsx';
import { Briefcase, Menu, UserCircle } from 'lucide-react';

const Header = () => {
  const { t } = useTranslation();
  const { session, profile, logout } = useAuthStore();

  return (
    <header className="bg-white border-b border-gray-100 sticky top-0 z-40 bg-opacity-90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <div className="bg-primary text-white p-1.5 rounded-lg">
                <Briefcase size={24} strokeWidth={2.5} />
              </div>
              <span className="font-heading font-bold text-xl tracking-tight text-gray-900">
                Vagas<span className="text-primary">JP</span>
              </span>
            </Link>
            
            <nav className="hidden md:flex ml-10 space-x-8">
              <Link to="/vagas" className="text-gray-600 hover:text-primary font-medium transition-colors">
                {t('nav.jobs')}
              </Link>
              <Link to="/empresas" className="text-gray-600 hover:text-primary font-medium transition-colors">
                {t('nav.companies')}
              </Link>
            </nav>
          </div>
          
          <div className="hidden md:flex items-center space-x-6">
            <LanguageSwitcher />
            
            {session ? (
              <div className="flex items-center space-x-4">
                <Link to={profile?.role === 'company' ? '/empresa/dashboard' : '/dashboard'} className="text-gray-600 hover:text-primary font-medium transition-colors">
                  {t('nav.dashboard')}
                </Link>
                <div className="relative group">
                  <button className="flex items-center space-x-2 focus:outline-none">
                    {profile?.avatar_url ? (
                      <img src={profile.avatar_url} alt="Avatar" className="w-8 h-8 rounded-full border border-gray-200" />
                    ) : (
                      <UserCircle size={32} className="text-gray-400" />
                    )}
                  </button>
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 p-2 border border-gray-100">
                    <button
                      onClick={logout}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded"
                    >
                      Sair
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link to="/login" className="text-gray-600 hover:text-primary font-medium transition-colors">
                  {t('common.login')}
                </Link>
                <Link to="/cadastro" className="btn-primary">
                  {t('common.register')}
                </Link>
              </div>
            )}
          </div>
          
          <div className="flex md:hidden items-center space-x-4">
            <LanguageSwitcher />
            <button className="text-gray-600 hover:text-gray-900">
              <Menu size={24} />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
