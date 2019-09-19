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

    pitch(pc) {
        let noteNum;
        switch (pc.substr(0, 1).toUpperCase()) {
            case "C":
                noteNum = 0;
                break;
            case "D":
                noteNum = 2;
                break;
            case "E":
                noteNum = 4;
                break;
            case "F":
                noteNum = 5;
                break;
            case "G":
                noteNum = 7;
                break;
            case "A":
                noteNum = 9;
                break;
            case "B":
                noteNum = 11;
                break;
            default:
                noteNum = NaN;
        }
        if (pc.length == 3) {
            if (pc.substr(1, 1) == "#") {
                ++noteNum;
            } else if (pc.substr(1, 1) == "b") {
                --noteNum;
            }
            noteNum = noteNum + 12 * parseInt(pc.substr(2, 1));
        } else if (pc.length > 3) {
            noteNum = NaN;
        } else {
            noteNum = noteNum + 12 * parseInt(pc.substr(1, 1));   
        } 

        return this.midiNotes[noteNum];
    }
}

export {Notes};
