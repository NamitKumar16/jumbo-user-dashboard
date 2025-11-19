# User Management Dashboard  

A modern, fully-functional **User Management Dashboard** built using **Next.js, TypeScript, TailwindCSS, Radix UI, React Query, Zustand, and Axios**.  
This dashboard allows you to view, search, filter, paginate, add, edit, delete, and inspect detailed information about users — designed like a clean internal tool.

---

## 🌍 Live Demo
🔗 https://jumbo-user-dashboard.vercel.app/


## 🎥 Loom Walkthrough Video
(5–10 minute assignment walkthrough)

🔗 https://www.loom.com/share/abc3bbfe44d74b32a0a48f32eaec5277

---

## 🚀 Features

### **1. User List (Table)**
- Fetches users from `https://jsonplaceholder.typicode.com/users`
- Displays avatar, name, email, phone, company, and actions
- Search-as-you-type
- Sort by email (A–Z / Z–A)
- Filter by company (Radix Select)
- Pagination (React Query–based)

---

### **2. Add User**
- “Add User” opens a Radix Dialog (modal)
- Fields: Name, Email, Phone, Company
- Axios + React Query mutation (fake API)
- Optimistic update: instantly reflects the new user
- Activity Log entry recorded in Zustand

---

### **3. Edit User**
- Edit button opens the same modal prefilled
- Edit works with optimistic update
- Updates table immediately
- Activity Log entry recorded

---

### **4. Delete User**
- Radix UI confirmation dialog
- Optimistic deletion
- Activity Log recorded
- Persisted deletion list using Zustand

---

### **5. User Detail Page `/users/[id]`**
Shows:
- Avatar + user header  
- Contact Information  
- Company Details  
- Address Details  
- Breadcrumbs  
- Modern card layout with full dark mode support  

---

### **6. Global State with Zustand**
Stored:
- Logged-in user
- Dark mode toggle (Radix Switch)
- Activity log (persisted)
- Deleted user IDs

Dark mode:
- Fully synced with `<html class="dark">`
- Smooth transitions enabled

---

## 🧱 Tech Stack

| Layer | Technology |
|------|------------|
| Web Framework | **Next.js 14+ (App Router)** |
| Language | **TypeScript** |
| Styling | **TailwindCSS** |
| UI Components | **Radix UI** |
| Data Fetching | **TanStack React Query** |
| State Management | **Zustand** |
| HTTP Client | **Axios** |
| Deployment | **Vercel** |

---

## 📂 Folder Structure (Simplified)
```
src/
 ├─ app/
 │   ├─ layout.tsx
 │   ├─ page.tsx
 │   └─ users/
 │       ├─ page.tsx
 │       └─ [id]/
 │           └─ page.tsx
 ├─ components/
 │   ├─ UserRow.tsx
 │   ├─ AddUserDialog.tsx
 │   ├─ DeleteUserDialog.tsx
 │   ├─ Navbar.tsx
 │   └─ ActivityLogSidebar.tsx
 ├─ store/
 │   ├─ useThemeStore.ts
 │   ├─ useUserManagementStore.ts
 │   ├─ useActivityLog.ts
 │   └─ useUserModalStore.ts
 ├─ lib/
 │   └─ api.ts
 └─ types/
     └─ user.ts
```

---

## 🛠️ How to Run Locally

```bash
git clone <your-repo-url>
cd jumbo-user-dashboard

npm install
npm run dev
```

Then open:
```
http://localhost:3000
```

---

## 🧠 What I Would Improve With More Time

- Add real backend API instead of mock POST/PUT/DELETE
- Add role-based authentication (Admin / Viewer)
- Add unit tests and E2E tests (React Testing Library + Jest)
- Implement server-side persistence for activity logs
- Improve table performance with virtualization for large data sets
- Add sorting and filtering for more fields (phone, name, company)
- Add bulk actions (bulk delete, bulk edit)

---

## ⭐ Author
**Namit Kumar**  
React Native & Front-End Developer  
Built for **Jumbo React Frontend Assignment**
