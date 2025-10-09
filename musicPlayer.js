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
}

function pauseMusic() {
    var audio = document.getElementById("player");
    audio.pause();
}