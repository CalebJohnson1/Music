function getTitle() {
    var audio = document.getElementById("player");
    var src = audio.getElementsByTagName("source")[0].getAttribute("src");
    var title = src.split('/').pop().replace(/\.[^/.]+$/, '');
    document.getElementById("song-title").textContent = title;
}

function playMusic() {
    var audio = document.getElementById("player");
    audio.play();
    getTitle();
    getAudioDuration();
}

function pauseMusic() {
    var audio = document.getElementById("player");
    audio.pause();
}

function getAudioDuration() {
    var audio = document.getElementById("player");
    var durationMinutes = Math.floor((audio.duration) / 60);
    var durationSeconds = Math.floor((audio.duration) % 60);
    var durationSecondsStr = durationSeconds < 10 ? "0" + durationSeconds : durationSeconds;
    document.getElementById("song-duration").textContent = durationMinutes + ":" + durationSecondsStr;
}