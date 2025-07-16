import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Award, Star, BookOpen, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

interface TutorialProgress {
  completed: string[];
  totalTutorials: number;
  skillLevel: "Beginner" | "Intermediate" | "Advanced";
  achievementsBadges: string[];
}

const achievements = [
  { id: "first_tutorial", name: "First Steps", description: "Complete your first tutorial", icon: BookOpen },
  { id: "style_explorer", name: "Style Explorer", description: "Complete 3 different style tutorials", icon: Star },
  { id: "dedicated_learner", name: "Dedicated Learner", description: "Complete all beginner tutorials", icon: Award },
  { id: "art_master", name: "Art Master", description: "Complete all tutorials", icon: CheckCircle },
];

export default function TutorialProgressTracker() {
  const queryClient = useQueryClient();
  
  // Fetch tutorial progress from API
  const { data: serverProgress = [], isLoading } = useQuery({
    queryKey: ["/api/tutorials/progress"],
    staleTime: 60000, // Cache for 1 minute
  });

  // Local state for UI updates
  const [progress, setProgress] = useState<TutorialProgress>({
    completed: [],
    totalTutorials: 8,
    skillLevel: "Beginner",
    achievementsBadges: []
  });

  // Mutation to mark tutorial complete
  const markCompleteMutation = useMutation({
    mutationFn: async ({ tutorialId, quizScore }: { tutorialId: string; quizScore?: number }) => {
      return apiRequest("POST", "/api/tutorials/complete", { tutorialId, quizScore });
    },
    onSuccess: () => {
      // Refresh progress data
      queryClient.invalidateQueries({ queryKey: ["/api/tutorials/progress"] });
      queryClient.invalidateQueries({ queryKey: ["/api/tutorials/achievements"] });
    },
  });

  // Update progress when server data changes
  useEffect(() => {
    if (serverProgress.length > 0) {
      const completedIds = serverProgress.map((p: any) => p.tutorialId);
      const newProgress = {
        completed: completedIds,
        totalTutorials: 8,
        skillLevel: getSkillLevel(completedIds.length),
        achievementsBadges: [] // This will be handled by the achievement component
      };
      setProgress(newProgress);
    } else {
      // Fallback to localStorage for offline functionality
      const savedProgress = localStorage.getItem('comicai-tutorial-progress');
      if (savedProgress) {
        try {
          const parsed = JSON.parse(savedProgress);
          setProgress(parsed);
        } catch (error) {
          console.error('Error loading tutorial progress:', error);
        }
      }
    }
  }, [serverProgress]);

  // Save progress to localStorage as backup
  const saveProgress = (newProgress: TutorialProgress) => {
    setProgress(newProgress);
    localStorage.setItem('comicai-tutorial-progress', JSON.stringify(newProgress));
  };

  const completionPercentage = (progress.completed.length / progress.totalTutorials) * 100;

  const getSkillLevel = (completedCount: number): "Beginner" | "Intermediate" | "Advanced" => {
    if (completedCount >= 6) return "Advanced";
    if (completedCount >= 3) return "Intermediate";
    return "Beginner";
  };

  const getUnlockedAchievements = (completedCount: number, completed: string[]) => {
    const badges = [];
    
    if (completedCount >= 1) badges.push("first_tutorial");
    if (completedCount >= 4) badges.push("style_explorer");
    if (completed.includes("superhero") && completed.includes("manga") && completed.includes("retro")) badges.push("dedicated_learner");
    if (completedCount >= 8) badges.push("art_master");
    
    return badges;
  };

  // Function to be called from tutorials page when a tutorial is completed
  const markTutorialComplete = async (tutorialId: string, quizScore?: number) => {
    if (!progress.completed.includes(tutorialId)) {
      try {
        await markCompleteMutation.mutateAsync({ tutorialId, quizScore });
        
        // Update local state immediately for UI responsiveness
        const newCompleted = [...progress.completed, tutorialId];
        const newProgress = {
          ...progress,
          completed: newCompleted,
          skillLevel: getSkillLevel(newCompleted.length),
          achievementsBadges: getUnlockedAchievements(newCompleted.length, newCompleted)
        };
        saveProgress(newProgress);
      } catch (error) {
        console.error('Error marking tutorial complete:', error);
        // Fallback to local storage only
        const newCompleted = [...progress.completed, tutorialId];
        const newProgress = {
          ...progress,
          completed: newCompleted,
          skillLevel: getSkillLevel(newCompleted.length),
          achievementsBadges: getUnlockedAchievements(newCompleted.length, newCompleted)
        };
        saveProgress(newProgress);
      }
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Learning Progress
          </CardTitle>
          <CardDescription>
            Track your comic art style mastery journey
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Overall Progress</span>
              <span className="text-sm text-muted-foreground">
                {progress.completed.length} / {progress.totalTutorials} tutorials
              </span>
            </div>
            <Progress value={completionPercentage} className="w-full" />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Current Skill Level</p>
              <Badge variant={
                progress.skillLevel === "Beginner" ? "default" : 
                progress.skillLevel === "Intermediate" ? "secondary" : 
                "destructive"
              }>
                {progress.skillLevel}
              </Badge>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Achievements</p>
              <p className="font-semibold">{progress.achievementsBadges.length}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {progress.achievementsBadges.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5 text-yellow-500" />
              Achievements Unlocked
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {achievements
                .filter(achievement => progress.achievementsBadges.includes(achievement.id))
                .map((achievement, index) => (
                  <motion.div
                    key={achievement.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center gap-3 p-3 bg-yellow-50 dark:bg-yellow-950/20 rounded-lg border border-yellow-200 dark:border-yellow-800"
                  >
                    <achievement.icon className="h-6 w-6 text-yellow-600" />
                    <div>
                      <p className="font-medium text-yellow-800 dark:text-yellow-400">
                        {achievement.name}
                      </p>
                      <p className="text-xs text-yellow-700 dark:text-yellow-500">
                        {achievement.description}
                      </p>
                    </div>
                  </motion.div>
                ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

// Export the markTutorialComplete function for use in other components
export { TutorialProgressTracker };
export const useTutorialProgress = () => {
  const markTutorialComplete = (tutorialId: string) => {
    const savedProgress = localStorage.getItem('comicai-tutorial-progress');
    let progress: TutorialProgress = {
      completed: [],
      totalTutorials: 4,
      skillLevel: "Beginner",
      achievementsBadges: []
    };

    if (savedProgress) {
      try {
        progress = JSON.parse(savedProgress);
      } catch (error) {
        console.error('Error loading tutorial progress:', error);
      }
    }

    const newCompleted = [...progress.completed];
    if (!newCompleted.includes(tutorialId)) {
      newCompleted.push(tutorialId);
    }

    const getSkillLevel = (completedCount: number): "Beginner" | "Intermediate" | "Advanced" => {
      if (completedCount >= 4) return "Advanced";
      if (completedCount >= 2) return "Intermediate";
      return "Beginner";
    };

    const getUnlockedAchievements = (completedCount: number, completed: string[]) => {
      const badges = [];
      
      if (completedCount >= 1) badges.push("first_tutorial");
      if (completedCount >= 3) badges.push("style_explorer");
      if (completed.includes("superhero") && completed.includes("manga")) badges.push("dedicated_learner");
      if (completedCount >= 4) badges.push("art_master");
      
      return badges;
    };

    const newProgress: TutorialProgress = {
      ...progress,
      completed: newCompleted,
      skillLevel: getSkillLevel(newCompleted.length),
      achievementsBadges: getUnlockedAchievements(newCompleted.length, newCompleted)
    };

    localStorage.setItem('comicai-tutorial-progress', JSON.stringify(newProgress));
    
    // Dispatch custom event to update UI
    window.dispatchEvent(new CustomEvent('tutorialProgressUpdate', { detail: newProgress }));
    
    return newProgress;
  };

  return { markTutorialComplete };
};