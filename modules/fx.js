// contains methods for audio fx
class Fx {
    constructor(audioCtx) {
        this.audioCtx = audioCtx;

        // create fx nodes
        // TODO compressor
        // TODO chorus
        // TODO reverb

        // create a filter delay
        this.delay = this.audioCtx.createDelay(2.0);
        this.dFilter = this.audioCtx.createBiquadFilter();
        this.dFilter.type = 'lowpass';
        this.dFilter.frequency.setValueAtTime(5000, this.now);
        this.dFilter.detune.value = 10;
        this.dPan = this.audioCtx.createStereoPanner();
        this.dGain = this.audioCtx.createGain();

        // create basic filter
        this.filter = this.audioCtx.createBiquadFilter();

        //create basic pan and volume
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

    setDelay(time, level, pan) {
        this.delay.delayTime.setValueAtTime(time, this.now);
        this.dPan.pan.setValueAtTime(pan, this.now);
        this.dGain.gain.setValueAtTime(level, this.now);
    }

    // set filter freq
    // optional: set filter type
    // optional: set attack and release to create a filter env
    setFilter(freq, type, attack, release) {
        if (!type) {
            this.filter.type = 'lowpass';
        } else {
            this.filter.type = type;
        }
        this.filter.Q.setValueAtTime(2, this.now);
        if (!attack || !release) {
            this.filter.frequency.setValueAtTime(freq, this.now);
        } else {
            this.filter.frequency.setValueAtTime(0, this.now);
            this.filter.frequency.linearRampToValueAtTime(freq, this.now + attack);
            this.filter.frequency.linearRampToValueAtTime(0, this.now + attack + release);
        }      
    }

    // set pan
    setPan(pan) {
        this.panner.pan.setValueAtTime(pan, this.now);
    }

    // set volume
    setVol(level) {
        this.fader.gain.setValueAtTime(level, this.now);
    }

}

export {Fx};