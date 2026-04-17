import './style.css';
import { GameEngine } from './game/GameEngine';
import { Renderer } from './game/Renderer';
import { InputHandler } from './game/InputHandler';

const canvas = document.getElementById('gameCanvas');
const valScore = document.getElementById('valScore');
const valHighScore = document.getElementById('valHighScore');
const btnStart = document.getElementById('btnStart');
const mainMenu = document.getElementById('mainMenu');
const gameOverText = document.getElementById('gameOverText');
const scorePanel = document.getElementById('scorePanel');
const dpadEl = document.getElementById('dpad');

let engine = new GameEngine();
let renderer = new Renderer(canvas);

// Virtual D-Pad bindings
const dpadElements = {
  up: document.getElementById('dpadUp'),
  down: document.getElementById('dpadDown'),
  left: document.getElementById('dpadLeft'),
  right: document.getElementById('dpadRight')
};
let inputHandler = new InputHandler(dpadElements);

// State
let lastTime = 0;
let accumulator = 0;
let prevSnakeState = null;
let animationFrameId = null;
let isPlaying = false;

// Load High Score
let highScore = localStorage.getItem('charque_highscore') || 0;
valHighScore.textContent = highScore;

// Music System
const playlist = ['./musicas/track1.mp3', './musicas/track2.mp3'];
let currentTrackIndex = 0;
const bgMusic = new Audio(playlist[currentTrackIndex]);
bgMusic.volume = 0.5;

bgMusic.addEventListener('ended', () => {
  currentTrackIndex = (currentTrackIndex + 1) % playlist.length;
  bgMusic.src = playlist[currentTrackIndex];
  bgMusic.play().catch(e => console.log('Audio error:', e));
});

// Resize handling
window.addEventListener('resize', () => {
  renderer.resize();
  if (!isPlaying) {
    renderer.draw(engine, engine.snake, 1);
  }
});
renderer.resize();

function updateUI() {
  valScore.textContent = engine.score;
  if (engine.score > highScore) {
    highScore = engine.score;
    valHighScore.textContent = highScore;
    localStorage.setItem('charque_highscore', highScore);
  }
}

function startGame() {
  mainMenu.classList.add('opacity-0');
  mainMenu.classList.add('pointer-events-none');
  setTimeout(() => mainMenu.classList.add('hidden'), 300);
  
  // Show dpad on touch devices primarily if you like, or always. We'll show it universally if mobile mode context is needed.
  if ('ontouchstart' in window) {
      dpadEl.classList.remove('hidden');
      dpadEl.classList.add('flex');
  }

  engine.reset();
  inputHandler.setDirection(1, 0); // Reset initial direction
  bgMusic.play().catch(e => console.log('Audio autoplay prevented'));
  isPlaying = true;
  lastTime = performance.now();
  accumulator = 0;
  prevSnakeState = JSON.parse(JSON.stringify(engine.snake));

  if (animationFrameId) cancelAnimationFrame(animationFrameId);
  animationFrameId = requestAnimationFrame(gameLoop);
}

function handleGameOver() {
  isPlaying = false;
  bgMusic.pause();
  cancelAnimationFrame(animationFrameId);
  
  gameOverText.classList.remove('hidden');
  gameOverText.classList.add('flex');
  
  mainMenu.classList.remove('hidden');
  // Trigger reflow to apply transition
  void mainMenu.offsetWidth;
  mainMenu.classList.remove('opacity-0');
  mainMenu.classList.remove('pointer-events-none');
  
  dpadEl.classList.add('hidden');
  dpadEl.classList.remove('flex');
}

function gameLoop(time) {
  if (!isPlaying) return;

  const dt = time - lastTime;
  lastTime = time;

  accumulator += dt;

  // Fixed time step update based on engine speed
  while (accumulator >= engine.speed) {
    // Save previous state for interpolation
    prevSnakeState = JSON.parse(JSON.stringify(engine.snake));
    const previousScore = engine.score;

    engine.update(inputHandler.getDirection());
    
    if (engine.score > previousScore) {
       // Just ate food, emit particles precisely at food old position
       if (prevSnakeState[0]) {
           renderer.emitParticles(prevSnakeState[0].x, prevSnakeState[0].y, '#ff003c');
       }
    }

    accumulator -= engine.speed;

    if (engine.isGameOver) {
      handleGameOver();
      return;
    }
  }

  // Fraction for linear interpolation
  const lerpFraction = accumulator / engine.speed;
  
  // Rendering
  renderer.draw(engine, prevSnakeState, lerpFraction);
  updateUI();

  animationFrameId = requestAnimationFrame(gameLoop);
}

// Bind Starts
btnStart.addEventListener('click', startGame);

// Draw initial idle frame
renderer.draw(engine, engine.snake, 1);
