import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    screens: {
      lg870: { max: "870px" },
      lg991: { max: "991px" },
      md767: { max: "767px" },
      md560: { max: "560px" },
      md515: { max: "515px" },
      lg660: { max: "660px" },
      xl1199: { max: "1199px" },
      xl1615: { max: "1615px" },
      xl1480: { max: "1480px" },
      xl1580: { max: "1580px" },
      xl1680: { max: "1680px" },
      xl1870: { max: "1870px" },
      xl1920: { max: "1920px" },
    },
    fontFamily: {
      rubik: ["var(--font-rubik)"],
      roboto: ["var(--font-roboto)"],
      fontAwesome: ["var(--font-awesome)"],
    },
    extend: {
      fontSize: {
        "text-base": "var(--text-base)",
        "text-sm": "var(--text-sm)",
        "text-md": "var(--text-md)",
        "text-lg": "var(--text-lg)",
        "text-xl": "var(--text-xl)",
        "text-3xl": "var(--text-3xl)",
      },
      spacing: {
        "padding": "var(--padding)",
      },
      colors: {
        "primary": "var(--primary)",
        "sidebar-border": "var(--sidebar-border)",
        "white": "var(--white)",
        "primary-rgb": "var(--primary-rgb)",
        "sidebar-active": "var(--sidebar-active)",
        "sidebar-heading": "var(--sidebar-heading)",
        "input-color": "var(--input-color)",
        "title-color": "var(--title-color)",
        "title": "var(--title)",
        "subtitle-color": "var(--subtitle-color)",
        "input-border-color": "var(--input-border-color)",
        "destructive": "var(--destructive)",
        "edit": "var(--edit)",
        "pagination": "var(--pagination)",
        "table-border": "var(--table-border)",
        "import": "var(--import)",
        "slate-300": "var(--slate-300)",
        "landing-light": "var(--landing-light)",
        "card-color": "var(--card-color)",
        "table-input-color": "var(--table-input-color)",
        "sidebar-bg": "var(--sidebar-bg)",
        "header": "var(--header)",
        "bg-body": "var(--bg-body)",
        "bg-card": "var(--bg-card)",
        "subcard": "var(--subcard)",
        "incoming": "var(--incoming)",
        "incoming-color": "var(--incoming-color)",
        "outgoing": "var(--outgoing)",
        "outgoing-color": "var(--outgoing-color)",
        "campaign": "var(--campaign)",
        "campaign-color": "var(--campaign-color)",
        "build": "var(--build)",
        "build-color": "var(--build-color)",
      },
      borderRadius: {
        "radius": "var(--radius)",
        "custom-lg": "var(--rounded-lg)",
        "modal-radius": "var(--modal-radius)",
      },
      animation: {
        "marquee-up": "marquee-up 35s linear infinite",
        "marquee-down": "marquee-down 35s linear infinite",
      },
      keyframes: {
        "marquee-up": {
          "0%": { transform: "translateY(0%)" },
          "100%": { transform: "translateY(-50%)" },
        },
        "marquee-down": {
          "0%": { transform: "translateY(-50%)" },
          "100%": { transform: "translateY(0%)" },
        },
      },
    }

  },
  plugins: [],
};

export default config;

