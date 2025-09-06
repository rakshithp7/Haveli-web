# Development Roadmap

## Project Updates

### 2024-10-XX: Order Flow Improvements

#### Completed Changes

- Restructured menu and ordering functionality:
  - Moved menu item display from menu page to order page
  - Created a simplified menu page that will showcase menu pictures
  - Integrated shadcn's Sheet component for cart functionality
  - Enhanced cart interface with slide-out sheet
  - Improved mobile responsiveness of the order flow
  - Simplified menu page structure for future visual enhancements
  - Created side-by-side layout for menu items and checkout form

### 2024-10-XX: Navigation and Cart Updates

#### Completed Changes

- Modified cart icon placement:
  - Moved cart icon from navbar links to a floating position
  - Added fixed positioning in the top-right corner of the screen
  - Implemented adaptive styling based on page scroll state
  - Enhanced visibility with background and shadow effects
  - Maintained consistent theming for light/dark modes

### 2024-10-XX: Menu Page Enhancements

#### Completed Changes

- Improved menu page styling and usability:
  - Centered menu tabs for better visual alignment
  - Added category icons to each tab for improved navigation
  - Implemented a search feature for menu items
  - Enhanced mobile responsiveness with container layout
  - Added filter functionality to search both item names and descriptions
  - Improved tab component to support custom content with icons
  - Restructured tabs layout for better visual organization
  - Refined search input styling with magnifying glass icon
  - Implemented section-based menu display showing all items grouped by category
  - Added smooth scrolling navigation when clicking on category tabs
  - Enhanced tabs with active state that updates based on current scroll position
  - Improved search results display with "no results" feedback
  - Added fixed position tabs that remain at the top while scrolling
  - Adjusted scroll offsets and section margins for better navigation experience
  - Repositioned search bar to appear side-by-side with category tabs for better space utilization
  - Implemented responsive layout where search appears next to tabs on desktop and stacks on mobile
  - Simplified DOM structure by removing unnecessary nested divs and components
  - Fixed tab triggers layout to ensure horizontal alignment

## Previous Updates

### 2024-09-XX: Next.js and React Update

#### Completed Changes

- Updated Next.js from 15.0.0 to 15.3.1
- Updated React from 18.3.1 to 19.0.0
- Updated React DOM from 18.3.1 to 19.0.0
- Updated @types/react to ^19.2.3
- Updated eslint-config-next to 15.3.1
- Updated Next.js config to enable Turbo for improved build performance

#### Breaking Changes to Address

- React 19:
  - Deprecated `element.ref` access: Need to use `element.props.ref` instead
  - New JSX transform is required
- Next.js 15:
  - APIs like `cookies`, `headers`, and `params` are now asynchronous
  - By default, `fetch` requests, GET Route Handlers, and client navigations are no longer cached

#### New Features Available

- React 19:
  - React Compiler
  - Actions feature
  - New hooks: `useActionState`, `useFormStatus`, `useOptimistic`
- Next.js 15:
  - Stable release of Turbopack
  - Enhanced `<Form>` component
  - Improved codemod CLI for migration

## Pending Tasks

- Test the application with the updated dependencies
- Address any breaking changes in the codebase
- Consider implementing new features where applicable
- Add menu images to the simplified menu page

## Recent Updates

### 2024-10-XX: Navigation Enhancements

#### Completed Changes

- Added smooth animated underlines to navigation links:
  - Created reusable CSS classes for link hover animations
  - Applied growing underline effect that expands from left to right
  - Implemented consistent animations across all navbar links
  - Used CSS pseudo-elements and transitions for smooth effects
  - Maintained color scheme consistency with existing design
  - Ensured animations work in both light and dark modes

### 2024-10-XX: Business Hours Update & Real-Time Availability

#### Completed Changes

- Added real-time open status indicator:
  - Created a dynamic OpenStatusBadge component that shows if the restaurant is currently open
  - Implemented live countdown timer showing when restaurant will open or close
  - Used color-coded badges (green for open, red for closed) with pulsing animation for better visibility
  - Added smart time formatting that adapts to show minutes, hours, or next opening day
  - Integrated with business hours to handle lunch and dinner split schedules
  - Made component reusable across the site with customizable display options

### 2024-10-XX: Location & Business Hours Update

#### Completed Changes

- Updated restaurant location information on the homepage with the correct address: 1251 E Fowler Ave, Tampa, FL 33612
- Updated Google Maps embed with the actual restaurant location
- Updated business hours to reflect accurate split hours for lunch and dinner service:
  - Monday: 11:30am–3pm, 5pm–10pm
  - Tuesday: Closed
  - Wednesday: 11:30am–3pm, 5pm–10pm
  - Thursday: 11:30am–3pm, 5pm–10pm
  - Friday: 11:30am–3pm, 5pm–11pm
  - Saturday: 11:30am–3pm, 5pm–11pm
  - Sunday: 11:30am–3pm, 5pm–10pm
- Redesigned the Hours & Location section:
  - Added a "Visit Us" heading with branded styling
  - Implemented cards with hover effects and shadows
  - Added icons for both hours and location sections
  - Created a visual distinction for closed days
  - Added a "Get Directions" button linking to Google Maps
  - Improved overall layout with better spacing and visual hierarchy
- Enhanced the Testimonials section:
  - Added gradient background effect
  - Redesigned heading with brand accent and decorative underline
  - Improved card design with shadows and hover effects
  - Added decorative quotation mark and avatar placeholder
  - Included "Verified Customer" label for social proof
  - Improved overall spacing and typography
  - Added star ratings to testimonials (10/14/2024)
  - Enhanced testimonial cards with professional review design:
    - Star rating display
    - Improved card layout with white backdrop and blur effect
    - Added dates to testimonials
    - Implemented text truncation with line-clamp
    - Added "Read All Reviews" button
    - Expanded testimonial text content for better presentation
- Footer updates (10/16/2024):
  - Redesigned layout with three-column structure
  - Added restaurant description
  - Updated contact information with accurate address and contact details
  - Added comprehensive business hours display
  - Added social media links
  - Enhanced styling with background color and improved spacing
  - Marked closed days with distinct color for better visibility
  - Added Lucide React icons for visual enhancement:
    - Phone icon for contact section
    - Map pin, phone and mail icons for contact details
    - Social media icons for Instagram and Facebook links
  - Replaced text header with restaurant logo:
    - Added Next.js Image component for optimized logo loading
    - Made logo clickable with link to homepage
    - Ensured proper sizing for responsive display
  - Reorganized social media links to display centered at bottom of footer
  - Enhanced social media icons with interactive effects:
    - Added brand colors to social media icons on hover (Instagram pink, Facebook blue)
    - Implemented group hover effects for coordinated text and icon color changes
    - Added smooth transition animations for color changes
