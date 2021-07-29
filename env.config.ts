
//npm install dotenv


//const dotenv = require('dotenv');
import dotenv from 'dotenv';
dotenv.config();


//require('dotenv').config({ path: `.env.${process.env.NODE_ENV}` })

/**
 dotenv.config({
  path: path.resolve(__dirname, process.env.NODE_ENV + '.env')
});
 */

export const ENV_API_URL = process.env.ENV_API_URL;
export const ENV_API_KEY = process.env.ENV_API_KEY;
export const ENV_PORT = process.env.ENV_PORT;

// module.exports = {
//   endpoint: process.env.API_URL,
//   masterKey: process.env.API_KEY,
//   port: process.env.PORT
// };

//https://medium.com/the-node-js-collection/making-your-node-js-work-everywhere-with-environment-variables-2da8cdf6e786