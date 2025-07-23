/**
 * Sets the __session cookie by posting the Firebase ID token to the /api/session endpoint.
 * This allows the server (and middleware) to validate the user.
 */
export async function setSessionCookie(token: string): Promise<void> {
  try {
    const response = await fetch('/api/session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token }),
    });

    if (!response.ok) {
      throw new Error(`Failed to set session cookie: ${response.statusText}`);
    }
  } catch (error) {
    console.error('[setSessionCookie] Error setting session cookie:', error);
    throw error; // optional: re-throw to handle in calling function
  }
}

/**
 * Clears the __session cookie by calling the DELETE method on /api/session.
 */
export async function clearSessionCookie(): Promise<void> {
  try {
    const response = await fetch('/api/session', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({token:''}),
    });

    if (!response.ok) {
      throw new Error(`Failed to clear session cookie: ${response.statusText}`);
    }
  } catch (error) {
    console.error('[clearSessionCookie] Error clearing session cookie:', error);
    throw error;
  }
}
