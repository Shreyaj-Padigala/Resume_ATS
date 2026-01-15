import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { userAPI, analysisAPI } from '../services/api';
import { Upload, History, TrendingUp, Clock, AlertCircle, FileText } from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();
  const [usageStats, setUsageStats] = useState(null);
  const [recentAnalyses, setRecentAnalyses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [usageResponse, analysesResponse] = await Promise.all([
        userAPI.getUsageStats(),
        analysisAPI.getAllAnalyses(),
      ]);

      setUsageStats(usageResponse.data);
      setRecentAnalyses(analysesResponse.data.slice(0, 5));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const getTimeAgo = (date) => {
    const now = new Date();
    const then = new Date(date);
    const diffInSeconds = Math.floor((now - then) / 1000);

    if (diffInSeconds < 60) return 'just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    return `${Math.floor(diffInSeconds / 86400)} days ago`;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  const analysesRemaining = 4 - (usageStats?.weeklyCount || 0);
  const canAnalyze = analysesRemaining > 0;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {user?.name || user?.email}
          </h1>
          <p className="text-gray-600 mt-2">
            Analyze your resume and improve your chances of landing interviews
          </p>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-start space-x-2">
            <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
            <span className="text-sm">{error}</span>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Analyses Remaining</p>
                <p className="text-3xl font-bold text-primary-600">{analysesRemaining}</p>
                <p className="text-xs text-gray-500 mt-1">This week</p>
              </div>
              <div className="bg-primary-100 rounded-full p-3">
                <Clock className="h-8 w-8 text-primary-600" />
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Analyses</p>
                <p className="text-3xl font-bold text-gray-900">
                  {recentAnalyses.length}
                </p>
                <p className="text-xs text-gray-500 mt-1">All time</p>
              </div>
              <div className="bg-green-100 rounded-full p-3">
                <TrendingUp className="h-8 w-8 text-green-600" />
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Average Score</p>
                <p className="text-3xl font-bold text-gray-900">
                  {recentAnalyses.length > 0
                    ? Math.round(
                        recentAnalyses.reduce((sum, a) => sum + a.score, 0) /
                          recentAnalyses.length
                      )
                    : 0}
                </p>
                <p className="text-xs text-gray-500 mt-1">Out of 100</p>
              </div>
              <div className="bg-yellow-100 rounded-full p-3">
                <FileText className="h-8 w-8 text-yellow-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Link
            to="/upload"
            className={`card hover:shadow-lg transition-shadow ${
              !canAnalyze ? 'opacity-60 cursor-not-allowed' : ''
            }`}
            onClick={(e) => !canAnalyze && e.preventDefault()}
          >
            <div className="flex items-center space-x-4">
              <div className="bg-primary-100 rounded-lg p-4">
                <Upload className="h-8 w-8 text-primary-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">New Analysis</h3>
                <p className="text-sm text-gray-600">
                  {canAnalyze
                    ? 'Upload your resume and get instant feedback'
                    : 'Weekly limit reached. Resets in a few days.'}
                </p>
              </div>
            </div>
          </Link>

          <Link
            to="/history"
            className="card hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center space-x-4">
              <div className="bg-purple-100 rounded-lg p-4">
                <History className="h-8 w-8 text-purple-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Analysis History</h3>
                <p className="text-sm text-gray-600">View all your past analyses</p>
              </div>
            </div>
          </Link>
        </div>

        {/* Recent Analyses */}
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Recent Analyses</h2>
            <Link
              to="/history"
              className="text-sm text-primary-600 hover:text-primary-700 font-medium"
            >
              View all
            </Link>
          </div>

          {recentAnalyses.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-4">No analyses yet</p>
              <Link to="/upload" className="btn-primary inline-block">
                Create your first analysis
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {recentAnalyses.map((analysis) => (
                <Link
                  key={analysis._id}
                  to={`/analysis/${analysis._id}`}
                  className="block border border-gray-200 rounded-lg p-4 hover:border-primary-300 hover:bg-primary-50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-grow">
                      <p className="font-medium text-gray-900">
                        {analysis.jobTitle || 'Untitled Analysis'}
                      </p>
                      <p className="text-sm text-gray-600 mt-1">
                        {getTimeAgo(analysis.createdAt)}
                      </p>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <p className="text-2xl font-bold text-primary-600">
                          {analysis.score}
                        </p>
                        <p className="text-xs text-gray-600">ATS Score</p>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
