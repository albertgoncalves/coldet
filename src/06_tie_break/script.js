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

function noHit() {
    return {
        time: -Infinity,
        hit: {
            x: false,
            y: false,
        },
        overlap: 0,
    };
}

function overlapAmount(l0, r0, l1, r1) {
    var a = l0 < l1 ? l1 : l0;
    var b = r0 < r1 ? r0 : r1;
    var c = b - a;
    return c < 0 ? 0 : c;
}

function overlapBoxes(a, b) {
    return overlapAmount(a.leftBottom.x,
                         a.rightTop.x,
                         b.leftBottom.x,
                         b.rightTop.x) +
           overlapAmount(a.leftBottom.y,
                         a.rightTop.y,
                         b.leftBottom.y,
                         b.rightTop.y);
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

    var boxDestination;
    if (time.y < time.x) {
        if ((time.x < 0) || (1 < time.x)) {
            return noHit();
        }
        boxDestination = getBoxFromRect({
            center: {
                x: PLAYER.center.x + (speed.x * time.x),
                y: PLAYER.center.y + (speed.y * time.x),
            },
            scale: {
                x: PLAYER.scale.x,
                y: PLAYER.scale.y,
            },
        });
        if ((boxDestination.leftBottom.y < boxObstacle.rightTop.y) &&
            (boxObstacle.leftBottom.y < boxDestination.rightTop.y))
        {
            return {
                time: time.x,
                hit: {
                    x: true,
                    y: false,
                },
                overlap: overlapBoxes(boxDestination, boxObstacle),
            };
        }
    } else {
        if ((time.y < 0) || (1 < time.y)) {
            return noHit();
        }
        boxDestination = getBoxFromRect({
            center: {
                x: PLAYER.center.x + (speed.x * time.y),
                y: PLAYER.center.y + (speed.y * time.y),
            },
            scale: {
                x: PLAYER.scale.x,
                y: PLAYER.scale.y,
            },
        });
        if ((boxDestination.leftBottom.x < boxObstacle.rightTop.x) &&
            (boxObstacle.leftBottom.x < boxDestination.rightTop.x))
        {
            return {
                time: time.y,
                hit: {
                    x: false,
                    y: true,
                },
                overlap: overlapBoxes(boxDestination, boxObstacle),
            };
        }
    }
    return noHit();
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
                continue;
            }
            if ((candidate.time === collision.time) &&
                (collision.overlap < candidate.overlap))
            {
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
