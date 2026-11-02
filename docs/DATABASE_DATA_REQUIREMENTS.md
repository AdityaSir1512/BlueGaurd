# BlueGuard Database and Data Requirements

## Scope

This is the Phase 0 audit of the existing BlueFusion repository. The new BlueGuard MongoDB was created and verified on 2026-09-10. Findings below are based on checked-in source files, `backend/Biodiveristy.json`, and the completed additive import.

## Existing Data Audit

The repository contains one checked-in JSON dataset:

- File: `backend/Biodiveristy.json`
- Shape: JSON array
- Records: 1,113
- Fields: `decimalLatitude`, `decimalLongitude`, `date_year`, `depth`, `family`, `familyid`, `genus`, `genusid`, `habitat`, `dataset_id`, `class`, `classid`
- Example coverage: records include 2019 observations and coordinates such as latitude 8.8713 and longitude 78.2275.
- Subject: biodiversity/taxonomic observations, not marine pollution reports.

The active Mongoose model is `backend/src/models/Biodiversity.ts`. The new database now contains 1,113 records in the collection used by that model. No old BlueFusion database was accessed. There is no database dump or export containing old MongoDB collection metadata.

## Data Gap Matrix

| Data | Already Exists? | Useful? | New Data Needed? |
|------|------------------|---------|------------------|
| Biodiversity | YES, 1,113 local JSON records | YES, as contextual/reference data | YES, provenance and validation metadata |
| Pollution reports | NO | Not applicable | YES |
| Historical pollution | NO | Not applicable | YES, from a documented external source |
| User accounts | NO | Not applicable | YES |
| GPS coordinates | YES, in biodiversity records | YES, for biodiversity context only | YES, for user pollution reports |
| Images | NO | Not applicable | YES |
| AI labels | NO | Not applicable | YES, through a separately sourced/labeled image dataset |
| Severity | NO | Not applicable | YES |
| Historical dates | YES, `date_year` in biodiversity records | Limited: biodiversity dates only | YES, pollution dates and source metadata |
| Report status | NO | Not applicable | YES |
| Audit trail | NO | Not applicable | YES |
| Map/hotspot aggregates | NO | Not applicable | YES, derived from actual report data |

## Existing Useful Fields

The existing biodiversity fields can support a separate `BiodiversityObservation` collection or a clearly labeled biodiversity section:

- `decimalLatitude`, `decimalLongitude`: geospatial observation coordinates, subject to validation.
- `date_year`: observation year.
- `depth`: observation depth.
- `family`, `genus`, `class`: taxonomy labels.
- `familyid`, `genusid`, `classid`: source taxonomy identifiers.
- `habitat`: source habitat description.
- `dataset_id`: source dataset identifier.

They do not prove pollution, severity, cleanup, user identity, AI classification, or risk.

## Existing Unusable or Insufficient Fields for Pollution

The current dataset has no fields for image evidence, pollution type, severity, report status, reporter, timestamp precision, verification, AI prediction, confidence, or remediation. It must not be relabeled as pollution data.

## New Collections Recommended

These are recommendations for approval, not implemented schemas:

1. `users`: identity, password hash, role, profile, timestamps.
2. `pollutionReports`: user-submitted evidence, classification, coordinates, status, timestamps, source, and moderation audit fields.
3. `historicalPollutionRecords`: external dataset records with source, license, original identifier, normalized fields, and import provenance.
4. `biodiversityObservations`: preserved/normalized copy of useful biodiversity observations, isolated from pollution reports.
5. `awarenessContent`: reviewed educational content and source references.
6. `conservationActivities`: verified activities and organizer/source metadata; do not create fictional events.
7. `riskAssessments`: derived risk estimates with input window, methodology version, data sufficiency, and generated timestamp.
8. `aiClassifications` or embedded classification history: model version, label, confidence, and user correction.

All geospatial report collections should use validated GeoJSON `Point` coordinates and a `2dsphere` index. The exact schema should be finalized after the API and privacy design review.

## Migration Recommendation

Use a combination strategy:

- Create a completely new BlueGuard MongoDB database.
- Do not connect BlueGuard to the old/fallback `bluefusion` database.
- Preserve the 1,113 biodiversity records as source/reference data. With approval, they were imported into the collection used by the existing `Biodiversity` model; this is biodiversity reference data and is not a pollution collection.
- Do not migrate them into `pollutionReports` and do not infer pollution, severity, hotspots, or risk from them.
- Keep the original JSON as an immutable source artifact and record source filename, import date, transformation version, accepted count, rejected count, and rejection reasons.
- Start users, pollution reports, AI labels, historical pollution, risk assessments, awareness, and conservation collections from scratch.

### Completed biodiversity import record

- Source: `backend/Biodiveristy.json`
- Destination: collection used by `backend/src/models/Biodiversity.ts`
- Import date: 2026-09-10
- Records read: 1,113
- Records accepted: 1,113
- Records rejected: 0
- Transformation: none; the original 12 fields were preserved as supplied.
- Import method: additive Mongoose batch insert in batches of 100.
- Existing records before import: 0
- Records removed: 0
- Pollution records created: 0
- Limitation: provenance metadata was documented here rather than stored as fields in each document; a repeatable migration script and richer provenance fields should be added before any future import.

## Historical Pollution Data

A credible candidate is the European Environment Agency Marine LitterWatch dataset. Before importing it, verify its current official download/API location, coverage, date range, fields, license/access conditions, spatial reference, and quality limitations. It must remain explicitly labeled as external historical data and must not be mixed silently with BlueGuard user reports.

Other datasets may be considered only after the same provenance and licensing review. No historical pollution records are currently present in this repository.

## AI Training Data

No image dataset, labels, trained model, evaluation report, or AI service exists in the repository. Biodiversity records cannot train an image classifier. A future classifier needs separately sourced images labeled for the supported pollution categories, documented licensing, train/validation/test separation, preprocessing, class balance review, and evaluation metrics. Until that exists, AI classification must be labeled as unavailable or development-only and never presented as accurate.

## User-Generated Data

After launch, BlueGuard can naturally collect pollution reports containing user-submitted images, user-confirmed type, description, severity, coordinates, timestamps, status changes, and moderation history. Consent, retention, image moderation, location privacy, and deletion rules must be designed before collection.

## Validation Requirements

- Validate latitude and longitude ranges and reject invalid coordinates.
- Validate image MIME type, size, dimensions, and storage policy.
- Validate pollution type and severity against extensible enumerations.
- Validate timestamps and preserve source timestamps separately from ingestion timestamps.
- Validate user input length and sanitize stored/displayed content.
- Record provenance for every external import.
- Keep user reports, external historical data, biodiversity observations, and derived analytics distinguishable by source.
- Store model name/version and confidence for every AI result.
- Record sufficient-data flags for risk estimates and hotspots.

## Decision Questions for Approval

1. Approve biodiversity preservation as a separate reference collection?
2. Approve the proposed collection boundaries?
3. Approve the EEA Marine LitterWatch investigation as the first historical-data research task?
4. Approve beginning BlueGuard user-generated collections empty?
5. Approve a separately researched image dataset rather than treating biodiversity data as AI training data?
