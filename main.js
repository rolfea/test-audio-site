//import { wavetable } from './wavetable';
let audioContext;

window.onload = () => {  
  init();
}

function init() {
  document.querySelector('#consent').addEventListener('click', () => {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    audioContext = new AudioContext();
    revealConsole(); 
    initializeButton("A", 440);
    initializeButton("B", 493.88);   
  })  
}

function revealConsole() {
  document.querySelector(".console").style.display = "block"
}

function initializeButton(btnId, hertz) {
  document.querySelector(`#${btnId}`).addEventListener('click', () => {
    audioContext.resume().then( () => {
      playSweep(audioContext, hertz);
    });
  });
}

let sweepLength = 2;
function playSweep(ctx, hertz) {
  let wave = ctx.createPeriodicWave(wavetable.real, wavetable.imag);

  let osc = ctx.createOscillator();
  osc.setPeriodicWave(wave);
  osc.frequency.value = hertz;

  let sweepEnv = ctx.createGain();
  sweepEnv.gain.cancelScheduledValues(ctx.currentTime);
  // attack
  sweepEnv.gain.linearRampToValueAtTime(1, ctx.currentTime + attackTime);
  // release
  sweepEnv.gain.linearRampToValueAtTime(0, ctx.currentTime + sweepLength - releaseTime);

  osc.connect(sweepEnv).connect(ctx.destination);
  osc.start();
  osc.stop(ctx.currentTime + sweepLength);
}

let attackTime = 0.2;
const attackControl = document.querySelector('#attack');
attackControl.addEventListener('input', (event) => {
  attackTime = Number(event.srcElement.value);
}, false);

let releaseTime = 0.5;
const releaseControl = document.querySelector('#release');
releaseControl.addEventListener('input', () => {
  releaseTime = Number(event.srcElement.value);
}, false);

