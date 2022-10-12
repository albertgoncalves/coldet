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
    PLAYER.center.x += PLAYER_SPEED.x;
    PLAYER.center.y += PLAYER_SPEED.y;
    if (collide()) {
        PLAYER.center.x -= PLAYER_SPEED.x;
        PLAYER.center.y -= PLAYER_SPEED.y;
        PLAYER_SPEED.x = 0;
        PLAYER_SPEED.y = 0;
    }
}
