<div align="center">

# 🔁 BuildLoop

### Feedback Exchange for Indie Makers

**Give feedback. Earn credits. Get real feedback on your product.**

[![Live Demo](https://img.shields.io/badge/Live%20Demo-buildloop--ten.vercel.app-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://buildloop-ten.vercel.app/)

![Next.js](https://img.shields.io/badge/Next.js-000000?style=flat-square&logo=nextdotjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=flat-square&logo=prisma&logoColor=white)
![Neon Postgres](https://img.shields.io/badge/Neon_Postgres-00E599?style=flat-square&logo=postgresql&logoColor=black)
![Vercel](https://img.shields.io/badge/Deployed_on-Vercel-000000?style=flat-square&logo=vercel&logoColor=white)

</div>

---

## 💡 About

**BuildLoop** is a community-powered feedback platform for apps, websites, and digital products. Indie makers often ship into silence — BuildLoop fixes that with a simple **credit-based economy**: you help other builders improve their work, and in return you earn the credits needed to get your own project in front of the community.

## ⚙️ How It Works

```
   ┌─────────────────┐      ┌─────────────────┐      ┌─────────────────┐
   │ 1. Give Feedback│ ───▶ │ 2. Earn Credits │ ───▶ │ 3. Boost Project│
   └─────────────────┘      └─────────────────┘      └─────────────────┘
            ▲                                                  │
            └──────────── more makers, more feedback ◀─────────┘
```

1. **Give Feedback** — Review projects on the Explore page. More detailed feedback earns more credits.
2. **Earn Credits** — Credits are BuildLoop's currency, earned by helping others improve.
3. **Boost Your Project** — Spend credits to submit your project and get featured on the front page.

## ✨ Features

- 🔐 **Secure authentication** — sign up / sign in, with protected routes that redirect back after login
- 🧭 **Explore** — browse community projects and leave structured feedback
- 🪙 **Credit economy** — earn credits for reviews, spend them to submit and boost projects
- 🚀 **Project submission** — share a project with its URL, description, and tech tags (e.g. `#nextjs #prisma #tailwind`)
- 🏆 **Leaderboard** — top contributors ranked by the feedback they give
- ⭐ **Featured builds** — hand-picked projects showcased on the landing page
- 📄 **Project pages** — dedicated page per project with its reviews
- 📱 **Responsive UI** with SEO / Open Graph metadata

## 🛠️ Tech Stack

| Layer | Technology |
| --- | --- |
| Framework | [Next.js](https://nextjs.org/) (App Router, `src/` directory) |
| Language | TypeScript |
| Styling | Tailwind CSS (PostCSS) |
| ORM | [Prisma](https://www.prisma.io/) |
| Database | [Neon](https://neon.tech/) serverless PostgreSQL |
| Auth | Credential-based auth with protected routes |
| Linting | ESLint |
| Hosting | [Vercel](https://vercel.com/) |

## 📁 Project Structure

```
buildloop/
├── .agents/
│   └── skills/
│       └── neon-postgres/     # AI agent skill for working with Neon Postgres
├── prisma/                    # Prisma schema & migrations
├── public/                    # Static assets
├── src/                       # Application source (App Router pages, components, lib)
├── .gitignore
├── AGENTS.md                  # Instructions for AI coding agents
├── CLAUDE.md                  # Instructions for Claude Code
├── README.md
├── eslint.config.mjs          # ESLint configuration
├── next.config.ts             # Next.js configuration
├── package.json
├── package-lock.json
├── pnpm-lock.yaml
├── postcss.config.mjs         # PostCSS / Tailwind configuration
├── prisma.config.ts           # Prisma configuration
├── skills-lock.json           # Locked agent skills
└── tsconfig.json              # TypeScript configuration
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- pnpm (or npm)
- A PostgreSQL database (a free [Neon](https://neon.tech/) project works well)

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/prajunbudathoki/buildloop.git
cd buildloop

# 2. Install dependencies
pnpm install

# 3. Set up environment variables
cp .env.example .env
```

### Environment Variables

Create a `.env` file in the project root:

```env
# Neon / PostgreSQL connection string
DATABASE_URL="postgresql://USER:PASSWORD@HOST/DATABASE?sslmode=require"

# Auth
AUTH_SECRET="your-random-secret"
NEXTAUTH_URL="http://localhost:3000"
```

### Database Setup

```bash
# Generate the Prisma client
pnpm prisma generate

# Apply the schema to your database
pnpm prisma migrate dev
```

### Run Locally

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📜 Scripts

| Command | Description |
| --- | --- |
| `pnpm dev` | Start the development server |
| `pnpm build` | Build for production |
| `pnpm start` | Run the production build |
| `pnpm lint` | Run ESLint |

## 🗺️ Roadmap

- [ ] Feedback quality scoring for fairer credit rewards
- [ ] Notifications when your project receives feedback
- [ ] Categories and search filters on Explore
- [ ] Maker profiles with project history

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

1. Fork the project
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m "Add amazing feature"`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 👤 Author

**Prajun Budhathoki** — Full Stack Web Developer

- GitHub: [@prajunbudathoki](https://github.com/prajunbudathoki)
- Live project: [buildloop-ten.vercel.app](https://buildloop-ten.vercel.app/)

---

<div align="center">

**Built for builders, by Prajun.** If you find BuildLoop useful, give it a ⭐!

</div>
