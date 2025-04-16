'use client';

export class GameTimer {
  constructor() {
    this.totalPeriodSeconds = 8 * 60; // 20 minutes per period
    this.elapsedSeconds = 0;
    this.isRunning = false;
    this.timerInterval = null;
  }

  start() {
    if (!this.isRunning) {
      this.isRunning = true;
      this.timerInterval = setInterval(() => {
        if (this.elapsedSeconds < this.totalPeriodSeconds) {
          this.elapsedSeconds++;
        } else {
          this.stop();
        }
      }, 1000);
    }
  }

  stop() {
    if (this.isRunning) {
      this.isRunning = false;
      clearInterval(this.timerInterval);
    }
  }

  reset() {
    this.stop();
    this.elapsedSeconds = 0;
  }

  getTimeString() {
    const remainingSeconds = this.totalPeriodSeconds - this.elapsedSeconds;
    const minutes = Math.floor(remainingSeconds / 60);
    const seconds = remainingSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }

  getElapsedTimeString() {
    const minutes = Math.floor(this.elapsedSeconds / 60);
    const seconds = this.elapsedSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }

  getStatus() {
    return {
      timeString: this.getTimeString(),
      elapsedTimeString: this.getElapsedTimeString(),
      isRunning: this.isRunning,
      elapsedSeconds: this.elapsedSeconds
    };
  }
}

export const createGameTimer = () => new GameTimer();