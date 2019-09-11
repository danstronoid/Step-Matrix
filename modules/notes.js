class Notes {
    constructor() {
        // create array of midi note numbers
        // this is tuned to A440, which is Midi Note 69
        this.midiNotes = [];
        const semitone = 1.059463; // approx. 2^(1/12)
        for (let i = 0; i < 128; i++) {
            let note = 440 * Math.pow(semitone, (i - 69)); 
            this.midiNotes[i] = note.toFixed(2);
        }   
    }

    // get the full midi Array
    get midiArray() {
        return this.midiNotes;
    }

    // get a single indexed note
    midi(noteNum) {
        return this.midiNotes[noteNum];
    }

    // get a random note
    get rndNote(){
        return this.midiNotes[Math.floor(Math.random() * this.midiNotes.length)];
    }
}

export {Notes};
