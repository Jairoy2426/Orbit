# Orbit — Personal Productivity Command Center

Orbit is a personal productivity web application built for engineers and professionals. It combines task management, calendar-based planning, a job application pipeline, and development project workspaces into a unified command center.

Orbit answers three questions:
1. **What needs my attention today?**
2. **What should I prioritize next, and why?**
3. **What am I progressing toward across my career and projects?**

---

## 📸 Interface Design & Aesthetics

- **Dark Command Center Theme:** Deep charcoal surfaces (`#080c14`, `#0d1322`), electric blue primary accents (`#3b82f6`), purple highlights, and soft pastel category indicators.
- **Collapsible Sidebar:** Navigation with active counters, quick links to favorite workspaces (Resume, LSSC Website, Genesis, Weazel News, Naukri, LinkedIn), and user profile.
- **Top Header:** Global search, notifications popover with overdue alerts, live date, and Quick Capture trigger.
- **Right Sidebar:** Monthly calendar overview and upcoming agenda items with color-coded category borders.

---

## ⚡ Core Modules & Features

### 1. Dashboard (The Main Workspace)
- **Hero Banner:** Personalized greeting, motivation quote, and remaining task counter.
- **Live Summary Cards:** Real-time calculated counters for Overdue, Today, Job Follow-ups, Active Projects, and Weekly Tasks.
- **Today's Priorities:** Ranked recommended tasks displaying priority badges, effort estimates, project links, and an explanation of *why* each task was recommended.
- **Quick Capture Card:** Inline fast capture with category pills (`Task`, `Job`, `Project`, `Note`) and natural language date recognition (`"tomorrow"`, `"next monday"`, `"every weekday"`).
- **Weekly Calendar Preview:** Compact 7-day calendar displaying tasks as colored cards directly inside date cells.
- **Project Progress:** Active workspaces with completion bars calculated from linked tasks.
- **Job Applications Queue:** Active interview stages and follow-up deadlines.
- **Progress This Week:** Honest velocity meters for completed tasks, applications, and habits.

### 2. Tasks Module
- **Multiple Views:** Kanban Board (`Inbox`, `To Do`, `In Progress`, `Blocked`, `Done`), List View, Today View, Upcoming View, and Overdue View.
- **Full Task Attributes:** Priorities (`Critical`, `High`, `Medium`, `Low`), estimated effort hours, hard vs. flexible deadlines, delay consequences, recurrence rules (`daily`, `weekdays`, `weekly`, `monthly`), tags, and project/career links.

### 3. Career Module (Job Application Tracker)
- **Kanban Pipeline:** `Interested` ➔ `To Apply` ➔ `Applied` ➔ `Follow-up Due` ➔ `Interview` ➔ `Offer` ➔ `Rejected`.
- **Detailed Tracking:** Recruiter contact info, interview stages/dates, resume versions used, salary notes, and job posting URLs.
- **Task Linking:** One-click generation of follow-up tasks without duplicates.
- **Conversion Metrics:** Applications submitted, interview rate %, and offers.

### 4. Projects Module
- Dedicated workspaces for:
  - **Weazel News** (News portal & broadcast platform)
  - **Genesis Real Estate** (Property platform & virtual tours)
  - **LSSC Website** (Portal maintenance & security)
  - **Resume & Career** (Curated technical resumes & portfolio)
- Shared single-source tasks, milestone checkboxes, and repository/live URLs.

### 5. Calendar Module
- Full Month, Week, and Day views.
- Tasks, deadlines, and interviews rendered as colored chips inside day cells.
- Category filters for Projects, Career, and Habits.
- Click any date to view agenda or schedule work.

### 6. Notes Module (Knowledge Base)
- Lightweight notes for interview preparation, server/deployment docs, design tokens, and meeting minutes.
- Markdown formatting, tags, pinning, and links to projects or job applications.

### 7. Daily Planning Engine (Core Differentiator)
- **Deterministic Rules-Based Scoring:** Considers hard deadlines, overdue status, task dependencies, consequences of delay, and recruiter follow-up urgency.
- **Capacity Gauge:** Warns when planned work exceeds daily hours capacity (configurable in Settings).
- **Unfinished Tasks Reassessment:** Detects postponed tasks and guides you to reschedule, cancel, or reprioritize without blind carry-overs.
- **Approval Workflow:** Review and approve the proposed daily plan.

### 8. Analytics
- Honest productivity metrics calculated from real data.
- Task velocity, priority breakdown, and job interview funnel conversion.

### 9. Settings & Persistence
- Configurable capacity limits, deadline strictness, and mindset quotes.
- LocalStorage persistence adapter with full JSON backup export & restore.
- Reset to reference sample dataset at any time.

---

## 🛠️ Technology Stack

- **Framework:** Next.js 16 (App Router, Turbopack)
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4 & custom dark mode tokens
- **Icons:** Lucide React
- **Date Handling:** Date-fns

---

## 🚀 Running the Project Locally

```bash
# Install dependencies
npm install

# Start development server
npm run dev
# Server runs on http://localhost:3000

# Build for production
npm run build

# Start production server
npm run start
```
