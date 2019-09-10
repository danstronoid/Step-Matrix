// contains methods for audio fx
class Fx {
    constructor(audioCtx) {
        this.audioCtx = audioCtx;

        // create fx nodes
        // TODO filter
        // TODO compressor
        // TODO delay
        // TODO chorus
        // TODO reverb
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