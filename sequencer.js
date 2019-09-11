import {SynthOsc, SynthNoise} from './modules/osc.js';
import {Notes} from './modules/notes.js'

// for cross browser compatibility
const AudioContext = window.AudioContext || window.webkitAudioContext;
const audioCtx = new AudioContext();

// initialize our midi notes
const Note = new Notes;

let timerID; // create a timer

// timing and sequencer based on https://www.html5rocks.com/en/tutorials/audio/scheduling/ by Chris Wilson

// set the global tempo
let tempo = 140.0;

// set amount of time for the scheduler to schedule ahead
let lookahead = 0.0; // (ms)
let scheduleAheadTime = 0.0; // (sec)

// keep track of the current note in the pattern 
// and the amount of time until the next note 
let currentNote = 0;
let nextNoteTime = 0.0;
function nextNote() {
    const secondsPerBeat = 60.0 / tempo;
    nextNoteTime += (secondsPerBeat / 2);
    currentNote++;
    if (currentNote === 8) {
        currentNote = 0;
    }
}

// create an object containing synth parameters to pass to synth class
function SynthObj(source) {
    this.oscType = $('#' + source).find('#oscType').val();
    this.freq = $('#' + source).find('#freq').val();
    this.attack = Number($('#' + source).find('#attack').val());
    this.release = Number($('#' + source).find('#release').val());
    this.filter = Number($('#' + source).find('#filter').val());
    this.pan = Number($('#' + source).find('#pan').val());
    this.vol = Number($('#' + source).find('#volume').val());
}

// responsible for playing the scheduled notes
//const notesInQueue = [];
function scheduleNote() {
    //notesInQueue.push({note: beatNumber, time: time});

    if ($('#track0').find('#b' + currentNote).hasClass('active')) { 
        let source;       
        let params = new SynthObj("source1");

        // get midi note and set to freq
        let noteNum = Number($('#notes0').find('#n' + currentNote).val());
        params.freq = Note.midi(noteNum); 

        if (params.oscType == 'noise') {
            source = new SynthNoise(audioCtx, params);
        } else {
            source = new SynthOsc(audioCtx, params);
        }
        source.play();   
    }

}

// responsible for scheduling next note
function scheduler() {

    while (nextNoteTime < audioCtx.currentTime + scheduleAheadTime) {
        scheduleNote();
        nextNote();
    }
    timerID = window.setTimeout(scheduler, lookahead);
}

function setup() {

    let isPlaying = false;
  
    // button to start playback
    document.querySelector('#play').addEventListener('click', function() {
        isPlaying = !isPlaying;

        if (isPlaying) {
            if (audioCtx.state === 'suspended') {
                audioCtx.resume();
                console.log('playback resumed');
            }
            currentNote = 0;
            nextNoteTime = audioCtx.currentTime;
            scheduler();
        } else {
            window.clearTimeout(timerID);
        }
       
    });
}

window.addEventListener("load", setup, false);