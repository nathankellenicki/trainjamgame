"use strict";

import MomentumEngine from "momentumengine";

let width = 1000,
    height = 625;

window.onload = function () {

    let game = new MomentumEngine.Classes.Game({
        canvas: document.getElementById("game_canvas"),
        width: width,
        height: height,
        fixRatio: true,
        desiredFps: 60,
        inputs: {
            keyboard: true,
            gamepad: true
        }
    });

}