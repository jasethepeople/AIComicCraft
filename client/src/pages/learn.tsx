import { Helmet } from "react-helmet";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { PlayCircle, FileText, Lightbulb, Award } from "lucide-react";

export default function Learn() {
  const tutorials = [
    {
      title: "Getting Started with ComicAI",
      description: "Learn the basics of creating your first comic with our AI tools.",
      duration: "5 min",
      image: "https://images.unsplash.com/photo-1614332287897-cdc485fa562d?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400"
    },
    {
      title: "Advanced Character Design",
      description: "Master the art of creating consistent characters across panels.",
      duration: "8 min",
      image: "https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400"
    },
    {
      title: "Storytelling Techniques",
      description: "Learn how to craft compelling narratives for your comics.",
      duration: "12 min",
      image: "https://images.unsplash.com/photo-1519638399535-1b036603ac77?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400"
    },
    {
      title: "Mastering Panel Layouts",
      description: "Explore different layout options to enhance your storytelling.",
      duration: "7 min",
      image: "https://images.unsplash.com/photo-1604580864964-0462f5d5b1a8?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400"
    }
  ];

  const faqItems = [
    {
      question: "How does the AI comic generation work?",
      answer: "Our AI system combines advanced image generation with natural language processing. You provide text descriptions of your characters, scenes, and story, and our AI creates comic panels that match your vision. The system maintains consistency across panels to ensure your characters look the same throughout your comic."
    },
    {
      question: "Can I edit the AI-generated content?",
      answer: "Absolutely! While the AI creates initial panels based on your descriptions, you have full editing capabilities. You can adjust layouts, modify character appearances, edit dialogue, and make any other changes needed to perfect your comic."
    },
    {
      question: "What art styles are available?",
      answer: "We offer a variety of art styles including Superhero, Manga, European, Indie, Retro, Cartoon, and Noir. Each style has its own unique characteristics that can be applied to your comic. You can also customize and blend styles to create a unique look."
    },
    {
      question: "How do I publish and sell my comics?",
      answer: "Once your comic is complete, you can publish it directly to our marketplace with just a few clicks. Set your price, add a description, and make it available for sale. Buyers can purchase digital downloads, and you earn revenue from each sale. We also offer options for NFT minting for collectors."
    },
    {
      question: "What's the difference between the free and paid plans?",
      answer: "The free plan lets you create up to 5 AI-generated comics per month with basic art styles and standard resolution exports. Paid plans offer unlimited comic generation, access to all art styles, higher resolution exports, priority generation queue, and additional features like team collaboration and commercial usage rights."
    }
  ];

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <Helmet>
        <title>Learn & Resources | ComicAI</title>
        <meta name="description" content="Learn how to create amazing AI-powered comics with our tutorials, guides, and resources." />
      </Helmet>

      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="font-bangers text-dark text-4xl md:text-5xl mb-4">
            Learn to Create <span className="text-primary">Amazing Comics</span>
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Master our AI comic creation tools with tutorials, guides, and resources designed for creators of all skill levels.
          </p>
        </div>

        {/* Main video tutorial section */}
        <div className="mb-16">
          <div className="bg-primary bg-opacity-5 rounded-xl overflow-hidden">
            <div className="aspect-video relative">
              <div className="absolute inset-0 flex items-center justify-center bg-gray-800">
                <div className="text-center p-8">
                  <PlayCircle className="w-16 h-16 text-primary mx-auto mb-4" />
                  <h2 className="text-white font-bold text-2xl mb-2">
                    Getting Started with ComicAI
                  </h2>
                  <p className="text-gray-300">
                    A complete walkthrough of creating your first comic
                  </p>
                </div>
              </div>
            </div>
            <div className="p-6 flex flex-col md:flex-row justify-between items-center gap-4">
              <div>
                <h3 className="font-bold text-xl">Complete Beginner's Guide</h3>
                <p className="text-gray-600">
                  Learn everything you need to know to create your first AI-powered comic
                </p>
              </div>
              <Button className="bg-primary hover:bg-opacity-90 text-white">
                <PlayCircle className="mr-2 h-4 w-4" />
                Watch Tutorial (15 min)
              </Button>
            </div>
          </div>
        </div>

        {/* Tutorial categories */}
        <Tabs defaultValue="tutorials" className="w-full mb-16">
          <TabsList className="mb-8 mx-auto flex justify-center">
            <TabsTrigger value="tutorials">Video Tutorials</TabsTrigger>
            <TabsTrigger value="guides">Written Guides</TabsTrigger>
            <TabsTrigger value="faq">FAQ</TabsTrigger>
          </TabsList>
          
          <TabsContent value="tutorials">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {tutorials.map((tutorial, index) => (
                <Card key={index} className="overflow-hidden">
                  <div className="aspect-video relative overflow-hidden">
                    <img
                      src={tutorial.image}
                      alt={tutorial.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300">
                      <PlayCircle className="w-12 h-12 text-white" />
                    </div>
                  </div>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">{tutorial.title}</CardTitle>
                    <CardDescription>{tutorial.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500">{tutorial.duration} watch</span>
                      <Button variant="ghost" size="sm" className="text-primary">
                        Watch Now
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            <div className="text-center mt-8">
              <Button variant="outline">
                View All Tutorials
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="guides">
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="flex">
                <div className="p-4 flex-shrink-0 flex items-start justify-center">
                  <div className="bg-primary/10 p-3 rounded-full">
                    <FileText className="h-6 w-6 text-primary" />
                  </div>
                </div>
                <div className="py-4 pr-4">
                  <h3 className="font-bold mb-1">Complete Guide to Comic Creation</h3>
                  <p className="text-gray-600 text-sm mb-3">
                    A comprehensive guide covering all aspects of creating comics with our AI platform.
                  </p>
                  <Button variant="ghost" size="sm" className="text-primary px-0">
                    Read Guide
                  </Button>
                </div>
              </Card>
              
              <Card className="flex">
                <div className="p-4 flex-shrink-0 flex items-start justify-center">
                  <div className="bg-secondary/10 p-3 rounded-full">
                    <Lightbulb className="h-6 w-6 text-secondary" />
                  </div>
                </div>
                <div className="py-4 pr-4">
                  <h3 className="font-bold mb-1">Tips for Better AI Prompts</h3>
                  <p className="text-gray-600 text-sm mb-3">
                    Learn how to write effective prompts that get the best results from our AI engine.
                  </p>
                  <Button variant="ghost" size="sm" className="text-primary px-0">
                    Read Guide
                  </Button>
                </div>
              </Card>
              
              <Card className="flex">
                <div className="p-4 flex-shrink-0 flex items-start justify-center">
                  <div className="bg-accent/10 p-3 rounded-full">
                    <Award className="h-6 w-6 text-accent" />
                  </div>
                </div>
                <div className="py-4 pr-4">
                  <h3 className="font-bold mb-1">Marketing Your Comics</h3>
                  <p className="text-gray-600 text-sm mb-3">
                    Strategies to promote and sell your comics in our marketplace and beyond.
                  </p>
                  <Button variant="ghost" size="sm" className="text-primary px-0">
                    Read Guide
                  </Button>
                </div>
              </Card>
              
              <Card className="flex">
                <div className="p-4 flex-shrink-0 flex items-start justify-center">
                  <div className="bg-primary/10 p-3 rounded-full">
                    <FileText className="h-6 w-6 text-primary" />
                  </div>
                </div>
                <div className="py-4 pr-4">
                  <h3 className="font-bold mb-1">Character Consistency Guide</h3>
                  <p className="text-gray-600 text-sm mb-3">
                    Tips and techniques for maintaining consistent character designs across your comic.
                  </p>
                  <Button variant="ghost" size="sm" className="text-primary px-0">
                    Read Guide
                  </Button>
                </div>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="faq">
            <div className="space-y-6 max-w-3xl mx-auto">
              {faqItems.map((item, index) => (
                <div key={index} className="bg-white rounded-lg p-6 shadow-sm">
                  <h3 className="font-bold text-lg mb-2">{item.question}</h3>
                  <p className="text-gray-600">{item.answer}</p>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
        
        {/* Call to action */}
        <div className="bg-dark text-white rounded-xl p-8 text-center">
          <h2 className="font-bangers text-2xl md:text-3xl mb-4">
            Ready to Create Your First Comic?
          </h2>
          <p className="text-gray-300 max-w-2xl mx-auto mb-6">
            Put your new knowledge to work and start creating amazing comics with our AI-powered platform.
          </p>
          <Link href="/creator-studio">
            <Button className="bg-accent hover:bg-opacity-90 text-white font-bold px-6 py-3 rounded-lg text-lg">
              Start Creating Now
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
