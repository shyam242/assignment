'use client';

import { useState, useRef } from 'react';
import axios from 'axios';
import Link from 'next/link';
export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [message, setMessage] = useState<string>('');
  const [dragging, setDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) setFile(e.target.files[0]);
  };
  const handleUpload = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!file) return alert('Select an XML file!');
    const formData = new FormData();
    formData.append('file', file);
    try {
      setMessage('Uploading...');
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/reports/upload`,
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );
      setMessage(`✅ Uploaded! Report ID: ${res.data.id}`);
      setFile(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
    } catch (err: any) {
      setMessage(`❌ ${err.response?.data?.error || err.message}`);
    }
  };
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragging(true);
  };
  const handleDragLeave = () => setDragging(false);
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragging(false);
    if (e.dataTransfer.files?.length) setFile(e.dataTransfer.files[0]);
  };
  return (
    <main className="min-h-screen bg-gradient-to-b from-indigo-50 via-white to-indigo-50 flex items-center justify-center p-8">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 border border-gray-200">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          Upload Soft Credit XML
        </h1>
        <form onSubmit={handleUpload} className="flex flex-col gap-4">
          <div
            role="button"
            aria-label="Upload XML file"
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`cursor-pointer border-2 border-dashed rounded-xl p-6 text-center transition-colors ${
              dragging ? 'border-indigo-500 bg-indigo-50' : 'border-indigo-300'
            }`}
          >
            {file ? (
              <p className="text-gray-700">{file.name}</p>
            ) : (
              <p className="text-gray-400">
                Drag & drop an XML file here, or click to select
              </p>
            )}
          </div>
          <input
            type="file"
            accept=".xml"
            onChange={handleFileChange}
            ref={fileInputRef}
            className="hidden"
          />
          <button
            type="submit"
            className="bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl font-semibold shadow-md transition-all"
          >
            Upload
          </button>
        </form>

        {message && (
          <p
            className={`mt-4 text-center font-medium ${
              message.startsWith('✅') ? 'text-green-600' : 'text-red-600'
            }`}
          >
            {message}
          </p>
        )}
        <div className="text-center mt-6">
          <Link
            href="/reports"
            className="inline-block text-indigo-600 hover:text-indigo-800 font-semibold transition-colors">
            View All Reports →
          </Link>
        </div>
      </div>
    </main>
  );
}
