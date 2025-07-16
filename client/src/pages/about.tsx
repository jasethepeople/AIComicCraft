import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { 
  Heart, 
  Lightbulb, 
  Users, 
  Globe, 
  Award, 
  Sparkles,
  ArrowRight 
} from "lucide-react";

export default function About() {
  const team = [
    {
      name: "Jason Clark",
      role: "Founder & Creator",
      bio: "Passionate about democratizing comic creation through AI technology",
      website: "https://jason-clark.org"
    }
  ];

  const values = [
    {
      icon: <Lightbulb className="w-8 h-8 text-yellow-500" />,
      title: "Innovation",
      description: "We push the boundaries of what's possible with AI-powered creative tools"
    },
    {
      icon: <Users className="w-8 h-8 text-blue-500" />,
      title: "Community",
      description: "Building a supportive ecosystem where creators can learn, share, and grow"
    },
    {
      icon: <Heart className="w-8 h-8 text-red-500" />,
      title: "Accessibility",
      description: "Making professional comic creation accessible to everyone, regardless of artistic skill"
    },
    {
      icon: <Globe className="w-8 h-8 text-green-500" />,
      title: "Global Impact",
      description: "Empowering storytellers worldwide to share their unique voices and perspectives"
    }
  ];

  const milestones = [
    {
      year: "2025",
      title: "ComicAI Launch",
      description: "Platform launched with AI-powered comic creation tools"
    },
    {
      year: "2025",
      title: "Beta Release",
      description: "Public beta with 15+ art styles and community features"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted py-12">
      <div className="container mx-auto px-4">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            About <span className="text-primary">Comic</span><span className="text-secondary">AI</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            We're on a mission to democratize comic creation by combining the power of artificial intelligence 
            with intuitive design tools, making professional storytelling accessible to everyone.
          </p>
        </div>

        {/* Mission Section */}
        <div className="mb-16">
          <Card className="bg-gradient-to-r from-primary/10 to-secondary/10 border-primary/20">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl mb-4 flex items-center justify-center space-x-2">
                <Sparkles className="w-6 h-6 text-primary" />
                <span>Our Mission</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-lg text-muted-foreground max-w-4xl mx-auto leading-relaxed">
                ComicAI was born from the belief that everyone has a story to tell, but not everyone has the 
                artistic skills to bring those stories to life visually. By harnessing the power of artificial 
                intelligence, we're breaking down the barriers that have traditionally separated storytellers 
                from visual creation, enabling a new generation of comic creators to emerge.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Values Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">Our Values</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-center mb-4">
                    {value.icon}
                  </div>
                  <CardTitle className="text-xl">{value.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Team Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">Meet the Creator</h2>
          <div className="max-w-2xl mx-auto">
            {team.map((member, index) => (
              <Card key={index} className="text-center">
                <CardHeader>
                  <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users className="w-12 h-12 text-primary" />
                  </div>
                  <CardTitle className="text-xl">{member.name}</CardTitle>
                  <CardDescription className="text-primary font-medium">{member.role}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">{member.bio}</p>
                  <a 
                    href={member.website} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-primary hover:text-primary/80 transition-colors"
                  >
                    Visit Website →
                  </a>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Journey Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">Our Journey</h2>
          <div className="max-w-3xl mx-auto">
            <div className="space-y-6">
              {milestones.map((milestone, index) => (
                <Card key={index} className="relative">
                  <CardHeader>
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white font-bold">
                        {milestone.year}
                      </div>
                      <div>
                        <CardTitle className="text-xl">{milestone.title}</CardTitle>
                        <CardDescription>{milestone.description}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </div>
        </div>

        {/* Technology Section */}
        <div className="mb-16">
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-2xl mb-4">Powered by Cutting-Edge AI</CardTitle>
              <CardDescription>
                ComicAI leverages the latest advances in artificial intelligence and machine learning
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6 text-center">
                <div>
                  <Award className="w-8 h-8 text-primary mx-auto mb-2" />
                  <h3 className="font-semibold mb-2">Advanced AI Models</h3>
                  <p className="text-sm text-muted-foreground">
                    State-of-the-art language and image generation models
                  </p>
                </div>
                <div>
                  <Sparkles className="w-8 h-8 text-primary mx-auto mb-2" />
                  <h3 className="font-semibold mb-2">Creative Intelligence</h3>
                  <p className="text-sm text-muted-foreground">
                    AI that understands narrative structure and visual storytelling
                  </p>
                </div>
                <div>
                  <Globe className="w-8 h-8 text-primary mx-auto mb-2" />
                  <h3 className="font-semibold mb-2">Cloud-Powered</h3>
                  <p className="text-sm text-muted-foreground">
                    Scalable infrastructure for fast, reliable creation
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <div className="bg-gradient-to-r from-primary to-secondary p-12 rounded-lg text-white">
            <h3 className="text-3xl font-bold mb-4">Join Our Creative Community</h3>
            <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
              Be part of the AI-powered creative revolution. Start creating amazing comics today 
              and connect with fellow storytellers from around the world.
            </p>
            <div className="flex items-center justify-center space-x-4">
              <Link href="/register">
                <Button size="lg" variant="secondary" className="text-primary">
                  Get Started Free
                </Button>
              </Link>
              <Link href="/community">
                <Button size="lg" variant="outline" className="text-white border-white hover:bg-white hover:text-primary">
                  Join Community
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}