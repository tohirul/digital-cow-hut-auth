// Import necessary modules and configurations
import http from 'http'; // Import Node.js HTTP module
import mongoose from 'mongoose'; // Import Mongoose for MongoDB
import 'process';

import app from './app'; // Import the Express.js application
import config from './config'; // Import application configuration
import Database from './Database'; // Import the database connection setup

const port = config.port; // Get the port number from configuration
let server: http.Server; // Declare a server variable

/**
 * Toggle_Server - Start the server and establish a database connection.
 *
 * This function initializes the server and connects to the database.
 * It handles server shutdown gracefully on specific signals and errors.
 */
const Toggle_Server = async (): Promise<void> => {
  try {
    // Connect to the MongoDB database
    await Database();

    // Start the HTTP server on the specified port
    server = app.listen(port, () => {
      console.info(`Server is breathing on PORT: ${port}`);
    });
  } catch (error) {
    console.error(error);
  }
};
Toggle_Server();

// Gracefully handle server shutdown on various signals and errors
process.on('SIGINT', async () => {
  handleServerShutdown('SIGINT');
});

process.on('SIGTERM', async () => {
  handleServerShutdown('SIGTERM');
});

process.on('unhandledRejection', async (error: Error) => {
  console.error('unhandledRejection', error);
  handleServerShutdown('unhandledRejection', error);
});

process.on('uncaughtException', (error: Error) => {
  console.error('Uncaught Exception:', error);
  handleServerShutdown('uncaughtException', error);
});

/**
 * Handle server shutdown gracefully.
 *
 * @param eventName - The event name or signal triggering the shutdown.
 * @param error - An optional error object.
 */
const handleServerShutdown = async (eventName: string, error?: Error) => {
  console.warn(
    `Server received ${eventName} signal. Server connection will be closed.`,
  );

  try {
    if (mongoose.connection.readyState === 1) {
      // Check if the MongoDB connection is open (readyState 1)
      await mongoose.disconnect();
      console.info('MongoDB connection closed.');
    }
  } catch (mongoError) {
    console.error('Error closing MongoDB connection:', mongoError);
  }

  if (server) {
    server.close(() => {
      if (error) {
        console.error(error);
      }
      console.info('Server closed.');
      process.exit(0);
    });
  } else {
    console.info('Server was not running.');
    process.exit(0);
  }
};
// Start the server
