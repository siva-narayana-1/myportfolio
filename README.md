# 🎯 Professional Portfolio System

A full-stack, production-ready portfolio application with a beautiful website, powerful admin dashboard, and PostgreSQL database backend.

## ✨ Features

- **Beautiful Portfolio Website** - Modern, responsive design with smooth animations
- **Admin Dashboard** - Manage all portfolio content with ease
- **Separate Frontend & Backend** - Clean architecture for scalability
- **PostgreSQL Database** - Reliable data persistence with 8 tables
- **JWT Authentication** - Secure admin access
- **CORS Enabled** - Cross-origin request support
- **Production Ready** - Optimized for deployment

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Initialize database
npm run db:init

# Start development servers
npm run dev
```

Then open:
- **Website**: http://localhost:3000
- **Admin**: http://localhost:3000/admin/login
- **API**: http://localhost:5000

**Login with:**
```
Email:    admin@portfolio.com
Password: admin123
```

## 📁 Project Structure

```
portfolio/
├── frontend/               React + Next.js (Port 3000)
│   ├── src/              React code & components
│   ├── public/           Static assets
│   └── package.json
├── backend/              Express API (Port 5000)
│   ├── api.js            API routes & logic
│   └── package.json
├── prisma/               Database schema
├── scripts/              Setup utilities
├── .env.local            Configuration
└── package.json          Root coordinator
```

## 🔌 Architecture

```
Frontend (3000) ←CORS→ Backend (5000) ←→ PostgreSQL Database
  React            Express             44.222.126.134:1235
```

## 📋 Available Commands

```bash
npm run dev              # Start both servers
npm run dev:frontend     # Frontend only (port 3000)
npm run dev:backend      # Backend only (port 5000)
npm run db:init          # Initialize database
npm run build            # Build for production
npm run start            # Start production build
```

## 📚 Admin Dashboard

Manage your portfolio content:
- **Profile** - Your bio, photo, social links
- **Projects** - Add your work with images and tech stack
- **Skills** - Organize by category
- **Experience** - Work history and achievements
- **Education** - Degrees and certifications
- **Messages** - Contact form submissions
- **Settings** - Site configuration

## 🗄️ Database

**PostgreSQL Configuration:**
- Host: `44.222.126.134`
- Port: `1235`
- Database: `portfolio_db`
- User: `i_track`

**Tables:** Admin, Profile, Project, Skill, Experience, Education, ContactMessage, SiteSettings

## 🔐 Security

Before deployment:
1. Change `JWT_SECRET` in `.env.local`
2. Change admin credentials
3. Update `NEXT_PUBLIC_API_URL` to production domain
4. Set `NODE_ENV=production`

## 📚 Documentation

- **START_HERE.md** - Quick start guide
- **QUICK_REF.md** - Quick command reference
- **AGENTS.md** - Project instructions
- **CLAUDE.md** - Development notes

## 🎨 Customization

- **Colors**: Edit `frontend/src/globals.css`
- **Layout**: Modify components in `frontend/src/components/`
- **Branding**: Update in admin dashboard

## 🚢 Deployment

### Frontend (Vercel)
```bash
cd frontend
npm run build
vercel deploy
```

### Backend (Heroku/Railway)
Set environment variables and deploy:
```
DATABASE_URL=postgresql://...
JWT_SECRET=your-secret-key
```

## 🆘 Troubleshooting

- **Backend won't start**: Check if port 5000 is in use
- **Can't connect to DB**: Verify DATABASE_URL in .env.local
- **Admin login fails**: Ensure backend is running, check console errors

## 📝 License

Open source and available under MIT License.

---

**Read START_HERE.md for detailed instructions. Your portfolio is ready to build!** 🎉
