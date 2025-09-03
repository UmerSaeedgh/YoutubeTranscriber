# YouTube Transcriber API (FastAPI Wrapper)

This project provides a simple **FastAPI service** that fetches **YouTube captions (subtitles)** using [`youtube-transcript-api`](https://pypi.org/project/youtube-transcript-api/).  

It exposes an HTTP endpoint where you can send a YouTube URL and get back the transcript as structured JSON.

---

## Features
- Fetches auto-generated or manual captions from YouTube  
- Returns captions with text, start time, and duration  
- Provides a REST API via FastAPI  
- Includes built-in validation (URL must be valid)  

---

## Setup

### 1. Install dependencies
```bash
pip install fastapi "uvicorn[standard]" youtube-transcript-api
```

### 2. Run the server
```bash
uvicorn app:app --reload --port 8000
```

`app:app` = `filename:FastAPI_instance`

---

## API Endpoints

### Get captions
```
GET /captions?url=<YouTube URL>
```

Example:
```
GET http://127.0.0.1:8000/captions?url=https://www.youtube.com/watch?v=hpEDvAhKD8E
```

Response:
```json
{
  "video_id": "hpEDvAhKD8E",
  "count": 3,
  "captions": [
    {"text": "Hello everyone", "start": 0.0, "duration": 2.3},
    {"text": "Welcome back", "start": 2.3, "duration": 3.1},
    {"text": "Let's begin", "start": 5.4, "duration": 2.0}
  ]
}
```

---

## API Docs
FastAPI auto-generates interactive docs:  
- Swagger UI → [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)  
- ReDoc → [http://127.0.0.1:8000/redoc](http://127.0.0.1:8000/redoc)  

---

## Project Structure
```
your_project/
│
├─ transcriber.py   # Contains TranscribeLink class (caption fetch logic)
├─ app.py           # FastAPI app that imports and exposes endpoints
├─ README.md
```
