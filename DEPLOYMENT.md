# Deployment Guide for TomaAI

This guide will help you deploy your TomaAI application to various platforms.

## Prerequisites

- Your Supabase project is set up and configured
- Database schema has been applied
- Environment variables are ready

## Deployment Options

### 1. Vercel (Recommended)

Vercel is the easiest way to deploy React applications with automatic deployments from GitHub.

#### Steps:

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Connect to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Sign in with GitHub
   - Click "New Project"
   - Import your repository

3. **Configure Environment Variables**
   In Vercel dashboard, go to Settings > Environment Variables and add:
   ```
   VITE_SUPABASE_URL=https://your-project-url.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key-here
   ```

4. **Deploy**
   - Click "Deploy"
   - Your app will be available at `https://your-app.vercel.app`

### 2. Netlify

#### Steps:

1. **Build the project**
   ```bash
   npm run build
   ```

2. **Deploy to Netlify**
   - Go to [netlify.com](https://netlify.com)
   - Drag and drop the `dist` folder
   - Or connect your GitHub repository

3. **Add Environment Variables**
   In Netlify dashboard, go to Site Settings > Environment Variables

4. **Configure Build Settings**
   - Build command: `npm run build`
   - Publish directory: `dist`

### 3. GitHub Pages

#### Steps:

1. **Install gh-pages**
   ```bash
   npm install --save-dev gh-pages
   ```

2. **Add deploy script to package.json**
   ```json
   "scripts": {
     "deploy": "gh-pages -d dist"
   }
   ```

3. **Build and deploy**
   ```bash
   npm run build
   npm run deploy
   ```

### 4. Railway

#### Steps:

1. **Connect to Railway**
   - Go to [railway.app](https://railway.app)
   - Connect your GitHub repository

2. **Configure Environment Variables**
   Add your Supabase credentials in the Railway dashboard

3. **Deploy**
   Railway will automatically detect it's a Vite project and deploy

## Post-Deployment Checklist

- [ ] Environment variables are set correctly
- [ ] Supabase database is accessible
- [ ] Authentication is working
- [ ] Image generation is functional
- [ ] User registration/login works
- [ ] Images are being saved to database

## Troubleshooting

### Common Issues:

1. **Environment Variables Not Loading**
   - Ensure variables start with `VITE_`
   - Check spelling and case sensitivity
   - Redeploy after adding variables

2. **Supabase Connection Issues**
   - Verify your project URL and anon key
   - Check if RLS policies are set up correctly
   - Ensure database tables exist

3. **Build Errors**
   - Run `npm run type-check` to check for TypeScript errors
   - Run `npm run lint` to check for linting issues
   - Ensure all dependencies are installed

4. **Authentication Not Working**
   - Check Supabase Auth settings
   - Verify email confirmation is set up correctly
   - Check browser console for errors

## Performance Optimization

### For Production:

1. **Enable Gzip Compression**
   - Most hosting platforms do this automatically

2. **Optimize Images**
   - Use WebP format when possible
   - Implement lazy loading

3. **Enable Caching**
   - Set appropriate cache headers
   - Use CDN for static assets

4. **Monitor Performance**
   - Use Vercel Analytics or similar
   - Monitor Core Web Vitals

## Security Considerations

1. **Environment Variables**
   - Never commit `.env` files
   - Use different keys for development/production

2. **Supabase Security**
   - Review RLS policies
   - Limit API access
   - Monitor usage

3. **HTTPS**
   - Ensure all connections use HTTPS
   - Update Supabase settings for production domain

## Monitoring

1. **Error Tracking**
   - Consider adding Sentry or similar
   - Monitor console errors

2. **Analytics**
   - Add Google Analytics or similar
   - Track user engagement

3. **Uptime Monitoring**
   - Use services like UptimeRobot
   - Set up alerts for downtime

## Support

If you encounter issues during deployment:

1. Check the browser console for errors
2. Verify all environment variables are set
3. Test locally with production environment variables
4. Check Supabase logs for database issues
5. Review hosting platform logs

For additional help, create an issue in the GitHub repository.
