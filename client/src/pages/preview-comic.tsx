import { useState } from "react";
import { useParams, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Helmet } from "react-helmet";
import { Comic, Panel } from "@shared/schema";
import { Button } from "@/components/ui/button";
import TextToSpeech from "@/components/text-to-speech";
import {
  ChevronLeft,
  ChevronRight,
  Download,
  Edit,
  ShoppingCart,
  Share2,
  Volume2,
} from "lucide-react";

export default function PreviewComic() {
  const { id } = useParams<{ id: string }>();
  const [location, setLocation] = useLocation();
  const [currentPage, setCurrentPage] = useState(0);

  // Fetch comic data
  const { data, isLoading, isError } = useQuery<{comic: Comic, panels: Panel[]}>({
    queryKey: [`/api/comics/${id}`],
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4">
        <h1 className="font-bangers text-3xl text-gray-800 mb-4">Comic Not Found</h1>
        <p className="text-gray-600 mb-6 text-center max-w-md">
          The comic you're looking for doesn't exist or has been removed.
        </p>
        <Button onClick={() => setLocation("/marketplace")}>
          Return to Marketplace
        </Button>
      </div>
    );
  }

  const { comic, panels } = data;
  const totalPages = panels.length;

  const goToNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages - 1));
  };

  const goToPrevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 0));
  };

  const currentPanel = panels[currentPage];

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <Helmet>
        <title>{comic.title} | ComicAI Preview</title>
        <meta name="description" content={comic.description || `Preview ${comic.title}, an AI-generated comic.`} />
      </Helmet>

      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div>
            <h1 className="font-bangers text-3xl md:text-4xl text-dark">{comic.title}</h1>
            {comic.description && (
              <p className="text-gray-600 mt-2 max-w-2xl">{comic.description}</p>
            )}
          </div>
          
          <div className="flex gap-2">
            <Button 
              variant="outline"
              onClick={() => setLocation(`/creator-studio/${id}`)}
              className="flex items-center"
            >
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </Button>
            
            <Button 
              variant="default"
              className="bg-primary text-white flex items-center"
            >
              <ShoppingCart className="mr-2 h-4 w-4" />
              {comic.price ? `Buy for ${comic.price}` : "Purchase"}
            </Button>
          </div>
        </div>

        <div className="preview-panel bg-white rounded-xl overflow-hidden mb-6">
          <div className="bg-gray-800 text-white py-2 px-4 flex justify-between items-center">
            <span className="font-comic">
              Page {currentPage + 1} of {totalPages}
            </span>
            <div className="flex gap-2">
              <Button 
                variant="ghost" 
                size="sm"
                className="text-white"
              >
                <Share2 className="h-4 w-4" />
              </Button>
              <Button 
                variant="ghost" 
                size="sm"
                className="text-white"
              >
                <Download className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <div className="relative aspect-[3/4] max-h-[70vh] w-full">
            {currentPanel && currentPanel.imageUrl ? (
              <img
                src={currentPanel.imageUrl}
                alt={`Panel ${currentPage + 1}`}
                className="w-full h-full object-contain"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-100">
                <p className="text-gray-500">No image available for this panel</p>
              </div>
            )}

            {/* Navigation buttons */}
            <div className="absolute inset-0 flex justify-between items-center pointer-events-none">
              <Button
                variant="ghost"
                className="h-12 w-12 rounded-full bg-black bg-opacity-30 text-white pointer-events-auto"
                onClick={goToPrevPage}
                disabled={currentPage === 0}
              >
                <ChevronLeft className="h-6 w-6" />
              </Button>
              <Button
                variant="ghost"
                className="h-12 w-12 rounded-full bg-black bg-opacity-30 text-white pointer-events-auto"
                onClick={goToNextPage}
                disabled={currentPage === totalPages - 1}
              >
                <ChevronRight className="h-6 w-6" />
              </Button>
            </div>
          </div>
        </div>

        {/* Panel thumbnails */}
        <div className="flex overflow-x-auto gap-2 pb-4">
          {panels.map((panel, index) => (
            <button
              key={panel.id}
              className={`flex-shrink-0 w-24 h-24 rounded-lg overflow-hidden border-2 transition-all duration-300 hover:scale-105 hover:shadow-lg ${
                index === currentPage
                  ? "border-primary shadow-md"
                  : "border-transparent hover:border-primary/50"
              }`}
              onClick={() => setCurrentPage(index)}
            >
              {panel.imageUrl ? (
                <img
                  src={panel.imageUrl}
                  alt={`Thumbnail ${index + 1}`}
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                />
              ) : (
                <div className="w-full h-full bg-gray-200 flex items-center justify-center hover:bg-gray-300 transition-colors duration-300">
                  <span className="text-xs text-gray-500">{index + 1}</span>
                </div>
              )}
            </button>
          ))}
        </div>

        {/* Text-to-Speech for Comic Reading */}
        {currentPanel && (
          <div className="mt-6 space-y-4">
            {/* Panel description TTS */}
            {currentPanel.characters && currentPanel.characters.length > 0 && (
              <div className="bg-white rounded-lg p-4 border border-gray-200">
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <Volume2 className="w-5 h-5 text-primary" />
                  Panel Narration
                </h3>
                <TextToSpeech
                  text={`Panel ${currentPage + 1}. ${currentPanel.characters?.map(char => char.name).join(', ')} appear in this scene.`}
                  title={`Panel ${currentPage + 1} Description`}
                  characterName="Narrator"
                  variant="compact"
                  className="mb-3"
                />
              </div>
            )}

            {/* Character dialogues TTS */}
            {currentPanel.dialogues && currentPanel.dialogues.length > 0 && (
              <div className="bg-white rounded-lg p-4 border border-gray-200">
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <Volume2 className="w-5 h-5 text-primary" />
                  Character Dialogues
                </h3>
                <div className="space-y-3">
                  {currentPanel.dialogues.map((dialogue, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-300">
                      <div className="flex-1">
                        <p className="font-medium text-sm text-primary mb-1">{dialogue.character}</p>
                        <p className="text-gray-700">{dialogue.text}</p>
                      </div>
                      <TextToSpeech
                        text={dialogue.text}
                        characterName={dialogue.character}
                        variant="compact"
                        className="ml-4"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Full comic reading mode */}
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <Volume2 className="w-5 h-5 text-primary" />
                Full Comic Reading
              </h3>
              <TextToSpeech
                text={`${comic.title}. ${comic.description || ''}. ${panels.map((panel, index) => 
                  `Panel ${index + 1}. ${panel.dialogues?.map(d => `${d.character} says: ${d.text}`).join('. ') || 'No dialogue in this panel.'}`
                ).join('. ')}`}
                title={comic.title}
                characterName="Narrator"
                variant="full"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
