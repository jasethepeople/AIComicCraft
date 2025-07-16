import OpenAI from "openai";
import { ComicGenerationRequest, PanelGenerationRequest } from "@shared/schema";

// Initialize OpenAI with API key from environment variables
const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY || "" 
});

/**
 * Generate a comic panel image based on the given parameters
 */
export async function generateComicPanel(
  panelRequest: PanelGenerationRequest
): Promise<string> {
  try {
    // Construct a detailed prompt for DALL-E
    let prompt = `Create a comic panel with ${panelRequest.layout} layout. `;
    
    // Add characters to the prompt
    if (panelRequest.characters && panelRequest.characters.length > 0) {
      prompt += "Characters: ";
      panelRequest.characters.forEach((char, index) => {
        prompt += `${char.name} (${char.description})${index < panelRequest.characters.length - 1 ? ', ' : '. '}`;
      });
    }
    
    // Add dialogues if any
    if (panelRequest.dialogues && panelRequest.dialogues.length > 0) {
      prompt += "Dialogues: ";
      panelRequest.dialogues.forEach((dialogue, index) => {
        prompt += `${dialogue.character} says "${dialogue.text}"${index < panelRequest.dialogues.length - 1 ? ', ' : '. '}`;
      });
    }
    
    // Add the panel description
    prompt += `Scene description: ${panelRequest.description}`;
    
    // Generate the image
    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt,
      n: 1,
      size: "1024x1024",
      quality: "standard",
    });

    return response.data[0].url;
  } catch (error) {
    console.error("Error generating comic panel:", error);
    throw new Error(`Failed to generate comic panel: ${(error as Error).message}`);
  }
}

/**
 * Generate a story outline based on user input
 */
export async function generateStoryOutline(
  request: ComicGenerationRequest
): Promise<{ outline: string, scenes: Array<{ description: string, dialogues?: Array<{ character: string, text: string }> }> }> {
  try {
    const systemPrompt = `You are an expert comic book writer and artist. Create a detailed comic story outline based on the user's input. 
    Structure your response as a JSON object with two keys: 
    1. "outline" - A summary of the overall story
    2. "scenes" - An array of ${request.panelCount} scenes, each with a "description" field and optional "dialogues" array (each dialogue has "character" and "text" fields).
    Ensure consistency in characters and story progression across scenes.`;

    const userPrompt = `Title: ${request.title}
    ${request.description ? `Description: ${request.description}` : ''}
    Art Style: ${request.artStyle}
    Characters: ${request.characters.map(c => `${c.name} (${c.description})`).join(', ')}
    Story Prompt: ${request.prompt}
    
    Please generate a comic story outline with ${request.panelCount} scenes in the style specified.`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      response_format: { type: "json_object" }
    });

    const content = response.choices[0].message.content;
    return JSON.parse(content || "{}");
  } catch (error) {
    console.error("Error generating story outline:", error);
    throw new Error(`Failed to generate story outline: ${(error as Error).message}`);
  }
}

/**
 * Generate character descriptions and traits
 */
export async function generateCharacterDetails(
  name: string, 
  basicDescription: string
): Promise<{ 
  fullDescription: string, 
  traits: string[], 
  background: string 
}> {
  try {
    const prompt = `Create detailed character information for a comic book character with the following basic info:
    Name: ${name}
    Basic Description: ${basicDescription}
    
    Please provide a detailed JSON response with the following structure:
    {
      "fullDescription": "A paragraph with physical appearance details",
      "traits": ["trait1", "trait2", "trait3"],
      "background": "A paragraph with the character's backstory"
    }`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" }
    });

    const content = response.choices[0].message.content;
    return JSON.parse(content || "{}");
  } catch (error) {
    console.error("Error generating character details:", error);
    throw new Error(`Failed to generate character details: ${(error as Error).message}`);
  }
}

export default {
  generateComicPanel,
  generateStoryOutline,
  generateCharacterDetails
};
