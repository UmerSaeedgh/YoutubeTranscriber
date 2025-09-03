from fastapi import FastAPI, HTTPException, Query
from pydantic import BaseModel, HttpUrl
from typing import List
from transcriber import TranscribeLink

app = FastAPI(title = 'Youtube Transcriber', version="1.0.0")

class CaptionLine(BaseModel):
    text: str
    start: float
    duration: float

class CaptionsResponse(BaseModel):
    video_id: str
    count: int
    captions: List[CaptionLine]

@app.get("/captions", response_model=CaptionsResponse)
def get_captions(url: HttpUrl = Query(..., description="Youtube URL")):
    tl = TranscribeLink(str(url))
    data = tl.get_yt_captions()

    if data is None:
        raise HTTPException(status_code=400, detail="Invalid YouTube URL (could not extract video id).")
    if isinstance(data, str):
        raise HTTPException(status_code=404, detail=data)

    return {
        "video_id": tl.yt_id,
        "count": len(data),
        "captions": data,
    }

from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # during dev; restrict precisely
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
