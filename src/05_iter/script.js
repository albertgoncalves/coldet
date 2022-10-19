/* globals OBSTACLES, overlapRects, PLAYER, PLAYER_SPEED */
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

function noHit() {
    return {
        time: -Infinity,
        hit: {
            x: false,
            y: false,
        },
    };
}

function collide(obstacle, speed) {
    var time = {
        x: -Infinity,
        y: -Infinity,
    };

    var boxPlayer = getBoxFromRect(PLAYER);
    var boxObstacle = getBoxFromRect(obstacle);

    if (0 < speed.x) {
        time.x = (boxObstacle.leftBottom.x - boxPlayer.rightTop.x) / speed.x;
    } else if (speed.x < 0) {
        time.x = (boxObstacle.rightTop.x - boxPlayer.leftBottom.x) / speed.x;
    }

    if (0 < speed.y) {
        time.y = (boxObstacle.leftBottom.y - boxPlayer.rightTop.y) / speed.y;
    } else if (speed.y < 0) {
        time.y = (boxObstacle.rightTop.y - boxPlayer.leftBottom.y) / speed.y;
    }

    var maxTime;
    var hit = {
        x: false,
        y: false,
    };
    if (time.y < time.x) {
        maxTime = time.x;
        hit.x = true;
    } else {
        maxTime = time.y;
        hit.y = true;
    }
    if ((maxTime < 0) || (1 < maxTime)) {
        return noHit();
    }
    var destination = {
        center: {
            x: PLAYER.center.x + (speed.x * maxTime),
            y: PLAYER.center.y + (speed.y * maxTime),
        },
        scale: {
            x: PLAYER.scale.x,
            y: PLAYER.scale.y,
        },
    };
    if (!overlapRects(destination, obstacle)) {
        return noHit();
    }
    return {
        time: maxTime,
        hit: hit,
    };
}

function update() {
    var speed = {
        x: PLAYER_SPEED.x,
        y: PLAYER_SPEED.y,
    };
    var remaining = {
        x: PLAYER_SPEED.x,
        y: PLAYER_SPEED.y,
    };
    var hit = {
        x: false,
        y: false,
    };
    for (var _ = 0; _ < 2; ++_) {
        var collision = noHit();
        for (var i = 0; i < OBSTACLES.length; ++i) {
            var candidate = collide(OBSTACLES[i], speed);
            if (!candidate.hit.x && !candidate.hit.y) {
                continue;
            }
            if (!collision.hit.x && !collision.hit.y) {
                collision = candidate;
                continue;
            }
            if (candidate.time < collision.time) {
                collision = candidate;
            }
        }

        if (!collision.hit.x && !collision.hit.y) {
            PLAYER.center.x += speed.x;
            PLAYER.center.y += speed.y;
            break;
        }

        speed.x *= collision.time;
        speed.y *= collision.time;
        PLAYER.center.x += speed.x;
        PLAYER.center.y += speed.y;
        remaining.x -= speed.x;
        remaining.y -= speed.y;

        if (collision.hit.x) {
            remaining.x = 0;
            hit.x = true;
        }
        if (collision.hit.y) {
            remaining.y = 0;
            hit.y = true;
        }

        speed.x = remaining.x;
        speed.y = remaining.y;
    }
    if (hit.x) {
        PLAYER_SPEED.x = 0;
    }
    if (hit.y) {
        PLAYER_SPEED.y = 0;
    }
}
