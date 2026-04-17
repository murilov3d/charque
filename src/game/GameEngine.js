import { Haptics } from './Haptics';

export const GRID_SIZE = 20; // 20x20 logic grid
export const BASE_SPEED = 150; // ms per tick
export const MIN_SPEED = 60; // ms per tick

const FOOD_EMOJIS = ['🐟', '🐙', '🦑', '🦀'];

export class GameEngine {
  constructor() {
    this.reset();
  }

  reset() {
    this.snake = [
      { x: 10, y: 10 },
      { x: 9, y: 10 },
      { x: 8, y: 10 }
    ];
    this.score = 0;
    this.speed = BASE_SPEED;
    this.isGameOver = false;
    this.spawnFood();
  }

  spawnFood() {
    let newFood;
    let valid = false;
    while (!valid) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
        type: FOOD_EMOJIS[Math.floor(Math.random() * FOOD_EMOJIS.length)]
      };
      // Make sure food is not on snake
      valid = !this.snake.some(segment => segment.x === newFood.x && segment.y === newFood.y);
    }
    this.food = newFood;
  }

  update(direction) {
    if (this.isGameOver) return;

    const head = { ...this.snake[0] };
    head.x += direction.x;
    head.y += direction.y;

    // Colisão com as paredes
    if (head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE) {
      this.triggerGameOver();
      return;
    }

    // Colisão com o próprio corpo
    // Ignoramos o último segmento do rabo pois ele vai sair se não comermos
    for (let i = 0; i < this.snake.length - 1; i++) {
        const seg = this.snake[i];
        if (seg.x === head.x && seg.y === head.y) {
            this.triggerGameOver();
            return;
        }
    }

    this.snake.unshift(head);

    // Comer comida
    if (head.x === this.food.x && head.y === this.food.y) {
      this.score += 10;
      this.speed = Math.max(MIN_SPEED, this.speed - 2); // Increases difficulty gradually
      Haptics.eat();
      this.spawnFood();
      // Não damos pop() no rabo, ele cresce.
    } else {
      this.snake.pop(); // Remove o rabo para manter o tamanho
    }
  }

  triggerGameOver() {
    this.isGameOver = true;
    Haptics.gameOver();
  }
}
