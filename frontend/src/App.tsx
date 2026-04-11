import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Router from "./router";
import { ToastProvider } from "./components/ui/toast";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});
function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ToastProvider>
        <Router />
        
      </ToastProvider>
    </QueryClientProvider>
  );
}

export default App;
