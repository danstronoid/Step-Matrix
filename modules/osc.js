import {SynthSource} from './source.js';

// creates a synth oscillator
class SynthOsc extends SynthSource {
    constructor(audioCtx, SynthObj) {
        super(audioCtx);

        //create osc and set type/freq
        this.osc = this.audioCtx.createOscillator();
        this.osc.type = SynthObj.oscType;
        this.osc.frequency.value = SynthObj.freq;

        // set attack and release
        this.attack = SynthObj.attack;
        this.release = SynthObj.release;

        // create gain envelope
        this.oscEnv = this.audioCtx.createGain();
        this.createEnv(this.oscEnv, this.attack, this.release);

        // set fx parameters
        this.fx.setFilter(SynthObj.filter, this.attack, this.release);
        this.fx.setPan(SynthObj.pan);
        this.fx.setVol(SynthObj.vol);
        
        // connect to output, all patching here
        this.connectOutput(this.osc.connect(this.oscEnv));
    }

    // play
    play(time) {
        this.osc.start(time);
        this.osc.stop(time + this.attack + this.release);
    }
}

// creates a noise oscillator
class SynthNoise extends SynthSource {
    constructor(audioCtx, SynthObj) {
        super(audioCtx);

        // create a buffer for noise
        const bufferSize = this.audioCtx.sampleRate * (SynthObj.attack + SynthObj.release);
        const buffer = this.audioCtx.createBuffer(1, bufferSize, this.audioCtx.sampleRate);
        let data = buffer.getChannelData(0);

        // fill the buffer with random values(noise)
        for (let i = 0; i < bufferSize; i++) {
            data[i] = Math.random() * 2 - 1;
        }

        // create noise source
        this.noise = this.audioCtx.createBufferSource();
        this.noise.buffer = buffer;

        // set attack and release
        this.attack = SynthObj.attack;
        this.release = SynthObj.release;

        // create gain env
        this.noiseEnv = this.audioCtx.createGain();
        this.createEnv(this.noiseEnv, this.attack, this.release);

        // set fx parameters
        this.fx.setFilter(SynthObj.filter, this.attack, this.release);
        this.fx.setPan(SynthObj.pan);
        this.fx.setVol(SynthObj.vol);

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
