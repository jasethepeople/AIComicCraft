import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import ToolsSidebar from "./tools-sidebar";
import CanvasArea from "./canvas-area";
import EditorControls from "./editor-controls";
import LoadingOverlay from "./loading-overlay";
import { apiRequest } from "@/lib/queryClient";
import { Comic, Panel } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import { EditorState } from "@/types/comic";

interface ComicEditorProps {
  comicId?: number;
}

export default function ComicEditor({ comicId }: ComicEditorProps) {
  const [location, setLocation] = useLocation();
  const { toast } = useToast();
  
  // Initial editor state
  const [editorState, setEditorState] = useState<EditorState>({
    currentComic: null,
    selectedPanel: null,
    selectedTool: 'panels',
    characters: [],
    isGenerating: false,
    generationProgress: 0,
    artStyle: 'Superhero',
    unsavedChanges: false
  });

  // Fetch comic data if comicId is provided
  const { data: comicData, isLoading: isLoadingComic } = useQuery<{comic: Comic, panels: Panel[]}>({
    queryKey: comicId ? [`/api/comics/${comicId}`] : null,
    enabled: !!comicId
  });

  // Update editor state when comic data is loaded
  useEffect(() => {
    if (comicData) {
      setEditorState(prev => ({
        ...prev,
        currentComic: {
          ...comicData.comic,
          panels: comicData.panels || []
        },
        artStyle: comicData.comic.artStyle
      }));
    }
  }, [comicData]);

  // Handle tool selection
  const handleToolSelect = (tool: string) => {
    setEditorState(prev => ({
      ...prev,
      selectedTool: tool
    }));
  };
  
  // Handle art style change
  const handleArtStyleChange = (style: string) => {
    setEditorState(prev => ({
      ...prev,
      artStyle: style,
      unsavedChanges: true
    }));
  };

  // Handle panel selection
  const handlePanelSelect = (panelIndex: number | null) => {
    setEditorState(prev => ({
      ...prev,
      selectedPanel: panelIndex
    }));
  };

  // Save comic changes
  const handleSave = async () => {
    if (!editorState.currentComic) return;
    
    try {
      setEditorState(prev => ({ ...prev, isGenerating: true }));
      
      // Update comic details
      await apiRequest("PUT", `/api/comics/${editorState.currentComic.id}`, {
        title: editorState.currentComic.title,
        description: editorState.currentComic.description,
        artStyle: editorState.artStyle
      });
      
      // Update all panels - in a real implementation you would only update changed panels
      if (editorState.currentComic.panels.length > 0) {
        for (const panel of editorState.currentComic.panels) {
          await apiRequest("PUT", `/api/panels/${panel.id}`, panel);
        }
      }
      
      setEditorState(prev => ({ 
        ...prev, 
        isGenerating: false,
        unsavedChanges: false
      }));
      
      toast({
        title: "Success",
        description: "Comic saved successfully",
        variant: "default",
      });
    } catch (error) {
      setEditorState(prev => ({ ...prev, isGenerating: false }));
      
      toast({
        title: "Error",
        description: "Failed to save comic",
        variant: "destructive",
      });
    }
  };

  // Preview comic
  const handlePreview = () => {
    if (editorState.currentComic) {
      setLocation(`/preview-comic/${editorState.currentComic.id}`);
    }
  };

  // Export comic
  const handleExport = () => {
    toast({
      title: "Export",
      description: "Export functionality will be available in the full version",
      variant: "default",
    });
  };

  // Publish comic to marketplace
  const handlePublish = async () => {
    if (!editorState.currentComic) return;
    
    try {
      setEditorState(prev => ({ ...prev, isGenerating: true }));
      
      await apiRequest("PUT", `/api/comics/${editorState.currentComic.id}`, {
        isPublished: true,
        isForSale: true
      });
      
      setEditorState(prev => ({ 
        ...prev, 
        isGenerating: false,
        currentComic: prev.currentComic ? {
          ...prev.currentComic,
          isPublished: true,
          isForSale: true
        } : null
      }));
      
      toast({
        title: "Success",
        description: "Comic published to marketplace",
        variant: "default",
      });
    } catch (error) {
      setEditorState(prev => ({ ...prev, isGenerating: false }));
      
      toast({
        title: "Error",
        description: "Failed to publish comic",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="bg-dark rounded-xl p-4 md:p-6 shadow-xl">
      <div className="flex flex-col md:flex-row h-[600px]">
        {/* Tools Sidebar */}
        <ToolsSidebar 
          selectedTool={editorState.selectedTool}
          onToolSelect={handleToolSelect}
          artStyle={editorState.artStyle}
          onArtStyleChange={handleArtStyleChange}
          onGeneratePanels={() => {
            // This would typically trigger panel generation
            toast({
              title: "Generate Panels",
              description: "Panel generation will be available in the full version",
              variant: "default",
            });
          }}
        />
        
        {/* Main Editor Area */}
        <div className="bg-gray-100 flex-1 rounded-lg ml-0 md:ml-4 mt-4 md:mt-0 overflow-hidden relative">
          <CanvasArea 
            comic={editorState.currentComic}
            selectedPanel={editorState.selectedPanel}
            onPanelSelect={handlePanelSelect}
          />
          
          {/* Show loading overlay when generating */}
          {editorState.isGenerating && (
            <LoadingOverlay 
              progress={editorState.generationProgress} 
              message="We're creating consistent characters and vibrant panels based on your story input..."
            />
          )}
        </div>
      </div>
      
      {/* Editor Controls */}
      <EditorControls 
        onSave={handleSave}
        onPreview={handlePreview}
        onExport={handleExport}
        onPublish={handlePublish}
        hasUnsavedChanges={editorState.unsavedChanges}
      />
    </div>
  );
}
