# 🛡️ Insura - Comprehensive Insurance Management Platform

![Insura Banner](https://i.ibb.co.com/8LKZXt7f/Screenshot-2025-10-17-at-6-34-40-PM.png)

A full-stack insurance management system with role-based access, policy management, payment processing, and claim handling.

## 🚀 Live Demo & Repository

- **🌐 Live Site**: [https://assignment-12-client-d6f9a.web.app/](https://assignment-12-client-d6f9a.web.app/)
- **💻 Client Repository**: [https://github.com/apondatta11/Insura](https://github.com/apondatta11/Insura)
- **🔄 Server Repository**: [https://github.com/apondatta11/assignment-12-server]

## 🛠️ Tech Stack

**Frontend:**
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Firebase](https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)

**Backend:**
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)

**Payment & Services:**
![Stripe](https://img.shields.io/badge/Stripe-008CDD?style=for-the-badge&logo=stripe&logoColor=white)

## ✨ Key Features

- 🔐 **Multi-role System** (Admin, Merchant, Customer)
- 📋 **Policy Management & Applications**
- 💳 **Stripe Payment Integration**
- 🏥 **Claim Request Processing**
- 📝 **Blog Management System**
- 📊 **Real-time Transaction Tracking**
- 🔒 **Secure Authentication & Authorization**

## 🎯 Project Overview

Insura is a comprehensive insurance management platform that streamlines the entire insurance process from policy creation to claim settlement. The system supports multiple user roles with customized dashboards and functionalities.

## 🚧 Challenges & Solutions

### Technical Challenges:
- **Complex Role-based Access Control** - Implemented secure middleware for different user types
- **Stripe Payment Integration** - Created secure transaction flow with webhook handling
- **Policy State Management** - Developed efficient state management for application workflows
- **Real-time Updates** - Implemented real-time status tracking for claims and transactions

## 📦 Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB Atlas account
- Firebase account
- Stripe account

### Client Setup
```bash
# Clone the repository
git clone https://github.com/apondatta11/Insura.git
cd Insura

# Install dependencies
npm install

# Set up environment variables
# Create .env file with:
REACT_APP_API_URL=your_api_url
REACT_APP_STRIPE_PUBLISHABLE_KEY=your_stripe_key
REACT_APP_FIREBASE_CONFIG=your_firebase_config

# Run the application
npm start
