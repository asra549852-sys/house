# HomeFinder

Search homes for sale by city or ZIP, with photo galleries, all on your own site.

## Run it
    npm install
    npm start        # http://localhost:3000

It works out of the box with SimplyRETS **demo data** (sample Houston-area listings).

## Go live with real listings
1. Get RETS/RESO Web API access from your local MLS (usually requires a real estate license or a broker agreement).
2. Create an app at https://simplyrets.com to get your own key and secret.
3. Set `SIMPLYRETS_KEY` and `SIMPLYRETS_SECRET` as environment variables (see `.env.example`).
4. Deploy to Render, Railway, Fly.io, or Vercel. Keep keys on the server only.

Notes: MLS rules usually require showing the data-refresh timestamp, the listing office, and a disclaimer. The page does this, but check your MLS's display rules.
