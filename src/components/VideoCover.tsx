import { useState, useRef } from "react";
import { Play, Pause, Volume2, VolumeX, Maximize } from "lucide-react";

interface VideoCoverProps {
  thumbnail: string;
  videoUrl?: string;
  className?: string;
}

export function VideoCover({ thumbnail, videoUrl, className = "" }: VideoCoverProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handlePlay = () => {
    if (videoRef.current) {
      videoRef.current.play();
      setIsPlaying(true);
      setIsPaused(false);
    }
  };

  const handleVideoClick = () => {
    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play();
        setIsPaused(false);
      } else {
        videoRef.current.pause();
        setIsPaused(true);
      }
    }
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(videoRef.current.muted);
    }
  };

  const handleFullscreen = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (videoRef.current) {
      if (videoRef.current.requestFullscreen) {
        videoRef.current.requestFullscreen();
      }
    }
  };

  return (
    <div className={`relative rounded-2xl overflow-hidden bg-secondary/30 min-h-[200px] ${className}`}>
      {/* Hidden video element - always rendered for tracking */}
      <video
        ref={videoRef}
        src={videoUrl}
        className={`w-full h-auto max-h-[600px] ${isPlaying ? "block" : "hidden"}`}
        playsInline
        loop
        muted={isMuted}
        onEnded={() => { setIsPlaying(false); setIsPaused(false); }}
        onClick={handleVideoClick}
      />

      {/* Cover with play button */}
      {!isPlaying && (
        <div className="relative cursor-pointer group" onClick={handlePlay}>
          <img
            src={thumbnail}
            alt="Video cover"
            className="w-full h-auto max-h-[600px] object-cover"
          />
          <div className="absolute inset-0 flex items-center justify-center bg-foreground/10 group-hover:bg-foreground/20 transition-colors">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-background/80 backdrop-blur-sm border border-border/50 flex items-center justify-center shadow-lg group-hover:scale-105 group-hover:bg-background/90 transition-all">
              <Play className="h-5 w-5 sm:h-6 sm:w-6 ml-0.5 text-foreground" fill="currentColor" />
            </div>
          </div>
          <div className="absolute bottom-4 left-4">
            <span className="text-xs font-medium text-white px-2 py-1 bg-black/50 rounded-md backdrop-blur-sm">
              Play video
            </span>
          </div>
        </div>
      )}

      {/* Video controls overlay when playing */}
      {isPlaying && (
        <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none">
          <div className="p-4 flex items-center justify-between pointer-events-auto">
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (videoRef.current) {
                  if (videoRef.current.paused) {
                    videoRef.current.play();
                    setIsPaused(false);
                  } else {
                    videoRef.current.pause();
                    setIsPaused(true);
                  }
                }
              }}
              className="w-10 h-10 rounded-full bg-background/90 backdrop-blur-sm border border-white/20 flex items-center justify-center shadow-lg hover:bg-background transition-all"
            >
              {isPaused ? (
                <Play className="h-4 w-4 text-foreground ml-0.5" fill="currentColor" />
              ) : (
                <Pause className="h-4 w-4 text-foreground" />
              )}
            </button>
            <div className="flex gap-2">
              <button
                onClick={toggleMute}
                className="w-10 h-10 rounded-full bg-background/90 backdrop-blur-sm border border-white/20 flex items-center justify-center shadow-lg hover:bg-background transition-all"
              >
                {isMuted ? (
                  <VolumeX className="h-4 w-4 text-foreground" />
                ) : (
                  <Volume2 className="h-4 w-4 text-foreground" />
                )}
              </button>
              <button
                onClick={handleFullscreen}
                className="w-10 h-10 rounded-full bg-background/90 backdrop-blur-sm border border-white/20 flex items-center justify-center shadow-lg hover:bg-background transition-all"
              >
                <Maximize className="h-4 w-4 text-foreground" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}