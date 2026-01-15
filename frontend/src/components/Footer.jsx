import { FileText, Github, Mail } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <FileText className="h-6 w-6 text-primary-500" />
              <span className="text-xl font-bold text-white">Resume ATS</span>
            </div>
            <p className="text-sm">
              AI-powered resume analyzer helping job seekers optimize their resumes for ATS systems and land more interviews.
            </p>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="/" className="hover:text-primary-400 transition-colors">
                  Home
                </a>
              </li>
              <li>
                <a href="/dashboard" className="hover:text-primary-400 transition-colors">
                  Dashboard
                </a>
              </li>
              <li>
                <a href="/history" className="hover:text-primary-400 transition-colors">
                  History
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Connect</h3>
            <div className="flex space-x-4">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-primary-400 transition-colors"
              >
                <Github className="h-6 w-6" />
              </a>
              <a
                href="mailto:support@resumeats.com"
                className="hover:text-primary-400 transition-colors"
              >
                <Mail className="h-6 w-6" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-sm text-center">
          <p>&copy; {new Date().getFullYear()} Resume ATS. Built with ❤️ to help job seekers land their dream jobs.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
