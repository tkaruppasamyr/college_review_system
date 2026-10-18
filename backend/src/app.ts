import express, { type Request, type Response,type NextFunction, type Express } from 'express';
const dbInitialization = require('./config/database');
import { clgrouters, collegedashboardrouter } from './apps/college/clgrouter';
import { authRouters } from './apps/auth/router';
import { authenticateToken } from './apps/auth/authhandler';
require('dotenv').config();
import cookieParser from 'cookie-parser';
const cors = require('cors');
const morgan = require('morgan');

const rootpath = process.env.ROOT_PATH;

const app: Express = express();
const port = process.env.PORT;

dbInitialization();
app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type'],
  credentials: true
}));
app.use(morgan('dev'));
// app.use((req: Request, res: Response, next: NextFunction) => {
//   console.log(`Incoming request: [${req.method}] ${req.url} status: ${res.statusCode}`);
//   next(); // Passes control to the next handler
// });

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});


app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});

app.use(`${rootpath}/auth`, authRouters);
app.use(`${rootpath}/college`,authenticateToken, clgrouters);
app.use(`${rootpath}/dashbords`,collegedashboardrouter);
// app.use(`${rootpath}/college`,clgrouters);