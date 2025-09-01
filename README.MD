<div align="center">
	<h1>RIWI Comunidad </h1>
	<p><b>Comprehensive backend for a social community platform</b></p>
</div>

---

## Table of Contents
- [Table of Contents](#table-of-contents)
- [Introduction](#introduction)
- [Features](#features)
- [Project Structure](#project-structure)
- [Main Endpoints](#main-endpoints)
- [Installation](#installation)
- [Usage](#usage)
- [Technologies Used](#technologies-used)
- [Contributing](#contributing)
- [License](#license)
- [Team Credits](#team-credits)

---

## Introduction

Backend Comunidad is a robust RESTful API designed for a social community platform. It enables user registration, authentication, profile management, posting, commenting, reactions, notifications, and real-time chat. The project leverages modern technologies and best practices for scalability and maintainability.

## Features

- User registration and authentication (JWT)
- Profile creation and update with photo upload (Cloudinary)
- Social posts with file/image support
- Comments and reactions on posts
- Real-time chat between users (Socket.IO)
- Notifications for new posts and interactions
- Role-based access control
- PostgreSQL database with Sequelize ORM

## Project Structure

```
src/
	config/         # Database and cloudinary configs
	controllers/    # Route logic for users, posts, chat, etc.
	database/       # SQL schema
	middleware/     # Auth and user middleware
	models/         # Sequelize models
	routers/        # Express routers
	services/       # Helper services (notifications, apis)
	sockets/        # Socket.IO logic
	server.js       # Main server entry point
```

## Main Endpoints

- `/api/register` - Register new user
- `/api/login` - User login
- `/api/profile` - Get/update profile
- `/api/posts` - CRUD for posts
- `/api/posts/:post_id/comments` - Add comments
- `/api/posts/:post_id/reactions` - Add reactions
- `/api/chat/*` - Chat endpoints
- `/api/notifications` - Get notifications

## Installation

1. Clone the repository:
	 ```bash
	 git clone <[repo-url](https://github.com/Deko25/backend_comunidad)>
	 cd backend_comunidad
	 ```
2. Install dependencies:
	 ```bash
	 npm install
	 ```
3. Create a `.env` file with your Cloudinary and database credentials.
4. Run database migrations if needed (see `src/database/db.database.sql`).

## Usage

Start the server:
```bash
npm run start
```
For development with auto-reload:
```bash
npm run dev
```
API available at `http://localhost:3000`

## Technologies Used

- Node.js
- Express
- Sequelize ORM
- PostgreSQL
- Socket.IO
- Cloudinary
- Multer
- Morgan
- JWT (jsonwebtoken)
- dotenv
- bcryptjs
- nodemon (development)

## Contributing

Contributions are welcome! Please fork the repository and submit a pull request. For major changes, open an issue first to discuss what you would like to change.

## License

This project is licensed under the ISC License.

## Team Credits

Developed by the Backend Community Team:

- Karlos Cajibioy Velasquez
- Zamir Esteban Estrada Corredor
- Jefferson Molina Soto
- Tomas David Restrepo Osorio
- Mateo Castañeda



