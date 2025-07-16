import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { 
  Play,
  Clock,
  Users,
  BookOpen,
  Star,
  Video,
  FileText,
  Download,
  Wand2,
  Palette,
  Share2
} from "lucide-react";

export default function Tutorials() {
  const tutorialCategories = [
    {
      title: "Getting Started",
      icon: <BookOpen className="w-6 h-6 text-blue-500" />,
      description: "Essential tutorials for new users",
      tutorials: [
        {
          title: "Your First Comic in 5 Minutes",
          duration: "5:23",
          difficulty: "Beginner",
          views: "12.3k",
          rating: 4.9,
          type: "video"
        },
        {
          title: "Understanding the Credit System",
          duration: "3:45",
          difficulty: "Beginner",
          views: "8.7k",
          rating: 4.8,
          type: "video"
        },
        {
          title: "Navigating the Creator Studio",
          duration: "7:12",
          difficulty: "Beginner",
          views: "15.2k",
          rating: 4.9,
          type: "video"
        }
      ]
    },
    {
      title: "Character Creation",
      icon: <Users className="w-6 h-6 text-green-500" />,
      description: "Master the art of character development",
      tutorials: [
        {
          title: "Creating Memorable Characters",
          duration: "12:34",
          difficulty: "Intermediate",
          views: "9.1k",
          rating: 4.7,
          type: "video"
        },
        {
          title: "Character Consistency Across Panels",
          duration: "8:45",
          difficulty: "Intermediate",
          views: "6.8k",
          rating: 4.6,
          type: "video"
        },
        {
          title: "Writing Character Backstories",
          duration: "15 min read",
          difficulty: "Beginner",
          views: "5.4k",
          rating: 4.8,
          type: "article"
        }
      ]
    },
    {
      title: "Art Styles & Design",
      icon: <Palette className="w-6 h-6 text-purple-500" />,
      description: "Explore different visual aesthetics",
      tutorials: [
        {
          title: "Choosing the Right Art Style",
          duration: "10:15",
          difficulty: "Beginner",
          views: "11.5k",
          rating: 4.8,
          type: "video"
        },
        {
          title: "Manga vs Superhero Styles",
          duration: "14:22",
          difficulty: "Intermediate",
          views: "7.9k",
          rating: 4.7,
          type: "video"
        },
        {
          title: "Creating Custom Visual Themes",
          duration: "18:33",
          difficulty: "Advanced",
          views: "4.2k",
          rating: 4.9,
          type: "video"
        }
      ]
    },
    {
      title: "Advanced Techniques",
      icon: <Wand2 className="w-6 h-6 text-orange-500" />,
      description: "Professional comic creation methods",
      tutorials: [
        {
          title: "Panel Composition & Flow",
          duration: "16:45",
          difficulty: "Advanced",
          views: "6.3k",
          rating: 4.9,
          type: "video"
        },
        {
          title: "Dialogue and Speech Bubbles",
          duration: "11:28",
          difficulty: "Intermediate",
          views: "8.1k",
          rating: 4.6,
          type: "video"
        },
        {
          title: "Creating Compelling Story Arcs",
          duration: "25 min read",
          difficulty: "Advanced",
          views: "3.7k",
          rating: 4.8,
          type: "article"
        }
      ]
    },
    {
      title: "Publishing & Sharing",
      icon: <Share2 className="w-6 h-6 text-pink-500" />,
      description: "Get your comics out into the world",
      tutorials: [
        {
          title: "Publishing to the Marketplace",
          duration: "9:17",
          difficulty: "Intermediate",
          views: "5.8k",
          rating: 4.7,
          type: "video"
        },
        {
          title: "Creating Social Media Previews",
          duration: "6:42",
          difficulty: "Beginner",
          views: "7.3k",
          rating: 4.8,
          type: "video"
        },
        {
          title: "Marketing Your Comics",
          duration: "20 min read",
          difficulty: "Intermediate",
          views: "4.1k",
          rating: 4.5,
          type: "article"
        }
      ]
    }
  ];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Beginner": return "bg-green-100 text-green-800";
      case "Intermediate": return "bg-yellow-100 text-yellow-800";
      case "Advanced": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getTypeIcon = (type: string) => {
    return type === "video" ? 
      <Video className="w-4 h-4 text-blue-500" /> : 
      <FileText className="w-4 h-4 text-gray-500" />;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted py-12">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Video Tutorials</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Learn comic creation with step-by-step video tutorials and comprehensive guides 
            from beginner basics to advanced techniques.
          </p>
          
          {/* Stats */}
          <div className="flex justify-center space-x-8 text-sm text-muted-foreground">
            <div className="flex items-center space-x-1">
              <Video className="w-4 h-4" />
              <span>50+ Video Tutorials</span>
            </div>
            <div className="flex items-center space-x-1">
              <FileText className="w-4 h-4" />
              <span>25+ Written Guides</span>
            </div>
            <div className="flex items-center space-x-1">
              <Users className="w-4 h-4" />
              <span>10k+ Students</span>
            </div>
          </div>
        </div>

        {/* Featured Tutorial */}
        <div className="mb-12">
          <Card className="overflow-hidden bg-gradient-to-r from-primary/5 to-secondary/5 border-primary/20">
            <div className="md:flex">
              <div className="md:w-1/2 relative">
                <img 
                  src="https://images.unsplash.com/photo-1612036782180-6f0b6cd846fe?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400" 
                  alt="Featured Tutorial"
                  className="w-full h-64 md:h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                  <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center">
                    <Play className="w-8 h-8 text-primary ml-1" />
                  </div>
                </div>
              </div>
              <div className="md:w-1/2 p-8">
                <Badge className="mb-4 bg-primary text-white">
                  Featured Tutorial
                </Badge>
                <CardTitle className="text-2xl mb-4">
                  Complete Comic Creation Masterclass
                </CardTitle>
                <CardDescription className="text-base mb-6">
                  A comprehensive 2-hour course covering everything from story development to publishing. 
                  Perfect for beginners who want to create their first professional comic.
                </CardDescription>
                <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-6">
                  <div className="flex items-center space-x-1">
                    <Clock className="w-4 h-4" />
                    <span>2h 15m</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Users className="w-4 h-4" />
                    <span>3.2k students</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span>4.9 rating</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <Badge className="bg-green-100 text-green-800">
                    Beginner Friendly
                  </Badge>
                  <Button>
                    <Play className="w-4 h-4 mr-2" />
                    Watch Now
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Tutorial Categories */}
        <div className="space-y-8">
          {tutorialCategories.map((category, categoryIndex) => (
            <div key={categoryIndex}>
              <div className="flex items-center space-x-3 mb-6">
                {category.icon}
                <div>
                  <h2 className="text-2xl font-bold">{category.title}</h2>
                  <p className="text-muted-foreground">{category.description}</p>
                </div>
              </div>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {category.tutorials.map((tutorial, tutorialIndex) => (
                  <Card key={tutorialIndex} className="hover:shadow-lg transition-shadow group">
                    <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center relative overflow-hidden">
                      <img 
                        src={`https://images.unsplash.com/photo-${1612036782180 + tutorialIndex}?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=225`}
                        alt={tutorial.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center">
                          <Play className="w-6 h-6 text-primary ml-0.5" />
                        </div>
                      </div>
                      <div className="absolute top-2 right-2">
                        {getTypeIcon(tutorial.type)}
                      </div>
                    </div>
                    
                    <CardHeader>
                      <div className="flex items-center justify-between mb-2">
                        <Badge className={getDifficultyColor(tutorial.difficulty)}>
                          {tutorial.difficulty}
                        </Badge>
                        <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                          <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                          <span>{tutorial.rating}</span>
                        </div>
                      </div>
                      <CardTitle className="text-lg line-clamp-2">{tutorial.title}</CardTitle>
                    </CardHeader>
                    
                    <CardContent>
                      <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                        <div className="flex items-center space-x-1">
                          <Clock className="w-3 h-3" />
                          <span>{tutorial.duration}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Users className="w-3 h-3" />
                          <span>{tutorial.views} views</span>
                        </div>
                      </div>
                      <Button variant="outline" size="sm" className="w-full">
                        {tutorial.type === "video" ? (
                          <>
                            <Play className="w-3 h-3 mr-2" />
                            Watch Tutorial
                          </>
                        ) : (
                          <>
                            <FileText className="w-3 h-3 mr-2" />
                            Read Guide
                          </>
                        )}
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Download Resources */}
        <div className="mt-12">
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="flex items-center justify-center space-x-2">
                <Download className="w-5 h-5" />
                <span>Downloadable Resources</span>
              </CardTitle>
              <CardDescription>
                Additional materials to enhance your learning
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4">
                <Button variant="outline" className="h-auto p-4 flex flex-col items-center space-y-2">
                  <FileText className="w-6 h-6 text-blue-500" />
                  <span className="font-medium">Character Templates</span>
                  <span className="text-xs text-muted-foreground">PDF worksheets</span>
                </Button>
                <Button variant="outline" className="h-auto p-4 flex flex-col items-center space-y-2">
                  <Palette className="w-6 h-6 text-purple-500" />
                  <span className="font-medium">Style Guide</span>
                  <span className="text-xs text-muted-foreground">Visual references</span>
                </Button>
                <Button variant="outline" className="h-auto p-4 flex flex-col items-center space-y-2">
                  <BookOpen className="w-6 h-6 text-green-500" />
                  <span className="font-medium">Story Templates</span>
                  <span className="text-xs text-muted-foreground">Plot outlines</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <div className="bg-gradient-to-r from-primary to-secondary p-8 rounded-lg text-white">
            <h3 className="text-2xl font-bold mb-4">Ready to Start Learning?</h3>
            <p className="mb-6 opacity-90 max-w-2xl mx-auto">
              Join thousands of creators who have learned comic creation through our comprehensive tutorials. 
              Start with the basics and work your way up to advanced techniques.
            </p>
            <div className="flex items-center justify-center space-x-4">
              <Link href="/register">
                <Button size="lg" variant="secondary" className="text-primary">
                  Start Learning
                </Button>
              </Link>
              <Link href="/creator-studio">
                <Button size="lg" variant="outline" className="text-white border-white hover:bg-white hover:text-primary">
                  Try Creator Studio
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}