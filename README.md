# 💳 CreditSea — Assignment

**This assignment** is a full-stack web application that allows users to **upload and analyze Experian credit reports** in XML format.  
It extracts essential details such as credit score, active/closed accounts, overdue amounts, recent enquiries, and much more — providing a **clean, interactive dashboard** for users to view their credit summary.

> ✨ “Empowering credit awareness, one report at a time.” 💡

---

## 🚀 Project Overview

CreditSea helps users **understand their credit profile** at a glance. Upload your Experian XML report, and instantly get:

- Credit score visualization  
- Active vs closed accounts summary  
- Outstanding balances and overdue amounts  
- Recent enquiries and credit activity  
- Historical trends of credit usage  

The application combines a **Next.js + Tailwind CSS frontend** with a **Node.js + Express + MongoDB backend** for seamless performance.

---

## ✨ Key Features

- 📄 **Upload & Parse** Experian XML reports  
- 📊 **Interactive Dashboard** showing accounts, balances, and enquiries  
- 🔍 **Search & Filter** across accounts and transactions  
- 🕒 **Recent Enquiries** displayed (last 7 days)  
- 🗑️ **Manage Reports**: delete or update uploaded reports  
- 💻 **Responsive UI** built with modern frameworks  
- 🌐 **Backend Hosted on Render**, frontend deployable on Vercel  
- 🧠 **MongoDB Database** for secure data storage  

---

## 🛠️ Tech Stack

| Layer       | Technology |
|------------|-------------|
| **Frontend** | Next.js 14, TypeScript, Tailwind CSS, Axios |
| **Backend** | Node.js, Express.js, Mongoose, dotenv |
| **Database** | MongoDB Atlas |
| **Hosting** | Render (Backend), Vercel (Frontend) |

---

## 📁 Project Structure

```

CreditSea/
├── backend/
│ ├── src/
│ │ ├── models/
│ │ │ └── Report.js
│ │ ├── routes/
│ │ │ └── reports.js
│ │ └── index.js
│ ├── .env # Environment variables
│ ├── package.json
│ └── ...
└── frontend/
├── app/
├── components/

```
---


---

## 🧑‍💻 Getting Started

Follow these steps to run **CreditSea locally**:

### 1️⃣ Prerequisites

Make sure you have installed:

- [Node.js](https://nodejs.org/) v18+  
- [npm](https://www.npmjs.com/) (comes with Node.js)  
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) account  

---

### 2️⃣ Clone the Repository

```bash
git clone https://github.com/shyam242/creditSea.git
cd creditSea

```
### 3️⃣ Backend Setup

```bash
cd backend
npm install

```

