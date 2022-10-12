/* globals PLAYER, PLAYER_SPEED */
/* exported update */

"use strict";

function update() {
    PLAYER.center.x += PLAYER_SPEED.x;
    PLAYER.center.y += PLAYER_SPEED.y;
}
