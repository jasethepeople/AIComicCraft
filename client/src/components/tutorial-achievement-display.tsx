import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { Trophy, Star, Award, BookOpen, Target, Crown, Zap, Medal } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

interface Achievement {
  id: string;
  achievementId: string;
  unlockedAt: string;
}

interface AchievementDefinition {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  category: "completion" | "performance" | "special";
  rarity: "common" | "rare" | "epic" | "legendary";
}

const achievementDefinitions: AchievementDefinition[] = [
  {
    id: "first_tutorial",
    title: "First Steps",
    description: "Complete your first tutorial",
    icon: BookOpen,
    category: "completion",
    rarity: "common"
  },
  {
    id: "intermediate_learner",
    title: "Rising Artist",
    description: "Complete 3 tutorials",
    icon: Star,
    category: "completion",
    rarity: "common"
  },
  {
    id: "advanced_student",
    title: "Art Scholar",
    description: "Complete 6 tutorials",
    icon: Award,
    category: "completion",
    rarity: "rare"
  },
  {
    id: "master_artist",
    title: "Master Creator",
    description: "Complete all 8 tutorials",
    icon: Crown,
    category: "completion",
    rarity: "legendary"
  },
  {
    id: "perfect_score",
    title: "Perfectionist",
    description: "Score 100% on any quiz",
    icon: Target,
    category: "performance",
    rarity: "epic"
  },
  {
    id: "quiz_master",
    title: "Quiz Master",
    description: "Score 100% on 3 different quizzes",
    icon: Zap,
    category: "performance",
    rarity: "legendary"
  },
  {
    id: "speed_learner",
    title: "Speed Learner",
    description: "Complete a tutorial in under 10 minutes",
    icon: Medal,
    category: "special",
    rarity: "rare"
  }
];

const rarityColors = {
  common: "bg-gray-100 border-gray-300 text-gray-800",
  rare: "bg-blue-100 border-blue-300 text-blue-800",
  epic: "bg-purple-100 border-purple-300 text-purple-800",
  legendary: "bg-yellow-100 border-yellow-300 text-yellow-800"
};

export default function TutorialAchievementDisplay() {
  const [showAll, setShowAll] = useState(false);
  const [newAchievements, setNewAchievements] = useState<string[]>([]);

  const { data: achievements = [], isLoading } = useQuery({
    queryKey: ["/api/tutorials/achievements"],
    staleTime: 60000, // Cache for 1 minute
  });

  const unlockedIds = new Set(achievements.map((a: Achievement) => a.achievementId));
  const unlockedAchievements = achievementDefinitions.filter(def => unlockedIds.has(def.id));
  const lockedAchievements = achievementDefinitions.filter(def => !unlockedIds.has(def.id));

  // Show notification for new achievements
  useEffect(() => {
    const lastSeen = localStorage.getItem('lastSeenAchievements');
    const lastSeenIds = lastSeen ? JSON.parse(lastSeen) : [];
    const newIds = unlockedAchievements
      .map(a => a.id)
      .filter(id => !lastSeenIds.includes(id));
    
    if (newIds.length > 0) {
      setNewAchievements(newIds);
      localStorage.setItem('lastSeenAchievements', JSON.stringify(unlockedAchievements.map(a => a.id)));
    }
  }, [achievements]);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5" />
            Achievements
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-2">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-12 bg-gray-200 rounded" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const displayAchievements = showAll ? achievementDefinitions : unlockedAchievements.slice(0, 3);

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5" />
            Achievements ({unlockedAchievements.length}/{achievementDefinitions.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <AnimatePresence>
            {displayAchievements.map((achievement) => {
              const isUnlocked = unlockedIds.has(achievement.id);
              const isNew = newAchievements.includes(achievement.id);
              const Icon = achievement.icon;
              
              return (
                <motion.div
                  key={achievement.id}
                  initial={isNew ? { scale: 0.8, opacity: 0 } : false}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                  className={`flex items-center gap-3 p-3 rounded-lg border-2 transition-all ${
                    isUnlocked 
                      ? rarityColors[achievement.rarity] 
                      : "bg-gray-50 border-gray-200 text-gray-500"
                  } ${isNew ? "ring-2 ring-yellow-400 shadow-lg" : ""}`}
                >
                  <div className={`p-2 rounded-full ${
                    isUnlocked ? "bg-white/50" : "bg-gray-200"
                  }`}>
                    <Icon className={`h-5 w-5 ${
                      isUnlocked ? "text-current" : "text-gray-400"
                    }`} />
                  </div>
                  
                  <div className="flex-1">
                    <h4 className={`font-semibold ${
                      isUnlocked ? "text-current" : "text-gray-400"
                    }`}>
                      {achievement.title}
                    </h4>
                    <p className={`text-sm ${
                      isUnlocked ? "text-current opacity-80" : "text-gray-400"
                    }`}>
                      {achievement.description}
                    </p>
                  </div>
                  
                  <div className="flex flex-col items-end gap-1">
                    <Badge variant={isUnlocked ? "default" : "secondary"} className="text-xs">
                      {achievement.rarity}
                    </Badge>
                    {isUnlocked && (
                      <Badge variant="secondary" className="text-xs">
                        ✓ Unlocked
                      </Badge>
                    )}
                    {isNew && (
                      <Badge className="text-xs bg-yellow-500 text-white animate-pulse">
                        NEW!
                      </Badge>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
          
          {!showAll && achievementDefinitions.length > 3 && (
            <Button 
              variant="outline" 
              onClick={() => setShowAll(true)}
              className="w-full"
            >
              Show All Achievements ({lockedAchievements.length} locked)
            </Button>
          )}
          
          {showAll && (
            <Button 
              variant="outline" 
              onClick={() => setShowAll(false)}
              className="w-full"
            >
              Show Less
            </Button>
          )}
        </CardContent>
      </Card>
      
      {newAchievements.length > 0 && (
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 50, opacity: 0 }}
          className="fixed bottom-4 right-4 z-50"
        >
          <Card className="bg-yellow-50 border-yellow-200 shadow-lg">
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Trophy className="h-5 w-5 text-yellow-600" />
                <span className="font-semibold text-yellow-800">
                  New Achievement{newAchievements.length > 1 ? 's' : ''} Unlocked!
                </span>
                <Button 
                  size="sm" 
                  variant="ghost" 
                  onClick={() => setNewAchievements([])}
                >
                  ✕
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
}