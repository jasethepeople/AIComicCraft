import { Button } from "@/components/ui/button";
import { Save, History, ZoomIn, Eye, FileDown, Share2 } from "lucide-react";

interface EditorControlsProps {
  onSave: () => void;
  onPreview: () => void;
  onExport: () => void;
  onPublish: () => void;
  hasUnsavedChanges: boolean;
}

export default function EditorControls({
  onSave,
  onPreview,
  onExport,
  onPublish,
  hasUnsavedChanges
}: EditorControlsProps) {
  return (
    <div className="flex justify-between items-center mt-4 text-white">
      <div className="flex space-x-2">
        <Button 
          onClick={onSave} 
          variant="outline" 
          size="icon"
          className={`${hasUnsavedChanges ? 'bg-primary border-primary text-white' : 'bg-gray-700 hover:bg-gray-600'}`}
        >
          <Save className="h-4 w-4" />
        </Button>
        <Button 
          variant="outline" 
          size="icon"
          className="bg-gray-700 hover:bg-gray-600"
        >
          <History className="h-4 w-4" />
        </Button>
        <Button 
          variant="outline" 
          size="icon"
          className="bg-gray-700 hover:bg-gray-600"
        >
          <ZoomIn className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="flex space-x-3">
        <Button 
          onClick={onPreview}
          variant="outline" 
          className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg"
        >
          <Eye className="h-4 w-4 mr-2" />
          Preview
        </Button>
        <Button 
          onClick={onExport}
          variant="outline" 
          className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg"
        >
          <FileDown className="h-4 w-4 mr-2" />
          Export
        </Button>
        <Button 
          onClick={onPublish}
          className="bg-accent hover:bg-opacity-90 px-4 py-2 rounded-lg"
        >
          <Share2 className="h-4 w-4 mr-2" />
          Publish
        </Button>
      </div>
    </div>
  );
}
