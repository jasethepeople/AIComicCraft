import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Download, Share2, Award, Star } from "lucide-react";
import { motion } from "framer-motion";

interface TutorialCertificateProps {
  styleName: string;
  userName: string;
  completionDate: string;
  quizScore: number;
  onDownload: () => void;
  onShare: () => void;
}

export default function TutorialCertificate({
  styleName,
  userName,
  completionDate,
  quizScore,
  onDownload,
  onShare
}: TutorialCertificateProps) {
  const getScoreBadge = (score: number) => {
    if (score === 3) return { label: "Perfect", variant: "default" as const, color: "text-yellow-600" };
    if (score >= 2) return { label: "Excellent", variant: "secondary" as const, color: "text-green-600" };
    return { label: "Good", variant: "outline" as const, color: "text-blue-600" };
  };

  const scoreBadge = getScoreBadge(quizScore);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="max-w-2xl mx-auto"
    >
      <Card className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950 border-2 border-blue-200 dark:border-blue-800">
        <CardContent className="p-8">
          {/* Header with decorative elements */}
          <div className="text-center mb-8">
            <div className="flex justify-center items-center gap-4 mb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                <Award className="h-8 w-8 text-white" />
              </div>
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-6 w-6 ${
                      i < quizScore ? 'text-yellow-400 fill-current' : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
                <Award className="h-8 w-8 text-white" />
              </div>
            </div>
            
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
              Certificate of Completion
            </h1>
            <p className="text-muted-foreground">ComicAI Art Style Mastery Program</p>
          </div>

          {/* Certificate content */}
          <div className="text-center space-y-6">
            <div>
              <p className="text-lg text-muted-foreground mb-2">This certifies that</p>
              <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">
                {userName}
              </h2>
            </div>

            <div>
              <p className="text-lg text-muted-foreground mb-2">has successfully completed the</p>
              <h3 className="text-xl font-semibold text-blue-600 dark:text-blue-400">
                {styleName} Comic Art Style Tutorial
              </h3>
            </div>

            <div className="flex justify-center items-center gap-4">
              <Badge variant={scoreBadge.variant} className="px-4 py-2">
                <span className={scoreBadge.color}>
                  {scoreBadge.label} Score ({quizScore}/3)
                </span>
              </Badge>
            </div>

            <div>
              <p className="text-sm text-muted-foreground">Completed on</p>
              <p className="font-medium">{completionDate}</p>
            </div>

            {/* Decorative border */}
            <div className="border-t border-b border-dashed border-blue-300 py-4 my-6">
              <p className="text-xs text-muted-foreground">
                This certificate validates your understanding of {styleName} comic art techniques,
                including style characteristics, composition principles, and creative application.
              </p>
            </div>

            {/* Signature section */}
            <div className="flex justify-between items-end mt-8 pt-4">
              <div className="text-left">
                <div className="w-32 border-b border-gray-400 mb-2"></div>
                <p className="text-xs text-muted-foreground">ComicAI Education</p>
                <p className="text-xs font-medium">Art Director</p>
              </div>
              
              <div className="text-center">
                <div className="w-20 h-20 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mb-2">
                  <Award className="h-10 w-10 text-blue-600" />
                </div>
                <p className="text-xs text-muted-foreground">Official Seal</p>
              </div>
              
              <div className="text-right">
                <div className="w-32 border-b border-gray-400 mb-2"></div>
                <p className="text-xs text-muted-foreground">Certificate ID</p>
                <p className="text-xs font-mono">CA-{styleName.substring(0,3).toUpperCase()}-{Date.now().toString().slice(-6)}</p>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex gap-4 mt-8 pt-6 border-t">
            <Button onClick={onDownload} variant="outline" className="flex-1">
              <Download className="mr-2 h-4 w-4" />
              Download PDF
            </Button>
            <Button onClick={onShare} className="flex-1">
              <Share2 className="mr-2 h-4 w-4" />
              Share Achievement
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}