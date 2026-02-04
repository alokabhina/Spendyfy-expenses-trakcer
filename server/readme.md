# 📊 Expense Tracker - Backend API

Complete backend API for MERN Expense Tracker with Clerk Authentication.

## 🚀 Features

- ✅ **Authentication**: Clerk-based authentication
- ✅ **CRUD Operations**: Complete expense management
- ✅ **Analytics**: Category-wise, monthly trends, comparisons
- ✅ **Filtering**: Advanced filtering with pagination
- ✅ **Validation**: Request validation using express-validator
- ✅ **Security**: Protected routes with Clerk middleware

## 📋 Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- Clerk account (for authentication)

## 🛠️ Installation

### 1. Clone and Install Dependencies

```bash
cd server
npm install
```

### 2. Environment Setup

Create a `.env` file in the server directory:

```env
# MongoDB Connection
MONGODB_URI=mongodb://localhost:27017/expenses-tracker

# Clerk Authentication
CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key

# Server Configuration
PORT=5000
NODE_ENV=development

# Frontend URL (for CORS)
CLIENT_URL=http://localhost:5173
```

### 3. Get Clerk Keys

1. Sign up at [clerk.com](https://clerk.com)
2. Create a new application
3. Go to **API Keys** section
4. Copy your **Publishable Key** and **Secret Key**

### 4. Start the Server

**Development Mode:**
```bash
npm run dev
```

**Production Mode:**
```bash
npm start
```

Server will run on `http://localhost:5000`

## 📡 API Endpoints

### **Authentication Routes** (`/api/auth`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/auth/profile` | Get user profile | ✅ |
| PUT | `/api/auth/profile` | Update user profile | ✅ |
| DELETE | `/api/auth/account` | Delete user account | ✅ |

### **Expense Routes** (`/api/expenses`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/expenses` | Create new expense | ✅ |
| GET | `/api/expenses` | Get all expenses (with filters) | ✅ |
| GET | `/api/expenses/recent` | Get recent expenses | ✅ |
| GET | `/api/expenses/:id` | Get single expense | ✅ |
| PUT | `/api/expenses/:id` | Update expense | ✅ |
| DELETE | `/api/expenses/:id` | Delete expense | ✅ |
| DELETE | `/api/expenses` | Delete all expenses | ✅ |

### **Analytics Routes** (`/api/analytics`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/analytics/dashboard` | Dashboard statistics | ✅ |
| GET | `/api/analytics/category` | Category-wise analytics | ✅ |
| GET | `/api/analytics/trends` | Monthly trends | ✅ |
| GET | `/api/analytics/comparison` | Current vs previous period | ✅ |

## 📝 Request Examples

### Create Expense

```http
POST /api/expenses
Authorization: Bearer <clerk_token>
Content-Type: application/json

{
  "title": "Grocery Shopping",
  "amount": 1500,
  "category": "Food",
  "date": "2024-02-04",
  "description": "Weekly groceries",
  "paymentMethod": "Card"
}
```

### Get Expenses with Filters

```http
GET /api/expenses?category=Food&startDate=2024-01-01&endDate=2024-02-04&page=1&limit=10
Authorization: Bearer <clerk_token>
```

### Update User Profile

```http
PUT /api/auth/profile
Authorization: Bearer <clerk_token>
Content-Type: application/json

{
  "monthlyBudget": 50000,
  "categories": ["Food", "Transport", "Shopping", "Bills", "Entertainment", "Health", "Others"]
}
```

## 🗂️ Data Models

### User Schema
```javascript
{
  clerkId: String (unique),
  email: String (unique),
  firstName: String,
  lastName: String,
  monthlyBudget: Number,
  categories: [String],
  timestamps: true
}
```

### Expense Schema
```javascript
{
  userId: String,
  title: String,
  amount: Number,
  category: String (enum),
  date: Date,
  description: String,
  paymentMethod: String (enum),
  timestamps: true
}
```

## 🔐 Authentication Flow

1. Frontend sends request with Clerk session token
2. `requireAuth` middleware validates token
3. `verifyAuth` middleware extracts userId
4. Request proceeds to controller with `req.userId`

## 📊 Available Categories

- Food
- Transport
- Shopping
- Bills
- Entertainment
- Health
- Others

## 💳 Payment Methods

- Cash
- Card
- UPI
- Net Banking
- Others

## 🚨 Error Handling

All errors return in this format:

```json
{
  "success": false,
  "message": "Error message here",
  "errors": [] // validation errors if any
}
```

## 🧪 Testing the API

Use tools like:
- **Postman**: Import the API collection
- **Thunder Client**: VS Code extension
- **cURL**: Command line testing

Example with cURL:
```bash
curl -X GET http://localhost:5000/health
```

## 📦 Project Structure

```
server/
├── config/          # Database and Clerk config
├── controllers/     # Route controllers
├── middleware/      # Custom middleware
├── models/          # Mongoose models
├── routes/          # API routes
├── utils/           # Validators and helpers
├── .env             # Environment variables
├── server.js        # Main server file
└── package.json     # Dependencies
```

## 🔧 Development Tips

1. Use **MongoDB Compass** to view database
2. Install **Postman** for API testing
3. Enable **nodemon** for auto-restart
4. Check **Clerk Dashboard** for user management

## 🐛 Common Issues

### MongoDB Connection Error
- Check if MongoDB is running: `mongod`
- Verify MONGODB_URI in `.env`

### Clerk Authentication Error
- Verify Clerk keys are correct
- Check if Clerk app is active
- Ensure frontend is sending proper token

### CORS Error
- Update CLIENT_URL in `.env`
- Check CORS configuration in `server.js`

## 📈 Performance Tips

- Indexes are already added for common queries
- Use pagination for large datasets
- Filter data before sending to frontend
- Cache frequently accessed data

## 🚀 Deployment

### Railway / Render / Heroku

1. Create new project
2. Connect GitHub repository
3. Add environment variables
4. Deploy!

### Environment Variables for Production
```env
NODE_ENV=production
MONGODB_URI=<your_mongodb_atlas_uri>
CLERK_PUBLISHABLE_KEY=<production_key>
CLERK_SECRET_KEY=<production_secret>
CLIENT_URL=<your_frontend_url>
```

## 📚 Additional Resources

- [Clerk Documentation](https://clerk.com/docs)
- [Express.js Guide](https://expressjs.com)
- [Mongoose Docs](https://mongoosejs.com)
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)

## 🤝 Support

For issues or questions:
1. Check the error message
2. Review Clerk documentation
3. Verify environment variables
4. Check MongoDB connection

---

**Built with ❤️ using Node.js, Express, MongoDB, and Clerk**