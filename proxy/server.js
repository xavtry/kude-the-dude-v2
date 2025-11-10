const express = require('express');
const fetch = require('node-fetch');
const cheerio = require('cheerio');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const basicAuth = require('basic-auth');
const cors = require('cors');
const path = require('path');


const app = express();
const PORT = process.env.PORT || 3000;
