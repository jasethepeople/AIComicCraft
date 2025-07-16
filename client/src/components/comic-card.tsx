import { Link } from "wouter";
import { Comic } from "@shared/schema";
import { formatCurrency, truncateText } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface ComicCardProps {
  comic: Comic;
}

export default function ComicCard({ comic }: ComicCardProps) {
  // Determine badge type and text
  const getBadge = () => {
    if (new Date(comic.createdAt).getTime() > Date.now() - 3 * 24 * 60 * 60 * 1000) {
      return { type: "secondary", text: "NEW" };
    }
    if (comic.isForSale) {
      return { type: "accent", text: "TRENDING" };
    }
    return null;
  };

  const badge = getBadge();

  return (
    <div className="comic-panel bg-white rounded-xl overflow-hidden shadow-lg border border-gray-100 card-interactive hover:shadow-2xl hover:border-primary/20 group">
      <div className="relative overflow-hidden">
        <img
          src={
            comic.coverImage ||
            "https://images.unsplash.com/photo-1560942485-b2a11cc13456?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400"
          }
          alt={comic.title}
          className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-110"
        />
        
        {/* Overlay for art style */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent text-white p-2 transition-all duration-300 group-hover:from-black/50">
          <span className="text-xs font-medium">{comic.artStyle} style</span>
        </div>
        
        {/* Hover overlay */}
        <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>
      
      <div className="p-5">
        <div className="flex justify-between items-start mb-3">
          <h3 className="font-bangers text-xl text-dark group-hover:text-primary transition-colors duration-300">{comic.title}</h3>
          {badge && (
            <Badge className={`bg-${badge.type} text-white`}>
              {badge.text}
            </Badge>
          )}
        </div>
        
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {truncateText(comic.description || "No description available.", 80)}
        </p>
        
        <div className="flex justify-between items-center">
          <div>
            {comic.price ? (
              <>
                <span className="font-bold text-dark">
                  {formatCurrency(comic.price)}
                </span>
                <span className="text-gray-500 text-sm ml-1">or 0.002 ETH</span>
              </>
            ) : (
              <span className="text-gray-500">Not for sale</span>
            )}
          </div>
          
          <Link href={`/preview-comic/${comic.id}`}>
            <Button
              size="sm"
              className="bg-primary hover:bg-opacity-90 text-white hover:scale-105 transition-all duration-300"
            >
              Preview
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
