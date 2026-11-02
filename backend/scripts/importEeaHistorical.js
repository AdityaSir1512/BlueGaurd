const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const MONGODB_URI = process.env.MONGODB_URI;
const DATA_PATH = path.resolve(__dirname, '../data/eea-marine-litter/eea_v_3035_100_k_marine-litter_p_2010-2021_v01_r00/historical-assessments.geojson');

const schema = new mongoose.Schema({
  source: String,
  sourceDataset: String,
  sourceMetadataId: String,
  sourceLicense: String,
  sourceChecksum: String,
  assessmentStart: Date,
  assessmentEnd: Date,
  originalObjectId: Number,
  gridCode: String,
  areaKm2: Number,
  originalAreaKm2: Number,
  assessmentClass: String,
  geometry: Object,
  importedAt: Date
}, { collection: 'historicalPollutionAssessments' });

const Assessment = mongoose.model('HistoricalPollutionAssessmentImport', schema);

async function importData() {
  if (!MONGODB_URI) throw new Error('MONGODB_URI is required in backend/.env');
  if (!fs.existsSync(DATA_PATH)) throw new Error('Run prepareEeaHistorical.py first');

  const geojson = JSON.parse(fs.readFileSync(DATA_PATH, 'utf8'));
  const existing = await mongoose.connect(MONGODB_URI).then(() => Assessment.countDocuments());
  if (existing > 0) throw new Error(`Import aborted: historicalPollutionAssessments already contains ${existing} records`);

  const importedAt = new Date();
  const records = geojson.features.map((feature) => {
    const properties = feature.properties;
    return {
      source: properties.source,
      sourceDataset: properties.sourceDataset,
      sourceMetadataId: properties.sourceMetadataId,
      sourceLicense: properties.sourceLicense,
      sourceChecksum: properties.sourceChecksum,
      assessmentStart: properties.assessmentStart,
      assessmentEnd: properties.assessmentEnd,
      originalObjectId: properties.OBJECTID,
      gridCode: properties.GRIDCODE,
      areaKm2: properties.Area_km2,
      originalAreaKm2: properties.Orig_km2,
      assessmentClass: properties.assessmentClass,
      geometry: feature.geometry,
      importedAt
    };
  });

  for (let index = 0; index < records.length; index += 100) {
    await Assessment.insertMany(records.slice(index, index + 100));
  }
  console.log(`Imported ${records.length} EEA historical assessment areas`);
  await mongoose.disconnect();
}

importData().catch(async (error) => {
  console.error(error.message);
  await mongoose.disconnect().catch(() => {});
  process.exitCode = 1;
});
