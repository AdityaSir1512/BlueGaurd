import { Document, Schema, Types, model } from 'mongoose';

export type PollutionSeverity = 'LOW' | 'MEDIUM' | 'HIGH';
export type PollutionReportStatus = 'PENDING' | 'VERIFIED' | 'REJECTED' | 'RESOLVED';

export interface GeoPoint {
  type: 'Point';
  coordinates: [number, number];
}

export interface IPollutionReport extends Document {
  userId: Types.ObjectId;
  imageUrl: string;
  pollutionType: string;
  aiPrediction?: string;
  aiConfidence?: number;
  aiModelVersion?: string;
  userConfirmedType: string;
  severity: PollutionSeverity;
  description?: string;
  location: GeoPoint;
  status: PollutionReportStatus;
  source: 'USER_REPORT';
  verifiedBy?: Types.ObjectId;
  verifiedAt?: Date;
  moderationNote?: string;
  createdAt: Date;
  updatedAt: Date;
}

const GeoPointSchema = new Schema<GeoPoint>(
  {
    type: {
      type: String,
      enum: ['Point'],
      required: true,
      default: 'Point'
    },
    coordinates: {
      type: [Number],
      required: true,
      validate: {
        validator: (value: number[]) =>
          value.length === 2 &&
          value[0] >= -180 &&
          value[0] <= 180 &&
          value[1] >= -90 &&
          value[1] <= 90,
        message: 'Coordinates must be [longitude, latitude] within valid ranges'
      }
    }
  },
  { _id: false }
);

const PollutionReportSchema = new Schema<IPollutionReport>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    imageUrl: {
      type: String,
      required: true,
      trim: true
    },
    pollutionType: {
      type: String,
      required: true,
      trim: true,
      maxlength: 80
    },
    aiPrediction: {
      type: String,
      trim: true,
      maxlength: 80
    },
    aiConfidence: {
      type: Number,
      min: 0,
      max: 1
    },
    aiModelVersion: {
      type: String,
      trim: true,
      maxlength: 120
    },
    userConfirmedType: {
      type: String,
      required: true,
      trim: true,
      maxlength: 80
    },
    severity: {
      type: String,
      enum: ['LOW', 'MEDIUM', 'HIGH'],
      required: true
    },
    description: {
      type: String,
      trim: true,
      maxlength: 2000
    },
    location: {
      type: GeoPointSchema,
      required: true
    },
    status: {
      type: String,
      enum: ['PENDING', 'VERIFIED', 'REJECTED', 'RESOLVED'],
      default: 'PENDING',
      required: true
    },
    source: {
      type: String,
      enum: ['USER_REPORT'],
      default: 'USER_REPORT',
      required: true
    },
    verifiedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    verifiedAt: Date,
    moderationNote: {
      type: String,
      trim: true,
      maxlength: 2000
    }
  },
  { timestamps: true }
);

PollutionReportSchema.index({ location: '2dsphere' });
PollutionReportSchema.index({ status: 1, createdAt: -1 });
PollutionReportSchema.index({ userId: 1, createdAt: -1 });
PollutionReportSchema.index({ pollutionType: 1, severity: 1 });

export default model<IPollutionReport>('PollutionReport', PollutionReportSchema, 'pollutionReports');
