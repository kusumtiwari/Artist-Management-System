import * as React from 'react';
import * as PopoverPrimitive from '@radix-ui/react-popover';

import { cn } from '../../utils/cn';

const Popover = PopoverPrimitive.Root;

const PopoverTrigger = PopoverPrimitive.Trigger;

const PopoverContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Content>
>(({ className, align = 'center', sideOffset = 4, ...props }, ref) => {
  const localRef = React.useRef<HTMLDivElement | null>(null);
  const [isOpen, setIsOpen] = React.useState(false);
  const [isReady, setIsReady] = React.useState(false);

  const setRefs = React.useCallback(
    (node: HTMLDivElement | null) => {
      localRef.current = node;
      if (!ref) return;
      if (typeof ref === 'function') ref(node);
      else (ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
    },
    [ref]
  );

  React.useEffect(() => {
    const el = localRef.current;
    if (!el || typeof window === 'undefined') return;

    const handleResize = () => {
      const rect = el.getBoundingClientRect();

      const spaceBelow = window.innerHeight - rect.top - 8; // 8px padding
      const spaceAbove = rect.bottom - 8; // 8px padding

      // Use the maximum available space
      const maxAvailableHeight = rect.top < 0 ? spaceAbove : spaceBelow;

      // Set max-height to the available viewport space
      el.style.maxHeight = `${maxAvailableHeight}px`;
      el.style.overflowY = 'auto';
    };

    if (isOpen) {
      // Initial calculation - use multiple frames to ensure positioning is complete
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          handleResize();
          setIsReady(true);
        });
      });

      // Watch for resize events
      window.addEventListener('resize', handleResize);

      // Watch for content changes using MutationObserver
      const observer = new MutationObserver(() => {
        requestAnimationFrame(handleResize);
      });

      observer.observe(el, {
        childList: true,
        subtree: true,
        attributes: true,
        characterData: true,
      });

      // Also use ResizeObserver to detect size changes
      const resizeObserver = new ResizeObserver(() => {
        requestAnimationFrame(handleResize);
      });
      resizeObserver.observe(el);

      return () => {
        window.removeEventListener('resize', handleResize);
        observer.disconnect();
        resizeObserver.disconnect();
        setIsReady(false);
      };
    }
  }, [isOpen]);

  return (
    <PopoverPrimitive.Portal>
      <PopoverPrimitive.Content
        ref={setRefs}
        align={align}
        sideOffset={sideOffset}
        className={cn(
          'z-50 w-72 rounded-4 border bg-background p-4 text-popover-foreground shadow-md outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2',
          !isReady && 'invisible',
          className
        )}
        onOpenAutoFocus={(event) => {
          setIsOpen(true);
          props.onOpenAutoFocus?.(event);
        }}
        onCloseAutoFocus={(event) => {
          setIsOpen(false);
          props.onCloseAutoFocus?.(event);
        }}
        {...props}
      />
    </PopoverPrimitive.Portal>
  );
});
PopoverContent.displayName = PopoverPrimitive.Content.displayName;

export { Popover, PopoverTrigger, PopoverContent };
