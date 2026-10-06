import ToggleSwitch from './ToggleSwitch';

const SettingsSection = ({ title, settings, displaySettings, onToggleSetting, isRequired }) => {
  return (
    <div className="mb-8">
      <div className="text-sm font-bold text-gray-800 mb-4 uppercase tracking-wider border-b-2 border-gray-200 pb-2">
        {title}
      </div>
      
      {settings.map((item) => (
        <div key={item.key} className="flex justify-between items-center py-3 border-b border-gray-100">
          <div>
            <div className="text-sm font-semibold text-gray-800">
              {item.title}
              {!isRequired && (
                <span className="ml-2 text-xs px-2 py-1 rounded-full bg-green-100 text-green-800">
                  OPTIONNEL
                </span>
              )}
              {isRequired && (
                <span className="ml-2 text-xs px-2 py-1 rounded-full bg-red-100 text-red-800">
                  OBLIGATOIRE
                </span>
              )}
            </div>
            <div className="text-xs text-gray-600">{item.desc}</div>
          </div>
          
          {!isRequired ? (
            <ToggleSwitch 
              isActive={displaySettings[item.key]} 
              onChange={() => onToggleSetting(item.key)}
            />
          ) : (
            <div className="w-12 h-6 bg-gray-300 rounded-full relative">
              <div className="absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform duration-300 translate-x-6" />
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default SettingsSection;