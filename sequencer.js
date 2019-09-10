import {SynthOsc, SynthNoise} from './modules/osc.js';

// for cross browser compatibility
const AudioContext = window.AudioContext || window.webkitAudioContext;
const audioCtx = new AudioContext();

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
    this.pan = Number($('#' + source).find('#pan').val());
    this.vol = Number($('#' + source).find('#volume').val());
}

// responsible for playing the scheduled notes
//const notesInQueue = [];
function scheduleNote() {
    //notesInQueue.push({note: beatNumber, time: time});

    if ($('#track0').find('#b' + currentNote).hasClass('active')) { 
        let x;       
        let params1 = new SynthObj("source1");
        if (params1.oscType == 'noise') {
            x = new SynthNoise(audioCtx, params1);
        } else {
            x = new SynthOsc(audioCtx, params1);
        }
        x.play();   
    }

    if ($('#track1').find('#b' + currentNote).hasClass('active')) {
        let x;   
        let params2 = new SynthObj("source2");
        if (params2.oscType == 'noise') {
            x = new SynthNoise(audioCtx, params2);
        } else {
            x = new SynthOsc(audioCtx, params2);
        }
        x.play();   
    }

    if ($('#track2').find('#b' + currentNote).hasClass('active')) {
        let x;   
        let params3 = new SynthObj("source3");
        if (params3.oscType == 'noise') {
            x = new SynthNoise(audioCtx, params3);
        } else {
            x = new SynthOsc(audioCtx, params3);
        }
        x.play();  
    }

    if ($('#track3').find('#b' + currentNote).hasClass('active')) {
        let x;   
        let params4 = new SynthObj("source4");
        if (params4.oscType == 'noise') {
            x = new SynthNoise(audioCtx, params4);
        } else {
            x = new SynthOsc(audioCtx, params4);
        }
        x.play();  
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