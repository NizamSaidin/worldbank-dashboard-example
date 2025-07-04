import { GraphSection } from "@/features/dashboard/ui/views/graph-section";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import RootLayout from "./layout";

const queryClient = new QueryClient();

function App() {
  return (
    <RootLayout>
      <QueryClientProvider client={queryClient}>
        <div className="max-w-[140rem] mx-auto">
          <main className="flex flex-col min-h-screen bg-background text-foreground p-6">
            <GraphSection />
          </main>
        </div>
      </QueryClientProvider>
    </RootLayout>
  );
}

export default App;
