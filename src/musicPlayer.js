////@ts-check

let isPlaying = false;

const playIcon = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 5a2 2 0 0 1 3.008-1.728l11.997 6.998a2 2 0 0 1 .003 3.458l-12 7A2 2 0 0 1 5 19z"/></svg>';
const pauseIcon = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="14" y="3" width="5" height="18" rx="1"/><rect x="5" y="3" width="5" height="18" rx="1"/></svg>';

const volumeLowIcon = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4.702a.705.705 0 0 0-1.203-.498L6.413 7.587A1.4 1.4 0 0 1 5.416 8H3a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h2.416a1.4 1.4 0 0 1 .997.413l3.383 3.384A.705.705 0 0 0 11 19.298z"/><path d="M16 9a5 5 0 0 1 0 6"/></svg>';
const volumeHighIcon = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4.702a.705.705 0 0 0-1.203-.498L6.413 7.587A1.4 1.4 0 0 1 5.416 8H3a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h2.416a1.4 1.4 0 0 1 .997.413l3.383 3.384A.705.705 0 0 0 11 19.298z"/><path d="M16 9a5 5 0 0 1 0 6"/><path d="M19.364 18.364a9 9 0 0 0 0-12.728"/></svg>';
const mutedIcon = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4.702a.705.705 0 0 0-1.203-.498L6.413 7.587A1.4 1.4 0 0 1 5.416 8H3a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h2.416a1.4 1.4 0 0 1 .997.413l3.383 3.384A.705.705 0 0 0 11 19.298z"/><line x1="22" x2="16" y1="9" y2="15"/><line x1="16" x2="22" y1="9" y2="15"/></svg>';

function playMusic() {
    let audio = document.getElementById("player");
    audio.play();
    isPlaying = true;
    let playPauseBtn = document.getElementById("playPauseButton");
    playPauseBtn.innerHTML = pauseIcon;
    updateProgress();
}

function pauseMusic() {
    let audio = document.getElementById("player");
    audio.pause();
    isPlaying = false;
    let playPauseBtn = document.getElementById("playPauseButton");
    playPauseBtn.innerHTML = playIcon;
}

function playPauseMusic() {
    !isPlaying ? playMusic() : pauseMusic();
}

function previousTrack() {
    let audio = document.getElementById("player");
    audio.currentTime = 0;
    playMusic();
}

function getAudioDuration() {
    let audio = document.getElementById("player");
    let durationMinutes = Math.floor((audio.duration) / 60);
    let durationSeconds = Math.floor((audio.duration) % 60);
    let durationSecondsStr = durationSeconds < 10 ? "0" + durationSeconds : durationSeconds;
    document.getElementById("song-duration").textContent = durationMinutes + ":" + durationSecondsStr;
}

// TODO - Shuffle function here

function extractMetaData(file, li) {
    let audio = document.getElementById("player");
    let items = document.querySelectorAll('#music-tracks li');
    items.forEach(function(item) {
        item.classList.remove('changeColor');
    });

    audio.src = URL.createObjectURL(file);
    li.classList.add('changeColor');

    jsmediatags.read(file, {
        onSuccess: function(tag) {
            let tags = tag.tags;
            let title = tags.title || file.name.replace(/\.[^/.]+$/, '');
            let artist = tags.artist || '';
            let album = tags.album || '';
            let picture = tags.picture || '';

            // Extracting the cover from the audio file
            const data = picture.data || '';
            const format = picture.format || '';
            let base64String = "" || '';
            for (let i = 0; i < data.length; i++) {
                base64String += String.fromCharCode(data[i]);
            }

            picture != '' 
            ? document.getElementById("album-cover").src = `data:${format};base64,${window.btoa(base64String)}`
            : document.getElementById("album-cover").src = '';
            picture != ''
            ? document.getElementById("album-cover").hidden = false
            : document.getElementById("album-cover").hidden = true;
            
            artist !== ''
            ? document.getElementById("song-title").textContent = `${artist} - ${title}`
            : document.getElementById("song-title").textContent = title;

            document.getElementById("album-name").textContent = album;
        },
        onError: function(e) {
            document.getElementById("song-title").textContent = file.name.replace(/\.[^/.]+$/, '');
            document.getElementById("album-name").textContent = '';
        }
    });
    playMusic();
}

function fileSelect() {
    document.getElementById("audio-input").addEventListener("change", (e) => {
        let output = document.getElementById("music-tracks");
        output.innerHTML = '';

        for (const file of e.target.files) {
            const li = document.createElement("li");
            li.className = 'px-2 py-2 hover:bg-slate-800 cursor-pointer border-b border-slate-700 select-none';

            jsmediatags.read(file, {
                onSuccess: function(tag) {
                    let tags = tag.tags;
                    let title = tags.title || file.name.replace(/\.[^/.]+$/, '');
                    let artist = tags.artist || '';

                    artist !== '' ? li.textContent = `${artist} - ${title}` : li.textContent = title;
                },
                onError: function(error) {
                    li.textContent = file.name.replace(/\.[^/.]+$/, '');
                }
            })

            let audio = document.getElementById("player");
            output.hidden = false;

            li.ondblclick = () => {
                extractMetaData(file, li);
            }

            audio.addEventListener('loadedmetadata', function() {
                getAudioDuration();

                let progressBar = document.getElementById("progress-bar");
                progressBar.max = audio.duration;
                progressBar.removeAttribute('hidden');

                document.getElementById('time').textContent = "0:00";
            });
            output.appendChild(li);
        }
    });
}

function updateProgress() {
    let audio = document.getElementById("player");
    let progressBar = document.getElementById("progress-bar");
    progressBar.value = audio.currentTime;

    let timeSeconds = Math.floor(audio.currentTime) % 60;
    let timeMinutes = Math.floor(Math.floor(audio.currentTime) / 60);
    let timeSecondsStr = timeSeconds < 10 ? "0" + timeSeconds : timeSeconds;
    document.getElementById("time").textContent = timeMinutes + ":" + timeSecondsStr;
    
    audio.ontimeupdate = function() {
        updateProgress();
    }
}

function handleVolumeSlider() {
    let audio = document.getElementById("player");
    let volumeSlider = document.getElementById("volume-slider");
    let volumeIcon = document.getElementById("volume-icon");

    volumeSlider.addEventListener('input', function() {
        audio.volume = volumeSlider.value / 100;
        volumeSlider.value == 0 ? volumeIcon.innerHTML = mutedIcon :
            volumeSlider.value < 50 ? volumeIcon.innerHTML = volumeLowIcon : volumeIcon.innerHTML = volumeHighIcon;
    });
}

function muteAudio() {
    let audio = document.getElementById("player");
    let volumeSlider = document.getElementById("volume-slider");
    let volumeIcon = document.getElementById("volume-icon");

    if (audio.volume > 0) {
        previousVolume = audio.volume;
        audio.volume = 0
        volumeSlider.value = 0;
        volumeIcon.innerHTML = mutedIcon;
    } else {
        audio.volume = previousVolume;
        volumeSlider.value = previousVolume * 100;

        previousVolume < 0.5 ? volumeIcon.innerHTML = volumeLowIcon : volumeIcon.innerHTML = volumeHighIcon;
    }
}

function audioSeeker() {
    let audio = document.getElementById("player");
    let progressBar = document.getElementById("progress-bar");

    progressBar.addEventListener('input', function() {
        audio.currentTime = progressBar.value;
    });
}

function hideTracks() {
    tracks = document.getElementById("music-tracks");
    !tracks.hidden ? tracks.hidden = true : tracks.hidden = false;
}

function showSettingsList() {
    let settingsList = document.getElementById("settings-list");
    settingsList.hidden ? settingsList.hidden = false : settingsList.hidden = true;
}

function getKeyboardInputs() {
    let audio = document.getElementById("player");
    document.addEventListener("keydown", (e) => {
        if (e.key === " ") {
            playPauseMusic();
        }
        if (e.key === "m") {
            muteAudio();
        }
        if (e.key === "ArrowRight") {
            audio.currentTime += 5;
        }
        if (e.key === "ArrowLeft") {
            audio.currentTime -= 5;
        }
    });
}

window.onload = function() {
    fileSelect();
    audioSeeker();
    handleVolumeSlider();
    getKeyboardInputs();

    let audio = document.getElementById("player");
    let volumeSlider = document.getElementById("volume-slider")
    audio.volume = volumeSlider.value / 100;
}