export function decodeValueCookie(cookieValue: string) {
  try {
    // Step 1: Decode URL-encoded string
    const decoded = decodeURIComponent(cookieValue);

    // Step 2: Remove "j:" prefix if present
    const jsonString = decoded.startsWith("j:") ? decoded.slice(2) : decoded;

    // Step 3: Parse JSON
    return JSON.parse(jsonString);
  } catch (error) {
    console.error("Failed to decode authUser cookie:", error);
    return null;
  }
}
