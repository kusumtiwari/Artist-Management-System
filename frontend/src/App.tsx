import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Router from "./router";
import { ToastProvider } from "./components/ui/toast";
import { ErrorBoundary } from "./components/error-boundary";
import { useOnlineStatus } from "./hooks/useOnlineStatus";
import OfflineMsg from "./components/ui/offline";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});
function App() {
    const isOnline = useOnlineStatus();

  if (!isOnline) {
    return <OfflineMsg />;
  }
  return (
    <QueryClientProvider client={queryClient}>
      <ToastProvider>
        <ErrorBoundary>
          <Router />
        </ErrorBoundary>
      </ToastProvider>
    </QueryClientProvider>
  );
}

export default App;
