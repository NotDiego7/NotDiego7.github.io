const signupButton = document.getElementById('signupButton');
const signupButtonMobile = document.getElementById('signupButtonMobile');

const notImplemented = "We apologize. We're still working on that.";

if (signupButton) {
    signupButton.addEventListener('click', function (event) {
        event.preventDefault();
        document.getElementById('modal').style.display = 'block';
        document.querySelector('div#modal-content p').textContent = notImplemented;
    });

    // Touch Device Listener
    signupButton.addEventListener('touchstart', function (event) {
        event.preventDefault();
        document.getElementById('modal').style.display = 'block';
        document.querySelector('div#modal-content p').textContent = notImplemented;
    });
}

if (signupButtonMobile) {
    signupButtonMobile.addEventListener('click', function (event) {
        event.preventDefault();
        document.getElementById('modal').style.display = 'block';
        document.querySelector('div#modal-content p').textContent = notImplemented;
        document.querySelector('a.toggle').click();
    });
}

document.getElementById('close-button').addEventListener('click', function () {
    document.getElementById('modal').style.display = 'none';
});