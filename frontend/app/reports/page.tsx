'use client';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';

interface ReportSummary {
  _id: string;
  filename: string;
  basicDetails: {
    name: string;
    creditScore: number;
    pan?: string;
  };
  summary: {
    totalAccounts: number;
    activeAccounts?: number;
    closedAccounts?: number;
    currentBalance?: number;
  };
}
export default function Reports() {
  const [reports, setReports] = useState<ReportSummary[]>([]);
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchReports = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/reports`);
      setReports(res.data);
    } catch (err) {
      console.error(err);
      setError('Failed to load reports. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchReports();
  }, []);
  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this report?')) return;
    try {
      setDeleting(id);
      await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/reports/${id}`);
      setReports(prev => prev.filter(r => r._id !== id));
    } catch (err) {
      console.error('Error deleting report:', err);
      alert('❌ Failed to delete report');
    } finally {
      setDeleting(null);
    }
  };
  return (
    <main className="min-h-screen bg-linear-to-b from-indigo-50 via-white to-indigo-50 p-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">
          Uploaded Reports
        </h1>

        {loading ? (
          <p className="text-center text-gray-500">Loading reports...</p>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : reports.length === 0 ? (
          <p className="text-center text-gray-500">No reports uploaded yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {reports.map(r => (
              <div
                key={r._id}
                className="group relative rounded-xl bg-white p-6 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-200 hover:border-indigo-300"
              >
                <Link href={`/reports/${r._id}`}>
                  <div className="flex flex-col gap-2">
                    <h2 className="text-xl font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors">
                      {r.basicDetails?.name || r.filename}
                    </h2>
                    {r.basicDetails?.pan && (
                      <p className="text-sm text-gray-500">
                        PAN: {r.basicDetails.pan}
                      </p>
                    )}
                    <p className="text-gray-700">
                      Credit Score: {r.basicDetails?.creditScore || 'N/A'}
                    </p>
                    <p className="text-gray-700">
                      Total Accounts: {r.summary?.totalAccounts}
                    </p>
                    {r.summary?.activeAccounts !== undefined && (
                      <p className="text-gray-700">
                        Active: {r.summary.activeAccounts}
                      </p>
                    )}
                    {r.summary?.closedAccounts !== undefined && (
                      <p className="text-gray-700">
                        Closed: {r.summary.closedAccounts}
                      </p>
                    )}
                    {r.summary?.currentBalance !== undefined && (
                      <p className="text-gray-700">
                        Current Balance: ₹
                        {r.summary.currentBalance.toLocaleString()}
                      </p>
                    )}
                  </div>
                </Link>
                <button
                  onClick={() => handleDelete(r._id)}
                  disabled={deleting === r._id}
                  aria-label={`Delete report ${r.filename}`}
                  className={`absolute top-4 right-4 text-sm font-semibold px-3 py-1 rounded-lg transition-all duration-200 ${
                    deleting === r._id
                      ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                      : 'bg-red-100 text-red-600 hover:bg-red-600 hover:text-white'
                  }`}
                >
                  {deleting === r._id ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            ))}
          </div>
        )}
        <div className="text-center mt-12">
          <Link
            href="/"
            className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-6 rounded-lg shadow-md transition-all"
          >
            ← Upload Another File
          </Link>
        </div>
      </div>
    </main>
  );
}
