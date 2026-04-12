// components/ui/offline-msg.tsx

import { ErrorIcon } from "../../assets";

export default function OfflineMsg() {
  return (
    <div className="flex flex-col items-center justify-center py-10 h-screen text-center">
      <ErrorIcon className="mb-4 w-42 h-42" />
      <p className="text-text-error text-xl font-medium">
        You are offline
      </p>
      <p className="text-sm text-text-default-secondary mt-2">
        Please check your internet connection.
      </p>
    </div>
  );
}