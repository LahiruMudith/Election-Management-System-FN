# 🗳️ E-Voting System

📺 **Watch Demo Video on YouTube:** [Click Here](https://youtu.be/lq6bNjmWcPI)

This is a full-stack **E-Voting System** built with **Spring Boot (backend)** and **Node.js/React (frontend)**.
The system allows voters to register, verify NICs, vote securely, and for admins to manage parties, candidates, and elections.

---

## 🚀 Features

### 🔹 Voter Side

* Register with **Google Login** or Email/Password
* Auto-generate password for Google login and send via **Java Mail**
* Secure login with JWT token (stored in cookies, 2-hour expiry)
* NIC Verification (upload front, back, and selfie)
* NIC and selfie images stored in **Cloudinary**
* Dashboard access after verification

### 🔹 Candidate Registration

1. Register account (username, email, password)
2. Enter personal details (full name, age, manifesto, etc.)
3. Select a political party
4. Upload NIC & selfie, submit application (status pending)

### 🔹 Admin Dashboard

* Summary cards for quick overview
* **Manage Political Parties**

  * Add, update, view, delete, deactivate parties
  * Fields: party name, symbol, color, leader, founding year, description
* **Manage Candidates**

  * View pending applications
  * Approve or reject candidate requests
* **Manage Voters**

  * Approve or reject NIC verification
* **Create Elections**

  * Step 1: Enter basic details (title, type, description, start & end date)
  * Step 2: Select districts
  * Step 3: Select candidates (minimum 2 required)
  * Step 4: Confirm & create election

### 🔹 Extra Features

* **Payment Gateway Integration (PayHere)** – self-study feature
* **React Hot Toast** for smooth alert notifications
* **Logging System** – application logs for debugging & tracking
* **Swagger UI** – API documentation and testing interface

---

## 🛠️ Tech Stack

### Backend (Spring Boot)

* Spring Boot
* Spring Security + JWT
* Java Mail (for sending Google login passwords)
* MySQL Database
* Cloudinary (for storing NIC/selfie images)
* Logback/SLF4J (for logging)
* Swagger UI (API documentation)

### Frontend (Node.js + React)

* React.js (UI)
* Node.js (frontend server)
* React Hot Toast (alert system)
---

## ⚙️ Installation

### 1️⃣ Clone Repository

```bash
git clone https://github.com/LahiruMudith/Election-Management-System-FN.git
cd e-voting-system
```

### 2️⃣ Backend Setup (Spring Boot)

```bash
cd backend
# Open with IntelliJ/Eclipse
# Configure application.properties:
# - Database (MySQL)
# - Cloudinary credentials
# - Mail server credentials
# - Logging configs
mvn clean install
mvn spring-boot:run
```

Backend APIs will be available at:
👉 `http://localhost:3000/`

Swagger UI available at:
👉 `http://localhost:8080/swagger-ui/index.html`

### 3️⃣ Frontend Setup (React + Node.js)

```bash
cd frontend
npm install
npm start
```

---

## 🔑 Environment Variables

### Backend (`application.properties`)

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/evoting
spring.datasource.username=root
spring.datasource.password=yourpassword

# JWT Secret
jwt.secret=your-secret-key

# Mail
spring.mail.host=smtp.gmail.com
spring.mail.port=587
spring.mail.username=your-email
spring.mail.password=your-email-password

# Cloudinary
cloudinary.cloud_name=your-cloud-name
cloudinary.api_key=your-api-key
cloudinary.api_secret=your-api-secret

# Logging
logging.level.org.springframework=INFO
logging.file.name=logs/app.log
```

---

## 📸 Screenshots

* Login Page
* NIC Verification
* Voter Dashboard
* Admin Dashboard
* Create Election Flow
* Swagger UI

---

## 📌 Project Links

* **Frontend Repo:** [link here](https://github.com/LahiruMudith/Election-Management-System-FN.git)
* **Backend Repo:** [link here](https://github.com/LahiruMudith/Election-Management-System-BN.git)

---

## 👨‍💻 Author

Developed by **Lahiru Mudith**
