var soundboard = {
    currentBoardId : 0,
    data : null,
    sound : null,
    sprite : {},

    init : function () {
		var request = new XMLHttpRequest();
		request.open('GET', 'soundboards.json', true);

		request.onload = function () {
			if (request.status >= 200 && request.status < 400) { // Success!
                soundboard.data = JSON.parse(request.responseText);
				soundboard.setup.firstRun();
			} else { // We reached our target server, but it returned an error
				soundboard.render.html('soundstage', '<p class="error">Something went wrong on our end. Please try again.</p>');
			}
		};

		request.onerror = function () { // There was a connection error of some sort
			soundboard.render.html('soundstage', '<p class="error">Server says no.</p>');
		};			

		request.send();
	},
    
    cleanup :  function (id) {
		var elem = document.getElementById(id);
		while (elem.firstChild) {
			elem.removeChild(elem.firstChild);
		}
    },

    render : {
        board : function () {
            var active = soundboard.currentBoardId,
				activeBoard = soundboard.data.boards[active];
			soundboard.cleanup('soundstage');
            document.getElementById('soundstage').appendChild(soundboard.render.buttons());
			document.title = activeBoard.name + " — a soundboard"; 
			soundboard.render.string(
				'title', activeBoard.name
			);
			soundboard.render.html(
				'smallprint', activeBoard.disclaimer
			);
			soundboard.render.html(
				'description', activeBoard.description
			);
			if (!document.documentElement.classList.contains('sidebarNotActive')) {
				document.querySelectorAll('#choosesoundboard button')[active].classList.add('active');
			}
		},
		buttons : function () {
			var	sounds = soundboard.data.boards[soundboard.currentBoardId].sounds,
                btns = document.createDocumentFragment();
            for (var i = 0, n = sounds.length; i < n; i++) {
                btns.appendChild(soundboard.render.button(sounds[i]));       
            }	
			return btns;
		},
        button : function (data) {
            var b = document.createElement('BUTTON');
            b.setAttribute('data-sound', data.tag);
            b.setAttribute('type', 'button');
            b.setAttribute('class', 'soundboard__button');
			b.addEventListener('click', function() {
				soundboard.sound.play(this.getAttribute('data-sound'));
			});
            b.appendChild(document.createTextNode(data.text));
            return b;
        },
		html: function (elemId, html) {
			if (typeof html !== 'undefined') {
				document.getElementById(elemId).innerHTML = html;
			} else {
				soundboard.cleanup(elemId)
			}
        },
		string: function (elemId, string) {
			if (typeof string !== 'undefined') {
				document.getElementById(elemId).textContent = string;
			} else {
				soundboard.cleanup(elemId)
			}
		}
    },
	
    setup : {
		chooser : function () {
            var b = soundboard.data.boards,
                btns = document.createDocumentFragment();

			if (b.length > 1) {
				for (var i = 0, n = b.length; i < n; i++) {
					var button = document.createElement('BUTTON');
					button.setAttribute('value', i);
					button.setAttribute('type', 'button');
					button.setAttribute('class', 'sidebar__button');
					button.appendChild(document.createTextNode(b[i].name));
					button.addEventListener('click', function() {
						if (this.classList.contains('active')) { return };
						soundboard.currentBoardId = this.value;
						document.querySelector('#choosesoundboard .active').classList.remove('active');
						soundboard.render.html('soundstage', '<p class="loading">fetching data</p>');
						soundboard.setup.howler();
					});
					btns.appendChild(button);
				}
				document.getElementById('choosesoundboard').appendChild(btns);
			} else {
				document.documentElement.classList.add('sidebarNotActive');
			}
        },
		
        firstRun : function () {
            soundboard.setup.chooser();
			soundboard.setup.howler();
        },
        
        howler : function () {
            soundboard.sound = new Howl({
                urls: soundboard.data.boards[soundboard.currentBoardId].files,
                sprite: soundboard.setup.sprite(),
				onload: function () {
					//console.log('"' + soundboard.sound._src + '" loaded.');
					soundboard.render.board();
				},
				onloaderror: function (e) {
					//console.log('"' + soundboard.sound._src + '" failed to load.');
					soundboard.setup.tryNextFile(soundboard.sound._src);
				}
            })
        },
		
		sprite : function () {
			var	sounds = soundboard.data.boards[soundboard.currentBoardId].sounds,
				sprite = {};
            for (var i = 0, n = sounds.length; i < n; i++) {
                sprite[sounds[i].tag] = sounds[i].timing;    
            } 
			return sprite;
		},

		tryNextFile : function (nothisone) {
			var urls = soundboard.data.boards[soundboard.currentBoardId].files,
				notme = urls.indexOf(nothisone);
			
			soundboard.sound.urls = urls.splice(notme, 1);
			
			if (soundboard.sound.urls > 0) {
				soundboard.render.board();
			} else {
				soundboard.render.html('soundstage', '<p class="error">No sound could be loaded.</p>');
			}
		}
    }
};

(function() {
	soundboard.init();
})();