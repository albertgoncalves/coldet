/* globals OBSTACLES, overlapRects, PLAYER, PLAYER_SPEED */
/* exported update */

"use strict";

function anyOverlap(rect) {
    for (var i = 0; i < OBSTACLES.length; ++i) {
        if (overlapRects(rect, OBSTACLES[i])) {
            return true;
        }
    }
    return false;
}

function update() {
    var destination = {
        center: {
            x: PLAYER.center.x + PLAYER_SPEED.x,
            y: PLAYER.center.y + PLAYER_SPEED.y,
        },
        scale: {
            x: PLAYER.scale.x,
            y: PLAYER.scale.y,
        },
    };
    if (anyOverlap(destination)) {
        PLAYER_SPEED.x = 0;
        PLAYER_SPEED.y = 0;
    }
    PLAYER.center.x += PLAYER_SPEED.x;
    PLAYER.center.y += PLAYER_SPEED.y;
}
