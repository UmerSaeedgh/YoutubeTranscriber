import {useState} from "react";

const API_BASE = "http://127.0.0.1:8000"

export default function App(){

  const [url, setUrl] = useState("");
  const [data,  setData] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function fetchCaptions(){
    setData(null);
    setError("");
    setLoading(false);

    if(url == ""){
      setError("Enter a youtube url");
      return;
    }
    try{
      const values = await fetch(`${API_BASE}/captions?url=${encodeURIComponent(url)}`);
      if(!values.ok){
        setError(values);
      }
      const jsonData = await values.json();
      setData(jsonData);
    }
    catch (e){
      setError(e);
    }
    finally{
      setLoading(false);
    }
  }


return(
  <div style={{ maxWidth: 700, margin: "40px auto", fontFamily: "system-ui, Segoe UI, Roboto" }}>
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

      {error && <p style={{ color: "crimson", marginTop: 8 }}>{error}</p>}
      {data && (
        <pre style={{ textAlign: "left", background: "black", padding: 12, marginTop: 12 }}>
          {JSON.stringify(data, null, 2)}
        </pre>
      )}
    </div>
  );
}