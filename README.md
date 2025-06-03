# 📋 Long List Form React Challenge Project

## 📦 Overview

This React + Vite application displays and manages a long list of users with editable fields, efficient performance, and clear state management. Built with Material-UI, it emphasizes best practices for scalable React apps.

---

## 🔧 Technical Stack

* React 18
* Vite
* TypeScript *(optional, depending on version)*
* Material-UI (MUI)
* Virtual scroll: `react-window`
* Global state: Context + Reducer (`useReducer`)
* Local (per-row) state: local reducer (`localReducer`)
* Mocked or real API for data persistence
* Regex or validation library for input checks

---

## 🏷 Main Features

* Display a long list of users with:

  * Name
  * Email
  * Phone
  * Country

* Editable per-row fields

* **Per-row Save button** → updates local changes into global context

### Validation Rules

* Name: required, letters only
* Email: valid email format
* Phone: `+<country code><number>` (e.g., `+972123456789`)
* Country: required

### Feedback & Error Handling

* Snackbar or success indicator on save
* Error Snackbar or Alert on failure

### Performance Optimizations

* Virtual scrolling with `react-window`
* Debounced inputs to limit re-rendering
* Memoized selectors/hooks using `useMemo` and `useCallback`

### Code Structure

```
/src
  /components
  /context
  /pages
  /reducers
  /utils
  /api *(optional)*
```

Separate reducer files:

* `usersReducer.js`
* `localReducer.js`

---

## 🚀 Bonus / Future Features

* Search/filtering by name, email, or country
* Pagination *(if not using virtual scroll)*
* Sorting by column headers
* Persist state (localStorage or backend API)
* Unit tests (reducers, components)
* Mock Service Worker (MSW) integration for API testing
* Authentication layer (optional)
* Per-row visual flash on successful save
* Global error boundary or retry mechanism

---

## 💾 Setup & Run

```bash
git clone https://github.com/urikhaimov/long-list-form-react-challenge-project.git
cd https://github.com/urikhaimov/long-list-form-react-challenge-project.git
npm install
npm run dev
```

### Build

```bash
npm run build
```


## 🤝 Contribution

Feel free to open issues or pull requests! Let’s make this project robust and scalable together.

