/* globals normalize, update */

"use strict";

var PLAYER = {
    center: {
        x: 0,
        y: 0,
    },
    scale: {
        x: 25,
        y: 25,
    },
};

var OBSTACLES = [
    {
        center: {
            x: 300,
            y: 0,
        },
        scale: {
            x: 5,
            y: 500,
        },
    },
    {
        center: {
            x: 200,
            y: -100,
        },
        scale: {
            x: 500,
            y: 5,
        },
    },
];

var MILLISECONDS = 1000;

var FRAME_UPDATE_COUNT = 4;
var FRAME_DURATION = (1 / 60) * MILLISECONDS;
var FRAME_STEP = FRAME_DURATION / FRAME_UPDATE_COUNT;

var KEY = {
    w: 87,
    s: 83,
    a: 65,
    d: 68,
    shift: 16,
};

var FILL_COLOR = "hsl(0, 0%, 90%)";

var CAMERA = {
    x: 0,
    y: 0,
};

var CAMERA_LATENCY = 0.0125;

var PLAYER_STEP = 0.235;
var PLAYER_FRICTION = 0.9325;
var PLAYER_STEP_MOD = 1.125;

var WORLD_BOUNDARY = 100000;

var PLAYER_SPEED = {
    x: 0,
    y: 0,
};

var INPUT = {
    up: false,
    down: false,
    left: false,
    right: false,
    mod: false,
};

function inputToSpeed() {
    var speed = {
        x: 0,
        y: 0,
    };
    if (INPUT.up) {
        speed.y -= 1;
    }
    if (INPUT.down) {
        speed.y += 1;
    }
    if (INPUT.left) {
        speed.x -= 1;
    }
    if (INPUT.right) {
        speed.x += 1;
    }
    if ((speed.x !== 0) || (speed.y !== 0)) {
        speed = normalize(speed);
        PLAYER_SPEED.x += speed.x * PLAYER_STEP;
        PLAYER_SPEED.y += speed.y * PLAYER_STEP;
        if (INPUT.mod) {
            PLAYER_SPEED.x *= PLAYER_STEP_MOD;
            PLAYER_SPEED.y *= PLAYER_STEP_MOD;
        }
    }
    PLAYER_SPEED.x *= PLAYER_FRICTION;
    PLAYER_SPEED.y *= PLAYER_FRICTION;
}

function draw(canvas, context) {
    var offset = {
        x: CAMERA.x - (canvas.width / 2),
        y: CAMERA.y - (canvas.height / 2),
    };
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.fillRect(PLAYER.center.x - (PLAYER.scale.x / 2) - offset.x,
                     PLAYER.center.y - (PLAYER.scale.y / 2) - offset.y,
                     PLAYER.scale.x,
                     PLAYER.scale.y);
    for (var i = 0; i < OBSTACLES.length; ++i) {
        var obstacle = OBSTACLES[i];
        context.fillRect(obstacle.center.x - (obstacle.scale.x / 2) - offset.x,
                         obstacle.center.y - (obstacle.scale.y / 2) - offset.y,
                         obstacle.scale.x,
                         obstacle.scale.y);
    }
}

window.onload = function() {
    var canvas = document.getElementById("canvas");
    var context = canvas.getContext("2d");
    context.imageSmoothingEnabled = false;
    context.fillStyle = FILL_COLOR;

    window.addEventListener("keydown", function(event) {
        switch (event.keyCode) {
        case KEY.w: {
            INPUT.up = true;
            break;
        }
        case KEY.s: {
            INPUT.down = true;
            break;
        }
        case KEY.a: {
            INPUT.left = true;
            break;
        }
        case KEY.d: {
            INPUT.right = true;
            break;
        }
        case KEY.shift: {
            INPUT.mod = true;
            break;
        }
        }
    });
    window.addEventListener("keyup", function(event) {
        switch (event.keyCode) {
        case KEY.w: {
            INPUT.up = false;
            break;
        }
        case KEY.s: {
            INPUT.down = false;
            break;
        }
        case KEY.a: {
            INPUT.left = false;
            break;
        }
        case KEY.d: {
            INPUT.right = false;
            break;
        }
        case KEY.shift: {
            INPUT.mod = false;
            break;
        }
        }
    });

    var frame = {
        prev: 0,
        delta: 0,
    };
    var loop = function(now) {
        frame.delta += now - frame.prev;
        while (FRAME_STEP < frame.delta) {
            frame.delta -= FRAME_STEP;
            inputToSpeed();
            update();

            if ((PLAYER.center.x < -WORLD_BOUNDARY) ||
                (WORLD_BOUNDARY < PLAYER.center.x) ||
                (PLAYER.center.y < -WORLD_BOUNDARY) ||
                (WORLD_BOUNDARY < PLAYER.center.y))
            {
                PLAYER.center.x = 0;
                PLAYER.center.y = 0;
                PLAYER_SPEED.x = 0;
                PLAYER_SPEED.y = 0;
            }

            CAMERA.x -= (CAMERA.x - PLAYER.center.x) * CAMERA_LATENCY;
            CAMERA.y -= (CAMERA.y - PLAYER.center.y) * CAMERA_LATENCY;
        }
        frame.prev = now;
        draw(canvas, context);
        window.requestAnimationFrame(loop);
    };

    window.requestAnimationFrame(loop);
};
