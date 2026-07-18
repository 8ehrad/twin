# Behrad's Digital Twin Frontend

This is the Next.js frontend for Behrad Zabihi's digital twin. It presents a focused chat experience that lets visitors ask about Behrad's professional background, data science work, AI projects, skills, and collaboration style.

## Local Development

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

By default, the app sends chat requests to `http://localhost:8000`. Set `NEXT_PUBLIC_API_URL` if the backend is running somewhere else.

## Production Build

```bash
npm run build
```

The app is configured for static export and is deployed to S3/CloudFront by the root deployment script.
