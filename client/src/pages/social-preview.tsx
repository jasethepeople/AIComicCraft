import { useState, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { 
  Download, 
  Share2, 
  Instagram, 
  Twitter, 
  Facebook,
  Copy,
  Palette,
  Type,
  Image as ImageIcon,
  Sparkles
} from "lucide-react";
import { motion } from "framer-motion";
import html2canvas from "html2canvas";

type SocialPlatform = {
  id: string;
  name: string;
  icon: React.ReactNode;
  dimensions: { width: number; height: number };
  aspectRatio: string;
};

const SOCIAL_PLATFORMS: SocialPlatform[] = [
  {
    id: "instagram-post",
    name: "Instagram Post",
    icon: <Instagram className="w-4 h-4" />,
    dimensions: { width: 1080, height: 1080 },
    aspectRatio: "1:1"
  },
  {
    id: "instagram-story",
    name: "Instagram Story",
    icon: <Instagram className="w-4 h-4" />,
    dimensions: { width: 1080, height: 1920 },
    aspectRatio: "9:16"
  },
  {
    id: "twitter-post",
    name: "Twitter Post",
    icon: <Twitter className="w-4 h-4" />,
    dimensions: { width: 1200, height: 675 },
    aspectRatio: "16:9"
  },
  {
    id: "facebook-post",
    name: "Facebook Post",
    icon: <Facebook className="w-4 h-4" />,
    dimensions: { width: 1200, height: 630 },
    aspectRatio: "1.91:1"
  }
];

const BACKGROUND_STYLES = [
  { id: "gradient-blue", name: "Blue Gradient", style: "bg-gradient-to-br from-blue-400 to-purple-600" },
  { id: "gradient-sunset", name: "Sunset Gradient", style: "bg-gradient-to-br from-orange-400 to-pink-600" },
  { id: "gradient-forest", name: "Forest Gradient", style: "bg-gradient-to-br from-green-400 to-blue-600" },
  { id: "solid-dark", name: "Dark Solid", style: "bg-gray-900" },
  { id: "solid-light", name: "Light Solid", style: "bg-white" },
  { id: "comic-pattern", name: "Comic Pattern", style: "bg-yellow-300" }
];

const TEXT_STYLES = [
  { id: "bold-white", name: "Bold White", class: "text-white font-bold text-shadow" },
  { id: "bold-black", name: "Bold Black", class: "text-black font-bold" },
  { id: "comic-style", name: "Comic Style", class: "text-blue-900 font-black text-outline" },
  { id: "elegant", name: "Elegant", class: "text-gray-800 font-semibold" }
];

export default function SocialPreview() {
  const { toast } = useToast();
  const previewRef = useRef<HTMLDivElement>(null);
  
  const [selectedPlatform, setSelectedPlatform] = useState<string>("instagram-post");
  const [selectedComic, setSelectedComic] = useState<string>("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [hashtags, setHashtags] = useState("");
  const [backgroundStyle, setBackgroundStyle] = useState("gradient-blue");
  const [textStyle, setTextStyle] = useState("bold-white");
  const [logoText, setLogoText] = useState("ComicAI");

  // Fetch user's comics
  const { data: comics = [] } = useQuery({
    queryKey: ["/api/comics"],
    queryFn: async () => {
      const response = await fetch("/api/comics");
      if (!response.ok) throw new Error("Failed to fetch comics");
      return response.json();
    }
  });

  const currentPlatform = SOCIAL_PLATFORMS.find(p => p.id === selectedPlatform);
  const currentBackground = BACKGROUND_STYLES.find(b => b.id === backgroundStyle);
  const currentTextStyle = TEXT_STYLES.find(t => t.id === textStyle);

  const handleDownload = async () => {
    if (!previewRef.current) return;

    try {
      const canvas = await html2canvas(previewRef.current, {
        width: currentPlatform?.dimensions.width,
        height: currentPlatform?.dimensions.height,
        scale: 2,
        backgroundColor: null
      });

      const link = document.createElement("a");
      link.download = `comic-preview-${selectedPlatform}-${Date.now()}.png`;
      link.href = canvas.toDataURL();
      link.click();

      toast({
        title: "Preview Downloaded",
        description: "Your social media preview has been saved!"
      });
    } catch (error) {
      toast({
        title: "Download Failed",
        description: "Could not generate preview image.",
        variant: "destructive"
      });
    }
  };

  const handleCopyText = () => {
    const socialText = `${title}\n\n${description}\n\n${hashtags}`;
    navigator.clipboard.writeText(socialText);
    toast({
      title: "Text Copied",
      description: "Social media text copied to clipboard!"
    });
  };

  const generateHashtags = () => {
    const defaultTags = "#ComicAI #Comics #AIArt #DigitalComics #Storytelling #CreativeWriting #IndieComics #WebComics";
    setHashtags(defaultTags);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Social Media Preview Generator</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Create stunning social media previews for your comics
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Configuration Panel */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Palette className="w-5 h-5" />
                <span>Customize Preview</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Platform Selection */}
              <div className="space-y-2">
                <Label>Social Media Platform</Label>
                <Select value={selectedPlatform} onValueChange={setSelectedPlatform}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {SOCIAL_PLATFORMS.map((platform) => (
                      <SelectItem key={platform.id} value={platform.id}>
                        <div className="flex items-center space-x-2">
                          {platform.icon}
                          <span>{platform.name}</span>
                          <Badge variant="secondary">{platform.aspectRatio}</Badge>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Comic Selection */}
              <div className="space-y-2">
                <Label>Select Comic</Label>
                <Select value={selectedComic} onValueChange={setSelectedComic}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a comic to preview" />
                  </SelectTrigger>
                  <SelectContent>
                    {comics.map((comic: any) => (
                      <SelectItem key={comic.id} value={comic.id.toString()}>
                        {comic.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Text Content */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Title</Label>
                  <Input
                    placeholder="Comic title or main text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Description</Label>
                  <Textarea
                    placeholder="Brief description or call-to-action"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>Hashtags</Label>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={generateHashtags}
                      className="flex items-center space-x-1"
                    >
                      <Sparkles className="w-3 h-3" />
                      <span>Generate</span>
                    </Button>
                  </div>
                  <Textarea
                    placeholder="#ComicAI #Comics #AIArt"
                    value={hashtags}
                    onChange={(e) => setHashtags(e.target.value)}
                    rows={2}
                  />
                </div>
              </div>

              {/* Style Options */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Background Style</Label>
                  <Select value={backgroundStyle} onValueChange={setBackgroundStyle}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {BACKGROUND_STYLES.map((bg) => (
                        <SelectItem key={bg.id} value={bg.id}>
                          {bg.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Text Style</Label>
                  <Select value={textStyle} onValueChange={setTextStyle}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {TEXT_STYLES.map((style) => (
                        <SelectItem key={style.id} value={style.id}>
                          {style.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Logo Text</Label>
                  <Input
                    placeholder="ComicAI"
                    value={logoText}
                    onChange={(e) => setLogoText(e.target.value)}
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-3">
                <Button onClick={handleDownload} className="flex-1">
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>
                <Button variant="outline" onClick={handleCopyText}>
                  <Copy className="w-4 h-4 mr-2" />
                  Copy Text
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Preview Panel */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <ImageIcon className="w-5 h-5" />
                <span>Preview</span>
                {currentPlatform && (
                  <Badge variant="outline">
                    {currentPlatform.dimensions.width} × {currentPlatform.dimensions.height}
                  </Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-center">
                <motion.div
                  key={selectedPlatform}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                  ref={previewRef}
                  className={`relative overflow-hidden rounded-lg shadow-lg ${currentBackground?.style || 'bg-gradient-to-br from-blue-400 to-purple-600'}`}
                  style={{
                    width: currentPlatform ? Math.min(400, currentPlatform.dimensions.width / 3) : 400,
                    height: currentPlatform ? (Math.min(400, currentPlatform.dimensions.width / 3) * currentPlatform.dimensions.height) / currentPlatform.dimensions.width : 400,
                  }}
                >
                  {/* Background Pattern for Comic Style */}
                  {backgroundStyle === 'comic-pattern' && (
                    <div className="absolute inset-0 opacity-10"
                         style={{
                           backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='3'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                         }}
                    />
                  )}

                  {/* Content Container */}
                  <div className="absolute inset-0 p-6 flex flex-col justify-between">
                    {/* Header */}
                    <div className="flex justify-between items-start">
                      <div className={`${currentTextStyle?.class || 'text-white font-bold'}`}>
                        <div className="text-xs opacity-80 mb-1">Made with</div>
                        <div className="text-lg font-black">{logoText}</div>
                      </div>
                      <Share2 className="w-6 h-6 text-white opacity-60" />
                    </div>

                    {/* Main Content */}
                    <div className="flex-1 flex items-center justify-center">
                      {selectedComic ? (
                        <div className="text-center">
                          <div className="w-32 h-32 bg-white/20 rounded-lg mb-4 flex items-center justify-center">
                            <ImageIcon className="w-12 h-12 text-white/60" />
                          </div>
                          <div className={`text-sm ${currentTextStyle?.class || 'text-white font-bold'} opacity-80`}>
                            Comic Preview
                          </div>
                        </div>
                      ) : (
                        <div className="text-center">
                          <div className="w-32 h-32 bg-white/10 rounded-lg mb-4 flex items-center justify-center">
                            <ImageIcon className="w-12 h-12 text-white/40" />
                          </div>
                          <div className={`text-sm ${currentTextStyle?.class || 'text-white font-bold'} opacity-60`}>
                            Select a comic
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Footer Content */}
                    <div className="space-y-2">
                      {title && (
                        <h3 className={`text-lg font-bold leading-tight ${currentTextStyle?.class || 'text-white font-bold'}`}>
                          {title}
                        </h3>
                      )}
                      {description && (
                        <p className={`text-sm leading-tight ${currentTextStyle?.class || 'text-white font-bold'} opacity-90`}>
                          {description}
                        </p>
                      )}
                      {hashtags && (
                        <p className={`text-xs ${currentTextStyle?.class || 'text-white font-bold'} opacity-70`}>
                          {hashtags}
                        </p>
                      )}
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Platform Info */}
              {currentPlatform && (
                <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                    {currentPlatform.icon}
                    <span>{currentPlatform.name}</span>
                    <span>•</span>
                    <span>{currentPlatform.dimensions.width} × {currentPlatform.dimensions.height}</span>
                    <span>•</span>
                    <span>{currentPlatform.aspectRatio}</span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}