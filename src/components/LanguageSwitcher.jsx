import React from 'react';
import { useTranslation } from 'react-i18next';
import { Globe, ChevronDown } from 'lucide-react';

const languages = [
  { code: 'en', name: 'English', flag: 'EN' },
  { code: 'ja', name: '日本語', flag: 'JP' },
];

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();
  const currentLang = languages.find(l => l.code === i18n.language) || languages[0];

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  return (
    <div className="relative group">
      <button className="flex items-center space-x-1.5 text-gray-600 hover:text-primary transition-colors py-2 px-3 rounded-lg hover:bg-slate-50">
        <Globe size={18} />
        <span className="text-sm font-medium">{currentLang.flag}</span>
        <ChevronDown size={14} className="opacity-60" />
      </button>
      <div className="absolute right-0 mt-2 w-40 bg-white rounded-xl shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 p-1.5 border border-gray-100">
        {languages.map((lang) => (
          <button
            key={lang.code}
            onClick={() => changeLanguage(lang.code)}
            className={`block w-full text-left px-4 py-2.5 text-sm rounded-lg cursor-pointer hover:bg-slate-50 transition-colors ${i18n.language === lang.code ? 'text-primary font-medium bg-primary/5' : 'text-gray-700'}`}
          >
            <span className="mr-2 opacity-60">{lang.flag}</span>
            {lang.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default LanguageSwitcher;
