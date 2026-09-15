# SUNSPACE

Sun–Shadow Dynamics for Climate-Responsive Urban Spaces and Higher Education.

An interactive educational urban laboratory: select a map area, generate a simplified model, explore time and seasons, add trees or pergolas, and compare shade coverage.

## Run locally

Serve this directory with any static HTTP server. No package installation or build step is required.

## Publish

GitHub Pages serves the root of the `main` branch. Changes pushed to `main` are published automatically.

## Model and data

Solar position uses NOAA's approximate equations and the selected local time zone. Coverage uses a 3 m ground grid. Shade duration uses 30-minute midpoint samples from 08:00–18:00, excluding night. Trees and pergolas are simplified opaque shade objects. This is not a thermal-comfort model.

The Barcelona example includes OpenStreetMap data retrieved on 14 September 2026. Other areas request data from Overpass and fall back to a labelled illustrative model when unavailable. Tagged building heights are distinguished from estimates. Flat terrain; no complex building relations. Designs remain in the browser session.

Map data © [OpenStreetMap contributors](https://www.openstreetmap.org/copyright), licensed under ODbL. The included `barcelona-osm.json` retains its source attribution. Solar reference: [NOAA equations](https://gml.noaa.gov/grad/solcalc/solareqns.PDF).
