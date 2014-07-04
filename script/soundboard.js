var soundboard = {
    assetpath : null,
    assetbasepath : 'assets',
    onstart : 'cutebutwrong',
    sound : null,
    sprite : {},

    init : function () {
        soundboard.assetpath = soundboard.setAssetPath();
		var request = new XMLHttpRequest();
        var url = soundboard.assetpath + soundboard.onstart + '.json';
		request.open('GET', url, true);

		request.onload = function () {
			if (request.status >= 200 && request.status < 400) {
				// Success!
                var data = JSON.parse(request.responseText);
				soundboard.setup(data);
			} else {
				// We reached our target server, but it returned an error
			}
		};

		request.onerror = function () {
		  // There was a connection error of some sort
		};

		request.send();
	},
    
    setup : function (data) {
        var d = data.sounds,
            btns = document.createDocumentFragment();
        for (var i = 0, n = d.length; i < n; i++) {
            soundboard.sprite[d[i].tag] = d[i].timing;
            btns.appendChild(soundboard.createButton(d[i]));       
        }
        document.getElementById('buttons').innerHTML='';
        document.getElementById('buttons').appendChild(btns);
        soundboard.setupHowler();
        soundboard.setupButtons();
        soundboard.setupSwitch();
    },
    
    createButton : function (data) {
        var b = document.createElement('BUTTON');
        b.setAttribute('data-sound', data.tag);
        b.appendChild(document.createTextNode(data.text));
        return b;
    },
    setupButtons : function () {
        var btns = document.querySelectorAll('button');
        for (var i=0, n = btns.length; i < n; i++) {
            btns[i].addEventListener('click', function() { soundboard.sound.play(this.getAttribute('data-sound'))});
        }
    },
    
    setupHowler : function () {
        soundboard.sound = new Howl({
            urls: [soundboard.assetpath + soundboard.onstart + '.ogg', soundboard.assetpath + soundboard.onstart + '.mp3'],
            sprite: soundboard.sprite
        })
    },
    
    setAssetPath : function () {
        return soundboard.assetbasepath + '/' + soundboard.onstart +'/';
    },
    
    setupSwitch : function () {
        document.querySelector('select').addEventListener('change', function() {
            console.log(this)
            soundboard.onstart = this.value;
            soundboard.init();
        });    
    
    }
};

(function() {
	soundboard.init();
})();