# Flight Reservation System

## Introduction

This Flight Reservation System is a modern, microservices-based application designed to provide a comprehensive platform for managing flight bookings. Built with Node.js, React, and PostgreSQL, it demonstrates the implementation of a distributed system architecture following industry best practices.

## Project Overview

The system allows users to search for flights, make reservations, select seats, and process payments. It consists of five core microservices that work together to deliver a seamless user experience:

- **Auth Service**: Handles user authentication, registration, and authorization
- **Ticket Service**: Manages flight ticket inventory and search functionality
- **Reservation Service**: Processes booking requests and seat allocations
- **Payment Service**: Integrates with Razorpay for secure payment processing
- **Frontend Service**: Provides a responsive React/TypeScript UI with Material-UI components

Each service is containerized using Docker, making deployment and scaling straightforward across different environments.

## Key Technical Features

- Microservices architecture with clear separation of concerns
- RESTful API design with consistent patterns across services
- JWT-based authentication for secure service-to-service communication
- PostgreSQL database for reliable data persistence
- React frontend with Redux for state management
- Docker containerization for consistent deployment
- Environment-based configuration for development flexibility

## Getting Started

Refer to the README.md for detailed setup instructions, API documentation, and deployment guidelines.
