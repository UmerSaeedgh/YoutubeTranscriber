from youtube_transcript_api import YouTubeTranscriptApi, TranscriptsDisabled, NoTranscriptFound
import yt_dlp
from faster_whisper import WhisperModel


class TranscribeLink:
    def __init__(self, yt_link):
        self.yt_link = yt_link
        self.yt_id = ''

    def get_yt_id(self):
        if "youtu.be" in self.yt_link:
            self.yt_id = self.yt_link.split("/")[-1]
        elif "youtube" in self.yt_link:
            self.yt_id = self.yt_link.split("v=")[-1]
        else:
            self.yt_id = None

    def get_yt_captions(self):
        self.get_yt_id()
        if self.yt_id is None:
            return None
        
        try:
            transcripts = YouTubeTranscriptApi()     # your working style
            fetched = transcripts.fetch(self.yt_id)   # iterable of snippets
            out = []
            for t in fetched:
                # handle both object and dict styles safely
                text = getattr(t, "text", None) or t.get("text")
                start = getattr(t, "start", None) or t.get("start")
                duration = getattr(t, "duration", None) or t.get("duration", 3.0)
                out.append({"text": text, "start": float(start), "duration": float(duration)})
            return out
        except (TranscriptsDisabled, NoTranscriptFound):
            return "Transcript not found"
