# Chess Game Deployment Guide

## 🚀 Quick Deployment Options

### Option 1: Netlify (Recommended)

1. **Connect to GitHub:**
   - Go to [netlify.com](https://netlify.com)
   - Sign up/login with GitHub
   - Click "New site from Git"
   - Select your repository: `giteshivam18/chessmasterdev`
   - Choose the branch: `main`
   - Set the base directory: `chess-game`

2. **Build Settings:**
   - Build command: `npm run build`
   - Publish directory: `chess-game/dist`
   - Node version: `18`

3. **Deploy:**
   - Click "Deploy site"
   - Your site will be available at `https://your-site-name.netlify.app`

### Option 2: Vercel

1. **Install Vercel CLI:**
   ```bash
   npm i -g vercel
   ```

2. **Deploy:**
   ```bash
   cd chess-game
   vercel
   ```

3. **Follow the prompts:**
   - Link to existing project: No
   - Project name: chess-game
   - Directory: `./chess-game`

### Option 3: GitHub Pages

1. **Install gh-pages:**
   ```bash
   npm install --save-dev gh-pages
   ```

2. **Add to package.json:**
   ```json
   "scripts": {
     "predeploy": "npm run build",
     "deploy": "gh-pages -d dist"
   }
   ```

3. **Deploy:**
   ```bash
   npm run deploy
   ```

## 🔧 Environment Variables

Create a `.env` file in the `chess-game` directory:

```env
VITE_SOCKET_URL=wss://your-backend-url.com
VITE_API_URL=https://your-api-url.com
```

## 📁 Build Output

The build creates a `dist/` folder with:
- `index.html` - Main HTML file
- `assets/` - CSS and JS bundles
- `pieces/` - Chess piece images
- `sounds/` - Audio files
- `themes/` - Board theme assets

## 🌐 Custom Domain

1. **Netlify:**
   - Go to Site settings > Domain management
   - Add your custom domain
   - Update DNS records

2. **Vercel:**
   - Go to Project settings > Domains
   - Add your custom domain
   - Update DNS records

## 🔄 Continuous Deployment

Both Netlify and Vercel support automatic deployments:
- Push to `main` branch → Automatic deployment
- Pull requests → Preview deployments

## 🐛 Troubleshooting

### 404 Errors
- Ensure `_redirects` file is in `public/` folder
- Check that `netlify.toml` is in the root of `chess-game/`
- Verify build output in `dist/` folder

### Build Failures
- Check Node.js version (requires 18+)
- Run `npm install` to ensure dependencies are installed
- Check for TypeScript errors with `npm run build`

### Routing Issues
- Ensure React Router is properly configured
- Check that all routes are defined in `App.tsx`
- Verify `_redirects` file for SPA routing

## 📊 Performance Optimization

1. **Enable Gzip compression** (automatic on Netlify/Vercel)
2. **Set up CDN** for static assets
3. **Optimize images** in `public/pieces/` and `public/themes/`
4. **Add service worker** for offline functionality

## 🔒 Security

1. **Environment variables** - Never commit sensitive data
2. **HTTPS** - Automatic on Netlify/Vercel
3. **CORS** - Configure backend to allow your domain
4. **Content Security Policy** - Add CSP headers if needed

## 📱 Mobile Optimization

The app is already responsive, but ensure:
- Touch events work on mobile devices
- Viewport meta tag is set correctly
- PWA manifest is configured (optional)

## 🎯 Next Steps

1. **Deploy the frontend** using one of the options above
2. **Set up the backend** for real-time multiplayer
3. **Configure environment variables** for production
4. **Add actual assets** (sounds, piece images)
5. **Set up monitoring** and analytics