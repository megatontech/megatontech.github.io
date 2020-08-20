"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const MMDPlayer_1 = require("./MMDPlayer");
let modelFile = 'https://raw.githubusercontent.com/megatontech/megatontech.github.file/master/mmd/model/Sour_BreathYou/Breath_You.pmx';
let cameraFile = 'https://raw.githubusercontent.com/megatontech/megatontech.github.file/master/mmd/model/camera.vmd';
let musicFile = 'https://raw.githubusercontent.com/megatontech/megatontech.github.file/master/mmd/model/music.mp3';
let vmdFile = "https://raw.githubusercontent.com/megatontech/megatontech.github.file/master/mmd/model/DeepBlueTown_he_Oideyo_dance.vmd";
let stageFile = "https://raw.githubusercontent.com/megatontech/megatontech.github.file/master/mmd/model/Crystal_Stage/Crystal_Stage.pmx";
let mmdplayer = new MMDPlayer_1.default();
mmdplayer.modeFile = modelFile;
mmdplayer.cameraFile = cameraFile;
mmdplayer.musicFile = musicFile;
mmdplayer.vmdFile = vmdFile;
mmdplayer.stageFile = stageFile;
window.addEventListener('resize', function () { mmdplayer.resize(window.innerWidth, window.innerHeight); }, false);
function onProgress(item, loaded, total) {
    console.log(item);
    document.getElementById("loding-text").innerText = ((loaded / total) * 100).toFixed(0) + " %";
}
function onLoad() {
    document.getElementById("loding-text").innerText = "click to play";
    document.getElementById("loading-image").style.display = "none";
    document.getElementById("loding-text").onclick = function () {
        document.getElementById("loding-text").innerText = "Initializing physical";
        mmdplayer.init();
        setTimeout(() => { document.getElementById("loading").style.display = "none"; mmdplayer.play(); }, 5000);
    };
}
let manager = mmdplayer.load();
manager.onProgress = onProgress;
manager.onLoad = onLoad;
