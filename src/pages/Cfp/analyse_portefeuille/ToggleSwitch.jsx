
const ToggleSwitch = ({ isActive, onChange }) => {
  return (
    <div 
      className={`w-12 h-6 rounded-full relative cursor-pointer transition-colors duration-300 ${
        isActive ? 'bg-[#667eea]' : 'bg-gray-300'
      }`}
      onClick={onChange}
    >
      <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform duration-300 ${
        isActive ? 'translate-x-7' : 'translate-x-1'
      }`} />
    </div>
  );
};

export default ToggleSwitch;