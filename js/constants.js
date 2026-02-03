export const CONFIG = {
    CANVAS_WIDTH: 400,
    CANVAS_HEIGHT: 600,
    INITIAL_SPEED: 1.5,
    SPEED_INCREMENT: 0.3,
    SPEED_UP_INTERVAL: 5,
    ROAD_WIDTH_PERCENT: 0.7,
    SEGMENT_HEIGHT: 30,
    CAR_WIDTH: 30,
    CAR_HEIGHT: 50,
    CAR_SPEED: 5,
    ANSWER_WIDTH_PERCENT: 0.15,
    ANSWER_HEIGHT_PERCENT: 0.08,
    ANSWER_SPACING_PERCENT: 0.19,
    CONFETTI_COUNT: 30,
    ROAD_BUFFER: 200,
    INITIAL_ROAD_POINTS: 40,
    MAX_LIVES: 3,
    COUNTDOWN_DURATION: 3
};

export const COLORS = {
    ROAD_GRASS: '#228B22',
    ROAD_ASPHALT: '#333',
    ROAD_LINE: '#fff',
    CAR_BODY: '#e74c3c',
    CAR_WINDOW: '#3498db',
    CAR_WHEEL: '#000',
    ANSWER_BOX: '#3498db',
    ANSWER_TEXT: 'white',
    ANSWER_BORDER: 'white',
    ANSWER_SHADOW: 'rgba(0,0,0,0.3)',
    CONFETTI: ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff', '#ffa500', '#ff1493']
};

export const TRANSLATIONS = {
    cs: {
        title: '🏎️ Násobilka - Závod',
        correctAnswers: 'Správné odpovědi',
        speed: 'Rychlost',
        controls: 'Táhni prstem nebo ← → / A D',
        gameOver: 'Konec hry!',
        yourScore: 'Tvoje skóre:',
        playAgain: 'Hrát znovu'
    },
    en: {
        title: '🏎️ Multiplication Race',
        correctAnswers: 'Correct Answers',
        speed: 'Speed',
        controls: 'Drag finger or ← → / A D',
        gameOver: 'Game Over!',
        yourScore: 'Your score:',
        playAgain: 'Play Again'
    }
};
