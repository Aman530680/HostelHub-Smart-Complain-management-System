# HostelHub - Complaint Management System

A complete, production-ready hostel complaint management system built with React and Node.js.

## Features

### 🔐 Authentication System
- Role-based login (Student, Warden, Worker)
- Secure JWT authentication
- User profile management with name and email

### 👨‍🎓 Student Dashboard
- Create complaints with title, description, room number
- Upload images (optional)
- Full CRUD operations (Create, Read, Update, Delete)
- View complaint status (Pending, Accepted, Rejected, In-Progress, Completed)
- Edit/delete pending complaints only

### 👮 Warden Dashboard (Admin)
- View all student complaints
- See student details (name, ID, room number)
- Accept or reject complaints
- Assign complaints to workers by category
- Add comments for workers
- Real-time status updates

### 👷 Worker Dashboard
- View assigned complaints only
- Update status (In Progress, Completed)
- See complaint details and warden comments
- Track work progress

## Tech Stack

**Frontend:**
- React 18
- React Router
- CSS3 (Modern styling)

**Backend:**
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT Authentication
- bcryptjs for password hashing

## Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud)

### 1. Clone Repository
```bash
git clone <repository-url>
cd HostelHub
```

### 2. Backend Setup
```bash
cd backend
npm install
```

Create `.env` file in backend directory:
```env
MONGO_URI=mongodb://localhost:27017/hostelhub
JWT_SECRET=your-super-secret-jwt-key
PORT=5000
```

Start backend server:
```bash
npm run dev
```

### 3. Frontend Setup
```bash
cd frontend
npm install
npm start
```

## Usage

### 1. Register Users
- Go to `/register`
- Select role (Student/Warden/Worker)
- Fill required information including name and email
- Choose department and hostel block from dropdowns

### 2. Login
- Go to `/login`
- Select role and enter credentials
- Redirected to appropriate dashboard

### 3. Student Workflow
1. Create complaint with title, description, room number
2. Optionally upload image
3. Submit complaint (status: Pending)
4. Edit or delete while pending
5. Track status updates from warden/worker

### 4. Warden Workflow
1. View all pending complaints
2. Review complaint details
3. Select appropriate worker by category
4. Accept and assign OR reject complaint
5. Add comments for worker guidance
6. Monitor active and completed complaints

### 5. Worker Workflow
1. View assigned complaints
2. Start work (status: In Progress)
3. Mark as completed when done
4. View work history

## Database Schema

### Users
- **Students**: student_id, name, email, password, room_number, department, hostel_block
- **Wardens**: warden_id, name, email, password, hostel_block
- **Workers**: worker_id, name, email, password, contact, category

### Complaints
- title, description, room_number, image, category
- student_id, student_name
- status, assigned_worker_id, assigned_worker_name
- warden_comments, timestamps

## API Endpoints

### Authentication
- `POST /auth/register` - Register new user
- `POST /auth/login` - User login

### Complaints
- `POST /complaints` - Create complaint
- `GET /complaints/student/:id` - Get student complaints
- `GET /complaints/all` - Get all complaints (warden)
- `GET /complaints/worker/:id` - Get worker complaints
- `PUT /complaints/:id` - Update complaint
- `DELETE /complaints/:id` - Delete complaint
- `PATCH /complaints/:id/status` - Update status

### Workers
- `GET /workers` - Get all workers

## Security Features

- Password hashing with bcryptjs
- JWT token authentication
- Role-based access control
- Input validation
- Secure API endpoints

## Production Deployment

### Environment Variables
```env
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/hostelhub
JWT_SECRET=production-secret-key
PORT=5000
NODE_ENV=production
```

### Build Frontend
```bash
cd frontend
npm run build
```

### Deploy
- Backend: Deploy to Heroku, AWS, or similar
- Frontend: Deploy to Netlify, Vercel, or similar
- Database: Use MongoDB Atlas for production

## Contributing

1. Fork the repository
2. Create feature branch
3. Commit changes
4. Push to branch
5. Create Pull Request

## License

MIT License - see LICENSE file for details