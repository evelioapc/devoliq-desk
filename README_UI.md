# Devoliq Desk UI Documentation

## Overview
The frontend has been redesigned to be modern, professional, and responsive, mimicking high-quality SaaS applications like Linear or Vercel. It is built using:
- **Tailwind CSS v4**
- **Shadcn UI** (Component patterns)
- **Radix UI** primitives (Dialog, Dropdown, Slot, etc.)
- **Lucide React** for icons
- **Inertia.js + React**

## Design System

### Colors & Theming
The design system relies on CSS variables defined in `resources/css/app.css`. These variables are mapped to Tailwind's theme in the same file using the `@theme` directive.

- **Primary**: Used for main actions and active states.
- **Secondary**: Used for less prominent actions.
- **Muted**: Used for backgrounds and de-emphasized text.
- **Destructive**: Used for error states or dangerous actions.
- **Card/Popover**: Specific backgrounds for surface layers.

To change the theme, simply update the HSL values in the `:root` block of `resources/css/app.css`.

### Typography
We use **Instrument Sans** as the primary font, falling back to system sans-serif fonts.

## Components directory
Reusable UI components are located in `resources/js/components/ui`. These follow the "copy-paste" philosophy of Shadcn UI but are adapted for this project.

Key components:
- `Button`, `Input`, `Label`: Basic form elements.
- `Card`: Container for grouping content.
- `Table`: Responsive data tables.
- `Badge`: Status indicators.
- `Dialog`, `Sheet`: Modals and slide-overs.
- `DropdownMenu`: Context menus.

## Layout
The main layout is defined in `resources/js/layouts/AppLayout.jsx`.
- **Sidebar**: Defined in `resources/js/components/Sidebar.jsx`. Handles navigation.
- **Top Bar**: Search placeholder and User menu.
- **Mobile**: A generic `Sheet` component is used to show the sidebar on small screens.

## How to Extend
1. **New Page**: Create a file in `resources/js/pages/`.
2. **New UI Component**:
   - Check `resources/js/components/ui` first.
   - If you need something new (e.g., Switch, Select), copy the Shadcn UI implementation and adapt the imports to use our `cn` utility in `@/lib/utils`.
3. **Icons**: Import from `lucide-react`.

## Accessibility
Components use Radix UI primitives where possible to ensure keyboard navigation and screen reader support (e.g., Dialogs trap focus, Dropdowns manage focus).
