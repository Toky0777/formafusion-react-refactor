import React from 'react';

export const Footer = () => {
  const links = [
    { label: 'Aide', href: '#' },
    { label: 'Contact', href: '#' },
    { label: 'Sécurité', href: '#' },
    { label: 'Respect de la vie privée', href: '#' },
    { label: 'Contrat d\'utilisations', href: '#' },
    { label: 'Mentions Légales', href: '#' }
  ];

  return (
    <footer className="bg-white border-t border-gray-200 mt-12">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <nav className="flex flex-wrap justify-center gap-6 text-sm text-gray-600">
          {links.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="hover:text-violet-600 transition-colors"
            >
              {link.label}
            </a>
          ))}
        </nav>
        <p className="mt-4 text-center text-sm text-gray-500">
          © 2025 FormaFusion. Tous droits réservés.
        </p>
      </div>
    </footer>
  );
};