# Flight Reservation System Frontend

This is the frontend service for the Flight Reservation System, built with React, TypeScript, and Material-UI.

## Features

- User Authentication (Login/Register)
- User Profile Management
- Flight Ticket Search and Booking
- Reservation Management
- Payment Processing

## Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

## Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Create a `.env` file in the root directory with the following variables:

   ```
   VITE_AUTH_SERVICE_URL=http://localhost:5001
   VITE_TICKET_SERVICE_URL=http://localhost:5003
   VITE_RESERVATION_SERVICE_URL=http://localhost:5002
   VITE_PAYMENT_SERVICE_URL=http://localhost:5004
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

## Project Structure

```
src/
├── components/     # Reusable components
├── pages/         # Page components
├── services/      # API services
├── store/         # Redux store configuration
├── types/         # TypeScript type definitions
├── utils/         # Utility functions
└── layouts/       # Layout components
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## API Integration

The frontend integrates with the following microservices:

1. Auth Service (Port 5001)

   - User authentication
   - User registration
   - Profile management

2. Ticket Service (Port 5003)

   - Flight ticket search
   - Ticket details
   - Airline information

3. Reservation Service (Port 5002)

   - Create reservations
   - Manage reservations
   - View reservation history

4. Payment Service (Port 5004)
   - Process payments
   - Payment verification
   - Payment history

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request
