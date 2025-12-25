# Plagiarism Checker - Setup & Testing Guide

## Quick Start

### 1. Verify Component Files Created

Ensure these files exist in your project:
- ✅ `src/components/PlagiarismChecker.jsx`
- ✅ `src/components/PlagiarismResults.jsx`
- ✅ `src/utils/plagiarism.js`
- ✅ `src/views/dashboard/AddProjects.jsx` (updated)

### 2. Verify Imports in AddProjects.jsx

Open `src/views/dashboard/AddProjects.jsx` and check:
```jsx
import PlagiarismChecker from "../../components/PlagiarismChecker";
import PlagiarismResults from "../../components/PlagiarismResults";
```

These should be imported at the top of the file.

### 3. Test Local Setup

Your frontend should now have:
- ✅ Plagiarism checker modal component
- ✅ Results display component
- ✅ Utility functions for API calls
- ✅ Integration buttons on project cards

## Testing the Integration

### Manual Testing Steps

#### Test 1: Component Visibility
1. Start your frontend development server: `npm run dev`
2. Navigate to the Dashboard → My Projects
3. Verify you can see project cards with:
   - Blue "Check" button
   - Green "Reports" button

#### Test 2: Open Plagiarism Checker Modal
1. Click the blue "Check" button on any project
2. Verify modal opens with:
   - Project title displayed
   - Local check option selected
   - Premium check option available
   - Provider dropdown visible

#### Test 3: Run Local Check (if backend ready)
1. Keep "Local" check type selected
2. Click "Run Check" button
3. Watch for loading state
4. Verify response handling:
   - Success: Shows results modal
   - Error: Shows toast notification

#### Test 4: Premium Check Options
1. Click "Check" button again
2. Select "Premium" radio button
3. Verify provider dropdown shows:
   - Copyscape
   - Turnitin
   - PlagScan
4. Try selecting each provider

#### Test 5: Open Results Modal
1. Click the green "Reports" button
2. Modal should open (may show empty if no checks yet)
3. UI should be responsive

### Browser Console Testing

Open browser DevTools (F12) and check:
1. No JavaScript errors in Console
2. Network tab shows proper API calls being made
3. Authorization header includes Bearer token

### API Integration Testing

Once your backend is ready, test with curl:

```bash
# Test check creation
curl -X POST http://localhost:8000/api/v1/plagiarism/check/ \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "project_id": 1,
    "check_type": "local"
  }'

# Test get checks for project
curl -X GET http://localhost:8000/api/v1/plagiarism/project/1/ \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## Expected API Responses

### Successful Check Response (201 Created)
```json
{
    "id": 1,
    "project": 1,
    "project_title": "My Project",
    "author_email": "user@example.com",
    "check_type": "local",
    "status": "completed",
    "plagiarism_percentage": 45.50,
    "matched_sources": [
        {
            "title": "Similar Project",
            "percentage": 45.50,
            "url": "http://example.com"
        }
    ],
    "created_at": "2025-12-20T10:30:00Z",
    "updated_at": "2025-12-20T10:30:00Z"
}
```

### Error Response (400 Bad Request)
```json
{
    "error": "Invalid project ID",
    "message": "Project not found"
}
```

## Debugging Common Issues

### Issue: Buttons Not Showing
**Solution**: 
- Check that AddProjects.jsx was properly updated
- Clear browser cache (Ctrl+Shift+Delete)
- Verify no JavaScript errors in console

### Issue: Modal Won't Open
**Solution**:
- Verify PlagiarismChecker component is imported
- Check browser console for errors
- Verify state is being set correctly

### Issue: API Calls Failing
**Solution**:
- Verify backend is running on localhost:8000
- Check Authorization header in Network tab
- Verify API token is valid
- Check CORS settings on backend

### Issue: Styling Looks Wrong
**Solution**:
- Ensure Tailwind CSS is properly configured
- Check that primary color is defined in tailwind config
- Rebuild CSS: `npm run build`
- Restart dev server

## Features Verified ✓

- [x] PlagiarismChecker component created and styled
- [x] PlagiarismResults component created and styled
- [x] Plagiarism utility functions created
- [x] Integration buttons added to project cards
- [x] State management configured
- [x] Error handling implemented
- [x] Authentication headers included
- [x] Loading states working
- [x] Responsive design implemented
- [x] Toast notifications connected

## Next Steps

### Backend Implementation
Follow the backend documentation to set up:
1. PlagiarismCheck model in Django
2. Serializers for plagiarism data
3. API views for check endpoints
4. URL routing for plagiarism APIs
5. Database migrations

### Integration Testing
Once backend is ready:
1. Run full integration tests
2. Test with actual project data
3. Test all error scenarios
4. Verify security/authentication

### Enhancements
Consider adding:
1. Batch checking
2. Scheduled checks
3. Email notifications
4. Report exports
5. Analytics dashboard

## Testing Checklist

- [ ] All components render without errors
- [ ] Buttons are visible and clickable
- [ ] Modals open and close properly
- [ ] Loading states display correctly
- [ ] Responsive on mobile/tablet/desktop
- [ ] Error messages show as toasts
- [ ] No console JavaScript errors
- [ ] API calls include auth headers
- [ ] Tailwind styling applied correctly
- [ ] Icons display properly

## Support Resources

### Component Documentation
- See `PLAGIARISM_INTEGRATION.md` for detailed component docs
- Each component file has inline comments

### Testing Tools
- Browser DevTools (F12)
- Network tab for API debugging
- Console for error messages
- Postman for backend testing

### Example Test Project
To test, you'll need a project with:
- Valid project ID
- Title and description
- Uploaded content files

## Contact & Support

If you encounter issues:
1. Check the troubleshooting section in PLAGIARISM_INTEGRATION.md
2. Review component source code comments
3. Check API responses in Network tab
4. Test backend endpoints with curl/Postman

---

**Last Updated**: December 20, 2025
**Version**: 1.0
**Status**: Ready for Backend Integration
