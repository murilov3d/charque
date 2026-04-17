export class InputHandler {
  constructor(dpadElements = {}) {
    this.direction = { x: 1, y: 0 }; // Default moving right
    this.nextDirection = { x: 1, y: 0 };
    
    // Swipe handling
    this.touchStartX = 0;
    this.touchStartY = 0;

    this.bindKeyboard();
    this.bindSwipe();
    this.bindDPad(dpadElements);
  }

  getDirection() {
    this.direction = { ...this.nextDirection };
    return this.direction;
  }

  setDirection(x, y) {
    // Prevent 180-degree turns
    if (this.direction.x === -x && x !== 0) return;
    if (this.direction.y === -y && y !== 0) return;
    this.nextDirection = { x, y };
  }

  bindKeyboard() {
    window.addEventListener('keydown', (e) => {
      switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          this.setDirection(0, -1);
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          this.setDirection(0, 1);
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          this.setDirection(-1, 0);
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          this.setDirection(1, 0);
          break;
      }
    });
  }

  bindSwipe() {
    window.addEventListener('touchstart', (e) => {
      this.touchStartX = e.changedTouches[0].screenX;
      this.touchStartY = e.changedTouches[0].screenY;
    }, { passive: false });

    window.addEventListener('touchend', (e) => {
      const touchEndX = e.changedTouches[0].screenX;
      const touchEndY = e.changedTouches[0].screenY;
      
      const dx = touchEndX - this.touchStartX;
      const dy = touchEndY - this.touchStartY;
      
      // Ignore small taps
      if (Math.abs(dx) < 30 && Math.abs(dy) < 30) return;

      if (Math.abs(dx) > Math.abs(dy)) {
        // Horizontal swipe
        if (dx > 0) this.setDirection(1, 0); // Right
        else this.setDirection(-1, 0); // Left
      } else {
        // Vertical swipe
        if (dy > 0) this.setDirection(0, 1); // Down
        else this.setDirection(0, -1); // Up
      }
    }, { passive: false });
  }

  bindDPad(elements) {
    if (elements.up) elements.up.addEventListener('touchstart', (e) => { e.preventDefault(); this.setDirection(0, -1); });
    if (elements.down) elements.down.addEventListener('touchstart', (e) => { e.preventDefault(); this.setDirection(0, 1); });
    if (elements.left) elements.left.addEventListener('touchstart', (e) => { e.preventDefault(); this.setDirection(-1, 0); });
    if (elements.right) elements.right.addEventListener('touchstart', (e) => { e.preventDefault(); this.setDirection(1, 0); });
    
    // Fallback bindings for mouse clicks on D-Pad on desktop testing
    if (elements.up) elements.up.addEventListener('mousedown', () => this.setDirection(0, -1));
    if (elements.down) elements.down.addEventListener('mousedown', () => this.setDirection(0, 1));
    if (elements.left) elements.left.addEventListener('mousedown', () => this.setDirection(-1, 0));
    if (elements.right) elements.right.addEventListener('mousedown', () => this.setDirection(1, 0));
  }
}
