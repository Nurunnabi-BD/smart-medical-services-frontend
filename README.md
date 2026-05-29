# 🏥 Smart Medical Service Platform - Full-Stack Application

A premium, responsive, and feature-rich full-stack healthcare web application that connects Patients with Doctors, offers an Integrated Online Pharmacy, and provides Admins with complete platform control and statistics.

---

## 🌟 Key Features

🔗 Live Website: https://smart-medical-services-frontend.vercel.app

### 🔐 1. Role-Based Authentication & Gatekeeping
*   **Secure Authentication**: Secure password hashing with `Bcrypt` and token-based state management using `JWT`.
*   **Role-Based Dashboards**: Redirects users to customized panels depending on their credentials (**Patient**, **Doctor**, or **Admin**).

### 🏥 2. Appointments & E-Consultation
*   **Doctor Directory**: Filter and search doctors by specialization, rating, consultation fees, and experience.
*   **Booking System**: Choose from available time slots and schedule appointments dynamically.
*   **Dummy Checkout & Payment**: Integrated billing interface supporting bkash, Nagad, and credit/debit card mockup checkout.
*   **Approve/Reject Flow**: Doctors have complete authority to approve, reject, and mark appointments as completed.

### 📄 3. Medical Reports & E-Prescriptions
*   **Electronic Prescriptions**: Doctors can generate detailed prescriptions containing diagnosis and medicines (with dosages, durations, and specific instructions).
*   **Download & Print**: Patients can download their prescriptions as plain text files or directly print print-friendly copies.
*   **Medical Report Upload**: Patients can upload their scanned medical reports (PDF/images) to their portal, which doctors can easily review.

### 🛒 4. Interactive Online Pharmacy
*   **Medicine Catalog**: Full e-commerce storefront for medicines and health devices with live stock updates.
*   **Advanced Filtering**: Search by name, categories, brands, price ranges, and medicine forms (tablets, capsules, syrups, etc.).
*   **Upload Prescription for Orders**: Patients can upload their prescriptions directly to the store for manual processing by online pharmacists.
*   **Shopping Cart**: Integrated shopping cart with drawers for checking out ordered products.

### 💬 5. Real-Time Patient-Doctor Chat
*   **Live Chat Modals**: Active patients and doctors can converse directly through a built-in messaging module to discuss symptoms, prescriptions, and follow-ups.
*   **Contact Management**: Automatic contact curation based on appointments.

### 📈 6. Comprehensive Admin Insights
*   **Interactive Analytics Charts**: Real-time admin dashboard visualizes appointment trends, revenue stats, doctor ratings, and patient registration metrics using charts.
*   **User Management**: Administrators can view and manage list of all registered doctors and patients.

---

## 📂 Project Structure

```text
Smart Medical Services/
├── backend/                    # Node.js Express server
│   ├── config/                 # DB connections
│   ├── controllers/            # API endpoints logic
│   ├── middleware/             # Route guards (auth, admin)
│   ├── models/                 # Mongoose database schemas
│   ├── routes/                 # Express route entrypoints
│   ├── seedUsers.js            # Admin, Doctor, and Patient seeder script
│   ├── seedMedicines.js        # Medicine items seeder script
│   ├── server.js               # Entry point file
│   └── .env.example            # Environment variables template
│
└── smart-medical-services/     # React frontend application
    ├── src/
    │   ├── api/                # Axios instance & headers
    │   ├── components/         # Reusable layouts, cards, and drawers
    │   ├── context/            # Auth and Cart global providers
    │   ├── pages/              # Dashboard and view views
    │   ├── App.jsx             # Main client routes
    │   └── main.jsx            # Entry point
    └── .env.example            # Client API base URL template
```

---

## 🛠️ Technology Stack

### Backend
*   **Express.js**: REST API routing.
*   **Mongoose (MongoDB)**: Data persistence schemas.
*   **JWT & Bcrypt.js**: Secure token generation and password security.

### Frontend
*   **React (Vite)**: Fast hot-reloading rendering.
*   **Tailwind CSS & DaisyUI**: Styled with a cohesive medical aesthetic.
*   **Recharts**: Visualizes administrative data.
*   **SweetAlert2**: Alert popups and notifications.

---

## 🚀 Quick Start Guide

### 1. Database Setup & IP Whitelisting
To allow the backend to read and write to MongoDB Atlas:
1. Log in to your [MongoDB Atlas Dashboard](https://cloud.mongodb.com/).
2. Under the **Security** section on the left sidebar, click **Network Access**.
3. Click the **Add IP Address** button.
4. Choose **Add Current IP Address** (or select **Allow Access From Anywhere** by adding `0.0.0.0/0` during development).
5. Click **Confirm** and wait 1–2 minutes for the status to turn active.

### 2. Configure Environment Variables
*   **Backend (`backend/.env`)**:
    Create a `.env` file in the `backend/` directory:
    ```env
    PORT=5000
    MONGO_URI=your_mongodb_connection_string
    JWT_SECRET=your_jwt_secret_key
    ```
*   **Frontend (`smart-medical-services/.env`)**:
    Create a `.env` file in the `smart-medical-services/` directory:
    ```env
    VITE_API_BASE_URL=http://localhost:5000/api
    ```

### 3. Database Seeding (Automated)
Instead of manually registering and modifying records in the database, run the pre-built seed scripts:
1. Navigate to the backend directory and run the user seeder:
   ```bash
   cd backend
   node seedUsers.js
   ```
2. Run the medicine database seeder:
   ```bash
   node seedMedicines.js
   ```

#### 🔑 Default Test Accounts
After seeding, you can log in with the following default credentials:
*   **Administrator**: `admin@example.com` / `password123`
*   **Doctor**: `doctor@example.com` / `password123`
*   **Patient**: `patient@example.com` / `password123`

### 4. Run the Platform

#### Running the Backend
```bash
cd backend
npm install
npm run dev
```
The backend server runs at `http://localhost:5000`.

#### Running the Frontend
```bash
cd smart-medical-services
npm install
npm run dev
```
The frontend application runs at `http://localhost:5173`.
