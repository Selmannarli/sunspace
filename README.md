# SUNSPACE

Sun–Shadow Dynamics for Climate-Responsive Urban Spaces and Higher Education.

An interactive educational urban laboratory: select a map area, generate a simplified model, explore time and seasons, add trees or pergolas, and compare shade coverage.

## Run locally

Serve this directory with any static HTTP server. No package installation or build step is required.

## Publish

GitHub Pages serves the root of the `main` branch. Changes pushed to `main` are published automatically.

## Model and data

Solar position uses NOAA's approximate equations and the selected local time zone. Coverage uses a 3 m ground grid. Shade duration uses 30-minute midpoint samples from 08:00–18:00, excluding night. Trees and pergolas are simplified opaque shade objects. This is not a thermal-comfort model.

The Barcelona example includes building data from 14 September 2026 and an expanded context snapshot from 15 September 2026 (`barcelona-context.json`). Other areas request data from Overpass and fall back to a labelled illustrative model when unavailable. Tagged building heights are distinguished from estimates. Designs remain in the browser session.

`urban-context.js` imports roads, paths, railways, mapped water, parks, vegetation and land-use surfaces. Ground multipolygon members are stitched into outer rings with inner holes preserved. Width tags take priority over lane-based and type-based estimates. The layer panel toggles visibility; mapped water is always excluded from dry-ground shade metrics and intervention placement. Ground layers remain flat; terrain, elevated bridges, coastline-to-ocean filling and complex building relations are not reconstructed. Missing or incomplete data is reported rather than invented.

Run `node context.test.mjs` to validate geometry stitching, water islands, path widths and real Barcelona layer ingestion. After editing browser assets, update the release value in `version-assets.mjs` and run it before publishing to avoid stale cached modules and styles.

Map data © [OpenStreetMap contributors](https://www.openstreetmap.org/copyright), licensed under ODbL. The included `barcelona-osm.json` retains its source attribution. Solar reference: [NOAA equations](https://gml.noaa.gov/grad/solcalc/solareqns.PDF).
