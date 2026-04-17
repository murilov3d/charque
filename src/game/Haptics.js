export class Haptics {
  static vibrate(pattern) {
    if ('vibrate' in navigator) {
      try {
        navigator.vibrate(pattern);
      } catch (e) {
        console.warn('Vibration failed', e);
      }
    }
  }

  static eat() {
    this.vibrate(50); // Light, short vibration
  }

  static gameOver() {
    this.vibrate([200, 100, 300]); // Heavier pattern
  }
}
