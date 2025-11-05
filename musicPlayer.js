let isPlaying = false;

const playIcon = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-play-icon lucide-play"><path d="M5 5a2 2 0 0 1 3.008-1.728l11.997 6.998a2 2 0 0 1 .003 3.458l-12 7A2 2 0 0 1 5 19z"/></svg>';
const pauseIcon = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-pause-icon lucide-pause"><rect x="14" y="3" width="5" height="18" rx="1"/><rect x="5" y="3" width="5" height="18" rx="1"/></svg>';

const volumeLowIcon = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-volume1-icon lucide-volume-1"><path d="M11 4.702a.705.705 0 0 0-1.203-.498L6.413 7.587A1.4 1.4 0 0 1 5.416 8H3a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h2.416a1.4 1.4 0 0 1 .997.413l3.383 3.384A.705.705 0 0 0 11 19.298z"/><path d="M16 9a5 5 0 0 1 0 6"/></svg>';
const volumeHighIcon = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-volume2-icon lucide-volume-2"><path d="M11 4.702a.705.705 0 0 0-1.203-.498L6.413 7.587A1.4 1.4 0 0 1 5.416 8H3a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h2.416a1.4 1.4 0 0 1 .997.413l3.383 3.384A.705.705 0 0 0 11 19.298z"/><path d="M16 9a5 5 0 0 1 0 6"/><path d="M19.364 18.364a9 9 0 0 0 0-12.728"/></svg>';
const mutedIcon = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-volume-x-icon lucide-volume-x"><path d="M11 4.702a.705.705 0 0 0-1.203-.498L6.413 7.587A1.4 1.4 0 0 1 5.416 8H3a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h2.416a1.4 1.4 0 0 1 .997.413l3.383 3.384A.705.705 0 0 0 11 19.298z"/><line x1="22" x2="16" y1="9" y2="15"/><line x1="16" x2="22" y1="9" y2="15"/></svg>';

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
    var playPauseBtn = document.getElementById("playPauseButton");
    playPauseBtn.innerHTML = pauseIcon;
}

function pauseMusic() {
    var audio = document.getElementById("player");
    audio.pause();
    isPlaying = false;
    var playPauseBtn = document.getElementById("playPauseButton");
    playPauseBtn.innerHTML = playIcon;
}

function previousTrack() {
    var audio = document.getElementById("player");
    audio.currentTime = 0;
}

function playPauseMusic() {
    if (!isPlaying) {
        playMusic();
        updateProgress();
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

            var progressBar = document.getElementById("progress-bar");
            progressBar.max = audio.duration;
            progressBar.removeAttribute('hidden');

            document.getElementById('time').textContent = "0:00";
        });
    });
}

function updateProgress() {
    var audio = document.getElementById("player");
    var progressBar = document.getElementById("progress-bar");
    progressBar.value = audio.currentTime;

    var timeSeconds = Math.floor(audio.currentTime) % 60; // Gets the seconds
    var timeMinutes = Math.floor(Math.floor(audio.currentTime) / 60); // Gets the minutes
    var timeSecondsStr = timeSeconds < 10 ? "0" + timeSeconds : timeSeconds;
    document.getElementById("time").textContent = timeMinutes + ":" + timeSecondsStr;
    
    audio.ontimeupdate = function() {
        updateProgress();
    }
}

function handleVolumeSlider() {
    var audio = document.getElementById("player");
    var volumeSlider = document.getElementById("volume-slider");
    var volumeIcon = document.getElementById("volume-icon");

    volumeSlider.addEventListener('input', function() {
        audio.volume = volumeSlider.value / 100;
        if ((volumeSlider.value == 0)) {
            volumeIcon.innerHTML = mutedIcon;
        }
        else if ((volumeSlider.value) < 50) {
            volumeIcon.innerHTML = volumeLowIcon;
        } else {
            volumeIcon.innerHTML = volumeHighIcon;
        }
    });
}

function muteAudio() {
    var audio = document.getElementById("player");
    var volumeSlider = document.getElementById("volume-slider");
    var volumeIcon = document.getElementById("volume-icon");

    if (audio.volume > 0) {
        previousVolume = audio.volume;
        audio.volume = 0
        volumeSlider.value = 0;
        volumeIcon.innerHTML = mutedIcon;
    } else {
        audio.volume = previousVolume;
        volumeSlider.value = previousVolume * 100;
        if (previousVolume < 0.5) {
            volumeIcon.innerHTML = volumeLowIcon;
        } else {
            volumeIcon.innerHTML = volumeHighIcon;
        }
    }
}

function audioSeeker() {
    var audio = document.getElementById("player");
    var progressBar = document.getElementById("progress-bar");

    progressBar.addEventListener('input', function() {
        audio.currentTime = progressBar.value;
    });
}

window.onload = function() {
    fileSelect();
    audioSeeker();
    handleVolumeSlider();

    var audio = document.getElementById("player");
    var volumeSlider = document.getElementById("volume-slider")
    audio.volume = volumeSlider.value / 100;
}