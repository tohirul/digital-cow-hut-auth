'use strict';
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
const cors_1 = __importDefault(require('cors'));
const express_1 = __importDefault(require('express'));
const http_status_1 = __importDefault(require('http-status'));
const routes_1 = __importDefault(require('./app/routes/routes'));
const GlobalErrorHandler_1 = __importDefault(
  require('./app/middlewares/GlobalErrorHandler'),
);
// Create an Express application
const app = (0, express_1.default)();
// Enable Cross-Origin Resource Sharing (CORS) for your API
app.use((0, cors_1.default)());
// Parse incoming JSON requests
app.use(express_1.default.json());
// Parse URL-encoded requests with extended option set to true
app.use(express_1.default.urlencoded({ extended: true }));
// Default Redirect Route
app.get('/', async (req, res) => {
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
    statusCode: http_status_1.default.OK,
    success: true,
    message: 'Server is live and ready to use',
    ...apiInfo,
  });
});
// Application Routes
app.use('/api/v1/', routes_1.default);
// Error Handling Middleware
app.use(GlobalErrorHandler_1.default);
// Invalid URL Handler
app.use((req, res) => {
  // Handle requests to undefined routes
  res.status(http_status_1.default.NOT_FOUND).json({
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
exports.default = app;
