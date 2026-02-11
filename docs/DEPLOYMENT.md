# Deployment Guide for LumOS

## Prerequisites

### System Requirements
- Node.js >= 18.0.0
- Rust >= 1.70.0
- PostgreSQL 14+ (via Supabase recommended)
- 2GB RAM minimum
- 10GB disk space

### Accounts Needed
- Vercel account (for frontend)
- Render account (for backend)
- Supabase account (for database)

## Step 1: Database Setup (Supabase)

1. Create a new Supabase project
2. Navigate to SQL Editor
3. Run the schema from `database/schema.sql`
4. Note your connection string and API keys
5. Update environment variables

## Step 2: Backend Deployment (Render)

1. Connect your GitHub repository to Render
2. Create a new Web Service
3. Select Rust environment
4. Set build command: `cargo build --release`
5. Set start command: `./target/release/lumos_backend`
6. Add environment variables from .env.example
7. Deploy

## Step 3: Frontend Deployment (Vercel)

1. Import project to Vercel
2. Set root directory to `frontend`
3. Framework preset: Next.js
4. Add environment variables:
   - NEXT_PUBLIC_API_URL (your Render backend URL)
   - NEXT_PUBLIC_SUPABASE_URL
   - NEXT_PUBLIC_SUPABASE_ANON_KEY
5. Deploy

## Step 4: Post-Deployment Configuration

1. Update CORS settings on backend to allow your frontend domain
2. Test authentication endpoints
3. Verify database connectivity
4. Test network tools (may require additional setup)
5. Configure SSH keys if using SSH functionality

## Security Checklist

- [ ] Change default admin credentials
- [ ] Set strong JWT secret
- [ ] Enable HTTPS only
- [ ] Configure rate limiting
- [ ] Set up monitoring and logging
- [ ] Review and restrict network tool access
- [ ] Configure firewall rules
- [ ] Enable database backup
- [ ] Set up error tracking (Sentry recommended)
- [ ] Review all environment variables

## Monitoring

Recommended monitoring services:
- Vercel Analytics for frontend
- Render metrics for backend
- Supabase dashboard for database
- Uptime monitoring (UptimeRobot, Pingdom)

## Troubleshooting

### Backend won't start
- Check Rust version compatibility
- Verify all dependencies are installed
- Check environment variables
- Review logs in Render dashboard

### Frontend build fails
- Verify Node.js version
- Check package.json dependencies
- Ensure Next.js config is correct
- Review build logs

### Database connection fails
- Verify connection string format
- Check Supabase project status
- Ensure IP is allowed in Supabase settings
- Verify credentials

### Network tools not working
- Some tools require root access
- May need Docker container with privileges
- Check Render plan limitations
- Verify tools are installed in container

## Performance Optimization

1. Enable caching for compilation results
2. Use connection pooling for database
3. Implement CDN for static assets
4. Enable gzip compression
5. Optimize images
6. Use production builds only

## Scaling Considerations

- Frontend: Vercel scales automatically
- Backend: Upgrade Render plan as needed
- Database: Monitor connection pool usage
- Consider Redis for session management at scale

## Support

For deployment issues, consult:
- Vercel documentation: https://vercel.com/docs
- Render documentation: https://render.com/docs
- Supabase documentation: https://supabase.com/docs
