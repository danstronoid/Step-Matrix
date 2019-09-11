"use strict";

// create array of midi note numbers
// this is tuned to A440, which is Midi Note 69
function noteFreq(){
    let midiNotes = [];
    const semitone = 1.059463; // approx. 2^(1/12)
    for (let i = 0; i < 128; i++) {
        let note = 440 * Math.pow(semitone, (i - 69)); 
        midiNotes[i] = note.toFixed(2);
    }    
    return midiNotes;
}
const midiNotes = noteFreq();

// A-Major Pentatonic scale in 4 octaves
const majPenta = [ midiNotes[45], midiNotes[47], midiNotes[49], midiNotes[52], midiNotes[54],
                   midiNotes[57], midiNotes[59], midiNotes[61], midiNotes[64], midiNotes[66], 
                   midiNotes[69], midiNotes[71], midiNotes[73], midiNotes[76], midiNotes[78], 
                   midiNotes[81], midiNotes[83], midiNotes[85], midiNotes[88], midiNotes[90] ];

// A-Minor Pentatonic Scale in 4 octaves
const minPenta = [ midiNotes[45], midiNotes[48], midiNotes[50], midiNotes[52], midiNotes[55],
                   midiNotes[57], midiNotes[60], midiNotes[62], midiNotes[64], midiNotes[67], 
                   midiNotes[69], midiNotes[72], midiNotes[74], midiNotes[76], midiNotes[79], 
                   midiNotes[81], midiNotes[84], midiNotes[86], midiNotes[88], midiNotes[91] ];

// initialize the default scale
var notes = majPenta;

// select a random note from a scale
function getRndFreq(){
    return notes[Math.floor(Math.random() * notes.length)];
}

// generate a random pan value between -1 and 1 
// with two decimal places of precision
function getRndPan(){
    return (Math.floor(Math.random() * 200) + 1) / 100 - 1;
}