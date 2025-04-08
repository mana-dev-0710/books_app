import type { Config } from "tailwindcss";

export default {
  
  content: [
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    'node_modules/flowbite-react/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",

        primary: {
          '50': '#f4f9f8',
          '100': '#dbece9',
          '200': '#b7d8d4',
          '300': '#8bbdb8',
          '400': '#78aba8',
          '500': '#498381',
          '600': '#396867',
          '700': '#305554',
          '800': '#2a4545',
          '900': '#263b3a',
          '950': '#122021',
        },
        secondary: {
          '50': '#fef5ee',
          '100': '#fce9d8',
          '200': '#f7cfb1',
          '300': '#ef9c66',
          '400': '#eb814c',
          '500': '#e66029',
          '600': '#d8481e',
          '700': '#b3351b',
          '800': '#8f2d1d',
          '900': '#73271b',
          '950': '#3e110c',
        },
        tertiary: {
          '50': '#fff9eb',
          '100': '#fdedc8',
          '200': '#fcdc94',
          '300': '#fac04f',
          '400': '#f9a726',
          '500': '#f2840e',
          '600': '#d76108',
          '700': '#b2410b',
          '800': '#91320f',
          '900': '#772a10',
          '950': '#441304',
        },
      },

      shadow:{
        nomal: '0px 3px 10px rgba(48, 72, 83, 0.15)',
        r: '0px 0px 10px rgba(24, 75, 89, 0.1)',
      },

      fontSize:{
        'xss': '11px',
      }
    },
  },
  plugins: [
    require('flowbite/plugin'),
  ],
} satisfies Config;
