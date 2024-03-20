import React from "react"
import { type FieldValues, type FieldErrors } from 'react-hook-form'

interface InputProps {
  register: (name: string, options?: { required?: boolean }) => FieldValues;
  errors?: FieldErrors<FieldValues>;
  name: string
  label: string
  required?: boolean
  placeholder?: string
}

const Input: React.FC<InputProps> = ({ register, name, label, errors = {}, required = false, ...rest }) => {
  const hasError = !!errors?.[name]

  return (
    <label className="form-control w-full">
      <p className="label justify-start gap-2">
        <span className="label-text text-white">{label}</span>
        {required && <span className="text-red-400">*</span>}
      </p>
      
      <input
        id={name}
        {...register(name)}
        {...rest}
        autoComplete="nop"
        className={`input input-bordered input-md text-black w-full ${hasError ? 'input-error' : ''}`}
      />

      {hasError && <div className="label">
        <span className="label-text-alt text-error">{errors?.[name]?.message?.toString()}</span>
      </div>}
    </label>
  )
}

export default Input