const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const MONGODB_URI = process.env.MONGODB_URI;
const DATA_PATH = path.resolve(__dirname, '../Biodiveristy.json');

const BiodiversitySchema = new mongoose.Schema({
  decimalLatitude: Number,
  decimalLongitude: Number,
  date_year: Number,
  depth: Number,
  family: String,
  familyid: Number,
  genus: String,
  genusid: Number,
  habitat: String,
  dataset_id: String,
  class: String,
  classid: Number
});

const Biodiversity = mongoose.model('Biodiversity', BiodiversitySchema);

async function importData() {
  if (!MONGODB_URI) throw new Error('MONGODB_URI is required in backend/.env');

  await mongoose.connect(MONGODB_URI);
  const data = JSON.parse(fs.readFileSync(DATA_PATH, 'utf-8'));

  const existing = await Biodiversity.countDocuments();
  if (existing > 0) {
    throw new Error(`Import aborted: collection already contains ${existing} records`);
  }

  for (let index = 0; index < data.length; index += 100) {
    await Biodiversity.insertMany(data.slice(index, index + 100));
  }

  console.log(`Imported ${data.length} biodiversity records without deleting existing data`);
  await mongoose.disconnect();
}

importData().catch(err => {
  console.error(err);
  process.exit(1);
});
