var soundboard = (function () {
	var autoplay = getAutoPlay();
	var data = window.sbData;
	var sound = [];

	function setupHowler() {
		for (var i = 0, n = data.boards.length; i < n; i++) {
			var board = data.boards[i];
			sound[board.boardId] = new Howl({
				src: board.src,
				sprite: setupSprite(board.sounds),
				onload: function () {
					document.documentElement.addEventListener('click', playSound, false);
				},
				onend: function() {
					var nowPlaying = document.querySelector('.is-playing');
					if (nowPlaying) {
						nowPlaying.classList.remove('is-playing');
					}
				}
			});
		}

		if (autoplay) {
			var button = document.getElementById(autoplay);
			if (button) {
				sound[button.dataset.board].play(autoplay);
				//a('send', 'event', 'autoplay', button.textContent);
			}
		}
	}

	function playSound(e) {
		if (e.target.type === 'button' && e.target.classList.contains('btn--play')) {
			/* play sound */
			var board = e.target.dataset.board;
			var soundId = e.target.id;
			sound.forEach(function (board) { board.stop() });
			sound[board].play(soundId);
			
			e.target.classList.add('is-playing');

			/* log play events to Google Analytics */
			//ga('send', 'event', 'play', e.target.textContent);

			/* set autoplay */
			var baseUrl = window.location.search ? window.location.href.substring(0, window.location.href.indexOf('?')) : window.location.href;
			document.getElementById('autoplayurl').href = document.getElementById('autoplayurl').innerHTML = baseUrl + '?autoplay=' + soundId;
		}
	}

	function setupSprite(sounds) {
		var sprite = {};
		for (var i = 0, n = sounds.length; i < n; i++) {
			sprite[sounds[i].tag] = sounds[i].timing;
		}

		return sprite;
	}

	function getAutoPlay() {
		var vars = window.location.search.substring(1).split('&');
		for (var i = 0, n = vars.length; i < n; i++) {
			var pair = vars[i].split('=');
			if (pair[0] === 'autoplay'.toLowerCase()) {
				return pair[1];
			}
		}
	}

	setupHowler();
})();
