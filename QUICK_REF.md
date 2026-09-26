# ⚡ QUICK REFERENCE

## 🚀 START
```bash
npm run dev
```

## 🌐 URLS
| Service | URL |
|---------|-----|
| Website | http://localhost:3000 |
| Admin | http://localhost:3000/admin/login |
| API | http://localhost:5000 |

## 🔑 LOGIN
```
Email:    admin@portfolio.com
Password: admin123
```

## 🗄️ DATABASE
```
Host: 44.222.126.134
Port: 1235
DB: portfolio_db
User: i_track
Pass: mypassword123
```

## ⚙️ .env.local
```env
DATABASE_URL="postgresql://i_track:mypassword123@44.222.126.134:1235/portfolio_db"
FRONTEND_PORT="3000"
BACKEND_PORT="5000"
NEXT_PUBLIC_API_URL="http://localhost:5000"
```

## 📋 COMMANDS
```bash
npm run dev              # Both servers
npm run dev:frontend     # Frontend only
npm run dev:backend      # Backend only
npm run db:init          # Init database
npm run build            # Build prod
npm run start            # Start prod
```

## 📁 STRUCTURE
```
portfolio/
├── server/api.js        (Backend - Port 5000)
├── src/                 (Frontend - Port 3000)
├── prisma/              (Database schema)
└── .env.local           (Config)
```

## 🔌 PORTS
- **3000** = Frontend + Admin
- **5000** = Backend API
- **1235** = Database

## 📊 TABLES
Admin | Profile | Project | Skill | Experience | Education | ContactMessage | SiteSettings

## 🎯 SETUP CHECKLIST
- [x] Database configured
- [x] Backend API built
- [x] Frontend built
- [x] Admin dashboard built
- [x] CORS configured
- [x] Authentication ready
- [ ] Run `npm run dev`
- [ ] Add your content
- [ ] Deploy

## 🚀 TO START NOW
```bash
npm run dev
```
Then visit: http://localhost:3000

## 💡 QUICK TIPS
1. Frontend fetches from backend on port 5000
2. CORS already configured
3. Database auto-connects
4. JWT tokens for admin auth
5. Everything is dynamic (no static content)

**That's all you need to know!** 🎉
