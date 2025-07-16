import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Component, ErrorInfo, ReactNode } from "react";
import NotFound from "@/pages/not-found";
import Header from "@/components/header";
import Footer from "@/components/footer";
import Home from "@/pages/home";
import CreatorStudio from "@/pages/creator-studio";
import AnimeStudio from "@/pages/anime-studio";
import Marketplace from "@/pages/marketplace";
import PreviewComic from "@/pages/preview-comic";
import Register from "@/pages/register";
import Login from "@/pages/login";
import Community from "@/pages/community";
import Learn from "@/pages/learn";
import Credits from "@/pages/credits";
import Onboarding from "@/pages/onboarding";
import SocialPreview from "@/pages/social-preview";
import Profile from "@/pages/profile";
import Settings from "@/pages/settings";
import Pricing from "@/pages/pricing";
import Features from "@/pages/features";
import About from "@/pages/about";
import Contact from "@/pages/contact";
import Support from "@/pages/support";
import Blog from "@/pages/blog";
import Tutorials from "@/pages/tutorials";
import Documentation from "@/pages/documentation";
import Careers from "@/pages/careers";
import Privacy from "@/pages/privacy";
import Terms from "@/pages/terms";
import OnboardingChecker from "@/components/onboarding-checker";

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error boundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center p-8">
            <h1 className="text-2xl font-bold text-red-600 mb-4">Something went wrong</h1>
            <p className="text-gray-600 mb-4">
              {this.state.error?.message || 'An unexpected error occurred'}
            </p>
            <button 
              onClick={() => window.location.reload()} 
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/creator-studio" component={CreatorStudio} />
      <Route path="/creator-studio/:id" component={CreatorStudio} />
      <Route path="/anime-studio" component={AnimeStudio} />
      <Route path="/marketplace" component={Marketplace} />
      <Route path="/preview-comic/:id" component={PreviewComic} />
      <Route path="/register" component={Register} />
      <Route path="/login" component={Login} />
      <Route path="/community" component={Community} />
      <Route path="/learn" component={Learn} />
      <Route path="/credits" component={Credits} />
      <Route path="/onboarding" component={Onboarding} />
      <Route path="/social-preview" component={SocialPreview} />
      <Route path="/profile" component={Profile} />
      <Route path="/settings" component={Settings} />
      <Route path="/pricing" component={Pricing} />
      <Route path="/features" component={Features} />
      <Route path="/about" component={About} />
      <Route path="/contact" component={Contact} />
      <Route path="/support" component={Support} />
      <Route path="/blog" component={Blog} />
      <Route path="/tutorials" component={Tutorials} />
      <Route path="/documentation" component={Documentation} />
      <Route path="/careers" component={Careers} />
      <Route path="/privacy" component={Privacy} />
      <Route path="/terms" component={Terms} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <OnboardingChecker />
          <Header />
        <main className="min-h-screen">
          <Router />
        </main>
        <Footer />
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
