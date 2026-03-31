# Young Prodigy Athletics

Elite Youth Football Training — Oceanside, CA.

## Project Structure

```
young-prodigy-athletics/
├── public/
│   └── favicon.svg
├── src/
│   ├── App.jsx        ← main site component
│   └── main.jsx       ← React entry point
├── index.html
├── vite.config.js
├── package.json
└── .gitignore
```

## Local Development

```bash
npm install
npm run dev
```

Then open http://localhost:5173

## Deploy to Vercel

### Option A — Vercel CLI
```bash
npm install -g vercel
vercel
```

### Option B — GitHub + Vercel Dashboard
1. Push this repo to GitHub
2. Go to https://vercel.com/new
3. Import your GitHub repo
4. Framework preset: **Vite**
5. Click Deploy — done

## Adding a Real Contact Form

The contact form currently logs locally. To wire it up to email, swap the `submit` handler in `App.jsx` with a fetch to [Formspree](https://formspree.io):

```js
const submit = async (e) => {
  e.preventDefault()
  await fetch('https://formspree.io/f/YOUR_FORM_ID', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(form),
  })
  setSent(true)
}
```

Sign up free at formspree.io — no backend needed.
