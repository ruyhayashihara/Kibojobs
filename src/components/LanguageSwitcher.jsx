import React from 'react';
import { useTranslation } from 'react-i18next';
import { Globe } from 'lucide-react';

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  return (
    <div className="relative group inline-block">
      <button className="flex items-center space-x-1 text-gray-600 hover:text-primary transition-colors">
        <Globe size={20} />
        <span className="uppercase text-sm font-medium">{i18n.language.split('-')[0]}</span>
      </button>
      <div className="absolute right-0 mt-2 w-32 bg-white rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 p-1 border border-gray-100">
        <button
          onClick={() => changeLanguage('pt-BR')}
          className={`block w-full text-left px-4 py-2 text-sm rounded cursor-pointer hover:bg-gray-50 ${i18n.language === 'pt-BR' ? 'text-primary font-medium bg-blue-50/50' : 'text-gray-700'}`}
        >
          Português
        </button>
        <button
          onClick={() => changeLanguage('en')}
          className={`block w-full text-left px-4 py-2 text-sm rounded cursor-pointer hover:bg-gray-50 ${i18n.language === 'en' ? 'text-primary font-medium bg-blue-50/50' : 'text-gray-700'}`}
        >
          English
        </button>
        <button
          onClick={() => changeLanguage('es')}
          className={`block w-full text-left px-4 py-2 text-sm rounded cursor-pointer hover:bg-gray-50 ${i18n.language === 'es' ? 'text-primary font-medium bg-blue-50/50' : 'text-gray-700'}`}
        >
          Español
        </button>
      </div>
    </div>
  );
};

export default LanguageSwitcher;
