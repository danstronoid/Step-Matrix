import {SynthSource} from './source.js';

// creates a synth oscillator
class SynthOsc extends SynthSource {
    constructor(audioCtx, SourceArgs, FxArgs) {
        super(audioCtx, FxArgs);

        //create osc and set type/freq
        this.osc = this.audioCtx.createOscillator();
        this.osc.type = SourceArgs.oscType;
        this.osc.frequency.value = SourceArgs.freq;

        //create FM modulation osc
        this.mod = this.audioCtx.createOscillator();
        this.mod.type = SourceArgs.modType;
        this.mod.frequency.value = SourceArgs.freq * SourceArgs.multi;
        this.modGain = this.audioCtx.createGain();
        this.modGain.gain.value = SourceArgs.modDepth;

        // connect the modulator to the osc freq
        this.mod.connect(this.modGain);
        this.modGain.connect(this.osc.frequency);

        // set attack, release, and velocity
        this.attack = SourceArgs.attack;
        this.release = SourceArgs.release;
        this.veloc = SourceArgs.veloc;

        // create gain envelope
        this.oscEnv = this.audioCtx.createGain();
        this.createEnv(this.oscEnv, this.attack, this.release, this.veloc);
        
        // connect to output, all patching here
        this.connectOutput(this.osc.connect(this.oscEnv));
    }

    // play
    play(time) {
        this.mod.start(time);
        this.osc.start(time);
        this.osc.stop(time + this.attack + this.release + this.delay);
        this.mod.stop(time + this.attack + this.release + this.delay);
    }
}

// creates a noise oscillator
class SynthNoise extends SynthSource {
    constructor(audioCtx, SourceArgs, FxArgs) {
        super(audioCtx, FxArgs);

        // create a buffer for noise
        const bufferSize = this.audioCtx.sampleRate * (SourceArgs.attack + SourceArgs.release);
        const buffer = this.audioCtx.createBuffer(1, bufferSize, this.audioCtx.sampleRate);
        let data = buffer.getChannelData(0);

        // fill the buffer with random values(noise)
        for (let i = 0; i < bufferSize; i++) {
            data[i] = Math.random() * 2 - 1;
        }

        // create noise source
        this.noise = this.audioCtx.createBufferSource();
        this.noise.buffer = buffer;

        // set attack, release, and velocity
        this.attack = SourceArgs.attack;
        this.release = SourceArgs.release;
        this.veloc = SourceArgs.veloc;

        // create gain env
        this.noiseEnv = this.audioCtx.createGain();
        this.createEnv(this.noiseEnv, this.attack, this.release, this.veloc);

        // connect to output, all patching here
        this.connectOutput(this.noise.connect(this.noiseEnv));
    }
    
    // play
    play(time) {
        this.noise.start(time);
        this.noise.stop(time + this.attack + this.release);
    }
}

export {SynthOsc, SynthNoise};
