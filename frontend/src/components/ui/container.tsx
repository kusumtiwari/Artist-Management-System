import { cn } from '../../utils/cn';
import React, { forwardRef } from 'react';

interface ContainerProps {
  children: React.ReactNode;
  className?: string;
}

const Container = forwardRef<HTMLDivElement, ContainerProps>(({ children, className }, ref) => {
  return (
    <div ref={ref} className={cn('py-6 px-8', className)}>
      {children}
    </div>
  );
});

Container.displayName = 'Container';

export default Container;
