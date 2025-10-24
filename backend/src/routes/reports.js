const express = require('express');
const multer = require('multer');
const { parseStringPromise } = require('xml2js');
const Report = require('../models/report');
const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post('/upload', upload.single('file'), async (req, res, next) => {
  try {
    if (!req.file || !req.file.originalname.endsWith('.xml')) {
      return res.status(400).json({ error: 'Please upload a valid XML file' });
    }

    const xmlString = req.file.buffer.toString();
    const result = await parseStringPromise(xmlString, { explicitArray: false });
    const profile = result?.INProfileResponse;
    if (!profile) return res.status(400).json({ error: 'Invalid XML structure' });

    const applicant = profile?.Current_Application?.Current_Application_Details?.Current_Applicant_Details;
    const panValue =
      profile?.CAIS_Account?.CAIS_Account_DETAILS?.CAIS_Holder_Details?.Income_TAX_PAN ||
      profile?.CAIS_Holder_Details?.Income_TAX_PAN ||
      'N/A';

    const basic = {
      name: `${applicant?.First_Name || ''} ${applicant?.Last_Name || ''}`.trim() || 'Unknown',
      mobilePhone: applicant?.MobilePhoneNumber || 'N/A',
      pan: panValue,
      creditScore: Number(profile?.SCORE?.BureauScore || 0)
    };

    const summaryNode = profile?.CAIS_Account?.CAIS_Summary?.Credit_Account;
    const balanceNode = profile?.CAIS_Account?.CAIS_Summary?.Total_Outstanding_Balance;

    const summary = {
      totalAccounts: Number(summaryNode?.CreditAccountTotal||0),
      activeAccounts: Number(summaryNode?.CreditAccountActive||0),
      closedAccounts: Number(summaryNode?.CreditAccountClosed||0),
      currentBalanceAmount: Number(balanceNode?.Outstanding_Balance_All||0),
      securedAccountsAmount: Number(balanceNode?.Outstanding_Balance_Secured||0),
      unsecuredAccountsAmount: Number(balanceNode?.Outstanding_Balance_UnSecured||0),
      last7DaysEnquiries: Number(profile?.TotalCAPS_Summary?.TotalCAPSLast7Days||0)
    };

    let accounts = profile?.CAIS_Account?.CAIS_Account_DETAILS;
    if (!Array.isArray(accounts)) accounts = accounts ? [accounts] : [];

    const accountsData = accounts.map(a => ({
      accountType: a?.Account_Type || 'Unknown',
      institution: a?.Subscriber_Name || 'Unknown',
      accountNumberMasked: a?.Account_Number || 'N/A',
      amountOverdue: Number(a?.Amount_Past_Due || 0),
      currentBalance: Number(a?.Current_Balance || 0),
      status: a?.Account_Status || 'Unknown',
      secured: Number(a?.Credit_Limit_Amount || 0) > 0
    }));

    const report = await Report.create({
      filename: req.file.originalname,
      basicDetails: basic,
      summary,
      accounts: accountsData,
      rawXml: xmlString
    });

    res.json({ message: 'File processed successfully', id: report._id});
  } catch (err) {
    next(err);
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const report = await Report.findByIdAndDelete(req.params.id);
    if (!report) return res.status(404).json({ error: 'Report not found' });
    res.json({ message: 'Report deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete report' });
  }
});

router.get('/', async (req, res) => {
  const reports = await Report.find().sort({ uploadedAt: -1});
  res.json(reports);
});

router.get('/:id', async (req, res) => {
  const report = await Report.findById(req.params.id);
  if (!report) return res.status(404).json({ error:'Report not found'});
  res.json(report);
});

module.exports = router;
