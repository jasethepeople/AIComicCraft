import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Play, Pause, Square, Volume2, Settings, RotateCcw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface TextToSpeechProps {
  text: string;
  title?: string;
  characterName?: string;
  variant?: "compact" | "full" | "floating";
  className?: string;
}

interface VoiceSettings {
  voice: SpeechSynthesisVoice | null;
  rate: number;
  pitch: number;
  volume: number;
}

export default function TextToSpeech({ 
  text, 
  title, 
  characterName, 
  variant = "compact",
  className = "" 
}: TextToSpeechProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [settings, setSettings] = useState<VoiceSettings>({
    voice: null,
    rate: 1,
    pitch: 1,
    volume: 0.8
  });
  const [showSettings, setShowSettings] = useState(false);
  const [progress, setProgress] = useState(0);
  const { toast } = useToast();
  
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const progressInterval = useRef<NodeJS.Timeout | null>(null);

  // Load available voices
  useEffect(() => {
    const loadVoices = () => {
      const availableVoices = speechSynthesis.getVoices();
      setVoices(availableVoices);
      
      // Set default voice (prefer English voices)
      if (availableVoices.length > 0 && !settings.voice) {
        const englishVoice = availableVoices.find(voice => 
          voice.lang.startsWith('en') && voice.name.includes('Female')
        ) || availableVoices.find(voice => voice.lang.startsWith('en')) || availableVoices[0];
        
        setSettings(prev => ({ ...prev, voice: englishVoice }));
      }
    };

    loadVoices();
    speechSynthesis.addEventListener('voiceschanged', loadVoices);
    
    return () => {
      speechSynthesis.removeEventListener('voiceschanged', loadVoices);
    };
  }, []);

  // Character voice mapping for immersive experience
  const getCharacterVoice = (character?: string) => {
    if (!character) return settings.voice;
    
    const characterVoices: Record<string, string[]> = {
      hero: ['Microsoft David', 'Google UK English Male', 'Alex'],
      villain: ['Microsoft Zira', 'Google UK English Female', 'Victoria'],
      child: ['Microsoft Anna', 'Google US English', 'Samantha'],
      elderly: ['Microsoft Mark', 'Google US English Male', 'Fred'],
      narrator: ['Microsoft Hazel', 'Google UK English Female', 'Karen']
    };
    
    const characterType = character.toLowerCase();
    const preferredVoices = characterVoices[characterType] || [];
    
    for (const voiceName of preferredVoices) {
      const voice = voices.find(v => v.name.includes(voiceName));
      if (voice) return voice;
    }
    
    return settings.voice;
  };

  const speak = () => {
    if (!text.trim()) {
      toast({
        title: "No Text",
        description: "There's no text to read aloud.",
        variant: "destructive",
      });
      return;
    }

    if (isPaused) {
      speechSynthesis.resume();
      setIsPaused(false);
      setIsPlaying(true);
      return;
    }

    // Create new utterance
    const utterance = new SpeechSynthesisUtterance(text);
    const selectedVoice = getCharacterVoice(characterName) || settings.voice;
    
    if (selectedVoice) utterance.voice = selectedVoice;
    utterance.rate = settings.rate;
    utterance.pitch = settings.pitch;
    utterance.volume = settings.volume;

    // Event handlers
    utterance.onstart = () => {
      setIsPlaying(true);
      setIsPaused(false);
      setProgress(0);
      
      // Simulate progress (since we can't get exact progress from Web Speech API)
      const duration = text.length * 50 / settings.rate; // Rough estimation
      let elapsed = 0;
      
      progressInterval.current = setInterval(() => {
        elapsed += 100;
        setProgress(Math.min((elapsed / duration) * 100, 95));
      }, 100);
    };

    utterance.onend = () => {
      setIsPlaying(false);
      setIsPaused(false);
      setProgress(100);
      if (progressInterval.current) {
        clearInterval(progressInterval.current);
        progressInterval.current = null;
      }
      setTimeout(() => setProgress(0), 1000);
    };

    utterance.onerror = (error) => {
      console.error('Speech synthesis error:', error);
      setIsPlaying(false);
      setIsPaused(false);
      setProgress(0);
      toast({
        title: "Speech Error",
        description: "Failed to play speech. Please try again.",
        variant: "destructive",
      });
    };

    utteranceRef.current = utterance;
    speechSynthesis.speak(utterance);
  };

  const pause = () => {
    speechSynthesis.pause();
    setIsPaused(true);
    setIsPlaying(false);
  };

  const stop = () => {
    speechSynthesis.cancel();
    setIsPlaying(false);
    setIsPaused(false);
    setProgress(0);
    if (progressInterval.current) {
      clearInterval(progressInterval.current);
      progressInterval.current = null;
    }
  };

  const reset = () => {
    stop();
    setSettings({
      voice: voices.find(v => v.lang.startsWith('en')) || voices[0] || null,
      rate: 1,
      pitch: 1,
      volume: 0.8
    });
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      speechSynthesis.cancel();
      if (progressInterval.current) {
        clearInterval(progressInterval.current);
      }
    };
  }, []);

  if (variant === "floating") {
    return (
      <div className={`fixed bottom-4 right-4 z-50 ${className}`}>
        <Card className="w-64 shadow-lg hover:shadow-xl transition-all duration-300">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Volume2 className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium">Audio Player</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowSettings(!showSettings)}
                className="w-6 h-6 p-0"
              >
                <Settings className="w-3 h-3" />
              </Button>
            </div>
            
            {title && (
              <p className="text-xs text-gray-600 mb-2 truncate">{title}</p>
            )}
            
            <div className="flex items-center gap-2 mb-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={isPlaying ? pause : speak}
                className="w-8 h-8 p-0 hover:bg-primary/10"
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={stop}
                disabled={!isPlaying && !isPaused}
                className="w-8 h-8 p-0 hover:bg-destructive/10"
              >
                <Square className="w-4 h-4" />
              </Button>
              
              <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-primary transition-all duration-300 ease-out"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
            
            {characterName && (
              <Badge variant="secondary" className="text-xs">
                {characterName}
              </Badge>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  if (variant === "compact") {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <Button
          variant="ghost"
          size="sm"
          onClick={isPlaying ? pause : speak}
          className="hover:bg-primary/10 hover:scale-105 transition-all duration-300"
        >
          {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
        </Button>
        
        {characterName && (
          <Badge variant="outline" className="text-xs">
            {characterName}
          </Badge>
        )}
        
        {(isPlaying || isPaused) && (
          <div className="flex items-center gap-1">
            <div className="w-16 h-1 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-primary transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={stop}
              className="w-6 h-6 p-0 hover:bg-destructive/10"
            >
              <Square className="w-3 h-3" />
            </Button>
          </div>
        )}
      </div>
    );
  }

  // Full variant
  return (
    <Card className={`${className} hover:shadow-lg transition-all duration-300`}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Volume2 className="w-5 h-5 text-primary" />
            <h3 className="font-semibold">Text to Speech</h3>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowSettings(!showSettings)}
            className="hover:bg-primary/10"
          >
            <Settings className="w-4 h-4" />
          </Button>
        </div>

        {title && (
          <h4 className="font-medium mb-2">{title}</h4>
        )}

        <div className="flex items-center gap-3 mb-4">
          <Button
            onClick={isPlaying ? pause : speak}
            className="hover:scale-105 transition-all duration-300"
          >
            {isPlaying ? <Pause className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
            {isPlaying ? "Pause" : "Play"}
          </Button>
          
          <Button
            variant="outline"
            onClick={stop}
            disabled={!isPlaying && !isPaused}
            className="hover:scale-105 transition-all duration-300"
          >
            <Square className="w-4 h-4 mr-2" />
            Stop
          </Button>
          
          <Button
            variant="ghost"
            onClick={reset}
            className="hover:scale-105 transition-all duration-300"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset
          </Button>
        </div>

        {(isPlaying || isPaused || progress > 0) && (
          <div className="mb-4">
            <div className="flex justify-between text-xs text-gray-500 mb-1">
              <span>Progress</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-primary transition-all duration-300 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        {characterName && (
          <div className="mb-4">
            <Badge variant="secondary">
              Character: {characterName}
            </Badge>
          </div>
        )}

        {showSettings && (
          <div className="space-y-4 pt-4 border-t">
            <div>
              <label className="text-sm font-medium mb-2 block">Voice</label>
              <Select
                value={settings.voice?.name || ""}
                onValueChange={(name) => {
                  const voice = voices.find(v => v.name === name);
                  setSettings(prev => ({ ...prev, voice: voice || null }));
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select voice" />
                </SelectTrigger>
                <SelectContent>
                  {voices.map((voice) => (
                    <SelectItem key={voice.name} value={voice.name}>
                      {voice.name} ({voice.lang})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">
                Speed: {settings.rate}x
              </label>
              <Slider
                value={[settings.rate]}
                onValueChange={([value]) => setSettings(prev => ({ ...prev, rate: value }))}
                min={0.5}
                max={2}
                step={0.1}
                className="w-full"
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">
                Pitch: {settings.pitch}
              </label>
              <Slider
                value={[settings.pitch]}
                onValueChange={([value]) => setSettings(prev => ({ ...prev, pitch: value }))}
                min={0.5}
                max={2}
                step={0.1}
                className="w-full"
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">
                Volume: {Math.round(settings.volume * 100)}%
              </label>
              <Slider
                value={[settings.volume]}
                onValueChange={([value]) => setSettings(prev => ({ ...prev, volume: value }))}
                min={0}
                max={1}
                step={0.1}
                className="w-full"
              />
            </div>
          </div>
        )}

        {text && (
          <div className="mt-4 p-3 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-700 line-clamp-3">{text}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}