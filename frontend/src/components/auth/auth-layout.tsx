import React, { useEffect, type ReactNode } from 'react';
import Container from '../ui/container';
import { cn } from '../../utils/cn';

interface AuthWrapperProps {
  children: ReactNode;
  title: string;
  description: string;
  className?: string;
  logo?: string;
}

const AuthWrapper: React.FC<AuthWrapperProps> = ({ children, title, description, className, logo = '/logo.png' }) => {
  return (
    <main className="w-full bg-background overflow-x-hidden flex flex-col items-center justify-center min-h-screen">
      <Container className="relative w-full flex-1 max-w-[600px] pt-[90px]">
       
        <div className="static z-10 flex flex-col gap-5 items-center w-full">
       
          <div className="space-y-3 mb-3 max-w-[340px]">
            <h1 className="text-24 font-semibold text-center">{title}</h1>

            <p className="text-text-default-tertiary text-center">
              {description.split('/b')[0]}

              {description.includes('/b') && <span className="font-semibold">{description.split('/b')[1]} </span>}
            </p>
          </div>

          <div className={cn('w-full max-w-[400px]', className)}>{children}</div>
        </div>
      </Container>
    </main>
  );
};

export { AuthWrapper };
