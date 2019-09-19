// timing and sequencer based on https://www.html5rocks.com/en/tutorials/audio/scheduling/ by Chris Wilson

import {SynthOsc, SynthNoise} from './osc.js';
import {Notes} from './notes.js';
import {SourceArgs, FxArgs, loadArgs} from './argobj.js';
import {addSource, rmSource, addStep, rmStep} from './add-rm.js';

// for cross browser compatibility
const AudioContext = window.AudioContext || window.webkitAudioContext;
const audioCtx = new AudioContext();

// set amount of time for the scheduler to schedule ahead
const lookahead = 25.0; // (ms)
const scheduleAheadTime = 0.1; // (sec)

let timerID; // create a timer

const Note = new Notes; // initialize note class with a table of midi note values

let count = {
    source: 0,
    step: 7
};

//let sourceCount = 0; // keep track of the number of sources
//let stepCount = 7; // keep track of the number of steps

let tempo = Number($('#tempo').val()); // set the global tempo
let currentNote = 0; // keep track of the current note in the pattern 
let nextNoteTime = 0.0; // the amount of time until the next note 

// this calculates the amount of time until the next note and updates the current note
function nextNote() {
    let subdivision = Number($('#subdivision').val());
    const secondsPerBeat = 60.0 / tempo;
    nextNoteTime += (secondsPerBeat / subdivision);
    currentNote++;
    if (currentNote === count.step + 1) {
        currentNote = 0;
    }
}

// responsible for playing the scheduled notes
function scheduleNote(beat, time) {
    for (let i = 0; i <= count.source; ++i) {
        if ($('#track' + i).find('#b' + beat).hasClass('active')) { 
            let source;       
            let sourceArgs = new SourceArgs('parameters' + i);
            let fxArgs = new FxArgs('parameters' + i);
    
            // get midi note and set to freq
            let n = $('#notes' + i).find('#n' + beat).val();
            sourceArgs.freq = Note.pitch(n) || Note.midi(Number(n)) || sourceArgs.freq;

            // get velocity
            let v = $('#veloc' + i).find('#v' + beat).val();
            sourceArgs.veloc = v || sourceArgs.veloc;

            // create and play source
            if (sourceArgs.oscType == 'noise') {
                source = new SynthNoise(audioCtx, sourceArgs, fxArgs);
            } else {
                source = new SynthOsc(audioCtx, sourceArgs, fxArgs);
            }
            source.play(time);

            $('#track' + i).find('#b' + beat).attr('class', 'btn btn-danger btn-lg step active');
            setTimeout( () => {
                $('#track' + i).find('#b' + beat).attr('class', 'btn btn-light btn-outline-dark btn-lg step active');
            }, 200);
        }
    }
}

// responsible for scheduling next note ahead of time
function scheduler() {
    while (nextNoteTime < audioCtx.currentTime + scheduleAheadTime) {
        scheduleNote(currentNote, nextNoteTime); //
        nextNote();
    }
    timerID = window.setTimeout(scheduler, lookahead);
}

function setup() {
    
    let defaultSource = new SourceArgs('parameters0');
    let defaultFx = new FxArgs('parameters0');

    // create three sources on load
    for (let i = 0; i < 3; ++i) {
        addSource(count);
    }

    let isPlaying = false;

    // listen for tempo changes
    $('#tempo').change( () => {
        tempo = Number($('#tempo').val());
        console.log("tempo = " + tempo);
    });

    // add a new source
    $('#addSource').on('click', () => {
        if (count.source < 7) {
            addSource(count);
            loadArgs('parameters' + count.source, defaultSource, defaultFx);
        }     
    });

    // remove a source
    $('#rmSource').on('click', () => {
        if (count.source > 0) {
            rmSource(count);
        }
    });

    // add a new step
    $('#addStep').on('click', () => {
        if (count.step < 15) {
            addStep(count);
        }   
    });

    // remove a step
    $('#rmStep').on('click', () => {
        if (count.step > 0) {
            rmStep(count);
        }
    });
    
    // hide/show pitches
    $('#pitch').on('click', () => {
        for (let i = 0; i <= count.source; ++i) {
            $('#notes' + i).toggle();
        }
    });

    //hide/show velocities
    $('#velocity').on('click', () => {
        for (let i = 0; i <= count.source; ++i) {
            $('#veloc' + i).toggle();
        }
    });
  
    // button to start playback
    $('#play').on('click', () => {
        isPlaying = !isPlaying;
        $('#play').text('■').attr('class', 'btn btn-danger btn-lg active');

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
            $('#play').text('►').attr('class', 'btn btn-success btn-lg');
        }
       
    });
}

window.addEventListener("load", setup, false);