// Import the necessary modules
import mongoose from 'mongoose';
import 'process';
import config from './config';

// Get the database URI from the configuration file
const URI = config.database_url as string;

/**
 * This function establishes a connection to the MongoDB database using Mongoose.
 * It handles both successful and error scenarios.
 */
const Database = async () => {
  try {
    // Check if a valid URI is provided in the configuration
    if (!URI) {
      console.error(
        'No URI found in the configuration to connect to the database',
      );
      process.exit(1);
    }

    // Attempt to connect to the MongoDB database
    await mongoose.connect(URI).then(() => {
      console.info('Database connection established successfully');
    });
  } catch (error) {
    // Handle any errors that occur during the connection process
    console.error((error as Error).message);
  }
};

export default Database;
