# College Review System

A full-stack College Review System built with the MERN stack (MongoDB, Express.js, React/Next.js, Node.js). This project implements authentication, role-based access control, CRUD operations for college reviews, and average rating aggregations.

## Features
* **Authentication & Authorization**: Secure JWT-based login and registration with bcrypt password hashing[cite: 1].
* **Role-Based Access**: Specialized permissions for Admin, Teacher, and Student roles[cite: 1].
* **College Management**: Endpoints to create, read, update, and delete college records, including an aggregated list showing the average rating and total review count per college[cite: 1].
* **Review System**: CRUD operations for reviews with pagination and search functionality[cite: 1].
* **Validation & Error Handling**: Comprehensive input validation using Joi/express-validator[cite: 1].
* **Testing**: Integration tests for authentication and review endpoints using Jest and Supertest[cite: 1].
* **Containerization**: Fully containerized local development environment using Docker and Docker Compose[cite: 1].

## Prerequisites
* Docker and Docker Compose
* Node.js (v24 LTS recommended if running locally)
* Git

## Setup & Run Instructions

**1. Clone the repository**
```bash
$ git clone <your-repository-url>
$ cd college_review_system
$ docker-compose build --no-cache
```

**2. Start the containers**
```bash
$ docker-compose up -d
```

**3. seed data** 

```bash
$ docker-compose exec backend npm run seed
```

# Front-url path

```plaintext
Root path : http://localhost:3000
Login path : http://localhost:3000/auth/login
Admin path : http://localhost:3000/admin
Student path : http://localhost:3000/student

```