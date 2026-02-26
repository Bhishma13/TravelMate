# TravelMate 🌍

TravelMate is a full-stack web application designed to seamlessly connect local tour guides with travelers. Whether you're a traveler looking for an authentic local experience, or a passionate local guide offering your services, TravelMate brings you together.

## 🚀 Features

### For Travelers
* **Browse Local Guides:** View available guides and discover authentic experiences.
* **Location Search:** Quickly filter guides by specific cities or travel destinations.
* **Travel Profile Setup:** Input your desired location, dates, budget, and what kind of trip you are requesting.

### For Guides
* **Find Travelers:** Browse travelers heading to your location and offer your expertise.
* **Guide Profile:** Showcase your location, years of experience, bio, and ratings.
* **Targeted Search:** Filter incoming travelers by the specific city you guide in.

### Technical & System Features
* **Role-Based Dashboards:** Dynamically render unique UI dashboards for 'Guide' or 'Traveler' accounts.
* **Pagination:** Efficient backend data chunking ensures the dashboard loads blazingly fast even with thousands of users.
* **JWT & API Security:** Authentication flow and robust CORS configurations safely bridge the frontend and backend.

## 🛠️ Tech Stack

### Frontend (React + Vite)
* **Framework:** React.js powered by Vite for lightning-fast builds
* **Routing:** React Router DOM (v6)
* **State Management:** React Context API (`AuthContext`)
* **Styling:** Custom CSS with a sleek, responsive design and gradient aesthetics

### Backend (Spring Boot + Java)
* **Framework:** Spring Boot 3.4
* **Language:** Java 17
* **Database:** H2 In-Memory Database (Fast, zero-config local development)
* **Data Access:** Spring Data JPA / Hibernate
* **REST APIs:** Spring Web MVC

---

## 💻 Running the App Locally

To test TravelMate out on your own machine, follow these simple steps to run the backend server and frontend client.

### Prerequisites
* **Node.js** (v18+)
* **Java** (JDK 17+)
* **Maven** (optional, the project includes a `mvnw` wrapper)

### 1. Start the Spring Boot Backend
The backend runs on `localhost:8080`.

```bash
# Navigate to the backend directory
cd backend

# Build and start the Spring Boot application using the Maven wrapper
./mvnw spring-boot:run
```

### 2. Start the React Frontend
The frontend runs on `localhost:5173`.

```bash
# Open a new terminal window/tab and navigate to the frontend directory
cd frontend

# Install Node dependencies
npm install

# Start the Vite development server
npm run dev
```

## 📸 Screenshots

*(Feel free to upload screenshots to your `assets` folder and include them here to show off your UI!)*

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Build out new profile fields, wire up a real PostgreSQL production database, or add a direct messaging system. The sky is the limit!

---
*Built with ❤️ for better travel experiences.*
