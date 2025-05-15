# Project Progress: User Accounts & Google OAuth

This document tracks the implementation steps for adding user accounts with Google OAuth and PostgreSQL database integration.

## Phase 1: Basic Google OAuth Setup

-   **Objective:** Enable Google Sign-In; session managed by NextAuth (client-side).
-   **Steps:**
    -   [x] **1.1. Install Dependencies:** `next-auth`.
    -   [x] **1.2. Environment Variables:** Setup `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `NEXTAUTH_SECRET`, `NEXTAUTH_URL` in `.env.local`.
    -   [x] **1.3. Google Cloud Console:** Configure OAuth Consent Screen and create OAuth 2.0 Client ID (Web application) with correct redirect URIs (`http://localhost:3000/api/auth/callback/google`).
    -   [x] **1.4. NextAuth API Route:** Create `src/app/api/auth/[...nextauth]/route.ts` with `GoogleProvider`.
    -   [x] **1.5. Session Provider:** Create `AuthSessionProvider.tsx` and wrap `src/app/layout.tsx`.
    -   [x] **1.6. UI Integration:** Add Sign-In/Sign-Out buttons in `TopNavBar.tsx` using `useSession`, `signIn`, `signOut`.
    -   [x] **1.7. Initial Testing:** Verify Google Sign-In/Out flows and session data.

## Phase 2: PostgreSQL Database Integration with Prisma Adapter

-   **Objective:** Persist NextAuth user and session data to PostgreSQL.
-   **Steps:**
    -   [x] **2.1. Install Dependencies:** `prisma`, `@prisma/client`, `@auth/prisma-adapter`.
    -   [x] **2.2. PostgreSQL Setup:** Configure and ensure DB is running (Docker, user provided `DATABASE_URL`). Add `DATABASE_URL` to `.env.local`.
    -   [x] **2.3. Prisma Schema:** Initialize (`npx prisma init`) and add NextAuth models (User, Account, Session, VerificationToken) to `prisma/schema.prisma`.
    -   [x] **2.4. Database Migration:** Run `npx prisma migrate dev --name init_auth_tables`.
    -   [x] **2.5. Prisma Client:** Generate client (`npx prisma generate`). Create `src/app/lib/prisma.ts`.
    -   [x] **2.6. NextAuth Prisma Adapter:** Configure `PrismaAdapter` in `authOptions` in the NextAuth API route, using the Prisma client instance.
    -   [x] **2.7. NextAuth Callbacks:** Update `session` callback in `authOptions` to include `user.id` from the database in the session object.
    -   [x] **2.8. Testing:** Verified user/session data persistence in PostgreSQL after sign-in (Prisma client and adapter fully functional).

## Phase 3: Storing and Retrieving User-Specific Resume Data

-   **Objective:** Save and load user resume data (from `resumeSlice`) to/from PostgreSQL, linked to their account.
-   **Steps:**
    -   [x] **3.1. Update Prisma Schema:** Add `Resume` model to `prisma/schema.prisma` (with `content: Json`, `userId` relation to `User`). Migrate (`npx prisma migrate dev --name add_resume_table`).
    -   [x] **3.2. Create API Endpoints for Resumes:**
        -   [x] Create `src/app/api/resume/route.ts` (with GET/POST).
        -   [x] **POST Endpoint:** Secure; save/update resume `content` for authenticated `userId` using `prisma.resume.upsert`.
        -   [x] **GET Endpoint:** Secure; fetch resume `content` for authenticated `userId`; correctly handles non-existent resumes (returns 200 OK with null).
    -   [x] **3.3. Client-Side Data Sync Logic:**
        -   [x] **On Login/Session Hydration:** Verified: Fetches user's resume via GET endpoint; dispatches `setResumeState` to update Redux store (handles null resume correctly).
        -   [x] **Saving Changes:** Backend POST endpoint ready. Client-side trigger (e.g., debounced, on `resumeState` change) to be fully verified in 3.4.
        -   [x] **Local Storage Strategy:** Current interaction (DB for auth, localStorage as fallback/mirror) is acceptable.
        -   [x] **On Logout:** Reset `resumeSlice` to `initialResumeState`.
    -   [x] **3.4. Testing Full Cycle:** Create, edit, save, logout, login, verify resume data persistence and isolation between users.
