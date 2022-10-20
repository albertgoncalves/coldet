/* globals OBSTACLES, PLAYER, PLAYER_SPEED */
/* exported update */

"use strict";

function getBoxFromRect(rect) {
    var halfScale = {
        x: rect.scale.x / 2,
        y: rect.scale.y / 2,
    };
    return {
        leftBottom: {
            x: rect.center.x - halfScale.x,
            y: rect.center.y - halfScale.y,
        },
        rightTop: {
            x: rect.center.x + halfScale.x,
            y: rect.center.y + halfScale.y,
        },
    };
}

function collide(obstacle) {
    var time = {
        x: -Infinity,
        y: -Infinity,
    };

    var boxPlayer = getBoxFromRect(PLAYER);
    var boxObstacle = getBoxFromRect(obstacle);

    if (0 < PLAYER_SPEED.x) {
        time.x =
            (boxObstacle.leftBottom.x - boxPlayer.rightTop.x) / PLAYER_SPEED.x;
    } else if (PLAYER_SPEED.x < 0) {
        time.x =
            (boxObstacle.rightTop.x - boxPlayer.leftBottom.x) / PLAYER_SPEED.x;
    }

    if (0 < PLAYER_SPEED.y) {
        time.y =
            (boxObstacle.leftBottom.y - boxPlayer.rightTop.y) / PLAYER_SPEED.y;
    } else if (PLAYER_SPEED.y < 0) {
        time.y =
            (boxObstacle.rightTop.y - boxPlayer.leftBottom.y) / PLAYER_SPEED.y;
    }

    var boxDestination;
    if (time.y < time.x) {
        if ((time.x < 0) || (1 < time.x)) {
            return false;
        }
        boxDestination = getBoxFromRect({
            center: {
                x: PLAYER.center.x + (PLAYER_SPEED.x * time.x),
                y: PLAYER.center.y + (PLAYER_SPEED.y * time.x),
            },
            scale: {
                x: PLAYER.scale.x,
                y: PLAYER.scale.y,
            },
        });
        return (boxDestination.leftBottom.y < boxObstacle.rightTop.y) &&
               (boxObstacle.leftBottom.y < boxDestination.rightTop.y);
    } else {
        if ((time.y < 0) || (1 < time.y)) {
            return false;
        }
        boxDestination = getBoxFromRect({
            center: {
                x: PLAYER.center.x + (PLAYER_SPEED.x * time.y),
                y: PLAYER.center.y + (PLAYER_SPEED.y * time.y),
            },
            scale: {
                x: PLAYER.scale.x,
                y: PLAYER.scale.y,
            },
        });
        return (boxDestination.leftBottom.x < boxObstacle.rightTop.x) &&
               (boxObstacle.leftBottom.x < boxDestination.rightTop.x);
    }
}

function anyCollide() {
    for (var i = 0; i < OBSTACLES.length; ++i) {
        if (collide(OBSTACLES[i])) {
            return true;
        }
    }
    return false;
}

function update() {
    if (anyCollide()) {
        PLAYER_SPEED.x = 0;
        PLAYER_SPEED.y = 0;
    }
    PLAYER.center.x += PLAYER_SPEED.x;
    PLAYER.center.y += PLAYER_SPEED.y;
}
