# Test Credentials for AptIQ Platform

## Admin Access 🛡️

**Email:** `admin@aptiq.com`  
**Password:** Any 6+ characters (e.g., `admin123`)  
**Role:** Admin  
**Access:** Full admin dashboard with all management features

### What You Can Do:
- Access admin dashboard at `/admin`
- Manage all users (view, suspend, activate, delete, change roles)
- Monitor platform content (tests, classes, questions)
- View violation logs
- Access analytics and system metrics
- Configure platform settings
- Clear all data (danger zone)

---

## Teacher Access 👨‍🏫

**Email:** `teacher@aptiq.com`  
**Password:** Any 6+ characters (e.g., `teacher123`)  
**Role:** Teacher  
**Access:** Teacher dashboard and tools

### What You Can Do:
- Create and manage classes
- Create tests (individual or bulk import)
- Assign tests to classes
- View test results
- Post notes and updates to classes
- View student analytics
- Manage students

---

## Student Access 👨‍🎓

**Email:** Any email address (e.g., `student@example.com`)  
**Password:** Any 6+ characters (e.g., `student123`)  
**Role:** Student  
**Access:** Student dashboard and learning features

### What You Can Do:
- Join classes with class codes
- Take practice, mock, and advanced tests
- Access learning materials (subjects, chapters, lessons)
- View progress and analytics
- Participate in leaderboard
- Earn badges and maintain streaks
- Join tournaments

---

## Quick Login Guide

### To Test Admin Features:
1. Go to login page
2. Enter email: `admin@aptiq.com`
3. Enter any password (6+ characters)
4. Click "Sign In"
5. You'll be redirected to `/admin` dashboard

### To Test Teacher Features:
1. Go to login page
2. Enter email: `teacher@aptiq.com`
3. Enter any password (6+ characters)
4. Click "Sign In"
5. You'll be redirected to `/teacher/dashboard`

### To Test Student Features:
1. Go to login page
2. Enter any email (e.g., `john@example.com`)
3. Enter any password (6+ characters)
4. Click "Sign In"
5. You'll be redirected to `/dashboard`

---

## Important Notes

### Password Validation:
- Minimum 6 characters required
- Any combination of characters works
- Password is not actually validated (mock authentication)

### Email Validation:
- Must be a valid email format
- Special emails trigger specific roles:
  - `admin@aptiq.com` → Admin role
  - `teacher@aptiq.com` → Teacher role
  - Any other email → Student role

### Session Persistence:
- Login state is saved in localStorage
- Persists across page refreshes
- Logout clears the session

### Role-Based Routing:
- Admin users are redirected to `/admin`
- Teacher users are redirected to `/teacher/dashboard`
- Student users are redirected to `/dashboard`

---

## Testing Scenarios

### Scenario 1: Admin Dashboard Testing
```
Email: admin@aptiq.com
Password: admin123
Expected: Access to admin dashboard with all management features
```

### Scenario 2: Teacher Workflow Testing
```
Email: teacher@aptiq.com
Password: teacher123
Expected: Access to teacher dashboard, can create classes and tests
```

### Scenario 3: Student Learning Testing
```
Email: student@example.com
Password: student123
Expected: Access to student dashboard, can join classes and take tests
```

### Scenario 4: Multiple User Testing
```
1. Login as admin → Test admin features → Logout
2. Login as teacher → Test teacher features → Logout
3. Login as student → Test student features → Logout
```

---

## Admin Dashboard Features to Test

### Overview Tab:
- [ ] View platform statistics
- [ ] Check user breakdown
- [ ] Monitor system health
- [ ] Review recent activity

### Users Tab:
- [ ] Search for users
- [ ] Filter by role and status
- [ ] Change user roles
- [ ] Suspend/activate users
- [ ] Delete users

### Content Tab:
- [ ] View tests statistics
- [ ] View classes statistics
- [ ] Check question bank

### Violations Tab:
- [ ] View violation logs
- [ ] Check violation types
- [ ] Monitor test integrity

### Analytics Tab:
- [ ] Platform usage metrics
- [ ] Test statistics
- [ ] User engagement data
- [ ] System performance

### Settings Tab:
- [ ] Toggle platform settings
- [ ] Configure test settings
- [ ] Test danger zone features (with caution!)

---

## Security Notes

### Current Implementation:
- Mock authentication (no real backend)
- No password encryption
- No token-based authentication
- Data stored in localStorage

### For Production:
- Implement real authentication API
- Use secure password hashing (bcrypt)
- Implement JWT tokens
- Use secure session management
- Add rate limiting
- Implement 2FA for admin accounts
- Use HTTPS only
- Add CSRF protection

---

## Troubleshooting

### Can't Login:
- Check email format is valid
- Ensure password is 6+ characters
- Clear browser cache and try again
- Check browser console for errors

### Wrong Dashboard:
- Verify email matches the role you want
- Check if you're using the correct test email
- Logout and login again

### Features Not Working:
- Ensure you're logged in with correct role
- Check browser console for errors
- Verify localStorage has data
- Try refreshing the page

---

## Quick Reference Card

| Role | Email | Dashboard URL | Key Features |
|------|-------|---------------|--------------|
| Admin | admin@aptiq.com | /admin | User management, Content oversight, Analytics |
| Teacher | teacher@aptiq.com | /teacher/dashboard | Classes, Tests, Students |
| Student | any@email.com | /dashboard | Learning, Tests, Progress |

---

**Last Updated:** March 2026  
**Version:** 1.0.0  
**Status:** ✅ Ready for Testing
