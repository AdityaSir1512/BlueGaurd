import { Schema, model, Document } from 'mongoose';

export interface IHistoricalPollutionAssessment extends Document {
  source: string;
  sourceDataset: string;
  sourceMetadataId: string;
  sourceLicense: string;
  sourceChecksum: string;
  assessmentStart: Date;
  assessmentEnd: Date;
  originalObjectId: number;
  gridCode: string;
  areaKm2: number;
  originalAreaKm2: number;
  assessmentClass: string;
  geometry: {
    type: 'MultiPolygon';
    coordinates: number[][][][];
  };
  importedAt: Date;
}

const HistoricalPollutionAssessmentSchema = new Schema<IHistoricalPollutionAssessment>({
  source: { type: String, required: true },
  sourceDataset: { type: String, required: true },
  sourceMetadataId: { type: String, required: true },
  sourceLicense: { type: String, required: true },
  sourceChecksum: { type: String, required: true },
  assessmentStart: { type: Date, required: true },
  assessmentEnd: { type: Date, required: true },
  originalObjectId: { type: Number, required: true },
  gridCode: { type: String, required: true },
  areaKm2: { type: Number, required: true, min: 0 },
  originalAreaKm2: { type: Number, required: true, min: 0 },
  assessmentClass: { type: String, required: true },
  geometry: {
    type: { type: String, enum: ['MultiPolygon'], required: true },
    coordinates: { type: [[[Number]]], required: true }
  },
  importedAt: { type: Date, required: true }
}, { collection: 'historicalPollutionAssessments' });

HistoricalPollutionAssessmentSchema.index({ geometry: '2dsphere' });
HistoricalPollutionAssessmentSchema.index({ assessmentClass: 1 });
HistoricalPollutionAssessmentSchema.index({ assessmentStart: 1, assessmentEnd: 1 });
HistoricalPollutionAssessmentSchema.index({ sourceMetadataId: 1, originalObjectId: 1 }, { unique: true });

export default model<IHistoricalPollutionAssessment>('HistoricalPollutionAssessment', HistoricalPollutionAssessmentSchema);
