import React, { useRef, useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Volume2, VolumeX, Maximize, StickyNote, ExternalLink } from 'lucide-react';

interface VideoPlayerProps {
  videoUrl: string;
  lectureTitle: string;
  onTimeUpdate?: (currentTime: number) => void;
  onEnded?: () => void;
  onAddNoteAtTimestamp: (timestampSeconds: number) => void;
  onAddNote?: () => void;
}

function getYouTubeVideoId(videoUrl: string): string | null {
  try {
    const url = new URL(videoUrl);
    if (!['youtube.com', 'www.youtube.com', 'youtu.be', 'www.youtu.be', 'youtube-nocookie.com', 'www.youtube-nocookie.com'].includes(url.hostname)) {
      return null;
    }

    if (url.hostname.includes('youtu.be')) return url.pathname.slice(1) || null;
    if (url.pathname === '/watch') return url.searchParams.get('v');
    return url.pathname.match(/^\/embed\/([A-Za-z0-9_-]+)$/)?.[1] ?? null;
  } catch (error) {
    if (error instanceof TypeError) return null;
    throw error;
  }
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({
  videoUrl,
  lectureTitle,
  onTimeUpdate,
  onEnded,
  onAddNoteAtTimestamp,
  onAddNote,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const youtubeVideoId = getYouTubeVideoId(videoUrl);

  useEffect(() => {
    setIsPlaying(false);
    setCurrentTime(0);
    if (!youtubeVideoId && videoRef.current) {
      videoRef.current.load();
    }
  }, [videoUrl, youtubeVideoId]);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const cur = videoRef.current.currentTime;
      setCurrentTime(cur);
      if (onTimeUpdate) onTimeUpdate(cur);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    setCurrentTime(time);
    if (videoRef.current) {
      videoRef.current.currentTime = time;
    }
  };

  const handleSpeedChange = (speed: number) => {
    setPlaybackSpeed(speed);
    if (videoRef.current) {
      videoRef.current.playbackRate = speed;
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleFullscreen = () => {
    if (videoRef.current) {
      if (videoRef.current.requestFullscreen) {
        videoRef.current.requestFullscreen();
      }
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="relative bg-slate-950 rounded-xl overflow-hidden shadow-xl border border-slate-800 flex flex-col group">
      <div className="relative aspect-video w-full bg-black flex items-center justify-center">
        {youtubeVideoId ? (
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${youtubeVideoId}?rel=0`}
            title={lectureTitle}
            className="w-full h-full border-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          />
        ) : (
          <video
            ref={videoRef}
            src={videoUrl}
            onTimeUpdate={handleTimeUpdate}
            onLoadedMetadata={handleLoadedMetadata}
            onEnded={() => {
              setIsPlaying(false);
              if (onEnded) onEnded();
            }}
            className="w-full h-full object-contain cursor-pointer"
            onClick={togglePlay}
            playsInline
          />
        )}

        {!youtubeVideoId && !isPlaying && (
          <button
            onClick={togglePlay}
            className="absolute inset-0 m-auto w-16 h-16 rounded-full bg-indigo-600/90 text-white flex items-center justify-center shadow-lg hover:scale-105 transition-transform"
            aria-label="Play Video"
          >
            <Play className="w-8 h-8 ml-1 fill-white" />
          </button>
        )}
      </div>

      <div className="p-3 bg-slate-900 border-t border-slate-800 text-slate-200">
        {youtubeVideoId ? (
          <div className="flex items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-3 min-w-0">
              <span className="text-slate-400">Lecture video · use the video controls to play and seek</span>
              <a
                href={`https://www.youtube.com/watch?v=${youtubeVideoId}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-indigo-300 hover:text-white whitespace-nowrap"
              >
                Open on YouTube
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
            <button
              onClick={onAddNote ?? (() => onAddNoteAtTimestamp(0))}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors font-medium"
              title="Open notes for this lecture"
            >
              <StickyNote className="w-3.5 h-3.5 text-amber-400" />
              <span>Add lecture note</span>
            </button>
          </div>
        ) : (
          <>
        <div className="flex items-center gap-2 mb-2">
          <input
            type="range"
            min={0}
            max={duration || 100}
            value={currentTime}
            onChange={handleSeek}
            className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
          />
        </div>

        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-3">
            <button
              onClick={togglePlay}
              className="p-1.5 rounded hover:bg-slate-800 text-white transition-colors"
              title={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? <Pause className="w-4 h-4 fill-white" /> : <Play className="w-4 h-4 fill-white" />}
            </button>

            <button
              onClick={() => {
                if (videoRef.current) {
                  videoRef.current.currentTime = Math.max(0, currentTime - 10);
                }
              }}
              className="p-1.5 rounded hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
              title="Rewind 10 seconds"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            <button
              onClick={toggleMute}
              className="p-1.5 rounded hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
              title={isMuted ? 'Unmute' : 'Mute'}
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>

            <div className="flex items-center gap-1 font-mono tabular-nums text-slate-400 text-xs">
              <span className="text-white font-medium">{formatTime(currentTime)}</span>
              <span>/</span>
              <span>{formatTime(duration || 0)}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onAddNoteAtTimestamp(currentTime)}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors text-xs font-medium"
              title="Save a note pinned to current playback timestamp"
            >
              <StickyNote className="w-3.5 h-3.5 text-amber-400" />
              <span>Note at {formatTime(currentTime)}</span>
            </button>

            <div className="flex items-center bg-slate-800 rounded p-0.5 text-[11px] font-mono">
              {[1, 1.25, 1.5, 2].map((speed) => (
                <button
                  key={speed}
                  onClick={() => handleSpeedChange(speed)}
                  className={`px-1.5 py-0.5 rounded transition-colors ${
                    playbackSpeed === speed
                      ? 'bg-indigo-600 text-white font-bold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {speed}x
                </button>
              ))}
            </div>

            <button
              onClick={handleFullscreen}
              className="p-1.5 rounded hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
              title="Fullscreen"
            >
              <Maximize className="w-4 h-4" />
            </button>
          </div>
        </div>
          </>
        )}
      </div>
    </div>
  );
};
