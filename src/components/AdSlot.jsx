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

  return (
    <div className={`bg-gray-100 flex items-center justify-center text-gray-400 border border-gray-200 overflow-hidden mx-auto ${getAdStyle()}`}>
      <div className="text-center">
        <span className="text-sm block mb-1 uppercase tracking-wider">Espaço Publicitário</span>
        <span className="text-xs opacity-50">{size}</span>
      </div>
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
