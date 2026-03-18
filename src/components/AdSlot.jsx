import React from 'react';

const AdSlot = ({ size = 'leaderboard' }) => {
  const getAdStyle = () => {
    switch (size) {
      case 'leaderboard':
        return 'w-full max-w-[728px] h-[90px]';
      case 'sidebar':
        return 'w-[300px] h-[600px]';
      case 'native':
        return 'w-full h-[150px]';
      default:
        return 'w-full h-auto';
    }
  };

  // Utilizando o placeholder.com para simular banners visuais de anúncio de forma elegante e não-intrusiva
  const adImageURL = `https://via.placeholder.com/${size === 'leaderboard' ? '728x90' : size === 'sidebar' ? '300x600' : '728x150'}/F1F5F9/94A3B8?text=An%C3%BAncio+Teste+(${size})`;

  return (
    <div className={`bg-slate-50/50 backdrop-blur-sm border border-slate-200/50 rounded-2xl flex flex-col items-center justify-center text-slate-400 overflow-hidden mx-auto transition-all duration-300 hover:shadow-md ${getAdStyle()}`}>
      <img src={adImageURL} alt="Ad Placeholder" className="w-full h-full object-cover mix-blend-multiply opacity-80 hover:opacity-100 transition-opacity" />
      {/* 
        Google AdSense Placeholder
        <ins className="adsbygoogle"
             style={{ display: 'block' }}
             data-ad-client="ca-pub-XXXXXXXXXXXXXXXX"
             data-ad-slot="XXXXXXXXXX"
             data-ad-format="auto"
             data-full-width-responsive="true"></ins>
        <script>
             (adsbygoogle = window.adsbygoogle || []).push({});
        </script>
      */}
    </div>
  );
};

export default AdSlot;
