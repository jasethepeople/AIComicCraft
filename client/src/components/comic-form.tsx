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
import { PlusCircle, Loader2 } from "lucide-react";

// Define comic form schema
const comicFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  artStyle: z.string().min(1, "Art style is required"),
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
  
  // Fetch art styles
  const { data: artStyles = [] } = useQuery<ArtStyle[]>({
    queryKey: ["/api/art-styles"],
  });
  
  // Initialize form with existing comic data or defaults
  const form = useForm<ComicFormValues>({
    resolver: zodResolver(comicFormSchema),
    defaultValues: existingComic ? {
      title: existingComic.title,
      description: existingComic.description || "",
      artStyle: existingComic.artStyle,
      prompt: "", // We don't store the prompt in the comic model
      panelCount: 6,
    } : {
      title: "",
      description: "",
      artStyle: "Superhero",
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
    if (characters.length === 0) {
      toast({
        title: "Add characters",
        description: "Please add at least one character to your comic.",
        variant: "destructive",
      });
      return;
    }

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
          characters: characters,
          panelCount: data.panelCount,
          prompt: data.prompt,
        };
        
        const result = await openai.generateComicStory(generationRequest);
        
        toast({
          title: "Comic created",
          description: "Your comic has been created successfully. Let's start editing!",
        });
        
        // Redirect to the editor
        setLocation(`/creator-studio/${result.comicId}`);
      }
    } catch (error) {
      console.error("Error creating/updating comic:", error);
      toast({
        title: "Error",
        description: "Failed to create comic. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

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
                  defaultValue={field.value}
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
    </div>
  );
}
