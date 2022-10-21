/* exported getBoxFromRect, overlapRects */

"use strict";

function overlapSegments(l0, r0, l1, r1) {
    return (l0 < r1) && (l1 < r0);
}

function overlapRects(a, b) {
    var aScaleHalf = {
        x: a.scale.x / 2,
        y: a.scale.y / 2,
    };
    var bScaleHalf = {
        x: b.scale.x / 2,
        y: b.scale.y / 2,
    };
    return overlapSegments(a.center.x - aScaleHalf.x,
                           a.center.x + aScaleHalf.x,
                           b.center.x - bScaleHalf.x,
                           b.center.x + bScaleHalf.x) &&
           overlapSegments(a.center.y - aScaleHalf.y,
                           a.center.y + aScaleHalf.y,
                           b.center.y - bScaleHalf.y,
                           b.center.y + bScaleHalf.y);
}

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
