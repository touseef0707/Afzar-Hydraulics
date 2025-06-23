# Firebase Setup Guide

## Firebase Permission Issues

The application is currently experiencing permission issues with Firebase Realtime Database. The error messages indicate:

```
@firebase/database: FIREBASE WARNING: set at /projects/-OTQFT--uvq9P1odSy3B failed: permission_denied
Error creating project: Error: PERMISSION_DENIED: Permission denied
Error fetching projects: Error: Permission denied
```

## Solution: Configure Firebase Security Rules

To fix these permission issues, you need to update your Firebase Realtime Database security rules. Follow these steps:

1. Go to the [Firebase Console](https://console.firebase.google.com/)
2. Select your project: `afzar-hydraulics`
3. Navigate to **Realtime Database** in the left sidebar
4. Click on the **Rules** tab
5. Replace the current rules with the following:

```json
{
  "rules": {
    ".read": "auth != null",
    ".write": "auth != null",
    "projects": {
      ".read": "auth != null",
      ".write": "auth != null",
      "$projectId": {
        ".read": "auth != null",
        ".write": "auth != null && (data.child('createdBy').val() === auth.uid || !data.exists())"
      }
    },
    "flows": {
      ".read": "auth != null",
      ".write": "auth != null",
      "$flowId": {
        ".read": "auth != null",
        ".write": "auth != null"
      }
    }
  }
}
```

6. Click **Publish** to apply the new rules

## Explanation of Security Rules

- **Root level**: Only authenticated users can read and write to the database
- **Projects collection**: 
  - Any authenticated user can read all projects
  - Any authenticated user can create new projects
  - Only the creator of a project can modify it
- **Flows collection**:
  - Any authenticated user can read and write to flows

## Additional Recommendations

### 1. User-specific Data Structure

For better security, consider restructuring your data to organize projects by user:

```json
{
  "rules": {
    "users": {
      "$uid": {
        ".read": "auth != null && auth.uid === $uid",
        ".write": "auth != null && auth.uid === $uid",
        "projects": {
          ".read": "auth != null && auth.uid === $uid",
          ".write": "auth != null && auth.uid === $uid"
        }
      }
    },
    "projects": {
      ".indexOn": ["createdBy"],
      "$projectId": {
        ".read": "auth != null && data.child('createdBy').val() === auth.uid",
        ".write": "auth != null && (data.child('createdBy').val() === auth.uid || !data.exists())"
      }
    }
  }
}
```

This structure would require updating your code to fetch projects by user ID.

### 2. Environment Variables

Your `.env.local` file contains sensitive information including API keys and email credentials. Make sure this file is:

- Added to `.gitignore` to prevent accidental commits
- Not shared in public repositories
- Properly set up in production environments

### 3. Code Updates

Update your `ProjectContext.tsx` to fetch only projects created by the current user:

```typescript
// In fetchProjects function
const projectsRef = ref(database, 'projects');
const userProjectsQuery = query(projectsRef, orderByChild('createdBy'), equalTo(user.uid));
const snapshot = await get(userProjectsQuery);
```

This requires importing additional Firebase functions:

```typescript
import { ref, onValue, off, get, query, orderByChild, equalTo } from 'firebase/database';
```

## Testing

After implementing these changes:

1. Log out and log back in to refresh authentication
2. Try creating a new project
3. Verify you can fetch and display existing projects

If issues persist, check the Firebase console logs for more detailed error information.