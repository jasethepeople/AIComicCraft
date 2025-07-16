import { apiRequest } from "./queryClient";
import type { 
  ComicGenerationRequest, 
  PanelGenerationRequest 
} from "@shared/schema";

/**
 * Generate a complete comic story based on user input
 */
export async function generateComicStory(request: ComicGenerationRequest) {
  const response = await apiRequest(
    "POST",
    "/api/generate/story",
    request
  );
  
  return response.json();
}

/**
 * Generate a single comic panel based on description
 */
export async function generateComicPanel(request: PanelGenerationRequest) {
  const response = await apiRequest(
    "POST",
    "/api/generate/panel",
    request
  );
  
  return response.json();
}

/**
 * Generate detailed character information
 */
export async function generateCharacterDetails(name: string, description: string) {
  const response = await apiRequest(
    "POST",
    "/api/generate/character",
    { name, description }
  );
  
  return response.json();
}

export default {
  generateComicStory,
  generateComicPanel,
  generateCharacterDetails
};
