import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { 
  Briefcase,
  MapPin,
  Clock,
  Users,
  Heart,
  Rocket,
  Globe,
  Mail
} from "lucide-react";

export default function Careers() {
  const openPositions = [
    {
      title: "Senior AI Engineer",
      department: "Engineering",
      location: "Remote",
      type: "Full-time",
      description: "Help build the next generation of AI-powered creative tools",
      requirements: ["5+ years ML/AI experience", "Python/PyTorch", "Computer Vision"],
      available: false
    },
    {
      title: "Product Designer",
      department: "Design",
      location: "Remote",
      type: "Full-time", 
      description: "Design intuitive interfaces for comic creation tools",
      requirements: ["UI/UX design experience", "Figma proficiency", "Creative software knowledge"],
      available: false
    },
    {
      title: "Community Manager",
      department: "Marketing",
      location: "Remote",
      type: "Part-time",
      description: "Build and engage our creator community",
      requirements: ["Social media expertise", "Community building", "Content creation"],
      available: false
    }
  ];

  const benefits = [
    {
      icon: <Globe className="w-6 h-6 text-blue-500" />,
      title: "Remote First",
      description: "Work from anywhere in the world with flexible hours"
    },
    {
      icon: <Rocket className="w-6 h-6 text-green-500" />,
      title: "Growth Opportunities",
      description: "Learn and grow with cutting-edge AI technology"
    },
    {
      icon: <Heart className="w-6 h-6 text-red-500" />,
      title: "Creative Impact",
      description: "Help democratize comic creation for millions"
    },
    {
      icon: <Users className="w-6 h-6 text-purple-500" />,
      title: "Small Team",
      description: "Direct impact and close collaboration"
    }
  ];

  const values = [
    {
      title: "Innovation",
      description: "We push the boundaries of AI and creativity"
    },
    {
      title: "Accessibility", 
      description: "Making professional tools available to everyone"
    },
    {
      title: "Community",
      description: "Building supportive creator ecosystems"
    },
    {
      title: "Quality",
      description: "Delivering exceptional user experiences"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted py-12">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold mb-6">Join Our Team</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Help us democratize comic creation and empower storytellers worldwide with AI-powered creative tools.
          </p>
          <Badge className="bg-primary/10 text-primary">
            Building the future of creative AI
          </Badge>
        </div>

        {/* Mission */}
        <div className="mb-16">
          <Card className="bg-gradient-to-r from-primary/5 to-secondary/5 border-primary/20">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl mb-4">Our Mission</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                We believe everyone has a story to tell. Our mission is to break down the barriers between 
                imagination and creation by building AI tools that make professional comic creation accessible 
                to anyone, regardless of artistic skill.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Values */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">Our Values</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <Card key={index} className="text-center">
                <CardHeader>
                  <CardTitle className="text-xl">{value.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Benefits */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">Why Work With Us</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-center mb-4">
                    {benefit.icon}
                  </div>
                  <CardTitle className="text-xl">{benefit.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{benefit.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Open Positions */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">Open Positions</h2>
          {openPositions.length > 0 ? (
            <div className="space-y-6">
              {openPositions.map((position, index) => (
                <Card key={index} className={`${!position.available ? 'opacity-75' : ''}`}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-xl mb-2">{position.title}</CardTitle>
                        <CardDescription className="text-base mb-4">
                          {position.description}
                        </CardDescription>
                        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                          <div className="flex items-center space-x-1">
                            <Briefcase className="w-4 h-4" />
                            <span>{position.department}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <MapPin className="w-4 h-4" />
                            <span>{position.location}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Clock className="w-4 h-4" />
                            <span>{position.type}</span>
                          </div>
                        </div>
                      </div>
                      <Badge variant={position.available ? "default" : "secondary"}>
                        {position.available ? "Hiring" : "Future Opening"}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-4">
                      <h4 className="font-medium mb-2">Key Requirements:</h4>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        {position.requirements.map((req, reqIndex) => (
                          <li key={reqIndex} className="flex items-center space-x-2">
                            <div className="w-1.5 h-1.5 bg-primary rounded-full flex-shrink-0" />
                            <span>{req}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <Button 
                      variant={position.available ? "default" : "outline"} 
                      disabled={!position.available}
                    >
                      {position.available ? "Apply Now" : "Join Waitlist"}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="text-center py-12">
              <CardContent>
                <Briefcase className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <CardTitle className="text-xl mb-4">No Open Positions Currently</CardTitle>
                <CardDescription className="text-base mb-6">
                  We're not actively hiring right now, but we're always interested in hearing from talented individuals.
                </CardDescription>
                <Button variant="outline">
                  <Mail className="w-4 h-4 mr-2" />
                  Send Your Resume
                </Button>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Culture */}
        <div className="mb-16">
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-2xl mb-4">Our Culture</CardTitle>
              <CardDescription>
                What it's like to work at ComicAI
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-8 text-center">
                <div>
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Rocket className="w-8 h-8 text-blue-500" />
                  </div>
                  <h3 className="font-semibold mb-2">Move Fast</h3>
                  <p className="text-sm text-muted-foreground">
                    We iterate quickly and ship features that matter to our users
                  </p>
                </div>
                <div>
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users className="w-8 h-8 text-green-500" />
                  </div>
                  <h3 className="font-semibold mb-2">Collaborate</h3>
                  <p className="text-sm text-muted-foreground">
                    We work together across disciplines to solve complex problems
                  </p>
                </div>
                <div>
                  <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Heart className="w-8 h-8 text-purple-500" />
                  </div>
                  <h3 className="font-semibold mb-2">Care Deeply</h3>
                  <p className="text-sm text-muted-foreground">
                    We're passionate about empowering creators and building great products
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Contact */}
        <div className="text-center">
          <div className="bg-gradient-to-r from-primary to-secondary p-8 rounded-lg text-white">
            <h3 className="text-2xl font-bold mb-4">Interested in Joining Us?</h3>
            <p className="mb-6 opacity-90 max-w-2xl mx-auto">
              Even if you don't see a perfect fit above, we'd love to hear from you. 
              Send us your resume and tell us how you'd like to contribute to our mission.
            </p>
            <div className="flex items-center justify-center space-x-4">
              <Link href="/contact">
                <Button size="lg" variant="secondary" className="text-primary">
                  <Mail className="w-4 h-4 mr-2" />
                  Get in Touch
                </Button>
              </Link>
              <Link href="/about">
                <Button size="lg" variant="outline" className="text-white border-white hover:bg-white hover:text-primary">
                  Learn More About Us
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}