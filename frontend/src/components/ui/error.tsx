import { ErrorIcon } from "../../assets";

type ErrorMsgProps = {
  message?: string;
};

export default function ErrorMsg({ message = "Something went wrong." }: ErrorMsgProps) {
  return (
    <div className="flex flex-col items-center justify-center py-10 text-center">
        <ErrorIcon className="mb-4 w-42 h-42" />
      <p className="text-text-error text-center text-lg">{message}</p>
    </div>
  );
}