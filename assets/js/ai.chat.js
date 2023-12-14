const sendMessageButton = document.getElementById('send-message-button');

sendMessageButton.addEventListener('click', function() {
    const text = document.getElementById('message').value;

    const xhr = new XMLHttpRequest();

    xhr.open('POST', 'http://notdiego7.pythonanywhere.com/'); // NEED TO CHANGE HERE
    xhr.setRequestHeader('Content-Type', 'application/json');

    xhr.send(JSON.stringify({ text }));

    xhr.onload = function() {
        if (xhr.status === 200) {
            // Get request's response (AI generated text).
            const generatedText = JSON.parse(xhr.responseText).text;

            // Set the AI-generated text in the blockquote element.
            document.querySelector('blockquote').innerText = generatedText;
        } else {
            // Handle the error.
            document.querySelector('blockquote').innerText = 'Error';
        }
    };
});
