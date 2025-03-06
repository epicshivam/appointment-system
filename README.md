# Appointment Booking System

This is a **Node.js Express** application that provides an appointment booking system where students can book appointments with professors. The system includes authentication, availability management, and appointment handling.

## Features
- **User Authentication**: Register and log in users.
- **Professor Availability Management**: Professors can set and manage their availability.
- **Appointment Booking**: Students can book, cancel, and check appointment statuses.

## Tech Stack
- **Backend**: Node.js, Express.js
- **Authentication**: JSON Web Tokens (JWT)
- **Database**: MongoDB (Assumed, modify if using SQL)
- **Environment Variables**: dotenv

## Installation
1. Clone the repository:
   ```bash
   git clone <your-repo-url>
   ```
2. Navigate into the project directory:
   ```bash
   cd appointment-booking
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Create a `.env` file and add the following:
   ```plaintext
   JWT_SECRET=your_jwt_secret
   MONGO_URI=your_mongodb_connection_string
   ```

## Running the Project
- Start the server:
  ```bash
  npm start
  ```
- Server will run on **http://localhost:5000** by default.

## API Endpoints
### Authentication Routes
| Method | Endpoint         | Description       |
|--------|----------------|------------------|
| POST   | `/auth/register` | Register a user |
| POST   | `/auth/login`    | Login a user    |

### Availability Routes
| Method | Endpoint                         | Description                       |
|--------|----------------------------------|----------------------------------|
| POST   | `/availability`                   | Set professor availability       |
| GET    | `/availability/:professorId/:date` | Get availability for a professor |

### Appointment Routes
| Method | Endpoint                        | Description                           |
|--------|---------------------------------|--------------------------------------|
| POST   | `/appointments`                 | Book an appointment                  |
| PUT    | `/appointments/:appointmentId`  | Cancel an appointment                |
| GET    | `/appointments/:studentId`      | Get appointments for a student       |
| GET    | `/:appointmentId/status`        | Check appointment status             |

## Project Structure
```
.
├── controllers
│   ├── authController.js
│   ├── availabilityController.js
│   ├── appointmentController.js
├── routes
│   ├── index.js
├── middleware
│   ├── authenticateToken.js
├── models
│   ├── User.js
│   ├── Appointment.js
│   ├── Availability.js
├── config
│   ├── db.js
├── .gitignore
├── package.json
├── server.js
```

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## License
This project is open-source and free to use. Modify as needed!

---
