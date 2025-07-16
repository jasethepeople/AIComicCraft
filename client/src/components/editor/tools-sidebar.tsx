import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  LayoutGrid, 
  UserPlus, 
  MessageSquare, 
  Mountain, 
  Sparkles, 
  Type,
  Palette
} from "lucide-react";

interface ToolsSidebarProps {
  selectedTool: string;
  onToolSelect: (tool: string) => void;
  artStyle: string;
  onArtStyleChange: (style: string) => void;
  onGeneratePanels: () => void;
}

export default function ToolsSidebar({
  selectedTool,
  onToolSelect,
  artStyle,
  onArtStyleChange,
  onGeneratePanels
}: ToolsSidebarProps) {
  const tools = [
    { id: 'panels', icon: <LayoutGrid className="text-xl mb-1" />, label: 'Panels' },
    { id: 'characters', icon: <UserPlus className="text-xl mb-1" />, label: 'Characters' },
    { id: 'dialogue', icon: <MessageSquare className="text-xl mb-1" />, label: 'Dialogue' },
    { id: 'backgrounds', icon: <Mountain className="text-xl mb-1" />, label: 'Backgrounds' },
    { id: 'effects', icon: <Sparkles className="text-xl mb-1" />, label: 'Effects' },
    { id: 'text', icon: <Type className="text-xl mb-1" />, label: 'Text' }
  ];

  const artStyles = [
    { id: 'Superhero', label: 'Superhero' },
    { id: 'Manga', label: 'Manga' },
    { id: 'European', label: 'European' },
    { id: 'Indie', label: 'Indie' }
  ];

  return (
    <div className="bg-gray-800 rounded-lg w-full md:w-64 p-4 flex flex-col">
      <div className="mb-6">
        <h3 className="text-white font-bold mb-3 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="mr-2" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg> 
          Tools
        </h3>
        <div className="grid grid-cols-3 gap-2">
          {tools.map(tool => (
            <button
              key={tool.id}
              className={`tool-button ${selectedTool === tool.id ? 'bg-primary' : 'bg-gray-700 hover:bg-gray-600'} rounded-lg p-3 flex flex-col items-center justify-center text-white`}
              onClick={() => onToolSelect(tool.id)}
            >
              {tool.icon}
              <span className="text-xs">{tool.label}</span>
            </button>
          ))}
        </div>
      </div>
      
      <div className="mb-6">
        <h3 className="text-white font-bold mb-3 flex items-center">
          <Palette className="mr-2 h-4 w-4" /> Art Styles
        </h3>
        <div className="space-y-2">
          {artStyles.map(style => (
            <button
              key={style.id}
              className={`w-full ${artStyle === style.id ? 'bg-primary' : 'bg-gray-700 hover:bg-gray-600'} text-white rounded-lg py-2 px-3 text-sm font-medium text-left flex items-center`}
              onClick={() => onArtStyleChange(style.id)}
            >
              <span className={`w-3 h-3 rounded-full ${artStyle === style.id ? 'bg-white' : 'bg-gray-500'} mr-2`}></span>
              {style.label}
            </button>
          ))}
        </div>
      </div>
      
      <div className="mb-6">
        <h3 className="text-white font-bold mb-3 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="mr-2" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path><path d="M3 3v5h5"></path><path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16"></path><path d="M16 16h5v5"></path></svg>
          AI Assistance
        </h3>
        <div className="bg-gray-700 rounded-lg p-3">
          <div className="mb-3">
            <label className="text-gray-300 text-xs block mb-1">Character Consistency</label>
            <Progress value={80} className="w-full bg-gray-600 h-2">
              <div className="bg-success rounded-full h-2 w-4/5"></div>
            </Progress>
          </div>
          <div className="mb-3">
            <label className="text-gray-300 text-xs block mb-1">Plot Coherence</label>
            <Progress value={60} className="w-full bg-gray-600 h-2">
              <div className="bg-success rounded-full h-2 w-3/5"></div>
            </Progress>
          </div>
          <Button variant="secondary" className="w-full bg-secondary hover:bg-opacity-90 text-white rounded-lg py-2 text-sm font-medium">
            Get AI Suggestions
          </Button>
        </div>
      </div>
      
      <div className="mt-auto">
        <Button 
          onClick={onGeneratePanels}
          className="w-full bg-accent hover:bg-opacity-90 text-white rounded-lg py-3 font-bold"
        >
          Generate Panels
        </Button>
      </div>
    </div>
  );
}
