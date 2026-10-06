
export default function InputSkill({ value, name, position, onChange }) {
  return (
    <input
      name={name}
      type="number"
      max="10"
      min="1"
      className={`border border-gray-200 bg-white text-black rounded text-sm focus:outline-none ${position}`}
      value={value}
      onChange={onChange}
    />
  );
}
