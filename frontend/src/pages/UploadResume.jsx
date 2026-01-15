import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { analysisAPI } from '../services/api';
import { Upload, FileText, AlertCircle, Loader } from 'lucide-react';

const UploadResume = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    jobTitle: '',
    jobDescription: '',
    resume: null,
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError('');
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type !== 'application/pdf') {
        setError('Please upload a PDF file');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setError('File size must be less than 5MB');
        return;
      }
      setFormData({
        ...formData,
        resume: file,
      });
      setError('');
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const file = e.dataTransfer.files[0];
    if (file) {
      if (file.type !== 'application/pdf') {
        setError('Please upload a PDF file');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setError('File size must be less than 5MB');
        return;
      }
      setFormData({
        ...formData,
        resume: file,
      });
      setError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!formData.resume) {
      setError('Please upload a resume');
      setLoading(false);
      return;
    }

    if (!formData.jobDescription.trim()) {
      setError('Please enter a job description');
      setLoading(false);
      return;
    }

    try {
      const submitData = new FormData();
      submitData.append('resume', formData.resume);
      submitData.append('jobDescription', formData.jobDescription);
      if (formData.jobTitle) {
        submitData.append('jobTitle', formData.jobTitle);
      }

      const response = await analysisAPI.createAnalysis(submitData);
      navigate(`/analysis/${response.data._id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to analyze resume');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">New Resume Analysis</h1>
          <p className="text-gray-600 mt-2">
            Upload your resume and paste the job description to get started
          </p>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-start space-x-2">
            <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
            <span className="text-sm">{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Job Title */}
          <div className="card">
            <label htmlFor="jobTitle" className="block text-sm font-medium text-gray-700 mb-2">
              Job Title (Optional)
            </label>
            <input
              type="text"
              id="jobTitle"
              name="jobTitle"
              value={formData.jobTitle}
              onChange={handleChange}
              className="input-field"
              placeholder="e.g., Senior Software Engineer"
            />
          </div>

          {/* Resume Upload */}
          <div className="card">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Upload Resume (PDF) <span className="text-red-500">*</span>
            </label>
            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                dragActive
                  ? 'border-primary-500 bg-primary-50'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              {formData.resume ? (
                <div className="flex items-center justify-center space-x-3">
                  <FileText className="h-8 w-8 text-primary-600" />
                  <div className="text-left">
                    <p className="font-medium text-gray-900">{formData.resume.name}</p>
                    <p className="text-sm text-gray-600">
                      {(formData.resume.size / 1024).toFixed(2)} KB
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, resume: null })}
                    className="text-sm text-red-600 hover:text-red-700"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <>
                  <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-700 mb-2">
                    Drag and drop your resume here, or{' '}
                    <label className="text-primary-600 hover:text-primary-700 cursor-pointer">
                      browse
                      <input
                        type="file"
                        accept=".pdf"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                    </label>
                  </p>
                  <p className="text-sm text-gray-500">PDF only, max 5MB</p>
                </>
              )}
            </div>
          </div>

          {/* Job Description */}
          <div className="card">
            <label
              htmlFor="jobDescription"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Job Description <span className="text-red-500">*</span>
            </label>
            <textarea
              id="jobDescription"
              name="jobDescription"
              value={formData.jobDescription}
              onChange={handleChange}
              rows={12}
              className="input-field resize-none"
              placeholder="Paste the complete job description here..."
              required
            />
            <p className="text-sm text-gray-500 mt-2">
              Include the full job description with responsibilities, requirements, and qualifications
            </p>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              className="btn-secondary"
              disabled={loading}
            >
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? (
                <>
                  <Loader className="animate-spin h-5 w-5 mr-2 inline" />
                  Analyzing...
                </>
              ) : (
                'Analyze Resume'
              )}
            </button>
          </div>
        </form>

        {/* Info Box */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-sm font-semibold text-blue-900 mb-2">Tips for best results:</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Upload your resume in PDF format for accurate parsing</li>
            <li>• Include the complete job description with all details</li>
            <li>• Analysis typically takes 10-30 seconds depending on resume length</li>
            <li>• You can re-analyze the same resume after making improvements</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default UploadResume;
