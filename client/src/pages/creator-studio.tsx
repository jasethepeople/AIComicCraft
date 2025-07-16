import { useEffect, useState } from "react";
import { useParams, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Helmet } from "react-helmet";
import { Comic } from "@shared/schema";
import ComicEditor from "@/components/editor/comic-editor";
import ComicForm from "@/components/comic-form";
import StyleRecommendation from "@/components/style-recommendation";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";

export default function CreatorStudio() {
  const { id } = useParams<{ id: string }>();
  const [location, setLocation] = useLocation();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<string>("recommendations");

  // If ID is provided, fetch the comic data
  const { data: comic, isLoading, isError } = useQuery<Comic>({
    queryKey: id ? [`/api/comics/${id}`] : null,
    enabled: !!id,
  });

  useEffect(() => {
    // If we have an ID but no comic (404), redirect to create new
    if (id && isError) {
      toast({
        title: "Comic not found",
        description: "The comic you're trying to edit doesn't exist.",
        variant: "destructive",
      });
      setLocation("/creator-studio");
    }
  }, [id, isError, setLocation, toast]);

  return (
    <div className="bg-white py-8">
      <Helmet>
        <title>{id ? "Edit Comic" : "Create New Comic"} | ComicAI Creator Studio</title>
        <meta name="description" content="Create and edit your own AI-powered comics with our intuitive creator studio." />
      </Helmet>

      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="font-bangers text-3xl md:text-4xl text-dark mb-2">
              {id ? "Edit Your Comic" : "Create a New Comic"}
            </h1>
            <p className="text-gray-600">
              {id
                ? "Make changes to your comic using our AI-powered tools"
                : "Start your creative journey with our AI-powered comic creator"}
            </p>
          </div>

          {id && (
            <div className="mt-4 md:mt-0 flex gap-4">
              <Button
                variant="outline"
                onClick={() => setLocation("/creator-studio")}
              >
                Create New
              </Button>
              <Button
                variant="default"
                onClick={() => setLocation(`/preview-comic/${id}`)}
              >
                Preview
              </Button>
            </div>
          )}
        </div>

        {isLoading ? (
          <div className="h-96 flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : id ? (
          // Edit existing comic
          <Tabs defaultValue="editor" className="w-full" onValueChange={setActiveTab}>
            <TabsList className="mb-6">
              <TabsTrigger value="editor">Comic Editor</TabsTrigger>
              <TabsTrigger value="details">Comic Details</TabsTrigger>
            </TabsList>
            <TabsContent value="editor">
              <ComicEditor comicId={parseInt(id)} />
            </TabsContent>
            <TabsContent value="details">
              {comic && <ComicForm existingComic={comic} />}
            </TabsContent>
          </Tabs>
        ) : (
          // Create new comic
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="recommendations">AI Style Assistant</TabsTrigger>
              <TabsTrigger value="form">Create Comic</TabsTrigger>
            </TabsList>

            <TabsContent value="recommendations" className="mt-6">
              <StyleRecommendation 
                onStyleSelect={(styleId, styleName) => {
                  setActiveTab("form");
                  toast({
                    title: "Style Selected",
                    description: `Selected ${styleName} for your project. Switch to the Create Comic tab to continue.`,
                  });
                }}
              />
            </TabsContent>

            <TabsContent value="form" className="mt-6">
              <ComicForm />
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  );
}
