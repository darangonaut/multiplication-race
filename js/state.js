import { CONFIG, BIOMES } from './constants.js';

export class GameState {
    constructor() {
        this.currentLanguage = 'cs';
        this.mistakes = []; // Smart Learning storage
        this.reset();
    }

    reset() {
        this.gameRunning = false;
        this.isCountingDown = false;
        this.countdownValue = 0;
        this.lives = CONFIG.MAX_LIVES;
        this.score = 0;
        this.speed = CONFIG.INITIAL_SPEED;
        this.roadOffset = 0;
        this.currentBiome = BIOMES[0];
        this.car = {
            x: 0,
            y: 0,
            width: CONFIG.CAR_WIDTH,
            height: CONFIG.CAR_HEIGHT,
            speed: CONFIG.CAR_SPEED
        };
        this.currentQuestion = {};
        this.answers = [];
        this.roadPoints = [];
        this.confetti = [];
        this.keys = {};
        this.isTouching = false;
    }

    updateCarPosition(canvasWidth, canvasHeight) {
        this.car.x = canvasWidth / 2 - this.car.width / 2;
        this.car.y = canvasHeight - 100;
    }
}
