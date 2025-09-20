# ETopUp Mobile App - Complete Page Documentation

## Table of Contents
1. [Authentication & Onboarding](#authentication--onboarding)
2. [Main Dashboard & Navigation](#main-dashboard--navigation)
3. [Core Services](#core-services)
4. [Financial Services](#financial-services)
5. [Reports & Analytics](#reports--analytics)
6. [User Management](#user-management)
7. [Settings & Configuration](#settings--configuration)
8. [Support & Help](#support--help)

---

## Authentication & Onboarding

### 1. Splash Screen (`app/splash.tsx`)
**Purpose**: Initial loading screen with company branding
**Features**:
- Company logo display (CWS logo from external URL)
- Blue theme background (#006bb6)
- 2-second display duration
- Auto-navigation to login screen
- Status bar configuration

### 2. Login Screen (`app/login.tsx`)
**Purpose**: User authentication with multiple login methods
**Features**:
- **Biometric Authentication**: Face/fingerprint login with fallback
- **PIN Login**: 4-digit PIN authentication with visibility toggle
- **OTP Login**: SMS-based verification system
- **Account Lockout**: Security feature after failed attempts
- **Marketing Carousel**: Promotional content display
- **Responsive Design**: Adapts to different screen sizes
- **Error Handling**: User-friendly error messages

**UI Components**:
- Gradient header with promotional cards
- Company logo and branding
- Multiple authentication method cards
- Input validation and feedback
- Loading states and animations

### 3. Digital Onboarding (`app/digital-onboard.tsx`)
**Purpose**: Complete customer onboarding process for SIM sales
**Features**:
- **6-Step Process**:
  1. **Photo Capture**: Customer photo using device camera
  2. **ID Scanning**: Document scanning with camera
  3. **Customer Details**: Auto-filled form with validation
  4. **Package Selection**: Service plan selection
  5. **SIM Selection**: Available SIM card selection with search
  6. **Confirmation**: Digital signature and final review

**Customer Types Supported**:
- **Local**: Seychelles citizens (requires district/sub-district)
- **GOP Holder**: Work permit holders (requires district/sub-district)
- **Tourist**: Visitors (requires nationality selection)

**Advanced Features**:
- Camera integration with frame overlay
- QR code scanning for SIM selection
- Digital signature capture
- Form validation based on customer type
- Step-by-step progress indicator
- Data persistence across steps

---

## Main Dashboard & Navigation

### 4. Dashboard (`app/(tabs)/dashboard.tsx`)
**Purpose**: Main application hub with quick access to all services
**Features**:
- **User Profile**: Balance display with visibility toggle
- **Marketing Carousel**: Promotional banners with auto-scroll
- **Service Grid**: Quick access to all major functions
- **Favorites System**: Customizable shortcuts
- **Notifications**: Badge with unread count
- **Hamburger Menu**: Side navigation access

**Services Available**:
- Purchase Package
- Bill Pay
- TopUp
- SIM Inventory
- SIM Sale
- Job Card

**UI Elements**:
- Dynamic header with user info
- Scrollable content with pull-to-refresh
- Floating favorites bar
- Theme-aware styling

---

## Core Services

### 5. SIM Sale (`app/sim-sale.tsx`)
**Purpose**: Customer type selection for SIM onboarding
**Features**:
- **Customer Type Cards**: Visual selection interface
- **Animated Interactions**: Smooth transitions and feedback
- **Favorites Integration**: Add to favorites functionality
- **Responsive Design**: Tablet and mobile optimized
- **Navigation**: Direct routing to digital onboarding

**Customer Types**:
- **Local**: Seychelles citizens with full service access
- **GOP Holder**: Work permit holders with authorized employment
- **Tourist**: Visitors with temporary connectivity needs

### 6. TopUp (`app/(tabs)/topup.tsx`)
**Purpose**: Mobile account recharge functionality
**Features**:
- **Number Input**: +248 prefix with 7-digit validation
- **QR Code Scanning**: Quick number entry via QR
- **Standard Amounts**: Predefined SCR values (50-2000)
- **Custom Amount**: Manual entry option
- **Transaction Summary**: Review before confirmation
- **Authentication**: PIN/biometric verification
- **Success Feedback**: Confirmation with haptic feedback

**Validation**:
- Mobile number format validation
- Amount range checking
- Network connectivity verification

### 7. Purchase Packages (`app/purchase-packages.tsx`)
**Purpose**: Mobile service package selection and purchase
**Features**:
- **Number Type Detection**: Auto-detect prepaid/postpaid
- **Category Filtering**: Popular, Data, Voice, Combo
- **Package Comparison**: Feature-by-feature breakdown
- **Dynamic Pricing**: Real-time package information
- **Secure Checkout**: Multi-step confirmation process

**Package Categories**:
- **Popular**: Most-used packages with best value
- **Data**: High-speed internet packages
- **Voice**: Calling-focused packages
- **Combo**: Combined data, voice, and SMS packages

**Package Information**:
- Price and validity period
- Data allowances and speeds
- Voice minutes (local/international)
- SMS allowances
- Additional features

### 8. Bill Pay (`app/bill-pay.tsx`)
**Purpose**: Utility bill payment system
**Features**:
- **Account Lookup**: Automatic bill retrieval
- **Service Types**: Broadband (Fiber/ADSL) and Mobile
- **Payment Options**: Full payment or custom amount
- **Bill Details**: Complete service information
- **Due Date Alerts**: Visual indicators for urgent bills
- **Payment History**: Transaction tracking

**Supported Services**:
- **Broadband**: Fiber Pro, ADSL Standard, Fiber Ultra
- **Mobile**: Postpaid plans and business accounts

**Bill Information Display**:
- Customer name and service address
- Plan details and data usage
- Due dates with urgency indicators
- Payment history and status

---

## Financial Services

### 9. My Wallets (`app/(tabs)/my-wallet.tsx`)
**Purpose**: Account balance management and transaction history
**Features**:
- **Dual Wallet System**:
  - **Recharge Balance**: Prepaid services
  - **Bill-Pay Balance**: Postpaid services
- **Balance Visibility**: Toggle for privacy
- **Fund Requests**: Request balance top-ups
- **Transaction History**: Filtered transaction list
- **Real-time Updates**: Live balance information

**Transaction Types**:
- TopUp transactions
- Bill payments
- Package purchases
- Fund transfers
- SMS and data purchases

**Filtering Options**:
- All transactions
- Prepaid balance only
- Postpaid balance only
- Date range filtering

---

## Reports & Analytics

### 10. Reports (`app/(tabs)/reports.tsx`)
**Purpose**: Business analytics and performance tracking
**Features**:
- **Time Period Selection**: Today, Week, Month, Custom
- **Report Categories**: 6 main business metrics
- **Interactive Cards**: Clickable for detailed views
- **Trend Indicators**: Performance comparison
- **Export Functionality**: Data export options
- **Filter Options**: Customizable report parameters

**Available Reports**:
- **Total Sale**: Revenue tracking with growth indicators
- **Total Transactions**: Transaction volume analysis
- **Earnings**: Commission and profit tracking
- **SIM Stock**: Inventory levels and alerts
- **Airtime Purchase**: Recharge volume tracking
- **Balance**: Account balance trends

**Detailed Report Pages**:
- Total Sale (`app/total-sale.tsx`)
- Total Transactions (`app/total-transactions.tsx`)
- Earnings (`app/earnings.tsx`)
- SIM Stock (`app/sim-stock.tsx`)
- Airtime Purchase (`app/airtime-purchase.tsx`)
- Balance (`app/balance.tsx`)

---

## User Management

### 11. Profile Settings (`app/profile-settings.tsx`)
**Purpose**: User account management and security settings
**Features**:
- **QR Code Generation**: Personal QR code for identification
- **Profile Information**: Email, phone, address management
- **Transaction PIN**: Security PIN setup and management
- **Photo Management**: Profile picture updates
- **Edit Mode**: Toggle for profile editing

**Security Features**:
- **Transaction PIN**: 4-digit PIN for secure transactions
- **PIN Management**: Setup, change, and disable options
- **Biometric Integration**: Fingerprint/face authentication
- **Account Lockout**: Security after failed attempts

### 12. Notifications (`app/notifications.tsx`)
**Purpose**: System notifications and alerts management
**Features**:
- **Notification Types**: Info, Success, Warning, Promotion
- **Filter Options**: All notifications or unread only
- **Mark as Read**: Individual and bulk actions
- **Delete Functionality**: Remove unwanted notifications
- **Real-time Updates**: Live notification delivery

**Notification Categories**:
- **Success**: Transaction confirmations, activations
- **Warning**: Low balance, due date alerts
- **Info**: System maintenance, feature updates
- **Promotion**: Special offers, discounts

---

## Settings & Configuration

### 13. Themes (`app/themes.tsx`)
**Purpose**: Application appearance customization
**Features**:
- **Theme Selection**: Ocean Blue and Royal Purple
- **Color Scheme**: Light/dark mode support
- **Real-time Preview**: Instant theme application
- **Custom Themes**: Future expansion capability
- **Persistent Settings**: Theme preference storage

**Available Themes**:
- **Ocean Blue**: Default blue color scheme (#0584dc)
- **Royal Purple**: Alternative purple scheme (#6366F1)

### 14. My Wallets Management (`app/my-wallets.tsx`)
**Purpose**: Extended wallet management functionality
**Features**:
- **Multiple Wallet Types**: Different service categories
- **Balance Transfers**: Inter-wallet transfers
- **Transaction Limits**: Spending controls
- **Auto-recharge**: Automatic balance top-up
- **Spending Analytics**: Usage pattern analysis

---

## Support & Help

### 15. Contact Us (`app/(tabs)/contact-us.tsx`)
**Purpose**: Customer support and communication channels
**Features**:
- **Multiple Contact Methods**:
  - Phone support (+248 428 4000)
  - Email support (info@cwseychelles.com)
  - WhatsApp integration
  - Office location with map
  - Website link
- **Business Hours**: Operating schedule display
- **Emergency Support**: 24/7 urgent assistance
- **Direct Actions**: One-tap calling, emailing

### 16. Help & Support (`app/help-support.tsx`)
**Purpose**: Self-service help and FAQ system
**Features**:
- **FAQ Section**: Expandable question/answer pairs
- **Contact Options**: Multiple support channels
- **Support Hours**: 24/7 availability information
- **Ticket System**: Support request creation
- **Search Functionality**: Find specific help topics

**FAQ Topics**:
- Account top-up procedures
- Payment method information
- Balance checking methods
- Transaction troubleshooting
- PIN reset procedures

### 17. Feedback (`app/feedback.tsx`)
**Purpose**: User feedback collection and rating system
**Features**:
- **Rating System**: Star-based app rating
- **Feedback Categories**: Bug reports, suggestions, compliments
- **Text Input**: Detailed feedback submission
- **Attachment Support**: Screenshot and file uploads
- **Response Tracking**: Feedback status updates

---

## Additional Utility Pages

### 18. About (`app/about.tsx`)
**Purpose**: Application and company information
**Features**:
- App version and build information
- Company details and history
- Terms of service links
- Privacy policy access
- License information

### 19. Onboarding Success (`app/onboarding-success.tsx`)
**Purpose**: Completion confirmation for digital onboarding
**Features**:
- Success animation and feedback
- Customer information summary
- Next steps guidance
- Account activation status
- Welcome message

### 20. Job Card (`app/job-card.tsx`)
**Purpose**: Service request and maintenance tracking
**Features**:
- Service request creation
- Job status tracking
- Technician assignment
- Appointment scheduling
- Progress updates

### 21. SIM Inventory (`app/sim-inventory.tsx`)
**Purpose**: SIM card stock management
**Features**:
- Available SIM count
- SIM type categorization
- Stock level alerts
- Reorder notifications
- Inventory tracking

### 22. Fund Request (`app/fund-request.tsx`)
**Purpose**: Balance top-up request system
**Features**:
- Request amount specification
- Approval workflow
- Request status tracking
- Payment method selection
- Transaction history

---

## Technical Architecture

### Navigation Structure
- **Tab Navigation**: Main app sections (Dashboard, TopUp, Reports, Contact Us, My Wallet)
- **Stack Navigation**: Detailed pages and modals
- **Modal Navigation**: Overlays and confirmations

### State Management
- **React Query**: Server state management
- **Context API**: Global app state
- **AsyncStorage**: Persistent local storage
- **Theme Context**: Appearance management

### Security Features
- **Transaction PIN**: 4-digit security PIN
- **Biometric Authentication**: Face/fingerprint support
- **Account Lockout**: Failed attempt protection
- **Secure Storage**: Encrypted data storage

### UI/UX Features
- **Responsive Design**: Mobile and tablet support
- **Theme System**: Customizable appearance
- **Haptic Feedback**: Touch response
- **Loading States**: Progress indicators
- **Error Handling**: User-friendly error messages
- **Offline Support**: Limited offline functionality

### Integration Points
- **Camera API**: Photo capture and QR scanning
- **Contacts API**: Phone number integration
- **SMS API**: OTP verification
- **Payment Gateway**: Secure transaction processing
- **Push Notifications**: Real-time alerts

---

## Data Models

### User Profile
```typescript
interface User {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  profileImage?: string;
  accountType: 'individual' | 'business';
  status: 'active' | 'suspended';
}
```

### Transaction
```typescript
interface Transaction {
  id: string;
  type: 'topup' | 'payment' | 'purchase';
  amount: number;
  currency: 'SCR';
  status: 'pending' | 'completed' | 'failed';
  timestamp: string;
  description: string;
}
```

### Package
```typescript
interface Package {
  id: string;
  name: string;
  price: number;
  validity: string;
  features: string[];
  category: 'popular' | 'data' | 'voice' | 'combo';
  numberType: 'Prepaid' | 'Postpaid';
}
```

This documentation provides a comprehensive overview of all pages and functionality within the ETopUp mobile application, serving as a complete reference for developers, testers, and stakeholders.