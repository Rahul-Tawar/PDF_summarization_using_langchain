'use client';

import { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import PDFUploader from '@/components/PDFUploader';
import SummaryDisplay from '@/components/SummaryDisplay';

export default function Home() {
  const [summary, setSummary] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleFileUpload = async (file: File) => {
    setIsLoading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/api/summarize', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to summarize PDF');
      }

      const data = await response.json();
      setSummary(data.summary);
    } catch (error) {
      console.error('Error summarizing PDF:', error);
      alert('Error summarizing PDF. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen p-8 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">
          PDF Summarization with RAG
        </h1>
        
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <PDFUploader onFileUpload={handleFileUpload} isLoading={isLoading} />
        </div>

        {summary && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <SummaryDisplay summary={summary} />
          </div>
        )}
      </div>
    </main>
  );
} 