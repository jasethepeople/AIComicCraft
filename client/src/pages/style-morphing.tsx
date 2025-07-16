import { Helmet } from "react-helmet";
import { motion } from "framer-motion";
import { Eye, Sparkles, Zap } from "lucide-react";
import StyleMorphingPreview from "@/components/style-morphing-preview";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function StyleMorphing() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <Helmet>
        <title>Style Morphing Preview | ComicAI</title>
        <meta name="description" content="Experience the magic of AI-powered style transformations with real-time morphing previews." />
      </Helmet>

      <div className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-3 mb-6">
            <Eye className="h-12 w-12 text-purple-600" />
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
              Style Morphing
            </h1>
            <Sparkles className="h-12 w-12 text-purple-600" />
          </div>
          
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Watch your artwork transform in real-time as our AI seamlessly blends different comic art styles. 
            Experience the magic of style transformation with interactive before/after previews.
          </p>
        </motion.div>

        {/* Feature Highlights */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
        >
          <Card className="text-center">
            <CardHeader>
              <CardTitle className="flex items-center justify-center gap-2">
                <Zap className="h-5 w-5 text-yellow-500" />
                Real-time Morphing
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                See instant transformations as you slide between different art styles with smooth animations
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <CardTitle className="flex items-center justify-center gap-2">
                <Eye className="h-5 w-5 text-blue-500" />
                Interactive Preview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Control the transformation with precision using our intuitive slider interface
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <CardTitle className="flex items-center justify-center gap-2">
                <Sparkles className="h-5 w-5 text-purple-500" />
                Multiple Styles
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Explore various style combinations from superhero to minimalist, retro to cyberpunk
              </CardDescription>
            </CardContent>
          </Card>
        </motion.div>

        {/* Main Preview Component */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <StyleMorphingPreview />
        </motion.div>

        {/* How It Works Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-16"
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl text-center">How Style Morphing Works</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center space-y-2">
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto">
                    <span className="text-blue-600 dark:text-blue-400 font-bold text-xl">1</span>
                  </div>
                  <h3 className="font-semibold">Choose Transformation</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Select from our curated style pairs to see dramatic before/after comparisons
                  </p>
                </div>
                
                <div className="text-center space-y-2">
                  <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mx-auto">
                    <span className="text-purple-600 dark:text-purple-400 font-bold text-xl">2</span>
                  </div>
                  <h3 className="font-semibold">Interactive Control</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Use the slider to control the transformation or watch it animate automatically
                  </p>
                </div>
                
                <div className="text-center space-y-2">
                  <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto">
                    <span className="text-green-600 dark:text-green-400 font-bold text-xl">3</span>
                  </div>
                  <h3 className="font-semibold">Apply to Comics</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Use your preferred style in the Creator Studio to make amazing comics
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}