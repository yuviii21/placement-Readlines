/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: 'hsl(245, 58%, 51%)',
                'primary-hover': 'hsl(245, 58%, 45%)',
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
                serif: ['Georgia', 'serif'],
            }
        },
    },
    plugins: [],
}
