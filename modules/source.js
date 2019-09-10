// the abstract base class for a new synth source
class SynthSource {
    constructor(audioCtx) {
        if (this.constructor === SynthSource) {
            throw new TypeError('Abstract class "SynthSource" cannot be instantiated directly');
        }

        this.audioCtx = audioCtx;
    }

    // get current time
    get now() {
        return this.audioCtx.currentTime;
    }

    // get destination
    get out() {
        return this.audioCtx.destination;
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



