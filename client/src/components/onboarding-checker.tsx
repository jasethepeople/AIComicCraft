import { useEffect } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { User } from "@shared/schema";

export default function OnboardingChecker() {
  const [, setLocation] = useLocation();

  const { data: user } = useQuery<User | null>({
    queryKey: ["/api/auth/me"],
    onError: () => null
  });

  useEffect(() => {
    // Only check onboarding for authenticated users
    if (!user) return;

    const hasCompletedOnboarding = localStorage.getItem('onboarding_completed');
    const currentPath = window.location.pathname;
    
    // Don't redirect if already on onboarding page or login/register pages
    const skipPaths = ['/onboarding', '/login', '/register', '/'];
    if (skipPaths.includes(currentPath)) return;

    // If user hasn't completed onboarding, redirect to onboarding
    if (!hasCompletedOnboarding) {
      setLocation('/onboarding');
    }
  }, [user, setLocation]);

  return null; // This component doesn't render anything
}