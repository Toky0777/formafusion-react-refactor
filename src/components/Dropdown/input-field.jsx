
const InputField = ({
  type = "text",
  description = "",
  className = "",
  name = "",
  value = "",
  label = "",
  accept = "",
  required = false,
  onKeyUp = null,
  disabled = false,
  unity = null,
  screen = "",
  readOnly = false,
  placeholder = "",
  error = "",
  onChange,
}) => {
  return (
    <div className="flex flex-col w-full gap-1">
      <span className="inline-flex items-center w-full gap-2">
        <label htmlFor={name} className={`text-slate-700 ${required ? "after:content-['*'] after:ml-0.5 after:text-red-500" : ""}`}>
          {label}
        </label>
        <p className="text-sm italic text-slate-500">
          {description} {required && "Ce champ est obligatoire !"}
        </p>
      </span>

      {type === "textarea" ? (
        <textarea
          onKeyUp={onKeyUp}
          name={name}
          id={name}
          value={value}
          rows={6}
          onChange={onChange}
          className={`${name} ${name}_${screen} ${className} textarea textarea-bordered`}
          style={{ height: "35px" }}
        />
      ) : type === "password" ? (
        <div className="relative inline-flex w-full">
          <input
            type="password"
            id={name}
            name={name}
            value={value}
            onChange={onChange}
            className={`${name} ${name}_${screen} password password-toggle input input-bordered w-full ${error ? "border-red-500" : ""}`}
            style={{ height: "35px" }}
          />
          <i className="absolute bi bi-eye-fill top-2 right-4 eye-icon-toggle" data-target={name}></i>
        </div>
      ) : (
        <div className="relative inline-flex w-full">
          <input
            type={type}
            id={name}
            value={value}
            name={name}
            accept={accept}
            onKeyUp={onKeyUp}
            onChange={onChange}
            placeholder={placeholder}
            readOnly={readOnly}
            disabled={disabled}
            className={`
              ${name} ${name}_${screen} input input-bordered w-full outline-none
              ${className}
              ${error ? "border-red-500" : ""}
              ${disabled ? "border-amber-500" : ""}
              ${readOnly ? "!bg-slate-200 hover:!border-slate-200 !cursor-not-allowed" : ""}
            `}
          />
          {unity && (
            <span className="h-9 bg-slate-100 font-medium text-sm text-slate-500 px-3 absolute top-[5px] flex items-center justify-center right-[5px] rounded-lg">
              {unity}
            </span>
          )}
        </div>
      )}

      {error && (
        <div id={`error_${name}`} className="text-sm text-red-500">
          {error}
        </div>
      )}
    </div>
  );
};

export default InputField;
