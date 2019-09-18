import {Fx} from './fx.js';

// the abstract base class for a new synth source
class SynthSource {
    constructor(audioCtx, FxArgs) {
        if (this.constructor === SynthSource) {
            throw new TypeError('Abstract class "SynthSource" cannot be instantiated directly');
        }
        // initialize audio context
        this.audioCtx = audioCtx;

        // initialize fx
        this.fx = new Fx(this.audioCtx);

        // set fx parameters
        this.fxArgs = FxArgs;
        this.fx.setDelay(FxArgs.delay, FxArgs.dLvl, FxArgs.dPan);
        this.fx.setFilter(FxArgs.filter, FxArgs.ftype, FxArgs.fattack, FxArgs.frelease);
        this.fx.setPan(FxArgs.pan);
        this.fx.setVol(FxArgs.vol);
    }

    // get current time
    get now() {
        return this.audioCtx.currentTime;
    }

    // get destination
    get out() {
        return this.audioCtx.destination;
    }

    // get delay time
    get delay() {
        return this.fxArgs.delay;
    }

    // connect source to fx and output
    connectOutput(source) {

        // bypass the filter if the freq is less than 20Hz
        if (this.fxArgs.filter > 20) {
            source.connect(this.fx.filter);
            this.fx.filter.connect(this.fx.panner);
        } else {
            source.connect(this.fx.panner);
        }
        this.fx.panner.connect(this.fx.fader);
        this.fx.fader.connect(this.out);

        if (this.fxArgs.delay > 0) {
            this.fx.fader.connect(this.fx.delay);
            this.fx.delay.connect(this.fx.dFilter);
            this.fx.dFilter.connect(this.fx.dPan);
            this.fx.dPan.connect(this.fx.dGain);
            this.fx.dGain.connect(this.out);
            //TODO dPan
        }
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



