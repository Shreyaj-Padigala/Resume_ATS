import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { analysisAPI } from '../services/api';
import ATSScoreCard from '../components/ATSScoreCard';
import SuggestionsList from '../components/SuggestionsList';
import { ArrowLeft, Download, Trash2, AlertCircle, Loader } from 'lucide-react';

const AnalysisResult = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchAnalysis();
  }, [id]);

  const fetchAnalysis = async () => {
    try {
      setLoading(true);
      const response = await analysisAPI.getAnalysis(id);
      setAnalysis(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load analysis');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this analysis?')) {
      return;
    }

    try {
      setDeleting(true);
      await analysisAPI.deleteAnalysis(id);
      navigate('/history');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete analysis');
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader className="animate-spin h-12 w-12 text-primary-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading analysis...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-start space-x-2">
            <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium">Error</p>
              <p className="text-sm">{error}</p>
            </div>
          </div>
          <div className="mt-6">
            <Link to="/dashboard" className="btn-primary">
              Back to Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!analysis) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            to="/dashboard"
            className="inline-flex items-center text-primary-600 hover:text-primary-700 mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Link>
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {analysis.jobTitle || 'Resume Analysis'}
              </h1>
              <p className="text-gray-600 mt-2">
                Analyzed on {new Date(analysis.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => window.print()}
                className="btn-outline flex items-center space-x-2"
              >
                <Download className="h-4 w-4" />
                <span>Export</span>
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="btn-secondary text-red-600 hover:bg-red-50 flex items-center space-x-2"
              >
                <Trash2 className="h-4 w-4" />
                <span>{deleting ? 'Deleting...' : 'Delete'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Score and Job Details */}
          <div className="lg:col-span-1 space-y-6">
            <ATSScoreCard score={analysis.score} previousScore={analysis.previousScore} />

            <div className="card">
              <h2 className="text-lg font-semibold text-gray-700 mb-4">Job Details</h2>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600">Position</p>
                  <p className="font-medium text-gray-900">
                    {analysis.jobTitle || 'Not specified'}
                  </p>
                </div>
                <div className="pt-3 border-t border-gray-200">
                  <p className="text-sm text-gray-600 mb-2">Job Description</p>
                  <div className="text-sm text-gray-900 max-h-40 overflow-y-auto bg-gray-50 p-3 rounded">
                    {analysis.jobDescription}
                  </div>
                </div>
              </div>
            </div>

            <div className="card">
              <h2 className="text-lg font-semibold text-gray-700 mb-4">Resume Text</h2>
              <div className="text-sm text-gray-900 max-h-60 overflow-y-auto bg-gray-50 p-3 rounded">
                {analysis.resumeText || 'Resume text not available'}
              </div>
            </div>
          </div>

          {/* Right Column - Suggestions */}
          <div className="lg:col-span-2">
            <SuggestionsList suggestions={analysis.suggestions} />

            {/* Action Buttons */}
            <div className="mt-6 bg-primary-50 border border-primary-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Ready to improve your resume?
              </h3>
              <p className="text-sm text-gray-700 mb-4">
                Make changes based on the suggestions above and re-analyze to see your score improve.
              </p>
              <Link to="/upload" className="btn-primary inline-block">
                Analyze Updated Resume
              </Link>
            </div>
          </div>
        </div>

        {/* Version History */}
        {analysis.versions && analysis.versions.length > 0 && (
          <div className="mt-8 card">
            <h2 className="text-lg font-semibold text-gray-700 mb-4">Version History</h2>
            <div className="space-y-2">
              {analysis.versions.map((version, index) => (
                <div key={index} className="flex items-center justify-between py-2 border-b border-gray-200 last:border-0">
                  <div>
                    <p className="font-medium text-gray-900">Version {index + 1}</p>
                    <p className="text-sm text-gray-600">
                      {new Date(version.date).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold text-primary-600">{version.score}</p>
                    <p className="text-xs text-gray-600">Score</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AnalysisResult;
