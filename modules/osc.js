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
        this.oscFx.setFilter(SynthObj.filter, attack, release);
        this.oscFx.setPan(SynthObj.pan);
        this.oscFx.setVol(SynthObj.vol);
        
        // connect osc to output, all patching here
        this.osc.connect(oscEnv);
        
        // bypass the filter if not active
        if (SynthObj.filter > 20) {
            oscEnv.connect(this.oscFx.filter);
            this.oscFx.filter.connect(this.oscFx.panner);
        } else {
            oscEnv.connect(this.oscFx.panner);
        }

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

        // create and initialize FX
        this.noiseFx = new Fx(this.audioCtx);
        this.noiseFx.setFilter(SynthObj.filter, attack, release);
        this.noiseFx.setPan(SynthObj.pan);
        this.noiseFx.setVol(SynthObj.vol);

        // connect to output
        this.noise.connect(noiseEnv);

        if (SynthObj.filter > 20) {
            noiseEnv.connect(this.noiseFx.filter);
            this.noiseFx.filter.connect(this.noiseFx.panner);
        } else {
            noiseEnv.connect(this.noiseFx.panner);
        }

        this.noiseFx.panner.connect(this.noiseFx.fader);
        this.noiseFx.fader.connect(this.out);
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
