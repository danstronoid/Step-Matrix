import {Fx} from './fx.js';

// the abstract base class for a new synth source
class SynthSource {
    constructor(audioCtx) {
        if (this.constructor === SynthSource) {
            throw new TypeError('Abstract class "SynthSource" cannot be instantiated directly');
        }
        // initialize audio context
        this.audioCtx = audioCtx;

        // initialize fx
        this.fx = new Fx(this.audioCtx);
    }

    // get current time
    get now() {
        return this.audioCtx.currentTime;
    }

    // get destination
    get out() {
        return this.audioCtx.destination;
    }

    // connect source to fx and output
    connectOutput(source) {
        source.connect(this.fx.filter);
        this.fx.filter.connect(this.fx.panner);
        this.fx.panner.connect(this.fx.fader);
        this.fx.fader.connect(this.out);
    }
        
    // create an envelope
    createEnv(env, attack, release) {
        env.gain.cancelScheduledValues(this.now);
        env.gain.setValueAtTime(0, this.now);
        env.gain.linearRampToValueAtTime(0.3, this.now + attack);
        env.gain.linearRampToValueAtTime(0, this.now + attack + release);
    }
}

export {SynthSource};



