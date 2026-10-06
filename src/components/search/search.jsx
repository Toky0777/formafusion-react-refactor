import InputForm from "../ui/Input-form";

export default function Search({ value, onChange, placeholder }) {
  return (
    <div>
      <InputForm placeholder={placeholder} value={value} onChange={onChange} />
    </div>
  );
}
