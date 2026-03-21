import React, { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Search, MapPin, Loader2, AlertCircle } from 'lucide-react';

const PostalCodeInput = ({ 
  postalCode, 
  onChange, 
  onAddressFill,
  prefecture,
  city,
  town,
  register,
  error
}) => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState(null);

  const searchAddress = useCallback(async (postalCodeInput) => {
    const cleaned = postalCodeInput.replace(/-/g, '').replace(/〒/g, '');
    
    if (cleaned.length !== 7) {
      return;
    }

    setLoading(true);
    setApiError(null);

    try {
      const response = await fetch(
        `https://zipcloud.ibsnet.co.jp/api/search?zipcode=${cleaned}`
      );
      const data = await response.json();

      if (data.status === 200 && data.results && data.results.length > 0) {
        const result = data.results[0];
        onAddressFill({
          prefecture: result.prefecturecode ? getPrefectureName(result.prefecturecode) : '',
          city: result.city || '',
          town: result.town || '',
        });
      } else {
        setApiError(t('address.cep_not_found'));
      }
    } catch (error) {
      console.error('CEP API Error:', error);
      setApiError(t('address.api_error'));
    } finally {
      setLoading(false);
    }
  }, [onAddressFill, t]);

  const handleInputChange = (e) => {
    let value = e.target.value;
    value = value.replace(/[^\d-]/g, '');
    
    if (value.length <= 3) {
      onChange(value);
    } else if (value.length <= 7) {
      onChange(`${value.slice(0, 3)}-${value.slice(3)}`);
    } else {
      onChange(value.slice(0, 8));
    }

    if (value.length === 7 || (value.includes('-') && value.replace(/-/g, '').length === 7)) {
      searchAddress(value);
    }
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-bold text-slate-700 mb-1.5">
        {t('profile.postal_code')}
      </label>
      <div className="relative">
        <div className="absolute left-3 top-1/2 -translate-y-1/2">
          {loading ? (
            <Loader2 className="animate-spin text-slate-400" size={18} />
          ) : (
            <Search className="text-slate-400" size={18} />
          )}
        </div>
        <input
          type="text"
          value={postalCode}
          onChange={handleInputChange}
          placeholder={t('address.enter_cep')}
          className="input-base pl-10 pr-20"
          maxLength={8}
        />
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-medium">
          〒
        </span>
      </div>
      
      {(error || apiError) && (
        <div className="flex items-center text-red-500 text-sm mt-1">
          <AlertCircle size={14} className="mr-1" />
          {apiError || error}
        </div>
      )}

      {prefecture && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1.5">
              {t('profile.prefecture')}
            </label>
            <input
              type="text"
              value={prefecture}
              readOnly
              className="input-base bg-slate-100"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1.5">
              {t('profile.city')}
            </label>
            <input
              type="text"
              value={city}
              readOnly
              className="input-base bg-slate-100"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1.5">
              {t('profile.town')}
            </label>
            <input
              type="text"
              value={town}
              readOnly
              className="input-base bg-slate-100"
            />
          </div>
        </div>
      )}
    </div>
  );
};

function getPrefectureName(code) {
  const prefectures = {
    '01': '北海道', '02': '青森県', '03': '岩手県', '04': '宮城県',
    '05': '秋田県', '06': '山形県', '07': '福島県', '08': '茨城県',
    '09': '栃木県', '10': '群馬県', '11': '埼玉県', '12': '千葉県',
    '13': '東京都', '14': '神奈川県', '15': '新潟県', '16': '富山県',
    '17': '石川県', '18': '福井県', '19': '山梨県', '20': '長野県',
    '21': '岐阜県', '22': '静岡県', '23': '愛知県', '24': '三重県',
    '25': '滋賀県', '26': '京都府', '27': '大阪府', '28': '兵庫県',
    '29': '奈良県', '30': '和歌山県', '31': '鳥取県', '32': '島根県',
    '33': '岡山県', '34': '広島県', '35': '山口県', '36': '徳島県',
    '37': '香川県', '38': '愛媛県', '39': '高知県', '40': '福岡県',
    '41': '佐賀県', '42': '長崎県', '43': '熊本県', '44': '大分県',
    '45': '宮崎県', '46': '鹿児島県', '47': '沖縄県'
  };
  return prefectures[code] || '';
}

export default PostalCodeInput;
