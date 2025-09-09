# URL Shortener - System Design Documentation

## 1. Architecture Overview

### 1.1 Technology Stack
- **Frontend Framework**: React with Vite
  - Chosen for its performance, modern tooling, and component-based architecture
  - Vite provides faster development experience and better build optimization
- **UI Library**: Material-UI (MUI)
  - Provides consistent, accessible components
  - Reduces development time while maintaining high-quality UI
- **State Management**: React's built-in useState and localStorage
  - Suitable for the application's scope
  - Provides persistence without additional dependencies

### 1.2 Core Components
```
src/
├── components/
│   ├── AuthPage.jsx       # Authentication handling
│   ├── UrlShortener.jsx   # URL shortening form
│   ├── Statistics.jsx     # Analytics display
│   └── UrlRedirect.jsx    # URL redirection
├── middleware/
│   └── logger.js         # Custom logging implementation
└── submission/
    └── index.js          # Project documentation and exports
```

## 2. Data Models

### 2.1 URL Entity
```typescript
interface UrlEntity {
  originalUrl: string;      // The original long URL
  shortcode: string;       // Generated or custom shortcode
  createdAt: Date;        // Creation timestamp
  expiryDate: Date;       // Calculated from validity period
  clicks: ClickData[];    // Array of click analytics
}
```

### 2.2 Click Analytics
```typescript
interface ClickData {
  timestamp: Date;        // When the URL was accessed
  source: string;         // Referrer information
  location: string;       // Geographical data
}
```

### 2.3 Authentication Data
```typescript
interface AuthData {
  email: string;
  name: string;
  mobileNo: string;
  githubUsername: string;
  rollNo: string;
  accessCode: string;
}
```

## 3. Key Features Implementation

### 3.1 URL Shortening
- Maximum 5 concurrent URLs per session
- Custom shortcode support with validation
- Default 30-minute validity period
- Client-side validation for:
  - URL format
  - Shortcode uniqueness
  - Validity period constraints

### 3.2 Analytics Tracking
- Click counting
- Source tracking
- Timestamp recording
- Geographic location logging

### 3.3 Logging System
- Custom middleware implementation
- Standardized logging format
- Supports multiple log levels
- API integration ready

## 4. Design Decisions

### 4.1 Client-Side Storage
- Using localStorage for URL data persistence
- Pros:
  - Immediate data access
  - Offline capability
  - Reduced server load
- Cons:
  - Limited storage space
  - Data limited to single device

### 4.2 Component Architecture
- Modular design for maintainability
- Clear separation of concerns
- Reusable components where possible
- Props for component communication

### 4.3 Error Handling
- Comprehensive client-side validation
- User-friendly error messages
- Logging of all error scenarios
- Graceful fallbacks

## 5. Scalability Considerations

### 5.1 Current Implementation
- Handles client-side operations efficiently
- Supports multiple concurrent users
- Maintains performance with growing URL list

### 5.2 Future Improvements
- Backend integration ready
- Database schema prepared
- API endpoints defined
- Cache implementation possible

## 6. Testing Strategy

### 6.1 Validation Testing
- URL format validation
- Shortcode uniqueness
- Expiry date calculations

### 6.2 Component Testing
- User input handling
- State management
- Error scenarios

### 6.3 Integration Testing
- Authentication flow
- URL redirection
- Analytics tracking

## 7. Security Measures

### 7.1 Input Validation
- URL sanitization
- Shortcode character restrictions
- Length limitations

### 7.2 Authentication
- Token-based auth implementation
- Secure credential handling
- Session management

## 8. Assumptions

1. Running on localhost:3000
2. Single user session scope
3. Client-side storage sufficient for MVP
4. Network connectivity for logging
5. Modern browser support required

## 9. Maintainability

1. Consistent code style
2. Comprehensive documentation
3. Modular architecture
4. Clear naming conventions
5. Separation of concerns
