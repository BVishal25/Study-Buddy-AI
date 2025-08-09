# SuperAI Learning Platform

## Overview

SuperAI is a comprehensive AI learning platform that provides personalized education paths, interactive knowledge visualization, and AI-powered tutoring. The platform combines theoretical learning with practical application through an integrated sandbox environment, research paper summaries, and progress tracking. Built as a full-stack application with a React frontend and Express backend, it uses PostgreSQL for data persistence and integrates with OpenAI for intelligent tutoring capabilities.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript for type safety and modern development patterns
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack Query (React Query) for server state management and caching
- **UI Components**: Radix UI primitives with shadcn/ui design system for consistent, accessible components
- **Styling**: Tailwind CSS with CSS variables for theming support (light/dark modes)
- **Build Tool**: Vite for fast development and optimized production builds

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules for modern JavaScript features
- **API Design**: RESTful API structure with centralized route registration
- **Error Handling**: Centralized error middleware with structured error responses
- **Development**: Hot reload and development server integration with Vite

### Data Layer
- **Database**: PostgreSQL with Neon serverless hosting
- **ORM**: Drizzle ORM for type-safe database operations
- **Schema Management**: Drizzle Kit for migrations and schema management
- **Validation**: Zod schemas for runtime type validation and data integrity

### Authentication & Session Management
- **Session Storage**: PostgreSQL-based sessions using connect-pg-simple
- **User Management**: UUID-based user identification with email/username uniqueness constraints

### AI Integration
- **AI Provider**: OpenAI GPT-4o for intelligent tutoring and content generation
- **Features**: 
  - Personalized learning path generation based on user assessment
  - Contextual AI tutoring with conversation history
  - Research paper summarization for knowledge updates
  - Adaptive content recommendations

### Visualization & Interactivity
- **Knowledge Graph**: D3.js for interactive network visualization of learning topics
- **Code Editor**: Monaco Editor integration for hands-on programming practice
- **Charts**: Custom chart components for progress tracking and analytics

### Development Environment
- **Containerization**: Replit-optimized development environment
- **Hot Reload**: Integrated development server with automatic refresh
- **Error Overlay**: Runtime error modal for development debugging

## External Dependencies

### Core Services
- **Neon Database**: Serverless PostgreSQL hosting with connection pooling
- **OpenAI API**: GPT-4o model for AI tutoring and content generation
- **Vercel/Replit**: Deployment and hosting infrastructure

### Development Tools
- **Replit**: Cloud-based development environment with integrated tooling
- **Vite**: Build tool with plugin ecosystem for development optimization

### Third-Party Libraries
- **UI Framework**: Radix UI for accessible component primitives
- **Visualization**: D3.js for interactive data visualization
- **Code Editing**: Monaco Editor for in-browser code editing capabilities
- **Form Handling**: React Hook Form with Hookform Resolvers for validation
- **Date Utilities**: date-fns for date manipulation and formatting
- **Styling Utilities**: class-variance-authority and clsx for conditional styling

### Content Delivery
- **Fonts**: Google Fonts (Inter) for typography
- **Icons**: Font Awesome for iconography
- **External Scripts**: D3.js and Monaco Editor loaded via CDN for performance optimization