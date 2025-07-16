import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { 
  Calendar,
  Clock,
  User,
  ArrowRight,
  Sparkles,
  Wand2,
  Users,
  TrendingUp,
  BookOpen
} from "lucide-react";

export default function Blog() {
  const blogPosts = [
    {
      id: 1,
      title: "The Future of AI-Powered Comic Creation",
      excerpt: "Explore how artificial intelligence is revolutionizing the comic book industry and empowering new generations of storytellers.",
      author: "Jason Clark",
      date: "2025-07-16",
      readTime: "5 min read",
      category: "Technology",
      featured: true,
      image: "https://images.unsplash.com/photo-1633412802994-5c058f151b66?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400"
    },
    {
      id: 2,
      title: "10 Tips for Creating Compelling Comic Characters",
      excerpt: "Learn the essential techniques for developing memorable characters that resonate with your audience and drive your story forward.",
      author: "ComicAI Team",
      date: "2025-07-15",
      readTime: "7 min read",
      category: "Tutorial",
      featured: false,
      image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400"
    },
    {
      id: 3,
      title: "From Idea to Published Comic: A Complete Guide",
      excerpt: "A step-by-step walkthrough of the entire comic creation process, from initial concept to publishing on our marketplace.",
      author: "ComicAI Team",
      date: "2025-07-14",
      readTime: "10 min read",
      category: "Guide",
      featured: false,
      image: "https://images.unsplash.com/photo-1612036782180-6f0b6cd846fe?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400"
    },
    {
      id: 4,
      title: "Understanding Different Comic Art Styles",
      excerpt: "Dive deep into the 15+ art styles available in ComicAI and learn when to use each one for maximum impact.",
      author: "ComicAI Team",
      date: "2025-07-13",
      readTime: "6 min read",
      category: "Education",
      featured: false,
      image: "https://images.unsplash.com/photo-1578632767115-351597cf2477?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400"
    },
    {
      id: 5,
      title: "Building a Community Around Your Comics",
      excerpt: "Discover strategies for growing an engaged audience and building lasting connections with your readers through social media and community engagement.",
      author: "ComicAI Team",
      date: "2025-07-12",
      readTime: "8 min read",
      category: "Marketing",
      featured: false,
      image: "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400"
    }
  ];

  const categories = [
    { name: "All", count: 12, icon: <BookOpen className="w-4 h-4" /> },
    { name: "Technology", count: 3, icon: <Sparkles className="w-4 h-4" /> },
    { name: "Tutorial", count: 4, icon: <Wand2 className="w-4 h-4" /> },
    { name: "Guide", count: 2, icon: <BookOpen className="w-4 h-4" /> },
    { name: "Education", count: 2, icon: <Users className="w-4 h-4" /> },
    { name: "Marketing", count: 1, icon: <TrendingUp className="w-4 h-4" /> }
  ];

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Technology": return "bg-blue-100 text-blue-800";
      case "Tutorial": return "bg-green-100 text-green-800";
      case "Guide": return "bg-purple-100 text-purple-800";
      case "Education": return "bg-orange-100 text-orange-800";
      case "Marketing": return "bg-pink-100 text-pink-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const featuredPost = blogPosts.find(post => post.featured);
  const regularPosts = blogPosts.filter(post => !post.featured);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted py-12">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">ComicAI Blog</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Insights, tutorials, and inspiration for comic creators using AI-powered tools
          </p>
        </div>

        {/* Categories */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {categories.map((category, index) => (
            <Button
              key={index}
              variant={category.name === "All" ? "default" : "outline"}
              size="sm"
              className="flex items-center space-x-2"
            >
              {category.icon}
              <span>{category.name}</span>
              <Badge variant="secondary" className="ml-1 text-xs">
                {category.count}
              </Badge>
            </Button>
          ))}
        </div>

        {/* Featured Post */}
        {featuredPost && (
          <div className="mb-12">
            <Card className="overflow-hidden bg-gradient-to-r from-primary/5 to-secondary/5 border-primary/20">
              <div className="md:flex">
                <div className="md:w-1/2">
                  <img 
                    src={featuredPost.image} 
                    alt={featuredPost.title}
                    className="w-full h-64 md:h-full object-cover"
                  />
                </div>
                <div className="md:w-1/2 p-8">
                  <Badge className="mb-4 bg-primary text-white">
                    <Sparkles className="w-3 h-3 mr-1" />
                    Featured
                  </Badge>
                  <CardTitle className="text-2xl mb-4">{featuredPost.title}</CardTitle>
                  <CardDescription className="text-base mb-6">
                    {featuredPost.excerpt}
                  </CardDescription>
                  <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-6">
                    <div className="flex items-center space-x-1">
                      <User className="w-4 h-4" />
                      <span>{featuredPost.author}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4" />
                      <span>{new Date(featuredPost.date).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="w-4 h-4" />
                      <span>{featuredPost.readTime}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <Badge className={getCategoryColor(featuredPost.category)}>
                      {featuredPost.category}
                    </Badge>
                    <Button>
                      Read Article
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Blog Posts Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {regularPosts.map((post) => (
            <Card key={post.id} className="overflow-hidden hover:shadow-lg transition-shadow group">
              <div className="aspect-video overflow-hidden">
                <img 
                  src={post.image} 
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <Badge className={getCategoryColor(post.category)}>
                    {post.category}
                  </Badge>
                  <div className="text-xs text-muted-foreground flex items-center space-x-1">
                    <Clock className="w-3 h-3" />
                    <span>{post.readTime}</span>
                  </div>
                </div>
                <CardTitle className="text-lg line-clamp-2">{post.title}</CardTitle>
                <CardDescription className="line-clamp-3">
                  {post.excerpt}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                  <div className="flex items-center space-x-1">
                    <User className="w-3 h-3" />
                    <span>{post.author}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-3 h-3" />
                    <span>{new Date(post.date).toLocaleDateString()}</span>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="w-full">
                  Read More
                  <ArrowRight className="w-3 h-3 ml-2" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Newsletter Signup */}
        <div className="text-center">
          <div className="bg-gradient-to-r from-primary to-secondary p-8 rounded-lg text-white">
            <h3 className="text-2xl font-bold mb-4">Stay Updated</h3>
            <p className="mb-6 opacity-90 max-w-2xl mx-auto">
              Get the latest blog posts, tutorials, and ComicAI updates delivered to your inbox. 
              Join our community of creators and never miss an insight.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-2 rounded-lg text-gray-900 placeholder:text-gray-500"
              />
              <Button variant="secondary" className="text-primary whitespace-nowrap">
                Subscribe
              </Button>
            </div>
            <p className="text-xs opacity-75 mt-3">
              No spam, unsubscribe at any time.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}