import { z } from "zod";

/**
 * Represents the structure for field errors within an action. It maps each field of type `T` to an array of error messages.
 * This is used to capture and relay validation errors for individual fields in the input data.
 *
 * @template T - The type of the input data structure, where each key represents a field that can have validation errors.
 */
export type FieldErrors<T> = {
  [K in keyof T]?: string[];
};

/**
 * Describes the state of an action after its execution. This includes any field-specific validation errors,
 * a general error message if applicable, and the data resulting from the action if it was successful.
 *
 * @template TInput - The type of the input data passed to the action.
 * @template TOutput - The type of the output data produced by the action, if successful.
 */
export type ActionState<TInput, TOutput> = {
  fieldErrors?: FieldErrors<TInput>; // Optional object containing validation errors for each field
  error?: string | null; // Optional string to indicate a general error message, null if no error
  data?: TOutput; // Optional output data of the action, undefined if action failed
};

/**
 * Creates a safe action function that validates input data against a Zod schema before executing the action handler.
 *
 * @param schema A Zod schema for input validation.
 * @param handler A function to be executed with validated data. Returns an `ActionState` object.
 * @returns A function that takes input data, validates it against the schema, and if valid, executes the handler.
 *          If the input data is invalid, it returns the validation errors. Otherwise, it returns the result of the handler.
 */
export function createSafeAction<TInput, TOutput>(
  schema: z.Schema<TInput>,
  handler: (validatedData: TInput) => Promise<ActionState<TInput, TOutput>>,
) {
  return async (data: TInput): Promise<ActionState<TInput, TOutput>> => {
    const validatedFields = schema.safeParse(data);

    if (!validatedFields.success) {
      // If validation fails, return an object with field errors
      return {
        fieldErrors: validatedFields.error.flatten().fieldErrors as FieldErrors<TInput>,
      };
    }

    // If validation succeeds, call the handler with validated data and return its result
    return handler(validatedFields.data);
  };
}
