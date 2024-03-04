export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event);

  // Token do seu bot no Telegram
  const BOT_TOKEN = "7055728706:AAGQDR8ubsPZWHxsTRP_mm8meniGKoEt6qA"; // config.telegram.BOT_TOKEN;
  // ID do chat para onde enviar a mensagem
  const CHAT_ID = "6991093306"; // config.telegram.CHAT_ID;

  const body = await readBody(event);
  const message = JSON.stringify({
    longitude: body.longitude,
    latitude: body.latitude,
  });
  // console.log("Message", message);

  // decode message
  // decodeURIComponent(escape(window.atob(message.longitude)));
  // decodeURIComponent(escape(window.atob(message.tatitude)));

  try {
    // Código para enviar a mensagem para o Telegram
    // Substitua YOUR_TELEGRAM_BOT_TOKEN e CHAT_ID pelos valores corretos
    const responseMessage = await fetch(
      `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage?chat_id=${CHAT_ID}&text=${encodeURIComponent(
        message
      )}`,
      {
        method: "GET",
      }
    );

    return await responseMessage.json();
  } catch (error) {
    console.error("Erro ao enviar a mensagem para o Telegram:", error);
  }
});
