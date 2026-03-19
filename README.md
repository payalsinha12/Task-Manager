<img width="1919" height="821" alt="Screenshot 2026-03-19 062849" src="https://github.com/user-attachments/assets/60ddae6e-13f7-452e-ac26-a80a3732172a" />
Task-Manager is a full-stack web application designed to help users efficiently organize and manage their daily tasks. It allows users to create, update, delete, and track tasks in a user-friendly interface. The application leverages Prisma ORM for database interactions, ensuring smooth and efficient data management. Features include:

User authentication and authorization, 
CRUD operations for tasks, 
Structured database design for scalable data storage,
Clean frontend for better usability

Tech Stack:
Frontend: HTML, CSS, JavaScript
Backend: Node.js, Express
Database: SQLite (development) / MySQL or PostgreSQL (production-ready)
ORM: Prisma

Database Info
In your current setup, development database is SQLite (dev.db) — lightweight, file-based, easy for testing.
For production deployment, you can switch to MySQL or PostgreSQL with Prisma by changing the DATABASE_URL in .env
