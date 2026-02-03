import { CONFIG, COLORS } from './constants.js';
import { GameState } from './state.js';
import { Renderer } from './renderer.js';
import { InputHandler } from './input.js';
import { UI } from './ui.js';
import { getRoadCenterAt, getRandomInt } from './utils.js';

class Game {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.state = new GameState();
        
        this.renderer = new Renderer(this.canvas, this.ctx, this.state);
        this.input = new InputHandler(this.canvas, this.state);
        this.ui = new UI(
            this.state, 
            null, 
            () => this.restart()
        );
        this.ui.setLanguage(this.state.currentLanguage);

        window.addEventListener('resize', () => this.resize());
        this.resize();
        
        this.init();
        this.loop();
    }

    resize() {
        const maxWidth = Math.min(CONFIG.CANVAS_WIDTH, window.innerWidth - 40);
        const aspectRatio = CONFIG.CANVAS_HEIGHT / CONFIG.CANVAS_WIDTH;
        this.canvas.width = maxWidth;
        this.canvas.height = maxWidth * aspectRatio;
        this.state.updateCarPosition(this.canvas.width, this.canvas.height);
    }

    init() {
        this.initRoad();
        this.generateQuestion();
        this.startCountdown();
    }

    startCountdown() {
        this.state.gameRunning = false;
        this.state.isCountingDown = true;
        this.state.countdownValue = CONFIG.COUNTDOWN_DURATION;
        
        const timer = setInterval(() => {
            this.state.countdownValue--;
            if (this.state.countdownValue <= 0) {
                clearInterval(timer);
                this.state.isCountingDown = false;
                this.state.gameRunning = true;
            }
        }, 1000);
    }

    restart() {
        this.state.reset();
        this.state.updateCarPosition(this.canvas.width, this.canvas.height);
        this.ui.updateScore();
        this.ui.updateLives();
        this.ui.updateSpeed();
        this.ui.hideGameOver();
        this.init();
    }

    initRoad() {
        this.state.roadPoints = [];
        let centerX = this.canvas.width / 2;
        const roadHalfWidth = (this.canvas.width * CONFIG.ROAD_WIDTH_PERCENT) / 2;

        for (let i = -10; i < CONFIG.INITIAL_ROAD_POINTS; i++) {
            const y = i * CONFIG.SEGMENT_HEIGHT;
            centerX += (Math.random() - 0.5) * this.canvas.width * 0.05;
            centerX = Math.max(roadHalfWidth + this.canvas.width * 0.1,
                Math.min(this.canvas.width - roadHalfWidth - this.canvas.width * 0.1, centerX));
            this.state.roadPoints.push({ x: centerX, y: y });
        }
    }

    generateQuestion() {
        // Dynamic Difficulty based on score
        let maxNum = 5;
        if (this.state.score > 10) maxNum = 7;
        if (this.state.score > 20) maxNum = 10;

        const a = getRandomInt(1, maxNum);
        const b = getRandomInt(1, maxNum);
        const correctAnswer = a * b;

        let wrongAnswer;
        do {
            const offset = getRandomInt(1, 5);
            wrongAnswer = correctAnswer + (Math.random() > 0.5 ? offset : -offset);
        } while (wrongAnswer === correctAnswer || wrongAnswer < 1);

        this.state.currentQuestion = { a, b, correct: correctAnswer };

        const answerY = -this.state.roadOffset - 150;
        const roadCenter = getRoadCenterAt(answerY, this.state.roadPoints);
        const spacing = this.canvas.width * CONFIG.ANSWER_SPACING_PERCENT;

        const leftX = roadCenter - spacing;
        const rightX = roadCenter + spacing;
        const correctOnLeft = Math.random() > 0.5;

        const answerWidth = this.canvas.width * CONFIG.ANSWER_WIDTH_PERCENT;
        const answerHeight = this.canvas.height * CONFIG.ANSWER_HEIGHT_PERCENT;

        this.state.answers = [
            {
                value: correctOnLeft ? correctAnswer : wrongAnswer,
                correct: correctOnLeft,
                x: leftX - answerWidth / 2,
                y: answerY,
                width: answerWidth,
                height: answerHeight,
                collected: false
            },
            {
                value: correctOnLeft ? wrongAnswer : correctAnswer,
                correct: !correctOnLeft,
                x: rightX - answerWidth / 2,
                y: answerY,
                width: answerWidth,
                height: answerHeight,
                collected: false
            }
        ];

        this.ui.updateQuestion(a, b);
    }

    update() {
        if (!this.state.gameRunning) return;

        this.state.roadOffset += this.state.speed;
        this.updateRoad();
        this.updateAnswerPositions();
        this.input.update();
        this.updateConfetti();

        this.checkAnswerCollision();
        this.checkMissedAnswers();

        if (this.checkRoadCollision()) {
            this.gameOver();
        }
    }

    updateRoad() {
        const { roadPoints, roadOffset } = this.state;
        const roadHalfWidth = (this.canvas.width * CONFIG.ROAD_WIDTH_PERCENT) / 2;

        while (roadPoints[0].y + roadOffset > -CONFIG.ROAD_BUFFER) {
            const firstPoint = roadPoints[0];
            let newX = firstPoint.x + (Math.random() - 0.5) * this.canvas.width * 0.05;
            newX = Math.max(roadHalfWidth + this.canvas.width * 0.1,
                Math.min(this.canvas.width - roadHalfWidth - this.canvas.width * 0.1, newX));
            roadPoints.unshift({ x: newX, y: firstPoint.y - CONFIG.SEGMENT_HEIGHT });
        }

        while (roadPoints.length > 0 && roadPoints[roadPoints.length - 1].y + roadOffset > this.canvas.height + CONFIG.ROAD_BUFFER) {
            roadPoints.pop();
        }
    }

    updateAnswerPositions() {
        const spacing = this.canvas.width * CONFIG.ANSWER_SPACING_PERCENT;
        this.state.answers.forEach((answer, i) => {
            const roadCenter = getRoadCenterAt(answer.y, this.state.roadPoints);
            const isLeft = i === 0;
            answer.x = roadCenter + (isLeft ? -spacing : spacing) - answer.width / 2;
        });
    }

    updateConfetti() {
        this.state.confetti = this.state.confetti.filter(c => {
            c.x += c.vx;
            c.y += c.vy;
            c.vy += 0.3;
            c.life -= 0.02;
            return c.life > 0;
        });
    }

    createConfetti(x, y) {
        for (let i = 0; i < CONFIG.CONFETTI_COUNT; i++) {
            this.state.confetti.push({
                x, y,
                vx: (Math.random() - 0.5) * 10,
                vy: (Math.random() - 0.5) * 10 - 5,
                color: COLORS.CONFETTI[Math.floor(Math.random() * COLORS.CONFETTI.length)],
                size: Math.random() * 8 + 4,
                life: 1
            });
        }
    }

    checkAnswerCollision() {
        const { car, answers, roadOffset } = this.state;
        answers.forEach(answer => {
            if (answer.collected) return;

            const answerScreenY = answer.y + roadOffset;

            if (car.x < answer.x + answer.width &&
                car.x + car.width > answer.x &&
                car.y < answerScreenY + answer.height &&
                car.y + car.height > answerScreenY) {

                answer.collected = true;

                if (answer.correct) {
                    this.createConfetti(answer.x + answer.width / 2, answerScreenY + answer.height / 2);
                    this.state.score++;
                    this.ui.updateScore();

                    if (this.state.score % CONFIG.SPEED_UP_INTERVAL === 0) {
                        this.state.speed += CONFIG.SPEED_INCREMENT;
                        this.ui.updateSpeed();
                    }

                    setTimeout(() => this.generateQuestion(), 500);
                } else {
                    this.handleWrongAction();
                }
            }
        });
    }

    handleWrongAction() {
        this.state.lives--;
        this.ui.updateLives();
        
        if (this.state.lives <= 0) {
            this.gameOver();
        } else {
            // Give temporary invulnerability or just clear current answers
            this.state.answers.forEach(a => a.collected = true);
            // Visual feedback: flash car or something is handled by renderer if we want
            setTimeout(() => this.generateQuestion(), 500);
        }
    }

    checkMissedAnswers() {
        const anyPassed = this.state.answers.some(answer => answer.y + this.state.roadOffset > this.state.car.y + this.state.car.height + 20);
        const noneCollected = this.state.answers.every(answer => !answer.collected);

        if (anyPassed && noneCollected) {
            this.handleWrongAction();
        }
    }

    checkRoadCollision() {
        const { car, roadOffset, roadPoints } = this.state;
        const carFrontY = car.y;
        const carBackY = car.y + car.height;

        const roadCenterFront = getRoadCenterAt(carFrontY - roadOffset, roadPoints);
        const roadCenterBack = getRoadCenterAt(carBackY - roadOffset, roadPoints);
        const roadPixelWidth = this.canvas.width * CONFIG.ROAD_WIDTH_PERCENT;

        const leftEdgeFront = roadCenterFront - roadPixelWidth / 2;
        const rightEdgeFront = roadCenterFront + roadPixelWidth / 2;
        const leftEdgeBack = roadCenterBack - roadPixelWidth / 2;
        const rightEdgeBack = roadCenterBack + roadPixelWidth / 2;

        return car.x < leftEdgeFront || car.x + car.width > rightEdgeFront ||
            car.x < leftEdgeBack || car.x + car.width > rightEdgeBack;
    }

    gameOver() {
        this.state.gameRunning = false;
        this.ui.showGameOver();
    }

    loop() {
        this.update();
        this.renderer.render();
        requestAnimationFrame(() => this.loop());
    }
}

// Start the game
new Game();
