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
    {
        var xSpeed = Math.abs(PLAYER_SPEED.x);
        var xOffset = (PLAYER.scale.x + xSpeed) / 2;
        var xMove = {
            center: {
                x: PLAYER_SPEED.x < 0 ? PLAYER.center.x - xOffset
                                      : PLAYER.center.x + xOffset,
                y: PLAYER.center.y,
            },
            scale: {
                x: xSpeed,
                y: PLAYER.scale.y,
            },
        };
        if (anyOverlap(xMove)) {
            PLAYER_SPEED.x = 0;
        }
    }
    {
        var ySpeed = Math.abs(PLAYER_SPEED.y);
        var yOffset = (PLAYER.scale.y + ySpeed) / 2;
        var yMove = {
            center: {
                x: PLAYER.center.x,
                y: PLAYER_SPEED.y < 0 ? PLAYER.center.y - yOffset
                                      : PLAYER.center.y + yOffset,
            },
            scale: {
                x: PLAYER.scale.x,
                y: ySpeed,
            },
        };
        if (anyOverlap(yMove)) {
            PLAYER_SPEED.y = 0;
        }
    }
    PLAYER.center.x += PLAYER_SPEED.x;
    PLAYER.center.y += PLAYER_SPEED.y;
}
