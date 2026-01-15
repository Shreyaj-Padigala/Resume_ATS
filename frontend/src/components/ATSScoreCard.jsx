import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

const ATSScoreCard = ({ score, previousScore }) => {
  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBgColor = (score) => {
    if (score >= 80) return 'bg-green-100';
    if (score >= 60) return 'bg-yellow-100';
    return 'bg-red-100';
  };

  const getScoreLabel = (score) => {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    if (score >= 40) return 'Fair';
    return 'Needs Improvement';
  };

  const scoreDiff = previousScore ? score - previousScore : null;

  return (
    <div className="card">
      <h2 className="text-lg font-semibold text-gray-700 mb-4">ATS Score</h2>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div
            className={`${getScoreBgColor(
              score
            )} rounded-full h-24 w-24 flex items-center justify-center`}
          >
            <span className={`text-3xl font-bold ${getScoreColor(score)}`}>{score}</span>
          </div>
          <div>
            <p className={`text-xl font-semibold ${getScoreColor(score)}`}>
              {getScoreLabel(score)}
            </p>
            <p className="text-sm text-gray-600">Out of 100</p>
          </div>
        </div>

        {scoreDiff !== null && (
          <div className="flex items-center space-x-2">
            {scoreDiff > 0 ? (
              <>
                <TrendingUp className="h-6 w-6 text-green-600" />
                <span className="text-lg font-semibold text-green-600">+{scoreDiff}</span>
              </>
            ) : scoreDiff < 0 ? (
              <>
                <TrendingDown className="h-6 w-6 text-red-600" />
                <span className="text-lg font-semibold text-red-600">{scoreDiff}</span>
              </>
            ) : (
              <>
                <Minus className="h-6 w-6 text-gray-600" />
                <span className="text-lg font-semibold text-gray-600">0</span>
              </>
            )}
          </div>
        )}
      </div>

      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Keyword Match</span>
          <span className="font-medium">{Math.round(score * 0.4)}%</span>
        </div>
        <div className="flex justify-between text-sm mt-2">
          <span className="text-gray-600">Formatting</span>
          <span className="font-medium">{Math.round(score * 0.3)}%</span>
        </div>
        <div className="flex justify-between text-sm mt-2">
          <span className="text-gray-600">Experience Match</span>
          <span className="font-medium">{Math.round(score * 0.3)}%</span>
        </div>
      </div>
    </div>
  );
};

export default ATSScoreCard;
