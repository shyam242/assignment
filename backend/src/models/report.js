const mongoose = require('mongoose');

const AccountSchema = new mongoose.Schema({
  accountType: String,
  institution: String,
  accountNumberMasked: String,
  amountOverdue: Number,
  currentBalance: Number,
  secured: Boolean,
  openedDate: Date,
  closedDate: Date,
  status: String
}, { _id: false });

const AddressSchema = new mongoose.Schema({
  line1: String,
  line2: String,
  city: String,
  state: String,
  zip: String,
  country: String
}, { _id: false });

const EnquirySchema = new mongoose.Schema({
  date: Date,
  type: String,
  institution: String
}, { _id: false });

const ReportSchema = new mongoose.Schema({
  filename: String,
  uploadedAt: { type: Date, default: Date.now },
  basicDetails: {
    name: String,
    mobilePhone: String,
    pan: String,
    creditScore: Number
  },
  summary: {
    totalAccounts: Number,
    activeAccounts: Number,
    closedAccounts: Number,
    currentBalanceAmount: Number,
    securedAccountsAmount: Number,
    unsecuredAccountsAmount: Number,
    last7DaysEnquiries: Number
  },
  accounts: [AccountSchema],
  addresses: [AddressSchema],
  enquiries: [EnquirySchema],
  rawXml: String
}, { timestamps: true });
ReportSchema.index({ 'basicDetails.pan': 1 });
ReportSchema.index({ uploadedAt: -1 });
module.exports = mongoose.model('Report', ReportSchema);
