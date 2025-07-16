import { Link } from "wouter";
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { ArtStyle } from "@shared/schema";
import { Plus } from "lucide-react";

export default function ArtStylesSection() {
  const { data: artStyles, isLoading } = useQuery<ArtStyle[]>({
    queryKey: ["/api/art-styles"],
  });

  const [styles, setStyles] = useState<ArtStyle[]>([]);

  useEffect(() => {
    if (artStyles) {
      setStyles(artStyles);
    }
  }, [artStyles]);

  if (isLoading) {
    return (
      <section className="py-16 bg-light">
        <div className="container mx-auto px-4">
          <h2 className="font-bangers text-dark text-3xl md:text-4xl text-center mb-4">
            Choose Your <span className="text-secondary">Art Style</span>
          </h2>
          <p className="text-gray-600 text-center max-w-2xl mx-auto mb-12">
            Select from dozens of pre-built art styles or create a custom look for your comic.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {Array(7).fill(0).map((_, i) => (
              <div key={i} className="bg-white rounded-lg overflow-hidden animate-pulse">
                <div className="w-full h-48 bg-gray-200"></div>
                <div className="p-4">
                  <div className="h-5 bg-gray-200 rounded mb-2 w-1/2"></div>
                  <div className="h-4 bg-gray-100 rounded w-3/4"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-light">
      <div className="container mx-auto px-4">
        <h2 className="font-bangers text-dark text-3xl md:text-4xl text-center mb-4">
          Choose Your <span className="text-secondary">Art Style</span>
        </h2>
        <p className="text-gray-600 text-center max-w-2xl mx-auto mb-12">
          Select from dozens of pre-built art styles or create a custom look for your comic.
        </p>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {styles.map((style) => (
            <div key={style.id} className="comic-panel bg-white rounded-lg overflow-hidden hover:shadow-xl transition-all">
              <img 
                src={style.thumbnailUrl} 
                alt={`${style.name} comic style`} 
                className="w-full h-48 object-cover" 
              />
              <div className="p-4">
                <h3 className="font-comic font-bold text-dark">{style.name}</h3>
                <p className="text-gray-600 text-sm">{style.description}</p>
              </div>
            </div>
          ))}
          
          {/* Custom Style */}
          <Link href="/creator-studio">
            <a className="comic-panel bg-white rounded-lg overflow-hidden border-2 border-dashed border-primary flex flex-col items-center justify-center h-full cursor-pointer hover:bg-primary/5 transition-colors">
              <div className="p-6 text-center">
                <div className="w-16 h-16 bg-primary bg-opacity-10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Plus className="text-3xl text-primary" />
                </div>
                <h3 className="font-comic font-bold text-dark mb-1">Custom Style</h3>
                <p className="text-gray-600 text-sm">Create your own unique look</p>
              </div>
            </a>
          </Link>
        </div>
      </div>
    </section>
  );
}
