"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose")); // Import Mongoose for MongoDB
require("process");
const app_1 = __importDefault(require("./app")); // Import the Express.js application
const config_1 = __importDefault(require("./config")); // Import application configuration
const Database_1 = __importDefault(require("./Database")); // Import the database connection setup
const port = config_1.default.port; // Get the port number from configuration
let server; // Declare a server variable
/**
 * Toggle_Server - Start the server and establish a database connection.
 *
 * This function initializes the server and connects to the database.
 * It handles server shutdown gracefully on specific signals and errors.
 */
const Toggle_Server = async () => {
    try {
        // Connect to the MongoDB database
        await (0, Database_1.default)();
        // Start the HTTP server on the specified port
        server = app_1.default.listen(port, () => {
            console.info(`Server is breathing on PORT: ${port}`);
        });
    }
    catch (error) {
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
process.on('unhandledRejection', async (error) => {
    console.error('unhandledRejection', error);
    handleServerShutdown('unhandledRejection', error);
});
process.on('uncaughtException', (error) => {
    console.error('Uncaught Exception:', error);
    handleServerShutdown('uncaughtException', error);
});
/**
 * Handle server shutdown gracefully.
 *
 * @param eventName - The event name or signal triggering the shutdown.
 * @param error - An optional error object.
 */
const handleServerShutdown = async (eventName, error) => {
    console.warn(`Server received ${eventName} signal. Server connection will be closed.`);
    try {
        if (mongoose_1.default.connection.readyState === 1) {
            // Check if the MongoDB connection is open (readyState 1)
            await mongoose_1.default.disconnect();
            console.info('MongoDB connection closed.');
        }
    }
    catch (mongoError) {
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
    }
    else {
        console.info('Server was not running.');
        process.exit(0);
    }
};
// Start the server
