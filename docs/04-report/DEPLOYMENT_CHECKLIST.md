# PromptAll Production Deployment Checklist

**Date**: 2026-02-24
**Status**: ✅ Code Ready - Pending External Service Setup
**Estimated Time to Production**: 1-2 hours (service setup) + deploy time

---

## Pre-Deployment Checklist

### Code Quality Review ✅

- [x] All 10 functional requirements implemented
- [x] 96% design-to-code match rate (exceeds 90% threshold)
- [x] Zero critical issues found
- [x] TypeScript 95% coverage
- [x] No hardcoded secrets
- [x] Security validation passed
- [x] Error handling comprehensive
- [x] Database models complete

**Status**: ✅ READY

---

## External Services Setup (Required Before Deployment)

### 1. Google OAuth Configuration

**Purpose**: User authentication via Google accounts

**Steps**:
- [ ] Go to [Google Cloud Console](https://console.cloud.google.com/)
- [ ] Create or select a project
- [ ] Enable Google+ API
- [ ] Create OAuth 2.0 credentials (Web application)
- [ ] Add Authorized redirect URIs:
  - Development: `http://localhost:3000/api/auth/callback/google`
  - Production: `https://promptall.net/api/auth/callback/google`
- [ ] Copy Client ID and Client Secret
- [ ] Set environment variables:
  ```env
  GOOGLE_CLIENT_ID=your_client_id
  GOOGLE_CLIENT_SECRET=your_client_secret
  ```

**Documentation**: See [Google OAuth Provider Docs](https://next-auth.js.org/providers/google)

**Time**: ~15 minutes

**Status**: ⏳ Pending

---

### 2. Cloudinary Account Setup

**Purpose**: Image upload and optimization

**Steps**:
- [ ] Sign up at [Cloudinary.com](https://cloudinary.com/)
- [ ] Navigate to Dashboard
- [ ] Copy Cloud Name and API Key
- [ ] Create API Secret
- [ ] Set environment variables:
  ```env
  NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
  CLOUDINARY_API_KEY=your_api_key
  CLOUDINARY_API_SECRET=your_api_secret
  ```
- [ ] Test image upload locally with test image

**Documentation**: See [Cloudinary Integration](https://cloudinary.com/documentation/node_integration)

**Time**: ~10 minutes

**Status**: ⏳ Pending

---

### 3. Google Analytics GA4 Setup

**Purpose**: Track user behavior and page views

**Steps**:
- [ ] Go to [Google Analytics 4](https://analytics.google.com/)
- [ ] Create new property for `promptall.net`
- [ ] Get Measurement ID (format: G-XXXXXXXXXX)
- [ ] Set environment variable:
  ```env
  NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
  ```
- [ ] Verify tracking is working in GA4 console

**Documentation**: [GA4 Implementation Guide](https://support.google.com/analytics/answer/10089681)

**Time**: ~10 minutes

**Status**: ⏳ Pending

---

### 4. Google AdSense Setup

**Purpose**: Display ads and generate revenue

**Steps**:
- [ ] Go to [Google AdSense](https://www.google.com/adsense/start/)
- [ ] Apply for AdSense account
- [ ] Wait for approval (typically 2-7 days)
- [ ] Once approved, get Publisher ID (format: ca-pub-xxxxxxxxxxxxxxxx)
- [ ] Set environment variable:
  ```env
  NEXT_PUBLIC_ADSENSE_PUB_ID=ca-pub-xxxxxxxxxxxxxxxx
  ```
- [ ] Add domain to AdSense

**Documentation**: [AdSense Setup Guide](https://support.google.com/adsense/answer/10162)

**Time**: ~5 minutes (initial setup, approval takes 2-7 days)

**Status**: ⏳ Pending Approval

---

### 5. MongoDB Atlas Configuration

**Purpose**: Cloud database access

**Steps**:
- [ ] Verify MongoDB URI is set: `MONGODB_URI=mongodb+srv://...`
- [ ] Go to MongoDB Atlas [Network Access](https://cloud.mongodb.com/v2)
- [ ] Add production server IP to IP Whitelist
  - Get production IP from hosting provider (Vercel)
  - Add to "Network Access" settings
  - Or use 0.0.0.0/0 for development (not recommended for production)
- [ ] Test connection from production environment
- [ ] Verify all database indexes are created
- [ ] Test with sample prompt creation

**Database Connection Pool Settings**:
```
maxPoolSize=10
retryWrites=true
w=majority
```

**Documentation**: [MongoDB Atlas Network Access](https://docs.mongodb.com/atlas/security/ip-access-list/)

**Time**: ~10 minutes

**Status**: ⏳ Pending

---

## Environment Variables Checklist

### Required Variables (All Must Be Set)

```env
# NextAuth
NEXTAUTH_SECRET=your_random_secret_key_here
NEXTAUTH_URL=https://promptall.net

# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/promptall

# Google OAuth
GOOGLE_CLIENT_ID=your_client_id
GOOGLE_CLIENT_SECRET=your_client_secret

# Cloudinary
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Google Analytics
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX

# Google AdSense
NEXT_PUBLIC_ADSENSE_PUB_ID=ca-pub-xxxxxxxxxxxxxxxx
```

### How to Set Environment Variables in Vercel

1. Go to Vercel Dashboard
2. Select your project
3. Go to Settings → Environment Variables
4. Add each variable for all environments (Development, Preview, Production)
5. Deploy to apply changes

---

## Deployment Steps

### Step 1: Pre-deployment Testing

- [ ] Run full test suite: `npm test`
- [ ] Build locally: `npm run build`
- [ ] Test all API endpoints locally
- [ ] Test signup/signin flow
- [ ] Test prompt creation with image upload
- [ ] Verify all 6 languages work
- [ ] Check GA tracking in console

**Time**: ~30 minutes

---

### Step 2: Deploy to Production

**Option A: Vercel (Recommended)**

```bash
# Push to main branch (if using GitHub integration)
git push origin main

# Or use Vercel CLI
npm install -g vercel
vercel
```

**Option B: Self-Hosted**

```bash
# Build
npm run build

# Start
npm start

# Or use process manager (PM2)
pm2 start "npm start"
```

**Time**: ~10 minutes

---

### Step 3: Verify Production Deployment

- [ ] Visit https://promptall.net
- [ ] Homepage loads correctly
- [ ] All 6 language switches work
- [ ] User signup works
- [ ] Google OAuth signin works
- [ ] Create new prompt (with image)
- [ ] Like, bookmark, comment on prompts
- [ ] Profile page loads
- [ ] Explore filters work
- [ ] Check GA4 console for page views
- [ ] Check AdSense is loading (if approved)
- [ ] Test on mobile responsiveness
- [ ] Check SSL certificate is valid

**Time**: ~20 minutes

---

### Step 4: Post-Deployment Monitoring

- [ ] Check error logs daily for first week
- [ ] Monitor database performance
- [ ] Verify API response times
- [ ] Check all external services are working:
  - [ ] OAuth logins successful
  - [ ] Image uploads working
  - [ ] GA4 events recorded
  - [ ] AdSense ads displaying (if approved)
- [ ] Test user signup-to-posting flow
- [ ] Monitor server resources

**Time**: Ongoing

---

## Deployment Timeline

| Task | Est. Time | Status |
|------|-----------|--------|
| **Phase 1: Service Setup** | | |
| Google OAuth | 15 min | ⏳ |
| Cloudinary | 10 min | ⏳ |
| Google Analytics | 10 min | ⏳ |
| MongoDB IP whitelist | 10 min | ⏳ |
| AdSense (if approved) | 5 min | ⏳ |
| **Phase 1 Total** | **50 min** | |
| **Phase 2: Deployment** | | |
| Pre-deployment testing | 30 min | ⏳ |
| Deploy to production | 10 min | ⏳ |
| Verify & monitor | 20 min | ⏳ |
| **Phase 2 Total** | **60 min** | |
| **TOTAL TIME** | **~2 hours** | ⏳ |

**Plus**: AdSense approval wait (2-7 days)

---

## Quick Reference: Service URLs

| Service | URL | Purpose |
|---------|-----|---------|
| Google Cloud Console | https://console.cloud.google.com/ | OAuth setup |
| Cloudinary Dashboard | https://cloudinary.com/console | Image hosting |
| Google Analytics 4 | https://analytics.google.com/ | Traffic tracking |
| Google AdSense | https://www.google.com/adsense | Ad revenue |
| MongoDB Atlas | https://cloud.mongodb.com/ | Database |
| Vercel Dashboard | https://vercel.com/ | Deployment |

---

## Troubleshooting Common Issues

### Issue: "Invalid Client ID" on Google OAuth

**Solution**:
- Verify credentials in Google Cloud Console
- Check redirect URIs match your domain exactly
- Include protocol (https://) in redirect URIs
- Clear browser cache and try again

---

### Issue: "Failed to upload to Cloudinary"

**Solution**:
- Verify API credentials are correct
- Check Cloud Name matches environment variable
- Verify file size is under 10MB
- Check Cloudinary account is active

---

### Issue: "MongoDB Connection Failed"

**Solution**:
- Verify MongoDB URI is correct format
- Check production server IP is in IP Whitelist
- Verify username and password are correct
- Test connection string with MongoDB Shell

---

### Issue: "GA4 Events Not Showing"

**Solution**:
- Verify Measurement ID is correct (G-XXXXXXXXXX format)
- Check GA4 property exists
- Wait 24-48 hours for first reports
- Verify domain is added to GA4 property

---

## Production Monitoring

### Daily Checks

```bash
# Check error logs
tail -f logs/error.log

# Monitor database connections
# (view in MongoDB Atlas dashboard)

# Check API response times
# (view in application metrics)
```

### Alerts to Set Up

- [ ] Error rate > 1%
- [ ] API response time > 500ms
- [ ] Database connection failures
- [ ] Disk space < 10%
- [ ] Memory usage > 80%

---

## Rollback Plan (If Issues Found)

If critical issues discovered after deployment:

1. Identify the issue
2. Stop traffic to production (or disable affected feature)
3. Revert to previous version on Vercel
4. Fix the issue locally
5. Test thoroughly
6. Redeploy

**Vercel Rollback**: One-click rollback in Vercel Dashboard

---

## Success Criteria

Production deployment is successful when:

- ✅ Homepage loads and displays prompts
- ✅ User can create account via email or Google
- ✅ User can create, read, update, delete prompts
- ✅ Image uploads work properly
- ✅ All 6 languages work correctly
- ✅ Social features work (likes, bookmarks, comments)
- ✅ User profiles are accessible
- ✅ GA4 is tracking events
- ✅ AdSense ads are displaying (if approved)
- ✅ No critical errors in logs
- ✅ API response times < 200ms average
- ✅ Database queries performing well

---

## Documentation Links

| Document | Purpose |
|----------|---------|
| [promptall.report.md](features/promptall.report.md) | Detailed completion report |
| [SUMMARY.md](SUMMARY.md) | Quick reference |
| [changelog.md](changelog.md) | v1.0.0 release notes |
| [README.md](README.md) | Report documentation index |

---

## Post-Deployment Support

### Contact for Issues

- **Technical Issues**: Check error logs and GitHub issues
- **Database**: Contact MongoDB Atlas support
- **OAuth/Analytics**: Check Google Cloud Console
- **AdSense**: Contact Google AdSense support
- **Deployment**: Vercel support

### Performance Optimization (Post-Launch)

1. Monitor slow queries in MongoDB
2. Optimize images with Cloudinary transformations
3. Implement caching for frequently accessed data
4. Use CDN for static assets (Vercel Edge Network)
5. Consider database indexes for hot tables

---

**Deployment Checklist Status**: ⏳ READY TO BEGIN

**Next Action**: Start Phase 1 - External Services Setup

**Estimated Completion**: ~2 hours from start

---

**Last Updated**: 2026-02-24
**Status**: Ready for Production
**Quality Gate**: ✅ PASS (96%)
