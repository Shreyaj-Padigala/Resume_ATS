import { AlertCircle, CheckCircle, Info, AlertTriangle } from 'lucide-react';

const SuggestionsList = ({ suggestions }) => {
  const getPriorityIcon = (priority) => {
    switch (priority) {
      case 'high':
        return <AlertCircle className="h-5 w-5 text-red-600" />;
      case 'medium':
        return <AlertTriangle className="h-5 w-5 text-yellow-600" />;
      case 'low':
        return <Info className="h-5 w-5 text-blue-600" />;
      default:
        return <CheckCircle className="h-5 w-5 text-gray-600" />;
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'border-l-red-500 bg-red-50';
      case 'medium':
        return 'border-l-yellow-500 bg-yellow-50';
      case 'low':
        return 'border-l-blue-500 bg-blue-50';
      default:
        return 'border-l-gray-500 bg-gray-50';
    }
  };

  const getCategoryColor = (category) => {
    const colors = {
      keywords: 'bg-purple-100 text-purple-800',
      formatting: 'bg-blue-100 text-blue-800',
      experience: 'bg-green-100 text-green-800',
      skills: 'bg-orange-100 text-orange-800',
      education: 'bg-pink-100 text-pink-800',
      other: 'bg-gray-100 text-gray-800',
    };
    return colors[category.toLowerCase()] || colors.other;
  };

  if (!suggestions || suggestions.length === 0) {
    return (
      <div className="card">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">Suggestions</h2>
        <p className="text-gray-600">No suggestions available.</p>
      </div>
    );
  }

  return (
    <div className="card">
      <h2 className="text-lg font-semibold text-gray-700 mb-4">
        Improvement Suggestions ({suggestions.length})
      </h2>
      <div className="space-y-3">
        {suggestions.map((suggestion, index) => (
          <div
            key={index}
            className={`border-l-4 ${getPriorityColor(
              suggestion.priority
            )} p-4 rounded-r-lg`}
          >
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 mt-0.5">
                {getPriorityIcon(suggestion.priority)}
              </div>
              <div className="flex-grow">
                <div className="flex items-center space-x-2 mb-2">
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded ${getCategoryColor(
                      suggestion.category
                    )}`}
                  >
                    {suggestion.category}
                  </span>
                  <span className="text-xs text-gray-500 uppercase">
                    {suggestion.priority} Priority
                  </span>
                </div>
                <p className="text-sm text-gray-800">{suggestion.text}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SuggestionsList;
