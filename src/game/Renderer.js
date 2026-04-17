import { GRID_SIZE } from './GameEngine';

export class Renderer {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.particles = [];
  }

  resize() {
    // Make canvas full resolution
    this.canvas.width = window.innerWidth * window.devicePixelRatio;
    this.canvas.height = window.innerHeight * window.devicePixelRatio;
    
    // Calcula o tamanho da célula (cell size) para caber GRID_SIZE na tela inteira
    // Mantendo proporção quadrada, mas centrado.
    const smallestSide = Math.min(this.canvas.width, this.canvas.height);
    this.cellSize = smallestSide / GRID_SIZE;
    
    this.offsetX = (this.canvas.width - (this.cellSize * GRID_SIZE)) / 2;
    this.offsetY = (this.canvas.height - (this.cellSize * GRID_SIZE)) / 2;
  }

  // Interpolação Linear para fluidez
  lerp(start, end, amt) {
    return (1 - amt) * start + amt * end;
  }

  // Chamado no exato momento que come a comida
  emitParticles(x, y, color) {
    const screenX = this.offsetX + x * this.cellSize + this.cellSize / 2;
    const screenY = this.offsetY + y * this.cellSize + this.cellSize / 2;
    
    for (let i = 0; i < 15; i++) {
      this.particles.push({
        x: screenX,
        y: screenY,
        vx: (Math.random() - 0.5) * 10,
        vy: (Math.random() - 0.5) * 10,
        life: 1.0,
        color: color
      });
    }
  }

  updateParticles() {
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.life -= 0.05;
      if (p.life <= 0) {
        this.particles.splice(i, 1);
      }
    }
  }

  draw(engine, prevSnake, lerpFraction) {
    // Clear background
    this.ctx.fillStyle = '#0f172a'; // tailwind slate-900
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    // Draw grid border limits
    this.ctx.shadowBlur = 20;
    this.ctx.shadowColor = 'rgba(0, 243, 255, 0.5)';
    this.ctx.strokeStyle = '#00f3ff';
    this.ctx.lineWidth = 4;
    this.ctx.strokeRect(this.offsetX, this.offsetY, this.cellSize * GRID_SIZE, this.cellSize * GRID_SIZE);
    
    // Draw particles
    this.updateParticles();
    this.particles.forEach(p => {
      this.ctx.shadowBlur = 10;
      this.ctx.shadowColor = p.color;
      this.ctx.fillStyle = p.color;
      this.ctx.globalAlpha = p.life;
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, this.cellSize * 0.1, 0, Math.PI * 2);
      this.ctx.fill();
      this.ctx.globalAlpha = 1.0;
    });

    // Draw snake segments with interpolation
    for (let i = 0; i < engine.snake.length; i++) {
        const current = engine.snake[i];
        
        let visualX = current.x;
        let visualY = current.y;

        // Tenta interporlar apenas se tivermos os quadros anteriores
        // Para fluidez entre as lógicas (ticks) e a tela (frames).
        if (prevSnake && prevSnake[i]) {
            const prev = prevSnake[i];
            
            // Corrige interpolação estranha quando o segmento spawna no fim do array ou no teleport 
            // Como é um canvas contínuo e gameOver morre nas paredes, não há cross border jump (wall wrap) real.
            const distance = Math.abs(current.x - prev.x) + Math.abs(current.y - prev.y);
            if (distance === 1) { // Só dar lerp se estiver lado a lado
               visualX = this.lerp(prev.x, current.x, lerpFraction);
               visualY = this.lerp(prev.y, current.y, lerpFraction);
            }
        }

        const screenX = this.offsetX + visualX * this.cellSize;
        const screenY = this.offsetY + visualY * this.cellSize;

        
        this.ctx.shadowBlur = 15;
        if (i === 0) {
            // Head (Tubarão)
            this.ctx.fillStyle = '#00f3ff'; // Neon blue
            this.ctx.shadowColor = '#00f3ff';
        } else {
            // Body
            this.ctx.fillStyle = 'rgba(0, 243, 255, 0.8)';
            this.ctx.shadowColor = 'transparent'; // Menos glow no corpo inteiro para performance
        }
        
        this.ctx.beginPath();
        // Aumenta levemente as curvas simulando esferas aglutinadas
        this.ctx.roundRect(screenX + 2, screenY + 2, this.cellSize - 4, this.cellSize - 4, 8);
        this.ctx.fill();
    }

    // Draw Food
    if (engine.food) {
        this.ctx.shadowBlur = 15;
        this.ctx.shadowColor = '#ff003c'; // Neon pink glow
        this.ctx.font = `${this.cellSize * 0.8}px serif`;
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        
        const foodX = this.offsetX + engine.food.x * this.cellSize + this.cellSize / 2;
        const foodY = this.offsetY + engine.food.y * this.cellSize + this.cellSize / 2;
        
        this.ctx.fillText(engine.food.type, foodX, foodY);
    }

    this.ctx.shadowBlur = 0; // reset
  }
}
