import { useState } from "react";
import { useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import openai from "@/lib/openai";
import { Comic, ArtStyle } from "@shared/schema";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import CharacterForm from "./character-form";
import InsufficientCreditsDialog from "./insufficient-credits-dialog";
import { PlusCircle, Loader2 } from "lucide-react";

// Define comic form schema
const comicFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  artStyle: z.string().min(1, "Art style is required"),
  targetAudience: z.string().min(1, "Target audience is required"),
  prompt: z.string().min(10, "Please provide a detailed story prompt for better results"),
  panelCount: z.coerce.number().min(1).max(12).default(6),
});

type ComicFormValues = z.infer<typeof comicFormSchema>;

interface ComicFormProps {
  existingComic?: Comic;
}

export default function ComicForm({ existingComic }: ComicFormProps) {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [characters, setCharacters] = useState<Array<{ name: string; description: string }>>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showInsufficientCredits, setShowInsufficientCredits] = useState(false);
  const [creditError, setCreditError] = useState<{ required: number; current: number; action: string } | null>(null);
  
  // Fetch art styles
  const { data: artStyles = [] } = useQuery<ArtStyle[]>({
    queryKey: ["/api/art-styles"],
  });

  // Check authentication status
  const { data: authUser, isLoading: authLoading } = useQuery({
    queryKey: ["/api/auth/me"],
    retry: false,
    refetchOnWindowFocus: true,
    staleTime: 0,
    refetchOnMount: true,
    refetchInterval: 5000, // Refetch every 5 seconds to catch auth changes
  });

  // Fetch credit balance for authenticated users
  const { data: creditBalance } = useQuery({
    queryKey: ["/api/credits/balance"],
    enabled: !!authUser,
    retry: false,
  });
  
  // Initialize form with existing comic data or defaults
  const form = useForm<ComicFormValues>({
    resolver: zodResolver(comicFormSchema),
    defaultValues: existingComic ? {
      title: existingComic.title,
      description: existingComic.description || "",
      artStyle: existingComic.artStyle,
      targetAudience: "All Ages",
      prompt: "", // We don't store the prompt in the comic model
      panelCount: 6,
    } : {
      title: "",
      description: "",
      artStyle: "Superhero",
      targetAudience: "All Ages",
      prompt: "",
      panelCount: 6,
    },
  });
  
  // Handle character addition
  const addCharacter = (character: { name: string; description: string }) => {
    setCharacters([...characters, character]);
  };
  
  // Handle character removal
  const removeCharacter = (index: number) => {
    const updatedCharacters = [...characters];
    updatedCharacters.splice(index, 1);
    setCharacters(updatedCharacters);
  };

  // Handle form submission
  const onSubmit = async (data: ComicFormValues) => {
    // Check if user is authenticated
    if (!authUser) {
      toast({
        title: "Login Required",
        description: "Please log in to create comics.",
        variant: "destructive",
      });
      setLocation("/login");
      return;
    }

    // Characters are optional - AI can generate interesting stories without predefined characters

    setIsGenerating(true);

    try {
      if (existingComic) {
        // Update existing comic
        await apiRequest("PUT", `/api/comics/${existingComic.id}`, {
          title: data.title,
          description: data.description,
          artStyle: data.artStyle,
        });
        
        toast({
          title: "Comic updated",
          description: "Your comic details have been updated successfully.",
        });
        
        // Invalidate comic query
        queryClient.invalidateQueries({ queryKey: [`/api/comics/${existingComic.id}`] });
      } else {
        // Create new comic with story generation
        const generationRequest = {
          title: data.title,
          description: data.description,
          artStyle: data.artStyle,
          targetAudience: data.targetAudience,
          characters: characters,
          panelCount: data.panelCount,
          prompt: data.prompt,
        };
        
        const response = await apiRequest("POST", "/api/generate/story", generationRequest);
        const result = await response.json();
        
        toast({
          title: "Comic created",
          description: "Your comic has been created successfully. Let's start editing!",
        });
        
        // Redirect to the editor
        setLocation(`/creator-studio/${result.comicId}`);
      }
    } catch (error: any) {
      console.error("Error creating/updating comic:", error);
      
      // Handle authentication error
      if (error.message?.includes("status: 401") || error.message?.includes("Unauthorized")) {
        toast({
          title: "Authentication Required",
          description: "Please log in to create comics.",
          variant: "destructive",
        });
        setLocation("/login");
        return;
      }
      
      // Handle insufficient credits error
      if (error.message?.includes("status: 402") || error.message?.includes("Insufficient credits")) {
        try {
          const errorResponse = await error.response?.json();
          setCreditError({
            required: errorResponse.required || 5,
            current: creditBalance?.credits || 0,
            action: "story generation"
          });
          setShowInsufficientCredits(true);
        } catch {
          // Fallback if error parsing fails
          setCreditError({
            required: 5,
            current: creditBalance?.credits || 0,
            action: "story generation"
          });
          setShowInsufficientCredits(true);
        }
      } else {
        // More detailed error messaging
        const errorMessage = error.message || "Failed to create comic. Please try again.";
        console.log("Full error details:", error);
        
        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive",
        });
      }
    } finally {
      setIsGenerating(false);
    }
  };

  // Show loading or login prompt if user is not authenticated
  if (authLoading) {
    return (
      <div className="bg-white rounded-xl p-6 shadow-md text-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
        <p className="text-gray-600">Checking authentication...</p>
      </div>
    );
  }

  if (!authUser) {
    return (
      <div className="bg-white rounded-xl p-6 shadow-md text-center">
        <h3 className="text-xl font-semibold mb-4">Login Required</h3>
        <p className="text-gray-600 mb-6">Please log in to create comics and access all features.</p>
        <Button 
          onClick={() => setLocation("/login")}
          className="bg-primary hover:bg-opacity-90"
        >
          Log In to Create Comics
        </Button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl p-6 shadow-md">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Comic Title</FormLabel>
                <FormControl>
                  <Input placeholder="Enter a title for your comic" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description (Optional)</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Provide a brief description of your comic"
                    className="resize-none"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  This will be displayed on your comic's page in the marketplace.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="artStyle"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Art Style</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  value={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select an art style" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {artStyles.map((style) => (
                      <SelectItem key={style.id} value={style.name}>
                        {style.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormDescription>
                  Choose the visual style for your comic.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="targetAudience"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Target Audience</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select target audience" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="All Ages">All Ages</SelectItem>
                    <SelectItem value="Children (6-12)">Children (6-12)</SelectItem>
                    <SelectItem value="Teen (13-17)">Teen (13-17)</SelectItem>
                    <SelectItem value="Young Adult (18-25)">Young Adult (18-25)</SelectItem>
                    <SelectItem value="Adult (26+)">Adult (26+)</SelectItem>
                    <SelectItem value="Mature (18+)">Mature (18+)</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>
                  Choose the intended age group for your comic
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {!existingComic && (
            <>
              <div className="border rounded-lg p-4 space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="font-bold text-lg">Characters</h3>
                  <CharacterForm onAddCharacter={addCharacter} />
                </div>
                
                {characters.length === 0 ? (
                  <div className="text-center py-6 bg-gray-50 rounded-lg">
                    <p className="text-gray-500">No characters added yet</p>
                    <p className="text-sm text-gray-400 mt-1">
                      Click the "Add Character" button to create your first character
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {characters.map((character, index) => (
                      <div
                        key={index}
                        className="flex justify-between items-center bg-gray-50 p-3 rounded-lg"
                      >
                        <div>
                          <h4 className="font-medium">{character.name}</h4>
                          <p className="text-sm text-gray-600">{character.description}</p>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeCharacter(index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          Remove
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <FormField
                control={form.control}
                name="panelCount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Number of Panels</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={1}
                        max={12}
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Choose how many panels your comic will have (1-12).
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="prompt"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Story Prompt</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Describe your story in detail - setting, plot, character interactions, etc."
                        className="resize-none min-h-[120px]"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      The more detailed your prompt, the better your comic will be.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </>
          )}

          <div className="flex justify-end">
            <Button
              type="submit"
              className="bg-primary hover:bg-opacity-90"
              disabled={isGenerating}
            >
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {existingComic ? "Updating..." : "Generating..."}
                </>
              ) : (
                <>
                  {existingComic ? "Update Comic" : "Create Comic"}
                  {!existingComic && <PlusCircle className="ml-2 h-4 w-4" />}
                </>
              )}
            </Button>
          </div>
        </form>
      </Form>

      {/* Insufficient Credits Dialog */}
      {creditError && (
        <InsufficientCreditsDialog
          open={showInsufficientCredits}
          onOpenChange={setShowInsufficientCredits}
          requiredCredits={creditError.required}
          currentCredits={creditError.current}
          actionType={creditError.action}
        />
      )}
    </div>
  );
}
