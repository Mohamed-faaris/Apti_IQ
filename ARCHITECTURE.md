# AptIQ Architecture Documentation

## Overview

AptIQ is built with a scalable, production-ready architecture that separates concerns and enables easy backend integration.

## Core Principles

1. **Feature-based modular structure**: Each feature is self-contained
2. **Service abstraction layer**: All API calls go through services
3. **State isolation**: Client state (Zustand) separate from server state (React Query)
4. **No business logic in UI**: Components are presentational
5. **Type safety**: Full TypeScript coverage

## Architecture Layers

```
┌─────────────────────────────────────────┐
│           Presentation Layer            │
│  (React Components + Framer Motion)     │
└─────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────┐
│          State Management Layer         │
│  (Zustand + TanStack Query)             │
└─────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────┐
│          Service Layer                  │
│  (API + Socket Abstraction)             │
└─────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────┐
│          Mock/Real Backend              │
│  (Currently Mocked)                     │
└─────────────────────────────────────────┘
```

## Directory Structure Explained

### `/src/app`
Application-level configuration and setup.

- `router.tsx`: Route definitions with lazy loading
- `providers.tsx`: Global providers (Query, Router)
- `layouts/`: Layout components (StudentLayout, ProtectedRoute)

### `/src/features`
Feature modules following domain-driven design.

Each feature contains:
- `pages/`: Route components
- `components/`: Feature-specific components
- `store/`: Feature-specific Zustand stores
- `hooks/`: Feature-specific custom hooks

Features:
- `auth`: Login, register, authentication
- `dashboard`: Main dashboard with stats
- `learning`: Subjects, chapters, lessons
- `test-engine`: Test taking with anti-cheat
- `leaderboard`: Real-time rankings
- `analytics`: Performance charts
- `profile`: User profile management
- `admin`: Admin panel (lazy loaded)

### `/src/services`
Service layer for external communication.

- `api.ts`: Main API service (abstraction)
- `mockApi.ts`: Mock implementation
- `socket.ts`: Socket service (mocked real-time)

**Key Design**: Services return promises and handle errors. Components never directly call external APIs.

### `/src/shared`
Shared resources across features.

- `ui/`: Reusable UI components (Button, Card, Input, etc.)
- `hooks/`: Custom hooks (useToast)
- `utils/`: Utility functions
- `constants/`: App constants (routes, query keys)
- `types/`: TypeScript interfaces

### `/src/theme`
Design system tokens.

- `tokens.ts`: Colors, spacing, shadows, transitions

## State Management Strategy

### Zustand (Client State)
Used for:
- Authentication state (`authStore`)
- Test session state (`testStore`)
- UI state (toasts via `useToastStore`)

**Why Zustand?**
- Minimal boilerplate
- No context provider needed
- Selector-based subscriptions (prevents unnecessary re-renders)
- Persist middleware for auth

### TanStack Query (Server State)
Used for:
- Fetching data (subjects, lessons, dashboard stats)
- Caching with 5-minute stale time
- Automatic refetching
- Loading and error states

**Why TanStack Query?**
- Automatic caching and invalidation
- Background refetching
- Optimistic updates
- Request deduplication

## Data Flow

### Read Flow (Fetching Data)
```
Component → useQuery → API Service → Mock API → Component
```

Example:
```typescript
// Component
const { data: subjects } = useQuery({
  queryKey: [QUERY_KEYS.SUBJECTS],
  queryFn: api.subjects.getAll,
});

// API Service
export const api = {
  subjects: {
    getAll: mockApi.getSubjects,
  },
};

// Mock API
export const mockApi = {
  getSubjects: async () => {
    await delay(500);
    return mockStore.subjects;
  },
};
```

### Write Flow (Mutations)
```
Component → useMutation → API Service → Mock API → Invalidate Query → Refetch
```

Example:
```typescript
const mutation = useMutation({
  mutationFn: api.lessons.markComplete,
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.LESSONS] });
  },
});
```

## Routing Strategy

### Route Types
1. **Public**: Landing, Login, Register
2. **Protected**: Dashboard, Subjects, Test, etc.
3. **Admin**: Admin panel (requires admin role)

### Lazy Loading
Admin and Analytics routes are lazy loaded to reduce initial bundle size.

```typescript
const AdminPage = lazy(() => import('../features/admin/pages/AdminPage'));
```

### Protected Routes
```typescript
<ProtectedRoute requireAdmin>
  <AdminPage />
</ProtectedRoute>
```

## Anti-Cheat System

### Detection Mechanisms
1. **Tab Switch**: `visibilitychange` event
2. **Fullscreen Exit**: `fullscreenchange` event
3. **Right Click**: `contextmenu` event prevention

### Violation Handling
- Increment violation counter
- Show toast warning
- Auto-submit test at 3 violations
- Store violations in test session

### Implementation
```typescript
useEffect(() => {
  const handleVisibilityChange = () => {
    if (document.hidden) {
      incrementViolations();
      toast.warning('Tab switch detected!');
    }
  };
  
  document.addEventListener('visibilitychange', handleVisibilityChange);
  return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
}, []);
```

## Real-Time Features (Mocked)

### Socket Service
Simulates WebSocket connection for leaderboard updates.

```typescript
class SocketService {
  connect() {
    this.startMockUpdates();
  }
  
  on(event: string, callback: Function) {
    this.listeners.set(event, callback);
  }
  
  private startMockUpdates() {
    setInterval(() => {
      this.trigger('leaderboard:update', mockData);
    }, 5000);
  }
}
```

### Integration
```typescript
useEffect(() => {
  socketService.connect();
  socketService.on('leaderboard:update', setLiveData);
  
  return () => {
    socketService.disconnect();
  };
}, []);
```

## Animation Strategy

### Framer Motion Usage
1. **Page transitions**: Fade + slide
2. **List animations**: Stagger children
3. **Hover effects**: Scale + shadow
4. **Counter animations**: Number interpolation

### Performance
- Animations ≤ 300ms (except charts: 1000ms)
- Use `transform` and `opacity` (GPU accelerated)
- Avoid animating `width`, `height`, `top`, `left`

## Form Handling

### React Hook Form + Zod
```typescript
const schema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

const { register, handleSubmit, formState: { errors } } = useForm({
  resolver: zodResolver(schema),
});
```

**Benefits**:
- Type-safe validation
- Minimal re-renders
- Built-in error handling

## Error Handling

### API Errors
```typescript
apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      // Redirect to login
    }
    return Promise.reject(error);
  }
);
```

### Component Errors
```typescript
try {
  await mutation.mutateAsync(data);
  toast.success('Success!');
} catch (error) {
  toast.error('Failed. Please try again.');
}
```

## Performance Optimizations

### Code Splitting
- Lazy load admin and analytics routes
- Dynamic imports for heavy libraries

### Memoization
```typescript
const expensiveValue = useMemo(() => {
  return computeExpensiveValue(data);
}, [data]);
```

### Zustand Selectors
```typescript
// ❌ Bad: Re-renders on any auth state change
const auth = useAuthStore();

// ✅ Good: Only re-renders when user changes
const user = useAuthStore((state) => state.user);
```

### React Query Caching
- 5-minute stale time
- Background refetching
- Request deduplication

## Testing Strategy (Not Implemented)

### Recommended Approach
1. **Unit Tests**: Vitest for utilities and hooks
2. **Component Tests**: React Testing Library
3. **E2E Tests**: Playwright or Cypress
4. **API Mocking**: MSW (Mock Service Worker)

## Security Considerations

### Current Implementation
- Protected routes with authentication check
- Role-based access control (admin)
- Input validation with Zod
- XSS prevention (React escapes by default)

### Production Recommendations
- Implement CSRF tokens
- Add rate limiting
- Use HTTPS only
- Implement Content Security Policy
- Add security headers

## Scalability Considerations

### Current Architecture Supports
- Microservices backend (service layer abstraction)
- Multiple API versions (versioned endpoints)
- Feature flags (conditional rendering)
- A/B testing (route-based)
- Multi-tenancy (user-based data filtering)

### Future Enhancements
- Server-side rendering (Next.js migration)
- Progressive Web App (PWA)
- Offline support (Service Workers)
- Real-time collaboration (operational transforms)

## Backend Integration Guide

### Step 1: Update API Service
Replace mock implementations with real API calls:

```typescript
// Before
export const api = {
  auth: {
    login: mockApi.login,
  },
};

// After
export const api = {
  auth: {
    login: async (email, password) => {
      return apiClient.post('/auth/login', { email, password });
    },
  },
};
```

### Step 2: Update Socket Service
Replace mock socket with real Socket.io:

```typescript
// Before
class SocketService {
  connect() {
    this.startMockUpdates();
  }
}

// After
class SocketService {
  connect() {
    this.socket = io(API_BASE_URL);
  }
}
```

### Step 3: Environment Configuration
```bash
VITE_API_URL=https://api.aptiq.com
VITE_SOCKET_URL=wss://api.aptiq.com
```

### Step 4: Error Handling
Add proper error handling for network failures, timeouts, etc.

## Monitoring and Observability

### Recommended Tools
- **Error Tracking**: Sentry
- **Analytics**: Google Analytics, Mixpanel
- **Performance**: Lighthouse, Web Vitals
- **Logging**: LogRocket, FullStory

### Key Metrics to Track
- Page load time
- Time to interactive
- API response times
- Error rates
- User engagement (tests taken, lessons completed)

## Deployment Architecture

### Recommended Setup
```
┌─────────────┐
│   Route 53  │ (DNS)
└──────┬──────┘
       │
┌──────▼──────┐
│ CloudFront  │ (CDN)
└──────┬──────┘
       │
┌──────▼──────┐
│   S3 Bucket │ (Static Hosting)
└─────────────┘
```

### Benefits
- Global CDN distribution
- HTTPS by default
- Automatic scaling
- Cost-effective

## Conclusion

This architecture provides:
- ✅ Clean separation of concerns
- ✅ Easy backend integration
- ✅ Scalable structure
- ✅ Type safety
- ✅ Performance optimizations
- ✅ Production-ready patterns

The mock implementation demonstrates real-world patterns that can be directly applied when connecting to a real backend.
