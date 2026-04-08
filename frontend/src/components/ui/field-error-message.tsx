import { AlertCircleIcon } from '../../assets';

function FieldErrorMessage({
  message,
  relative = false,
  className = '',
}: {
  message: string;
  relative?: boolean;
  className?: string;
}) {
  if (relative) {
    return (
      <div className="relative h-0 w-auto">
        <p className={`text-error text-14 mt-1 absolute left-0 top-0 flex items-center gap-1 ${className}`}>
          <AlertCircleIcon className="size-5 flex-shrink-0" /> {message}
        </p>
      </div>
    );
  }
  return (
    <p className={`text-error text-14 mt-1 flex items-center gap-1 ${className}`}>
      <AlertCircleIcon className="size-5 flex-shrink-0" /> {message}
    </p>
  );
}

export default FieldErrorMessage;
