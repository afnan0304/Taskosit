import { cva } from 'class-variance-authority'
import { clsx } from 'clsx'

const buttonStyles = cva(
  'inline-flex items-center justify-center px-4 py-2 rounded-xl font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transform active:scale-95',
  {
    variants: {
      intent: {
        primary: 'bg-gradient-to-r from-primary-600 to-primary-700 text-white hover:from-primary-700 hover:to-primary-800 focus:ring-primary-500 shadow-lg hover:shadow-xl',
        secondary: 'bg-white text-gray-700 border-2 border-gray-300 hover:bg-gray-50 hover:border-gray-400 focus:ring-primary-500 shadow-sm hover:shadow-md',
        danger: 'bg-gradient-to-r from-red-600 to-red-700 text-white hover:from-red-700 hover:to-red-800 focus:ring-red-500 shadow-lg hover:shadow-xl',
      },
      size: {
        sm: 'px-3 py-1.5 text-sm',
        md: 'px-4 py-2 text-base',
        lg: 'px-6 py-3 text-lg',
      },
      fullWidth: {
        true: 'w-full',
      },
    },
    defaultVariants: {
      intent: 'primary',
      size: 'md',
    },
  }
)

export function Button({ className, intent, size, fullWidth, ...props }) {
  return (
    <button
      className={clsx(buttonStyles({ intent, size, fullWidth }), className)}
      {...props}
    />
  )
}