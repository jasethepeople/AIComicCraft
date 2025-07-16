import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { motion } from "framer-motion";
import { CheckCircle, X, HelpCircle, Trophy } from "lucide-react";

interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

interface TutorialQuizProps {
  styleId: string;
  styleName: string;
  onComplete: (score: number) => void;
}

const quizData: Record<string, QuizQuestion[]> = {
  superhero: [
    {
      id: "sh1",
      question: "What are the primary colors most commonly used in superhero comics?",
      options: ["Red, Blue, Yellow", "Green, Purple, Orange", "Black, White, Gray", "Pink, Turquoise, Brown"],
      correctAnswer: 0,
      explanation: "Red, blue, and yellow are the classic primary colors that create bold, heroic imagery in superhero comics."
    },
    {
      id: "sh2",
      question: "Which technique is essential for creating dynamic superhero poses?",
      options: ["Static positioning", "Exaggerated anatomy", "Minimal backgrounds", "Soft lighting"],
      correctAnswer: 1,
      explanation: "Exaggerated anatomy helps convey power and heroism, making characters appear larger than life."
    },
    {
      id: "sh3",
      question: "What type of panel layouts work best for superhero action sequences?",
      options: ["Square panels only", "Dramatic angles and varied sizes", "Text-heavy layouts", "Circular panels"],
      correctAnswer: 1,
      explanation: "Dramatic angles and varied panel sizes create visual excitement and enhance the action flow."
    }
  ],
  manga: [
    {
      id: "mg1",
      question: "What is the most distinctive feature of manga character design?",
      options: ["Small eyes", "Large, expressive eyes", "No facial features", "Square heads"],
      correctAnswer: 1,
      explanation: "Large, expressive eyes are a hallmark of manga style, conveying emotion and personality."
    },
    {
      id: "mg2",
      question: "What are screen tones used for in manga?",
      options: ["Adding color", "Shading and texture", "Writing text", "Drawing panels"],
      correctAnswer: 1,
      explanation: "Screen tones create depth, atmosphere, and texture in black and white manga artwork."
    },
    {
      id: "mg3",
      question: "How do manga panels typically differ from Western comics?",
      options: ["Always the same size", "More varied and creative layouts", "Only circular shapes", "No panel borders"],
      correctAnswer: 1,
      explanation: "Manga often features more experimental and varied panel layouts to enhance storytelling flow."
    }
  ],
  noir: [
    {
      id: "nr1",
      question: "What lighting technique is essential in noir comics?",
      options: ["Bright, even lighting", "High contrast shadows", "Colorful lighting", "No shadows"],
      correctAnswer: 1,
      explanation: "High contrast lighting with dramatic shadows creates the moody, atmospheric feel of noir."
    },
    {
      id: "nr2",
      question: "What color palette is most characteristic of noir style?",
      options: ["Bright colors", "Pastels", "High contrast black and white", "Rainbow colors"],
      correctAnswer: 2,
      explanation: "High contrast black and white, often with limited color accents, defines the noir aesthetic."
    },
    {
      id: "nr3",
      question: "What type of environments are typical in noir comics?",
      options: ["Sunny beaches", "Urban, gritty settings", "Fantasy kingdoms", "Space stations"],
      correctAnswer: 1,
      explanation: "Urban, gritty environments with dark alleys and city streets are classic noir settings."
    }
  ]
};

export default function TutorialQuiz({ styleId, styleName, onComplete }: TutorialQuizProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  const questions = quizData[styleId] || [];
  const currentQ = questions[currentQuestion];

  if (!currentQ) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <HelpCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">Quiz not available for this style yet.</p>
        </CardContent>
      </Card>
    );
  }

  const handleAnswerSelect = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
  };

  const handleSubmitAnswer = () => {
    if (selectedAnswer === null) return;
    
    setShowExplanation(true);
    if (selectedAnswer === currentQ.correctAnswer) {
      setScore(score + 1);
    }
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    } else {
      setIsComplete(true);
      onComplete(score + (selectedAnswer === currentQ.correctAnswer ? 1 : 0));
    }
  };

  if (isComplete) {
    const finalScore = score + (selectedAnswer === currentQ.correctAnswer ? 1 : 0);
    const percentage = Math.round((finalScore / questions.length) * 100);
    
    return (
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center gap-2">
            <Trophy className="h-6 w-6 text-yellow-500" />
            Quiz Complete!
          </CardTitle>
          <CardDescription>
            Your mastery of {styleName} style
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center">
            <div className="text-4xl font-bold mb-2">{percentage}%</div>
            <p className="text-muted-foreground">
              {finalScore} out of {questions.length} correct
            </p>
          </div>
          
          <Progress value={percentage} className="w-full" />
          
          <div className="text-center">
            <Badge variant={percentage >= 80 ? "default" : percentage >= 60 ? "secondary" : "destructive"}>
              {percentage >= 80 ? "Excellent!" : percentage >= 60 ? "Good job!" : "Keep learning!"}
            </Badge>
          </div>
          
          {percentage < 80 && (
            <p className="text-sm text-muted-foreground text-center">
              Review the tutorial again to improve your understanding!
            </p>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center gap-2">
            <HelpCircle className="h-5 w-5" />
            {styleName} Style Quiz
          </CardTitle>
          <Badge variant="outline">
            {currentQuestion + 1} / {questions.length}
          </Badge>
        </div>
        <Progress value={((currentQuestion + 1) / questions.length) * 100} className="w-full" />
      </CardHeader>
      
      <CardContent className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold mb-4">{currentQ.question}</h3>
          
          <div className="space-y-3">
            {currentQ.options.map((option, index) => (
              <motion.button
                key={index}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleAnswerSelect(index)}
                disabled={showExplanation}
                className={`w-full p-4 text-left border rounded-lg transition-colors ${
                  selectedAnswer === index
                    ? showExplanation
                      ? index === currentQ.correctAnswer
                        ? "border-green-500 bg-green-50 dark:bg-green-950/20"
                        : "border-red-500 bg-red-50 dark:bg-red-950/20"
                      : "border-blue-500 bg-blue-50 dark:bg-blue-950/20"
                    : showExplanation && index === currentQ.correctAnswer
                    ? "border-green-500 bg-green-50 dark:bg-green-950/20"
                    : "border-gray-200 hover:border-gray-300 dark:border-gray-700 dark:hover:border-gray-600"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span>{option}</span>
                  {showExplanation && index === currentQ.correctAnswer && (
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  )}
                  {showExplanation && selectedAnswer === index && index !== currentQ.correctAnswer && (
                    <X className="h-5 w-5 text-red-600" />
                  )}
                </div>
              </motion.button>
            ))}
          </div>
        </div>
        
        {showExplanation && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800"
          >
            <h4 className="font-semibold text-blue-800 dark:text-blue-400 mb-2">Explanation:</h4>
            <p className="text-blue-700 dark:text-blue-300">{currentQ.explanation}</p>
          </motion.div>
        )}
        
        <div className="flex justify-between">
          <div className="text-sm text-muted-foreground">
            Score: {score} / {currentQuestion + (showExplanation ? 1 : 0)}
          </div>
          
          {!showExplanation ? (
            <Button 
              onClick={handleSubmitAnswer}
              disabled={selectedAnswer === null}
            >
              Submit Answer
            </Button>
          ) : (
            <Button onClick={handleNext}>
              {currentQuestion < questions.length - 1 ? "Next Question" : "Finish Quiz"}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}