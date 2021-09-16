let log = (...rest) => console.log(...rest);

let lyricWrapper = $('.lyric-wrapper');
let lines = lyricWrapper.find('.line');
let audio = $('.audio');
let playButton = $('.play-button');
let hasAnimation = $('html .has-animation');
let linearBg = $('.linear-bg');
let musicBg = $('.music-bg');

function checkReadyState() {
  let startPlay = function () {
    setTimeout(() => {
      playButton.addClass('is-active')
        .find('.paused').text('play');
    }, 2000);
  }

  if (audio.hasClass('is-loaded') || audio[0].readyState == 4) {
    log('readyState', audio[0].readyState, 'loaded:' + audio.hasClass('is-loaded'));
    startPlay();
  }
}

function setAnimationState(state) {
  linearBg.css('animation-play-state', state);
  lines.css('animation-play-state', state);
}

function handleAudioEvents() {
  audio.on('canplaythrough', () => {
    log('canplaythrough');
    checkReadyState();
  });

  audio.on('ended', () => {
    log('ended');
    playButton.removeClass('is-playing');
    musicBg.css({
      'visibility': 'hidden'
    });
    lyricWrapper.attr('style', '');
  });

  audio.on('playing', () => {
    log('playing');
    setAnimationState('running');
  });

  audio.on('waiting', () => {
    log('waiting');
    setAnimationState('paused');
  });
}

function handleAnimation() {
  let duration = parseInt(lines.eq(0).data('wow-duration'));
  let delay = parseInt(lines.eq(0).data('wow-delay')) + duration;

  lines.each(function(index) {
    if (index == 0) return;
    duration = parseInt($(this).data('wow-duration'));
    $(this).attr('data-wow-delay', `${delay}s`);
    delay += duration;
  });

  linearBg.on('animationstart', () => {
    setTimeout(() => {
      $('.wrapper').css('background-image', 'linear-gradient(138deg, #ecf6ff, #f8f0ff, #ecf6ff)');
      musicBg.addClass('is-show');
    }, 5000);
    setTimeout(() => {
      lyricWrapper.css('background-color', 'rgba(255,255,255,.5)');
    }, 8000);
  });
}

function handlePlayingState() {
  playButton.click(function() {
    $(this).toggleClass('is-playing');
    if ($(this).hasClass('is-playing')) {
      if (!$('.animated')[0]) {
        musicBg.attr('style', '');
        setTimeout(() => {
          musicBg.find('img')[0].src = './assests/music_bg.gif';
        }, 30000);
        hasAnimation.css('animation-play-state', 'running');
        goFullscreen();
        $.getScript('https://cdnjs.cloudflare.com/ajax/libs/wow/1.1.2/wow.min.js', () => {
          new WOW().init();
        });
      }
      setAnimationState('running');
      audio[0].play();
    } else {
      audio[0].pause();
      setAnimationState('paused');
    }
  });
}

function goFullscreen() {
  var element = document.documentElement;
  if (element.requestFullscreen) {
    element.requestFullscreen();
  } else if (element.webkitRequestFullscreen) {
    element.webkitRequestFullscreen();
  }
}

function loadAudio() {
  console.log('before blob load');
  var request = new XMLHttpRequest();
  request.responseType = 'blob';
  request.open('GET', './assests/mike.mp3', true);
  request.onload = () => {
    if (this.status !== 404) {
      var audioObj = new Audio(URL.createObjectURL(this.response));
      audioObj.load();
      console.log('after blob load');
    }
  }
  request.send();
}

// loadAudio();
$(document).ready(() => {
  handleAudioEvents();
  checkReadyState();
  handleAnimation();
  handlePlayingState();
});