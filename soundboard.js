var soundboard = {
    currentBoardId : 0,
    data : null,
    sound : null,
    sprite : {},

    init : function () {
		var request = new XMLHttpRequest();
		request.open('GET', 'soundboards.json', true);

		request.onload = function () {
			if (request.status >= 200 && request.status < 400) {
				// Success!
                soundboard.data = JSON.parse(request.responseText);
				soundboard.setup.firstRun();
			} else {
				// We reached our target server, but it returned an error
			}
		};

		request.onerror = function () {
		  // There was a connection error of some sort
		};

		request.send();
	},
    
    cleanup : {
        board : function (id) {
            var elem = document.getElementById(id);
            while (elem.firstChild) {
                elem.removeChild(elem.firstChild);
            }        
        }
    },

    render : {
        board : function () {
            var sounds = soundboard.data.boards[soundboard.currentBoardId].sounds,
                btns = document.createDocumentFragment();
            for (var i = 0, n = sounds.length; i < n; i++) {
                soundboard.sprite[sounds[i].tag] = sounds[i].timing;
                btns.appendChild(soundboard.render.button(sounds[i]));       
            }
            soundboard.cleanup.board('board');
            document.getElementById('board').appendChild(btns);
            document.getElementById('title').textContent = soundboard.data.boards[soundboard.currentBoardId].name;
            soundboard.setup.howler();
            soundboard.setup.buttons();
            soundboard.setup.switch();
        },
        
        button : function (data) {
            var b = document.createElement('BUTTON');
            b.setAttribute('data-sound', data.tag);
            b.appendChild(document.createTextNode(data.text));
            return b;
        }
    },
        
    setup : {
        buttons : function () {
            var btns = document.querySelectorAll('button');
            for (var i=0, n = btns.length; i < n; i++) {
                btns[i].addEventListener('click', function() {
                    soundboard.sound.play(this.getAttribute('data-sound'));
                });
            }
        },

        chooser : function () {
            var b = soundboard.data.boards,
                btns = document.createDocumentFragment();

            for (var i = 0, n = b.length; i < n; i++) {
                var opt = document.createElement('OPTION');
                opt.setAttribute('value', i);
                opt.appendChild(document.createTextNode(b[i].name));
                document.getElementById('choosesoundboard').appendChild(opt);
            }    
        },

        firstRun : function () {
            soundboard.setup.chooser();
            soundboard.render.board();
        },
        
        howler : function () {
            soundboard.sound = new Howl({
                urls: soundboard.data.boards[soundboard.currentBoardId].files,
                sprite: soundboard.sprite
            })
        },
    
        switch : function () {
            document.querySelector('select').addEventListener('change', function() {
                soundboard.currentBoardId = this.value;
                soundboard.render.board();
            });
        }
    }
};

(function() {
	soundboard.init();
})();