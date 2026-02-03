import { CONFIG, COLORS } from './constants.js';

export class Renderer {
    constructor(canvas, ctx, state) {
        this.canvas = canvas;
        this.ctx = ctx;
        this.state = state;
    }

    clear() {
        this.ctx.fillStyle = this.state.currentBiome.grass;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }

    drawRoad() {
        const { roadPoints, roadOffset, currentBiome } = this.state;
        const visiblePoints = roadPoints
            .map(p => ({ x: p.x, y: p.y + roadOffset }))
            .filter(p => p.y >= -CONFIG.SEGMENT_HEIGHT && p.y <= this.canvas.height + CONFIG.SEGMENT_HEIGHT);

        if (visiblePoints.length < 2) return;

        const roadPixelWidth = this.canvas.width * CONFIG.ROAD_WIDTH_PERCENT;

        // Draw asphalt
        this.ctx.fillStyle = currentBiome.asphalt;
        this.ctx.beginPath();
        visiblePoints.forEach((p, i) => {
            const x = p.x - roadPixelWidth / 2;
            if (i === 0) this.ctx.moveTo(x, p.y);
            else this.ctx.lineTo(x, p.y);
        });
        for (let i = visiblePoints.length - 1; i >= 0; i--) {
            const p = visiblePoints[i];
            this.ctx.lineTo(p.x + roadPixelWidth / 2, p.y);
        }
        this.ctx.closePath();
        this.ctx.fill();

        // Draw center line
        this.ctx.strokeStyle = currentBiome.line;
        this.ctx.lineWidth = 3;
        this.ctx.setLineDash([20, 15]);
        this.ctx.beginPath();
        visiblePoints.forEach((p, i) => {
            if (i === 0) this.ctx.moveTo(p.x, p.y);
            else this.ctx.lineTo(p.x, p.y);
        });
        this.ctx.stroke();
        this.ctx.setLineDash([]);
    }

    drawAnswers() {
        const { answers, roadOffset } = this.state;
        answers.forEach(answer => {
            if (answer.collected) return;

            const y = answer.y + roadOffset;
            if (y < -100 || y > this.canvas.height + 100) return;

            // Shadow
            this.ctx.fillStyle = COLORS.ANSWER_SHADOW;
            this.ctx.fillRect(answer.x + 3, y + 3, answer.width, answer.height);

            // Box
            this.ctx.fillStyle = COLORS.ANSWER_BOX;
            this.ctx.fillRect(answer.x, y, answer.width, answer.height);

            // Border
            this.ctx.strokeStyle = COLORS.ANSWER_BORDER;
            this.ctx.lineWidth = 3;
            this.ctx.strokeRect(answer.x, y, answer.width, answer.height);

            // Text
            this.ctx.fillStyle = COLORS.ANSWER_TEXT;
            this.ctx.font = `bold ${this.canvas.width * 0.07}px Arial`;
            this.ctx.textAlign = 'center';
            this.ctx.textBaseline = 'middle';
            this.ctx.fillText(answer.value, answer.x + answer.width / 2, y + answer.height / 2);
        });
    }

    drawCar() {
        const { car } = this.state;
        // Car body
        this.ctx.fillStyle = COLORS.CAR_BODY;
        this.ctx.fillRect(car.x, car.y, car.width, car.height);

        // Windows
        this.ctx.fillStyle = COLORS.CAR_WINDOW;
        this.ctx.fillRect(car.x + 3, car.y + 5, car.width - 6, 15);
        this.ctx.fillRect(car.x + 3, car.y + 25, car.width - 6, 15);

        // Wheels
        this.ctx.fillStyle = COLORS.CAR_WHEEL;
        this.ctx.fillRect(car.x - 3, car.y + 5, 4, 10);
        this.ctx.fillRect(car.x + car.width - 1, car.y + 5, 4, 10);
        this.ctx.fillRect(car.x - 3, car.y + 35, 4, 10);
        this.ctx.fillRect(car.x + car.width - 1, car.y + 35, 4, 10);
    }

    drawConfetti() {
        this.state.confetti.forEach(c => {
            this.ctx.globalAlpha = c.life;
            this.ctx.fillStyle = c.color;
            this.ctx.beginPath();
            this.ctx.arc(c.x, c.y, c.size, 0, Math.PI * 2);
            this.ctx.fill();
        });
        this.ctx.globalAlpha = 1;
    }

    drawCountdown() {
        if (!this.state.isCountingDown) return;

        this.ctx.fillStyle = 'rgba(0,0,0,0.5)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        this.ctx.fillStyle = 'white';
        this.ctx.font = `bold ${this.canvas.width * 0.3}px Arial`;
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillText(this.state.countdownValue, this.canvas.width / 2, this.canvas.height / 2);
    }

    render() {
        this.clear();
        this.drawRoad();
        this.drawAnswers();
        this.drawCar();
        this.drawConfetti();
        this.drawCountdown();
    }
}
