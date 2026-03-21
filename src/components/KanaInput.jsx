import React from 'react';
import { useTranslation } from 'react-i18next';
import { AlertCircle } from 'lucide-react';

const KanaInput = ({ 
  label, 
  value, 
  onChange, 
  error,
  placeholder,
  required = false 
}) => {
  const { t } = useTranslation();

  const handleChange = (e) => {
    let value = e.target.value;
    value = value.replace(/[a-zA-Z0-9]/g, '');
    onChange(value);
  };

  return (
    <div>
      <label className="block text-sm font-bold text-slate-700 mb-1.5">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        type="text"
        value={value}
        onChange={handleChange}
        placeholder={placeholder || 'カタカナで入力'}
        className={`input-base ${error ? 'border-red-300 focus:ring-red-200' : ''}`}
      />
      {error && (
        <div className="flex items-center text-red-500 text-sm mt-1">
          <AlertCircle size={14} className="mr-1" />
          {error}
        </div>
      )}
      <p className="text-xs text-slate-400 mt-1">
        ひらがなまたはカタカナで入力してください
      </p>
    </div>
  );
};

export default KanaInput;
