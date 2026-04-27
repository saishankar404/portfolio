import { useEffect, useRef, useCallback } from "react";

interface SoundConfig {
  type: "sine" | "square" | "triangle" | "sawtooth";
  frequency: { start: number; end?: number };
  duration: number;
  gain: number;
}

const sounds = {
  success: {
    type: "sine" as const,
    frequency: { start: 600, end: 800 },
    duration: 0.08,
    gain: 0.15,
  },
  error: {
    type: "sine" as const,
    frequency: { start: 200, end: 150 },
    duration: 0.1,
    gain: 0.1,
  },
  click: {
    type: "sine" as const,
    frequency: { start: 400, end: 300 },
    duration: 0.05,
    gain: 0.08,
  },
  notification: {
    type: "sine" as const,
    frequency: { start: 500, end: 700 },
    duration: 0.15,
    gain: 0.12,
  },
};

type SoundName = keyof typeof sounds;

class AudioEngine {
  private context: AudioContext | null = null;
  private enabled: boolean = true;

  constructor() {
    if (typeof window !== "undefined") {
      this.checkReducedMotion();
    }
  }

  private getContext(): AudioContext | null {
    if (!this.context && typeof window !== "undefined") {
      this.context = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    return this.context;
  }

  private checkReducedMotion() {
    try {
      const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (prefersReducedMotion) {
        this.enabled = false;
      }
    } catch {
      // matchMedia not supported
    }
  }

  setEnabled(enabled: boolean) {
    this.enabled = enabled;
  }

  isEnabled() {
    return this.enabled;
  }

  play(config: SoundConfig) {
    if (!this.enabled) return;

    const ctx = this.getContext();
    if (!ctx) return;

    if (ctx.state === "suspended") {
      ctx.resume().catch(() => {});
    }

    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.type = config.type;
    oscillator.frequency.setValueAtTime(config.frequency.start, ctx.currentTime);

    if (config.frequency.end) {
      oscillator.frequency.exponentialRampToValueAtTime(
        config.frequency.end,
        ctx.currentTime + config.duration
      );
    }

    gainNode.gain.setValueAtTime(config.gain, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + config.duration);

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + config.duration);

    oscillator.onended = () => {
      oscillator.disconnect();
      gainNode.disconnect();
    };
  }

  playSound(name: SoundName) {
    this.play(sounds[name]);
  }
}

const audioEngine = new AudioEngine();

export function useAudio() {
  const play = useCallback((name: SoundName) => {
    audioEngine.playSound(name);
  }, []);

  const setEnabled = useCallback((enabled: boolean) => {
    audioEngine.setEnabled(enabled);
  }, []);

  const isEnabled = useCallback(() => {
    return audioEngine.isEnabled();
  }, []);

  return { play, setEnabled, isEnabled };
}

export { audioEngine };