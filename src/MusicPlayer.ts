/*
TODO
Play next song after one ends - DONE
Shuffle Function
Double click image to open a wide image w/ more artist info, genre, etc.
*/

declare const jsmediatags: any;
let isPlaying = false;
let previousVolume = 0.5;
let playlist: File[] = [];
let songIndex = 0;

const playIcon =
  '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 5a2 2 0 0 1 3.008-1.728l11.997 6.998a2 2 0 0 1 .003 3.458l-12 7A2 2 0 0 1 5 19z"/></svg>';
const pauseIcon =
  '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="14" y="3" width="5" height="18" rx="1"/><rect x="5" y="3" width="5" height="18" rx="1"/></svg>';

const volumeLowIcon =
  '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4.702a.705.705 0 0 0-1.203-.498L6.413 7.587A1.4 1.4 0 0 1 5.416 8H3a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h2.416a1.4 1.4 0 0 1 .997.413l3.383 3.384A.705.705 0 0 0 11 19.298z"/><path d="M16 9a5 5 0 0 1 0 6"/></svg>';
const volumeHighIcon =
  '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4.702a.705.705 0 0 0-1.203-.498L6.413 7.587A1.4 1.4 0 0 1 5.416 8H3a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h2.416a1.4 1.4 0 0 1 .997.413l3.383 3.384A.705.705 0 0 0 11 19.298z"/><path d="M16 9a5 5 0 0 1 0 6"/><path d="M19.364 18.364a9 9 0 0 0 0-12.728"/></svg>';
const mutedIcon =
  '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4.702a.705.705 0 0 0-1.203-.498L6.413 7.587A1.4 1.4 0 0 1 5.416 8H3a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h2.416a1.4 1.4 0 0 1 .997.413l3.383 3.384A.705.705 0 0 0 11 19.298z"/><line x1="22" x2="16" y1="9" y2="15"/><line x1="16" x2="22" y1="9" y2="15"/></svg>';

function playMusic() {
  const audio = document.getElementById('player') as HTMLAudioElement;
  audio.play();
  isPlaying = true;
  const playPauseBtn = document.getElementById(
    'playPauseButton',
  ) as HTMLButtonElement;
  playPauseBtn.innerHTML = pauseIcon;
  updateProgress();
}

function pauseMusic() {
  const audio = document.getElementById('player') as HTMLAudioElement;
  audio.pause();
  isPlaying = false;
  const playPauseBtn = document.getElementById(
    'playPauseButton',
  ) as HTMLButtonElement;
  playPauseBtn.innerHTML = playIcon;
}

function playPauseMusic() {
  !isPlaying ? playMusic() : pauseMusic();
}

function playPreviousSong() {
  const audio = document.getElementById('player') as HTMLAudioElement;
  if (audio.currentTime > 3) {
    audio.currentTime = 0;
    return;
  }
  songIndex--;
  if (songIndex < 0) {
    songIndex = 0;
  }
  const nextFile = playlist[songIndex];
  const song = document.querySelectorAll('#music-tracks li');
  extractMetaData(nextFile as File, song[songIndex] as HTMLElement);
}

function playNextSong() {
  songIndex++;
  if (songIndex >= playlist.length) {
    songIndex = 0;
  }
  const nextFile = playlist[songIndex];
  const song = document.querySelectorAll('#music-tracks li');
  extractMetaData(nextFile as File, song[songIndex] as HTMLElement);
}

function getAudioDuration() {
  const audio = document.getElementById('player') as HTMLAudioElement;
  const duration = document.getElementById('song-duration') as HTMLElement;
  const durationMinutes = Math.floor(audio.duration / 60);
  const durationSeconds = Math.floor(audio.duration % 60);
  const durationSecondsStr =
    durationSeconds < 10 ? '0' + durationSeconds : durationSeconds;
  duration.textContent = durationMinutes + ':' + durationSecondsStr;
}

function extractMetaData(file: File, track: HTMLElement) {
  const audio = document.getElementById('player') as HTMLAudioElement;
  const items = document.querySelectorAll('#music-tracks li');
  const albumCover = document.getElementById('album-cover') as HTMLImageElement;
  const songTitle = document.getElementById('song-title') as HTMLElement;
  const albumName = document.getElementById('album-name') as HTMLElement;

  items.forEach(function (item) {
    item.classList.remove('changeColor');
  });

  audio.src = URL.createObjectURL(file);
  track.classList.add('changeColor');

  jsmediatags.read(file, {
    onSuccess: function (tag: any) {
      const tags = tag.tags;
      const title = tags.title || file.name.replace(/\.[^/.]+$/, '');
      const artist = tags.artist || '';
      const album = tags.album || '';
      const picture = tags.picture || '';

      // Extracting the cover from the audio file
      const data = picture.data || '';
      const format = picture.format || '';
      let base64String = '';
      for (let i = 0; i < data.length; i++) {
        base64String += String.fromCharCode(data[i]);
      }

      picture != ''
        ? (albumCover.src = `data:${format};base64,${window.btoa(base64String)}`)
        : (albumCover.src = '');
      picture != '' ? (albumCover.hidden = false) : (albumCover.hidden = true);

      artist !== ''
        ? (songTitle.textContent = `${artist} - ${title}`)
        : (songTitle.textContent = title);

      albumName.textContent = album;
    },
    onError: function (e: Error) {
      songTitle.textContent = file.name.replace(/\.[^/.]+$/, '');
      albumName.textContent = '';
    },
  });
  playMusic();
}

function fileSelect() {
  const audioInput = document.getElementById('audio-input') as HTMLElement;
  audioInput.addEventListener('change', (e: Event) => {
    const target = e.target as HTMLInputElement;
    if (!target || !target.files) return;

    const musicTracksLayout = document.getElementById(
      'music-tracks',
    ) as HTMLDataListElement;
    musicTracksLayout.innerHTML = '';

    for (const file of target.files) {
      playlist.push(file);
      const track = document.createElement('li');
      track.className =
        'hover:bg-slate-800 cursor-pointer border-b border-slate-700 select-none';

      jsmediatags.read(file, {
        onSuccess: function (tag: any) {
          const tags = tag.tags;
          const title = tags.title || file.name.replace(/\.[^/.]+$/, '');
          const artist = tags.artist || '';

          artist !== ''
            ? (track.textContent = `${artist} - ${title}`)
            : (track.textContent = title);
        },
        onError: function (e: Error) {
          track.textContent = file.name.replace(/\.[^/.]+$/, '');
        },
      });

      const audio = document.getElementById('player') as HTMLAudioElement;
      musicTracksLayout.hidden = false;

      track.ondblclick = () => {
        extractMetaData(file, track);
        songIndex = playlist.indexOf(file);
      };

      audio.addEventListener('loadedmetadata', function () {
        getAudioDuration();

        const progressBar = document.getElementById(
          'progress-bar',
        ) as HTMLInputElement;
        progressBar.max = audio.duration.toString();
        progressBar.removeAttribute('hidden');

        const time = document.getElementById('time') as HTMLElement;
        time.textContent = '0:00';
      });
      musicTracksLayout.appendChild(track);
    }
  });
}

function updateProgress() {
  const audio = document.getElementById('player') as HTMLAudioElement;
  const progressBar = document.getElementById(
    'progress-bar',
  ) as HTMLInputElement;
  const time = document.getElementById('time') as HTMLElement;
  progressBar.value = audio.currentTime.toString();

  const timeSeconds = Math.floor(audio.currentTime) % 60;
  const timeMinutes = Math.floor(Math.floor(audio.currentTime) / 60);
  const timeSecondsStr = timeSeconds < 10 ? '0' + timeSeconds : timeSeconds;
  time.textContent = timeMinutes + ':' + timeSecondsStr;

  audio.ontimeupdate = function () {
    updateProgress();
  };
}

function handleVolumeSlider() {
  const audio = document.getElementById('player') as HTMLAudioElement;
  const volumeSlider = document.getElementById(
    'volume-slider',
  ) as HTMLInputElement;
  const volumeIcon = document.getElementById(
    'volume-icon',
  ) as HTMLButtonElement;

  volumeSlider.addEventListener('input', function () {
    audio.volume = Number(volumeSlider.value) / 100;
    Number(volumeSlider.value) == 0
      ? (volumeIcon.innerHTML = mutedIcon)
      : Number(volumeSlider.value) < 50
        ? (volumeIcon.innerHTML = volumeLowIcon)
        : (volumeIcon.innerHTML = volumeHighIcon);
  });
}

function muteAudio() {
  const audio = document.getElementById('player') as HTMLAudioElement;
  const volumeSlider = document.getElementById(
    'volume-slider',
  ) as HTMLInputElement;
  const volumeIcon = document.getElementById(
    'volume-icon',
  ) as HTMLButtonElement;

  if (audio.volume > 0) {
    previousVolume = audio.volume;
    audio.volume = 0;
    volumeSlider.value = '0';
    volumeIcon.innerHTML = mutedIcon;
  } else {
    audio.volume = previousVolume;
    volumeSlider.value = (previousVolume * 100).toString();

    previousVolume < 0.5
      ? (volumeIcon.innerHTML = volumeLowIcon)
      : (volumeIcon.innerHTML = volumeHighIcon);
  }
}

function audioSeeker() {
  const audio = document.getElementById('player') as HTMLAudioElement;
  const progressBar = document.getElementById(
    'progress-bar',
  ) as HTMLInputElement;

  progressBar.addEventListener('input', function () {
    audio.currentTime = Number(progressBar.value);
  });
}

function hideTracks() {
  const tracks = document.getElementById('music-tracks') as HTMLElement;
  !tracks.hidden ? (tracks.hidden = true) : (tracks.hidden = false);
}

function showSettingsList() {
  const settingsList = document.getElementById('settings-list') as HTMLElement;
  settingsList.hidden
    ? (settingsList.hidden = false)
    : (settingsList.hidden = true);
}

function enlargeElements() {
  const title = document.getElementById('song-title') as HTMLElement;
  const albumName = document.getElementById('album-name') as HTMLElement;
  const albumCover = document.getElementById('album-cover') as HTMLImageElement;

  albumCover.className = 'absolute left-90 bottom-60 w-100 h-100 rounded';
}

function getKeyboardInputs() {
  const audio = document.getElementById('player') as HTMLAudioElement;
  document.addEventListener('keydown', (e) => {
    if (e.key === ' ') {
      playPauseMusic();
    }
    if (e.key === 'm') {
      muteAudio();
    }
    if (e.key === 'ArrowRight') {
      audio.currentTime += 5;
    }
    if (e.key === 'ArrowLeft') {
      audio.currentTime -= 5;
    }
  });
}

window.onload = function () {
  fileSelect();
  audioSeeker();
  handleVolumeSlider();
  getKeyboardInputs();

  const audio = document.getElementById('player') as HTMLAudioElement;
  const volumeSlider = document.getElementById(
    'volume-slider',
  ) as HTMLInputElement;
  audio.volume = Number(volumeSlider.value) / 100;

  audio.addEventListener('ended', () => {
    playNextSong();
  });
};
