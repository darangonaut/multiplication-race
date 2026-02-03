import { TRANSLATIONS } from './constants.js';

export class UI {
    constructor(state, onLanguageChange, onRestart) {
        this.state = state;
        this.onLanguageChange = onLanguageChange;
        this.elements = {
            title: document.getElementById('gameTitle'),
            score: document.getElementById('score'),
            speed: document.getElementById('speed'),
            question: document.getElementById('question'),
            controls: document.getElementById('controls'),
            gameOver: document.getElementById('gameOver'),
            gameOverTitle: document.getElementById('gameOverTitle'),
            scoreLabel: document.getElementById('scoreLabel'),
            finalScore: document.getElementById('finalScore'),
            restartBtn: document.getElementById('restartBtn'),
            langBtns: document.querySelectorAll('.lang-btn')
        };

        this.elements.langBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const lang = btn.title === 'Česky' ? 'cs' : 'en';
                this.setLanguage(lang);
                if (this.onLanguageChange) this.onLanguageChange(lang);
            });
        });

        this.elements.restartBtn.addEventListener('click', onRestart);
    }

    updateScore() {
        const trans = TRANSLATIONS[this.state.currentLanguage];
        this.elements.score.textContent = `${trans.correctAnswers}: ${this.state.score}`;
    }

    updateSpeed() {
        const trans = TRANSLATIONS[this.state.currentLanguage];
        this.elements.speed.textContent = `${trans.speed}: ${this.state.speed.toFixed(1)}×`;
    }

    updateQuestion(a, b) {
        this.elements.question.textContent = `${a} × ${b} = ?`;
    }

    showGameOver() {
        this.elements.finalScore.textContent = this.state.score;
        this.elements.gameOver.style.display = 'block';
    }

    hideGameOver() {
        this.elements.gameOver.style.display = 'none';
    }

    setLanguage(lang) {
        this.state.currentLanguage = lang;
        const trans = TRANSLATIONS[lang];
        
        this.elements.title.textContent = trans.title;
        this.updateScore();
        this.updateSpeed();
        this.elements.controls.textContent = trans.controls;
        this.elements.gameOverTitle.textContent = trans.gameOver;
        this.elements.scoreLabel.innerHTML = `${trans.yourScore}<br><strong style="font-size: 32px; color: #667eea;"><span id="finalScore">${this.state.score}</span></strong>`;
        this.elements.finalScore = document.getElementById('finalScore'); // Re-grab since innerHTML replaced it
        this.elements.restartBtn.textContent = trans.playAgain;

        this.elements.langBtns.forEach(btn => {
            btn.classList.toggle('active', 
                (lang === 'cs' && btn.title === 'Česky') || 
                (lang === 'en' && btn.title === 'English')
            );
        });
    }
}
