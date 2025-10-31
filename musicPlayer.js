let isPlaying = false;

function getTitle() {
    var audio = document.getElementById("player");
    var src = audio.getElementsByTagName("source")[0].getAttribute("src");
    var title = src.split('/').pop().replace(/\.[^/.]+$/, '');
    document.getElementById("song-title").textContent = title;
}

function playMusic() {
    var audio = document.getElementById("player");
    audio.play();
    isPlaying = true;
}

function pauseMusic() {
    var audio = document.getElementById("player");
    audio.pause();
    isPlaying = false;
}

function playPauseMusic() {
    if (!isPlaying) {
        playMusic();
        testForGettingTime();
    } else {
        pauseMusic();
    }
}

function getAudioDuration() {
    var audio = document.getElementById("player");
    var durationMinutes = Math.floor((audio.duration) / 60); // Gets the minutes
    var durationSeconds = Math.floor((audio.duration) % 60); // Gets the seconds
    var durationSecondsStr = durationSeconds < 10 ? "0" + durationSeconds : durationSeconds;
    document.getElementById("song-duration").textContent = durationMinutes + ":" + durationSecondsStr;
}

function fileSelect() {
    var audioInput = document.getElementById("audio-input");
    audioInput.addEventListener('change', function(e) {
        var file = e.target.files[0];
        var audio = document.getElementById('player');
        audio.src = URL.createObjectURL(file);
        document.getElementById("song-title").textContent = file.name.replace(/\.[^/.]+$/, '');
        audio.addEventListener('loadedmetadata', function() {
            getAudioDuration();
        });
    });
}

function testForGettingTime() {
    var audio = document.getElementById("player");
    var timeSeconds = Math.floor(audio.currentTime) % 60; // Gets the seconds
    var timeMinutes = Math.floor(Math.floor(audio.currentTime) / 60); // Gets the minutes
    var timeSecondsStr = timeSeconds < 10 ? "0" + timeSeconds : timeSeconds;
    document.getElementById("time").textContent = timeMinutes + ":" + timeSecondsStr;

    audio.ontimeupdate = function() {
        testForGettingTime();
    }
}

window.onload = function() {
    fileSelect();
}