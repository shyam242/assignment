'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import axios from 'axios';
import Link from 'next/link';

interface Account {
  accountType: string;
  institution: string;
  accountNumberMasked: string;
  amountOverdue: number;
  currentBalance: number;
  status: string;
  secured: boolean;
}
interface Report {
  _id: string;
  basicDetails: {
    name: string;
    pan: string;
    mobilePhone: string;
    creditScore: number;
  };
  summary: {
    totalAccounts: number;
    activeAccounts: number;
    closedAccounts: number;
    currentBalanceAmount: number;
  };
  accounts: Account[];
}
export default function ReportDetails() {
  const { id } = useParams();
  const [report, setReport] = useState<Report | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/reports/${id}`)
      .then(res => setReport(res.data))
      .catch(err => console.error('Error fetching report:', err))
      .finally(() => setLoading(false));
  }, [id]);
  if (loading)
    return (
      <p className="p-8 text-center text-gray-500 font-medium">Loading...</p>
    );
  if (!report)
    return (
      <p className="p-8 text-center text-red-500 font-medium">
        Report not found.
      </p>
    );
  return (
    <main className="p-8 max-w-5xl mx-auto">
      <Link
        href="/reports"
        className="text-indigo-600 font-semibold hover:text-indigo-800"
      >
        ← Back to Reports
      </Link>
      <div className="mt-6 bg-white rounded-2xl shadow-lg p-8 border border-gray-200">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          {report.basicDetails.name}
        </h1>

        <section className="mb-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 bg-indigo-50 rounded-xl shadow-sm">
            <h2 className="font-semibold text-lg mb-2">Basic Details</h2>
            <p>
              <span className="font-medium">PAN:</span>{' '}
              {report.basicDetails.pan || 'N/A'}
            </p>
            <p>
              <span className="font-medium">Mobile:</span>{' '}
              {report.basicDetails.mobilePhone}
            </p>
            <p>
              <span className="font-medium">Credit Score:</span>{' '}
              {report.basicDetails.creditScore}
            </p>
          </div>
          <div className="p-4 bg-indigo-50 rounded-xl shadow-sm">
            <h2 className="font-semibold text-lg mb-2">Summary</h2>
            <p>
              <span className="font-medium">Total Accounts:</span>{' '}
              {report.summary.totalAccounts}
            </p>
            <p>
              <span className="font-medium">Active:</span>{' '}
              {report.summary.activeAccounts}
            </p>
            <p>
              <span className="font-medium">Closed:</span>{' '}
              {report.summary.closedAccounts}
            </p>
            <p>
              <span className="font-medium">Current Balance:</span> ₹
              {report.summary.currentBalanceAmount.toLocaleString()}
            </p>
          </div>
        </section>
        <section>
          <h2 className="font-semibold text-lg mb-4">Accounts</h2>
          <div className="overflow-x-auto">
            <table className="w-full table-auto border-collapse">
              <thead>
                <tr className="bg-indigo-100 text-left">
                  <th className="p-3">Type</th>
                  <th className="p-3">Bank</th>
                  <th className="p-3">Balance</th>
                  <th className="p-3">Overdue</th>
                  <th className="p-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {report.accounts.map((a, i) => (
                  <tr
                    key={i}
                    className={`border-t ${
                      i % 2 === 0 ? 'bg-white' : 'bg-indigo-50'
                    } hover:bg-indigo-100 transition-colors`}
                  >
                    <td className="p-3 font-medium">{a.accountType}</td>
                    <td className="p-3">{a.institution}</td>
                    <td className="p-3">₹{a.currentBalance.toLocaleString()}</td>
                    <td className="p-3">₹{a.amountOverdue.toLocaleString()}</td>
                    <td className="p-3">{a.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </main>
  );
}
