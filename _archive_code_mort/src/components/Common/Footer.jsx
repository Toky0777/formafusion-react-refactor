import React from "react";

export default function Footer() {
  return (
    <div>
      <footer className="bg-white border-t border-slate-200 mt-auto">
        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <nav className="flex flex-wrap justify-center space-x-6 text-xs text-slate-500">
            <a href="#" className="hover:text-slate-900 transition-colors">
              Aide
            </a>
            <a href="#" className="hover:text-slate-900 transition-colors">
              Contact
            </a>
            <a href="#" className="hover:text-slate-900 transition-colors">
              Sécurité
            </a>
            <a href="#" className="hover:text-slate-900 transition-colors">
              Respect de la vie privée
            </a>
            <a href="#" className="hover:text-slate-900 transition-colors">
              Contrat d'utilisations
            </a>
            <a href="#" className="hover:text-slate-900 transition-colors">
              Mentions Légales
            </a>
          </nav>
          <p className="mt-4 text-center text-xs text-slate-500">
            © 2025 FormaFusion. Tous droits réservés.
          </p>
        </div>
      </footer>
    </div>
  );
}
