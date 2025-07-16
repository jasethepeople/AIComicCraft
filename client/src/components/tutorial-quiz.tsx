import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, XCircle, Brain } from "lucide-react";
import { motion } from "framer-motion";

interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
}

interface TutorialQuizProps {
  styleId: string;
  styleName: string;
  onComplete: (score: number) => void;
}

// Quiz questions for different art styles
const quizQuestions: Record<string, QuizQuestion[]> = {
  superhero: [
    {
      id: "1",
      question: "What is a key characteristic of superhero comic art?",
      options: [
        "Muted, realistic colors",
        "Bold, dynamic poses and vibrant colors",
        "Minimal detail and simple lines",
        "Abstract, non-representational forms"
      ],
      correctAnswer: 1,
      explanation: "Superhero comics feature bold, dynamic poses and vibrant colors to convey power and action."
    },
    {
      id: "2", 
      question: "Which perspective technique is commonly used in superhero comics?",
      options: [
        "Flat, front-facing views only",
        "Dramatic angles and foreshortening",
        "Bird's eye view exclusively", 
        "Close-ups only"
      ],
      correctAnswer: 1,
      explanation: "Dramatic angles and foreshortening create dynamic, powerful compositions typical of superhero comics."
    },
    {
      id: "3",
      question: "What type of anatomy is typical in superhero art?",
      options: [
        "Realistic proportions",
        "Stylized, heroic proportions",
        "Simplified stick figures",
        "Abstract geometric shapes"
      ],
      correctAnswer: 1,
      explanation: "Superhero art uses stylized, heroic proportions to emphasize strength and idealized physiques."
    }
  ],
  manga: [
    {
      id: "1",
      question: "What is characteristic of manga character eyes?",
      options: [
        "Small and realistic",
        "Large and expressive",
        "Always closed",
        "Geometric shapes"
      ],
      correctAnswer: 1,
      explanation: "Manga characters typically have large, expressive eyes that convey emotion effectively."
    },
    {
      id: "2",
      question: "Which technique is common in manga backgrounds?",
      options: [
        "Photorealistic detail",
        "Speed lines and tone effects",
        "Solid colors only",
        "No backgrounds"
      ],
      correctAnswer: 1,
      explanation: "Manga uses speed lines, screen tones, and other effects to create mood and movement."
    },
    {
      id: "3",
      question: "What emotion technique is signature to manga?",
      options: [
        "Realistic facial expressions only",
        "Exaggerated expressions and emotion symbols",
        "No emotional expressions",
        "Only subtle hints"
      ],
      correctAnswer: 1,
      explanation: "Manga uses highly exaggerated expressions and visual symbols (sweat drops, etc.) to show emotions."
    }
  ],
  // Default questions for other styles
  default: [
    {
      id: "1",
      question: "What makes this art style unique?",
      options: [
        "Its color palette",
        "Its line work",
        "Its composition techniques",
        "All of the above"
      ],
      correctAnswer: 3,
      explanation: "Each art style combines multiple elements like color, lines, and composition to create its unique look."
    },
    {
      id: "2",
      question: "When applying this style, what should you focus on?",
      options: [
        "Only the technical aspects",
        "Understanding the emotional impact",
        "Copying exactly without variation",
        "Ignoring the historical context"
      ],
      correctAnswer: 1,
      explanation: "Understanding the emotional impact helps you apply the style effectively in your own work."
    },
    {
      id: "3",
      question: "How can you improve in this art style?",
      options: [
        "Practice and study examples",
        "Ignore fundamentals",
        "Only use digital tools",
        "Avoid experimentation"
      ],
      correctAnswer: 0,
      explanation: "Regular practice and studying examples from the style helps build mastery over time."
    }
  ]
};

export default function TutorialQuiz({ styleId, styleName, onComplete }: TutorialQuizProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);

  // Get questions for this style, fallback to default
  const questions = quizQuestions[styleId.toLowerCase()] || quizQuestions.default;
  
  const handleAnswerSelect = (questionId: string, answerIndex: string) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [questionId]: answerIndex
    }));
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // Calculate score and show results
      let correctAnswers = 0;
      questions.forEach(question => {
        const selectedAnswer = selectedAnswers[question.id];
        if (selectedAnswer && parseInt(selectedAnswer) === question.correctAnswer) {
          correctAnswers++;
        }
      });
      setScore(correctAnswers);
      setShowResults(true);
    }
  };

  const handleFinish = () => {
    onComplete(score);
  };

  const currentQ = questions[currentQuestion];
  const isAnswered = selectedAnswers[currentQ.id] !== undefined;
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  if (showResults) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            Quiz Complete!
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center">
            <div className="text-4xl font-bold mb-2">
              {score}/{questions.length}
            </div>
            <p className="text-muted-foreground">
              {score === questions.length ? "Perfect score!" : 
               score >= questions.length * 0.7 ? "Great job!" :
               "Keep practicing to improve!"}
            </p>
          </div>

          {/* Results breakdown */}
          <div className="space-y-4">
            {questions.map((question, index) => {
              const selectedAnswer = selectedAnswers[question.id];
              const isCorrect = selectedAnswer && parseInt(selectedAnswer) === question.correctAnswer;
              
              return (
                <motion.div
                  key={question.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`p-4 rounded-lg border ${
                    isCorrect ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {isCorrect ? (
                      <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-600 mt-0.5" />
                    )}
                    <div>
                      <p className="font-medium mb-1">{question.question}</p>
                      <p className="text-sm text-muted-foreground">
                        Your answer: {question.options[parseInt(selectedAnswer || "0")]}
                      </p>
                      {!isCorrect && (
                        <p className="text-sm text-green-700 mt-1">
                          Correct: {question.options[question.correctAnswer]}
                        </p>
                      )}
                      {question.explanation && (
                        <p className="text-sm text-blue-700 mt-2">
                          💡 {question.explanation}
                        </p>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          <Button onClick={handleFinish} className="w-full">
            {score >= questions.length * 0.7 ? "Claim Certificate" : "Complete Quiz"}
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            {styleName} Quiz
          </span>
          <span className="text-sm font-normal">
            {currentQuestion + 1} of {questions.length}
          </span>
        </CardTitle>
        <Progress value={progress} className="w-full" />
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h3 className="text-lg font-medium mb-4">{currentQ.question}</h3>
          
          <RadioGroup
            value={selectedAnswers[currentQ.id] || ""}
            onValueChange={(value) => handleAnswerSelect(currentQ.id, value)}
          >
            {currentQ.options.map((option, index) => (
              <div key={index} className="flex items-center space-x-2 p-3 rounded-lg border hover:bg-gray-50">
                <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer">
                  {option}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>

        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={() => setCurrentQuestion(currentQuestion - 1)}
            disabled={currentQuestion === 0}
          >
            Previous
          </Button>
          <Button
            onClick={handleNext}
            disabled={!isAnswered}
          >
            {currentQuestion === questions.length - 1 ? "Finish Quiz" : "Next"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}