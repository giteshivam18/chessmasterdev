import { Howl } from 'howler';
import { useSettingsStore } from '../store/settingsStore';

class SoundManager {
  private sounds: { [key: string]: Howl } = {};
  private isEnabled: boolean = true;
  private volume: number = 0.7;

  constructor() {
    this.initializeSounds();
  }

  private initializeSounds() {
    // Create simple sound effects using Web Audio API
    this.sounds = {
      move: this.createTone(440, 0.1, 'sine'),
      capture: this.createTone(220, 0.2, 'sawtooth'),
      castle: this.createTone(880, 0.3, 'square'),
      check: this.createTone(660, 0.4, 'triangle'),
      checkmate: this.createTone(1320, 0.8, 'sine'),
      draw: this.createTone(330, 0.5, 'sine'),
      timer: this.createTone(1000, 0.1, 'square'),
      button: this.createTone(800, 0.05, 'sine'),
      error: this.createTone(200, 0.3, 'sawtooth'),
    };
  }

  private createTone(frequency: number, duration: number, type: OscillatorType): Howl {
    return new Howl({
      src: [this.generateToneData(frequency, duration, type)],
      volume: this.volume,
    });
  }

  private generateToneData(frequency: number, duration: number, type: OscillatorType): string {
    const sampleRate = 44100;
    const length = sampleRate * duration;
    const buffer = new ArrayBuffer(44 + length * 2);
    const view = new DataView(buffer);
    
    // WAV header
    const writeString = (offset: number, string: string) => {
      for (let i = 0; i < string.length; i++) {
        view.setUint8(offset + i, string.charCodeAt(i));
      }
    };
    
    writeString(0, 'RIFF');
    view.setUint32(4, 36 + length * 2, true);
    writeString(8, 'WAVE');
    writeString(12, 'fmt ');
    view.setUint32(16, 16, true);
    view.setUint16(20, 1, true);
    view.setUint16(22, 1, true);
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, sampleRate * 2, true);
    view.setUint16(32, 2, true);
    view.setUint16(34, 16, true);
    writeString(36, 'data');
    view.setUint32(40, length * 2, true);
    
    // Generate tone
    for (let i = 0; i < length; i++) {
      const t = i / sampleRate;
      let sample = 0;
      
      switch (type) {
        case 'sine':
          sample = Math.sin(2 * Math.PI * frequency * t);
          break;
        case 'square':
          sample = Math.sin(2 * Math.PI * frequency * t) > 0 ? 1 : -1;
          break;
        case 'sawtooth':
          sample = 2 * (t * frequency - Math.floor(t * frequency + 0.5));
          break;
        case 'triangle':
          sample = 2 * Math.abs(2 * (t * frequency - Math.floor(t * frequency + 0.5))) - 1;
          break;
      }
      
      view.setInt16(44 + i * 2, sample * 32767, true);
    }
    
    const blob = new Blob([buffer], { type: 'audio/wav' });
    return URL.createObjectURL(blob);
  }

  play(soundName: string) {
    if (!this.isEnabled || !this.sounds[soundName]) return;
    
    this.sounds[soundName].volume(this.volume);
    this.sounds[soundName].play();
  }

  setEnabled(enabled: boolean) {
    this.isEnabled = enabled;
  }

  setVolume(volume: number) {
    this.volume = Math.max(0, Math.min(1, volume));
    Object.values(this.sounds).forEach(sound => {
      sound.volume(this.volume);
    });
  }

  updateFromSettings() {
    const { settings } = useSettingsStore.getState();
    this.setEnabled(settings.soundEnabled);
    this.setVolume(settings.soundVolume);
  }
}

export const soundManager = new SoundManager();
