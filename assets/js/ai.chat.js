const uploadButton = document.getElementById('upload-image-button');

uploadButton.addEventListener('click', () => {
  const fileReader = new FileReader();

  // Function to handle the image data for display
  fileReader.onload = (event) => {
    const imageURL = event.target.result;
    const imageElement = document.getElementById('image-preview');
    imageElement.src = imageURL;
  };

  // Trigger the file selection dialog
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = 'image/*';
  input.click();

  input.addEventListener('change', () => {
    fileReader.readAsDataURL(input.files[0]); // Read as data URL for display

    // Upload image directly to Dropbox when the send button is clicked
    const sendMessageButton = document.getElementById('send-message-button');
    sendMessageButton.addEventListener('click', async () => {
      const imageFile = input.files[0];
      const reader = new FileReader();
      reader.readAsArrayBuffer(imageFile);

      reader.onloadend = async () => {
        try {
          // Upload image to Dropbox
          const response = await fetch('https://content.dropboxapi.com/2/files/upload', {
            method: 'POST',
            headers: {
              'Authorization': 'Bearer sl.BslxW1NfPK8-Mx5yStuJY7V2QK85RzMZkKpWpzLYR7tcrqO6KkEl5ajhDMA1IURA_q47UJpeXiuLQtMa2RkCqiDjR08HYrWJLfltn_IraA18a8WdSTKXVtOzjawiomsAkzKOxKHjcfOIQkvTXvbv', 
              'Content-Type': 'application/octet-stream',
              'Dropbox-API-Arg': JSON.stringify({
                path: '/image.jpg',
                mode: 'overwrite'
              })
            },
            body: reader.result
          });


          // Get temporary link using /get_temporary_link
          const getTemporaryLinkResponse = await fetch('https://api.dropboxapi.com/2/files/get_temporary_link', {
            method: 'POST',
            headers: {
              'Authorization': 'Bearer sl.BslxW1NfPK8-Mx5yStuJY7V2QK85RzMZkKpWpzLYR7tcrqO6KkEl5ajhDMA1IURA_q47UJpeXiuLQtMa2RkCqiDjR08HYrWJLfltn_IraA18a8WdSTKXVtOzjawiomsAkzKOxKHjcfOIQkvTXvbv',
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              path: '/image.jpg'
            })
          });

          const dropboxTemporaryLinkResponse = await getTemporaryLinkResponse.json();
          const temporaryLink = dropboxTemporaryLinkResponse.link;  // Get temporary link



          const text = document.getElementById('message').value;

          // Send request to serverSide proxy (Python) | CORS(request) -> Gemini API -> Response
          const pyProxyResponse = await fetch('https://notdiego7.pythonanywhere.com/', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              prompt: text,
              temporaryLink: temporaryLink
            })
          });
          const ProxyResponse = await pyProxyResponse.json();
          const generatedText = ProxyResponse.text;


          document.querySelector('p#ai-body-text').innerText = generatedText;
        } catch (error) {
          console.error('Error:', error);
        }
      };
    });
  });
});