import { Helmet } from "react-helmet";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Users, MessageSquare, Award, Lightbulb } from "lucide-react";

export default function Community() {
  const forumCategories = [
    { 
      icon: <Users className="h-5 w-5 text-primary" />, 
      title: "Introductions", 
      description: "New to ComicAI? Introduce yourself to the community!",
      posts: 152,
      lastActive: "2 hours ago"
    },
    { 
      icon: <MessageSquare className="h-5 w-5 text-secondary" />, 
      title: "Showcase Your Comics", 
      description: "Share your creations and get feedback from others",
      posts: 427,
      lastActive: "5 minutes ago"
    },
    { 
      icon: <Lightbulb className="h-5 w-5 text-accent" />, 
      title: "Tips & Tricks", 
      description: "Discover how to get the most out of the AI comic creator",
      posts: 283,
      lastActive: "1 hour ago"
    },
    { 
      icon: <Award className="h-5 w-5 text-yellow-500" />, 
      title: "Competitions", 
      description: "Participate in our monthly comic creation contests",
      posts: 94,
      lastActive: "1 day ago"
    }
  ];

  const recentDiscussions = [
    {
      title: "How to create consistent character designs across panels?",
      author: "comicFan42",
      replies: 18,
      views: 234,
      lastActive: "3 hours ago"
    },
    {
      title: "My first superhero comic - feedback welcome!",
      author: "newCreator",
      replies: 24,
      views: 312,
      lastActive: "1 hour ago"
    },
    {
      title: "Tips for writing compelling dialogue in comics",
      author: "storyTeller",
      replies: 32,
      views: 456,
      lastActive: "2 days ago"
    },
    {
      title: "March Comic Contest: 'Future Worlds' - Submit your entries",
      author: "ComicAI_Admin",
      replies: 45,
      views: 789,
      isSticky: true,
      lastActive: "12 hours ago"
    }
  ];

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <Helmet>
        <title>Community | ComicAI</title>
        <meta name="description" content="Join the ComicAI community. Share your creations, get feedback, and connect with other comic creators." />
      </Helmet>

      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="font-bangers text-dark text-4xl md:text-5xl mb-4">
            Comic Creator <span className="text-primary">Community</span>
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Connect with fellow comic creators, share your work, get feedback, and participate in community events.
          </p>
        </div>

        <Tabs defaultValue="forum" className="w-full mb-10">
          <TabsList className="mb-8 mx-auto flex justify-center">
            <TabsTrigger value="forum">Forum</TabsTrigger>
            <TabsTrigger value="events">Events</TabsTrigger>
            <TabsTrigger value="resources">Resources</TabsTrigger>
          </TabsList>
          
          <TabsContent value="forum">
            <div className="grid md:grid-cols-2 gap-6 mb-10">
              {forumCategories.map((category, index) => (
                <Card key={index}>
                  <CardHeader className="flex flex-row items-center space-x-4 pb-2">
                    <div className="bg-gray-100 p-2 rounded-full">
                      {category.icon}
                    </div>
                    <div>
                      <CardTitle className="text-lg">{category.title}</CardTitle>
                      <CardDescription>{category.description}</CardDescription>
                    </div>
                  </CardHeader>
                  <CardFooter className="border-t pt-4 flex justify-between">
                    <span className="text-sm text-gray-500">{category.posts} posts</span>
                    <span className="text-sm text-gray-500">Last active: {category.lastActive}</span>
                  </CardFooter>
                </Card>
              ))}
            </div>
            
            <h2 className="font-bold text-xl mb-4">Recent Discussions</h2>
            <div className="bg-white rounded-xl overflow-hidden border border-gray-200 mb-8">
              {recentDiscussions.map((discussion, index) => (
                <div 
                  key={index} 
                  className={`p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 ${
                    index < recentDiscussions.length - 1 ? 'border-b border-gray-200' : ''
                  } ${discussion.isSticky ? 'bg-primary/5' : ''}`}
                >
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-medium">{discussion.title}</h3>
                      {discussion.isSticky && (
                        <Badge variant="outline" className="bg-primary/10 text-primary text-xs">Pinned</Badge>
                      )}
                    </div>
                    <div className="text-sm text-gray-500">
                      Posted by {discussion.author}
                    </div>
                  </div>
                  <div className="flex gap-4 text-sm text-gray-500 w-full md:w-auto justify-between md:justify-end">
                    <span>{discussion.replies} replies</span>
                    <span>{discussion.views} views</span>
                    <span>{discussion.lastActive}</span>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="text-center">
              <Link href="/community/forum">
                <Button className="bg-primary hover:bg-opacity-90 text-white">
                  View All Discussions
                </Button>
              </Link>
            </div>
          </TabsContent>
          
          <TabsContent value="events">
            <div className="bg-white rounded-xl p-6 text-center">
              <img 
                src="https://images.unsplash.com/photo-1560942485-b2a11cc13456?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400"
                alt="Community events" 
                className="mx-auto w-full max-w-lg rounded-lg mb-6" 
              />
              <h2 className="font-bangers text-2xl mb-4">Monthly Comic Contests</h2>
              <p className="text-gray-600 max-w-2xl mx-auto mb-6">
                Each month we host themed comic creation contests with prizes for the best submissions.
                Join our community events, showcase your talent, and win exclusive rewards!
              </p>
              <Button className="bg-secondary hover:bg-opacity-90 text-white">
                Join Current Contest
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="resources">
            <div className="grid md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Tutorials</CardTitle>
                  <CardDescription>Learn how to create amazing comics with our step-by-step guides</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li className="text-primary hover:underline cursor-pointer">Getting Started with ComicAI</li>
                    <li className="text-primary hover:underline cursor-pointer">Character Design Tips</li>
                    <li className="text-primary hover:underline cursor-pointer">Crafting Compelling Story Arcs</li>
                    <li className="text-primary hover:underline cursor-pointer">Advanced Panel Layouts</li>
                  </ul>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Templates</CardTitle>
                  <CardDescription>Download ready-to-use templates for your comics</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li className="text-primary hover:underline cursor-pointer">3-Panel Comic Template</li>
                    <li className="text-primary hover:underline cursor-pointer">Superhero Story Template</li>
                    <li className="text-primary hover:underline cursor-pointer">Manga-Style Layout Pack</li>
                    <li className="text-primary hover:underline cursor-pointer">Text Bubble Library</li>
                  </ul>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Creator Spotlights</CardTitle>
                  <CardDescription>Interviews and features from top community creators</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li className="text-primary hover:underline cursor-pointer">Interview with MangaMaster</li>
                    <li className="text-primary hover:underline cursor-pointer">How StoryTeller Creates 10 Comics Monthly</li>
                    <li className="text-primary hover:underline cursor-pointer">Behind SciFiWorld's Popular Series</li>
                    <li className="text-primary hover:underline cursor-pointer">From Beginner to Pro: SuperComicFan's Journey</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
        
        <div className="bg-primary/10 rounded-xl p-6 md:p-8 text-center">
          <h2 className="font-bangers text-2xl mb-4">Join Our Discord Community</h2>
          <p className="text-gray-700 max-w-2xl mx-auto mb-6">
            Connect with thousands of comic creators, get real-time feedback, and participate in exclusive events.
            Our Discord server is the place to be for all ComicAI enthusiasts!
          </p>
          <Button className="bg-[#5865F2] hover:bg-opacity-90 text-white">
            Join Discord Server
          </Button>
        </div>
      </div>
    </div>
  );
}
