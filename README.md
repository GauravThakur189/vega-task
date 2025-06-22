# 📝 Blog App Backend

This is a complete backend for a simple blogging platform built with **Node.js**, **Express**, **MongoDB**, and **JWT-based authentication**.  
The backend supports user signup/login, blog creation with image upload, and basic authorization features. Frontend is not completed due to time constraints completing it also with React Js 
and making it responsive. Also I will update multer with aws s3.

---

## ✅ Technologies Used

- Node.js  
- Express.js  
- MongoDB (Mongoose)  
- Multer – For image uploads  
- Bcrypt – For password hashing  
- JWT (jsonwebtoken) – For authentication  
- Cookie-parser – For handling auth tokens  

---

## 📦 Setup Instructions

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/blog-backend.git
cd blog-backend
```
## 3.  Install Dependencies
-npm install
## connect to mongodb databse DB_URI
##4. Run the Server
 -node app.js
### API Endpoints
## Auth Routes
# Signup
-POST /api/signup
-Headers: Content-Type: multipart/form-data
-Body (form-data):



# Login
-POST /api/login
-Headers: Content-Type: application/json
Body:
{
  "emailId": "example@gmail.com",
  "password": "yourpassword"
}
3 Sets an HTTP-only cookie with the JWT token.

# Get Current User
-GET /api/user
-Requires valid token cookie.
# Logout
-POST /api/logout
-Clears the auth cookie.

## Blog Routes
#Create Blog
-POST /api/blog
-Headers: Content-Type: multipart/form-data
-Body (form-data):

#Get All Blogs
-GET /api/blogs
-Returns: List of all blogs

# Get Blog by ID
-GET /api/:id

# Update Blog
-PUT /api/update/:id
-Headers: Content-Type: multipart/form-data
-Body (form-data): Same as create

# Delete Blog
-DELETE /api/delete/:id

## File Uploads
-Uploaded images are stored in the /uploads/ directory and served statically.
- Make sure this folder exists before running the app.

## Notes
-All routes involving user identity or modification of data require authentication via the JWT cookie.

-CORS is configured to allow requests from http://localhost:5173.

-Image uploads are validated to allow only .jpg, .jpeg, or .png files.

###Status
✅ Backend Completed

⚠️ Frontend is not completed due to time constraints completing it also with React Js and making it responsive
## All APIs are tested via Postman

-Postman Collection
 # Click here to open the collection in Postman

#Author
-Made with ❤️ by Gaurav Singh
