# Resume ATS Frontend

Modern React frontend for the Resume ATS application - an AI-powered resume analyzer that helps job seekers optimize their resumes for ATS systems.

## Tech Stack

- **React 18** - UI library
- **Vite** - Build tool and dev server
- **React Router** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **Axios** - HTTP client
- **Lucide React** - Icon library

## Features

- User authentication (Login/Signup)
- Resume upload with drag-and-drop support
- AI-powered resume analysis
- ATS score visualization
- Categorized improvement suggestions
- Analysis history and tracking
- Responsive design for all devices
- Real-time usage tracking

## Project Structure

```
frontend/
├── public/              # Static assets
├── src/
│   ├── components/      # Reusable components
│   │   ├── Navbar.jsx
│   │   ├── Footer.jsx
│   │   ├── ATSScoreCard.jsx
│   │   └── SuggestionsList.jsx
│   ├── context/         # React context providers
│   │   └── AuthContext.jsx
│   ├── pages/           # Page components
│   │   ├── Home.jsx
│   │   ├── Login.jsx
│   │   ├── Signup.jsx
│   │   ├── Dashboard.jsx
│   │   ├── UploadResume.jsx
│   │   ├── AnalysisResult.jsx
│   │   └── History.jsx
│   ├── services/        # API services
│   │   └── api.js
│   ├── App.jsx          # Main app component
│   ├── main.jsx         # Entry point
│   └── index.css        # Global styles
├── index.html
├── package.json
├── vite.config.js
└── tailwind.config.js
```

## Getting Started

### Prerequisites

- Node.js >= 18.0.0
- npm or yarn
- Backend server running on port 5000

### Installation

1. Install dependencies:
```bash
npm install
```

2. Create environment file:
```bash
cp .env.example .env
```

3. Update `.env` with your configuration:
```env
VITE_API_URL=http://localhost:5000/api
```

### Development

Start the development server:
```bash
npm run dev
```

The app will be available at `http://localhost:5173`

### Building for Production

Build the production bundle:
```bash
npm run build
```

Preview the production build:
```bash
npm run preview
```

## Pages

### Home (`/`)
- Landing page with feature highlights
- Call-to-action for signup
- Accessible to all users

### Login (`/login`)
- User authentication
- Redirects to dashboard on success

### Signup (`/signup`)
- New user registration
- Form validation
- Redirects to dashboard on success

### Dashboard (`/dashboard`)
- Usage statistics
- Recent analyses
- Quick actions
- Protected route (requires authentication)

### Upload Resume (`/upload`)
- Resume file upload (PDF only)
- Job description input
- Drag-and-drop support
- Protected route

### Analysis Result (`/analysis/:id`)
- ATS score display
- Detailed suggestions
- Job details
- Version history
- Export functionality
- Protected route

### History (`/history`)
- All past analyses
- Search and filter
- Sort by date or score
- Protected route

## Components

### Navbar
- Responsive navigation
- User menu
- Mobile hamburger menu
- Authentication state aware

### Footer
- Links and information
- Social media links
- Copyright notice

### ATSScoreCard
- Visual score display
- Score breakdown
- Comparison with previous score
- Color-coded by performance

### SuggestionsList
- Categorized suggestions
- Priority indicators
- Category badges
- Expandable details

## API Integration

All API calls are centralized in `src/services/api.js`:

### Authentication
- `authAPI.login(credentials)` - User login
- `authAPI.signup(userData)` - User registration
- `authAPI.getCurrentUser()` - Get current user

### Analysis
- `analysisAPI.createAnalysis(formData)` - Create new analysis
- `analysisAPI.getAnalysis(id)` - Get specific analysis
- `analysisAPI.getAllAnalyses()` - Get all user analyses
- `analysisAPI.deleteAnalysis(id)` - Delete analysis

### User
- `userAPI.getProfile()` - Get user profile
- `userAPI.updateProfile(data)` - Update profile
- `userAPI.getUsageStats()` - Get usage statistics

## Authentication Flow

1. User logs in/signs up
2. Token stored in localStorage
3. AuthContext provides authentication state
4. Private routes check authentication
5. Token automatically added to requests
6. 401 responses trigger logout

## Styling

### Tailwind CSS
Custom utility classes defined in `index.css`:
- `.btn-primary` - Primary button style
- `.btn-secondary` - Secondary button style
- `.btn-outline` - Outlined button style
- `.input-field` - Standard input field
- `.card` - Card container

### Color Palette
Primary colors defined in `tailwind.config.js`:
- Primary: Blue shades (50-900)
- Success: Green
- Warning: Yellow
- Error: Red

## Environment Variables

### Development
```env
VITE_API_URL=http://localhost:5000/api
```

### Production
```env
VITE_API_URL=https://your-api-domain.com/api
```

## Deployment

### Vercel (Recommended)
1. Push code to GitHub
2. Import project in Vercel
3. Set environment variables
4. Deploy

### Netlify
1. Build the project: `npm run build`
2. Deploy the `dist` folder
3. Configure environment variables
4. Set up redirects for SPA

### Custom Server
1. Build: `npm run build`
2. Serve the `dist` folder
3. Configure web server for SPA routing
4. Set up SSL certificate

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT

## Support

For issues or questions, please check the main project documentation or open an issue on GitHub.
