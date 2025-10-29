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

function testStuff() {
    var audio = document.getElementById("player");
    var time = Math.floor(audio.currentTime) % 60; // Gets time only in seconds
    if (time > 0) {
        document.getElementById("time").textContent = time;
    }
}

window.onload = function() {
    fileSelect();
}