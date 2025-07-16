import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { 
  BookOpen, 
  Palette, 
  Users, 
  Target, 
  Sparkles, 
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  Wand2
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type OnboardingData = {
  name: string;
  experience: "beginner" | "intermediate" | "expert";
  interests: string[];
  goals: string[];
  artStyle: string;
  storyIdea: string;
  notifications: boolean;
};

const INTERESTS = [
  "Superhero", "Fantasy", "Sci-Fi", "Romance", "Horror", 
  "Comedy", "Adventure", "Mystery", "Historical", "Educational"
];

const GOALS = [
  "Create comics for fun",
  "Share stories with friends",
  "Build a comic series",
  "Educational content",
  "Professional publishing",
  "Learn comic creation"
];

const ART_STYLES = [
  { id: "superhero", name: "Superhero", description: "Bold, dynamic action style" },
  { id: "manga", name: "Manga", description: "Japanese anime-inspired art" },
  { id: "cartoon", name: "Cartoon", description: "Colorful, playful style" },
  { id: "realistic", name: "Realistic", description: "Lifelike, detailed artwork" },
  { id: "minimalist", name: "Minimalist", description: "Clean, simple designs" }
];

export default function Onboarding() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(0);
  const [data, setData] = useState<OnboardingData>({
    name: "",
    experience: "beginner",
    interests: [],
    goals: [],
    artStyle: "",
    storyIdea: "",
    notifications: true
  });

  const totalSteps = 6;
  const progress = ((currentStep + 1) / totalSteps) * 100;

  const updateData = (updates: Partial<OnboardingData>) => {
    setData(prev => ({ ...prev, ...updates }));
  };

  const handleInterestToggle = (interest: string) => {
    const newInterests = data.interests.includes(interest)
      ? data.interests.filter(i => i !== interest)
      : [...data.interests, interest];
    updateData({ interests: newInterests });
  };

  const handleGoalToggle = (goal: string) => {
    const newGoals = data.goals.includes(goal)
      ? data.goals.filter(g => g !== goal)
      : [...data.goals, goal];
    updateData({ goals: newGoals });
  };

  const canProceed = () => {
    switch (currentStep) {
      case 0: return data.name.trim().length > 0;
      case 1: return true; // Experience level always has default
      case 2: return data.interests.length > 0;
      case 3: return data.goals.length > 0;
      case 4: return data.artStyle.length > 0;
      case 5: return true; // Story idea is optional
      default: return true;
    }
  };

  const handleComplete = () => {
    // Save onboarding data to local storage or user preferences
    localStorage.setItem('onboarding_completed', 'true');
    localStorage.setItem('user_preferences', JSON.stringify(data));
    
    toast({
      title: "Welcome to ComicAI!",
      description: "Your onboarding is complete. Let's create your first comic!"
    });
    
    setLocation("/creator-studio");
  };

  const nextStep = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      handleComplete();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const stepVariants = {
    enter: { opacity: 0, x: 50 },
    center: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -50 }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <motion.div
            key="step0"
            variants={stepVariants}
            initial="enter"
            animate="center"
            exit="exit"
            className="space-y-6"
          >
            <div className="text-center">
              <BookOpen className="w-16 h-16 mx-auto mb-4 text-blue-500" />
              <h2 className="text-2xl font-bold mb-2">Welcome to ComicAI!</h2>
              <p className="text-gray-600">Let's get to know you and set up your comic creation journey.</p>
            </div>
            <div className="space-y-4">
              <Label htmlFor="name">What should we call you?</Label>
              <Input
                id="name"
                placeholder="Enter your name or nickname"
                value={data.name}
                onChange={(e) => updateData({ name: e.target.value })}
                className="text-lg"
              />
            </div>
          </motion.div>
        );

      case 1:
        return (
          <motion.div
            key="step1"
            variants={stepVariants}
            initial="enter"
            animate="center"
            exit="exit"
            className="space-y-6"
          >
            <div className="text-center">
              <Target className="w-16 h-16 mx-auto mb-4 text-green-500" />
              <h2 className="text-2xl font-bold mb-2">What's your experience level?</h2>
              <p className="text-gray-600">This helps us tailor the interface and suggestions for you.</p>
            </div>
            <RadioGroup 
              value={data.experience} 
              onValueChange={(value) => updateData({ experience: value as any })}
              className="space-y-4"
            >
              <div className="flex items-center space-x-3 p-4 border rounded-lg">
                <RadioGroupItem value="beginner" id="beginner" />
                <div>
                  <Label htmlFor="beginner" className="font-medium">Beginner</Label>
                  <p className="text-sm text-gray-600">New to comic creation</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-4 border rounded-lg">
                <RadioGroupItem value="intermediate" id="intermediate" />
                <div>
                  <Label htmlFor="intermediate" className="font-medium">Intermediate</Label>
                  <p className="text-sm text-gray-600">Some experience with storytelling or art</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-4 border rounded-lg">
                <RadioGroupItem value="expert" id="expert" />
                <div>
                  <Label htmlFor="expert" className="font-medium">Expert</Label>
                  <p className="text-sm text-gray-600">Professional or advanced creator</p>
                </div>
              </div>
            </RadioGroup>
          </motion.div>
        );

      case 2:
        return (
          <motion.div
            key="step2"
            variants={stepVariants}
            initial="enter"
            animate="center"
            exit="exit"
            className="space-y-6"
          >
            <div className="text-center">
              <Sparkles className="w-16 h-16 mx-auto mb-4 text-purple-500" />
              <h2 className="text-2xl font-bold mb-2">What genres interest you?</h2>
              <p className="text-gray-600">Select all that apply. We'll use this to suggest story ideas.</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {INTERESTS.map((interest) => (
                <div
                  key={interest}
                  className={`p-3 border rounded-lg cursor-pointer transition-all ${
                    data.interests.includes(interest)
                      ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                      : "hover:border-gray-300"
                  }`}
                  onClick={() => handleInterestToggle(interest)}
                >
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      checked={data.interests.includes(interest)}
                      onChange={() => handleInterestToggle(interest)}
                    />
                    <span className="text-sm font-medium">{interest}</span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        );

      case 3:
        return (
          <motion.div
            key="step3"
            variants={stepVariants}
            initial="enter"
            animate="center"
            exit="exit"
            className="space-y-6"
          >
            <div className="text-center">
              <Users className="w-16 h-16 mx-auto mb-4 text-orange-500" />
              <h2 className="text-2xl font-bold mb-2">What are your goals?</h2>
              <p className="text-gray-600">Tell us what you want to achieve with ComicAI.</p>
            </div>
            <div className="space-y-3">
              {GOALS.map((goal) => (
                <div
                  key={goal}
                  className={`p-4 border rounded-lg cursor-pointer transition-all ${
                    data.goals.includes(goal)
                      ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                      : "hover:border-gray-300"
                  }`}
                  onClick={() => handleGoalToggle(goal)}
                >
                  <div className="flex items-center space-x-3">
                    <Checkbox 
                      checked={data.goals.includes(goal)}
                      onChange={() => handleGoalToggle(goal)}
                    />
                    <span className="font-medium">{goal}</span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        );

      case 4:
        return (
          <motion.div
            key="step4"
            variants={stepVariants}
            initial="enter"
            animate="center"
            exit="exit"
            className="space-y-6"
          >
            <div className="text-center">
              <Palette className="w-16 h-16 mx-auto mb-4 text-pink-500" />
              <h2 className="text-2xl font-bold mb-2">Choose your art style</h2>
              <p className="text-gray-600">What visual style appeals to you most?</p>
            </div>
            <div className="space-y-3">
              {ART_STYLES.map((style) => (
                <div
                  key={style.id}
                  className={`p-4 border rounded-lg cursor-pointer transition-all ${
                    data.artStyle === style.id
                      ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                      : "hover:border-gray-300"
                  }`}
                  onClick={() => updateData({ artStyle: style.id })}
                >
                  <div className="flex items-center space-x-3">
                    <RadioGroupItem 
                      value={style.id} 
                      id={style.id}
                      checked={data.artStyle === style.id}
                    />
                    <div>
                      <Label htmlFor={style.id} className="font-medium cursor-pointer">
                        {style.name}
                      </Label>
                      <p className="text-sm text-gray-600">{style.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        );

      case 5:
        return (
          <motion.div
            key="step5"
            variants={stepVariants}
            initial="enter"
            animate="center"
            exit="exit"
            className="space-y-6"
          >
            <div className="text-center">
              <Wand2 className="w-16 h-16 mx-auto mb-4 text-indigo-500" />
              <h2 className="text-2xl font-bold mb-2">Share your story idea</h2>
              <p className="text-gray-600">Do you have a comic story in mind? (Optional)</p>
            </div>
            <div className="space-y-4">
              <Label htmlFor="story">Describe your story idea</Label>
              <Textarea
                id="story"
                placeholder="A brave hero discovers magical powers and must save their village from an ancient evil..."
                value={data.storyIdea}
                onChange={(e) => updateData({ storyIdea: e.target.value })}
                rows={4}
                className="resize-none"
              />
              <p className="text-sm text-gray-500">
                Don't worry if you don't have an idea yet - we'll help you brainstorm!
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="notifications"
                checked={data.notifications}
                onCheckedChange={(checked) => updateData({ notifications: checked as boolean })}
              />
              <Label htmlFor="notifications" className="text-sm">
                Send me tips and inspiration via notifications
              </Label>
            </div>
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <div className="flex items-center justify-between mb-4">
              <CardTitle className="text-lg">Setup Your Comic Journey</CardTitle>
              <span className="text-sm text-gray-500">
                {currentStep + 1} of {totalSteps}
              </span>
            </div>
            <Progress value={progress} className="h-2" />
          </CardHeader>
          
          <CardContent className="space-y-6">
            <AnimatePresence mode="wait">
              {renderStep()}
            </AnimatePresence>
            
            <div className="flex justify-between pt-6">
              <Button
                variant="outline"
                onClick={prevStep}
                disabled={currentStep === 0}
                className="flex items-center space-x-2"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </Button>
              
              <Button
                onClick={nextStep}
                disabled={!canProceed()}
                className="flex items-center space-x-2"
              >
                <span>{currentStep === totalSteps - 1 ? "Complete" : "Next"}</span>
                {currentStep === totalSteps - 1 ? (
                  <CheckCircle className="w-4 h-4" />
                ) : (
                  <ArrowRight className="w-4 h-4" />
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}