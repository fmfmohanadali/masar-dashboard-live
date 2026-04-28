export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        brand: '#0f3d69',
        brand2: '#14548f',
        soft: '#eef3f8',
      },
      boxShadow: {
        soft: '0 12px 30px rgba(15,61,105,.08)',
      },
      borderRadius: {
        xl2: '1.25rem',
      },
    },
  },
  plugins: [],
};
