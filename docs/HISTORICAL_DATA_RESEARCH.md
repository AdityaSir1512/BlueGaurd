# BlueGuard Historical Pollution Data Research

## Status

The official EEA download has now been obtained and inspected locally. No records have been imported yet.

## Verified Source

The downloaded EEA dataset is:

- Title: `Assessment of marine litter in all four regional seas, 2010-2021`.
- Dataset folder: `backend/data/eea-marine-litter/eea_v_3035_100_k_marine-litter_p_2010-2021_v01_r00/`.
- GeoPackage: `ml_wms.gpkg`.
- Layer: `MALT_Potential_problem_area_masked`.
- Features: `7,083`.
- Geometry: `MULTIPOLYGON`.
- CRS: EPSG:3035, ETRS89 Lambert Azimuthal Equal Area.
- Attributes: `OBJECTID`, `GRIDCODE`, `Area_km2`, `Class`, and `Orig_km2`.
- Temporal coverage: 2010–2021.
- Metadata identifier: `15389e51-5204-4c6b-b40f-ad4af9a6f590`.
- Publisher/contact in metadata: European Environment Agency.
- Official metadata record linked by the supplied README: `https://sdi.eea.europa.eu/geonetwork/srv/api/records/15389e51-5204-4c6b-b40f-ad4af9a6f590`.
- Description: preliminary classification and identification of non-problem and potential problem areas using the prototype Marine Litter Assessment Tool (MALT), a multi-metric indicator-based status assessment.
- License: CC BY 4.0; copyright holder: European Environment Agency, as stated in the supplied XML metadata.
- Local source checksum: `fe105cb0819b3a9029036e9b9f1181d03f8d3690a566932b213d75f53800e38c` (SHA-256 for `ml_wms.gpkg`).
- Observed class profile: 5,429 blank-class features, 516 `Mod`, 509 `Poor`, 257 `Good`, 204 `High`, and 168 `Bad`.
- Underlying assessment context in the metadata references multiple source programmes and observations, including seafloor litter surveys, Marine LitterWatch, OSPAR, and EMODnet. These source observations are not exposed as individual features in this GeoPackage layer.

This is polygon-level assessment data. It is not a collection of individual litter observations, user reports, cleanup events, or point measurements. `Class` was empty in the inspected sample and must be assessed across all features before interpreting it.

The previously recorded EEA URLs were also checked on 2026-09-10 and are not currently usable as source pages:

- `https://www.eea.europa.eu/en/topics/in-depth/marine-litter` returned HTTP 404.
- `https://www.eea.europa.eu/data-and-maps/dashboards/marine-litterwatch` returned HTTP 410.
- `https://www.eea.europa.eu/en/topics/in-depth/marine-litterwatch` returned HTTP 404.
- `https://www.eea.europa.eu/en/analysis/indicators/marine-litter-on-beaches` returned HTTP 404.

These responses do not prove that the dataset no longer exists; they prove only that these recorded pages cannot currently serve as the verified source or download location.

## Current Decision

The dataset is approved for a separate historical assessment-area import after metadata/license review. It must not be imported into `pollutionReports` and must not be treated as point observations.

Recommended destination: `historicalPollutionAssessments`, with source metadata, assessment period, original `OBJECTID`, `GRIDCODE`, area values, class, and geometry transformed to GeoJSON. Preserve the source CRS and transformation details. Do not use a `2dsphere` index until the geometry has been transformed from EPSG:3035 to WGS84 (EPSG:4326).

Before import, confirm the license/access conditions in the XML metadata and record the exact source file checksum. A GeoPackage-aware transformation tool or library is required; SQLite alone is not sufficient to safely convert the GeoPackage binary geometry to GeoJSON.

The license and checksum have now been verified. The remaining pre-import work is geometry transformation from EPSG:3035 to EPSG:4326, a complete mapping of blank and non-blank `Class` values, and a decision about whether blank-class assessment areas should be retained or rejected with a documented reason.

### Preparation completed

- Script: `backend/scripts/prepareEeaHistorical.py`.
- Output: `historical-assessments.geojson` beside the source GeoPackage.
- Output CRS: EPSG:4326.
- Features preserved: 7,083.
- Geometry types: `MultiPolygon`.
- Blank/whitespace `Class` values: retained and normalized to `UNCLASSIFIED` (5,429 features).
- Other classes preserved: `Mod` 516, `Poor` 509, `Good` 257, `High` 204, `Bad` 168.
- MongoDB destination: `historicalPollutionAssessments`.
- MongoDB records imported: 7,083.
- MongoDB records rejected: 0.
- MongoDB records deleted: 0.
- Import command: `npm run import:eea-historical --prefix backend`.
- Import guard: aborts when `historicalPollutionAssessments` is non-empty.
- Verified stored checksum: `fe105cb0819b3a9029036e9b9f1181d03f8d3690a566932b213d75f53800e38c`.

## Required Verification Before Import

A future source review must identify a live official page or data portal entry and record:

- Official dataset name and publisher.
- Stable official URL or API endpoint.
- Download format and schema.
- Geographic coverage.
- Date range and observation frequency.
- Original identifiers.
- Coordinate reference system and coordinate quality.
- Pollution/litter categories and their definitions.
- License, access conditions, and attribution requirements.
- Update frequency and archival policy.
- Missing-value and duplicate-record handling.
- Cleaning and normalization mapping into `HistoricalPollutionRecord`.
- Import date, source version, accepted count, rejected count, and rejection reasons.

## Separation Rule

Historical records must remain distinguishable from BlueGuard user reports:

- Collection: `historicalPollutionRecords`.
- Source marker: external publisher and original identifier.
- UI label: `Historical / External Data`.
- No historical record may be presented as a BlueGuard user report.
- Historical records must not be used as AI image-training data without a separate image and licensing review.

## Alternatives to Investigate

If the EEA source remains unavailable, investigate official EU data-portal records or another government/intergovernmental marine-litter dataset. Apply the same provenance and licensing requirements. A source is not approved merely because it contains plausible-looking coordinates or pollution labels.

## Data Limitation

Until a source is verified, BlueGuard analytics, maps, hotspots, and risk estimates must use BlueGuard user reports only and must visibly report insufficient data when no verified reports exist.
