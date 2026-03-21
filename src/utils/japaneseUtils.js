export const formatPhoneNumber = (value) => {
  if (!value) return '';
  const cleaned = value.replace(/\D/g, '');
  
  if (cleaned.length <= 3) return cleaned;
  if (cleaned.length <= 4) return `${cleaned.slice(0, 3)}-${cleaned.slice(3)}`;
  if (cleaned.length <= 7) return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 7)}`;
  if (cleaned.length <= 11) return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 7)}-${cleaned.slice(7)}`;
  return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 7)}-${cleaned.slice(7, 11)}`;
};

export const formatPostalCode = (value) => {
  if (!value) return '';
  const cleaned = value.replace(/\D/g, '');
  
  if (cleaned.length <= 3) return cleaned;
  return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 7)}`;
};

export const validateHiragana = (value) => {
  if (!value) return true;
  const hiraganaRegex = /^[\u3040-\u309F\u30FC]+$/;
  return hiraganaRegex.test(value);
};

export const validateKatakana = (value) => {
  if (!value) return true;
  const katakanaRegex = /^[\u30A0-\u30FF\u30FC]+$/;
  return katakanaRegex.test(value);
};

export const validatePostalCode = (value) => {
  if (!value) return true;
  const postalCodeRegex = /^\d{3}-?\d{4}$/;
  return postalCodeRegex.test(value);
};

export const validatePhoneNumber = (value) => {
  if (!value) return true;
  const phoneRegex = /^(0\d{1,4}-\d{1,4}-\d{4}|\d{10,11})$/;
  return phoneRegex.test(value.replace(/-/g, ''));
};

export const JAPANESE_VISA_TYPES = [
  { value: 'permanent_resident', label: '永住者' },
  { value: 'spouse_of_japanese', label: '日本人配偶' },
  { value: 'long_term_resident', label: '長期滞在者' },
  { value: 'work_visa', label: '就労ビザ' },
  { value: 'engineer', label: '技術・人文知識・国際業務' },
  { value: 'specified_skill', label: '特定技能' },
  { value: 'student', label: '留学生' },
  { value: 'temporary_visitor', label: '観光・一時滞在' },
  { value: 'dependent', label: '家族滞在' },
  { value: 'other', label: 'その他' },
];

export const JAPANESE_JOB_TYPES = [
  { value: 'seishain', label: '正社員' },
  { value: 'keiyaku', label: '契約社員' },
  { value: 'arubaito', label: 'パート・アルバイト' },
  { value: 'gyomu_itaku', label: '業務委託' },
  { value: 'intern', label: 'インターン' },
];

export const JAPANESE_WORK_MODES = [
  { value: 'onsite', label: '出勤' },
  { value: 'hybrid', label: 'ハイブリッド' },
  { value: 'remote', label: 'リモート' },
];

export const PREFECTURES = [
  '北海道', '青森県', '岩手県', '宮城県', '秋田県', '山形県', '福島県',
  '茨城県', '栃木県', '群馬県', '埼玉県', '千葉県', '東京都', '神奈川県',
  '新潟県', '富山県', '石川県', '福井県', '山梨県', '長野県', '岐阜県',
  '静岡県', '愛知県', '三重県', '滋賀県', '京都府', '大阪府', '兵庫県',
  '奈良県', '和歌山県', '鳥取県', '島根県', '岡山県', '広島県', '山口県',
  '徳島県', '香川県', '愛媛県', '高知県', '福岡県', '佐賀県', '長崎県',
  '熊本県', '大分県', '宮崎県', '鹿児島県', '沖縄県'
];
