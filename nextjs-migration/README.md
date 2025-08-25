# Kshitij NGO - Student Sponsorship Dashboard

A modern Next.js application for managing student sponsorships, migrated from the original HTML/CSS/JavaScript implementation with enhanced functionality using shadcn/ui components.

## Features

### Dashboard
- **Analytics Dashboard**: Real-time insights with interactive charts
- **Student Management**: Comprehensive student profiles and data
- **Google Sheets Integration**: Sync data from Google Sheets
- **Multi-language Support**: English, Hindi, and Marathi
- **Responsive Design**: Works on all devices

### Sponsorship Form
- **Multi-step Form**: Organized sections for better UX
- **Real-time Validation**: Instant feedback with Zod validation
- **Progress Tracking**: Visual progress indicator
- **Auto-calculations**: Age and expense totals
- **Multi-language**: Complete translation support

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **UI Components**: shadcn/ui (Radix UI + Tailwind CSS)
- **Styling**: Tailwind CSS
- **Forms**: React Hook Form + Zod validation
- **Charts**: Recharts
- **Language**: TypeScript
- **State Management**: React hooks

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   cd /home/samarth/projects/ngo/nextjs-migration
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Project Structure

```
nextjs-migration/
├── app/                    # Next.js 14 App Router
│   ├── dashboard/         # Dashboard pages
│   ├── form/             # Form pages
│   ├── globals.css       # Global styles
│   ├── layout.tsx        # Root layout
│   └── page.tsx          # Home page
├── components/
│   ├── ui/               # shadcn/ui components
│   ├── dashboard/        # Dashboard-specific components
│   └── forms/            # Form-specific components
├── hooks/                # Custom React hooks
├── lib/                  # Utility functions
└── types/                # TypeScript type definitions
```

## Key Components

### Dashboard Components
- `StatsCards`: Display key metrics and statistics
- `ChartsGrid`: Interactive charts using Recharts
- `StudentsTable`: Student data with search and pagination
- `SyncStatus`: Google Sheets connection status

### Form Components
- `SponsorshipForm`: Multi-step form with validation
- `LanguageProvider`: Multi-language support context
- Progress tracking and auto-calculations

## Configuration

### Google Sheets Integration

1. Create a Google Sheet with student data
2. Get a Google Sheets API key from Google Cloud Console
3. Make the sheet publicly viewable
4. Configure in the Settings tab of the dashboard

### Environment Variables

Create a `.env.local` file:

```env
NEXT_PUBLIC_GOOGLE_SHEETS_API_KEY=your_api_key
NEXT_PUBLIC_GOOGLE_SHEET_ID=your_sheet_id
```

## Migration from Original

This Next.js version replicates all functionality from the original HTML/CSS/JavaScript implementation:

### Original Features Preserved
- ✅ Dashboard with analytics and charts
- ✅ Student management and profiles  
- ✅ Multi-language form (EN/HI/MR)
- ✅ Google Sheets integration
- ✅ Form validation and submission
- ✅ Responsive design
- ✅ Progress tracking

### Enhancements Added
- 🚀 Modern React/Next.js architecture
- 🎨 shadcn/ui component library
- 📱 Improved mobile experience
- 🔧 TypeScript for better development
- ⚡ Better performance and SEO
- 🧪 Form validation with Zod
- 📊 Enhanced charts with Recharts

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Connect repository to Vercel
3. Deploy automatically

### Other Platforms

Build the application:
```bash
npm run build
```

The `out` folder contains the static files ready for deployment.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is developed for Kshitij NGO's student sponsorship program.

## Support

For issues or questions, please contact the development team or create an issue in the repository.