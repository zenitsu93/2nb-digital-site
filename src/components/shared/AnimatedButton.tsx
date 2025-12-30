import { motion } from 'framer-motion';
import { Button as FlowbiteButton, type ButtonProps as FlowbiteButtonProps } from 'flowbite-react';
import { ReactNode, forwardRef } from 'react';

interface AnimatedButtonProps extends Omit<FlowbiteButtonProps, 'children'> {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'light' | 'outline';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
}

const AnimatedButton = forwardRef<HTMLButtonElement, AnimatedButtonProps>(({ 
  children, 
  variant = 'primary',
  size = 'md',
  className = '',
  ...props 
}, ref) => {
  const baseClasses = 'relative overflow-hidden transition-all duration-300';
  
  const sizeClasses = {
    xs: 'px-2 py-1 text-xs',
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
    xl: 'px-8 py-4 text-xl',
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.2, ease: 'easeInOut' }}
      className="inline-block"
    >
      <FlowbiteButton
        ref={ref}
        color={variant === 'primary' ? 'primary' : variant === 'secondary' ? 'secondary' : variant === 'outline' ? 'outline' : 'light'}
        size={size}
        className={`${baseClasses} ${sizeClasses[size]} ${className}`}
        {...props}
      >
        <motion.span
          className="relative z-10 flex items-center justify-center gap-2"
          initial={{ opacity: 1 }}
          whileHover={{ opacity: 1 }}
        >
          {children}
        </motion.span>
        <motion.div
          className="absolute inset-0 bg-secondary/20"
          initial={{ x: '-100%', opacity: 0 }}
          whileHover={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
        />
      </FlowbiteButton>
    </motion.div>
  );
});

AnimatedButton.displayName = 'AnimatedButton';

export default AnimatedButton;

