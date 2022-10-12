/* globals OBSTACLES, overlapRects, PLAYER, PLAYER_SPEED */
/* exported update */

"use strict";

function collide() {
    for (var i = 0; i < OBSTACLES.length; ++i) {
        if (overlapRects(PLAYER, OBSTACLES[i])) {
            return true;
        }
    }
    return false;
}

function update() {
    if (collide()) {
        PLAYER_SPEED.x = 0;
        PLAYER_SPEED.y = 0;
    }
    PLAYER.center.x += PLAYER_SPEED.x;
    PLAYER.center.y += PLAYER_SPEED.y;
}
