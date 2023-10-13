'use strict';
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
// Import the necessary modules
const mongoose_1 = __importDefault(require('mongoose'));
require('process');
const config_1 = __importDefault(require('./config'));
// Get the database URI from the configuration file
const URI = config_1.default.database_url;
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
    await mongoose_1.default.connect(URI).then(() => {
      console.info('Database connection established successfully');
    });
  } catch (error) {
    // Handle any errors that occur during the connection process
    console.error(error.message);
  }
};
exports.default = Database;
