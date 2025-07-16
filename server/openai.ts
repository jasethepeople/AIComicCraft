import OpenAI from "openai";
import { ComicGenerationRequest, PanelGenerationRequest, AnimeGenerationRequest } from "@shared/schema";

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

/**
 * Generate a complete anime with multiple scenes and frames
 */
export async function generateAnime(
  request: AnimeGenerationRequest
): Promise<{
  description: string;
  coverImage: string;
  frames: Array<{
    imageUrl: string;
    videoUrl?: string;
    animationData?: any;
    duration: number;
    characters: any[];
    dialogues: any[];
    voiceOvers: any[];
    type: string;
  }>;
}> {
  try {
    // Generate anime description and storyboard
    const storyboardPrompt = `Create a detailed anime storyboard based on:
    Title: ${request.title}
    Description: ${request.description || ''}
    Art Style: ${request.artStyle}
    Animation Style: ${request.animationStyle}
    Duration: ${request.duration} seconds
    Characters: ${request.characters.map(c => `${c.name} (${c.description}, voice: ${c.voiceType})`).join(', ')}
    Scenes: ${request.scenes.map((s, i) => `Scene ${i+1}: ${s.description} (${s.duration}s)`).join('; ')}
    Music Style: ${request.musicStyle}
    Story Prompt: ${request.prompt}
    
    Provide a JSON response with:
    {
      "description": "Detailed anime description",
      "coverImagePrompt": "DALL-E prompt for cover image",
      "framePrompts": ["frame1 prompt", "frame2 prompt", ...]
    }`;

    const storyboardResponse = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content: storyboardPrompt }],
      response_format: { type: "json_object" }
    });

    const storyboard = JSON.parse(storyboardResponse.choices[0].message.content || "{}");

    // Generate cover image
    const coverResponse = await openai.images.generate({
      model: "dall-e-3",
      prompt: `${request.artStyle} anime style cover art: ${storyboard.coverImagePrompt}`,
      n: 1,
      size: "1024x1024",
      quality: "standard",
    });

    // Generate frames for each scene
    const frames = [];
    let frameIndex = 0;

    for (const scene of request.scenes) {
      const framesPerSecond = request.frameRate / request.frameRate; // Simplified for now
      const sceneFrames = Math.ceil(scene.duration * framesPerSecond);

      for (let i = 0; i < sceneFrames; i++) {
        const framePrompt = `${request.artStyle} ${request.animationStyle} anime frame: ${scene.description}. Frame ${i+1} of ${sceneFrames} for this scene.`;
        
        const frameResponse = await openai.images.generate({
          model: "dall-e-3",
          prompt: framePrompt,
          n: 1,
          size: "1024x1024",
          quality: "standard",
        });

        frames.push({
          imageUrl: frameResponse.data[0].url,
          videoUrl: undefined, // Could be enhanced with video generation
          animationData: {
            sceneIndex: request.scenes.indexOf(scene),
            frameInScene: i,
            totalFramesInScene: sceneFrames,
            cameraMovement: scene.cameraMovement,
            effects: scene.effects || []
          },
          duration: (scene.duration / sceneFrames) * 1000, // Convert to milliseconds
          characters: request.characters,
          dialogues: scene.dialogues || [],
          voiceOvers: [], // Could be enhanced with voice generation
          type: i === 0 ? "scene_start" : i === sceneFrames - 1 ? "scene_end" : "animated"
        });

        frameIndex++;
      }
    }

    return {
      description: storyboard.description,
      coverImage: coverResponse.data[0].url,
      frames
    };
  } catch (error) {
    console.error("Error generating anime:", error);
    throw new Error(`Failed to generate anime: ${(error as Error).message}`);
  }
}

/**
 * Generate a single anime frame
 */
export async function generateAnimeFrame(
  frameRequest: any
): Promise<{
  imageUrl: string;
  videoUrl?: string;
  animationData?: any;
  voiceOvers?: any[];
}> {
  try {
    const prompt = `${frameRequest.artStyle} ${frameRequest.animationStyle} anime frame: ${frameRequest.description}. 
    Characters: ${frameRequest.characters.map((c: any) => `${c.name} (${c.description})`).join(', ')}.
    Type: ${frameRequest.frameType}`;

    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt,
      n: 1,
      size: "1024x1024",
      quality: "standard",
    });

    return {
      imageUrl: response.data[0].url,
      videoUrl: undefined, // Could be enhanced with video generation
      animationData: {
        frameType: frameRequest.frameType,
        duration: frameRequest.duration
      },
      voiceOvers: [] // Could be enhanced with voice generation
    };
  } catch (error) {
    console.error("Error generating anime frame:", error);
    throw new Error(`Failed to generate anime frame: ${(error as Error).message}`);
  }
}

export default {
  generateComicPanel,
  generateStoryOutline,
  generateCharacterDetails,
  generateAnime,
  generateAnimeFrame
};
