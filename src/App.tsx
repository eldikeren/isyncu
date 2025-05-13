import SchedulePage from './pages/SchedulePage';
import MembersPage from './pages/MembersPage';
import VenuesPage from './pages/VenuesPage';
import AdminPage from './pages/AdminPage';

import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/theme-provider";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <ThemeProvider defaultTheme="light">
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
        <Route path="/schedule" element={<SchedulePage />} />
        <Route path="/members" element={<MembersPage />} />
        <Route path="/venues" element={<VenuesPage />} />
        <Route path="/admin" element={<AdminPage />} />
    
            <Route path="/" element={<Index />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </ThemeProvider>
);

export default App;
