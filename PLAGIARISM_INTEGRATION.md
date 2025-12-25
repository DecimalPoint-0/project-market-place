# Plagiarism Checker Frontend Integration

## Overview
This document describes the plagiarism checker integration added to the frontend marketplace application. The system allows users to check their uploaded projects for plagiarism using either local (free) or premium (paid) detection services.

## Features Implemented

### 1. **Plagiarism Utility Module**
**File:** `src/utils/plagiarism.js`

Provides utility functions for interacting with the plagiarism API:

```javascript
// Run a plagiarism check
runPlagiarismCheck(projectId, checkType, premiumProvider)

// Get all checks for user
getPlagiarismChecks(page, pageSize)

// Get specific check details
getPlagiarismCheckDetails(checkId)

// Get checks for a specific project
getProjectPlagiarismChecks(projectId)

// Get severity info based on percentage
getPlagiarismSeverity(percentage)
```

#### Severity Levels:
- **Low Risk** (< 20%): Green - Safe to publish
- **Medium Risk** (20-50%): Yellow - Review recommended
- **High Risk** (50-75%): Orange - Major issues detected
- **Critical** (> 75%): Red - Likely plagiarism

### 2. **PlagiarismChecker Component**
**File:** `src/components/PlagiarismChecker.jsx`

A modal component that allows users to run plagiarism checks on their projects.

#### Features:
- **Local Check Option**: Fast, free checks against database
- **Premium Check Option**: Higher accuracy using external APIs
- **Provider Selection**: Choose between Copyscape, Turnitin, or PlagScan
- **Real-time Status**: Shows checking progress
- **Results Display**: Immediate feedback with plagiarism percentage
- **Error Handling**: User-friendly error messages

#### Usage:
```jsx
<PlagiarismChecker
    projectId={projectId}
    projectTitle={projectTitle}
    onCheckComplete={handleComplete}
    onClose={handleClose}
/>
```

#### Props:
- `projectId` (number): ID of project to check
- `projectTitle` (string): Title for display
- `onCheckComplete` (function): Callback when check completes
- `onClose` (function): Callback to close modal

### 3. **PlagiarismResults Component**
**File:** `src/components/PlagiarismResults.jsx`

Displays all plagiarism checks for a specific project.

#### Features:
- **Check History**: View all plagiarism checks performed
- **Expandable Details**: Click to view full check results
- **Matched Sources**: See which sources matched and their similarity %
- **Status Display**: Check status (pending, checking, completed, failed)
- **Error Details**: View error messages if checks failed
- **Timestamp Info**: See when checks were created/updated

#### Usage:
```jsx
<PlagiarismResults
    projectId={projectId}
    onClose={handleClose}
/>
```

#### Props:
- `projectId` (number): ID of project to view results for
- `onClose` (function): Callback to close modal

### 4. **Integration in AddProjects Component**
**File:** `src/views/dashboard/AddProjects.jsx`

The plagiarism checker is fully integrated into the projects management dashboard.

#### Changes Made:
1. Added imports for both plagiarism components
2. Added state management for:
   - `showPlagiarismChecker`: Toggle plagiarism checker modal
   - `showPlagiarismResults`: Toggle results modal
   - `selectedProjectForCheck`: Currently selected project

3. Added handler functions:
   - `handleOpenPlagiarismChecker()`: Opens checker for a project
   - `handleOpenPlagiarismResults()`: Opens results for a project
   - `handlePlagiarismCheckComplete()`: Handles check completion

4. Added action buttons on each project card:
   - **Check Button**: Runs plagiarism check
   - **Reports Button**: Views check history

#### Button Styling:
- **Check Button**: Blue background, search icon
- **Reports Button**: Green background, file icon
- Responsive grid layout on project cards
- Hover effects for better UX

## API Integration

### Expected API Endpoints

Based on the backend documentation, the frontend expects these endpoints:

#### 1. Run Plagiarism Check
```
POST /api/v1/plagiarism/check/

Request:
{
    "project_id": 1,
    "check_type": "local",
    "premium_provider": "copyscape"  // optional
}

Response:
{
    "id": 1,
    "project": 1,
    "project_title": "My Project",
    "author_email": "user@example.com",
    "check_type": "local",
    "status": "completed",
    "plagiarism_percentage": 45.50,
    "matched_sources": [...],
    "created_at": "2025-12-20T10:30:00Z",
    "updated_at": "2025-12-20T10:30:00Z"
}
```

#### 2. Get Project Plagiarism Checks
```
GET /api/v1/plagiarism/project/<project_id>/

Response:
{
    "results": [
        { ... check object ... },
        { ... check object ... }
    ]
}
```

#### 3. Get All Plagiarism Checks
```
GET /api/v1/plagiarism/checks/?page=1&page_size=10
```

#### 4. Get Specific Check Details
```
GET /api/v1/plagiarism/checks/<check_id>/
```

## Authentication

All API requests include the JWT bearer token from cookies:
```javascript
headers: {
    Authorization: `Bearer ${accessToken}`,
    'Content-Type': 'application/json'
}
```

The access token is retrieved from browser cookies using `js-cookie`.

## Error Handling

The implementation includes comprehensive error handling:

1. **Network Errors**: Caught and displayed as user-friendly toasts
2. **API Errors**: Extracts error messages from response
3. **Validation Errors**: Shows specific field errors
4. **Timeout Handling**: Gracefully handles slow/failed requests
5. **User Feedback**: Toast notifications for all outcomes

## File Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── PlagiarismChecker.jsx      (NEW)
│   │   └── PlagiarismResults.jsx      (NEW)
│   ├── utils/
│   │   ├── plagiarism.js              (NEW)
│   │   └── axios.js                   (existing)
│   └── views/
│       └── dashboard/
│           └── AddProjects.jsx        (MODIFIED)
```

## Usage Guide

### For Users

#### Running a Plagiarism Check
1. Navigate to "My Projects" in the dashboard
2. Locate the project you want to check
3. Click the blue "Check" button
4. Choose check type:
   - **Local**: Free, instant, checks database
   - **Premium**: More thorough, checks internet
5. If premium, select the provider (Copyscape, Turnitin, or PlagScan)
6. Click "Run Check"
7. Wait for results to display

#### Viewing Plagiarism Reports
1. Click the green "Reports" button on any project
2. View all plagiarism checks for that project
3. Click on any check to expand and see:
   - Plagiarism percentage
   - Risk level
   - Matched sources
   - Check timestamp
   - Any error messages

### For Developers

#### Adding Plagiarism Check to Other Components

```jsx
import PlagiarismChecker from '../../components/PlagiarismChecker';
import PlagiarismResults from '../../components/PlagiarismResults';

// In your component
const [showChecker, setShowChecker] = useState(false);

return (
    <>
        <button onClick={() => setShowChecker(true)}>
            Check Plagiarism
        </button>

        {showChecker && (
            <PlagiarismChecker
                projectId={projectId}
                projectTitle={projectTitle}
                onCheckComplete={() => setShowChecker(false)}
                onClose={() => setShowChecker(false)}
            />
        )}
    </>
);
```

#### Accessing Plagiarism Utilities

```javascript
import {
    runPlagiarismCheck,
    getPlagiarismChecks,
    getPlagiarismCheckDetails,
    getProjectPlagiarismChecks,
    getPlagiarismSeverity
} from '../../utils/plagiarism';

// Run a check
const result = await runPlagiarismCheck(projectId, 'local');

// Get severity info
const severity = getPlagiarismSeverity(45); // returns severity object
```

## Styling

All components use Tailwind CSS with the following color scheme:
- **Primary**: Used for main actions and headers
- **Green**: Low risk/success states
- **Yellow**: Medium risk/warnings
- **Orange**: High risk
- **Red**: Critical risk/failures
- **Blue**: Information and premium features

Components are fully responsive and work on mobile, tablet, and desktop.

## Performance Considerations

1. **API Calls**: Uses axios instance with timeout management
2. **State Management**: Minimal state re-renders
3. **Loading States**: Shows spinners during API calls
4. **Error Boundaries**: Graceful error handling prevents crashes
5. **Pagination**: Results support pagination for large datasets

## Security

1. **Authentication**: All requests include JWT token
2. **Authorization**: Backend validates user access to projects
3. **Data Privacy**: Only project authors see their checks
4. **API Keys**: Frontend doesn't expose premium API keys
5. **Input Validation**: Basic validation before API calls

## Future Enhancements

1. **Batch Checking**: Check multiple projects at once
2. **Scheduled Checks**: Auto-check on project upload
3. **Notifications**: Email alerts when checks complete
4. **Export Reports**: Generate PDF/CSV reports
5. **Comparison View**: Compare multiple check results
6. **Analytics Dashboard**: Plagiarism trends and statistics
7. **Webhooks**: Integration with external systems
8. **Caching**: Cache results to reduce API calls

## Troubleshooting

### "Project not found" Error
- Verify the project ID is correct
- Check that you have access to the project
- Ensure the project hasn't been deleted

### "API key not configured" Error
- Ensure backend has API keys in .env
- Verify provider selection matches configured keys
- Restart backend server

### Modal Not Opening
- Check browser console for JavaScript errors
- Verify components are imported correctly
- Check that state is updating properly

### Results Not Loading
- Check network tab for API responses
- Verify project ID is passed correctly
- Check that backend endpoint matches expected URL

## Support

For issues or questions:
1. Check the browser console for error messages
2. Review the API response in network tab
3. Verify backend endpoints are working with curl/Postman
4. Check that authentication token is valid

## Additional Resources

- Backend Documentation: See `PLAGIARISM_INTEGRATION.md` in backend
- Tailwind CSS: https://tailwindcss.com/
- Axios Documentation: https://axios-http.com/
- React Documentation: https://react.dev/
