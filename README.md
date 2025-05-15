# Flight Reservation System - Microservices Architecture

This project implements a flight reservation system with microservices architecture, including authentication, ticketing, reservation, and payment processing with Razorpay integration.

## Microservices

The system consists of the following microservices:

1. **API Gateway** (Port 5001): Single entry point for all client requests
2. **Auth Service** (Port 5000): Handles user authentication and authorization
3. **Ticket Service** (Port 5003): Manages flight tickets and search functionality
4. **Reservation Service** (Port 5002): Handles flight reservations
5. **Payment Service** (Port 5004): Processes payments via Razorpay
6. **Frontend Service** (Port 5173): React application for the user interface

## Getting Started with Docker

### Prerequisites

- Docker and Docker Compose installed on your system
- Git for cloning the repository

### Running the Application

1. Clone the repository:

   ```
   git clone <repository-url>
   cd <repository-directory>
   ```

2. Start all services with a single command:

   ```
   docker-compose up
   ```

3. To run in detached mode (background):

   ```
   docker-compose up -d
   ```

4. Access the application:
   - Frontend: http://localhost:5173
   - API Gateway: http://localhost:5001
   - Auth Service API: http://localhost:5000
   - Reservation Service API: http://localhost:5002
   - Ticket Service API: http://localhost:5003
   - Payment Service API: http://localhost:5004

### Stopping the Application

```
docker-compose down
```

To remove volumes as well:

```
docker-compose down -v
```

## API Gateway

The API Gateway serves as a single entry point to all backend services. It handles:

- Request routing to the appropriate microservice
- Authentication and authorization
- Request/response transformation
- Rate limiting (in production)
- Logging and monitoring

All client applications should connect to the API Gateway instead of individual services:

- Authentication: http://localhost:5001/api/auth
- Flight Tickets: http://localhost:5001/api/ticket
- Reservations: http://localhost:5001/api/reservation
- Payments: http://localhost:5001/api/payment

## Development

### Rebuilding Services

If you make changes to any service, rebuild it with:

```
docker-compose build <service-name>
```

Then restart:

```
docker-compose up -d
```

### Viewing Logs

```
docker-compose logs -f
```

To view logs for a specific service:

```
docker-compose logs -f <service-name>
```

## Environment Variables

The docker-compose file includes default environment variables. For production, consider using environment files or secrets management.

## Database

The system uses PostgreSQL for all services. Database initialization is handled automatically when starting the services.
