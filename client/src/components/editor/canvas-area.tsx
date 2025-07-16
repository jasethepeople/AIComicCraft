import { ComicWithPanels } from "@/types/comic";

interface CanvasAreaProps {
  comic: ComicWithPanels | null;
  selectedPanel: number | null;
  onPanelSelect: (panelIndex: number | null) => void;
}

export default function CanvasArea({ comic, selectedPanel, onPanelSelect }: CanvasAreaProps) {
  // If we don't have a comic yet, show a placeholder
  if (!comic || comic.panels.length === 0) {
    return (
      <div className="w-full h-full bg-white flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="mx-auto h-16 w-16 text-gray-400 mb-4" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h10a2 2 0 012 2v14a2 2 0 01-2 2z" 
            />
          </svg>
          <h3 className="text-xl font-bold text-gray-800 mb-2">Start Creating Your Comic</h3>
          <p className="text-gray-600 mb-4">
            Generate your first panels by describing your story and characters, then choosing an art style.
          </p>
          <div className="border-t border-gray-200 pt-4 mt-4">
            <p className="text-sm text-gray-500">
              Tip: The more detailed your story description, the better the AI can generate coherent panels.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Display the comic panels in a grid
  return (
    <div className="w-full h-full bg-white p-4 overflow-auto">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {comic.panels.map((panel, index) => (
          <div 
            key={panel.id}
            className={`
              relative rounded-lg overflow-hidden border-2 cursor-pointer
              ${selectedPanel === index ? 'border-primary' : 'border-transparent'}
              transition-all hover:shadow-lg
            `}
            onClick={() => onPanelSelect(index)}
          >
            {panel.imageUrl ? (
              <img 
                src={panel.imageUrl} 
                alt={`Panel ${index + 1}`} 
                className="w-full h-auto object-cover"
              />
            ) : (
              <div className="bg-gray-100 w-full h-32 flex items-center justify-center">
                <p className="text-gray-500 text-sm">Panel {index + 1}</p>
              </div>
            )}
            
            <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs py-1 px-2">
              Panel {index + 1}
            </div>
          </div>
        ))}
      </div>
      
      {selectedPanel !== null && comic.panels[selectedPanel] && (
        <div className="mt-6 bg-gray-50 p-4 rounded-lg">
          <h4 className="font-bold text-sm text-gray-700 mb-2">Panel {selectedPanel + 1} Details</h4>
          
          {comic.panels[selectedPanel].characters && comic.panels[selectedPanel].characters.length > 0 && (
            <div className="mb-3">
              <p className="text-xs text-gray-500 mb-1">Characters:</p>
              <div className="flex flex-wrap gap-1">
                {(comic.panels[selectedPanel].characters as any[]).map((char, i) => (
                  <span key={i} className="text-xs bg-gray-200 px-2 py-1 rounded-full">
                    {char.name}
                  </span>
                ))}
              </div>
            </div>
          )}
          
          {comic.panels[selectedPanel].dialogues && comic.panels[selectedPanel].dialogues.length > 0 && (
            <div>
              <p className="text-xs text-gray-500 mb-1">Dialogues:</p>
              <div className="space-y-1">
                {(comic.panels[selectedPanel].dialogues as any[]).map((dialogue, i) => (
                  <div key={i} className="text-xs bg-white p-2 rounded border border-gray-200">
                    <span className="font-bold">{dialogue.character}:</span> {dialogue.text}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
