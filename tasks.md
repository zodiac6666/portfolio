# Tasks and Milestones - Portfolio Website for Yahya Baji

Based on the PRD, the build runs in seven phases. Below are the milestones and associated tasks for each phase, organized for clear tracking.

---

## Milestone 1: Project Setup
**Goal:** Initialize the repository, set up the development environment, and establish the basic project structure.

- [x] Initialize Vite React project in `portfolio/frontend/`
- [x] Set up Tailwind CSS with dark theme and turquoise accent colors
- [x] Create folder structure as per PRD:
  - `src/components/`: Navbar, Hero, About, Skills, Projects, Contact, Footer
  - `src/pages/admin/`: Login and Messages pages
  - `src/data/`: projects.js, site.js
  - `assets/images/`: for profile and project images
  - `public/`: for cv.pdf
- [x] Create `backend/` directory with `api/` folder
- [x] Set up XAMPP with Apache and MySQL
- [x] Create `database/schema.sql` with `messages` and `admins` tables
- [x] Copy `config.example.php` to `config.php` (template)
- [x] Add `config.php` and `.gitignore` to version control exclusion

**Done when:** `npm run dev` shows an empty dark themed page.

---

## Milestone 2: Static Sections
**Goal:** Build the core page structure with navbar and main sections.

- [x] **Navbar component**:
  - [x] Implement Home, About, Skills, Projects, Contact nav links
  - [x] Smooth scroll to each section
  - [x] Highlight active section in turquoise
  - [x] Add blurred dark background effect on scroll
  - [x] Collapse to menu on mobile
- [x] **Hero section**:
  - [x] Greeting: "Hi, I'm Yahya Baji"
  - [x] Typing animation cycling through roles (Full-Stack Developer, React Developer, PHP & Laravel Developer)
  - [x] Tagline: "I build modern, responsive websites and turn ideas into clean, functional digital experiences."
  - [x] Buttons: View Projects, Contact Me, Download CV (placeholder)
  - [x] Profile photo slot: circle with initials "YB"
- [x] **About section**:
  - [x] Add Yahya's provided text about himself
- [x] **Skills section**:
  - [x] Display icon badges in three groups: Frontend, Backend, Tools
- [x] **Footer section**:
  - [x] Copyright line
  - [x] Low-contrast "Admin" link to `/admin/login`

**Done when:** Every section shows its content and the navbar scrolls smoothly to each one.

---

## Milestone 3: Projects Section
**Goal:** Implement the six project cards with fanned layout and mobile carousel.

- [x] Create six project cards with:
  - [x] Image slots (empty states that look intentional)
  - [x] Project names (from PRD: E-commerce website, Ebook search, To-do list, Weather app, Portfolio, Website for a coffee brand)
  - [x] Short descriptions (to be filled in later)
  - [x] React · PHP tags
  - [x] GitHub and demo link buttons (hidden if no link)
- [x] Implement fanned layout on desktop:
  - [x] Cards overlap at slightly different angles
  - [x] Middle cards highest
  - [x] Hover state: card straightens, lifts, scales up, moves to front with turquoise glow
  - [x] Neighbors shift aside to make room
- [x] Implement mobile/tablet carousel:
  - [x] Horizontal swipe navigation
  - [x] Center card is active with lifted style
  - [x] Keyboard navigation support (Tab focus, lifted state on focus)
- [x] Ensure no hover on touch screens triggers fan behavior

**Done when:** Hovering lifts a card; on a phone the cards swipe horizontally.

---

## Milestone 4: Animations and Interactions
**Goal:** Implement all approved animations with reduced-motion support.

- [x] **Typing animation** in Hero title line:
  - [x] Types and erases role titles in a loop
  - [x] Switches off for "reduce motion" visitors
- [x] **Scroll reveal** for every section and card:
  - [x] Fades in and slides up on first screen entry
  - [x] Reduced-motion support
- [x] **Sticky blurred navbar**:
  - [x] Stays at top of page
  - [x] Gains blurred dark background after scrolling
- [x] **Skill badge hover**:
  - [x] Subtle pop and turquoise glow
- [x] **Fanned project cards** (already in Phase 3, but animations refined here)
- [ ] Test all animations with reduced-motion preference enabled

**Done when:** Each animation in the Animations table works and turns off with reduce motion.

---

## Milestone 5: Backend
**Goal:** Set up the PHP backend, database, and contact form functionality.

- [x] Create MySQL database `portfolio`
- [x] Run `schema.sql` to create `messages` and `admins` tables
- [x] Implement PHP API endpoints:
  - [x] `POST /api/contact.php`: Validate form, save to `messages` table, send email via PHPMailer
  - [x] `POST /api/login.php`: Check email/password, start session
  - [x] `POST /api/logout.php`: End session
  - [x] `GET /api/messages.php`: List messages (optionally by id)
  - [x] `POST /api/delete.php`: Delete message by id (session required)
- [ ] Set up PHPMailer with Gmail app password
- [x] Create `config.php` with database and Gmail settings
- [ ] Test form submission:
  - [ ] Saves entry to MySQL `messages` table
  - [ ] Email arrives in Yahya's Gmail inbox
- [x] Implement server-side validation for form fields
- [x] Add hidden honeypot field and submission rate limiting

**Done when:** A form submission appears in `messages` and in Yahya's Gmail inbox.

---

## Milestone 6: Admin Area
**Goal:** Build the admin login, messages page, and deletion functionality.

- [x] **Admin login page** (`/admin/login`):
  - [x] Email and password fields
  - [x] Login button
  - [x] Clear error message on failed attempt
  - [x] Rate limiting on login attempts
- [x] **Messages page** (`/admin/messages`):
  - [x] List messages newest first
  - [x] Show name, email, preview, and date received
  - [x] Click to open full message
  - [x] Delete button with confirmation step
  - [x] Empty state when no messages
- [x] **Security measures**:
  - [x] Passwords stored hashed with `password_hash()`, never plain text
  - [x] Session checks on every admin endpoint
  - [x] `session_regenerate_id()` after login
  - [x] HttpOnly cookies
  - [ ] CSRF token on delete
- [ ] **Setup first admin account**:
  - [ ] Run setup script or SQL to create initial admin
  - [ ] Password never appears in code

**Done when:** Wrong password is rejected; correct password opens messages page; delete removes the row from MySQL.

---

## Milestone 7: Polish and Testing
**Goal:** Ensure the site works well across devices, meets accessibility standards, and has no errors.

- [ ] **Responsive testing**:
  - [ ] Verify layout from phone to wide desktop
  - [ ] Ensure fanned cards become swipe carousel on touch screens
- [ ] **Accessibility checks**:
  - [ ] Keyboard-navigable (Tab through all interactive elements)
  - [ ] Visible focus states
  - [ ] Readable contrast on dark theme
  - [ ] Alt text on all images
  - [ ] Reduced-motion support confirmed
- [ ] **Performance optimization**:
  - [ ] Compressed and lazy-loaded images
  - [ ] No unused libraries
  - [ ] Fast first load
- [ ] **SEO checks**:
  - [ ] Page title with Yahya's name and role
  - [ ] Meta description
  - [ ] Open Graph tags
- [ ] **Console error check**: No errors in developer tools across all pages
- [ ] **Empty-state review**: All placeholder slots (images, links, CV) look intentional
- [ ] Cross-browser testing (if possible)

**Done when:** The site works on phone and desktop with no console errors.

---

## Additional Notes

- **Content to be provided later**: Yahya's GitHub profile, Gmail address, project descriptions, images, links, and CV file
- **Visual details to finalize**: Exact turquoise shade and font choices
- **Future considerations** (out of scope for v1): Hosting, domain, language switch, project management from admin, blog, testimonials

---

*This tasks.md was generated from the Portfolio Website PRD for Yahya Baji. All milestones and tasks align with the seven-phase build plan specified in the PRD.*
