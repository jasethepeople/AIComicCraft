import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, Award, Star, CheckCircle, Zap, Target, Clock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery } from "@tanstack/react-query";

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: any;
  unlockedAt?: Date;
  progress?: number;
  maxProgress?: number;
}

const allAchievements: Achievement[] = [
  {
    id: "first_steps",
    name: "First Steps",
    description: "Complete your first tutorial",
    icon: Star,
  },
  {
    id: "rising_artist", 
    name: "Rising Artist",
    description: "Complete 3 tutorials",
    icon: Award,
    maxProgress: 3,
  },
  {
    id: "art_scholar",
    name: "Art Scholar", 
    description: "Complete 6 tutorials",
    icon: Trophy,
    maxProgress: 6,
  },
  {
    id: "master_creator",
    name: "Master Creator",
    description: "Complete all 8 tutorials",
    icon: CheckCircle,
    maxProgress: 8,
  },
  {
    id: "perfectionist",
    name: "Perfectionist",
    description: "Score 100% on any quiz",
    icon: Target,
  },
  {
    id: "quiz_master",
    name: "Quiz Master",
    description: "Score 100% on 3 quizzes",
    icon: Zap,
    maxProgress: 3,
  },
  {
    id: "speed_learner",
    name: "Speed Learner", 
    description: "Complete a tutorial in under 10 minutes",
    icon: Clock,
  },
];

export default function TutorialAchievementDisplay() {
  const [unlockedAchievements, setUnlockedAchievements] = useState<Achievement[]>([]);
  const [newAchievement, setNewAchievement] = useState<Achievement | null>(null);

  // Fetch achievements from API
  const { data: serverAchievements = [] } = useQuery({
    queryKey: ["/api/tutorials/achievements"],
    staleTime: 30000, // Cache for 30 seconds
  });

  // Load achievements from localStorage as fallback
  useEffect(() => {
    if (serverAchievements.length > 0) {
      // Use server data if available
      const achievements = allAchievements.map(achievement => {
        const serverAchievement = serverAchievements.find((a: any) => a.achievementId === achievement.id);
        return {
          ...achievement,
          unlockedAt: serverAchievement?.unlockedAt ? new Date(serverAchievement.unlockedAt) : undefined,
        };
      }).filter(a => a.unlockedAt);
      
      setUnlockedAchievements(achievements);
    } else {
      // Fallback to localStorage
      const savedProgress = localStorage.getItem('comicai-tutorial-progress');
      if (savedProgress) {
        try {
          const progress = JSON.parse(savedProgress);
          const completedCount = progress.completed?.length || 0;
          
          // Calculate which achievements should be unlocked
          const unlocked = allAchievements.filter(achievement => {
            switch (achievement.id) {
              case "first_steps":
                return completedCount >= 1;
              case "rising_artist":
                return completedCount >= 3;
              case "art_scholar":
                return completedCount >= 6;
              case "master_creator":
                return completedCount >= 8;
              default:
                return false;
            }
          }).map(a => ({ ...a, unlockedAt: new Date() }));
          
          setUnlockedAchievements(unlocked);
        } catch (error) {
          console.error('Error loading achievements:', error);
        }
      }
    }
  }, [serverAchievements]);

  // Listen for new achievements
  useEffect(() => {
    const handleAchievementUnlock = (event: CustomEvent) => {
      const achievement = allAchievements.find(a => a.id === event.detail.achievementId);
      if (achievement) {
        const unlockedAchievement = { ...achievement, unlockedAt: new Date() };
        setUnlockedAchievements(prev => [...prev, unlockedAchievement]);
        setNewAchievement(unlockedAchievement);
        
        // Clear notification after 5 seconds
        setTimeout(() => setNewAchievement(null), 5000);
      }
    };

    window.addEventListener('achievementUnlocked', handleAchievementUnlock as EventListener);
    return () => window.removeEventListener('achievementUnlocked', handleAchievementUnlock as EventListener);
  }, []);

  if (unlockedAchievements.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      {/* Achievement Display */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-yellow-500" />
            Achievements
          </CardTitle>
          <CardDescription>
            Your tutorial accomplishments ({unlockedAchievements.length} unlocked)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {unlockedAchievements.map((achievement, index) => (
              <motion.div
                key={achievement.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center gap-3 p-3 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-950/20 dark:to-orange-950/20 rounded-lg border border-yellow-200 dark:border-yellow-800"
              >
                <div className="p-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-full">
                  <achievement.icon className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-yellow-800 dark:text-yellow-300">
                    {achievement.name}
                  </h4>
                  <p className="text-xs text-yellow-700 dark:text-yellow-400">
                    {achievement.description}
                  </p>
                  {achievement.unlockedAt && (
                    <Badge variant="secondary" className="text-xs mt-1">
                      {achievement.unlockedAt.toLocaleDateString()}
                    </Badge>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* New Achievement Notification */}
      <AnimatePresence>
        {newAchievement && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -50, scale: 0.9 }}
            className="fixed bottom-4 right-4 z-50"
          >
            <Card className="w-80 bg-gradient-to-r from-yellow-400 to-orange-400 text-white border-yellow-300">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white/20 rounded-full">
                    <newAchievement.icon className="h-6 w-6" />
                  </div>
                  <div>
                    <h4 className="font-bold">Achievement Unlocked!</h4>
                    <p className="text-sm">{newAchievement.name}</p>
                    <p className="text-xs opacity-90">{newAchievement.description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}