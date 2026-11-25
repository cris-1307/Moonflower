import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

// base "./" hace que las rutas a fotos y data.json sirvan igual en la raíz de Netlify/Vercel
// y en la subcarpeta de GitHub Pages (https://usuario.github.io/Moonflower/)
export default defineConfig({
  base: "./",
  plugins: [vue()]
});
