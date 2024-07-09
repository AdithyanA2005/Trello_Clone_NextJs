/**
 * Performs a network request to the specified URL and returns the response as JSON.
 *
 * This function uses the Fetch API to make a GET request to the provided URL. It then waits for the response,
 * converts the response to JSON, and returns it. This is a generic fetcher function that can be used with
 * various data fetching libraries or React hooks that require a function to fetch data.
 *
 * @param {string} url - The URL to fetch data from.
 * @returns {Promise<any>} A promise that resolves with the JSON response.
 */
export async function fetcher<T>(url: string): Promise<T> {
  let res = await fetch(url);
  return await res.json();
}
