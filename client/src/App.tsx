import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Header from "@/components/header";
import Footer from "@/components/footer";
import Home from "@/pages/home";
import CreatorStudio from "@/pages/creator-studio";
import Marketplace from "@/pages/marketplace";
import PreviewComic from "@/pages/preview-comic";
import Register from "@/pages/register";
import Login from "@/pages/login";
import Community from "@/pages/community";
import Learn from "@/pages/learn";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/creator-studio" component={CreatorStudio} />
      <Route path="/creator-studio/:id" component={CreatorStudio} />
      <Route path="/marketplace" component={Marketplace} />
      <Route path="/preview-comic/:id" component={PreviewComic} />
      <Route path="/register" component={Register} />
      <Route path="/login" component={Login} />
      <Route path="/community" component={Community} />
      <Route path="/learn" component={Learn} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Header />
        <main className="min-h-screen">
          <Router />
        </main>
        <Footer />
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
