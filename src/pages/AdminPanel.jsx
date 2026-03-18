import React from 'react';

const AdminPanel = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-3xl font-heading font-bold text-gray-900 mb-8">Administração do Sistema</h1>
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        <p className="text-gray-600">
          Esta área é restrita a administradores. Aqui você poderá gerenciar anúncios (ad slots), aprovar vagas e visualizar estatísticas do sistema.
        </p>
      </div>
    </div>
  );
};

export default AdminPanel;
