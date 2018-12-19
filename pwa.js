var deferredPrompt,
    panel = document.getElementById('pwa-actions');

if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./sw.js')
    .then(function (registration) {
        console.log('Registered:', registration);
    })
    .catch(function (error) {
        console.log('Registration failed: ', error);
    });
}

window.addEventListener('beforeinstallprompt', function (e) {
    e.preventDefault();
    showPanel();
    deferredPrompt = e;
});

document.getElementById('install').addEventListener('click', function (e) {
    // Show the prompt
    deferredPrompt.prompt();

    // Wait for the user to respond to the prompt
    deferredPrompt.userChoice
        .then(function (choiceResult) {
            if (choiceResult.outcome === 'accepted') {
                console.log('User accepted the A2HS prompt');
            } else {
                console.log('User dismissed the A2HS prompt');
            }

            hidePanel();
            deferredPrompt = null;
        });
});

document.getElementById('dismiss').addEventListener('click', hidePanel);

function hidePanel() {
    panel.setAttribute('hidden', true);
}

function showPanel() {
    panel.removeAttribute('hidden');
}
