import { Fragment } from 'react';
import { Button } from './button';
import { DialogClose, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog';
import { cn } from '../../utils/cn';

interface Props {
  children?: React.ReactNode;
  title: string;
  onDelete?: () => void;
  isDeleting?: boolean;
  primaryBtnTitle?: string;
  footerClassname?: string;
  disabled?: boolean;
}

function DeleteModal({
  children,
  title,
  onDelete,
  isDeleting = false,
  primaryBtnTitle,
  footerClassname,
  disabled,
}: Props) {
  return (
    <Fragment>
      <DialogHeader>
        <DialogTitle>{title}</DialogTitle>
      </DialogHeader>

      <DialogDescription className="pt-2.5 pb-2 px-6">{children}</DialogDescription>

      <DialogFooter className={cn('p-6', footerClassname)}>
        <DialogClose asChild>
          <Button intent="outline">Cancel</Button>
        </DialogClose>
        <Button disabled={isDeleting || disabled} intent="danger" onClick={onDelete}>
          {primaryBtnTitle || 'Yes, Delete'}
        </Button>
      </DialogFooter>
    </Fragment>
  );
}

export default DeleteModal;
