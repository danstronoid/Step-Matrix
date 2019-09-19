# Step-Matrix
*Web Audio API step-sequencer*
by Daniel Schwartz

Step Matrix is a fully featured step-sequencer with a max of 8 synthesized audio sources and a max of 16-steps.  Each synth source provides an oscillator, a FM oscillator, a filter section, a delay, and a track fader/pan.  Each step has a pitch and velocity input that can be optionally hidden.  The pitch input can take either a pitch class (ex. A5, Bb4, C#6, no double sharps/flats) or a midi note number (ex. 69 for A440).  "-" or any invalid input will default to the source's oscillator frequency control. The velocity input takes any value between 0 and 127.

TODO:
- add option to save a user config 
- add an export wav feature
- add global fx controls

Check it out: https://step-matrix.herokuapp.com/

