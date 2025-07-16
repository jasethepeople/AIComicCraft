import { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  Play, 
  Pause, 
  RotateCcw, 
  ChevronRight, 
  ChevronLeft, 
  BookOpen, 
  Lightbulb,
  Zap,
  Users,
  Trophy,
  Download
} from "lucide-react";
import { useLocation } from "wouter";

interface TutorialStep {
  id: number;
  title: string;
  description: string;
  content: string;
  duration: number; // in seconds
  tips: string[];
}

const tutorialSteps: TutorialStep[] = [
  {
    id: 1,
    title: "Welcome to ComicAI!",
    description: "Meet your AI comic creation companion",
    content: "Hi there, future comic creator! I'm your friendly AI guide, here to help you master the art of digital comic creation. Together, we'll explore all the amazing features that make ComicAI the most intuitive comic creation platform on the web!",
    duration: 15,
    tips: [
      "Take your time - there's no rush to complete the tutorial",
      "You can pause and replay any step as many times as you need",
      "Each step builds on the previous one for the best learning experience"
    ]
  },
  {
    id: 2,
    title: "Your Creative Dashboard",
    description: "Navigate the Creator Studio like a pro",
    content: "The Creator Studio is your creative headquarters! Here you'll find all the tools you need: the comic editor for panel creation, character builder for developing your cast, and story generator for crafting compelling narratives. Think of it as your personal comic book workshop!",
    duration: 20,
    tips: [
      "The toolbar on the left contains all your creative tools",
      "Use the preview mode to see how your comic looks to readers",
      "Save your work frequently using Ctrl+S or the save button"
    ]
  },
  {
    id: 3,
    title: "Building Your Characters",
    description: "Create memorable heroes and villains",
    content: "Great comics start with great characters! Our character builder lets you define personalities, appearances, and backstories. The more detail you provide, the better our AI can bring your characters to life in each panel. Remember: every superhero needs a compelling origin story!",
    duration: 25,
    tips: [
      "Write detailed character descriptions for better AI generation",
      "Consider your character's motivations and personality traits",
      "You can edit and refine characters throughout your comic creation"
    ]
  },
  {
    id: 4,
    title: "Crafting Your Story",
    description: "From idea to epic adventure",
    content: "Every great comic tells a story worth reading! Start with a simple premise, then add conflict, character development, and resolution. Our AI story generator can help you brainstorm plot points, but remember - you're the creative director. Your unique voice is what makes your comic special!",
    duration: 30,
    tips: [
      "Start with a simple three-act structure: setup, conflict, resolution",
      "Give your characters clear goals and obstacles to overcome",
      "Don't forget to include moments of humor or emotion"
    ]
  },
  {
    id: 5,
    title: "Panel Magic",
    description: "Bringing scenes to life with AI",
    content: "Now for the exciting part - creating your panels! Each panel is like a movie frame, capturing a moment in your story. Describe the scene, choose your art style, and watch as our AI transforms your words into stunning visuals. Pro tip: vary your panel sizes and angles for dynamic storytelling!",
    duration: 35,
    tips: [
      "Use different panel sizes to control pacing and emphasis",
      "Try various camera angles: close-ups, wide shots, bird's eye view",
      "Experiment with different art styles to find your unique look"
    ]
  },
  {
    id: 6,
    title: "Publishing & Sharing",
    description: "Show your masterpiece to the world",
    content: "Congratulations! You've created your first comic. Now it's time to share it with the world. You can publish to our marketplace, share on social media, or keep it private for friends and family. Remember, every great comic creator started with their first panel - you're already on your way!",
    duration: 20,
    tips: [
      "Preview your comic before publishing to catch any final tweaks",
      "Write an engaging description to attract readers",
      "Use our social preview generator to create eye-catching shares"
    ]
  }
];

interface CharacterMood {
  message: string;
  emotion: string;
  animation: string;
  bgColor: string;
}

const characterMoods: { [key: string]: CharacterMood[] } = {
  excited: [
    { message: "🎨 Ready to create something amazing?", emotion: "😊", animation: "animate-bounce", bgColor: "from-yellow-400 to-orange-500" },
    { message: "✨ Your creativity is about to shine!", emotion: "🤩", animation: "animate-pulse", bgColor: "from-pink-400 to-purple-500" },
    { message: "🚀 Let's bring your story to life!", emotion: "😄", animation: "animate-bounce", bgColor: "from-blue-400 to-cyan-500" }
  ],
  encouraging: [
    { message: "💫 Every great comic starts with a single panel!", emotion: "😌", animation: "animate-pulse", bgColor: "from-green-400 to-blue-500" },
    { message: "🎯 You're doing fantastic! Keep going!", emotion: "😊", animation: "animate-bounce", bgColor: "from-purple-400 to-pink-500" },
    { message: "🌟 Almost there! The finish line awaits!", emotion: "🎉", animation: "animate-spin", bgColor: "from-yellow-400 to-red-500" }
  ],
  proud: [
    { message: "🏆 Wow! You're a natural at this!", emotion: "😍", animation: "animate-bounce", bgColor: "from-gold-400 to-yellow-500" },
    { message: "🎊 Amazing work! You've mastered this step!", emotion: "🥳", animation: "animate-pulse", bgColor: "from-green-400 to-emerald-500" },
    { message: "⭐ Incredible! You're becoming a comic pro!", emotion: "🤗", animation: "animate-bounce", bgColor: "from-blue-400 to-purple-500" }
  ]
};

export default function Tutorials() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentMood, setCurrentMood] = useState<CharacterMood>(characterMoods.excited[0]);
  const [userInteractions, setUserInteractions] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [showCelebration, setShowCelebration] = useState(false);
  const [, setLocation] = useLocation();

  // Auto-advance progress when playing
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isPlaying && currentStep < tutorialSteps.length) {
      const step = tutorialSteps[currentStep];
      const incrementValue = 100 / step.duration; // Progress per second
      
      interval = setInterval(() => {
        setProgress(prev => {
          const newProgress = prev + incrementValue;
          if (newProgress >= 100) {
            setIsPlaying(false);
            // Mark step as completed and trigger celebration
            if (!completedSteps.includes(currentStep)) {
              setCompletedSteps(prev => [...prev, currentStep]);
              triggerCelebration();
            }
            return 100;
          }
          return newProgress;
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying, currentStep, completedSteps]);

  // Update character mood based on progress and interactions
  useEffect(() => {
    updateCharacterMood();
  }, [currentStep, progress, userInteractions]);

  const updateCharacterMood = () => {
    let moodCategory = 'excited';
    
    if (progress === 100) {
      moodCategory = 'proud';
    } else if (progress > 50 || userInteractions > 2) {
      moodCategory = 'encouraging';
    }
    
    const moods = characterMoods[moodCategory];
    const randomMood = moods[Math.floor(Math.random() * moods.length)];
    setCurrentMood(randomMood);
  };

  const triggerCelebration = () => {
    setShowCelebration(true);
    setTimeout(() => setShowCelebration(false), 3000);
  };

  const handleUserInteraction = () => {
    setUserInteractions(prev => prev + 1);
  };

  const handlePlay = () => {
    setIsPlaying(!isPlaying);
    handleUserInteraction();
  };

  const handleReset = () => {
    setProgress(0);
    setIsPlaying(false);
    handleUserInteraction();
  };

  const handleNext = () => {
    if (currentStep < tutorialSteps.length - 1) {
      setCurrentStep(currentStep + 1);
      setProgress(0);
      setIsPlaying(false);
      handleUserInteraction();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      setProgress(0);
      setIsPlaying(false);
      handleUserInteraction();
    }
  };

  const handleQuizAnswer = (correct: boolean) => {
    handleUserInteraction();
    if (correct) {
      setCurrentMood(characterMoods.proud[Math.floor(Math.random() * characterMoods.proud.length)]);
      triggerCelebration();
    } else {
      setCurrentMood(characterMoods.encouraging[Math.floor(Math.random() * characterMoods.encouraging.length)]);
    }
  };

  const handleStartCreating = () => {
    setLocation("/creator-studio");
  };

  const currentTutorial = tutorialSteps[currentStep];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      <Helmet>
        <title>Interactive Comic Creation Tutorial | ComicAI</title>
        <meta name="description" content="Learn comic creation with our fun, interactive tutorial featuring an animated AI guide. Perfect for beginners and experienced creators alike." />
      </Helmet>

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="font-bangers text-4xl md:text-6xl text-dark mb-4">
            Comic Creation Academy
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Master the art of digital comic creation with our playful, step-by-step tutorial
          </p>
        </div>

        {/* Main Tutorial Area */}
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Interactive Character Guide */}
            <div className="lg:col-span-1">
              <Card className="sticky top-8 border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-secondary/5 relative overflow-hidden">
                {/* Celebration Animation */}
                {showCelebration && (
                  <div className="absolute inset-0 z-10 flex items-center justify-center bg-gradient-to-r from-yellow-400/90 to-pink-500/90 animate-pulse">
                    <div className="text-center">
                      <div className="text-6xl animate-bounce">🎉</div>
                      <p className="text-white font-bold mt-2">Great Job!</p>
                    </div>
                  </div>
                )}
                
                <CardHeader className="text-center pb-4">
                  <div className="w-24 h-24 mx-auto mb-4 relative">
                    {/* Dynamic Character Avatar */}
                    <div className={`w-full h-full bg-gradient-to-br ${currentMood.bgColor} rounded-full flex items-center justify-center text-white text-2xl font-bold ${currentMood.animation} cursor-pointer transition-all duration-500 hover:scale-110`}
                         onClick={handleUserInteraction}>
                      <span className="text-3xl">{currentMood.emotion}</span>
                    </div>
                    {/* Floating animation indicators */}
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 rounded-full animate-bounce">✨</div>
                    {/* Interaction indicator */}
                    <div className="absolute -bottom-1 -left-1 w-8 h-8 bg-green-400 rounded-full flex items-center justify-center text-white text-xs font-bold animate-pulse">
                      {userInteractions}
                    </div>
                  </div>
                  <CardTitle className="text-lg font-comic">Your AI Buddy</CardTitle>
                  <p className="text-xs text-gray-500">Click me for encouragement!</p>
                </CardHeader>
                
                <CardContent className="text-center">
                  {/* Interactive Speech Bubble */}
                  <div className="bg-white rounded-lg p-4 mb-4 border border-gray-200 relative shadow-lg hover:shadow-xl transition-shadow cursor-pointer"
                       onClick={handleUserInteraction}>
                    <p className="text-sm text-gray-700 font-medium">{currentMood.message}</p>
                    {/* Speech bubble tail */}
                    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full">
                      <div className="w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-white"></div>
                    </div>
                  </div>
                  
                  {/* Interactive Progress Overview */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs text-gray-600">
                      <span>Tutorial Progress</span>
                      <span>{currentStep + 1} of {tutorialSteps.length}</span>
                    </div>
                    <Progress value={(currentStep / tutorialSteps.length) * 100} className="h-3" />
                    
                    {/* Achievement Badges */}
                    <div className="flex justify-center space-x-1 mt-3">
                      {tutorialSteps.map((_, index) => (
                        <div key={index} 
                             className={`w-3 h-3 rounded-full ${
                               completedSteps.includes(index) 
                                 ? 'bg-green-500 animate-pulse' 
                                 : index === currentStep 
                                   ? 'bg-yellow-400 animate-bounce' 
                                   : 'bg-gray-300'
                             }`} 
                        />
                      ))}
                    </div>
                    
                    {/* Mood Indicator */}
                    <div className="mt-3 text-xs text-gray-500">
                      Mood: <span className="capitalize">{Object.keys(characterMoods).find(key => 
                        characterMoods[key].includes(currentMood)
                      )}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-2">
              <Card className="border-2 border-gray-200">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className="mb-2">
                      Step {currentTutorial.id}
                    </Badge>
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm" onClick={handleReset}>
                        <RotateCcw className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={handlePlay}>
                        {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>
                  <CardTitle className="text-2xl font-bangers text-dark">
                    {currentTutorial.title}
                  </CardTitle>
                  <CardDescription className="text-lg">
                    {currentTutorial.description}
                  </CardDescription>
                </CardHeader>
                
                <CardContent>
                  {/* Step Progress */}
                  <div className="mb-6">
                    <Progress value={progress} className="h-3" />
                    <p className="text-xs text-gray-500 mt-2">
                      {isPlaying ? "Playing..." : progress === 100 ? "Completed!" : "Ready to start"}
                    </p>
                  </div>

                  {/* Content */}
                  <div className="prose prose-lg max-w-none mb-6">
                    <p className="text-gray-700 leading-relaxed">
                      {currentTutorial.content}
                    </p>
                  </div>

                  {/* Interactive Tips & Mini Quiz */}
                  <div className="bg-blue-50 rounded-lg p-4 mb-6">
                    <div className="flex items-center mb-3">
                      <Lightbulb className="h-5 w-5 text-blue-600 mr-2" />
                      <h4 className="font-semibold text-blue-900">Pro Tips</h4>
                    </div>
                    <ul className="space-y-2 mb-4">
                      {currentTutorial.tips.map((tip, index) => (
                        <li key={index} className="text-sm text-blue-800 flex items-start">
                          <span className="text-blue-600 mr-2">•</span>
                          {tip}
                        </li>
                      ))}
                    </ul>
                    
                    {/* Interactive Quiz for step 3+ */}
                    {currentStep >= 2 && (
                      <div className="border-t border-blue-200 pt-4">
                        <h5 className="text-sm font-semibold text-blue-900 mb-2">Quick Check:</h5>
                        {currentStep === 2 && (
                          <div className="space-y-2">
                            <p className="text-sm text-blue-800">What makes a good character description?</p>
                            <div className="grid grid-cols-1 gap-2">
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="text-left justify-start text-xs hover:bg-green-100"
                                onClick={() => handleQuizAnswer(true)}
                              >
                                ✓ Detailed personality and motivations
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="text-left justify-start text-xs hover:bg-red-100"
                                onClick={() => handleQuizAnswer(false)}
                              >
                                ✗ Just physical appearance
                              </Button>
                            </div>
                          </div>
                        )}
                        {currentStep === 3 && (
                          <div className="space-y-2">
                            <p className="text-sm text-blue-800">What's the key to good storytelling?</p>
                            <div className="grid grid-cols-1 gap-2">
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="text-left justify-start text-xs hover:bg-green-100"
                                onClick={() => handleQuizAnswer(true)}
                              >
                                ✓ Clear conflict and resolution
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="text-left justify-start text-xs hover:bg-red-100"
                                onClick={() => handleQuizAnswer(false)}
                              >
                                ✗ Lots of action scenes
                              </Button>
                            </div>
                          </div>
                        )}
                        {currentStep === 4 && (
                          <div className="space-y-2">
                            <p className="text-sm text-blue-800">How do you create dynamic comics?</p>
                            <div className="grid grid-cols-1 gap-2">
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="text-left justify-start text-xs hover:bg-green-100"
                                onClick={() => handleQuizAnswer(true)}
                              >
                                ✓ Vary panel sizes and angles
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="text-left justify-start text-xs hover:bg-red-100"
                                onClick={() => handleQuizAnswer(false)}
                              >
                                ✗ Use only square panels
                              </Button>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Navigation */}
                  <div className="flex justify-between items-center">
                    <Button 
                      variant="outline" 
                      onClick={handlePrevious}
                      disabled={currentStep === 0}
                    >
                      <ChevronLeft className="h-4 w-4 mr-2" />
                      Previous
                    </Button>

                    {currentStep === tutorialSteps.length - 1 ? (
                      <Button 
                        onClick={handleStartCreating}
                        className="bg-primary hover:bg-primary/90"
                      >
                        Start Creating
                        <Zap className="h-4 w-4 ml-2" />
                      </Button>
                    ) : (
                      <Button 
                        onClick={handleNext}
                        disabled={progress < 100}
                        className="bg-primary hover:bg-primary/90"
                      >
                        Next Step
                        <ChevronRight className="h-4 w-4 ml-2" />
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Interactive Learning Stats */}
        <div className="max-w-4xl mx-auto mt-12 mb-8">
          <Card className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border-2 border-purple-200">
            <CardHeader className="text-center">
              <CardTitle className="font-bangers text-2xl text-dark">Your Learning Journey</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <div className="text-2xl font-bold text-primary">{completedSteps.length}</div>
                  <div className="text-xs text-gray-600">Steps Completed</div>
                </div>
                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <div className="text-2xl font-bold text-secondary">{userInteractions}</div>
                  <div className="text-xs text-gray-600">Interactions</div>
                </div>
                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <div className="text-2xl font-bold text-accent">{Math.round((completedSteps.length / tutorialSteps.length) * 100)}%</div>
                  <div className="text-xs text-gray-600">Progress</div>
                </div>
                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <div className="text-2xl font-bold text-green-600">
                    {completedSteps.length === tutorialSteps.length ? "🏆" : "🎯"}
                  </div>
                  <div className="text-xs text-gray-600">
                    {completedSteps.length === tutorialSteps.length ? "Master!" : "Learning"}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Additional Resources */}
        <div className="max-w-6xl mx-auto mt-16">
          <h2 className="font-bangers text-3xl text-center text-dark mb-8">
            Continue Your Learning Journey
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="text-center hover:shadow-lg transition-all hover:scale-105 cursor-pointer group">
              <CardHeader>
                <BookOpen className="h-12 w-12 text-primary mx-auto mb-4 group-hover:animate-bounce" />
                <CardTitle>Video Tutorials</CardTitle>
                <CardDescription>
                  Watch detailed video guides covering advanced techniques
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full group-hover:bg-primary group-hover:text-white transition-colors"
                        onClick={() => setLocation("/learn")}>
                  Browse Videos
                </Button>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-all hover:scale-105 cursor-pointer group">
              <CardHeader>
                <Users className="h-12 w-12 text-secondary mx-auto mb-4 group-hover:animate-pulse" />
                <CardTitle>Community</CardTitle>
                <CardDescription>
                  Connect with other creators and share your work
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full group-hover:bg-secondary group-hover:text-white transition-colors"
                        onClick={() => setLocation("/community")}>
                  Join Community
                </Button>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-all hover:scale-105 cursor-pointer group">
              <CardHeader>
                <Download className="h-12 w-12 text-accent mx-auto mb-4 group-hover:animate-spin" />
                <CardTitle>Resources</CardTitle>
                <CardDescription>
                  Download templates, guides, and inspiration materials
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full group-hover:bg-accent group-hover:text-white transition-colors"
                        onClick={() => setLocation("/documentation")}>
                  Get Resources
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}