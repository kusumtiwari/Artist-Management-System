import { forwardRef, useState } from "react";
import { Input} from "./Input";
import { cn } from "../../utils/cn";
import { EyeClosedIcon, EyeOpenIcon } from "../../assets";

type PasswordInputProps = {
  className?: string;
  error?: string;
  placeholder?: string;
};

const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ className, error, placeholder, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState<boolean>(false);
    return (
      <div className="relative w-full">
        <Input
          ref={ref}
          className={cn("w-full pr-10", className)}
          error={error}
          placeholder={placeholder}
          type={showPassword ? "text" : "password"}
          {...props}
        />
        <span
          aria-hidden
          className={cn(
            " cursor-pointer text-icon-icon hover:text-icon-hover absolute top-3 end-0 pe-3 flex items-center",
            error && "text-icon-error"
          )}
          onClick={() => setShowPassword(!showPassword)}
        >
          {showPassword ? (
            <EyeOpenIcon className="text-icon size-6 hover:text-icon-hover" />
          ) : (
            <EyeClosedIcon className="text-icon size-6 hover:text-icon-hover" />
          )}
        </span>
      </div>
    );
  }
);

PasswordInput.displayName = "PasswordInput";

export { PasswordInput };
