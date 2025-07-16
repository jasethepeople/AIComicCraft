import { Progress } from "@/components/ui/progress";

interface LoadingOverlayProps {
  progress: number;
  message: string;
}

export default function LoadingOverlay({ progress, message }: LoadingOverlayProps) {
  return (
    <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center">
      <div className="text-center p-6 max-w-md">
        <div className="text-5xl text-accent mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-16 w-16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 8V4H8"></path>
            <rect width="16" height="12" x="4" y="8" rx="2"></rect>
            <path d="M2 14h2"></path>
            <path d="M20 14h2"></path>
            <path d="M15 13v2"></path>
            <path d="M9 13v2"></path>
          </svg>
        </div>
        <h3 className="font-bangers text-white text-2xl mb-3">AI is generating your comic</h3>
        <p className="text-gray-300 mb-6">
          {message}
        </p>
        <Progress 
          value={progress} 
          className="w-full bg-gray-700 rounded-full h-3 mb-4"
        />
        <div className="text-gray-400 text-sm">
          {progress}% complete • Approximately {Math.ceil((100 - progress) / 2)} seconds remaining
        </div>
      </div>
    </div>
  );
}
