import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';

interface PDFUploaderProps {
  onFileUpload: (file: File) => void;
  isLoading: boolean;
}

const PDFUploader: React.FC<PDFUploaderProps> = ({ onFileUpload, isLoading }) => {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      onFileUpload(acceptedFiles[0]);
    }
  }, [onFileUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf']
    },
    maxFiles: 1,
    disabled: isLoading
  });

  return (
    <div className="w-full">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
          ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-400'}
          ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        <input {...getInputProps()} />
        {isLoading ? (
          <div className="text-gray-600">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
            Processing PDF...
          </div>
        ) : isDragActive ? (
          <p className="text-blue-500">Drop the PDF here...</p>
        ) : (
          <div>
            <p className="text-gray-600 mb-2">Drag and drop a PDF file here, or click to select</p>
            <p className="text-sm text-gray-500">Only PDF files are supported</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PDFUploader; 