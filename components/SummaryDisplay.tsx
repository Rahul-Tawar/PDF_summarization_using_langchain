interface SummaryDisplayProps {
  summary: string;
}

const SummaryDisplay: React.FC<SummaryDisplayProps> = ({ summary }) => {
  return (
    <div className="w-full">
      <h2 className="text-2xl font-semibold mb-4 text-gray-800">Summary</h2>
      <div className="prose max-w-none">
        <p className="text-gray-700 whitespace-pre-wrap">{summary}</p>
      </div>
    </div>
  );
};

export default SummaryDisplay; 