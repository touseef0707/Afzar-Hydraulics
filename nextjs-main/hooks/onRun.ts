"use client";

import { useState } from "react";

export function useRun() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function run(flowdata: any): Promise<any> {
  setLoading(true);
  setError(null);
  try {
    const response = await fetch("http://localhost:8000/api/run", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(flowdata),
      mode: 'cors', // Explicitly set CORS mode
      credentials: 'include' // Include if you need cookies/auth
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (err: any) {
    setError(err.message || "Unknown error");
    throw err;
  } finally {
    setLoading(false);
  }
}

  return { run, loading, error };
}
