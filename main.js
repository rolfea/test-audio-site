//import { wavetable } from './wavetable';

// globals
let AUDIO_CONTEXT;
const SWEEP_LENGTH = 2;
let ATTACK_TIME = 0.2;
let RELEASE_TIME = 0.5;


window.onload = () => {  
  init();
}

function init() {
  document.querySelector('#consent').addEventListener('click', () => {
    createAudioContext();
    initializeConsole();
  })  
}

function createAudioContext() {
  const AudioContext = window.AudioContext || window.webkitAudioContext;
  AUDIO_CONTEXT = new AudioContext();
}

function initializeConsole() {
  revealConsole();
  initializeButton("A", 440);
  initializeButton("B", 493.88);   
  initializeSlider("attack");
  initializeSlider("release");
}

function revealConsole() {
  document.querySelector(".console").style.display = "block"
}

function initializeButton(btnId, hertz) {
  document.querySelector(`#${btnId}`).addEventListener('click', () => {
    playSweep(AUDIO_CONTEXT, hertz);    
  });
}

function initializeSlider(sliderSelector) {
  const sliderElement = document.querySelector(`#${sliderSelector}`);
  sliderElement.addEventListener('input', (event) => {
    attackTime = Number(event.srcElement.value);
  }, false);
}

function playSweep(ctx, hertz) {
  let wave = ctx.createPeriodicWave(wavetable.real, wavetable.imag);

  let osc = generateOscillator(ctx, wave, hertz);
  let sweepEnv = generateSweepEnv(ctx, ATTACK_TIME, RELEASE_TIME, SWEEP_LENGTH);
  
  osc.connect(sweepEnv).connect(ctx.destination);
  osc.start();
  osc.stop(ctx.currentTime + SWEEP_LENGTH);
}

function generateOscillator(ctx, wave, hertz) {
  let osc = ctx.createOscillator();
  osc.setPeriodicWave(wave)
  osc.frequency.value = hertz;

  return osc;
}

function generateSweepEnv(ctx, attackTime, releaseTime, sweepLength) {
  let env = ctx.createGain();

  env.gain.cancelScheduledValues(ctx.currentTime);
  // attack
  env.gain.linearRampToValueAtTime(1, ctx.currentTime + attackTime);
  // release
  env.gain.linearRampToValueAtTime(0, ctx.currentTime + sweepLength - releaseTime);

  return env;
}