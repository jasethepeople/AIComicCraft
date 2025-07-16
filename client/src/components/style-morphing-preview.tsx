import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Play, Pause, RotateCcw, Shuffle, Eye } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface StylePreview {
  id: string;
  name: string;
  beforeImage: string;
  afterImage: string;
  description: string;
  tags: string[];
}

const samplePreviews: StylePreview[] = [
  {
    id: "superhero-realistic",
    name: "Superhero → Realistic",
    beforeImage: "data:image/svg+xml;base64," + btoa(`
      <svg width="300" height="400" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="bg1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#ff6b6b;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#4ecdc4;stop-opacity:1" />
          </linearGradient>
        </defs>
        <rect width="300" height="400" fill="url(#bg1)"/>
        <rect x="50" y="100" width="200" height="200" fill="#ff4757" stroke="#2f3542" stroke-width="3" rx="20"/>
        <circle cx="100" cy="150" r="15" fill="#fff"/>
        <circle cx="200" cy="150" r="15" fill="#fff"/>
        <circle cx="100" cy="150" r="8" fill="#000"/>
        <circle cx="200" cy="150" r="8" fill="#000"/>
        <path d="M120 200 Q150 220 180 200" stroke="#000" stroke-width="3" fill="none"/>
        <text x="150" y="350" text-anchor="middle" font-family="Arial" font-size="16" font-weight="bold" fill="#2f3542">SUPERHERO STYLE</text>
      </svg>
    `),
    afterImage: "data:image/svg+xml;base64," + btoa(`
      <svg width="300" height="400" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="bg2" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#f1f2f6;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#ddd;stop-opacity:1" />
          </linearGradient>
        </defs>
        <rect width="300" height="400" fill="url(#bg2)"/>
        <ellipse cx="150" cy="180" rx="80" ry="100" fill="#ffeaa7" stroke="#636e72" stroke-width="2"/>
        <circle cx="130" cy="160" r="8" fill="#2d3436"/>
        <circle cx="170" cy="160" r="8" fill="#2d3436"/>
        <path d="M140 200 Q150 210 160 200" stroke="#636e72" stroke-width="2" fill="none"/>
        <path d="M120 140 Q150 120 180 140" stroke="#636e72" stroke-width="2" fill="none"/>
        <text x="150" y="350" text-anchor="middle" font-family="Arial" font-size="16" fill="#636e72">REALISTIC STYLE</text>
      </svg>
    `),
    description: "Transform bold superhero aesthetics into photorealistic rendering",
    tags: ["Dynamic", "Bold", "Realistic"]
  },
  {
    id: "manga-minimalist",
    name: "Manga → Minimalist",
    beforeImage: "data:image/svg+xml;base64," + btoa(`
      <svg width="300" height="400" xmlns="http://www.w3.org/2000/svg">
        <rect width="300" height="400" fill="#ffe66d"/>
        <circle cx="150" cy="180" r="80" fill="#fff" stroke="#ff6b6b" stroke-width="4"/>
        <circle cx="130" cy="160" r="20" fill="#ff6b6b"/>
        <circle cx="170" cy="160" r="20" fill="#ff6b6b"/>
        <circle cx="130" cy="160" r="8" fill="#fff"/>
        <circle cx="170" cy="160" r="8" fill="#fff"/>
        <path d="M130 200 Q150 220 170 200" stroke="#ff6b6b" stroke-width="4" fill="none"/>
        <path d="M100 130 L80 120 L85 135 Z" fill="#ff6b6b"/>
        <path d="M200 130 L220 120 L215 135 Z" fill="#ff6b6b"/>
        <text x="150" y="350" text-anchor="middle" font-family="Arial" font-size="16" font-weight="bold" fill="#ff6b6b">MANGA STYLE</text>
      </svg>
    `),
    afterImage: "data:image/svg+xml;base64," + btoa(`
      <svg width="300" height="400" xmlns="http://www.w3.org/2000/svg">
        <rect width="300" height="400" fill="#fff"/>
        <circle cx="150" cy="180" r="60" fill="none" stroke="#2d3436" stroke-width="2"/>
        <circle cx="140" cy="170" r="3" fill="#2d3436"/>
        <circle cx="160" cy="170" r="3" fill="#2d3436"/>
        <path d="M145 190 Q150 195 155 190" stroke="#2d3436" stroke-width="1" fill="none"/>
        <text x="150" y="350" text-anchor="middle" font-family="Arial" font-size="16" fill="#636e72">MINIMALIST STYLE</text>
      </svg>
    `),
    description: "Simplify expressive manga features into clean, minimal lines",
    tags: ["Clean", "Simple", "Modern"]
  },
  {
    id: "retro-cyberpunk",
    name: "Retro → Cyberpunk",
    beforeImage: "data:image/svg+xml;base64," + btoa(`
      <svg width="300" height="400" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="retro" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#ff9ff3;stop-opacity:1" />
            <stop offset="50%" style="stop-color:#f368e0;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#ff6348;stop-opacity:1" />
          </linearGradient>
        </defs>
        <rect width="300" height="400" fill="url(#retro)"/>
        <rect x="75" y="150" width="150" height="100" fill="#fff" stroke="#2f3542" stroke-width="3" rx="10"/>
        <circle cx="110" cy="180" r="12" fill="#ff6348"/>
        <circle cx="165" cy="180" r="12" fill="#ff6348"/>
        <rect x="130" y="200" width="40" height="10" fill="#2f3542" rx="5"/>
        <text x="150" y="350" text-anchor="middle" font-family="Arial" font-size="16" font-weight="bold" fill="#fff">RETRO STYLE</text>
      </svg>
    `),
    afterImage: "data:image/svg+xml;base64," + btoa(`
      <svg width="300" height="400" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="cyber" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#0c0c0c;stop-opacity:1" />
            <stop offset="50%" style="stop-color:#1a1a2e;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#16213e;stop-opacity:1" />
          </linearGradient>
        </defs>
        <rect width="300" height="400" fill="url(#cyber)"/>
        <rect x="75" y="150" width="150" height="100" fill="none" stroke="#00f5ff" stroke-width="2" rx="5"/>
        <circle cx="110" cy="180" r="8" fill="#00f5ff"/>
        <circle cx="165" cy="180" r="8" fill="#00f5ff"/>
        <rect x="130" y="200" width="40" height="6" fill="#00f5ff" rx="3"/>
        <rect x="70" y="145" width="160" height="2" fill="#00f5ff" opacity="0.5"/>
        <rect x="70" y="258" width="160" height="2" fill="#00f5ff" opacity="0.5"/>
        <text x="150" y="350" text-anchor="middle" font-family="Arial" font-size="16" font-weight="bold" fill="#00f5ff">CYBERPUNK STYLE</text>
      </svg>
    `),
    description: "Evolve vintage aesthetics into futuristic neon-tech visuals",
    tags: ["Futuristic", "Neon", "Tech"]
  }
];

export default function StyleMorphingPreview() {
  const [selectedPreview, setSelectedPreview] = useState(samplePreviews[0]);
  const [morphProgress, setMorphProgress] = useState([50]);
  const [isAnimating, setIsAnimating] = useState(false);
  const [animationSpeed, setAnimationSpeed] = useState([2]);
  const animationRef = useRef<number>();

  const startAnimation = () => {
    if (isAnimating) {
      setIsAnimating(false);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      return;
    }

    setIsAnimating(true);
    const animate = () => {
      setMorphProgress(prev => {
        const newValue = prev[0] + animationSpeed[0];
        if (newValue >= 100) {
          return [0];
        }
        return [newValue];
      });
      animationRef.current = requestAnimationFrame(animate);
    };
    animate();
  };

  const resetProgress = () => {
    setIsAnimating(false);
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
    setMorphProgress([50]);
  };

  const randomizePreview = () => {
    const randomIndex = Math.floor(Math.random() * samplePreviews.length);
    setSelectedPreview(samplePreviews[randomIndex]);
    setMorphProgress([50]);
  };

  useEffect(() => {
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  const morphValue = morphProgress[0];
  const beforeOpacity = 1 - (morphValue / 100);
  const afterOpacity = morphValue / 100;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
            Style Morphing Preview
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Preview Selection */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium">Choose Transformation:</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {samplePreviews.map((preview) => (
                <Button
                  key={preview.id}
                  variant={selectedPreview.id === preview.id ? "default" : "outline"}
                  className="h-auto p-3 text-left"
                  onClick={() => setSelectedPreview(preview)}
                >
                  <div className="space-y-1">
                    <div className="font-medium text-sm">{preview.name}</div>
                    <div className="flex flex-wrap gap-1">
                      {preview.tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs px-1 py-0">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </Button>
              ))}
            </div>
          </div>

          {/* Main Preview Area */}
          <div className="relative bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 rounded-lg p-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedPreview.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                className="relative"
              >
                {/* Layered Images for Morphing Effect */}
                <div className="relative mx-auto w-80 h-96 rounded-lg overflow-hidden shadow-lg">
                  <img
                    src={selectedPreview.beforeImage}
                    alt="Before style"
                    className="absolute inset-0 w-full h-full object-cover transition-opacity duration-300"
                    style={{ opacity: beforeOpacity }}
                  />
                  <img
                    src={selectedPreview.afterImage}
                    alt="After style"
                    className="absolute inset-0 w-full h-full object-cover transition-opacity duration-300"
                    style={{ opacity: afterOpacity }}
                  />
                  
                  {/* Slider Overlay */}
                  <div
                    className="absolute top-0 bottom-0 w-1 bg-white shadow-lg z-10"
                    style={{ left: `${morphValue}%` }}
                  >
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-6 h-6 bg-white rounded-full shadow-lg border-2 border-gray-300 flex items-center justify-center">
                      <div className="w-2 h-2 bg-gray-600 rounded-full"></div>
                    </div>
                  </div>
                </div>

                {/* Progress Labels */}
                <div className="flex justify-between mt-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                    Before: {selectedPreview.name.split(' → ')[0]}
                  </span>
                  <span className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                    After: {selectedPreview.name.split(' → ')[1]}
                  </span>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Controls */}
          <div className="space-y-4">
            {/* Morph Slider */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-sm font-medium">Morph Progress</label>
                <span className="text-sm text-muted-foreground">{Math.round(morphValue)}%</span>
              </div>
              <Slider
                value={morphProgress}
                onValueChange={setMorphProgress}
                max={100}
                step={1}
                className="w-full"
                disabled={isAnimating}
              />
            </div>

            {/* Animation Speed */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-sm font-medium">Animation Speed</label>
                <span className="text-sm text-muted-foreground">{animationSpeed[0]}x</span>
              </div>
              <Slider
                value={animationSpeed}
                onValueChange={setAnimationSpeed}
                min={0.5}
                max={5}
                step={0.5}
                className="w-full"
              />
            </div>

            {/* Control Buttons */}
            <div className="flex flex-wrap gap-2">
              <Button
                onClick={startAnimation}
                variant={isAnimating ? "destructive" : "default"}
                className="flex items-center gap-2"
              >
                {isAnimating ? (
                  <>
                    <Pause className="h-4 w-4" />
                    Pause
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4" />
                    Animate
                  </>
                )}
              </Button>
              
              <Button onClick={resetProgress} variant="outline" className="flex items-center gap-2">
                <RotateCcw className="h-4 w-4" />
                Reset
              </Button>
              
              <Button onClick={randomizePreview} variant="outline" className="flex items-center gap-2">
                <Shuffle className="h-4 w-4" />
                Random
              </Button>
            </div>
          </div>

          {/* Description */}
          <div className="p-4 bg-muted rounded-lg">
            <p className="text-sm text-muted-foreground">{selectedPreview.description}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}