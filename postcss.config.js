const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');

const isProduction = process.env.NODE_ENV === 'production' && true;

module.exports = {
  plugins: isProduction ? [autoprefixer, cssnano] : [autoprefixer],
};
