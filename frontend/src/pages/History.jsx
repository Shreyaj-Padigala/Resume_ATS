import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { analysisAPI } from '../services/api';
import { FileText, AlertCircle, Loader, Search, TrendingUp, Calendar } from 'lucide-react';

const History = () => {
  const [analyses, setAnalyses] = useState([]);
  const [filteredAnalyses, setFilteredAnalyses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('date-desc');

  useEffect(() => {
    fetchAnalyses();
  }, []);

  useEffect(() => {
    filterAndSortAnalyses();
  }, [searchQuery, sortBy, analyses]);

  const fetchAnalyses = async () => {
    try {
      setLoading(true);
      const response = await analysisAPI.getAllAnalyses();
      setAnalyses(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load analyses');
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortAnalyses = () => {
    let filtered = [...analyses];

    if (searchQuery) {
      filtered = filtered.filter((analysis) =>
        (analysis.jobTitle || '').toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'date-desc':
          return new Date(b.createdAt) - new Date(a.createdAt);
        case 'date-asc':
          return new Date(a.createdAt) - new Date(b.createdAt);
        case 'score-desc':
          return b.score - a.score;
        case 'score-asc':
          return a.score - b.score;
        default:
          return 0;
      }
    });

    setFilteredAnalyses(filtered);
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600 bg-green-100';
    if (score >= 60) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getTimeAgo = (date) => {
    const now = new Date();
    const then = new Date(date);
    const diffInSeconds = Math.floor((now - then) / 1000);

    if (diffInSeconds < 60) return 'just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} days ago`;
    return new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader className="animate-spin h-12 w-12 text-primary-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading analyses...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Analysis History</h1>
          <p className="text-gray-600 mt-2">
            View and manage all your resume analyses
          </p>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-start space-x-2">
            <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
            <span className="text-sm">{error}</span>
          </div>
        )}

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Analyses</p>
                <p className="text-3xl font-bold text-gray-900">{analyses.length}</p>
              </div>
              <div className="bg-primary-100 rounded-full p-3">
                <FileText className="h-8 w-8 text-primary-600" />
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Average Score</p>
                <p className="text-3xl font-bold text-gray-900">
                  {analyses.length > 0
                    ? Math.round(analyses.reduce((sum, a) => sum + a.score, 0) / analyses.length)
                    : 0}
                </p>
              </div>
              <div className="bg-green-100 rounded-full p-3">
                <TrendingUp className="h-8 w-8 text-green-600" />
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Latest Analysis</p>
                <p className="text-lg font-bold text-gray-900">
                  {analyses.length > 0 ? getTimeAgo(analyses[0].createdAt) : 'N/A'}
                </p>
              </div>
              <div className="bg-purple-100 rounded-full p-3">
                <Calendar className="h-8 w-8 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="card mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-grow relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search by job title..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input-field pl-10"
              />
            </div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="input-field sm:w-48"
            >
              <option value="date-desc">Newest First</option>
              <option value="date-asc">Oldest First</option>
              <option value="score-desc">Highest Score</option>
              <option value="score-asc">Lowest Score</option>
            </select>
          </div>
        </div>

        {/* Analyses List */}
        {filteredAnalyses.length === 0 ? (
          <div className="card text-center py-12">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 mb-4">
              {searchQuery ? 'No analyses match your search' : 'No analyses yet'}
            </p>
            {!searchQuery && (
              <Link to="/upload" className="btn-primary inline-block">
                Create your first analysis
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAnalyses.map((analysis) => (
              <Link
                key={analysis._id}
                to={`/analysis/${analysis._id}`}
                className="card hover:shadow-lg transition-shadow cursor-pointer"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-grow">
                    <h3 className="font-semibold text-gray-900 mb-1">
                      {analysis.jobTitle || 'Untitled Analysis'}
                    </h3>
                    <p className="text-sm text-gray-600">{getTimeAgo(analysis.createdAt)}</p>
                  </div>
                  <div
                    className={`px-3 py-1 rounded-full font-bold text-lg ${getScoreColor(
                      analysis.score
                    )}`}
                  >
                    {analysis.score}
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Suggestions</span>
                    <span className="font-medium text-gray-900">
                      {analysis.suggestions?.length || 0}
                    </span>
                  </div>
                  {analysis.versions && analysis.versions.length > 1 && (
                    <div className="flex items-center justify-between text-sm mt-2">
                      <span className="text-gray-600">Versions</span>
                      <span className="font-medium text-gray-900">
                        {analysis.versions.length}
                      </span>
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default History;
