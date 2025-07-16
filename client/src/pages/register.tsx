import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Helmet } from "react-helmet";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { apiRequest } from "@/lib/queryClient";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";

const registerSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string(),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function Register() {
  const [isLoading, setIsLoading] = useState(false);
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // Get plan from URL params if any
  const searchParams = new URLSearchParams(window.location.search);
  const plan = searchParams.get('plan');

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  async function onSubmit(data: RegisterFormValues) {
    setIsLoading(true);

    try {
      const { confirmPassword, ...registerData } = data;
      
      // Register the user
      await apiRequest("POST", "/api/auth/register", registerData);
      
      // Login the user
      await apiRequest("POST", "/api/auth/login", {
        username: data.username,
        password: data.password,
      });
      
      // Invalidate auth query cache
      queryClient.invalidateQueries({ queryKey: ["/api/auth/me"] });
      
      toast({
        title: "Account created",
        description: "Your account has been created successfully!",
      });
      
      // Redirect based on plan or to home page
      if (plan) {
        setLocation(`/pricing?plan=${plan}`);
      } else {
        setLocation("/creator-studio");
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "Registration failed. Please try again.";
      toast({
        title: "Error",
        description: message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex justify-center py-16 px-4 bg-gray-50">
      <Helmet>
        <title>Create Account | ComicAI</title>
        <meta name="description" content="Join ComicAI and start creating your own digital comics using AI. Sign up for a free account today." />
      </Helmet>

      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="font-bangers text-3xl text-dark mb-2">Create Your Account</h1>
          <p className="text-gray-600">
            Join ComicAI and start creating amazing comics
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 md:p-8">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your username" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input 
                        type="email" 
                        placeholder="Enter your email" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input 
                        type="password" 
                        placeholder="Create a password" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl>
                      <Input 
                        type="password" 
                        placeholder="Confirm your password" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {plan && (
                <div className="bg-primary bg-opacity-5 border border-primary p-3 rounded-lg">
                  <p className="text-sm">
                    <span className="font-bold">Selected Plan: </span>
                    {plan === 'pro' ? 'Creator Pro' : plan === 'enterprise' ? 'Enterprise' : 'Free'}
                  </p>
                </div>
              )}

              <Button
                type="submit"
                className="w-full bg-primary hover:bg-opacity-90"
                disabled={isLoading}
              >
                {isLoading ? "Creating Account..." : "Create Account"}
              </Button>
            </form>
          </Form>

          <div className="mt-6 text-center text-sm text-gray-600">
            Already have an account?{" "}
            <Link href="/login">
              <a className="text-primary hover:underline font-medium">Log In</a>
            </Link>
          </div>
        </div>

        <div className="mt-6 text-center text-xs text-gray-500">
          By creating an account, you agree to our{" "}
          <Link href="/terms">
            <a className="text-primary hover:underline">Terms of Service</a>
          </Link>{" "}
          and{" "}
          <Link href="/privacy">
            <a className="text-primary hover:underline">Privacy Policy</a>
          </Link>
        </div>
      </div>
    </div>
  );
}
