'use client';

import * as React from 'react';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { cn } from '../../utils/cn';
import { XIcon } from '../../assets';
const Dialog = DialogPrimitive.Root;

const DialogTrigger = DialogPrimitive.Trigger;
const DialogPortal = DialogPrimitive.Portal;

const DialogClose = DialogPrimitive.Close;

const DialogOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(
      'fixed inset-0 z-50 bg-black/80  data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
      className
    )}
    {...props}
  />
));
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName;

const DialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content> & {
    size?: 'lg' | 'md';
    overlayClassname?: string;
  }
>(({ className, size = 'md', overlayClassname, children, ...props }, ref) => (
  <DialogPortal>
    <DialogOverlay className={overlayClassname} />
    <DialogPrimitive.Content
     onOpenAutoFocus={(e) => e.preventDefault()}
      ref={ref}
      className={cn(
        'p-6 fixed left-[50%] top-[50%] z-50 w-[95%] translate-x-[-50%] translate-y-[-50%] border bg-background shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] rounded-md',
        size === 'md' && 'md:w-[480px]',
        size === 'lg' && 'md:w-[580px]',
        className
      )}
      {...props}
    >
      {children}
    </DialogPrimitive.Content>
  </DialogPortal>
));
DialogContent.displayName = DialogPrimitive.Content.displayName;

const DialogHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn('flex justify-between items-start px-6 pt-6', className)} {...props}>
    {props.children}

    <DialogPrimitive.Close className="text-icon ring-offset-background rounded-3 transition-opacity hover:opacity-100 focus:outline-none focus:ring-[0.5px] focus:ring-primary focus:ring-offset-[0.5px] disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
      <XIcon className="size-6" />
      <span className="sr-only">Close</span>
    </DialogPrimitive.Close>
  </div>
);
DialogHeader.displayName = 'DialogHeader';

const DialogFooter = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn('flex flex-col-reverse sm:flex-row sm:justify-end gap-3 pt-6', className)} {...props} />
);
DialogFooter.displayName = 'DialogFooter';

const DialogFooterBordered = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn('flex flex-col-reverse sm:flex-row sm:justify-end gap-3 pb-6 pt-2 px-6 border-0', className)}
    {...props}
  />
);
DialogFooterBordered.displayName = 'DialogFooterBordered';

const DialogTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title ref={ref} className={cn('text-18 font-bold text-default', className)} {...props} />
));
DialogTitle.displayName = DialogPrimitive.Title.displayName;

const DialogDescription = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description ref={ref} className={cn('text-16 text-default', className)} {...props} />
));
DialogDescription.displayName = DialogPrimitive.Description.displayName;

export {
  Dialog,
  DialogPortal,
  DialogOverlay,
  DialogClose,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogFooterBordered,
  DialogTitle,
  DialogDescription,
};
