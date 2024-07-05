import { useCallback, useState } from "react";
import { ActionState, FieldErrors } from "@/lib/ create-safe-action";

/**
 * Defines the structure of an action function that takes input data of type `TInput` and returns a promise that resolves to an `ActionState<TInput, TOutput>`.
 * This type is used to represent asynchronous actions, such as API calls, that require input and produce an output along with possible errors.
 *
 * @template TInput - The type of the input data for the action.
 * @template TOutput - The type of the output data produced by the action, if successful.
 */
type Action<TInput, TOutput> = (data: TInput) => Promise<ActionState<TInput, TOutput>>;

/**
 * Options for configuring the behavior of the `useAction` hook. Allows specifying callbacks for handling success, error, and completion of the action.
 *
 * @template TOutput - The type of the output data produced by the action, if successful.
 */
interface UseActionOptions<TOutput> {
  onSuccess?: (data: TOutput) => void; // Optional callback function to be called when the action is successful.
  onError?: (error: string) => void; // Optional callback function to be called when the action encounters an error.
  onComplete?: () => void; // Optional callback function to be called when the action is complete, regardless of success or failure.
}

/**
 * Custom hook to abstract and manage the execution of asynchronous server actions, with built-in state management for loading, errors, and result data.
 * It provides a structured way to handle asynchronous operations, including success, error, and completion callbacks.
 *
 * @template TInput - The type of the input data passed to the action.
 * @template TOutput - The type of the output data produced by the action, if successful.
 * @param {Action<TInput, TOutput>} action - The asynchronous action to be executed. This action should return a promise that resolves to an `ActionState`.
 * @param {UseActionOptions<TOutput>} options - Optional configuration options including callbacks for success, error, and completion events.
 * @returns An object containing:
 *          - `execute`: A function to trigger the execution of the action.
 *          - `isLoading`: A boolean indicating if the action is currently being executed.
 *          - `error`: A string representing an error message if the action failed.
 *          - `fieldErrors`: An object containing field-specific validation errors.
 *          - `data`: The result data of the action if it was successful.
 */
export default function useAction<TInput, TOutput>(
  action: Action<TInput, TOutput>,
  options: UseActionOptions<TOutput> = {},
) {
  const [fieldErrors, setFieldErrors] = useState<FieldErrors<TInput> | undefined>(undefined);
  const [error, setError] = useState<string | undefined>(undefined);
  const [data, setData] = useState<TOutput | undefined>(undefined);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const execute = useCallback(
    async (input: TInput) => {
      setIsLoading(true);

      try {
        // Execute the action with the provided input. If nothing is returned, avoid setting states and go to the `finally` block.
        const result = await action(input);
        if (!result) return;

        // For field-specific validation errors if any.
        setFieldErrors(result.fieldErrors);

        // For general error message if any
        if (result.error) {
          setError(result.error);
          options.onError?.(result.error);
        }

        // For after getting successful data if any
        if (result.data) {
          setData(result.data);
          options.onSuccess?.(result.data);
        }
      } finally {
        // Always set loading to false and call the completion callback if provided.
        setIsLoading(false);
        options.onComplete?.();
      }
    },
    [action, options],
  );

  return {
    execute,
    isLoading,
    error,
    fieldErrors,
    data,
  };
}
