import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { 
  Wand2, 
  Palette, 
  Users, 
  Zap, 
  BookOpen, 
  Share2, 
  Download, 
  Globe,
  Sparkles,
  ImageIcon,
  Video,
  Crown,
  ArrowRight
} from "lucide-react";

export default function Features() {
  const features = [
    {
      icon: <Wand2 className="w-8 h-8 text-primary" />,
      title: "AI Story Generation",
      description: "Transform your ideas into compelling narratives with our advanced AI storytelling engine",
      details: [
        "Generate complete story outlines",
        "Character development and dialogue",
        "Plot twists and story arcs",
        "Multiple genre support"
      ],
      category: "Core"
    },
    {
      icon: <Palette className="w-8 h-8 text-blue-500" />,
      title: "15+ Art Styles",
      description: "Choose from a diverse collection of professional art styles for your comics",
      details: [
        "Superhero and manga styles",
        "Vintage and retro aesthetics",
        "Studio Ghibli inspired art",
        "Custom style training"
      ],
      category: "Design"
    },
    {
      icon: <ImageIcon className="w-8 h-8 text-green-500" />,
      title: "Panel Generation",
      description: "Create stunning comic panels with AI-powered image generation",
      details: [
        "High-quality artwork",
        "Consistent character design",
        "Dynamic scene composition",
        "Multiple panel layouts"
      ],
      category: "Core"
    },
    {
      icon: <Video className="w-8 h-8 text-purple-500" />,
      title: "Anime Studio",
      description: "Bring your stories to life with animated sequences and motion graphics",
      details: [
        "Frame-by-frame animation",
        "Motion graphics effects",
        "Character animation",
        "Scene transitions"
      ],
      category: "Premium"
    },
    {
      icon: <Users className="w-8 h-8 text-orange-500" />,
      title: "Character Creator",
      description: "Design memorable characters with detailed personalities and backgrounds",
      details: [
        "Character trait generation",
        "Background story creation",
        "Visual consistency",
        "Character relationship mapping"
      ],
      category: "Core"
    },
    {
      icon: <Share2 className="w-8 h-8 text-pink-500" />,
      title: "Social Preview",
      description: "Generate engaging social media previews to promote your comics",
      details: [
        "Platform-optimized formats",
        "Automatic text overlay",
        "Branded templates",
        "One-click sharing"
      ],
      category: "Marketing"
    },
    {
      icon: <Globe className="w-8 h-8 text-cyan-500" />,
      title: "Marketplace",
      description: "Publish, sell, and discover amazing comics from creators worldwide",
      details: [
        "Global comic distribution",
        "Revenue sharing",
        "Creator analytics",
        "Community feedback"
      ],
      category: "Business"
    },
    {
      icon: <Download className="w-8 h-8 text-indigo-500" />,
      title: "Export Options",
      description: "Download your comics in multiple formats for any platform or purpose",
      details: [
        "High-resolution PDF export",
        "Individual panel downloads",
        "Print-ready formats",
        "Web-optimized files"
      ],
      category: "Core"
    },
    {
      icon: <BookOpen className="w-8 h-8 text-teal-500" />,
      title: "Learning Center",
      description: "Master comic creation with tutorials, guides, and community resources",
      details: [
        "Step-by-step tutorials",
        "Video masterclasses",
        "Community forum",
        "Expert tips and tricks"
      ],
      category: "Education"
    }
  ];

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Core": return "bg-blue-100 text-blue-800";
      case "Premium": return "bg-purple-100 text-purple-800";
      case "Design": return "bg-green-100 text-green-800";
      case "Marketing": return "bg-pink-100 text-pink-800";
      case "Business": return "bg-orange-100 text-orange-800";
      case "Education": return "bg-teal-100 text-teal-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-primary/10 text-primary">
            <Sparkles className="w-4 h-4 mr-2" />
            Powered by AI
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Everything You Need to Create
            <span className="block text-primary">Amazing Comics</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            ComicAI combines cutting-edge artificial intelligence with intuitive design tools 
            to help you create professional comics, anime, and visual stories in minutes.
          </p>
          <div className="flex items-center justify-center space-x-4">
            <Link href="/creator-studio">
              <Button size="lg" className="bg-primary hover:bg-primary/90">
                Start Creating Now
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
            <Link href="/pricing">
              <Button size="lg" variant="outline">
                View Pricing
              </Button>
            </Link>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {features.map((feature, index) => (
            <Card key={index} className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  {feature.icon}
                  <Badge className={getCategoryColor(feature.category)}>
                    {feature.category}
                  </Badge>
                </div>
                <CardTitle className="text-xl mb-2">{feature.title}</CardTitle>
                <CardDescription>{feature.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {feature.details.map((detail, idx) => (
                    <li key={idx} className="flex items-center space-x-2 text-sm">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full flex-shrink-0" />
                      <span>{detail}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Feature Highlights */}
        <div className="space-y-16">
          {/* AI-Powered Creation */}
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge className="mb-4 bg-primary/10 text-primary">
                <Zap className="w-4 h-4 mr-2" />
                AI-Powered
              </Badge>
              <h2 className="text-3xl font-bold mb-4">
                Transform Ideas into Stories
              </h2>
              <p className="text-muted-foreground mb-6">
                Our advanced AI understands narrative structure, character development, and visual storytelling. 
                Simply describe your idea, and watch as it transforms into a compelling comic with rich characters, 
                engaging dialogue, and dynamic visuals.
              </p>
              <ul className="space-y-3 mb-6">
                <li className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-primary/20 rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-primary rounded-full" />
                  </div>
                  <span>Intelligent story structure generation</span>
                </li>
                <li className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-primary/20 rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-primary rounded-full" />
                  </div>
                  <span>Character personality and dialogue creation</span>
                </li>
                <li className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-primary/20 rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-primary rounded-full" />
                  </div>
                  <span>Visual scene composition and panel layout</span>
                </li>
              </ul>
              <Link href="/creator-studio">
                <Button>
                  Try AI Creation
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
            <div className="bg-gradient-to-br from-primary/10 to-secondary/10 rounded-lg p-8 text-center">
              <Wand2 className="w-16 h-16 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">Magic in Every Panel</h3>
              <p className="text-muted-foreground">
                Experience the future of comic creation with AI that understands storytelling
              </p>
            </div>
          </div>

          {/* Professional Quality */}
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-lg p-8 text-center">
              <Crown className="w-16 h-16 text-blue-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">Professional Results</h3>
              <p className="text-muted-foreground">
                Industry-standard quality output ready for publishing and distribution
              </p>
            </div>
            <div className="order-1 lg:order-2">
              <Badge className="mb-4 bg-blue-500/10 text-blue-600">
                <Crown className="w-4 h-4 mr-2" />
                Professional Grade
              </Badge>
              <h2 className="text-3xl font-bold mb-4">
                Studio-Quality Output
              </h2>
              <p className="text-muted-foreground mb-6">
                Every comic created with ComicAI meets professional publishing standards. 
                Our AI generates high-resolution artwork, maintains visual consistency, 
                and produces print-ready files that rival traditionally created comics.
              </p>
              <ul className="space-y-3 mb-6">
                <li className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-blue-500/20 rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-blue-500 rounded-full" />
                  </div>
                  <span>High-resolution artwork generation</span>
                </li>
                <li className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-blue-500/20 rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-blue-500 rounded-full" />
                  </div>
                  <span>Consistent character and style maintenance</span>
                </li>
                <li className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-blue-500/20 rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-blue-500 rounded-full" />
                  </div>
                  <span>Print-ready PDF and digital formats</span>
                </li>
              </ul>
              <Link href="/marketplace">
                <Button variant="outline">
                  See Examples
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center mt-16">
          <div className="bg-gradient-to-r from-primary to-secondary p-12 rounded-lg text-white">
            <h3 className="text-3xl font-bold mb-4">Ready to Create Your First Comic?</h3>
            <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
              Join thousands of creators who are already using ComicAI to bring their stories to life. 
              Start your free trial today and see what's possible.
            </p>
            <div className="flex items-center justify-center space-x-4">
              <Link href="/register">
                <Button size="lg" variant="secondary" className="text-primary">
                  Start Free Trial
                </Button>
              </Link>
              <Link href="/learn">
                <Button size="lg" variant="outline" className="text-white border-white hover:bg-white hover:text-primary">
                  Watch Demo
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}