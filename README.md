# Job Portal Management System API

Backend API for a job portal where users can view and search jobs, apply to jobs, and manage their applications.

## Tech Stack
- Node.js
- Express.js
- MongoDB (Mongoose)
- JWT Authentication
- Bcrypt Password Hashing

## Setup

1. **Clone the repository**
2. **Install dependencies**
   ```bash
   npm install
   ```
3. **Environment Variables**
   Create a `.env` file in the root directory:
   ```env
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/job-portal
   JWT_SECRET=your_jwt_secret
   JWT_EXPIRES_IN=30d
   ```
4. **Run Server**
   ```bash
   # Development
   npm run dev

   # Production
   npm start
   ```

## API Usage

### Authentication
- **Register**: `POST /api/auth/register` - `{ name, email, password }`
- **Login**: `POST /api/auth/login` - `{ email, password }`
- **Get Profile**: `GET /api/auth/me` (Protected)

### Jobs
- **Get All Jobs**: `GET /api/jobs?title=developer&location=remote`
- **Get Job**: `GET /api/jobs/:id`
- **Create Job**: `POST /api/jobs` (Admin only)
- **Update Job**: `PUT /api/jobs/:id` (Admin only)
- **Delete Job**: `DELETE /api/jobs/:id` (Admin only)

### Applications
- **Apply for Job**: `POST /api/jobs/:id/apply` (Candidate only)
- **My Applications**: `GET /api/applications/me`
- **Withdraw Application**: `DELETE /api/applications/:id`

## Role Management
- Default role upon registration is `candidate`.
- To create an admin, manually update the `role` field in the database to `admin`.
