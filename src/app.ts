import cors from 'cors';
import express, { Application, Request, Response } from 'express';
import httpStatus from 'http-status';
import Routes from './app/routes/routes';
import GlobalErrorHandler from './app/middlewares/GlobalErrorHandler';
import cookieParser from 'cookie-parser';

// Create an Express application
const app: Application = express();

// Enable Cross-Origin Resource Sharing (CORS) for your API
app.use(cors());
app.use(cookieParser());
// Parse incoming JSON requests
app.use(express.json());

// Parse URL-encoded requests with extended option set to true
app.use(express.urlencoded({ extended: true }));

// Default Redirect Route
app.get('/', async (req: Request, res: Response) => {
  // Information about your API
  const apiInfo = {
    name: 'Digital Cow Hut',
    version: '1.0.0',
    description: 'API for managing Digital-Cow-Hut data.',
    endpoints: {
      users: '/api/v1/users',
      auth: '/api/v1/auth',
      cows: '/api/v1/cows',
      orders: '/api/v1/orders',
    },
  };

  // Send a JSON response with API information
  res.status(200).json({
    statusCode: httpStatus.OK,
    success: true,
    message: 'Server is live and ready to use',
    ...apiInfo,
  });
});

// Application Routes
app.use('/api/v1/', Routes);

// Error Handling Middleware
app.use(GlobalErrorHandler);

// Invalid URL Handler
app.use((req: Request, res: Response) => {
  // Handle requests to undefined routes
  res.status(httpStatus.NOT_FOUND).json({
    success: false,
    message: 'Invalid URL, please try again!',
    errorMessages: [
      {
        path: req.originalUrl,
        message: 'Please check your URL and try again!',
      },
    ],
  });
});

export default app;
