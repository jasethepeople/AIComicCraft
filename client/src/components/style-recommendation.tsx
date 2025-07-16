import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Sparkles, Star, StarIcon, TrendingUp, Palette } from "lucide-react";
import { motion } from "framer-motion";

interface StyleRecommendation {
  styleId: number;
  styleName: string;
  confidence: number;
  reasoning: string;
}

interface StyleRecommendationProps {
  onStyleSelect?: (styleId: number, styleName: string) => void;
  initialData?: {
    title?: string;
    description?: string;
    contentType?: "comic" | "anime" | "manga";
    characters?: Array<{ name: string; description: string }>;
  };
}

export default function StyleRecommendation({ onStyleSelect, initialData }: StyleRecommendationProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [formData, setFormData] = useState({
    title: initialData?.title || "",
    description: initialData?.description || "",
    contentType: initialData?.contentType || "comic" as const,
    genre: "",
    targetAudience: "",
    mood: "",
    characters: initialData?.characters || [],
  });

  const [showRecommendations, setShowRecommendations] = useState(false);

  // Fetch user's style preferences
  const { data: preferences } = useQuery({
    queryKey: ["/api/styles/preferences"],
  });

  // Generate recommendations mutation
  const recommendationMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const response = await apiRequest("POST", "/api/styles/recommend", data);
      return response.json();
    },
    onSuccess: (data) => {
      setShowRecommendations(true);
      toast({
        title: "Recommendations Generated!",
        description: `Found ${data.recommendations.length} suitable art styles for your project.`,
      });
    },
    onError: (error: any) => {
      console.error("Style recommendation error:", error);
      toast({
        title: "Generation Failed",
        description: "Failed to generate style recommendations. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Rate art style mutation
  const rateMutation = useMutation({
    mutationFn: async ({ styleId, rating }: { styleId: number; rating: number }) => {
      const response = await apiRequest("POST", `/api/styles/${styleId}/rate`, { rating });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/styles/preferences"] });
      toast({
        title: "Rating Saved",
        description: "Your art style rating has been recorded.",
      });
    },
    onError: (error: any) => {
      console.error("Rating error:", error);
      toast({
        title: "Rating Failed",
        description: "Failed to save your rating. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    recommendationMutation.mutate(formData);
  };

  const handleStyleSelect = (recommendation: StyleRecommendation) => {
    if (onStyleSelect) {
      onStyleSelect(recommendation.styleId, recommendation.styleName);
    }
    toast({
      title: "Style Selected",
      description: `Selected ${recommendation.styleName} for your project.`,
    });
  };

  const handleRating = (styleId: number, rating: number) => {
    rateMutation.mutate({ styleId, rating });
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return "text-green-600";
    if (confidence >= 0.6) return "text-yellow-600";
    return "text-orange-600";
  };

  const recommendations = recommendationMutation.data?.recommendations || [];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-500" />
            AI Style Recommendation Engine
          </CardTitle>
          <CardDescription>
            Get personalized art style recommendations based on your project details and preferences
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="title">Project Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Enter your project title..."
                />
              </div>
              
              <div>
                <Label htmlFor="contentType">Content Type</Label>
                <Select 
                  value={formData.contentType} 
                  onValueChange={(value: "comic" | "anime" | "manga") => 
                    setFormData({ ...formData, contentType: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="comic">Comic</SelectItem>
                    <SelectItem value="anime">Anime</SelectItem>
                    <SelectItem value="manga">Manga</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="description">Project Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe your project, story, or concept..."
                rows={3}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="genre">Genre (Optional)</Label>
                <Input
                  id="genre"
                  value={formData.genre}
                  onChange={(e) => setFormData({ ...formData, genre: e.target.value })}
                  placeholder="e.g., Action, Romance, Horror"
                />
              </div>
              
              <div>
                <Label htmlFor="targetAudience">Target Audience</Label>
                <Select 
                  value={formData.targetAudience} 
                  onValueChange={(value) => 
                    setFormData({ ...formData, targetAudience: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select audience" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="children">Children</SelectItem>
                    <SelectItem value="teens">Teens</SelectItem>
                    <SelectItem value="adults">Adults</SelectItem>
                    <SelectItem value="all">All Ages</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="mood">Mood/Tone</Label>
                <Select 
                  value={formData.mood} 
                  onValueChange={(value) => 
                    setFormData({ ...formData, mood: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select mood" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="lighthearted">Lighthearted</SelectItem>
                    <SelectItem value="serious">Serious</SelectItem>
                    <SelectItem value="dark">Dark</SelectItem>
                    <SelectItem value="adventure">Adventure</SelectItem>
                    <SelectItem value="romance">Romance</SelectItem>
                    <SelectItem value="action">Action</SelectItem>
                    <SelectItem value="comedy">Comedy</SelectItem>
                    <SelectItem value="drama">Drama</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full" 
              disabled={recommendationMutation.isPending}
            >
              {recommendationMutation.isPending ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Analyzing Your Project...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  Get Style Recommendations
                </div>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* User's Style Preferences */}
      {preferences?.stats && preferences.stats.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-blue-500" />
              Your Style Preferences
            </CardTitle>
            <CardDescription>
              Based on your previous art style usage and ratings
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {preferences.stats.slice(0, 6).map((stat: any) => (
                <div key={stat.artStyleId} className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-medium">{stat.styleName}</h4>
                    {stat.rating && (
                      <div className="flex items-center gap-1">
                        <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                        <span className="text-xs">{stat.rating}</span>
                      </div>
                    )}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Used {stat.usageCount} time{stat.usageCount !== 1 ? 's' : ''}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recommendations Results */}
      {showRecommendations && recommendations.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="w-5 h-5 text-purple-500" />
              Recommended Art Styles
            </CardTitle>
            <CardDescription>
              AI-powered recommendations tailored to your project
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recommendations.map((recommendation: StyleRecommendation, index: number) => (
                <motion.div
                  key={recommendation.styleId}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="p-4 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg">{recommendation.styleName}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="secondary">
                            <span className={getConfidenceColor(recommendation.confidence)}>
                              {Math.round(recommendation.confidence * 100)}% confidence
                            </span>
                          </Badge>
                          <Progress 
                            value={recommendation.confidence * 100} 
                            className="w-20 h-2"
                          />
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <div className="flex items-center gap-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <StarIcon
                              key={star}
                              className="w-4 h-4 cursor-pointer hover:scale-110 transition-transform"
                              onClick={() => handleRating(recommendation.styleId, star)}
                              fill={star <= 3 ? "#fbbf24" : "none"}
                              stroke={star <= 3 ? "#fbbf24" : "#d1d5db"}
                            />
                          ))}
                        </div>
                        <Button
                          onClick={() => handleStyleSelect(recommendation)}
                          variant="default"
                          size="sm"
                        >
                          Select Style
                        </Button>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">
                      {recommendation.reasoning}
                    </p>
                  </Card>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}