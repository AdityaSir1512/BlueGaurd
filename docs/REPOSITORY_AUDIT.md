# BlueGuard Repository Audit

## Audit Date

2026-09-10

## Active Application Paths

| Path | Classification | Evidence / purpose |
|------|----------------|--------------------|
| `frontend/src/main.tsx` | Active | React entry point that renders `App.tsx`. |
| `frontend/src/App.tsx` | Active | Current dashboard, navigation, upload state, and biodiversity page routing. |
| `frontend/src/pages/BiodiversityPage.tsx` | Active | Displays uploaded or API-backed biodiversity data. |
| `frontend/src/components/DataUpload.tsx` | Active | Client-side JSON/CSV upload and basic dataset detection. |
| `backend/src/index.ts` | Active | Express server, environment loading, MongoDB connection, and route registration. |
| `backend/src/routes/biodiversity.ts` | Active | Biodiversity GET and bulk-import endpoints. |
| `backend/src/models/Biodiversity.ts` | Active | Mongoose biodiversity model used by the active route. |
| `backend/Biodiveristy.json` | Active source data | Checked-in biodiversity source containing 1,113 records; imported into the new database as reference data. |

## Reusable but Not Currently Wired

| Path | Classification | Reuse decision |
|------|----------------|----------------|
| `frontend/src/components/MarineMap.tsx` | Reusable prototype | Reuse Leaflet setup and redesign around API-backed pollution/biodiversity data; current markers and protected areas are hard-coded demo values. |
| `frontend/src/components/MarineCharts.tsx` | Reusable prototype | Reuse Recharts patterns after replacing dummy values with API-backed analytics. |
| `frontend/src/components/DatasetTabs.tsx` | Reusable prototype | Revisit when oceanography, climate, and socioeconomic views become real features. |
| `frontend/src/pages/ClimatePage.tsx` | Placeholder | Keep as reference until a real data contract exists. |
| `frontend/src/pages/OceanographicPage.tsx` | Placeholder | Keep as reference until a real data contract exists. |
| `frontend/src/pages/SocioEconomicPage.tsx` | Placeholder | Keep as reference until a real data contract exists. |
| `frontend/src/App_ocean.tsx` | Legacy dashboard | Not imported by `main.tsx`; preserve as reference until the active dashboard replacement is verified. |
| `frontend/src/components/BlueFusionLogo.tsx` | Active but legacy-named | Current logo component is used by the active app. Rename only with a coordinated import/file change. |

## Duplicate or Legacy Backend Paths

| Path | Classification | Decision |
|------|----------------|----------|
| `backend/models/Biodiversity.ts` | Duplicate source | Outside `backend/tsconfig.json` `src` include; not active. Preserve temporarily for audit/reference. |
| `backend/models/Biodiversity.js` and declarations | Generated/legacy duplicate | Outside the active TypeScript source boundary; do not use for new code. |
| `backend/routes/biodiversity.ts` and declarations | Duplicate route source | Outside `backend/tsconfig.json` `src` include; active route is under `backend/src/routes`. |
| `backend/dist/` | Generated output | Produced by TypeScript build and ignored by `.gitignore`; safe to regenerate, but not a source of truth. |
| `frontend/dist/` | Generated output | Produced by Vite build and ignored by `.gitignore`; not a source of truth. |

## Scripts and Data Import

- `backend/scripts/importBiodiversity.js` is now the safe repeatable import command. It uses the checked-in dataset, requires `MONGODB_URI`, batches inserts, and aborts if the destination collection is non-empty.
- `backend/scripts/importData.js` remains legacy and contains a destructive `deleteMany` flow plus the old missing `Book1_final.json` path. It must not be used for BlueGuard.
- The root command `npm run import:biodiversity --prefix backend` is the supported biodiversity import command.

## Configuration Findings

- `backend/.env` contains private local configuration and is ignored by Git.
- `backend/.env.example`, `frontend/.env.example`, `mobile/.env.example`, and `ai/.env.example` contain safe templates.
- The active local API port is `5001` because macOS occupied port `5000`.
- The active frontend reads `VITE_API_URL`; it no longer depends on a hard-coded `localhost:5000` URL.
- The active backend requires `MONGODB_URI` and will not fall back to the old `bluefusion` database.

## Deletion Policy

No source file was deleted during this audit. The duplicate and legacy files should be removed only after the BlueGuard replacements are implemented, tested, and explicitly approved. Generated `dist` directories may be removed and regenerated when needed, but they are not part of the source migration.
