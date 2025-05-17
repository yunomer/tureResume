<div align="center">
  <a href="https://ture.ai">
    <img src="public/logo.svg" alt="Ture Logo" width="300">
  </a>
  <br/> 
  <p>
    <strong>Manage Your Resumes & Accelerate Your Career</strong>
  </p>
  <p>
    Ture uses a simple, intuitive interface to create powerful, professional resumes. Collaborate (if needed, though mostly solo), save multiple versions, and ensure your application stands out.
  </p>
  <br/>
</div>

---

## ⚒️ Resume Builder

Ture's resume builder allows user to create a modern professional resume easily.

![Resume Builder Demo](https://i.ibb.co/DPL25gyZ/ezgif-com-crop.gif)

It has 5 Core Features:
| <div style="width:285px">**Feature**</div> | **Description** |
|---|---|
| **1. Real Time UI Update** | The resume PDF is updated in real time as you enter your resume information, so you can easily see the final output. |
| **2. Modern Professional Resume Design** | The resume PDF is a modern professional design that adheres to U.S. best practices and is ATS friendly to top ATS platforms such as Greenhouse and Lever. It automatically formats fonts, sizes, margins, bullet points to ensure consistency and avoid human errors. |
| **3. User Accounts & Data Management** | Ture now requires user sign-up to create, save, and manage your resumes. Your resume data is securely associated with your account, allowing you to access and edit it from anywhere. We are committed to protecting your personal information; please refer to our [Privacy Policy](/privacy-policy) for more details. |
| **4. Import From Existing Resume PDF** | After signing in, you can import data from an existing resume PDF. This feature helps you quickly populate your new Ture resume with your existing information, updating it to a modern professional design in seconds. |
| **5. Successful Track Record** | Ture users have landed interviews and offers from top companies, such as Dropbox, Google, Meta to name a few. It has been proven to work and liken by recruiters and hiring managers. |

## 🔍 Resume Parser (Account Required)

Ture’s resume parser helps you test and confirm the ATS readability of your existing resume. To use this feature, you'll need to sign up or log in to your Ture account. Once logged in, you can upload your resume to analyze its structure and content from an ATS perspective.

![Resume Parser Demo](https://i.ibb.co/9ByL66Y/ezgif-com-crop-1.gif)


## 📚 Tech Stack

| <div style="width:140px">**Category**</div> | <div style="width:100px">**Choice**</div> | **Descriptions** |
|---|---|---|
| **Language** | [TypeScript](https://github.com/microsoft/TypeScript) | TypeScript is JavaScript with static type checking and helps catch many silly bugs at code time. |
| **UI Library** | [React](https://github.com/facebook/react) | React’s declarative syntax and component-based architecture make it simple to develop reactive reusable components. |
| **State Management** | [Redux Toolkit](https://github.com/reduxjs/redux-toolkit) | Redux toolkit reduces the boilerplate to set up and update a central redux store, which is used in managing the complex resume state. |
| **CSS Framework** | [Tailwind CSS](https://github.com/tailwindlabs/tailwindcss) | Tailwind speeds up development by providing helpful css utilities and removing the need to context switch between tsx and css files. |
| **Web Framework** | [NextJS 13](https://github.com/vercel/next.js) | Next.js supports static site generation and helps build efficient React webpages that support SEO. |
| **PDF Reader** | [PDF.js](https://github.com/mozilla/pdf.js) | PDF.js reads content from PDF files and is used by the resume parser at its first step to read a resume PDF’s content. |
| **PDF Renderer** | [React-pdf](https://github.com/diegomura/react-pdf) | React-pdf creates PDF files and is used by the resume builder to create a downloadable PDF file. |
| **Database ORM** | [Prisma](https://www.prisma.io/) | Prisma simplifies database access with an auto-generated and type-safe query builder. Used for managing user accounts and resume data. |
| **Email Service** | [Resend](https://resend.com/) | Resend is used for transactional emails, such as sending password reset links. |
| **Password Hashing** | [bcrypt.js](https://github.com/kelektiv/node.bcrypt.js) | bcrypt.js is used for securely hashing user passwords before storing them. |

## 📁 Project Structure

Ture is created with the NextJS web framework and follows its project structure. The source code can be found in `src/app`. There are a total of 4 page routes as shown in the table below. (Code path is relative to `src/app`)

| <div style="width:115px">**Page Route**</div> | **Code Path** | **Description** |
|---|---|---|
| / | /page.tsx | Home page that contains hero, auto typing resume, steps, testimonials, logo cloud, etc |
| /resume-import | /resume-import/page.tsx | Resume import page, where you can choose to import data from an existing resume PDF. The main component used is `ResumeDropzone` (`/components/ResumeDropzone.tsx`) |
| /resume-builder | /resume-builder/page.tsx | Resume builder page to build and download a resume PDF. The main components used are `ResumeForm` (`/components/ResumeForm`) and `Resume` (`/components/Resume`) |
| /resume-parser | /resume-parser/page.tsx | Resume parser page to test a resume’s AST readability. The main library util used is `parseResumeFromPdf` (`/lib/parse-resume-from-pdf`) |
| /auth/login | /auth/login/page.tsx | User login page. |
| /auth/register | /auth/register/page.tsx | User registration page. |
| /auth/forgot-password | /auth/forgot-password/page.tsx | Page for users to request a password reset link. |
| /auth/reset-password | /auth/reset-password/page.tsx | Page for users to reset their password using a token. |

API routes for authentication and other backend functionalities are located under `src/app/api/`. For example, authentication endpoints like login, register, and password reset are handled in `src/app/api/auth/`.

## 💻 Local Development

### Method 1: npm

1. `git clone https://github.com/yunomer/tureResume.git`
2. `cd tureResume`
3. `npm install`
4. `cp .env.example .env.local` (and fill in your values)
5. `npx prisma migrate dev` (or `npx prisma db push`)
6. `npm run dev`
7. Open [http://localhost:3000](http://localhost:3000)

### Method 2: Docker

1. `git clone https://github.com/yunomer/tureResume.git`
2. `cd tureResume`
3. `cp .env.example .env.local` (fill in values on host)
4. Ensure database (from `.env.local`) is running and accessible.
5. `npx prisma migrate dev` (run on host)
6. `docker build -t ture-app .`
7. `docker run --env-file .env.local -p 3000:3000 ture-app`
8. Open [http://localhost:3000](http://localhost:3000)
   This command maps port 3000 of the container to port 3000 on your host and passes the environment variables from your host's `.env.local` file into the container.
7. Open your browser and visit `http://localhost:3000` to see Ture live.

**Note on Docker and Database:** These instructions assume your database (specified in `DATABASE_URL`) is accessible from the Docker container. This might mean it's running on `host.docker.internal` (for Docker Desktop), a specific IP address, or you're using a custom Docker network. For development setups where the database is also containerized, using `docker-compose` is often a more robust solution.
