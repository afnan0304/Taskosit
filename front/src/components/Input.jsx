import { clsx } from 'clsx'

export function Input({ label, className, id, error, ...props }) {
  return (
    <div>
      {label && (
        <label htmlFor={id} className="block text-sm font-semibold text-gray-700 mb-2">
          {label}
        </label>
      )}
      <input
        id={id}
        className={clsx(
          'block w-full rounded-xl shadow-sm transition-all duration-200',
          'focus:outline-none focus:ring-2 focus:ring-offset-0',
          error
            ? 'border-red-300 text-red-900 placeholder-red-300 focus:border-red-500 focus:ring-red-500'
            : 'border-gray-300 focus:border-primary-500 focus:ring-primary-500 hover:border-gray-400',
          className
        )}
        {...props}
      />
      {error && (
        <p className="mt-2 text-sm text-red-600 font-medium">{error}</p>
      )}
    </div>
  )
}