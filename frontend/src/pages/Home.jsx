import { Link } from 'react-router-dom';
import { FileText, TrendingUp, Clock, CheckCircle, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6">
              Optimize Your Resume with AI
            </h1>
            <p className="text-xl sm:text-2xl mb-8 text-primary-100">
              Get instant ATS scores and actionable suggestions to land more interviews
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              {isAuthenticated ? (
                <Link
                  to="/upload"
                  className="inline-flex items-center justify-center px-8 py-3 text-lg font-medium rounded-lg bg-white text-primary-600 hover:bg-gray-100 transition-colors"
                >
                  Start Analysis
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              ) : (
                <>
                  <Link
                    to="/signup"
                    className="inline-flex items-center justify-center px-8 py-3 text-lg font-medium rounded-lg bg-white text-primary-600 hover:bg-gray-100 transition-colors"
                  >
                    Get Started Free
                  </Link>
                  <Link
                    to="/login"
                    className="inline-flex items-center justify-center px-8 py-3 text-lg font-medium rounded-lg border-2 border-white text-white hover:bg-white hover:text-primary-600 transition-colors"
                  >
                    Login
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600">
              Simple, fast, and effective resume optimization
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-primary-100 rounded-full h-16 w-16 flex items-center justify-center mx-auto mb-4">
                <FileText className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Upload Resume</h3>
              <p className="text-gray-600">
                Upload your resume PDF and paste the job description
              </p>
            </div>

            <div className="text-center">
              <div className="bg-primary-100 rounded-full h-16 w-16 flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Get ATS Score</h3>
              <p className="text-gray-600">
                Receive instant ATS score from 0-100 based on AI analysis
              </p>
            </div>

            <div className="text-center">
              <div className="bg-primary-100 rounded-full h-16 w-16 flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Review Suggestions</h3>
              <p className="text-gray-600">
                Get categorized, actionable suggestions to improve your resume
              </p>
            </div>

            <div className="text-center">
              <div className="bg-primary-100 rounded-full h-16 w-16 flex items-center justify-center mx-auto mb-4">
                <Clock className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Track Progress</h3>
              <p className="text-gray-600">
                Re-analyze and watch your score improve in real-time
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
                Why Use Resume ATS?
              </h2>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-gray-900">AI-Powered Analysis</h3>
                    <p className="text-gray-600">
                      Uses advanced AI to analyze your resume against job requirements
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Instant Feedback</h3>
                    <p className="text-gray-600">
                      Get your ATS score and suggestions in seconds
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Actionable Suggestions</h3>
                    <p className="text-gray-600">
                      Receive specific, prioritized suggestions to improve your resume
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Version History</h3>
                    <p className="text-gray-600">
                      Track improvements and access all your past analyses
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-xl p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Free Tier</h3>
              <div className="text-4xl font-bold text-primary-600 mb-2">4 analyses</div>
              <p className="text-gray-600 mb-6">per week</p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span className="text-gray-700">AI-powered ATS scoring</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span className="text-gray-700">Detailed suggestions</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span className="text-gray-700">Unlimited history access</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span className="text-gray-700">Weekly reset</span>
                </li>
              </ul>
              {!isAuthenticated && (
                <Link
                  to="/signup"
                  className="block w-full text-center px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium"
                >
                  Start Free Today
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Ready to Land Your Dream Job?
          </h2>
          <p className="text-xl text-primary-100 mb-8">
            Join thousands of job seekers who have improved their resumes with Resume ATS
          </p>
          {!isAuthenticated && (
            <Link
              to="/signup"
              className="inline-flex items-center justify-center px-8 py-3 text-lg font-medium rounded-lg bg-white text-primary-600 hover:bg-gray-100 transition-colors"
            >
              Get Started Free
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          )}
        </div>
      </section>
    </div>
  );
};

export default Home;
