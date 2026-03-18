import React from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, Twitter, Linkedin, Github } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-200 pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="col-span-1 md:col-span-1">
            <Link to="/" className="flex items-center space-x-2 mb-4">
              <div className="bg-primary text-white p-1 rounded-md">
                <Briefcase size={20} />
              </div>
              <span className="font-heading font-bold text-lg text-gray-900">
                Vagas<span className="text-primary">JP</span>
              </span>
            </Link>
            <p className="text-gray-500 text-sm">
              O seu portal definitivo para encontrar as melhores oportunidades de trabalho no Japão.
            </p>
          </div>
          
          <div>
            <h4 className="font-heading font-semibold text-gray-900 mb-4">Para Candidatos</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/vagas" className="text-gray-500 hover:text-primary transition-colors">Buscar Vagas</Link></li>
              <li><Link to="/cadastro" className="text-gray-500 hover:text-primary transition-colors">Criar Curriculo</Link></li>
              <li><Link to="/login" className="text-gray-500 hover:text-primary transition-colors">Painel do Candidato</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-heading font-semibold text-gray-900 mb-4">Para Empresas</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/cadastro?type=company" className="text-gray-500 hover:text-primary transition-colors">Anunciar Vaga</Link></li>
              <li><Link to="/empresas" className="text-gray-500 hover:text-primary transition-colors">Pesquisar Currículos</Link></li>
              <li><Link to="/empresa/dashboard" className="text-gray-500 hover:text-primary transition-colors">Painel da Empresa</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-heading font-semibold text-gray-900 mb-4">Suporte</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/sobre" className="text-gray-500 hover:text-primary transition-colors">Sobre Nós</Link></li>
              <li><Link to="/contato" className="text-gray-500 hover:text-primary transition-colors">Contato</Link></li>
              <li><Link to="/termos" className="text-gray-500 hover:text-primary transition-colors">Termos de Uso</Link></li>
              <li><Link to="/privacidade" className="text-gray-500 hover:text-primary transition-colors">Política de Privacidade</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-100 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-gray-400 mb-4 md:mb-0">
            &copy; {new Date().getFullYear()} VagasJP. Todos os direitos reservados.
          </p>
          <div className="flex space-x-4 text-gray-400">
            <a href="#" className="hover:text-primary transition-colors"><Twitter size={20} /></a>
            <a href="#" className="hover:text-primary transition-colors"><Linkedin size={20} /></a>
            <a href="#" className="hover:text-primary transition-colors"><Github size={20} /></a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
