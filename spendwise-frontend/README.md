# SpendWise Frontend

This is the **frontend** of SpendWise, a personal expense tracker application. It allows users to track their daily expenses, set a daily spending limit, view weekly summaries, and more.

---

## 🛠 Tech Stack

- **React.js** (with Vite or Create React App)
- **Zustand** for state management
- **React Router DOM** for routing
- **Axios** for HTTP requests
- **Tailwind CSS** (or your CSS framework)
- **React Toastify** for notifications

---

## 📦 Installation

1. **Clone the repo**
   ```bash
   git clone https://github.com/yourusername/spendwise-frontend.git
   cd spendwise-frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

---

## 🌐 API Base URL

All requests are made to the backend at:

```
https://your-backend-api.com/api
```

Make sure the backend server is running and CORS is properly configured.

---

## 📁 Project Structure

```
src/
│
├── components/         # Reusable UI components
├── pages/              # Page-level components
├── store/              # Zustand store setup
├── utils/              # Utility functions
├── api/                # Axios instance and API calls
├── App.jsx             # Main App component
├── main.jsx            # Entry point
└── index.css           # Global styles
```

---

## 🔐 Authentication

- Uses HTTP-only cookies for token management.
- Protected routes redirect unauthenticated users to `/login`.

---

## ✨ Features

- ✅ Register & Login
- ✅ Track expenses by day
- ✅ Daily limit warning
- ✅ Weekly summary toggle
- ✅ Currency selection
- ✅ User profile & settings
- ✅ Responsive UI

---


## 🧪 Testing

You can test using local mock data or connect to the real backend.

---



## 🙋‍♀️ Contributing

Pull requests and feature ideas are welcome! Please fork the repo and open a PR.
