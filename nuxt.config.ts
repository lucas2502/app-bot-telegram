// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  runtimeConfig: {
    telegram: {
      BOT_TOKEN:
        process.env.NUXT_BOT_TOKEN ||
        "7055728706:AAGQDR8ubsPZWHxsTRP_mm8meniGKoEt6qA",
      CHAT_ID: process.env.NUXT_CHAT_ID || "6991093306",
    },
  },
});
