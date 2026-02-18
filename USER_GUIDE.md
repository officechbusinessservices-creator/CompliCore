# CompliCore User Guide

Welcome to CompliCore - a comprehensive, compliance-first rental platform architecture. This guide will help you navigate and use the platform effectively.

## Table of Contents

1. [Getting Started](#getting-started)
2. [Platform Overview](#platform-overview)
3. [Key Features](#key-features)
4. [User Roles](#user-roles)
5. [Navigation Guide](#navigation-guide)
6. [Using the Prototype](#using-the-prototype)
7. [FAQ](#faq)

## Getting Started

### Accessing the Platform

Visit the platform at your deployed URL or run locally:

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Open browser to http://localhost:3000
```

### First Steps

1. **Explore the Homepage** - Get an overview of the platform's capabilities
2. **View Documentation** - Browse the 8 comprehensive architecture documents
3. **Try the Prototype** - Experience the booking flow and features
4. **Review Diagrams** - Understand the system architecture visually

## Platform Overview

CompliCore is built on four core principles:

### 🔒 Privacy by Design
- GDPR/CCPA compliant from the ground up
- Data minimization and consent-first approach
- Encrypted data at rest and in transit

### ☁️ Vendor Neutral
- Multi-cloud ready architecture
- Swappable components and open standards
- No vendor lock-in

### 🤖 AI with Guardrails
- Transparent, explainable AI decisions
- Human oversight for all critical operations
- Ethical AI implementation

### 🛡️ Security First
- Zero-trust architecture
- Encryption everywhere
- Comprehensive audit logging

## Key Features

### Core Platform Features

**Listing Management**
- Create and manage property listings
- Upload photos and descriptions
- Set amenities and house rules
- Manage availability calendar

**Booking Engine**
- Real-time availability checking
- Instant booking or request-to-book
- Automated pricing calculations
- Guest screening and verification

**Payment Processing**
- Secure payment handling (PCI DSS compliant)
- Multiple payment methods
- Automated payouts to hosts
- Transaction history and reporting

**Guest Communications**
- Real-time messaging system
- Automated message templates
- Booking confirmations and reminders
- Review and rating system

### AI-Powered Features

**Dynamic Pricing**
- Market-based price optimization
- Seasonal adjustments
- Demand forecasting
- Competitor analysis

**Smart Messaging**
- AI-suggested responses
- Automated guest communications
- Sentiment analysis
- Multi-language support

**Listing Optimization**
- SEO recommendations
- Photo quality analysis
- Description improvements
- Amenity suggestions

## User Roles

### 👤 Guest
**What you can do:**
- Search and browse properties
- Filter by location, price, amenities
- Book accommodations
- Message hosts
- Leave reviews
- Manage bookings

**Getting Started:**
1. Browse properties on the homepage
2. Use filters to narrow your search
3. View property details
4. Book your stay
5. Communicate with your host

### 🏠 Host
**What you can do:**
- Create and manage listings
- Set pricing and availability
- Accept/decline booking requests
- Communicate with guests
- Receive payouts
- View analytics

**Getting Started:**
1. Create your first listing
2. Upload photos and details
3. Set your pricing strategy
4. Manage your calendar
5. Respond to booking requests

### 🏢 Property Manager
**What you can do:**
- Manage multiple properties
- Team collaboration tools
- Owner reporting
- Bulk operations
- API access
- Advanced analytics

**Getting Started:**
1. Set up your portfolio
2. Invite team members
3. Configure automation rules
4. Generate owner reports
5. Monitor performance

### ⚙️ Admin
**What you can do:**
- User management
- Content moderation
- Platform analytics
- Support tools
- System configuration
- Compliance monitoring

## Navigation Guide

### Main Navigation

**Homepage (`/`)**
- Platform overview
- Key features and capabilities
- Quick links to all sections

**Architecture Diagrams (`/diagrams`)**
- Interactive Mermaid diagrams
- System architecture visualization
- Data flow diagrams
- RBAC structure

**Prototype (`/prototype`)**
- Working booking prototype
- Property search and filtering
- Booking flow demonstration
- Feature showcases

**API Documentation (`/api-docs`)**
- Complete API reference
- 30+ endpoints documented
- Request/response examples
- Authentication guide

### Prototype Features

Access various prototype features:

- `/prototype/dashboard` - Host dashboard
- `/prototype/reservations` - Booking management
- `/prototype/pricing` - Dynamic pricing tools
- `/prototype/messages` - Guest messaging
- `/prototype/reviews` - Review management
- `/prototype/analytics` - Performance analytics
- `/prototype/calendar-sync` - Calendar integration
- `/prototype/smart-pricing` - AI pricing suggestions

### Landing Pages

Role-specific landing pages:

- `/landing/guest` - Guest-focused features
- `/landing/host` - Host benefits and tools
- `/landing/enterprise` - Enterprise solutions

## Using the Prototype

### Property Search

1. **Navigate to `/prototype`**
2. **Use the search bar** to enter location
3. **Apply filters:**
   - Price range
   - Property type
   - Amenities
   - Guest capacity
4. **View results** with photos and details
5. **Click a property** to see full details

### Booking Flow

1. **Select dates** on the calendar
2. **Enter guest count**
3. **Review pricing breakdown**
4. **Add payment information**
5. **Confirm booking**
6. **Receive confirmation**

### Host Dashboard

1. **Navigate to `/prototype/dashboard`**
2. **View key metrics:**
   - Upcoming bookings
   - Revenue statistics
   - Occupancy rates
   - Guest reviews
3. **Manage bookings** from the calendar
4. **Respond to messages**
5. **Update listings**

### Dynamic Pricing

1. **Go to `/prototype/pricing`**
2. **Set base price** for your property
3. **Configure rules:**
   - Seasonal adjustments
   - Weekend pricing
   - Length-of-stay discounts
   - Last-minute deals
4. **Review AI suggestions**
5. **Apply changes**

## FAQ

### General Questions

**Q: Is this a production-ready platform?**
A: This is a comprehensive architecture and prototype. It includes production-ready components but requires customization for your specific needs.

**Q: What technologies are used?**
A: Next.js 14+, TypeScript, Tailwind CSS, Fastify, PostgreSQL, Redis, and various AI/ML services.

**Q: Is it mobile-friendly?**
A: Yes, the entire platform is fully responsive and works on all devices.

### Technical Questions

**Q: How do I deploy this?**
A: See the [DEPLOYMENT.md](./DEPLOYMENT.md) guide for detailed instructions.

**Q: Can I customize the design?**
A: Yes, the platform uses Tailwind CSS and is fully customizable.

**Q: What about data privacy?**
A: The platform is built with GDPR/CCPA compliance, including data minimization, consent management, and encryption.

**Q: How do I add new features?**
A: The modular architecture allows easy feature additions. See the documentation in `/docs` for guidance.

### Integration Questions

**Q: Can I integrate with Airbnb/VRBO?**
A: Yes, the architecture includes OTA channel integration capabilities.

**Q: What payment providers are supported?**
A: The platform is designed to work with Stripe, PayPal, and other major payment processors.

**Q: Can I use my existing PMS?**
A: Yes, the platform includes PMS integration capabilities via API.

**Q: How do I use the AI orchestrator API?**
A: Use the `/api/ai/orchestrate` endpoint to route requests to AI Engineering Hub services. Example:

```bash
curl -X POST http://localhost:4000/api/ai/orchestrate \
  -H "Content-Type: application/json" \
  -d '{"prompt":"Summarize market trends","metadata":{"fileType":"text"}}'
```

Set service base URLs in `backend/.env.example` (AGENTIC_RAG_SERVICE_URL, CORRECTIVE_RAG_SERVICE_URL, FIRECRAWL_SERVICE_URL, OCR_SERVICE_URL, AUDIO_SERVICE_URL, YOUTUBE_SERVICE_URL, FINANCE_SERVICE_URL, NEWS_SERVICE_URL, REASONING_SERVICE_URL).

## Support & Resources

### Documentation

- **Architecture Docs** - `/docs` folder contains 8 detailed documents
- **API Reference** - Available at `/api-docs`
- **Database Schema** - See `/database/schema.sql`
- **OpenAPI Spec** - Available at `/specs/openapi.yaml`

### Getting Help

- **Email**: support@complicore.com
- **Documentation**: Review the `/docs` folder
- **GitHub Issues**: Report bugs or request features
- **Community**: Join our community forums

### Additional Resources

- **Deployment Guide**: [DEPLOYMENT.md](./DEPLOYMENT.md)
- **README**: [README.md](./README.md)
- **Architecture Overview**: `/docs/01-ARCHITECTURE.md`
- **Feature Roadmap**: `/docs/05-ROADMAP.md`
- **Public APIs Catalog**: [PUBLIC_APIS.md](./PUBLIC_APIS.md)

## Best Practices

### For Hosts

1. **Complete your profile** with accurate information
2. **Upload high-quality photos** of your property
3. **Set competitive pricing** using AI suggestions
4. **Respond quickly** to guest inquiries
5. **Maintain your calendar** to avoid double bookings
6. **Provide excellent service** to earn positive reviews

### For Guests

1. **Read property descriptions** carefully
2. **Check reviews** from previous guests
3. **Communicate clearly** with hosts
4. **Respect house rules** and property
5. **Leave honest reviews** to help others
6. **Book early** for popular destinations

### For Property Managers

1. **Standardize processes** across properties
2. **Use automation** to save time
3. **Monitor performance** regularly
4. **Train your team** on platform features
5. **Generate reports** for property owners
6. **Stay compliant** with local regulations

## Security Tips

- **Use strong passwords** with 12+ characters
- **Enable two-factor authentication** when available
- **Don't share login credentials** with others
- **Review account activity** regularly
- **Report suspicious activity** immediately
- **Keep contact information** up to date

## Accessibility

The platform is designed to be accessible to all users:

- **Keyboard navigation** supported throughout
- **Screen reader compatible**
- **High contrast mode** available
- **Adjustable text sizes**
- **Alternative text** for all images

## Updates & Changelog

The platform is continuously improved. Check the following for updates:

- **Release Notes** - Major version updates
- **Changelog** - Detailed change history
- **Roadmap** - Upcoming features

## Feedback

We value your feedback! Help us improve by:

- **Reporting bugs** via GitHub issues
- **Suggesting features** through our feedback form
- **Sharing your experience** in community forums
- **Contributing** to the open-source project

---

**Last Updated**: February 2026  
**Version**: 1.0  
**Platform**: CompliCore

For the latest updates and documentation, visit our website or check the GitHub repository.
