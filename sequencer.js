// timing and sequencer based on https://www.html5rocks.com/en/tutorials/audio/scheduling/ by Chris Wilson

import {SynthOsc, SynthNoise} from './modules/osc.js';
import {Notes} from './modules/notes.js'

// for cross browser compatibility
const AudioContext = window.AudioContext || window.webkitAudioContext;
const audioCtx = new AudioContext();

// initialize our midi notes
const Note = new Notes;

// keep track of the sources
let sourceCount = 0;

let timerID; // create a timer

// set the global tempo
let tempo = Number($('#tempo').val());

// set amount of time for the scheduler to schedule ahead
let lookahead = 25.0; // (ms)
let scheduleAheadTime = 0.1; // (sec)

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
function SynthObj(parameters) {
    this.oscType = $('#' + parameters).find('#oscType').val();
    this.freq = $('#' + parameters).find('#freq').val();
    this.attack = Number($('#' + parameters).find('#attack').val());
    this.release = Number($('#' + parameters).find('#release').val());
    this.filter = Number($('#' + parameters).find('#filter').val());
    this.pan = Number($('#' + parameters).find('#pan').val());
    this.vol = Number($('#' + parameters).find('#volume').val());
}

// responsible for playing the scheduled notes
function scheduleNote(beat, time) {
    for (let i = 0; i <= sourceCount; ++i) {
        if ($('#track' + i).find('#b' + beat).hasClass('active')) { 
            let source;       
            let params = new SynthObj("parameters" + i);
    
            // get midi note and set to freq
            let noteNum = Number($('#notes' + i).find('#n' + beat).val());
            params.freq = Note.midi(noteNum); 
    
            if (params.oscType == 'noise') {
                source = new SynthNoise(audioCtx, params);
            } else {
                source = new SynthOsc(audioCtx, params);
            }
            source.play(time);   
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
    
    let isPlaying = false;

    // listen for tempo changes
    $('#tempo').change( () => {
        tempo = Number($('#tempo').val());
        console.log("tempo = " + tempo);
    });

    // add a new source
    $('#addSource').on('click', () => {
        if (sourceCount < 3) {
            ++sourceCount;
            $('#notes0').clone().attr('id', 'notes' + sourceCount).appendTo('tbody');
            $('#track0').clone().attr('id', 'track' + sourceCount).appendTo('tbody');
            $('#parameters0').clone().attr('id', 'parameters' + sourceCount).appendTo('body');
            $('#track' + sourceCount).find("#controls").attr('data-target', '#parameters' + sourceCount);
        }     
    });

    // remove a source
    $('#rmSource').on('click', () => {
        if (sourceCount > 0) {
            $('#notes' + sourceCount).remove();
            $('#track' + sourceCount).remove();
            $('#parameters' + sourceCount).remove();
            --sourceCount;
        }
    });
    
  
    // button to start playback
    $('#play').on('click', () => {
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