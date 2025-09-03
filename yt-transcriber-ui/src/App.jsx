import { useState } from "react";

const API_BASE = "http://127.0.0.1:8000";

export default function App() {
  const [url, setUrl] = useState("");
  const [data, setData] = useState(null);       // will hold the transcript string
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function fetchCaptions() {
    setData(null);
    setError("");

    // start loading BEFORE the fetch
    setLoading(true);

    if (!url) {
      setError("Enter a YouTube URL");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(
        `${API_BASE}/captions?url=${encodeURIComponent(url)}`
      );

      if (!res.ok) {
        // try to extract a helpful error message from the server
        let msg = `Request failed (${res.status})`;
        try {
          const maybeJson = await res.json();
          if (maybeJson?.detail) msg = maybeJson.detail;
        } catch {
          const txt = await res.text().catch(() => "");
          if (txt) msg = txt;
        }
        throw new Error(msg);
      }

      const jsonData = await res.json(); // { video_id, count, captions: [...] }
      const transcript = jsonData.captions.map((c) => c.text).join(" ");
      setData(transcript);               // store as a single big string
    } catch (e) {
      setError(e?.message || "Failed to fetch captions");
    } finally {
      setLoading(false);                 // stop loading after everything
    }
  }

  return (
    <div
      style={{
        maxWidth: 700,
        margin: "40px auto",
        fontFamily: "system-ui, Segoe UI, Roboto",
      }}
    >
      <h1>YouTube Captions Fetcher</h1>

      <div style={{ display: "flex", gap: 8 }}>
        <input
          type="url"
          placeholder="https://www.youtube.com/watch?v=..."
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          style={{ flex: 1, minWidth: 260, padding: 10 }}
        />
        <button onClick={fetchCaptions} disabled={loading}>
          {loading ? "Loading..." : "Get Captions"}
        </button>
      </div>

      {error && (
        <p style={{ color: "crimson", marginTop: 8 }}>{String(error)}</p>
      )}

      {/* Show the transcript as wrapped text inside a scrollable box */}
      {data && (
        <div
          style={{
            marginTop: 12,
            background: "#111",
            color: "white",
            padding: 12,
            borderRadius: 8,
            maxHeight: "400px",
            overflowY: "auto",
            whiteSpace: "pre-wrap", // preserve newlines & wrap lines
            wordWrap: "break-word",  // break long words if needed
          }}
        >
          {data}
        </div>
      )}
    </div>
  );
}
