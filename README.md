# PTIT Library Management System
## 📌 Table of Contents
- [About the Project](#-about-the-project)
- [Features](#-features)
  - [For Librarians](#for-librarians)
  - [For Students](#for-students)
  - [Advanced Features](#advanced-features)
- [Technologies Used](#-technologies-used)
- [Getting Started](#%EF%B8%8F-getting-started)
  - [Backend Setup](#backend-setup)
  - [Frontend Setup](#frontend-setup)
  - [Running the Application](#running-the-application)
- [Contact](#-contact)
---
## 📖 About the Project

This project is a **Library Management System** developed as a major assignment for my Python programming course. The system is designed to streamline the process of managing books, borrowers, and loans within a library environment, featuring advanced recommendation capabilities to enhance user experience.

---
## 🚀 Features
### For Librarians
- **Book Management:** Add, edit, delete, and view book details.
- **User Management:** Register and manage user accounts, including personal information and roles (e.g., librarian, student).
- **Loan Management:** Record book loans, returns, and overdue tracking.
- **Statistics Dashboard:** Comprehensive statistics and analytics for library operations, including book popularity, borrowing trends, etc.
- **Book Search:** Search for specific books by title, author, or other criteria.
### For Students
- **Book Browsing:** View available books in the library catalog.
- **Book Borrowing:** Request and borrow books from the library.
- **Borrowing History:** Track personal borrowing history and current loans.
- **Book Search:** Search for specific books by title, author, or other criteria.
- **Personalized Recommendations:** Get book suggestions based on your borrowing history and preferences.

### Advanced Features
**Content-Based Recommendation System:** The system implements an intelligent recommendation engine that analyzes users' borrowing history and book characteristics to provide personalized reading suggestions. By examining book attributes such as title, author, publisher, etc. the algorithm identifies patterns in user preferences and suggests similar titles that align with their reading interests.

---
## 🛠 Technologies Used
### Backend
- **Programming Language:** Python v3.10.11
- **Web Framework:** FastAPI
- **Database:** PostgreSQL
- **Machine Learning:** scikit-learn, pandas, numpy (for recommendation system)
### Frontend
- **Framework:** React.js
- **Runtime:** Node.js v22.14
- **Styling:** CSS (with Bootstrap for basic styling)
---
## ⚙️ Getting Started
### Backend Setup
1.  **Clone the repository:**
    ```bash
    git clone https://github.com/hoangpc0112/library_management.git
    cd library_management
    ```
2.  **Navigate to the backend directory:**
    ```bash
    cd backend
    ```
3.  **Set up your virtual environment:**
    ```bash
    python -m venv venv
    source venv/bin/activate  # On Windows use `venv\Scripts\activate`
    ```
4.  **Install backend dependencies:**
    ```bash
    pip install -r requirements.txt
    ```
### Frontend Setup
1.  **Navigate to the frontend directory:**
    ```bash
    cd ../frontend
    ```
2.  **Install frontend dependencies:**
    ```bash
    npm install
    ```
### Running the Application
#### Backend (FastAPI)
1.  **Navigate to the backend directory and activate virtual environment:**
    ```bash
    cd backend
    source venv/bin/activate  # On Windows use `venv\Scripts\activate`
    ```
2.  **Start the FastAPI server:**
    ```bash
    uvicorn main:app --reload
    ```
    The API will be available at `http://localhost:8000`
3.  **Access API Documentation:**
    - Swagger UI: `http://localhost:8000/docs`
    - ReDoc: `http://localhost:8000/redoc`
#### Frontend (React)
1.  **In a new terminal, navigate to the frontend directory:**
    ```bash
    cd frontend
    ```
2.  **Start the React development server:**
    ```bash
    npm run dev
    ```
    The frontend will be available at `http://localhost:3000`
---
## 📬 Contact
- Phạm Chính Hoàng - phamchinhhoang@gmail.com
- Project Link: [https://github.com/hoangpc0112/library_management](https://github.com/hoangpc0112/library_management)
