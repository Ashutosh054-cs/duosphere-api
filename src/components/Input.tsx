import { memo, forwardRef } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

const Input = memo(
  forwardRef<HTMLInputElement, InputProps>(({ label, error, icon, className = '', ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-text mb-2">
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted">
              {icon}
            </div>
          )}
          <input
            ref={ref}
            className={`
              w-full bg-surface border border-primary/30 rounded-xl px-4 py-3
              text-text placeholder-muted
              focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20
              transition-all
              ${icon ? 'pl-12' : ''}
              ${error ? 'border-error focus:border-error focus:ring-error/20' : ''}
              ${className}
            `}
            {...props}
          />
        </div>
        {error && (
          <p className="text-error text-sm mt-1">{error}</p>
        )}
      </div>
    );
  })
);

Input.displayName = 'Input';

export default Input;
