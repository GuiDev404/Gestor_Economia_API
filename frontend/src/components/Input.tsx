import { InputHTMLAttributes, forwardRef } from "react"
 
type InputProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'className'
> & {
  error?: string;
  name: string
  label: string
  isRequired?: boolean
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  function Component ({ label, error, isRequired = false, ...inputParams }, ref) {
 
    return (
      <label className="form-control w-full">
        <p className="label justify-start gap-2">
          <span className="label-text text-white">{label}</span>
          {isRequired && <span className="text-red-400">*</span>}
        </p>
        
        <input
          ref={ref}
          {...inputParams}
          autoComplete="nop"
          className={`input input-bordered input-md text-black w-full ${error ? 'input-error' : ''}`}
        />
  
        {error && <div className="label">
          <span className="label-text-alt text-error">{error}</span>
        </div>}
      </label>
    )
  }
) 

export default Input