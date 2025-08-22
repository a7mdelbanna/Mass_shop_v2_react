# MasShop React - Complete Project Documentation

## Table of Contents
1. [Project Overview](#project-overview)
2. [Technology Stack](#technology-stack)
3. [Project Structure](#project-structure)
4. [Features](#features)
5. [Authentication System](#authentication-system)
6. [API Architecture](#api-architecture)
7. [Component Architecture](#component-architecture)
8. [Routing System](#routing-system)
9. [State Management](#state-management)
10. [UI/UX Design](#uiux-design)
11. [Development Setup](#development-setup)
12. [Key Modules](#key-modules)

## Project Overview

MasShop is a comprehensive **multi-mode e-commerce management system** built with React. It supports three operational modes:
- **Retail Market Mode**: For B2C retail operations
- **Wholesale Mode**: For B2B bulk sales
- **Both Mode**: Combined retail and wholesale operations

The system is designed to manage inventory, orders, customers, delivery operations, and provide comprehensive analytics for store owners.

## Technology Stack

### Core Technologies
- **React 18.3.1**: Modern React with hooks and functional components
- **TypeScript**: Type-safe development
- **Vite 5.4.1**: Fast build tool and dev server
- **React Router DOM 6.26.2**: Client-side routing

### State Management & Data Fetching
- **TanStack Query (React Query) 5.56.2**: Server state management
- **React Hook Form 7.53.0**: Form state management
- **Zod 3.23.8**: Schema validation

### UI Framework & Styling
- **Tailwind CSS 3.4.11**: Utility-first CSS framework
- **Shadcn/ui Components**: Modern component library
- **Radix UI**: Headless UI primitives
- **Lucide React**: Icon library
- **Framer Motion**: Animation library

### Internationalization
- **i18next 25.2.1**: Internationalization framework
- **react-i18next 15.5.3**: React bindings for i18next
- Supports **English** and **Arabic** (RTL support)

### Additional Libraries
- **date-fns 3.6.0**: Date manipulation
- **react-select 5.10.2**: Advanced select components
- **recharts 2.12.7**: Data visualization
- **xlsx 0.18.5**: Excel file handling
- **sweetalert2 11.22.1**: Beautiful alerts
- **sonner 1.5.0**: Toast notifications

## Project Structure

```
Mass_shop_v2_react/
├── src/
│   ├── components/         # Reusable UI components
│   │   ├── categories/     # Category management components
│   │   ├── companies/      # Company/supplier components
│   │   ├── complaints/     # Customer complaints
│   │   ├── coupons/        # Coupon management
│   │   ├── customers/      # Customer management
│   │   ├── delivery-boys/  # Delivery personnel
│   │   ├── delivery-fee/   # Delivery fee configuration
│   │   ├── inventoryActions/# Inventory operations
│   │   ├── item-offer/     # Product offers
│   │   ├── item-spotlight/ # Featured products
│   │   ├── item-units/     # Product units management
│   │   ├── layout/         # Layout components
│   │   ├── layouts/        # Page layouts
│   │   ├── main-categories/# Main category management
│   │   ├── navigation/     # Navigation components
│   │   ├── notices/        # Store notices
│   │   ├── orders/         # Order management
│   │   ├── products/       # Product management
│   │   ├── sub-categories/ # Sub-category management
│   │   ├── tags/           # Product tags
│   │   └── ui/            # Base UI components
│   ├── config/            # Configuration files
│   ├── contexts/          # React contexts
│   ├── hooks/             # Custom React hooks
│   ├── pages/             # Page components
│   ├── schemas/           # Validation schemas
│   ├── services/          # API service layer
│   ├── types/             # TypeScript type definitions
│   └── utils/             # Utility functions
├── public/                # Static assets
└── package.json          # Project dependencies
```

## Features

### 1. Product Management
- **Retail Products**: Individual item management
- **Wholesale Products**: Bulk product handling
- **Item Units**: SKU and variant management
- **Categories**: Hierarchical category system (Main → Sub → Products)
- **Tags**: Product tagging and filtering
- **Companies/Suppliers**: Vendor management

### 2. Inventory Management
- **Inventory Tracking**: Real-time stock monitoring
- **Bulk Operations**: Mass inventory updates
- **Inventory Actions**: Stock adjustments and transfers
- **Barcode Support**: Item barcode management

### 3. Order Management
- **Order Processing**: Complete order lifecycle
- **Order Tracking**: Real-time status updates
- **Order History**: Comprehensive order records
- **Multiple Payment Methods**: Flexible payment options

### 4. Discount & Promotion System
- **Offers Management**: Time-based promotional offers
- **Spotlight Items**: Featured product promotions
- **Coupon System**: Flexible discount coupon creation
- **Bulk Discounts**: Wholesale pricing tiers

### 5. User Management
- **Customer Management**: Customer profiles and history
- **Delivery Boy Management**: Delivery personnel tracking
- **Role-Based Access**: Admin and staff permissions
- **Authentication**: Secure login system

### 6. Delivery & Logistics
- **Delivery Fee Configuration**: 
  - Fixed fee model
  - Distance-based pricing
- **Delivery Zone Management**: Geographic delivery areas
- **Delivery Personnel Assignment**: Order-to-delivery mapping

### 7. Communication & Support
- **Customer Complaints**: Complaint tracking system
- **Store Notices**: Announcement management
- **Push Notifications**: Customer engagement

### 8. Analytics & Reporting
- **Dashboard Analytics**: Key business metrics
- **Sales Reports**: Revenue tracking
- **Inventory Reports**: Stock level monitoring
- **Customer Analytics**: Purchase behavior analysis

### 9. Store Configuration
- **Store Settings**: Business configuration
- **Store Address**: Multiple location support
- **Notification Settings**: Alert preferences
- **App Mode Selection**: Retail/Wholesale/Both

## Authentication System

The application uses a **JWT-based authentication system**:

### Current Implementation
- **Mock Authentication**: Uses hardcoded credentials for demo
  - Email: `admin@example.com`
  - Password: `password`
- **JWT Token Structure**: Simulated JWT tokens with user data
- **Protected Routes**: All dashboard routes require authentication
- **Session Management**: Token stored in localStorage

### Authentication Flow
1. User enters credentials on login page
2. Credentials validated (currently mock validation)
3. JWT token generated and stored
4. User redirected to dashboard
5. Token checked on each protected route
6. Logout clears token and redirects to login

### User Types
- **SystemAdmin**: Full system access
- **StoreAdmin**: Store-level administration
- **Staff**: Limited operational access

## API Architecture

### Base Configuration
- **Base URL**: `http://modytest-002-site3.atempurl.com/RetailAPI`
- **Authentication Endpoint**: `/Auth/Authenticate/1`
- **Content Type**: `application/json`

### Service Layer Pattern
Each feature has a dedicated service file:
- `auth-service.ts`: Authentication operations
- `product-service.ts`: Product CRUD operations
- `order-service.ts`: Order management
- `customer-service.ts`: Customer operations
- And more...

### API Integration Features
- **Interceptors**: Token injection and error handling
- **Error Handling**: Centralized error management
- **Loading States**: Consistent loading indicators
- **Caching**: React Query caching strategy

## Component Architecture

### Component Categories

1. **Page Components** (`/pages`)
   - Top-level route components
   - Handle data fetching and state
   - Compose smaller components

2. **Feature Components** (`/components/[feature]`)
   - Feature-specific components
   - Examples: CategoryDialog, ProductTable
   - Self-contained with local state

3. **UI Components** (`/components/ui`)
   - Reusable base components
   - Built on Radix UI primitives
   - Styled with Tailwind CSS

4. **Layout Components** (`/components/layout`)
   - Application structure components
   - Sidebar, header, navigation

### Component Patterns
- **Compound Components**: Complex UI with multiple sub-components
- **Controlled Components**: Form inputs with React Hook Form
- **Lazy Loading**: Code splitting for better performance

## Routing System

### Route Structure
```
/login                          - Authentication
/register                       - User registration
/dashboard                      - Main dashboard
├── /products                   - Product listing
├── /products/item-units        - SKU management
├── /products/categories        - Category management
├── /products/companies         - Supplier management
├── /discounts/offers           - Offer management
├── /discounts/spotlights       - Featured items
├── /discounts/coupons          - Coupon system
├── /orders                     - Order management
├── /users/customers            - Customer management
├── /users/delivery-boys        - Delivery personnel
├── /inventory                  - Inventory operations
├── /complaints                 - Complaint handling
├── /deliveryFees              - Delivery pricing
├── /storeAddress              - Location management
└── /storeSettings             - Store configuration
```

### Route Protection
- All `/dashboard/*` routes are protected
- Unauthenticated users redirected to `/login`
- Role-based route access (planned)

## State Management

### React Query (TanStack Query)
- **Server State**: All API data managed by React Query
- **Caching**: Intelligent cache management
- **Background Refetching**: Keep data fresh
- **Optimistic Updates**: Instant UI feedback

### Local State Management
- **useState**: Component-level state
- **useContext**: Auth state via AuthContext
- **React Hook Form**: Form state management
- **Custom Hooks**: Shared stateful logic

### Data Flow
1. Components request data via custom hooks
2. Hooks use React Query to fetch/cache data
3. Services handle API communication
4. UI updates automatically on data changes

## UI/UX Design

### Design System
- **Consistent Color Palette**: Primary, secondary, accent colors
- **Typography Scale**: Hierarchical text sizing
- **Spacing System**: 4px base unit
- **Component Variants**: Multiple styles per component

### Responsive Design
- **Mobile-First**: Optimized for mobile devices
- **Breakpoints**: sm, md, lg, xl, 2xl
- **Adaptive Layouts**: Different layouts per screen size
- **Touch-Friendly**: Large tap targets on mobile

### Accessibility
- **ARIA Labels**: Screen reader support
- **Keyboard Navigation**: Full keyboard access
- **Focus Management**: Clear focus indicators
- **Color Contrast**: WCAG compliant colors

### Internationalization (i18n)
- **Languages**: English and Arabic
- **RTL Support**: Full right-to-left layout
- **Date/Time Formatting**: Locale-specific formats
- **Number Formatting**: Currency and number localization

## Development Setup

### Prerequisites
- Node.js 18+ 
- npm or yarn or bun

### Installation
```bash
# Clone the repository
git clone https://github.com/a7mdelbanna/Mass_shop_v2_react.git

# Navigate to project directory
cd Mass_shop_v2_react

# Install dependencies
npm install

# Start development server
npm run dev
```

### Available Scripts
- `npm run dev`: Start development server
- `npm run build`: Build for production
- `npm run build:dev`: Build for development
- `npm run build:prod`: Build for production
- `npm run preview`: Preview production build
- `npm run lint`: Run ESLint

### Environment Variables
Create a `.env` file:
```env
VITE_API_BASE_URL=http://your-api-url/RetailAPI
VITE_APP_MODE=development
```

## Key Modules

### 1. Product Module
- **Retail Products**: Individual product management
- **Wholesale Products**: Bulk product handling
- **Product Variants**: Size, color, flavor options
- **Image Management**: Multiple product images
- **Pricing**: Flexible pricing models

### 2. Order Module
- **Order Creation**: Manual and customer orders
- **Order Status**: Pending → Processing → Delivered
- **Payment Processing**: Multiple payment methods
- **Invoice Generation**: Automated invoicing

### 3. Inventory Module
- **Stock Tracking**: Real-time inventory levels
- **Low Stock Alerts**: Automated notifications
- **Stock Adjustments**: Add/remove inventory
- **Transfer Management**: Inter-location transfers

### 4. Customer Module
- **Customer Profiles**: Detailed customer information
- **Purchase History**: Complete order history
- **Loyalty Points**: Customer reward system
- **Customer Groups**: Segmentation for marketing

### 5. Analytics Module
- **Sales Analytics**: Revenue and growth metrics
- **Product Performance**: Best/worst sellers
- **Customer Analytics**: Purchase patterns
- **Inventory Analytics**: Stock turnover rates

## Security Considerations

### Current Security Features
- **JWT Authentication**: Token-based auth
- **Protected Routes**: Route-level security
- **API Security**: HTTPS communication
- **Input Validation**: Zod schema validation

### Recommended Improvements
1. Implement proper JWT with backend
2. Add refresh token mechanism
3. Implement CSRF protection
4. Add rate limiting
5. Implement proper RBAC
6. Add audit logging
7. Implement data encryption

## Performance Optimizations

### Current Optimizations
- **Code Splitting**: Lazy loading routes
- **React Query Caching**: Intelligent data caching
- **Image Optimization**: Lazy loading images
- **Bundle Optimization**: Tree shaking with Vite

### Recommended Optimizations
1. Implement virtual scrolling for large lists
2. Add service worker for offline support
3. Implement image CDN
4. Add Redis caching layer
5. Optimize bundle size further

## Future Enhancements

### Planned Features
1. **Multi-Store Support**: Manage multiple locations
2. **Advanced Analytics**: AI-powered insights
3. **Mobile App**: Native mobile applications
4. **POS Integration**: Point of sale system
5. **Accounting Integration**: QuickBooks/Xero
6. **Email Marketing**: Customer engagement
7. **Warehouse Management**: Advanced inventory
8. **B2B Portal**: Customer self-service

### Technical Improvements
1. **Micro-Frontend Architecture**: Module federation
2. **GraphQL Integration**: Flexible data fetching
3. **Real-time Updates**: WebSocket integration
4. **PWA Features**: Offline functionality
5. **Testing Suite**: Comprehensive tests
6. **CI/CD Pipeline**: Automated deployment

## Conclusion

MasShop React is a comprehensive e-commerce management system designed for flexibility and scalability. It provides a solid foundation for retail and wholesale operations with room for growth and customization based on specific business needs.