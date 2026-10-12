// Keeps API keys on the server; the browser only talks to /api/search on YOUR site.
const express = require("express");
const path = require("path");
const app = express();
const KEY = process.env.SIMPLYRETS_KEY || "simplyrets";
const SECRET = process.env.SIMPLYRETS_SECRET || "simplyrets";
const AUTH = "Basic " + Buffer.from(`${KEY}:${SECRET}`).toString("base64");

app.use(express.static(path.join(__dirname, "public")));

app.get("/api/search", async (req, res) => {
  try {
    const { location = "", minprice, maxprice, minbeds, minbaths, sort, offset = 0 } = req.query;
    const p = new URLSearchParams({ limit: "12", offset: String(+offset || 0), status: "Active" });
    const loc = String(location).trim();
    if (/^\d{5}$/.test(loc)) p.set("postalCodes", loc);
    else if (loc) p.set("cities", loc.split(",")[0].trim());
    if (+minprice) p.set("minprice", minprice);
    if (+maxprice) p.set("maxprice", maxprice);
    if (+minbeds) p.set("minbeds", minbeds);
    if (+minbaths) p.set("minbaths", minbaths);
    if (sort === "lo") p.set("sort", "listprice");
    if (sort === "hi") p.set("sort", "-listprice");
    if (sort === "new") p.set("sort", "-listdate");

    const r = await fetch(`https://api.simplyrets.com/properties?${p}`, {
      headers: { Authorization: AUTH, Accept: "application/json" },
    });
    if (!r.ok) return res.status(502).json({ error: `Listings provider returned ${r.status}` });
    const data = await r.json();
    const homes = data.map((h) => ({
      id: h.mlsId,
      price: h.listPrice,
      beds: h.property?.bedrooms,
      baths: (h.property?.bathsFull || 0) + (h.property?.bathsHalf || 0) * 0.5,
      sqft: h.property?.area,
      type: h.property?.type,
      year: h.property?.yearBuilt,
      address: h.address?.full,
      city: h.address?.city,
      state: h.address?.state,
      zip: h.address?.postalCode,
      photos: h.photos || [],
      remarks: h.remarks,
      listDate: h.listDate,
      office: h.office?.name,
    }));
    res.json({ homes, lastUpdate: r.headers.get("x-simplyrets-lastupdate") });
  } catch (e) {
    res.status(500).json({ error: "Search failed. Please try again." });
  }
});

app.listen(process.env.PORT || 3000, () => console.log("HomeFinder running on http://localhost:" + (process.env.PORT || 3000)));
