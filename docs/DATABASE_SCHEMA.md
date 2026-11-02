# BlueGuard Database Schema Contract

## Status

Proposed Phase 3 contract based on the repository audit and the approved import of 1,113 biodiversity records. This document does not perform migrations or create new collections by itself.

## Data Separation Rule

BlueGuard must keep these sources distinct:

- `BiodiversityObservation`: existing biodiversity reference observations.
- `PollutionReport`: reports submitted by BlueGuard users.
- `HistoricalPollutionRecord`: external historical pollution data.
- `RiskAssessment`: derived estimates, never raw observations.

A biodiversity observation is not a pollution report. An AI prediction is not a moderation decision. A risk estimate is not a guaranteed forecast.

## Collections

### Users

Collection: `users`

| Field | Type | Required | Notes |
|------|------|----------|-------|
| `_id` | ObjectId | yes | MongoDB identifier. |
| `email` | string | yes | Normalize to lowercase; unique index. |
| `passwordHash` | string | yes | Never store a plaintext password. |
| `role` | `USER` or `ADMIN` | yes | Default `USER`. |
| `displayName` | string | no | Length-limited user profile value. |
| `createdAt` | date | yes | Server-generated. |
| `updatedAt` | date | yes | Server-generated. |

Indexes: unique `email`.

### PollutionReports

Collection: `pollutionReports`

| Field | Type | Required | Notes |
|------|------|----------|-------|
| `_id` | ObjectId | yes | MongoDB identifier. |
| `userId` | ObjectId | yes | Reference to `users`; ownership boundary. |
| `imageUrl` | string | yes for image reports | Storage URL or controlled local-development path; never a raw unvalidated upload. |
| `pollutionType` | string | yes | Extensible values such as `PLASTIC_WASTE`, `FISHING_WASTE`, `OIL_CHEMICAL_LIKE`, `GENERAL_WASTE`, `OTHER_UNKNOWN`. |
| `aiPrediction` | string | no | AI-assistant label, if available. |
| `aiConfidence` | number | no | Range 0 to 1; only meaningful with a model/version. |
| `aiModelVersion` | string | no | Required when an AI result is stored. |
| `userConfirmedType` | string | yes | User correction/confirmation; authoritative for the user-submitted classification. |
| `severity` | `LOW`, `MEDIUM`, or `HIGH` | yes | User-selected or moderation-reviewed severity; provenance should be retained. |
| `description` | string | no | Length-limited and sanitized before display. |
| `location` | GeoJSON Point | yes | `{ type: 'Point', coordinates: [longitude, latitude] }`. |
| `status` | `PENDING`, `VERIFIED`, `REJECTED`, or `RESOLVED` | yes | Default `PENDING`; transitions require authorization. |
| `source` | `USER_REPORT` | yes | Distinguishes reports from external data. |
| `createdAt` | date | yes | Server-generated report time. |
| `updatedAt` | date | yes | Server-generated. |
| `verifiedBy` | ObjectId | no | Admin who changed moderation status. |
| `verifiedAt` | date | no | Moderation timestamp. |
| `moderationNote` | string | no | Admin-only or policy-controlled review note. |

Indexes:

- `location: 2dsphere` for nearby/map queries.
- `{ status: 1, createdAt: -1 }` for moderation and timeline queries.
- `{ userId: 1, createdAt: -1 }` for My Reports.
- `{ pollutionType: 1, severity: 1 }` for filtering.

Validation:

- Longitude must be between -180 and 180.
- Latitude must be between -90 and 90.
- `aiConfidence` must be between 0 and 1.
- Image MIME type, file size, and storage URL must be validated before persistence.
- A user may edit only their own pending report; admins may moderate according to role policy.

### BiodiversityObservations

Collection: `biodiversityObservations` is the preferred long-term destination for the imported reference data. The current imported records are in the collection used by the existing `Biodiversity` model and should be migrated/renamed only through an approved, documented operation.

Required source fields:

- `decimalLatitude`
- `decimalLongitude`
- `date_year`
- `depth`
- `family`
- `familyid`
- `genus`
- `genusid`
- `habitat`
- `dataset_id`
- `class`
- `classid`

Recommended metadata for a future normalized copy:

- `source.name`
- `source.originalFile`
- `source.importedAt`
- `source.transformationVersion`
- `source.originalRecordId` when available

Indexes: `2dsphere` location representation after normalization, plus `{ date_year: 1 }` and taxonomy fields used by approved queries.

### HistoricalPollutionRecords

Collection: `historicalPollutionRecords`

Required provenance fields:

- `source.name`
- `source.url`
- `source.license`
- `source.originalId`
- `source.importedAt`
- `source.transformationVersion`

Normalized analytical fields may include pollution type, observation date, severity/category as defined by the source, and GeoJSON location. Source-specific fields must not be silently renamed without a mapping document.

Indexes: source identifier uniqueness within a source, date, pollution type, and `location: 2dsphere` where coordinates are valid.

### RiskAssessments

Collection: `riskAssessments`

Risk assessments are derived outputs and should include:

- `location` or an explicitly documented spatial cell
- `riskLevel`: `LOW`, `MEDIUM`, or `HIGH`
- `riskScore` with a documented scale
- `inputs`: time window, report counts, historical counts, and any validated environmental inputs
- `methodologyVersion`
- `dataSufficiency`: `SUFFICIENT` or `INSUFFICIENT`
- `generatedAt`
- `limitations`

No risk assessment should be displayed as a guaranteed prediction. Insufficient data must be visible to users.

## Status Transition Rules

```text
PENDING -> VERIFIED
PENDING -> REJECTED
VERIFIED -> RESOLVED
```

Only authorized admins may perform moderation transitions. A transition should record the actor and timestamp. Rejected reports should remain auditable unless a documented retention policy removes them.

## Privacy and Security Requirements

- Keep authentication secrets and database credentials backend-only.
- Do not expose password hashes through API responses.
- Validate ownership and role for every report operation.
- Consider reducing coordinate precision in public views to protect reporters and sensitive sites.
- Store image access according to an explicit retention and deletion policy.
- Keep user reports, external data, biodiversity observations, and derived assessments visibly labeled in the UI.

## Implementation Order

1. Approve this contract and the proposed collection names.
2. Add Mongoose schemas and indexes with tests.
3. Add authentication and authorization boundaries.
4. Add report validation and lifecycle APIs.
5. Add historical-data import mapping only after the external source review.
6. Add risk/hotspot computation only after sufficient real report data exists.
