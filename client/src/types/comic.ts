import { Comic, Panel, ArtStyle } from "@shared/schema";

// Extended types for frontend use
export interface ComicWithPanels extends Comic {
  panels: Panel[];
}

export interface ArtStyleOption extends ArtStyle {
  selected?: boolean;
}

export interface ComicCharacter {
  id: string;
  name: string;
  description: string;
  imageUrl?: string;
}

export interface ComicDialogue {
  id: string;
  characterId: string;
  text: string;
  position: {
    x: number;
    y: number;
  };
}

export interface ComicPanelLayout {
  id: string;
  name: string;
  columns: number;
  rows: number;
  thumbnailUrl?: string;
}

export interface DraggableItem {
  id: string;
  type: 'character' | 'dialogue' | 'effect' | 'background';
  content: any;
}

export interface EditorState {
  currentComic: ComicWithPanels | null;
  selectedPanel: number | null;
  selectedTool: string | null;
  characters: ComicCharacter[];
  isGenerating: boolean;
  generationProgress: number;
  artStyle: string;
  unsavedChanges: boolean;
}

export interface GenerationRequest {
  title: string;
  description?: string;
  artStyle: string;
  characters: {
    name: string;
    description: string;
  }[];
  panelCount: number;
  prompt: string;
}

export interface GenerationResponse {
  comicId: number;
  title: string;
  panels: {
    id: number;
    sequence: number;
    imageUrl: string;
    characters: any[];
    dialogues: any[];
  }[];
}
