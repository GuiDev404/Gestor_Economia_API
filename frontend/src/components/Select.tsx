import { SelectHTMLAttributes, forwardRef } from "react";

type SelectProps = Omit<SelectHTMLAttributes<HTMLSelectElement>, "className"> & {
  error?: string;
  name: string;
  label: string;
  isRequired?: boolean;
  placeholder?: string;
  children: React.ReactElement | React.ReactNode;
};

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  function Component({ label, error, children, placeholder ,isRequired = false, ...selectParams }, ref) {
  return (
    <label className="form-control w-full">
      <p className="label justify-start gap-2">
        <span className="label-text text-white">{label}</span>
        {isRequired && <span className="text-red-400">*</span>}
      </p>

      <select
        ref={ref}
        className={`
          select select-bordered select-md rounded-md text-black w-full 
          ${error ? "input-error" : ""}`
        }
        {...selectParams}
      >
        {placeholder && <option value="" hidden>--{placeholder}--</option>}
        {children}
      </select>

      {error && (
        <div className="label">
          <span className="label-text-alt text-error">{error}</span>
        </div>
      )}
    </label>
  );
});

export default Select;
