import { CONFIG } from './constants.js';

export function getRoadCenterAt(y, roadPoints) {
    for (let i = 0; i < roadPoints.length - 1; i++) {
        if (y >= roadPoints[i].y && y < roadPoints[i + 1].y) {
            const localY = y - roadPoints[i].y;
            const t = localY / CONFIG.SEGMENT_HEIGHT;
            return roadPoints[i].x + (roadPoints[i + 1].x - roadPoints[i].x) * t;
        }
    }
    return y < roadPoints[0].y ? roadPoints[0].x : roadPoints[roadPoints.length - 1].x;
}

export function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
