import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { motion } from "framer-motion";
import { PlayCircle, BookOpen, Award, CheckCircle, ArrowRight, Palette, Eye, Lightbulb, Trophy } from "lucide-react";
import TutorialProgressTracker, { useTutorialProgress } from "@/components/tutorial-progress-tracker";

interface Tutorial {
  id: string;
  title: string;
  description: string;
  duration: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  styleId: number;
  styleName: string;
  keyCharacteristics: string[];
  historicalContext: string;
  famousExamples: string[];
  technicalTips: string[];
  colorPalettes: string[];
  completed?: boolean;
}

const tutorials: Tutorial[] = [
  {
    id: "superhero",
    title: "Superhero Comic Style",
    description: "Learn the bold, dynamic style of classic superhero comics",
    duration: "8 min",
    difficulty: "Beginner",
    styleId: 1,
    styleName: "Superhero",
    keyCharacteristics: [
      "Bold, dynamic poses and action sequences",
      "Strong contrast between light and shadow",
      "Exaggerated muscular anatomy",
      "Vibrant primary colors (red, blue, yellow)",
      "Clear panel layouts with dramatic angles"
    ],
    historicalContext: "Superhero comics emerged in the late 1930s with Superman, defining a visual language of heroism and power. The style emphasizes idealized human forms and dramatic storytelling.",
    famousExamples: [
      "Superman by Joe Shuster",
      "Batman by Bob Kane",
      "Spider-Man by Steve Ditko",
      "X-Men by Jack Kirby"
    ],
    technicalTips: [
      "Use strong, confident line work",
      "Emphasize action lines and motion blur",
      "Create depth with overlapping elements",
      "Balance detailed backgrounds with clear focal points"
    ],
    colorPalettes: ["Primary Colors", "High Contrast", "Bold Shadows"]
  },
  {
    id: "manga",
    title: "Manga Art Style",
    description: "Master the expressive Japanese manga aesthetic",
    duration: "12 min",
    difficulty: "Intermediate",
    styleId: 2,
    styleName: "Manga",
    keyCharacteristics: [
      "Large, expressive eyes with detailed reflections",
      "Simplified facial features with emotional emphasis",
      "Speed lines and action effects",
      "Varied panel sizes and creative layouts",
      "Screen tones for shading and texture"
    ],
    historicalContext: "Manga developed from traditional Japanese art, evolving through the 20th century into a distinct visual style emphasizing emotion and dynamic storytelling.",
    famousExamples: [
      "Dragon Ball by Akira Toriyama",
      "Naruto by Masashi Kishimoto",
      "One Piece by Eiichiro Oda",
      "Attack on Titan by Hajime Isayama"
    ],
    technicalTips: [
      "Focus on character expressions and emotions",
      "Use screen tones for depth and atmosphere",
      "Vary line weights for different elements",
      "Create dynamic panel transitions"
    ],
    colorPalettes: ["Monochrome", "Soft Pastels", "High Contrast B&W"]
  },
  {
    id: "indie",
    title: "Indie Comic Style",
    description: "Explore the creative freedom of independent comic art",
    duration: "10 min",
    difficulty: "Intermediate",
    styleId: 3,
    styleName: "Indie",
    keyCharacteristics: [
      "Experimental and unconventional layouts",
      "Personal artistic voice and unique style",
      "Often limited color palettes",
      "Focus on character development and mood",
      "Breaking traditional comic conventions"
    ],
    historicalContext: "Independent comics emerged as artists sought creative freedom outside mainstream publishers, leading to diverse, experimental visual styles.",
    famousExamples: [
      "Scott Pilgrim by Bryan Lee O'Malley",
      "Saga by Fiona Staples",
      "The Walking Dead by Charlie Adlard",
      "Bone by Jeff Smith"
    ],
    technicalTips: [
      "Develop a personal artistic voice",
      "Experiment with unconventional layouts",
      "Use color to enhance mood and atmosphere",
      "Focus on character-driven storytelling"
    ],
    colorPalettes: ["Limited Palette", "Earthy Tones", "Experimental"]
  },
  {
    id: "european",
    title: "European Comic Style",
    description: "Discover the sophisticated European bande dessinée tradition",
    duration: "15 min",
    difficulty: "Advanced",
    styleId: 4,
    styleName: "European",
    keyCharacteristics: [
      "Detailed, realistic artwork",
      "Complex backgrounds and environments",
      "Sophisticated color work",
      "Larger panel formats",
      "Emphasis on visual storytelling"
    ],
    historicalContext: "European comics, particularly French and Belgian traditions, emphasize artistic sophistication and are often considered graphic literature.",
    famousExamples: [
      "Asterix by Albert Uderzo",
      "Tintin by Hergé",
      "Moebius works",
      "Blacksad by Juanjo Guarnido"
    ],
    technicalTips: [
      "Focus on realistic proportions and anatomy",
      "Develop detailed, atmospheric backgrounds",
      "Use sophisticated color theory",
      "Balance realism with stylization"
    ],
    colorPalettes: ["Realistic Tones", "Atmospheric", "Rich Textures"]
  }
];

export default function Tutorials() {
  const [selectedTutorial, setSelectedTutorial] = useState<Tutorial | null>(null);
  const [completedTutorials, setCompletedTutorials] = useState<Set<string>>(new Set());
  const [currentStep, setCurrentStep] = useState(0);
  const { markTutorialComplete } = useTutorialProgress();

  // Load completed tutorials from localStorage
  useEffect(() => {
    const savedProgress = localStorage.getItem('comicai-tutorial-progress');
    if (savedProgress) {
      try {
        const progress = JSON.parse(savedProgress);
        setCompletedTutorials(new Set(progress.completed));
      } catch (error) {
        console.error('Error loading tutorial progress:', error);
      }
    }
  }, []);

  // Listen for progress updates
  useEffect(() => {
    const handleProgressUpdate = (event: CustomEvent) => {
      setCompletedTutorials(new Set(event.detail.completed));
    };

    window.addEventListener('tutorialProgressUpdate', handleProgressUpdate as EventListener);
    return () => window.removeEventListener('tutorialProgressUpdate', handleProgressUpdate as EventListener);
  }, []);

  const markComplete = (tutorialId: string) => {
    markTutorialComplete(tutorialId);
    setCompletedTutorials(prev => new Set(prev).add(tutorialId));
  };

  const TutorialDialog = ({ tutorial }: { tutorial: Tutorial }) => {
    const steps = [
      {
        title: "Introduction",
        content: (
          <div className="space-y-4">
            <p className="text-muted-foreground">{tutorial.historicalContext}</p>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold mb-2">Duration</h4>
                <p className="text-sm text-muted-foreground">{tutorial.duration}</p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Difficulty</h4>
                <Badge variant={tutorial.difficulty === "Beginner" ? "default" : tutorial.difficulty === "Intermediate" ? "secondary" : "destructive"}>
                  {tutorial.difficulty}
                </Badge>
              </div>
            </div>
          </div>
        )
      },
      {
        title: "Key Characteristics",
        content: (
          <div className="space-y-3">
            <p className="text-muted-foreground mb-4">Learn the defining features of {tutorial.styleName} style:</p>
            <ul className="space-y-2">
              {tutorial.keyCharacteristics.map((char, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-start gap-2"
                >
                  <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-sm">{char}</span>
                </motion.li>
              ))}
            </ul>
          </div>
        )
      },
      {
        title: "Famous Examples",
        content: (
          <div className="space-y-3">
            <p className="text-muted-foreground mb-4">Study these iconic works in {tutorial.styleName} style:</p>
            <div className="grid grid-cols-1 gap-3">
              {tutorial.famousExamples.map((example, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-3 bg-muted rounded-lg"
                >
                  <div className="flex items-center gap-2">
                    <Eye className="h-4 w-4 text-blue-500" />
                    <span className="font-medium">{example}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )
      },
      {
        title: "Technical Tips",
        content: (
          <div className="space-y-3">
            <p className="text-muted-foreground mb-4">Apply these techniques to master {tutorial.styleName} style:</p>
            <ul className="space-y-3">
              {tutorial.technicalTips.map((tip, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-start gap-2"
                >
                  <Lightbulb className="h-4 w-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                  <span className="text-sm">{tip}</span>
                </motion.li>
              ))}
            </ul>
          </div>
        )
      },
      {
        title: "Color Palettes",
        content: (
          <div className="space-y-3">
            <p className="text-muted-foreground mb-4">Color schemes commonly used in {tutorial.styleName} style:</p>
            <div className="grid grid-cols-1 gap-3">
              {tutorial.colorPalettes.map((palette, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-3 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 rounded-lg border"
                >
                  <div className="flex items-center gap-2">
                    <Palette className="h-4 w-4 text-purple-500" />
                    <span className="font-medium">{palette}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )
      }
    ];

    return (
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            {tutorial.title}
          </DialogTitle>
          <DialogDescription>
            {tutorial.description}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              Step {currentStep + 1} of {steps.length}
            </div>
            <Progress value={(currentStep + 1) / steps.length * 100} className="w-32" />
          </div>
          
          <div className="min-h-[300px]">
            <h3 className="text-lg font-semibold mb-4">{steps[currentStep].title}</h3>
            {steps[currentStep].content}
          </div>
          
          <div className="flex justify-between">
            <Button
              variant="outline"
              onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
              disabled={currentStep === 0}
            >
              Previous
            </Button>
            
            {currentStep < steps.length - 1 ? (
              <Button
                onClick={() => setCurrentStep(currentStep + 1)}
                className="flex items-center gap-2"
              >
                Next
                <ArrowRight className="h-4 w-4" />
              </Button>
            ) : (
              <Button
                onClick={() => {
                  markComplete(tutorial.id);
                  setCurrentStep(0);
                }}
                className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
              >
                <Award className="h-4 w-4" />
                Complete Tutorial
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    );
  };

  const difficultyColors = {
    Beginner: "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400",
    Intermediate: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400",
    Advanced: "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400"
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Comic Art Style Tutorials</h1>
        <p className="text-muted-foreground">
          Master different comic art styles through interactive micro-tutorials
        </p>
      </div>

      {/* Progress Tracker */}
      <div className="mb-8">
        <TutorialProgressTracker />
      </div>

      <Tabs defaultValue="all" className="space-y-6">
        <TabsList>
          <TabsTrigger value="all">All Tutorials</TabsTrigger>
          <TabsTrigger value="beginner">Beginner</TabsTrigger>
          <TabsTrigger value="intermediate">Intermediate</TabsTrigger>
          <TabsTrigger value="advanced">Advanced</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tutorials.map((tutorial) => (
              <motion.div
                key={tutorial.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-lg">{tutorial.title}</CardTitle>
                      {completedTutorials.has(tutorial.id) && (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      )}
                    </div>
                    <CardDescription>{tutorial.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="flex items-center gap-1">
                        <PlayCircle className="h-4 w-4" />
                        {tutorial.duration}
                      </span>
                      <Badge className={difficultyColors[tutorial.difficulty]}>
                        {tutorial.difficulty}
                      </Badge>
                    </div>
                    
                    <div className="space-y-2">
                      <p className="text-sm font-medium">Key Features:</p>
                      <ul className="text-xs text-muted-foreground space-y-1">
                        {tutorial.keyCharacteristics.slice(0, 2).map((char, index) => (
                          <li key={index} className="flex items-start gap-1">
                            <span className="w-1 h-1 bg-current rounded-full mt-1.5 flex-shrink-0" />
                            {char}
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button 
                          className="w-full"
                          onClick={() => {
                            setSelectedTutorial(tutorial);
                            setCurrentStep(0);
                          }}
                        >
                          {completedTutorials.has(tutorial.id) ? "Review Tutorial" : "Start Tutorial"}
                        </Button>
                      </DialogTrigger>
                      {selectedTutorial?.id === tutorial.id && (
                        <TutorialDialog tutorial={tutorial} />
                      )}
                    </Dialog>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        {["beginner", "intermediate", "advanced"].map((difficulty) => (
          <TabsContent key={difficulty} value={difficulty} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tutorials
                .filter((tutorial) => tutorial.difficulty.toLowerCase() === difficulty)
                .map((tutorial) => (
                  <motion.div
                    key={tutorial.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <CardTitle className="text-lg">{tutorial.title}</CardTitle>
                          {completedTutorials.has(tutorial.id) && (
                            <CheckCircle className="h-5 w-5 text-green-500" />
                          )}
                        </div>
                        <CardDescription>{tutorial.description}</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex items-center justify-between text-sm">
                          <span className="flex items-center gap-1">
                            <PlayCircle className="h-4 w-4" />
                            {tutorial.duration}
                          </span>
                          <Badge className={difficultyColors[tutorial.difficulty]}>
                            {tutorial.difficulty}
                          </Badge>
                        </div>
                        
                        <div className="space-y-2">
                          <p className="text-sm font-medium">Key Features:</p>
                          <ul className="text-xs text-muted-foreground space-y-1">
                            {tutorial.keyCharacteristics.slice(0, 2).map((char, index) => (
                              <li key={index} className="flex items-start gap-1">
                                <span className="w-1 h-1 bg-current rounded-full mt-1.5 flex-shrink-0" />
                                {char}
                              </li>
                            ))}
                          </ul>
                        </div>
                        
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button 
                              className="w-full"
                              onClick={() => {
                                setSelectedTutorial(tutorial);
                                setCurrentStep(0);
                              }}
                            >
                              {completedTutorials.has(tutorial.id) ? "Review Tutorial" : "Start Tutorial"}
                            </Button>
                          </DialogTrigger>
                          {selectedTutorial?.id === tutorial.id && (
                            <TutorialDialog tutorial={tutorial} />
                          )}
                        </Dialog>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>

      {/* Quick Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4"
      >
        <Card>
          <CardContent className="p-4 text-center">
            <Trophy className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
            <p className="text-2xl font-bold">{completedTutorials.size}</p>
            <p className="text-sm text-muted-foreground">Tutorials Completed</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <BookOpen className="h-8 w-8 text-blue-500 mx-auto mb-2" />
            <p className="text-2xl font-bold">{tutorials.length - completedTutorials.size}</p>
            <p className="text-sm text-muted-foreground">Remaining</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Award className="h-8 w-8 text-purple-500 mx-auto mb-2" />
            <p className="text-2xl font-bold">{Math.round((completedTutorials.size / tutorials.length) * 100)}%</p>
            <p className="text-sm text-muted-foreground">Mastery Level</p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}