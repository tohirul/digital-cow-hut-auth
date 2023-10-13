import { IUser } from './user.interface';
/**
 * Embed data from a field object into an object implementing IUser interface.
 *
 * @param field - An object containing data to embed.
 * @param data - An object implementing the IUser interface to embed data into.
 * @param nameString - A string representing the name or identifier for the embedded data.
 * @returns A new object implementing the IUser interface with embedded data.
 */
const embed = (
  field: Record<string, unknown>,
  data: Partial<IUser>,
  nameString: string,
): Partial<IUser> => {
  // Iterate through the keys of the field object
  Object.keys(field).forEach(key => {
    // Create an inner key by combining the nameString and the current key
    const inner = `${nameString}.${key}`;

    // Assign the value from the field object to the inner key in the data object
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (data as any)[inner] = field[key as keyof typeof field];
  });

  // Return the data object with embedded data
  return data;
};

export default embed;
