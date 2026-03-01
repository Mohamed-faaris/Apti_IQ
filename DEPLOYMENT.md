# Deployment Guide

## Quick Deploy Options

### 1. Vercel (Recommended - Easiest)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

Or use the Vercel dashboard:
1. Import your GitHub repository
2. Vercel auto-detects Vite
3. Deploy!

### 2. Netlify

```bash
# Install Netlify CLI
npm i -g netlify-cli

# Build
npm run build

# Deploy
netlify deploy --prod --dir=dist
```

Or drag-and-drop the `dist` folder to Netlify dashboard.

### 3. AWS S3 + CloudFront

#### Step 1: Build the project
```bash
npm run build
```

#### Step 2: Create S3 Bucket
```bash
aws s3 mb s3://aptiq-frontend
aws s3 website s3://aptiq-frontend --index-document index.html --error-document index.html
```

#### Step 3: Upload files
```bash
aws s3 sync dist/ s3://aptiq-frontend --acl public-read
```

#### Step 4: Create CloudFront Distribution
1. Go to AWS CloudFront console
2. Create distribution
3. Origin: Your S3 bucket
4. Default root object: `index.html`
5. Error pages: 404 → /index.html (for SPA routing)

#### Step 5: Configure Custom Domain (Optional)
1. Add CNAME record in Route 53
2. Request SSL certificate in ACM
3. Attach to CloudFront distribution

### 4. GitHub Pages

Add to `package.json`:
```json
{
  "homepage": "https://yourusername.github.io/aptiq",
  "scripts": {
    "predeploy": "npm run build",
    "deploy": "gh-pages -d dist"
  }
}
```

Install gh-pages:
```bash
npm install --save-dev gh-pages
```

Deploy:
```bash
npm run deploy
```

Update `vite.config.ts`:
```typescript
export default defineConfig({
  base: '/aptiq/', // Your repo name
  plugins: [react()],
})
```

## Environment Variables

For production, set:
```
VITE_API_URL=https://your-backend-api.com/api
```

### Vercel
Add in dashboard: Settings → Environment Variables

### Netlify
Add in dashboard: Site settings → Environment variables

### AWS
Store in Parameter Store or Secrets Manager, inject during build

## Build Optimization

### 1. Analyze Bundle Size
```bash
npm run build -- --mode analyze
```

### 2. Enable Compression
Most platforms (Vercel, Netlify) auto-enable gzip/brotli.

For S3, enable in CloudFront:
- Compress objects automatically: Yes

### 3. Cache Headers
CloudFront:
- HTML: no-cache
- JS/CSS: max-age=31536000 (1 year)
- Images: max-age=31536000

## Performance Checklist

- ✅ Code splitting (admin, analytics lazy loaded)
- ✅ Image optimization (use WebP)
- ✅ Minification (Vite handles this)
- ✅ Tree shaking (Vite handles this)
- ✅ CDN distribution (CloudFront/Vercel Edge)
- ✅ HTTP/2 enabled
- ✅ Compression enabled

## Monitoring

### Vercel Analytics
Enable in dashboard for free analytics.

### Google Analytics
Add to `index.html`:
```html
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

## Troubleshooting

### Issue: 404 on refresh
**Solution**: Configure rewrites to serve `index.html` for all routes.

Vercel: Already configured in `vercel.json`

Netlify: Create `_redirects` file:
```
/*    /index.html   200
```

S3: Set error document to `index.html`

### Issue: Environment variables not working
**Solution**: Ensure variables start with `VITE_` prefix.

### Issue: Large bundle size
**Solution**: 
- Check for duplicate dependencies
- Use dynamic imports for heavy libraries
- Analyze with `vite-bundle-visualizer`

## Security Headers

Add to hosting platform:

```
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: geolocation=(), microphone=(), camera=()
```

Vercel: Add to `vercel.json`
Netlify: Add to `netlify.toml`
CloudFront: Add via Lambda@Edge

## CI/CD

### GitHub Actions Example

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
      - run: npm ci
      - run: npm run build
      - uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
```

## Cost Estimation

### Vercel (Hobby)
- Free for personal projects
- 100GB bandwidth/month
- Unlimited deployments

### Netlify (Free)
- 100GB bandwidth/month
- 300 build minutes/month

### AWS (Pay-as-you-go)
- S3: ~$0.023/GB storage
- CloudFront: ~$0.085/GB transfer
- Estimated: $5-20/month for small traffic

## Post-Deployment

1. Test all routes
2. Check mobile responsiveness
3. Verify environment variables
4. Test authentication flow
5. Monitor performance (Lighthouse)
6. Set up error tracking (Sentry)

## Rollback

### Vercel/Netlify
Use dashboard to rollback to previous deployment.

### AWS
Keep versioning enabled on S3, restore previous version.

---

For questions, check platform-specific documentation or open an issue.
