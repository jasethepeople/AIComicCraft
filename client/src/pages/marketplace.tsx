import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Helmet } from "react-helmet";
import { Comic } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ComicCard from "@/components/comic-card";
import { Search, Filter } from "lucide-react";

export default function Marketplace() {
  const [filter, setFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  
  // Fetch all published comics
  const { data: comics = [], isLoading } = useQuery<Comic[]>({
    queryKey: ["/api/comics"],
  });
  
  // Apply filters and search
  const filteredComics = comics.filter(comic => {
    // Filter by category if not "all"
    if (filter !== "all") {
      if (filter === "trending" && !comic.isForSale) return false;
      if (filter === "new" && new Date(comic.createdAt).getTime() < Date.now() - 7 * 24 * 60 * 60 * 1000) return false;
    }
    
    // Apply search query if present
    if (searchQuery) {
      return comic.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        (comic.description && comic.description.toLowerCase().includes(searchQuery.toLowerCase()));
    }
    
    return true;
  });

  return (
    <div className="bg-white py-8">
      <Helmet>
        <title>Marketplace | ComicAI - Browse and Buy Comics</title>
        <meta name="description" content="Explore our marketplace of AI-generated comics. Find unique stories and purchase digital comics created by our community." />
      </Helmet>

      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="font-bangers text-dark text-4xl md:text-5xl mb-4">
            Comic <span className="text-primary">Marketplace</span>
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Discover and purchase amazing comics created by our community. From fantasy adventures to sci-fi epics, find your next favorite read.
          </p>
        </div>

        <div className="mb-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <Tabs defaultValue="all" onValueChange={setFilter}>
            <TabsList>
              <TabsTrigger value="all">All Comics</TabsTrigger>
              <TabsTrigger value="trending">Trending</TabsTrigger>
              <TabsTrigger value="new">New Releases</TabsTrigger>
              <TabsTrigger value="nft">NFT Editions</TabsTrigger>
            </TabsList>
          </Tabs>
          
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <Input 
              type="text" 
              placeholder="Search comics..." 
              className="pl-10 pr-4 py-2 w-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {isLoading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="animate-pulse bg-white rounded-xl overflow-hidden shadow-lg border border-gray-100 h-96">
                <div className="w-full h-64 bg-gray-200"></div>
                <div className="p-5">
                  <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
                  <div className="h-4 bg-gray-100 rounded w-full mb-4"></div>
                  <div className="h-4 bg-gray-100 rounded w-2/3 mb-4"></div>
                  <div className="flex justify-between items-center">
                    <div className="h-6 bg-gray-200 rounded w-1/4"></div>
                    <div className="h-8 bg-gray-200 rounded w-1/4"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredComics.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredComics.map((comic) => (
              <ComicCard key={comic.id} comic={comic} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
              <Filter className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">No comics found</h3>
            <p className="text-gray-600 mb-6">
              {searchQuery 
                ? `No comics matching "${searchQuery}" were found.` 
                : "No comics matching your selected filters were found."}
            </p>
            <Button onClick={() => {setFilter("all"); setSearchQuery("")}}>
              Clear filters
            </Button>
          </div>
        )}
        
        <div className="text-center mt-16">
          <h2 className="font-bangers text-dark text-2xl md:text-3xl mb-6">
            Ready to Create Your Own Comic?
          </h2>
          <Link href="/creator-studio">
            <Button className="bg-primary hover:bg-opacity-90 text-white font-bold px-6 py-3 rounded-lg text-lg">
              Start Creating Now
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
