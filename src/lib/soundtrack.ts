/**
 * Procedural Web Audio API Sound Engine
 * Zero external audio assets. 100% synthesized noir cyberpunk audio.
 */

class SoundtrackEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private volume: number = 0.55;

  // Ambient Drone nodes
  private droneGain: GainNode | null = null;
  private droneOsc1: OscillatorNode | null = null;
  private droneOsc2: OscillatorNode | null = null;
  private droneLfo: OscillatorNode | null = null;
  private isDronePlaying: boolean = false;

  constructor() {
    // Lazy initialized on first user interaction
  }

  private initCtx() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setVolume(vol: number) {
    this.volume = Math.max(0, Math.min(1, vol));
    if (this.droneGain && this.ctx) {
      this.droneGain.gain.setValueAtTime(this.isMuted ? 0 : 0.15 * this.volume, this.ctx.currentTime);
    }
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    if (this.isMuted) {
      if (this.droneGain && this.ctx) {
        this.droneGain.gain.setValueAtTime(0, this.ctx.currentTime);
      }
    } else {
      if (this.isDronePlaying) {
        this.setVolume(this.volume);
      }
    }
    return this.isMuted;
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  // Starts the moody low-fi noir synth drone
  public startAmbientDrone() {
    if (this.isDronePlaying) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;

      // Master drone gain
      this.droneGain = this.ctx.createGain();
      this.droneGain.gain.setValueAtTime(0.001, now);
      this.droneGain.gain.exponentialRampToValueAtTime(this.isMuted ? 0 : 0.15 * this.volume, now + 3.0);
      this.droneGain.connect(this.ctx.destination);

      // Low-pass filter for dark, muffled tape sound
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(260, now);
      filter.Q.setValueAtTime(3.5, now);
      filter.connect(this.droneGain);

      // Dark Minor drone oscillator 1 (Root D2 = 73.42Hz)
      this.droneOsc1 = this.ctx.createOscillator();
      this.droneOsc1.type = 'sawtooth';
      this.droneOsc1.frequency.setValueAtTime(73.42, now);

      // Dark oscillator 2 slightly detuned (Fifth A2 = 110Hz or Minor 3rd F2 = 87.31Hz)
      this.droneOsc2 = this.ctx.createOscillator();
      this.droneOsc2.type = 'triangle';
      this.droneOsc2.frequency.setValueAtTime(87.31, now);
      this.droneOsc2.detune.setValueAtTime(6, now);

      // Tape-flutter LFO for subtle pitch drift
      this.droneLfo = this.ctx.createOscillator();
      this.droneLfo.frequency.setValueAtTime(0.2, now); // 0.2Hz slow drift
      const lfoGain = this.ctx.createGain();
      lfoGain.gain.setValueAtTime(4.5, now); // +/- 4.5 cents detune

      this.droneLfo.connect(lfoGain);
      lfoGain.connect(this.droneOsc1.detune);
      lfoGain.connect(this.droneOsc2.detune);

      this.droneOsc1.connect(filter);
      this.droneOsc2.connect(filter);

      this.droneOsc1.start(now);
      this.droneOsc2.start(now);
      this.droneLfo.start(now);

      this.isDronePlaying = true;
    } catch (e) {
      console.warn('Ambient audio could not start:', e);
    }
  }

  // Mechanical typewriter key clatter with slight pitch randomization
  public playKeypress() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(1400 + (Math.random() * 400 - 200), now);
      filter.Q.setValueAtTime(4.0, now);

      osc.type = 'triangle';
      const baseFreq = 380 + Math.random() * 90;
      osc.frequency.setValueAtTime(baseFreq, now);
      osc.frequency.exponentialRampToValueAtTime(80, now + 0.04);

      gain.gain.setValueAtTime(0.12 * this.volume, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.045);
    } catch {
      // Ignored
    }
  }

  // Tape-deck relay mechanical click
  public playTapeClick() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      // High click
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(800, now);
      osc.frequency.exponentialRampToValueAtTime(120, now + 0.035);

      gain.gain.setValueAtTime(0.18 * this.volume, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.035);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.04);

      // Low solenoid thud
      const thudOsc = this.ctx.createOscillator();
      const thudGain = this.ctx.createGain();
      thudOsc.type = 'sine';
      thudOsc.frequency.setValueAtTime(140, now + 0.015);
      thudOsc.frequency.exponentialRampToValueAtTime(30, now + 0.06);

      thudGain.gain.setValueAtTime(0.22 * this.volume, now + 0.015);
      thudGain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);

      thudOsc.connect(thudGain);
      thudGain.connect(this.ctx.destination);

      thudOsc.start(now + 0.015);
      thudOsc.stop(now + 0.065);
    } catch {}
  }

  // Static glitch burst
  public playGlitch() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const bufferSize = Math.floor(this.ctx.sampleRate * 0.08); // 80ms white noise
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const output = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }

      const whiteNoise = this.ctx.createBufferSource();
      whiteNoise.buffer = buffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(1800, now);
      filter.Q.setValueAtTime(2.0, now);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.18 * this.volume, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

      whiteNoise.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      whiteNoise.start(now);
    } catch {}
  }

  // Interrogation tension chord (ominous neo-noir chord)
  public playTensionChord() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const chordNotes = [110, 130.81, 164.81, 207.65]; // A2, C3, E3, G#3 (AmMaj7)
      chordNotes.forEach((freq, idx) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(freq, now);

        const filter = this.ctx!.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(450, now);
        filter.frequency.exponentialRampToValueAtTime(180, now + 1.2);

        gain.gain.setValueAtTime(0.001, now);
        gain.gain.linearRampToValueAtTime(0.08 * this.volume, now + 0.1 + idx * 0.04);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 1.4);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(this.ctx!.destination);

        osc.start(now);
        osc.stop(now + 1.45);
      });
    } catch {}
  }

  // Evidence discovered / deduction stinger
  public playEvidenceUnlocked() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const notes = [440, 554.37, 659.25, 830.61]; // A major 7 arpeggio
      notes.forEach((freq, index) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + index * 0.08);

        gain.gain.setValueAtTime(0.001, now + index * 0.08);
        gain.gain.linearRampToValueAtTime(0.2 * this.volume, now + index * 0.08 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, now + index * 0.08 + 0.35);

        osc.connect(gain);
        gain.connect(this.ctx!.destination);

        osc.start(now + index * 0.08);
        osc.stop(now + index * 0.08 + 0.4);
      });
    } catch {}
  }

  // Exorcism victory stinger (triumphant cyber sweep)
  public playExorcismComplete() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      // Rising sweep
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(220, now);
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.6);

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(300, now);
      filter.frequency.exponentialRampToValueAtTime(2400, now + 0.6);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.25 * this.volume, now + 0.1);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 1.2);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 1.25);

      // Chime burst
      [587.33, 739.99, 880.0, 1174.66].forEach((f, i) => {
        const chime = this.ctx!.createOscillator();
        const cGain = this.ctx!.createGain();
        chime.type = 'sine';
        chime.frequency.setValueAtTime(f, now + 0.5 + i * 0.09);

        cGain.gain.setValueAtTime(0.001, now + 0.5 + i * 0.09);
        cGain.gain.linearRampToValueAtTime(0.22 * this.volume, now + 0.5 + i * 0.09 + 0.02);
        cGain.gain.exponentialRampToValueAtTime(0.001, now + 0.5 + i * 0.09 + 0.8);

        chime.connect(cGain);
        cGain.connect(this.ctx!.destination);

        chime.start(now + 0.5 + i * 0.09);
        chime.stop(now + 0.5 + i * 0.09 + 0.85);
      });
    } catch {}
  }

  // Laser zap / email vaporize
  public playLaserZap() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(950, now);
      osc.frequency.exponentialRampToValueAtTime(90, now + 0.14);

      gain.gain.setValueAtTime(0.25 * this.volume, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.15);
    } catch {}
  }

  // EMP blast / mass unsubscribe
  public playEmpBlast() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(140, now);
      osc.frequency.linearRampToValueAtTime(950, now + 0.09);
      osc.frequency.exponentialRampToValueAtTime(35, now + 0.4);

      gain.gain.setValueAtTime(0.35 * this.volume, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.42);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.43);
    } catch {}
  }

  // Error buzz
  public playErrorBuzz() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(110, now);
      osc.frequency.setValueAtTime(98, now + 0.1);

      gain.gain.setValueAtTime(0.25 * this.volume, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.23);
    } catch {}
  }

  // Time-travel rewind sound effect
  public playTimeTravelRewind() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(120, now);
      osc.frequency.exponentialRampToValueAtTime(1200, now + 0.35);

      gain.gain.setValueAtTime(0.18 * this.volume, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.36);
    } catch {}
  }
}

export const soundtrack = new SoundtrackEngine();
