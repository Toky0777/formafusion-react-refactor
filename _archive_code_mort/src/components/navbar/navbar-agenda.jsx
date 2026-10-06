import { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { Calendar } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useTranslation } from 'react-i18next';

const NavItem = ({ to, label }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `flex items-center gap-2 px-2 py-1/2 rounded ${isActive
        ? 'bg-purple-600 text-white font-semibold'
        : 'text-purple-600 bg-gray-100 hover:bg-gray-100'
      }`
    }
  >

    {label}
    <Calendar className="w-3 h-3 mr-2" aria-hidden="true" />
  </NavLink>
);

// Déclaration centralisée des routes par rôle
const roleRoutes = {

  3: [
    { path: '/cfp/agenda/annuel', label: 'Annuels' },
    { path: '/cfp/agenda/formateur', label: 'Formateurs' },
    { path: '/cfp/agenda/semaine', label: 'Semaine' }
  ],
  4: [
    { path: '/particulier/agenda/annuel', label: 'Annuels' },
    { path: '/particulier/agenda/semaine', label: 'Semaine' }
  ],
  5: [
    { path: '/formateur/agenda/annuel', label: 'Annuels' },
    { path: '/formateur/agenda/semaine', label: 'Semaine' }
  ],
  6: [
    { path: '/etp/annuel', label: 'Annuels' },
    { path: '/etp/formateur', label: 'Formateurs' },
    { path: '/etp/semaine', label: 'Semaine' }
  ],
  8: [
    { path: '/cfp/annuel', label: 'Annuels' },
    { path: '/cfp/formateur', label: 'Formateurs' },
    { path: '/cfp/semaine', label: 'Semaine' }
  ],
};

const NavbarAgenda = () => {
  const [roleId, setRoleId] = useState(null);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showAppsMenu, setShowAppsMenu] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const { t } = useTranslation();

  // constant pour afficher le drapeau
  const getFlagUrl = (countryCode) => {
    if (!countryCode) return null;

    return `https://flagcdn.com/w40/${countryCode.toLowerCase()}.png`; // ✅
  };


  const userSettings = {
    country_name: "Madagascar",
    country_code: "MG"

  };


  useEffect(() => {
    const storedRole = localStorage.getItem('rle_d');
    if (storedRole) setRoleId(parseInt(storedRole, 10));
  }, []);

  // Fermer les menus si clic à l’extérieur
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        !e.target.closest('.user-menu') &&
        !e.target.closest('.apps-menu')
      ) {
        setShowUserMenu(false);
        setShowAppsMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative z-50 px-1 bg-white ">



      {/* Menu Desktop */}
      <div className="hidden p-2 space-x-6 md:flex">
        {roleRoutes[roleId]?.map(({ path, label }) => (
          <NavItem key={path} to={path} label={label} />
        ))}
      </div>

      {/* Bouton mobile */}
      <div className="md:hidden">
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} aria-label="Menu mobile">
          <svg className="w-6 h-6 text-gray-600" viewBox="0 0 24 24" fill="none">
            {isMobileMenuOpen ? (
              <path d="M6 18L18 6M6 6l12 12" stroke="currentColor" strokeWidth="2" />
            ) : (
              <path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" strokeWidth="2" />
            )}
          </svg>
        </button>
      </div>




      {/* Menu mobile */}
      {isMobileMenuOpen && (
        <div className="z-40 px-4 py-2 space-y-2 bg-white  md:hidden">
          {roleRoutes[roleId]?.map(({ path, label }) => (
            <NavLink
              key={path}
              to={path}
              className="block px-4 py-2 text-purple-600 rounded hover:bg-gray-100"
            >
              {label}
            </NavLink>
          ))}
        </div>
      )}
    </div>
  );
};

export default NavbarAgenda;
