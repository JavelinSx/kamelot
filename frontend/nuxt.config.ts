// nuxt.config.ts
export default defineNuxtConfig({
  devtools: {
    enabled: false,
  },
  ssr: true,
  // CSS
  css: ["~/assets/css/main.css"],

  // Modules
  modules: ["@nuxt/ui", "@pinia/nuxt", "@vueuse/nuxt"],

  // TypeScript configuration
  typescript: {
    strict: true,
    typeCheck: true,
  },

  // Auto imports
  imports: {
    dirs: [
      "composables",
      "composables/**",
      "utils",
      "utils/**",
      "stores",
      "types",
    ],
  },

  // Components auto-import
  components: [
    {
      path: "~/components",
      pathPrefix: false,
    },
  ],

  // Runtime config
  runtimeConfig: {
    // Private keys (only available on server-side)
    jwtSecret: process.env.JWT_SECRET || "default-secret",

    // Public keys (exposed to client-side)
    public: {
      apiBase: process.env.API_BASE_URL || "http://localhost:3001/api",
      appName: "FightClub",
      appUrl: process.env.APP_URL || "http://localhost:3000",
    },
  },

  // Nitro config
  nitro: {
    experimental: {
      wasm: true,
    },
  },

  // Build configuration
  build: {
    transpile: ["chart.js"],
  },

  // Vite configuration
  vite: {
    optimizeDeps: {
      include: ["chart.js"],
    },
  },

  // App configuration
  app: {
    head: {
      title: "FightClub - Боевые единоборства",
      meta: [
        { charset: "utf-8" },
        { name: "viewport", content: "width=device-width, initial-scale=1" },
        {
          name: "description",
          content: "Платформа для изучения боевых единоборств",
        },
      ],
      link: [{ rel: "icon", type: "image/x-icon", href: "/favicon.ico" }],
    },
  },
});
