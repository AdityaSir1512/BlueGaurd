import json
import os
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from typing import Any


HOST = os.getenv("AI_SERVICE_HOST", "0.0.0.0")
PORT = int(os.getenv("AI_SERVICE_PORT", "8000"))


class AIRequestHandler(BaseHTTPRequestHandler):
    def _send_json(self, status: int, payload: dict[str, Any]) -> None:
        body = json.dumps(payload).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def do_GET(self) -> None:
        if self.path == "/health":
            self._send_json(200, {"status": "ok", "service": "blueguard-ai", "modelStatus": "unavailable"})
            return
        self._send_json(404, {"error": "Not found"})

    def do_POST(self) -> None:
        if self.path != "/classify":
            self._send_json(404, {"error": "Not found"})
            return

        try:
            content_length = int(self.headers.get("Content-Length", "0"))
            if content_length > 1_000_000:
                self._send_json(413, {"error": "Request body is too large"})
                return
            body = self.rfile.read(content_length)
            request = json.loads(body.decode("utf-8"))
            image_url = request.get("imageUrl")
            if not isinstance(image_url, str) or not image_url.strip():
                self._send_json(400, {"error": "imageUrl is required"})
                return
        except (ValueError, json.JSONDecodeError, UnicodeDecodeError):
            self._send_json(400, {"error": "A valid JSON body is required"})
            return

        self._send_json(
            200,
            {
                "status": "unavailable",
                "prediction": None,
                "confidence": None,
                "modelVersion": None,
                "message": "No trained BlueGuard image model is configured yet. No classification was made.",
            },
        )

    def log_message(self, _format: str, *_args: Any) -> None:
        return


def main() -> None:
    server = ThreadingHTTPServer((HOST, PORT), AIRequestHandler)
    print(f"BlueGuard AI service listening on port {PORT}")
    server.serve_forever()


if __name__ == "__main__":
    main()
