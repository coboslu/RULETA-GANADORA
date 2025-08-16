// Generador de sonidos para la ruleta usando Web Audio API
class RouletteAudio {
  constructor() {
    this.audioContext = null;
    this.winSound = null;
    this.loseSound = null;
    this.initAudio();
  }

  initAudio() {
    try {
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
    } catch {
      console.log('Web Audio API no soportada');
    }
  }

  // Generar sonido de victoria
  createWinSound() {
    if (!this.audioContext) return null;
    
    const duration = 1.5;
    const sampleRate = this.audioContext.sampleRate;
    const buffer = this.audioContext.createBuffer(1, duration * sampleRate, sampleRate);
    const data = buffer.getChannelData(0);
    
    for (let i = 0; i < buffer.length; i++) {
      const t = i / sampleRate;
      // Sonido alegre ascendente
      const frequency = 440 + t * 200; // Frecuencia ascendente
      const amplitude = Math.sin(t * Math.PI) * 0.2; // Envolvente suave
      
      data[i] = Math.sin(2 * Math.PI * frequency * t) * amplitude;
    }
    
    return buffer;
  }

  // Generar sonido de pérdida
  createLoseSound() {
    if (!this.audioContext) return null;
    
    const duration = 1.0;
    const sampleRate = this.audioContext.sampleRate;
    const buffer = this.audioContext.createBuffer(1, duration * sampleRate, sampleRate);
    const data = buffer.getChannelData(0);
    
    for (let i = 0; i < buffer.length; i++) {
      const t = i / sampleRate;
      // Sonido descendente triste
      const frequency = 300 - t * 150; // Frecuencia descendente
      const amplitude = Math.exp(-t * 2) * 0.15; // Desvanecimiento rápido
      
      data[i] = Math.sin(2 * Math.PI * frequency * t) * amplitude;
    }
    
    return buffer;
  }

  // Reproducir sonido de giro con clicks que disminuyen
  playSpinSound() {
    if (!this.audioContext) return;

    const ctx = this.audioContext;
    const start = ctx.currentTime;
    const duration = 8; // Duración total del giro
    const ticks = 40; // Número de clicks

    for (let i = 0; i < ticks; i++) {
      const progress = i / ticks;
      const time = start + Math.pow(progress, 2) * duration; // Aumenta el intervalo entre clicks

      const osc = ctx.createOscillator();
      osc.frequency.value = 1000;

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.3, time);
      gain.gain.exponentialRampToValueAtTime(0.001, time + 0.02);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(time);
      osc.stop(time + 0.02);
    }
  }

  // Reproducir sonido de victoria
  playWinSound() {
    if (!this.audioContext) return;
    
    if (!this.winSound) {
      this.winSound = this.createWinSound();
    }
    
    const source = this.audioContext.createBufferSource();
    source.buffer = this.winSound;
    source.connect(this.audioContext.destination);
    source.start();
  }

  // Reproducir sonido de pérdida
  playLoseSound() {
    if (!this.audioContext) return;
    
    if (!this.loseSound) {
      this.loseSound = this.createLoseSound();
    }
    
    const source = this.audioContext.createBufferSource();
    source.buffer = this.loseSound;
    source.connect(this.audioContext.destination);
    source.start();
  }

  // Reanudar contexto de audio (necesario para algunos navegadores)
  resumeAudio() {
    if (this.audioContext && this.audioContext.state === 'suspended') {
      this.audioContext.resume();
    }
  }
}

// Exportar para uso global
window.RouletteAudio = RouletteAudio;

