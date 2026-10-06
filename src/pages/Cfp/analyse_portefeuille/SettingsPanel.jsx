import SettingsSection from './SettingsSection';

const SettingsPanel = ({ isOpen, onClose, displaySettings, onToggleSetting, onResetSettings }) => {
  const activeCount = Object.values(displaySettings).filter(v => v).length;
  const totalCount = Object.keys(displaySettings).length;

  const requiredSettings = [
    { key: 'logo', title: 'Logo & Nom entreprise', desc: 'Identification du client', required: true },
    { key: 'contact', title: 'Contact entreprise', desc: 'Email, téléphone, type d\'entreprise', required: true }
  ];

  const optionalSettings = [
    { key: 'ranking', title: 'Badge de ranking', desc: 'Position du client par CA (#1, #2...)' },
    { key: 'frequency', title: 'Badge de fréquence', desc: 'Catégorie de collaboration (régulier, fréquent...)' },
    { key: 'frequency-stats', title: 'Statistiques de fréquence', desc: 'Projets/an et dernière formation' },
    { key: 'actions', title: 'Actions recommandées', desc: 'Suggestions d\'actions commerciales' },
    { key: 'kpi', title: 'KPI Financiers', desc: 'CA et nombre d\'apprenants avec évolution' },
    { key: 'ca-chart', title: 'Graphique CA', desc: 'Évolution du CA sur 36 mois (courbe)' },
    { key: 'learners-chart', title: 'Graphique Apprenants', desc: 'Évolution des apprenants sur 36 mois (barres)' }
  ];

  return (
    <div className={`fixed top-0 right-0 w-96 h-full bg-white shadow-2xl z-50 transition-transform duration-300 ${
      isOpen ? 'translate-x-0' : 'translate-x-full'
    }`}>
      <div className="bg-gradient-to-br from-[#667eea] to-[#764ba2] text-white p-6 sticky top-0 z-10">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold">⚙️ Paramètres d'affichage</h2>
            <div className="text-sm opacity-90 mt-1">
              {activeCount}/{totalCount} éléments affichés
            </div>
          </div>
          <button 
            className="bg-white bg-opacity-20 w-9 h-9 rounded-full text-lg hover:bg-opacity-30 transition-all duration-300 hover:rotate-90"
            onClick={onClose}
          >
            ✕
          </button>
        </div>
      </div>

      <div className="p-6 overflow-y-auto h-[calc(100vh-80px)]">
        <SettingsSection 
          title="📋 Éléments obligatoires"
          settings={requiredSettings}
          displaySettings={displaySettings}
          onToggleSetting={onToggleSetting}
          isRequired={true}
        />

        <SettingsSection 
          title="🎨 Éléments optionnels"
          settings={optionalSettings}
          displaySettings={displaySettings}
          onToggleSetting={onToggleSetting}
          isRequired={false}
        />

        <div className="flex gap-3 mb-8">
          <button 
            className="flex-1 bg-gray-200 text-gray-800 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors duration-300"
            onClick={onResetSettings}
          >
            🔄 Réinitialiser
          </button>
          <button 
            className="flex-1 bg-gradient-to-br from-[#667eea] to-[#764ba2] text-white py-3 rounded-lg font-semibold hover:-translate-y-0.5 hover:shadow-lg transition-all duration-300"
            onClick={onClose}
          >
            ✓ Appliquer
          </button>
        </div>

        <HelpSection />
      </div>
    </div>
  );
};

const HelpSection = () => (
  <div className="border-t-2 border-gray-200 pt-6">
    <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg border-l-4 border-blue-500">
      <div className="text-sm font-bold text-blue-800 mb-2">💡 Aide</div>
      <div className="text-xs text-blue-700 space-y-2">
        <p>• Les paramètres sont <strong>sauvegardés automatiquement</strong> dans votre navigateur</p>
        <p>• Utilisez <strong>Réinitialiser</strong> pour tout afficher</p>
        <p>• Les éléments obligatoires (logo, nom, contact) sont toujours visibles</p>
      </div>
    </div>
  </div>
);

export default SettingsPanel;