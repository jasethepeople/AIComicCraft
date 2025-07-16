import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { Comic } from "@shared/schema";
import { Search } from "lucide-react";

export default function MarketplaceSection() {
  const [filter, setFilter] = useState("all");
  const { data: comics, isLoading } = useQuery<Comic[]>({
    queryKey: ["/api/comics"],
  });

  const filteredComics = comics?.slice(0, 3) || [];

  const renderPlaceholders = () => {
    return Array(3)
      .fill(0)
      .map((_, i) => (
        <div key={i} className="animate-pulse bg-white rounded-xl overflow-hidden shadow-lg border border-gray-100">
          <div className="w-full h-64 bg-gray-200"></div>
          <div className="p-5">
            <div className="flex justify-between items-start mb-3">
              <div className="h-6 bg-gray-200 rounded w-2/3"></div>
              <div className="h-5 w-12 bg-gray-200 rounded-full"></div>
            </div>
            <div className="h-4 bg-gray-100 rounded w-full mb-4"></div>
            <div className="h-4 bg-gray-100 rounded w-3/4 mb-4"></div>
            <div className="flex justify-between items-center">
              <div className="h-6 bg-gray-200 rounded w-24"></div>
              <div className="h-8 bg-gray-200 rounded w-20"></div>
            </div>
          </div>
        </div>
      ));
  };

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="font-bangers text-dark text-3xl md:text-4xl text-center mb-4">
          Sell In Our <span className="text-primary">Marketplace</span>
        </h2>
        <p className="text-gray-600 text-center max-w-2xl mx-auto mb-12">
          Share your stories with the world and earn money from your creative work.
        </p>
        
        <div className="mb-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex flex-wrap gap-2">
            <Button 
              variant={filter === "all" ? "default" : "outline"}
              className={filter === "all" ? "bg-primary text-white" : "bg-gray-100 hover:bg-gray-200 text-dark"}
              onClick={() => setFilter("all")}
            >
              All
            </Button>
            <Button 
              variant={filter === "trending" ? "default" : "outline"}
              className={filter === "trending" ? "bg-primary text-white" : "bg-gray-100 hover:bg-gray-200 text-dark"}
              onClick={() => setFilter("trending")}
            >
              Trending
            </Button>
            <Button 
              variant={filter === "new" ? "default" : "outline"}
              className={filter === "new" ? "bg-primary text-white" : "bg-gray-100 hover:bg-gray-200 text-dark"}
              onClick={() => setFilter("new")}
            >
              New Releases
            </Button>
            <Button 
              variant={filter === "nft" ? "default" : "outline"}
              className={filter === "nft" ? "bg-primary text-white" : "bg-gray-100 hover:bg-gray-200 text-dark"}
              onClick={() => setFilter("nft")}
            >
              NFT Editions
            </Button>
          </div>
          <div className="hidden md:block relative w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search comics..." 
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg" 
            />
          </div>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading
            ? renderPlaceholders()
            : filteredComics.length > 0
            ? filteredComics.map((comic) => (
                <div key={comic.id} className="comic-panel bg-white rounded-xl overflow-hidden shadow-lg border border-gray-100">
                  <img 
                    src={comic.coverImage || "https://images.unsplash.com/photo-1560942485-b2a11cc13456?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400"} 
                    alt={comic.title} 
                    className="w-full h-64 object-cover" 
                  />
                  <div className="p-5">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="font-bangers text-xl text-dark">{comic.title}</h3>
                      <span className="bg-secondary text-white text-xs px-2 py-1 rounded-full">NEW</span>
                    </div>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {comic.description || "No description available."}
                    </p>
                    <div className="flex justify-between items-center">
                      <div>
                        <span className="font-bold text-dark">{comic.price || "$4.99"}</span>
                        <span className="text-gray-500 text-sm ml-1">or 0.002 ETH</span>
                      </div>
                      <Link href={`/preview-comic/${comic.id}`}>
                        <Button size="sm" className="bg-primary hover:bg-opacity-90 text-white">
                          Preview
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              ))
            : [
                {
                  id: 1,
                  title: "Dragon's Twilight",
                  description: "An epic fantasy tale of dragons and heroes in a world on the brink of darkness.",
                  price: "$4.99",
                  image: "https://images.unsplash.com/photo-1560942485-b2a11cc13456?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400",
                  badge: "NEW"
                },
                {
                  id: 2,
                  title: "Neon Horizons",
                  description: "A cyberpunk adventure through the neon-lit streets of Neo Tokyo in 2089.",
                  price: "$3.99",
                  image: "https://pixabay.com/get/gd38bd8a906588c01516e5577c17986a84c35d918464e791de1d5f4567c838b2922137a09291f7ec7fa9f1c3564c1f1b7ed3a6f047d6c93c20a1f2a4be51fbdbe_1280.jpg",
                  badge: "TRENDING"
                },
                {
                  id: 3,
                  title: "Midnight Detective",
                  description: "Follow Detective Morgan through the rain-soaked streets as he solves the city's darkest mysteries.",
                  price: "$5.99",
                  image: "https://images.unsplash.com/photo-1555661059-7e755c1c3c1d?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400",
                  badge: "NFT"
                }
              ].map((comic) => (
                <div key={comic.id} className="comic-panel bg-white rounded-xl overflow-hidden shadow-lg border border-gray-100">
                  <img 
                    src={comic.image} 
                    alt={comic.title} 
                    className="w-full h-64 object-cover" 
                  />
                  <div className="p-5">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="font-bangers text-xl text-dark">{comic.title}</h3>
                      <span className={`bg-${comic.badge === "TRENDING" ? "accent" : comic.badge === "NFT" ? "gray-200 text-gray-700" : "secondary"} text-white text-xs px-2 py-1 rounded-full`}>
                        {comic.badge}
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">{comic.description}</p>
                    <div className="flex justify-between items-center">
                      <div>
                        <span className="font-bold text-dark">{comic.price}</span>
                        <span className="text-gray-500 text-sm ml-1">or 0.002 ETH</span>
                      </div>
                      <Button size="sm" className="bg-primary hover:bg-opacity-90 text-white">
                        Preview
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
        </div>
        
        <div className="text-center mt-10">
          <Link href="/marketplace">
            <Button className="bg-dark hover:bg-opacity-80 text-white font-bold px-6 py-3 rounded-lg inline-flex items-center">
              Explore All Comics
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-2 w-5 h-5">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
