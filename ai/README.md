# BlueGuard AI Service

This is the development interface for the BlueGuard AI service. It is intentionally dependency-free and does not contain a trained image-classification model.

## Run

```bash
python3 service.py
```

The service listens on `http://localhost:8000` by default.

## Endpoints

- `GET /health` reports `modelStatus: unavailable`.
- `POST /classify` accepts `{ "imageUrl": "..." }` and returns an explicit `unavailable` response.

The service must not claim a prediction or confidence until a real labeled dataset, replaceable model, evaluation process, and model version are added.
