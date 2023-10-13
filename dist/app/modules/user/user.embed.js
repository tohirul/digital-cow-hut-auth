'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
/**
 * Embed data from a field object into an object implementing IUser interface.
 *
 * @param field - An object containing data to embed.
 * @param data - An object implementing the IUser interface to embed data into.
 * @param nameString - A string representing the name or identifier for the embedded data.
 * @returns A new object implementing the IUser interface with embedded data.
 */
const embed = (field, data, nameString) => {
  // Iterate through the keys of the field object
  Object.keys(field).forEach(key => {
    // Create an inner key by combining the nameString and the current key
    const inner = `${nameString}.${key}`;
    // Assign the value from the field object to the inner key in the data object
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data[inner] = field[key];
  });
  // Return the data object with embedded data
  return data;
};
exports.default = embed;
