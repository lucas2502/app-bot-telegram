export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event);
  // Token do seu bot no Telegram
  const BOT_TOKEN = config.telegram.BOT_TOKEN;
  // ID do chat para onde enviar a mensagem
  const CHAT_ID = config.telegram.CHAT_ID;

  const body = await readBody(event);
  const imageData = decodeURIComponent(escape(atob(body.image)));

  // console.log("Message photo", imageData);

  // Converte a string base64 em um blob
  const blob = await fetch(`${imageData}`).then((res) => res.blob());

  // Cria um objeto FormData e adiciona o arquivo
  const formData = new FormData();
  formData.append("photo", blob, "photo.jpg");

  try {
    const responseImage = await fetch(
      `https://api.telegram.org/bot${BOT_TOKEN}/sendPhoto?chat_id=${CHAT_ID}`,
      {
        method: "POST",
        body: formData,
      }
    );

    return await responseImage.json();
  } catch (error) {
    console.error("Erro ao enviar a imagem para o Telegram:", error);
  }
});
