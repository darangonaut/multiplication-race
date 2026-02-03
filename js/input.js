export class InputHandler {
    constructor(canvas, state) {
        this.canvas = canvas;
        this.state = state;
        this.initListeners();
    }

    initListeners() {
        // Keyboard
        window.addEventListener('keydown', (e) => {
            this.state.keys[e.key] = true;
        });

        window.addEventListener('keyup', (e) => {
            this.state.keys[e.key] = false;
        });

        // Touch
        this.canvas.addEventListener('touchstart', (e) => this.handleTouch(e, true));
        this.canvas.addEventListener('touchmove', (e) => this.handleTouch(e, true));
        this.canvas.addEventListener('touchend', (e) => this.handleTouch(e, false));
        this.canvas.addEventListener('touchcancel', (e) => this.handleTouch(e, false));
    }

    handleTouch(e, isTouching) {
        e.preventDefault();
        this.state.isTouching = isTouching;
        if (isTouching) {
            const pos = this.getTouchPos(e);
            this.state.car.x = pos.x - this.state.car.width / 2;
            this.clampCarPosition();
        }
    }

    getTouchPos(e) {
        const rect = this.canvas.getBoundingClientRect();
        const touch = e.touches[0];
        return {
            x: (touch.clientX - rect.left) * (this.canvas.width / rect.width),
            y: (touch.clientY - rect.top) * (this.canvas.height / rect.height)
        };
    }

    clampCarPosition() {
        this.state.car.x = Math.max(0, Math.min(this.canvas.width - this.state.car.width, this.state.car.x));
    }

    update() {
        if (!this.state.isTouching) {
            if (this.state.keys['ArrowLeft'] || this.state.keys['a'] || this.state.keys['A']) {
                this.state.car.x -= this.state.car.speed;
            }
            if (this.state.keys['ArrowRight'] || this.state.keys['d'] || this.state.keys['D']) {
                this.state.car.x += this.state.car.speed;
            }
            this.clampCarPosition();
        }
    }
}
