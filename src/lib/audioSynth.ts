/**
 * Pure Web Audio API Synthesizers:
 * 1. Music Box (I-vi-IV-V Waltz in F)
 * 2. Realistic Fireworks Audio Engine (Rocket Launch, Deep Boom, Sharp Crack, Rolling Rumble & Sparkle Crackles)
 * 100% Standalone - Zero external MP3 required!
 */

function getAudioContext(): AudioContext {
  const AudioCtx =
    window.AudioContext ||
    (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
  if (!sharedAudioContext) {
    sharedAudioContext = new AudioCtx();
  }
  if (sharedAudioContext.state === 'suspended') {
    sharedAudioContext.resume().catch(() => {});
  }
  return sharedAudioContext;
}

let sharedAudioContext: AudioContext | null = null;

// Reusable white noise buffer for realistic explosions & sweeps
let noiseBuffer: AudioBuffer | null = null;
function getNoiseBuffer(ac: AudioContext): AudioBuffer {
  if (noiseBuffer) return noiseBuffer;
  const bufferSize = ac.sampleRate * 2; // 2 seconds of noise
  noiseBuffer = ac.createBuffer(1, bufferSize, ac.sampleRate);
  const data = noiseBuffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    data[i] = Math.random() * 2 - 1;
  }
  return noiseBuffer;
}

/* =========================================================================
 * 1. REALISTIC FIREWORKS AUDIO ENGINE
 * ========================================================================= */
class FireworkSoundEngine {
  private isMuted = false;

  public setMuted(muted: boolean) {
    this.isMuted = muted;
  }

  /**
   * Sound of rocket launching and whistling into the sky
   */
  public playLaunch(duration = 0.55) {
    if (this.isMuted) return;
    try {
      const ac = getAudioContext();
      const now = ac.currentTime;

      // 1. Rising Whistle Tone
      const osc = ac.createOscillator();
      const oscGain = ac.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(320, now);
      osc.frequency.exponentialRampToValueAtTime(1100 + Math.random() * 300, now + duration);

      oscGain.gain.setValueAtTime(0.001, now);
      oscGain.gain.linearRampToValueAtTime(0.12, now + duration * 0.4);
      oscGain.gain.exponentialRampToValueAtTime(0.001, now + duration);

      osc.connect(oscGain).connect(ac.destination);
      osc.start(now);
      osc.stop(now + duration);

      // 2. Air Sizzle / Exhaust Whoosh
      const noise = ac.createBufferSource();
      noise.buffer = getNoiseBuffer(ac);
      const noiseFilter = ac.createBiquadFilter();
      noiseFilter.type = 'bandpass';
      noiseFilter.frequency.setValueAtTime(450, now);
      noiseFilter.frequency.linearRampToValueAtTime(1400, now + duration);
      noiseFilter.Q.value = 3.5;

      const noiseGain = ac.createGain();
      noiseGain.gain.setValueAtTime(0.001, now);
      noiseGain.gain.linearRampToValueAtTime(0.08, now + duration * 0.3);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, now + duration);

      noise.connect(noiseFilter).connect(noiseGain).connect(ac.destination);
      noise.start(now);
      noise.stop(now + duration);
    } catch {
      // AudioContext policy fallback
    }
  }

  /**
   * Sound of realistic firework detonation:
   * - Deep sub-bass chest thump (Boom)
   * - Sharp supersonic crack (Blast)
   * - Rolling distant echo/rumble
   * - Trailing sparkle crackles (Lách tách)
   */
  public playExplosion(scale = 1.0) {
    if (this.isMuted) return;
    try {
      const ac = getAudioContext();
      const now = ac.currentTime;
      const vol = Math.min(1.2, 0.45 * Math.max(0.7, scale));

      // --- 1. Deep Sub-Bass Punch (Boom) ---
      const boomOsc = ac.createOscillator();
      const boomGain = ac.createGain();
      boomOsc.type = 'sine';
      // Pitch drop from 160Hz down to 35Hz
      boomOsc.frequency.setValueAtTime(150 + Math.random() * 30, now);
      boomOsc.frequency.exponentialRampToValueAtTime(32, now + 0.45);

      boomGain.gain.setValueAtTime(vol * 0.9, now);
      boomGain.gain.exponentialRampToValueAtTime(0.001, now + 0.7);

      boomOsc.connect(boomGain).connect(ac.destination);
      boomOsc.start(now);
      boomOsc.stop(now + 0.75);

      // --- 2. Sharp Supersonic Crack (Mid-High Blast) ---
      const crackSource = ac.createBufferSource();
      crackSource.buffer = getNoiseBuffer(ac);

      const crackFilter = ac.createBiquadFilter();
      crackFilter.type = 'bandpass';
      crackFilter.frequency.setValueAtTime(950 + Math.random() * 300, now);
      crackFilter.Q.value = 2.0;

      const crackGain = ac.createGain();
      crackGain.gain.setValueAtTime(vol * 0.85, now);
      crackGain.gain.exponentialRampToValueAtTime(0.001, now + 0.16);

      crackSource.connect(crackFilter).connect(crackGain).connect(ac.destination);
      crackSource.start(now);
      crackSource.stop(now + 0.2);

      // --- 3. Distant Rolling Low Rumble ---
      const rumbleSource = ac.createBufferSource();
      rumbleSource.buffer = getNoiseBuffer(ac);

      const rumbleFilter = ac.createBiquadFilter();
      rumbleFilter.type = 'lowpass';
      rumbleFilter.frequency.setValueAtTime(180, now);

      const rumbleGain = ac.createGain();
      rumbleGain.gain.setValueAtTime(vol * 0.6, now + 0.04);
      rumbleGain.gain.exponentialRampToValueAtTime(0.001, now + 1.2);

      rumbleSource.connect(rumbleFilter).connect(rumbleGain).connect(ac.destination);
      rumbleSource.start(now);
      rumbleSource.stop(now + 1.25);

      // --- 4. Trailing Sparkle Crackles (Tiếng pháo hoa nổ lách tách) ---
      const crackleCount = Math.floor(4 + Math.random() * 5);
      for (let i = 0; i < crackleCount; i++) {
        const delay = 0.12 + Math.random() * 0.65;
        const popTime = now + delay;

        const pop = ac.createBufferSource();
        pop.buffer = getNoiseBuffer(ac);

        const popFilter = ac.createBiquadFilter();
        popFilter.type = 'highpass';
        popFilter.frequency.value = 1800 + Math.random() * 1200;

        const popGain = ac.createGain();
        popGain.gain.setValueAtTime(vol * 0.35 * Math.random(), popTime);
        popGain.gain.exponentialRampToValueAtTime(0.0001, popTime + 0.035);

        pop.connect(popFilter).connect(popGain).connect(ac.destination);
        pop.start(popTime);
        pop.stop(popTime + 0.04);
      }
    } catch {
      // AudioContext policy fallback
    }
  }

  /**
   * Gentle sweet pop sound for clicks or small heart bursts
   */
  public playPop() {
    if (this.isMuted) return;
    try {
      const ac = getAudioContext();
      const now = ac.currentTime;

      const osc = ac.createOscillator();
      const gain = ac.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(580 + Math.random() * 160, now);
      osc.frequency.exponentialRampToValueAtTime(220, now + 0.09);

      gain.gain.setValueAtTime(0.18, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);

      osc.connect(gain).connect(ac.destination);
      osc.start(now);
      osc.stop(now + 0.1);
    } catch {
      // AudioContext policy fallback
    }
  }
}

export const fireworkAudio = new FireworkSoundEngine();

/* =========================================================================
 * 2. MUSIC BOX WALTZ SYNTHESIZER
 * ========================================================================= */
class MusicBoxSynthesizer {
  private master: GainNode | null = null;
  private timer: number | null = null;
  private nextTime = 0;
  private step = 0;
  private isPlaying = false;

  private readonly BEAT = 60 / 84; // 84 bpm, 3/4
  private readonly EIGHTH = this.BEAT / 2;

  // MIDI note to frequency
  private n(m: number): number {
    return 440 * Math.pow(2, (m - 69) / 12);
  }

  // Chord roots + triads (MIDI), one bar each (F - Dm - Bb - C)
  private readonly CHORDS: Array<[number, number[]]> = [
    [53, [65, 69, 72]],
    [50, [62, 65, 69]],
    [46, [58, 62, 65]],
    [48, [60, 64, 67]]
  ];

  // Melody: 16 bars x 3 beats (0 = rest)
  private readonly MEL: number[] = [
    77, 0, 76,  77, 81, 79,  77, 74, 0,  72, 74, 76,
    77, 0, 79,  81, 79, 77,  74, 77, 0,  76, 0, 0,
    81, 0, 79,  77, 76, 77,  74, 0, 77,  76, 74, 72,
    74, 77, 81, 84, 81, 77,  74, 76, 77, 79, 76, 72
  ];

  private bell(freq: number, t: number, vel: number, len = 1.8): void {
    const ac = getAudioContext();
    if (!this.master) return;
    try {
      const g = ac.createGain();
      g.gain.setValueAtTime(0, t);
      g.gain.linearRampToValueAtTime(vel, t + 0.005);
      g.gain.exponentialRampToValueAtTime(0.0001, t + len);
      g.connect(this.master);

      const harmonics: Array<[number, number, OscillatorType]> = [
        [1, 1, 'sine'],
        [2, 0.35, 'sine'],
        [4.01, 0.12, 'triangle']
      ];

      for (const [mul, amp, type] of harmonics) {
        const o = ac.createOscillator();
        const og = ac.createGain();
        o.type = type;
        o.frequency.value = freq * mul;
        og.gain.value = amp;
        o.connect(og).connect(g);
        o.start(t);
        o.stop(t + len + 0.05);
      }
    } catch {
      // Ignore scheduling on closed context
    }
  }

  private schedule(): void {
    const ac = getAudioContext();
    if (!this.isPlaying) return;

    while (this.nextTime < ac.currentTime + 0.25) {
      const bar = Math.floor(this.step / 6);
      const inBar = this.step % 6;
      const [root, tri] = this.CHORDS[bar % 4];

      if (inBar === 0) {
        this.bell(this.n(root), this.nextTime, 0.22, 2.6);
      }

      const arp = [tri[0], tri[1], tri[2], tri[1] + 12, tri[2], tri[1]];
      this.bell(this.n(arp[inBar]), this.nextTime, 0.07, 1.2);

      if (inBar % 2 === 0) {
        const m = this.MEL[(bar % 16) * 3 + inBar / 2];
        if (m) {
          this.bell(this.n(m), this.nextTime, 0.16, 2.2);
        }
      }

      this.nextTime += this.EIGHTH;
      this.step++;
    }
  }

  public get playing(): boolean {
    return this.isPlaying;
  }

  public start(): void {
    this.isPlaying = true;
    const ac = getAudioContext();

    if (!this.master) {
      this.master = ac.createGain();
      this.master.gain.value = 0;

      const delay = ac.createDelay();
      const fb = ac.createGain();
      const wet = ac.createGain();

      delay.delayTime.value = 0.28;
      fb.gain.value = 0.3;
      wet.gain.value = 0.25;

      this.master.connect(ac.destination);
      this.master.connect(delay);
      delay.connect(fb).connect(delay);
      delay.connect(wet).connect(ac.destination);
    }

    this.master.gain.cancelScheduledValues(ac.currentTime);
    this.master.gain.linearRampToValueAtTime(0.48, ac.currentTime + 1.2);

    this.nextTime = ac.currentTime + 0.1;
    if (this.timer) clearInterval(this.timer);
    this.timer = window.setInterval(() => this.schedule(), 60);
    this.schedule();
  }

  public stop(): void {
    this.isPlaying = false;
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
    const ac = getAudioContext();
    if (this.master) {
      this.master.gain.cancelScheduledValues(ac.currentTime);
      this.master.gain.setValueAtTime(this.master.gain.value, ac.currentTime);
      this.master.gain.linearRampToValueAtTime(0, ac.currentTime + 0.4);
    }
  }

  public toggle(): boolean {
    if (this.isPlaying) {
      this.stop();
      return false;
    } else {
      this.start();
      return true;
    }
  }
}

export const musicBox = new MusicBoxSynthesizer();
