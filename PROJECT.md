y# Scoreboard Project Documentation

## Project Overview
This is a modern scoreboard application built with Next.js, Supabase, and shadcn/ui. It provides real-time game tracking, team management, and statistics features for sports events.

## Project Structure

### Core Directories
- `/src/app` - Main application code
  - `/api` - API routes and endpoints
  - `/auth` - Authentication related components
  - `/components` - Reusable UI components
  - `/context` - React context providers
  - `/lib` - Utility functions and validations
  - `/scoreboard` - Main scoreboard functionality
  - `/teams` - Team management features
  - `/utils` - Helper functions

### Documentation
- `/docs` - Project documentation
  - `AUTH-UI.md` - Authentication UI documentation
  - `AUTH.md` - Authentication system documentation
  - `database_schema.md` - Database structure

### Database
- `/db` - SQL scripts and database setup
  - `schema.sql` - Database schema definition
  - `seed_teams.sql` - Initial team data

## Features

### Game Management
- Real-time game timer with controls
- Score tracking
- Period management
- Team statistics

### Authentication
- User authentication system
- Protected routes
- Admin controls

### Team Management
- Team creation and editing
- Player management
- Team statistics tracking

### UI Components
- Modern, responsive design using shadcn/ui
- Real-time updates
- Timeline view
- Administrative controls

## Available Routes

### Public Routes
- `/` - Home page
- `/scoreboard` - Main scoreboard display
- `/auth` - Authentication pages

### Protected Routes
- `/teams` - Team management
- `/admin` - Administrative controls

## Technical Stack

### Frontend
- Next.js for the framework
- shadcn/ui for components
- Tailwind CSS for styling
- React Context for state management

### Backend
- Supabase for database and authentication
- Next.js API routes

### Development
- TypeScript support
- ESLint configuration
- PostCSS setup
- Custom fonts (Geist Sans and Geist Mono)

## Getting Started

To run the project locally:

1. Install dependencies:
```bash
pnpm install
```

2. Set up environment variables

3. Start the development server:
```bash
pnpm dev
```

## Contributing

Refer to BLUEPRINT.md for detailed development guidelines and project structure.

## License

This project is proprietary and confidential. All rights reserved.