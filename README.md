# HeroAuth - Next.js Authentication Starter Kit

The ultimate Next.js starter kit with secure authentication, modern UI, and production-ready architecture.

## Features

### 🔐 **Complete Authentication System**

- Email/Password authentication with NextAuth.js
- OAuth integration (Google ready, Facebook & GitHub placeholders)
- Email verification flow
- Password reset functionality
- Protected routes and role-based access control

### 🛡️ **Security First**

- Cloudflare Turnstile bot protection
- Rate limiting on authentication routes
- Secure password hashing with bcrypt
- Environment variable validation
- Security headers via middleware
- Input sanitization
- MongoDB injection protection

### 🎨 **Modern UI**

- Built with HeroUI (NextUI fork) components
- TailwindCSS 4 for styling
- Dark/Light mode support
- Fully responsive design
- Clean and intuitive interface

### 📧 **Email Integration**

- Email verification on signup
- Password reset emails
- Contact form
- Powered by Resend

### 🗄️ **Database**

- MongoDB with Mongoose ODM
- Optimized indexes for performance
- Proper schema validation

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **UI Library**: HeroUI, TailwindCSS 4
- **Authentication**: NextAuth.js
- **Database**: MongoDB
- **Email**: Resend
- **Security**: Cloudflare Turnstile
- **Language**: JavaScript

## Getting Started

### Prerequisites

- Node.js 16+
- MongoDB database
- Resend API key
- Cloudflare Turnstile keys
- Google OAuth credentials (optional)

### Installation

1. Clone the repository

```bash
git clone https://github.com/rironib/herouiauth.git
cd herouiauth
```

2. Install dependencies

```bash
yarn install
```

3. Set up environment variables

```bash
cp .env.example .env.local
```

Edit `.env.local` with your credentials:

```env
# Database
DB_URI=your_mongodb_connection_string

# NextAuth
NEXTAUTH_SECRET=your_secret_key_min_32_chars
NEXTAUTH_URL=http://localhost:3000

# Cloudflare Turnstile
NEXT_PUBLIC_TURNSTILE_SITE_KEY=your_site_key
TURNSTILE_SECRET_KEY=your_secret_key

# Email (Resend)
RESEND_API_KEY=your_resend_api_key
EMAIL_FROM=YourApp <no-reply@yourdomain.com>

# Google OAuth (optional)
GOOGLE_ID=your_google_client_id
GOOGLE_SECRET=your_google_client_secret

# Site Configuration
NEXT_PUBLIC_SITENAME=HeroAuth
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

4. Run the development server

```bash
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) to see your app.

## Project Structure

```
herouiauth/
├── app/
│   ├── (app)/              # Public pages
│   │   ├── page.js         # Homepage
│   │   └── (page)/         # Additional pages (about, contact, etc.)
│   ├── api/                # API routes
│   │   └── (auth)/         # Authentication APIs
│   ├── auth/               # Auth pages (login, register, etc.)
│   ├── dashboard/          # Protected dashboard
│   └── layout.js           # Root layout
├── components/             # Reusable components
│   └── ui/                 # UI components
├── config/                 # Configuration files
├── lib/                    # Utility functions
├── models/                 # Mongoose models
└── public/                 # Static assets
```

## Available Routes

### Public Routes

- `/` - Homepage
- `/auth/login` - Login page
- `/auth/register` - Sign up page
- `/auth/forgot` - Forgot password
- `/auth/reset` - Reset password
- `/auth/verify` - Email verification
- `/about` - About page
- `/contact` - Contact form

### Protected Routes

- `/dashboard` - User dashboard
- `/admin` - Admin panel (admin only)

## Security Features

- **Rate Limiting**: Prevents brute force attacks (5 attempts/minute)
- **Password Requirements**: 8+ characters, uppercase, lowercase, number, special character
- **Email Verification**: Required before login
- **Secure Tokens**: Cryptographically secure tokens for reset/verification
- **Bot Protection**: Cloudflare Turnstile integration
- **Security Headers**: X-Frame-Options, CSP, etc.
- **Input Sanitization**: XSS prevention
- **Select False Fields**: Sensitive fields hidden by default in queries

## Environment Variables

See `.env.example` for all required variables. The app validates environment variables on startup.

## Deployment

### Build for Production

```bash
yarn build
yarn start
```

### Deployment Platforms

This starter kit works with:

- Vercel (recommended)
- Netlify
- Railway
- DigitalOcean App Platform
- Any Node.js hosting

### Pre-deployment Checklist

- [ ] Set `NODE_ENV=production`
- [ ] Configure production database
- [ ] Update `NEXT_PUBLIC_BASE_URL` and `NEXTAUTH_URL`
- [ ] Use strong `NEXTAUTH_SECRET` (32+ chars)
- [ ] Configure production email provider
- [ ] Set up Cloudflare Turnstile for production domain
- [ ] Enable HTTPS
- [ ] Review SECURITY.md

## Customization

### Change Site Name

Update `NEXT_PUBLIC_SITENAME` in `.env.local` and `config/site.js`

### Add New Pages

Create files in `app/(app)/(page)/` and update navigation in `components/ui/Header.js`

### Styling

- Global styles: `app/globals.css`
- Tailwind config: `tailwind.config.mjs`
- HeroUI theme: Configured in `app/providers.js`

### Database Models

Add new models in `models/` directory following the User/Contact pattern

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - feel free to use this starter kit for your projects.

## Support

- Documentation: See individual files for inline documentation
- Issues: [GitHub Issues](https://github.com/rironib/herouiauth/issues)
- Security: See SECURITY.md

## Credits

Built with ❤️ by RONiB

## Acknowledgments

- Next.js team for the amazing framework
- HeroUI for beautiful components
- NextAuth.js for authentication
- Cloudflare for Turnstile
- Resend for email delivery
