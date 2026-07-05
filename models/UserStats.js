const mongoose = require('mongoose');

const UserStatsSchema = new mongoose.Schema({
  cfHandle: { type: String, default: '' },
  lcHandle: { type: String, default: '' },
  chartData: { type: Array, required: true },
  strengths: { type: Array, required: true },
  weaknesses: { type: Array, required: true },
  lastUpdated: { type: Date, default: Date.now }
});

UserStatsSchema.index({ cfHandle: 1, lcHandle: 1 }, { unique: true });

module.exports = mongoose.model('UserStats', UserStatsSchema);
