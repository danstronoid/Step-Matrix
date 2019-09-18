// contains methods for audio fx
class Fx {
    constructor(audioCtx) {
        this.audioCtx = audioCtx;

        // create fx nodes
        // TODO compressor
        // TODO delay
        // TODO chorus
        // TODO reverb
        this.filter = this.audioCtx.createBiquadFilter();
        this.panner = this.audioCtx.createStereoPanner();
        this.fader = this.audioCtx.createGain();
    }
    // get current time
    get now() {
        return this.audioCtx.currentTime;
    }

    // get destination
    get out() {
        return this.audioCtx.destination;
    }

    // set filter freq
    // optional: set filter type
    // optional: set attack and release to create a filter env
    setFilter(value, type, attack, release) {
        if (!type) {
            this.filter.type = 'lowpass';
        } else {
            this.filter.type = type;
        }
        this.filter.Q.setValueAtTime(2, this.now);
        if (!attack || !release) {
            this.filter.frequency.setValueAtTime(value, this.now);
        } else {
            this.filter.frequency.setValueAtTime(0, this.now);
            this.filter.frequency.linearRampToValueAtTime(value, this.now + attack);
            this.filter.frequency.linearRampToValueAtTime(0, this.now + attack + release);
        }      
    }

    // set pan
    setPan(value) {
        this.panner.pan.setValueAtTime(value, this.now);
    }

    // set volume
    setVol(value) {
        this.fader.gain.setValueAtTime(value, this.now);
    }

}

export {Fx};