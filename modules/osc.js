import {SynthSource} from './source.js';
import {Fx} from './fx.js';

// creates a synth oscillator
class SynthOsc extends SynthSource {
    constructor(audioCtx, SynthObj) {
        super(audioCtx);

        //create osc and set type/freq
        this.osc = this.audioCtx.createOscillator();
        this.osc.type = SynthObj.oscType;
        this.osc.frequency.value = SynthObj.freq;

        // set attack and release
        let attack = SynthObj.attack;
        let release = SynthObj.release;

        // create gain envelope
        let oscEnv = this.audioCtx.createGain();
        this.createEnv(oscEnv, attack, release);

        // create and initialize FX
        this.oscFx = new Fx(this.audioCtx);
        this.oscFx.setPan(SynthObj.pan);
        this.oscFx.setVol(SynthObj.vol);
        
        // connect osc and env to output
        this.osc.connect(oscEnv);
        oscEnv.connect(this.oscFx.panner);
        this.oscFx.panner.connect(this.oscFx.fader);
        this.oscFx.fader.connect(this.out);
    }

    // play
    play() {
        this.osc.start();

        // stop and disconnect after end
        this.osc.onended = function () {
            this.osc.stop();
            this.osc.disconnect();
        }
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
        let attack = SynthObj.attack;
        let release = SynthObj.release;

        // create gain env
        let noiseEnv = this.audioCtx.createGain();
        this.createEnv(noiseEnv, attack, release);

        // connect to output
        this.noise.connect(noiseEnv).connect(this.out)
    }
    
    // play
    play() {
        this.noise.start();

        // stop and disconnect after end
        this.noise.onended = () => {
            this.noise.stop();
            this.noise.disconnect();
        }
    }
}

export {SynthOsc, SynthNoise};
