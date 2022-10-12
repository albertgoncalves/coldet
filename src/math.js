/* exported normalize */

"use strict";

function dot(l, r) {
    return (l.x * r.x) + (l.y * r.y);
}

function length(v) {
    return Math.sqrt(dot(v, v));
}

function normalize(v) {
    var l = length(v);
    return {
        x: v.x / l,
        y: v.y / l,
    };
}
