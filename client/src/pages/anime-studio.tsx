import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2, Play, Download, Share } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { animeGenerationSchema, type AnimeGenerationRequest } from "@shared/schema";
import { z } from "zod";

type AnimeFormValues = z.infer<typeof animeGenerationSchema>;

interface Character {
  name: string;
  description: string;
  voiceType: "young_male" | "young_female" | "mature_male" | "mature_female" | "child" | "elderly";
  personality?: string;
}

interface Scene {
  description: string;
  duration: number;
  dialogues: Array<{
    character: string;
    text: string;
    emotion: "happy" | "sad" | "angry" | "surprised" | "neutral" | "excited";
  }>;
  cameraMovement: "static" | "pan" | "zoom" | "rotation";
  effects: string[];
}

export default function AnimeStudio() {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [scenes, setScenes] = useState<Scene[]>([]);
  const [generatedAnime, setGeneratedAnime] = useState<any>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);

  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch art styles
  const { data: artStyles = [] } = useQuery({
    queryKey: ["/api/art-styles"],
  });

  const form = useForm<AnimeFormValues>({
    resolver: zodResolver(animeGenerationSchema),
    defaultValues: {
      title: "",
      description: "",
      artStyle: "",
      animationStyle: "2D",
      frameRate: 24,
      duration: 30,
      characters: [],
      scenes: [],
      musicStyle: "none",
      prompt: "",
    },
  });

  const addCharacter = () => {
    const newCharacter: Character = {
      name: "",
      description: "",
      voiceType: "young_male",
      personality: "",
    };
    setCharacters([...characters, newCharacter]);
  };

  const updateCharacter = (index: number, field: keyof Character, value: string) => {
    const updated = [...characters];
    updated[index] = { ...updated[index], [field]: value };
    setCharacters(updated);
  };

  const removeCharacter = (index: number) => {
    setCharacters(characters.filter((_, i) => i !== index));
  };

  const addScene = () => {
    const newScene: Scene = {
      description: "",
      duration: 5,
      dialogues: [],
      cameraMovement: "static",
      effects: [],
    };
    setScenes([...scenes, newScene]);
  };

  const updateScene = (index: number, field: keyof Scene, value: any) => {
    const updated = [...scenes];
    updated[index] = { ...updated[index], [field]: value };
    setScenes(updated);
  };

  const removeScene = (index: number) => {
    setScenes(scenes.filter((_, i) => i !== index));
  };

  const addDialogue = (sceneIndex: number) => {
    const updated = [...scenes];
    if (!updated[sceneIndex].dialogues) {
      updated[sceneIndex].dialogues = [];
    }
    updated[sceneIndex].dialogues.push({
      character: characters[0]?.name || "",
      text: "",
      emotion: "neutral",
    });
    setScenes(updated);
  };

  const updateDialogue = (sceneIndex: number, dialogueIndex: number, field: string, value: string) => {
    const updated = [...scenes];
    updated[sceneIndex].dialogues[dialogueIndex] = {
      ...updated[sceneIndex].dialogues[dialogueIndex],
      [field]: value,
    };
    setScenes(updated);
  };

  const removeDialogue = (sceneIndex: number, dialogueIndex: number) => {
    const updated = [...scenes];
    updated[sceneIndex].dialogues = updated[sceneIndex].dialogues.filter((_, i) => i !== dialogueIndex);
    setScenes(updated);
  };

  const generateAnimeMutation = useMutation({
    mutationFn: async (data: AnimeFormValues) => {
      setIsGenerating(true);
      setGenerationProgress(0);
      
      // Simulate progress updates
      const progressInterval = setInterval(() => {
        setGenerationProgress(prev => Math.min(prev + 10, 90));
      }, 500);

      try {
        const response = await apiRequest("/api/generate/anime", {
          method: "POST",
          body: JSON.stringify(data),
        });
        
        clearInterval(progressInterval);
        setGenerationProgress(100);
        return response;
      } catch (error) {
        clearInterval(progressInterval);
        throw error;
      } finally {
        setTimeout(() => {
          setIsGenerating(false);
          setGenerationProgress(0);
        }, 1000);
      }
    },
    onSuccess: (data) => {
      setGeneratedAnime(data);
      toast({
        title: "Anime Generated!",
        description: `Successfully created "${data.title}" with ${data.frameCount} frames.`,
      });
      queryClient.invalidateQueries({ queryKey: ["/api/comics/user/me"] });
    },
    onError: (error: any) => {
      toast({
        title: "Generation Failed",
        description: error.message || "Failed to generate anime. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = async (data: AnimeFormValues) => {
    if (characters.length === 0) {
      toast({
        title: "Missing Characters",
        description: "Please add at least one character to your anime.",
        variant: "destructive",
      });
      return;
    }

    if (scenes.length === 0) {
      toast({
        title: "Missing Scenes",
        description: "Please add at least one scene to your anime.",
        variant: "destructive",
      });
      return;
    }

    const animeData = {
      ...data,
      characters: characters.filter(char => char.name && char.description),
      scenes: scenes.filter(scene => scene.description),
    };

    generateAnimeMutation.mutate(animeData);
  };

  const animeStyles = artStyles.filter((style: any) => 
    ["Studio Ghibli", "Shonen Anime", "Slice of Life", "Mecha Anime", "Chibi Style", "Dark Anime", "Kawaii Anime", "Traditional Japanese"].includes(style.name)
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">Anime Studio</h1>
          <p className="text-xl text-muted-foreground">
            Create AI-generated anime with custom characters, scenes, and storylines
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Form Panel */}
          <div className="space-y-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {/* Basic Info */}
                <Card>
                  <CardHeader>
                    <CardTitle>Basic Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Anime Title</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter your anime title..." {...field} />
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
                            <Textarea placeholder="Brief description of your anime..." {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="artStyle"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Art Style</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select style" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {animeStyles.map((style: any) => (
                                  <SelectItem key={style.id} value={style.name}>
                                    {style.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="animationStyle"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Animation Style</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select animation" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="2D">2D Animation</SelectItem>
                                <SelectItem value="3D">3D Animation</SelectItem>
                                <SelectItem value="mixed">Mixed Style</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <FormField
                        control={form.control}
                        name="duration"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Duration (seconds)</FormLabel>
                            <FormControl>
                              <Input 
                                type="number" 
                                min={5} 
                                max={300} 
                                {...field} 
                                onChange={e => field.onChange(Number(e.target.value))}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="frameRate"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Frame Rate</FormLabel>
                            <FormControl>
                              <Input 
                                type="number" 
                                min={12} 
                                max={60} 
                                {...field} 
                                onChange={e => field.onChange(Number(e.target.value))}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="musicStyle"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Music Style</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select music" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="none">No Music</SelectItem>
                                <SelectItem value="epic">Epic</SelectItem>
                                <SelectItem value="dramatic">Dramatic</SelectItem>
                                <SelectItem value="cheerful">Cheerful</SelectItem>
                                <SelectItem value="mysterious">Mysterious</SelectItem>
                                <SelectItem value="action">Action</SelectItem>
                                <SelectItem value="romance">Romance</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Characters */}
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Characters</CardTitle>
                    <Button type="button" onClick={addCharacter} size="sm">
                      <Plus className="w-4 h-4 mr-2" />
                      Add Character
                    </Button>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {characters.map((character, index) => (
                      <div key={index} className="border rounded-lg p-4 space-y-3">
                        <div className="flex justify-between items-center">
                          <h4 className="font-medium">Character {index + 1}</h4>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeCharacter(index)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-3">
                          <Input
                            placeholder="Character name"
                            value={character.name}
                            onChange={e => updateCharacter(index, "name", e.target.value)}
                          />
                          <Select
                            value={character.voiceType}
                            onValueChange={value => updateCharacter(index, "voiceType", value)}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="young_male">Young Male</SelectItem>
                              <SelectItem value="young_female">Young Female</SelectItem>
                              <SelectItem value="mature_male">Mature Male</SelectItem>
                              <SelectItem value="mature_female">Mature Female</SelectItem>
                              <SelectItem value="child">Child</SelectItem>
                              <SelectItem value="elderly">Elderly</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <Textarea
                          placeholder="Character description and appearance"
                          value={character.description}
                          onChange={e => updateCharacter(index, "description", e.target.value)}
                        />
                        
                        <Input
                          placeholder="Personality traits (optional)"
                          value={character.personality || ""}
                          onChange={e => updateCharacter(index, "personality", e.target.value)}
                        />
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Scenes */}
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Scenes</CardTitle>
                    <Button type="button" onClick={addScene} size="sm">
                      <Plus className="w-4 h-4 mr-2" />
                      Add Scene
                    </Button>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {scenes.map((scene, sceneIndex) => (
                      <div key={sceneIndex} className="border rounded-lg p-4 space-y-3">
                        <div className="flex justify-between items-center">
                          <h4 className="font-medium">Scene {sceneIndex + 1}</h4>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeScene(sceneIndex)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                        
                        <Textarea
                          placeholder="Scene description"
                          value={scene.description}
                          onChange={e => updateScene(sceneIndex, "description", e.target.value)}
                        />
                        
                        <div className="grid grid-cols-2 gap-3">
                          <Input
                            type="number"
                            placeholder="Duration (seconds)"
                            min={1}
                            max={30}
                            value={scene.duration}
                            onChange={e => updateScene(sceneIndex, "duration", Number(e.target.value))}
                          />
                          <Select
                            value={scene.cameraMovement}
                            onValueChange={value => updateScene(sceneIndex, "cameraMovement", value)}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="static">Static</SelectItem>
                              <SelectItem value="pan">Pan</SelectItem>
                              <SelectItem value="zoom">Zoom</SelectItem>
                              <SelectItem value="rotation">Rotation</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        {/* Dialogues for this scene */}
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <h5 className="text-sm font-medium">Dialogues</h5>
                            <Button
                              type="button"
                              size="sm"
                              variant="outline"
                              onClick={() => addDialogue(sceneIndex)}
                              disabled={characters.length === 0}
                            >
                              <Plus className="w-3 h-3 mr-1" />
                              Add Dialogue
                            </Button>
                          </div>
                          
                          {scene.dialogues?.map((dialogue, dialogueIndex) => (
                            <div key={dialogueIndex} className="flex gap-2 items-start">
                              <Select
                                value={dialogue.character}
                                onValueChange={value => updateDialogue(sceneIndex, dialogueIndex, "character", value)}
                              >
                                <SelectTrigger className="w-32">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  {characters.map((char, i) => (
                                    <SelectItem key={i} value={char.name}>
                                      {char.name || `Character ${i + 1}`}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              
                              <Input
                                placeholder="Dialogue text"
                                value={dialogue.text}
                                onChange={e => updateDialogue(sceneIndex, dialogueIndex, "text", e.target.value)}
                                className="flex-1"
                              />
                              
                              <Select
                                value={dialogue.emotion}
                                onValueChange={value => updateDialogue(sceneIndex, dialogueIndex, "emotion", value)}
                              >
                                <SelectTrigger className="w-24">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="neutral">😐</SelectItem>
                                  <SelectItem value="happy">😊</SelectItem>
                                  <SelectItem value="sad">😢</SelectItem>
                                  <SelectItem value="angry">😠</SelectItem>
                                  <SelectItem value="surprised">😲</SelectItem>
                                  <SelectItem value="excited">😆</SelectItem>
                                </SelectContent>
                              </Select>
                              
                              <Button
                                type="button"
                                size="sm"
                                variant="ghost"
                                onClick={() => removeDialogue(sceneIndex, dialogueIndex)}
                              >
                                <Trash2 className="w-3 h-3" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Story Prompt */}
                <Card>
                  <CardHeader>
                    <CardTitle>Story Prompt</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <FormField
                      control={form.control}
                      name="prompt"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Detailed Story Description</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Describe the overall story, mood, themes, and visual style you want for your anime..."
                              className="min-h-[120px]"
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>

                <Button 
                  type="submit" 
                  size="lg" 
                  disabled={isGenerating}
                  className="w-full"
                >
                  {isGenerating ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                      Generating Anime... {generationProgress}%
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 mr-2" />
                      Generate Anime
                    </>
                  )}
                </Button>
              </form>
            </Form>
          </div>

          {/* Preview Panel */}
          <div className="space-y-6">
            {generatedAnime ? (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    {generatedAnime.title}
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        <Download className="w-4 h-4 mr-2" />
                        Export
                      </Button>
                      <Button size="sm" variant="outline">
                        <Share className="w-4 h-4 mr-2" />
                        Share
                      </Button>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-4">
                    <Badge variant="secondary">
                      {generatedAnime.frameCount} frames
                    </Badge>
                    <Badge variant="secondary">
                      {generatedAnime.duration}s duration
                    </Badge>
                    <Badge variant="secondary">
                      {generatedAnime.contentType}
                    </Badge>
                  </div>
                  
                  <p className="text-sm text-muted-foreground">
                    {generatedAnime.description}
                  </p>

                  <div className="grid grid-cols-2 gap-3 max-h-96 overflow-y-auto">
                    {generatedAnime.panels?.map((panel: any, index: number) => (
                      <div key={panel.id} className="relative group">
                        <img 
                          src={panel.imageUrl} 
                          alt={`Frame ${index + 1}`}
                          className="w-full h-32 object-cover rounded-lg"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors rounded-lg" />
                        <div className="absolute top-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                          Frame {panel.sequence}
                        </div>
                        {panel.duration && (
                          <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                            {(panel.duration / 1000).toFixed(1)}s
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="text-center py-12">
                  <div className="text-muted-foreground mb-4">
                    <Play className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <h3 className="text-lg font-medium mb-2">Ready to Create Anime</h3>
                    <p>Fill out the form to generate your AI-powered anime with custom characters and scenes.</p>
                  </div>
                </CardContent>
              </Card>
            )}

            {isGenerating && (
              <Card>
                <CardContent className="py-8">
                  <div className="text-center space-y-4">
                    <div className="animate-pulse">
                      <Play className="w-12 h-12 mx-auto mb-4 text-primary" />
                    </div>
                    <h3 className="text-lg font-medium">Generating Your Anime</h3>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-primary h-2 rounded-full transition-all duration-500"
                        style={{ width: `${generationProgress}%` }}
                      />
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Creating frames and processing animations... {generationProgress}%
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}