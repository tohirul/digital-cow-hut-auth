"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Create a new object by picking specific properties from an input object.
 *
 * @param obj - The input object from which properties will be picked.
 * @param keys - An array of keys (property names) to pick from the input object.
 * @returns A new object containing only the specified properties.
 */
const pick = (obj, keys) => {
    // Initialize an empty object to store the picked properties
    const finalObj = {};
    // Iterate through the specified keys
    for (const key of keys) {
        // Check if the input object has the specified key and add it to the new object
        if (obj && Object.hasOwnProperty.call(obj, key)) {
            finalObj[key] = obj[key];
        }
    }
    // Return the new object containing the picked properties
    return finalObj;
};
exports.default = pick;
