import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Award, Download, Share2, Star } from "lucide-react";
import { motion } from "framer-motion";

interface TutorialCertificateProps {
  styleName: string;
  userName: string;
  completionDate: string;
  quizScore?: number;
  onDownload?: () => void;
  onShare?: () => void;
}

export default function TutorialCertificate({ 
  styleName, 
  userName, 
  completionDate, 
  quizScore,
  onDownload,
  onShare 
}: TutorialCertificateProps) {
  const excellence = quizScore && quizScore >= 2 ? "Excellence" : "Completion";
  
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, type: "spring" }}
    >
      <Card className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 border-2 border-yellow-300 dark:border-yellow-600">
        <CardHeader className="text-center pb-4">
          <motion.div
            initial={{ rotate: 0 }}
            animate={{ rotate: 360 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="mx-auto mb-4"
          >
            <Award className="h-16 w-16 text-yellow-500" />
          </motion.div>
          
          <CardTitle className="text-2xl font-bold text-gray-800 dark:text-gray-200">
            Certificate of {excellence}
          </CardTitle>
          
          <div className="flex justify-center gap-2 mt-2">
            {[...Array(3)].map((_, i) => (
              <Star key={i} className="h-5 w-5 text-yellow-500 fill-current" />
            ))}
          </div>
        </CardHeader>
        
        <CardContent className="text-center space-y-6">
          <div className="space-y-2">
            <p className="text-lg text-muted-foreground">
              This certifies that
            </p>
            <p className="text-3xl font-bold text-primary">
              {userName}
            </p>
            <p className="text-lg text-muted-foreground">
              has successfully completed the
            </p>
            <p className="text-2xl font-semibold text-secondary">
              {styleName} Comic Art Style Tutorial
            </p>
          </div>
          
          <div className="flex justify-center gap-4 items-center">
            <Badge variant="secondary" className="text-sm">
              Completed: {completionDate}
            </Badge>
            {quizScore !== undefined && (
              <Badge variant={quizScore >= 2 ? "default" : "secondary"} className="text-sm">
                Quiz Score: {quizScore}/3
              </Badge>
            )}
          </div>
          
          <div className="border-t pt-4">
            <p className="text-sm text-muted-foreground mb-4">
              Issued by ComicAI Learning Platform
            </p>
            
            <div className="flex justify-center gap-3">
              {onDownload && (
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={onDownload}
                  className="flex items-center gap-2"
                >
                  <Download className="h-4 w-4" />
                  Download
                </Button>
              )}
              {onShare && (
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={onShare}
                  className="flex items-center gap-2"
                >
                  <Share2 className="h-4 w-4" />
                  Share
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}