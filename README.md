# nouxer

A modern social network built with React — share posts, like, comment and
reply, bookmark, follow people, and get notified.

## ✨ Features

- 🔐 Auth — register, login, change password, upload profile photo
- 📝 Posts — create (text/image), edit, delete, share
- 👍 Engagement — like, comment, reply, like comments
- 🔖 Bookmarks — save posts and revisit them
- 👥 Social graph — follow/unfollow, suggestions, followers/following lists
- 🔔 Notifications — list, unread badge, mark one/all as read
- 🧭 Feed tabs — All, Following, My posts (+ "with image" filter)
- 🌙 Dark mode
- 🍞 Toasts and skeleton loaders

## 🧰 Tech Stack

- **React 19** + **React Router**
- **Tailwind CSS v4** + **shadcn/ui** (Radix primitives, `lucide-react`)
- **TanStack Query** — server state, caching and pagination
- **Axios** — HTTP client
- **React Hook Form** + **Zod** — forms & validation
- **react-hot-toast** — feedback

## 📁 Project Structure

```
src/
├── Api/            # One module per backend area + shared axios client
├── components/
│   ├── ui/                # shadcn/ui primitives
│   ├── common/            # avatar, follow button, user list, states
│   ├── post/              # PostCard, composer, comments, dialogs
│   ├── Layout/ Navbar/ Home/ Explore/ Bookmarks/ Notifications/ Profile/
│   └── Login/ Register/ NotFound/
├── context/        # token + dark mode providers
├── hooks/          # usePostActions (like/bookmark)
├── lib/            # cn() helper + formatting utilities
└── main.jsx        # app entry point
```

## ▶️ Getting Started

```bash
git clone <repository-url>
cd linked-Post
npm install
npm run dev
```

Open http://localhost:5173

## 📜 Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the Vite dev server |
| `npm run build` | Production build |
| `npm run preview` | Preview the production build |
| `npm run lint` | ESLint |
