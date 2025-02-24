import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)", 
        primary: "#489FB5", // cor do botao adicionar tarefa
        secondary: "#D63230", // cor do botao deletar
        accent: "#16697A", // cor do botao concluir
        muted: "#FFA62B", //cor do botao editar
        save: "#6C9241" , // cor do botao salvar depois de editar uma tarefa
      },
      fontFamily:{
        gotham: ["Gotham", "Arial", "sans-serif"],
      },
    },
  },
  plugins: [],
} satisfies Config;
