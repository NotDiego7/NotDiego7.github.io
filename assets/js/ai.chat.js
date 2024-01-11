const storedAccessToken = localStorage.getItem('accessToken');

if (!storedAccessToken) {
  authorizeDropbox();
} else {
  // Continue with the flow using the stored access token
  console.log(storedAccessToken);
  uploadButton = document.getElementById('upload-image-button');
  uploadButton.addEventListener('click', handleUpload);
}

function authorizeDropbox() {
  // Receives authorization URL | /auth-step-one
  fetchAuthorizationURL();
}

async function fetchAuthorizationURL() {
  try {
    const authorizationStepOneResponse = await fetch('https://notdiego7.pythonanywhere.com/auth-step-one', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    const { authorizationURL } = await authorizationStepOneResponse.json();

    // Prompt for authorization code after receiving the URL
    const authorizationCode = prompt(`Authorization URL: ${authorizationURL}`, 'Enter the authorization code you received.');

    // Check if the user entered a code
    if (authorizationCode) {
      localStorage.setItem('authorizationCode', authorizationCode); // Set the authorization code in localStorage for later use

      const sendAuthorizationCodeButton = document.getElementById('send-message-button');
      sendAuthorizationCodeButton.onclick = async () => {
        await postAuthorizationCode(authorizationCode);
      };
    } else {
      console.error('Authorization code not provided.');
      // Handle the case where the user did not provide an authorization code
    }
  } catch (error) {
    console.error('Error fetching authorization URL:', error);
    // Handle errors during the authorization URL fetch
  }
}

async function postAuthorizationCode(authorizationCode) {
  try {
    // POST requests transporting authorization code. | /auth-step-two
    const authorizationStepTwoResponse = await fetch('https://notdiego7.pythonanywhere.com/auth-step-two', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        authorizationCode,
      })
    });

    const { longLivedAccessToken } = await authorizationStepTwoResponse.json();

    // Check if the access token is defined before continuing
    if (longLivedAccessToken) {
      console.log(`This is the long-lived access token ${longLivedAccessToken}`);
      localStorage.setItem('accessToken', longLivedAccessToken);

      // Continue with the flow using the obtained access token
      uploadButton = document.getElementById('upload-image-button');
      uploadButton.addEventListener('click', handleUpload);
    } else {
      console.error('Long-lived access token not provided.');
      // Handle the case where the long-lived access token is not provided
    }
  } catch (error) {
    console.error('Error posting authorization code:', error);
    // Handle errors during the authorization code post
  }
}


function handleUpload() {
  const fileReader = new FileReader();
  const input = document.createElement('input');

  input.type = 'file';
  input.accept = 'image/*';
  input.click();

  input.addEventListener('change', () => {
    fileReader.readAsDataURL(input.files[0]); // Read as data URL for display

    fileReader.onload = async (event) => {
      const imageURL = event.target.result;
      const imageElement = document.getElementById('image-preview');
      imageElement.src = imageURL;

      const longLivedAccessToken = localStorage.getItem('accessToken');
      await uploadImageToDropbox(input.files[0], longLivedAccessToken);

      sendMessageButton = document.getElementById('send-message-button');
      sendMessageButton.addEventListener('click', getGoogleGeminiResponse)
    };
  });
}

async function uploadImageToDropbox(imageFile, accessToken) {
  const reader = new FileReader();
  reader.readAsArrayBuffer(imageFile);

  reader.onloadend = async () => {
    try {
      // Upload image to Dropbox
      const response = await fetch('https://content.dropboxapi.com/2/files/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/octet-stream',
          'Dropbox-API-Arg': JSON.stringify({
            path: '/image.jpg',
            mode: 'overwrite'
          })
        },
        body: reader.result
      });

      // Get temporary link using /get_temporary_link
      const temporaryLinkResponse = await fetch('https://api.dropboxapi.com/2/files/get_temporary_link', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          path: '/image.jpg'
        })
      });

      // Ensure that temporaryLink and text are defined before proceeding
      const temporaryLinkData = await temporaryLinkResponse.json();
      const temporaryLink = temporaryLinkData.link;
      localStorage.setItem('temporaryLink', temporaryLink)
    } catch (error) {
      console.error('Error:', error);
    }
  };
}


async function getGoogleGeminiResponse () {
  try {
    const temporaryLink = localStorage.getItem('temporaryLink');
    const text = document.getElementById('message').value;
  
    // Send request to server-side proxy (Python) | CORS(request) -> Gemini API -> Response
    const pyProxyResponse = await fetch('https://notdiego7.pythonanywhere.com', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        prompt: text,
        temporaryLink: temporaryLink
      })
    });
  
    const pyProxyResponseData = await pyProxyResponse.json();
    generatedText = pyProxyResponseData.text;
    document.querySelector('p#ai-body-text').innerText = generatedText;
  } catch (error) {
    console.error(`Error: ${error}`);
  }
}