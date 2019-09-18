// timing and sequencer based on https://www.html5rocks.com/en/tutorials/audio/scheduling/ by Chris Wilson

import {SynthOsc, SynthNoise} from './modules/osc.js';
import {Notes} from './modules/notes.js'
import { Fx } from './modules/fx.js';

// for cross browser compatibility
const AudioContext = window.AudioContext || window.webkitAudioContext;
const audioCtx = new AudioContext();

// set amount of time for the scheduler to schedule ahead
const lookahead = 25.0; // (ms)
const scheduleAheadTime = 0.1; // (sec)

let timerID; // create a timer

const Note = new Notes; // initialize note class with a table of midi note values

let sourceCount = 0; // keep track of the number of sources
let stepCount = 7; // keep track of the number of steps

let tempo = Number($('#tempo').val()); // set the global tempo
let currentNote = 0; // keep track of the current note in the pattern 
let nextNoteTime = 0.0; // the amount of time until the next note 

// this calculates the amount of time until the next note and updates the current note
function nextNote() {
    let subdivision = Number($('#subdivision').val());
    const secondsPerBeat = 60.0 / tempo;
    nextNoteTime += (secondsPerBeat / subdivision);
    currentNote++;
    if (currentNote === stepCount + 1) {
        currentNote = 0;
    }
}

// an object containing arguments to pass to the source class
function SourceArgs(parameters) {
    this.oscType = $('#' + parameters).find('#oscType').val();
    this.freq = $('#' + parameters).find('#freq').val();
    this.attack = Number($('#' + parameters).find('#attack').val());
    this.release = Number($('#' + parameters).find('#release').val());
    this.modType = $('#' + parameters).find('#modType').val();
    this.multi = $('#' + parameters).find('#multi').val();
    this.modDepth = Number($('#' + parameters).find('#modDepth').val());
}

// an object containing arguments to pass to the fx class
function FxArgs(parameters) {
    this.delay = Number($('#' + parameters).find('#delay').val());
    this.dLvl = Number($('#' + parameters).find('#dLvl').val());
    this.dPan = Number($('#' + parameters).find('#dPan').val());
    this.filter = Number($('#' + parameters).find('#filter').val());
    this.ftype = $('#' + parameters).find('#fType').val();
    this.fattack = Number($('#' + parameters).find('#fattack').val());
    this.frelease = Number($('#' + parameters).find('#frelease').val());
    this.pan = Number($('#' + parameters).find('#pan').val());
    this.vol = Number($('#' + parameters).find('#volume').val());
}

// responsible for playing the scheduled notes
function scheduleNote(beat, time) {
    for (let i = 0; i <= sourceCount; ++i) {
        if ($('#track' + i).find('#b' + beat).hasClass('active')) { 
            let source;       
            let sourceArgs = new SourceArgs('parameters' + i);
            let fxArgs = new FxArgs('parameters' + i);
    
            // get midi note and set to freq
            let n = $('#notes' + i).find('#n' + beat).val();

            sourceArgs.freq = Note.pitch(n) || Note.midi(Number(n)) || sourceArgs.freq;
    
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
        } else {
            /* $('#track' + i).find('#b' + beat).attr('class', 'btn btn-light btn-outline-danger btn-lg');
            setTimeout( () => {
                $('#track' + i).find('#b' + beat).attr('class', 'btn btn-light btn-outline-dark btn-lg');
            }, 200); */
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
        if (sourceCount < 5) {
            ++sourceCount;
            $('#notes0').clone().attr('id', 'notes' + sourceCount).appendTo('tbody');
            $('#track0').clone().attr('id', 'track' + sourceCount).appendTo('tbody');
            $('#parameters0').clone().attr('id', 'parameters' + sourceCount).appendTo('body');
            $('#parameters' + sourceCount).find('#parametersLabel').text('Source ' + (sourceCount + 1) + ' Controls')
            $('#track' + sourceCount).find("#controls").attr('data-target', '#parameters' + sourceCount).text('S' + (sourceCount + 1));

            for (let i = 0; i <= stepCount; ++i) {
                $('#notes' + sourceCount).find('#n' + i).val('-');
                $('#track' + sourceCount).find('#b' + i).attr('class', 'btn btn-light btn-outline-dark btn-lg step');
            }
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

    // add a new step
    $('#addStep').on('click', () => {
        if (stepCount < 15) {
            ++stepCount;

            // create a new step for each source
            for (let i = 0; i <= sourceCount; ++i) {
                let cloneB = $('#b0').clone().attr('id', 'b' + stepCount).attr('class', 'btn btn-light btn-outline-dark btn-lg step').text(stepCount + 1);
                let newB = $('<td></td>').html(cloneB);
                $('#track' + i).append(newB);

                let cloneN = $('#n0').clone().attr('id', 'n' + stepCount).val('-');
                let newN = $('<td></td>').html(cloneN);
                $('#notes' + i).append(newN);
            }
        }   
    });

    // remove a step
    $('#rmStep').on('click', () => {
        if (stepCount > 0) {
            // remove the step for all sources
            for (let i = 0; i <= sourceCount; ++i) {
                $('#track' + i).find('#b' + stepCount).parent().remove();

                $('#notes' + i).find('#n' + stepCount).parent().remove();
            }
            --stepCount;
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