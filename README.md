🔗 Linked Post App

A modern, social media–style web application built with React that allows users to share posts, engage through comments, and manage their profiles with a clean and responsive UI.

⸻

🌐 Live Demo

👉 Live Preview: https://linked-post-seven.vercel.app

⸻

📖 Overview

Linked Post App is a frontend-focused project designed to simulate the core features of a social networking platform. It demonstrates real-world usage of modern React patterns, efficient state management, authentication handling, and API integration.

The main goal of this project is learning by building — applying best practices while keeping the codebase clean, scalable, and easy to understand.

⸻

✨ Key Features
	•	🔐 User authentication (Register / Login / Logout)
	•	📝 Create, edit, and delete posts
	•	💬 Comment on posts
	•	👤 User profile page
	•	🌙 Dark mode support
	•	🔔 Toast notifications for user feedback
	•	🔒 Protected routes & actions

⸻

🧰 Tech Stack
	•	React.js – Component-based UI
	•	React Router DOM – Client-side routing
	•	Tailwind CSS – Utility-first styling
	•	TanStack React Query – Server state management
	•	Axios – HTTP requests
	•	Context API – Global state handling
	•	JWT Authentication – Secure user sessions
	•	Vercel – Deployment & hosting

⸻

📁 Project Structure

src/
├── Api/          # API requests & services
├── assets/       # Images & static files
├── components/   # Reusable UI components
├── context/      # Global context providers
├── pages/        # Application pages
├── routes/       # Route definitions
└── main.jsx      # App entry point


⸻

🔐 Authentication Flow
	•	JWT token is stored after successful login
	•	Protected routes prevent unauthorized access
	•	Only authenticated users can:
	•	Create posts
	•	Edit or delete their own posts
	•	Add comments

⸻

▶️ Getting Started (Local Setup)

Clone the repository and run the project locally:

git clone <repository-url>
cd linked-post
npm install
npm run dev

Open your browser at:

http://localhost:5173


⸻

🖼️ Screenshots
	•	Login Page
	•	Register Page
	•	Home Feed (Posts)
	•	User Profile Page

⸻

⚠️ Important Notes
	•	This is a frontend-only application
	•	It relies on an external API for data
	•	Built strictly for learning and practice purposes

⸻

👨‍💻 Author

Developed as a hands-on project to practice modern frontend development with React.

⸻

🙌 Acknowledgments

Special thanks to the open-source community and the libraries that made this project possible.

⭐ If you find this project helpful, feel free to give it a star!
