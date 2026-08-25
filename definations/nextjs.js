/*
╔══════════════════════════════════════════════════════════════╗
║        ▲  NEXT.JS INTERVIEW QUESTIONS (1–20)  ▲            ║
║        ZERO TO HERO — BASIC TO ADVANCED                     ║
║        EXPLANATIONS IN COMMENTS + REAL CODE                 ║
╚══════════════════════════════════════════════════════════════╝
*/



/* ┌─────────────────────────────────────────────────┐
   │  🟢  1. WHAT IS NEXT.JS?                        │
   └─────────────────────────────────────────────────┘
   Next.js is a React framework for building full-stack web apps.
   It provides server-side rendering (SSR), static site generation (SSG),
   file-based routing, API routes, and many optimizations out of the box.
   Built and maintained by Vercel.
*/

// Basic Next.js page component
export default function Home() {
    return <h1>Welcome to Next.js</h1>;
}



/* ┌─────────────────────────────────────────────────┐
   │  🔵  2. NEXT.JS vs REACT — WHAT'S THE DIFFERENCE│
   └─────────────────────────────────────────────────┘
   ┌──────────────────┬──────────────────────────────┐
   │     REACT        │         NEXT.JS              │
   ├──────────────────┼──────────────────────────────┤
   │ Library (UI)     │ Framework (full-stack)       │
   │ Client-side only │ SSR + SSG + CSR              │
   │ Manual routing   │ File-based routing           │
   │ No SEO by default│ SEO friendly                 │
   │ CRA / Vite setup │ Built-in bundling + config   │
   └──────────────────┴──────────────────────────────┘
*/



/* ┌─────────────────────────────────────────────────┐
   │  🟣  3. WHAT IS FILE-BASED ROUTING?             │
   └─────────────────────────────────────────────────┘
   In Next.js, routes are created automatically based on file structure.
   No need for react-router. Just create files inside app/ folder.

   📁 App Router (Next.js 13+):
   app/
   ├── page.js              → /
   ├── about/
   │   └── page.js          → /about
   ├── blog/
   │   ├── page.js          → /blog
   │   └── [slug]/
   │       └── page.js      → /blog/:slug (dynamic)
   └── layout.js            → shared layout
*/

// app/about/page.js
export default function AboutPage() {
    return <h1>About Us</h1>;
}

// app/blog/[slug]/page.js  → dynamic route
export default function BlogPost({ params }) {
    return <h1>Blog: {params.slug}</h1>;
}



/* ┌─────────────────────────────────────────────────┐
   │  🟠  4. WHAT IS THE APP ROUTER vs PAGES ROUTER? │
   └─────────────────────────────────────────────────┘
   📁 Pages Router (old) → pages/ directory, uses getServerSideProps
   📁 App Router (new)   → app/ directory, uses Server Components

   ┌──────────────────┬──────────────────────────────┐
   │   PAGES ROUTER   │       APP ROUTER             │
   ├──────────────────┼──────────────────────────────┤
   │ pages/ folder    │ app/ folder                  │
   │ getServerSideProps│ async Server Components     │
   │ _app.js, _doc.js │ layout.js, loading.js       │
   │ Client by default│ Server by default            │
   └──────────────────┴──────────────────────────────┘

   ✅ App Router is the recommended approach (Next.js 13+).
*/



/* ┌─────────────────────────────────────────────────┐
   │  🔴  5. SERVER COMPONENTS vs CLIENT COMPONENTS  │
   └─────────────────────────────────────────────────┘
   🔹 Server Components (default) → run on server, no JS sent to browser
      → Can fetch data directly, access DB, read files
      → Cannot use useState, useEffect, onClick

   🔹 Client Components → run on browser, need "use client" directive
      → Can use hooks, event handlers, browser APIs

   ✅ Use Server Components by default, Client only when needed.
*/

// ── Server Component (default) ──
export default async function UserList() {
    const users = await fetch("https://api.example.com/users");
    const data = await users.json();
    return (
        <ul>
            {data.map((user) => (
                <li key={user.id}>{user.name}</li>
            ))}
        </ul>
    );
}

// ── Client Component ──
("use client");
import { useState } from "react";

export default function Counter() {
    const [count, setCount] = useState(0);
    return <button onClick={() => setCount(count + 1)}>Count: {count}</button>;
}



/* ┌─────────────────────────────────────────────────┐
   │  🟡  6. WHAT ARE LAYOUTS IN NEXT.JS?            │
   └─────────────────────────────────────────────────┘
   Layouts wrap pages and persist across navigation.
   They don't re-render when navigating between child pages.
   Defined using layout.js in the app/ directory.
   Layouts can be nested — each folder can have its own layout.
*/

// app/layout.js → Root Layout (required)
export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body>
                <nav>My Navbar</nav>
                {children}
                <footer>My Footer</footer>
            </body>
        </html>
    );
}

// app/dashboard/layout.js → Nested Layout
export default function DashboardLayout({ children }) {
    return (
        <div>
            <aside>Sidebar</aside>
            <main>{children}</main>
        </div>
    );
}



/* ┌─────────────────────────────────────────────────┐
   │  🟢  7. WHAT IS SSR, SSG, AND ISR?             │
   └─────────────────────────────────────────────────┘
   📌 SSR (Server-Side Rendering)
      → Page is generated on EVERY request on the server
      → Always fresh data, slower response

   📌 SSG (Static Site Generation)
      → Page is generated at BUILD time
      → Super fast, but data can be stale

   📌 ISR (Incremental Static Regeneration)
      → Static page that REVALIDATES after a set time
      → Best of both: fast + updated data
*/

// ── SSR → fetch on every request ──
export default async function SSRPage() {
    const res = await fetch("https://api.example.com/data", {
        cache: "no-store", // 🔹 SSR: no caching
    });
    const data = await res.json();
    return <div>{data.title}</div>;
}

// ── SSG → fetch at build time ──
export default async function SSGPage() {
    const res = await fetch("https://api.example.com/data", {
        cache: "force-cache", // 🔹 SSG: cached forever
    });
    const data = await res.json();
    return <div>{data.title}</div>;
}

// ── ISR → revalidate every 60 seconds ──
export default async function ISRPage() {
    const res = await fetch("https://api.example.com/data", {
        next: { revalidate: 60 }, // 🔹 ISR: refresh every 60s
    });
    const data = await res.json();
    return <div>{data.title}</div>;
}



/* ┌─────────────────────────────────────────────────┐
   │  🔵  8. WHAT ARE API ROUTES / ROUTE HANDLERS?   │
   └─────────────────────────────────────────────────┘
   Next.js lets you create backend API endpoints inside your project.
   In App Router, use route.js files.
   These run on the server only — never exposed to the client.

   📁 app/api/users/route.js → /api/users
*/

// app/api/users/route.js
import { NextResponse } from "next/server";

export async function GET() {
    const users = [
        { id: 1, name: "Harsha" },
        { id: 2, name: "John" },
    ];
    return NextResponse.json(users);
}

export async function POST(request) {
    const body = await request.json();
    return NextResponse.json({ message: "User created", data: body }, { status: 201 });
}



/* ┌─────────────────────────────────────────────────┐
   │  🟣  9. WHAT IS DATA FETCHING IN NEXT.JS?      │
   └─────────────────────────────────────────────────┘
   In App Router, you fetch data directly inside Server Components.
   No need for getServerSideProps or getStaticProps anymore.
   Just use async/await with fetch() in your component.

   ⚡ Next.js extends fetch() with caching & revalidation options.
*/

// ── Direct fetch in Server Component ──
export default async function ProductsPage() {
    const res = await fetch("https://api.example.com/products");
    const products = await res.json();

    return (
        <div>
            {products.map((p) => (
                <div key={p.id}>
                    <h2>{p.name}</h2>
                    <p>${p.price}</p>
                </div>
            ))}
        </div>
    );
}



/* ┌─────────────────────────────────────────────────┐
   │  🟠  10. WHAT IS DYNAMIC ROUTING?               │
   └─────────────────────────────────────────────────┘
   Dynamic routes use square brackets [] in file names.
   They capture URL parameters and pass them as props.

   📁 [slug]       → single dynamic segment    /blog/hello
   📁 [...slug]    → catch-all segments         /blog/a/b/c
   📁 [[...slug]]  → optional catch-all         /blog OR /blog/a/b
*/

// app/products/[id]/page.js → /products/123
export default function ProductPage({ params }) {
    return <h1>Product ID: {params.id}</h1>;
}

// app/docs/[...slug]/page.js → /docs/a/b/c
export default function DocsPage({ params }) {
    return <h1>Path: {params.slug.join("/")}</h1>;
}

// Generate static paths at build time
export async function generateStaticParams() {
    return [{ id: "1" }, { id: "2" }, { id: "3" }];
}



/* ┌─────────────────────────────────────────────────┐
   │  🔴  11. WHAT IS loading.js AND error.js?       │
   └─────────────────────────────────────────────────┘
   Next.js has special files for handling loading & error states.

   📄 loading.js → shows while page/data is loading (uses Suspense)
   📄 error.js   → shows when an error occurs (Error Boundary)
   📄 not-found.js → custom 404 page

   These files work automatically — just create them in the folder.
*/

// app/dashboard/loading.js
export default function Loading() {
    return <div>⏳ Loading dashboard...</div>;
}

// app/dashboard/error.js
("use client"); // ⚠️ error.js must be a Client Component
export default function Error({ error, reset }) {
    return (
        <div>
            <h2>❌ Something went wrong!</h2>
            <p>{error.message}</p>
            <button onClick={() => reset()}>🔄 Try Again</button>
        </div>
    );
}

// app/not-found.js
export default function NotFound() {
    return <h1>404 — Page Not Found</h1>;
}



/* ┌─────────────────────────────────────────────────┐
   │  🟡  12. WHAT IS MIDDLEWARE IN NEXT.JS?         │
   └─────────────────────────────────────────────────┘
   Middleware runs BEFORE a request is completed.
   Used for authentication, redirects, logging, headers.
   Create a middleware.js file in the project root.
   It runs on the Edge runtime (fast, lightweight).
*/

// middleware.js (root of project)
import { NextResponse } from "next/server";

export function middleware(request) {
    const token = request.cookies.get("auth-token");

    // 🔹 Redirect to login if not authenticated
    if (!token) {
        return NextResponse.redirect(new URL("/login", request.url));
    }

    return NextResponse.next();
}

// 🔹 Only apply middleware to these routes
export const config = {
    matcher: ["/dashboard/:path*", "/profile/:path*"],
};



/* ┌─────────────────────────────────────────────────┐
   │  🟢  13. WHAT IS next/image AND WHY USE IT?     │
   └─────────────────────────────────────────────────┘
   next/image is an optimized Image component.
   🔹 Auto lazy loading (loads when visible)
   🔹 Auto resizing for different screen sizes
   🔹 Serves modern formats (WebP, AVIF)
   🔹 Prevents layout shift (CLS)
*/

import Image from "next/image";

export default function Avatar() {
    return (
        <Image
            src="/profile.jpg"
            alt="Profile"
            width={200}
            height={200}
            priority          // 🔹 load immediately (for above-the-fold)
        />
    );
}

// External images need config in next.config.js
// images: { domains: ['cdn.example.com'] }



/* ┌─────────────────────────────────────────────────┐
   │  🔵  14. WHAT IS next/link AND HOW IT WORKS?    │
   └─────────────────────────────────────────────────┘
   next/link provides client-side navigation.
   🔹 No full page reload — instant navigation
   🔹 Auto prefetches linked pages in viewport
   🔹 Replaces <a> tag for internal navigation
*/

import Link from "next/link";

export default function Navbar() {
    return (
        <nav>
            <Link href="/">Home</Link>
            <Link href="/about">About</Link>
            <Link href="/blog/hello" prefetch={false}>Blog</Link>
            {/* prefetch={false} to disable auto prefetch */}
        </nav>
    );
}



/* ┌─────────────────────────────────────────────────┐
   │  🟣  15. WHAT IS useRouter IN NEXT.JS?          │
   └─────────────────────────────────────────────────┘
   useRouter is a hook for programmatic navigation.
   ⚠️ In App Router, import from "next/navigation" (not "next/router").
*/

("use client");
import { useRouter, usePathname, useSearchParams } from "next/navigation";

export default function NavigationExample() {
    const router = useRouter();
    const pathname = usePathname();          // 🔹 current path
    const searchParams = useSearchParams();  // 🔹 query params

    return (
        <div>
            <p>Current path: {pathname}</p>
            <button onClick={() => router.push("/dashboard")}>Go to Dashboard</button>
            <button onClick={() => router.back()}>Go Back</button>
            <button onClick={() => router.refresh()}>Refresh Page</button>
        </div>
    );
}



/* ┌─────────────────────────────────────────────────┐
   │  🟠  16. WHAT IS METADATA AND SEO IN NEXT.JS?  │
   └─────────────────────────────────────────────────┘
   Next.js provides built-in metadata API for SEO.
   Export a metadata object or generateMetadata function.
   This replaces the old <Head> component.
*/

// ── Static Metadata ──
export const metadata = {
    title: "My Website",
    description: "A modern Next.js website",
    keywords: ["nextjs", "react", "web"],
    openGraph: {
        title: "My Website",
        description: "A modern Next.js website",
        images: ["/og-image.png"],
    },
};

// ── Dynamic Metadata ──
export async function generateMetadata({ params }) {
    const product = await fetch(`https://api.example.com/products/${params.id}`);
    const data = await product.json();

    return {
        title: data.name,
        description: data.description,
    };
}



/* ┌─────────────────────────────────────────────────┐
   │  🔴  17. WHAT ARE SERVER ACTIONS?               │
   └─────────────────────────────────────────────────┘
   Server Actions let you run server code directly from components.
   No need to create separate API routes for form submissions.
   Defined with "use server" directive.
   They work with forms and can be called from Client Components.
*/

// ── Server Action (in a Server Component) ──
export default function ContactForm() {
    async function submitForm(formData) {
        "use server";
        const name = formData.get("name");
        const email = formData.get("email");
        // 🔹 save to database directly here
        console.log("Saving:", name, email);
    }

    return (
        <form action={submitForm}>
            <input name="name" placeholder="Name" />
            <input name="email" placeholder="Email" />
            <button type="submit">Submit</button>
        </form>
    );
}

// ── Separate file for reusable actions ──
// app/actions.js
("use server");
export async function createUser(formData) {
    const name = formData.get("name");
    // save to DB...
    return { success: true };
}



/* ┌─────────────────────────────────────────────────┐
   │  🟡  18. WHAT IS next.config.js?                │
   └─────────────────────────────────────────────────┘
   next.config.js is the main configuration file for Next.js.
   Used to customize builds, redirects, rewrites, images, env vars.
*/

// next.config.js
const nextConfig = {
    // 🔹 Allow external images
    images: {
        domains: ["cdn.example.com", "images.unsplash.com"],
    },

    // 🔹 Redirects
    async redirects() {
        return [
            {
                source: "/old-page",
                destination: "/new-page",
                permanent: true, // 301 redirect
            },
        ];
    },

    // 🔹 Environment variables
    env: {
        API_URL: "https://api.example.com",
    },

    // 🔹 Rewrites (proxy API calls)
    async rewrites() {
        return [
            {
                source: "/api/:path*",
                destination: "https://backend.example.com/:path*",
            },
        ];
    },
};

module.exports = nextConfig;



/* ┌─────────────────────────────────────────────────┐
   │  🟢  19. WHAT IS CACHING IN NEXT.JS?           │
   └─────────────────────────────────────────────────┘
   Next.js has multiple layers of caching for performance:

   📦 Request Memoization → same fetch in same render = 1 request
   📦 Data Cache          → fetch results cached on server
   📦 Full Route Cache    → rendered pages cached at build
   📦 Router Cache        → client-side cache for visited pages

   ⚡ Control caching with fetch options:
*/

// 🔹 Cache forever (SSG behavior)
await fetch(url, { cache: "force-cache" });

// 🔹 Never cache (SSR behavior)
await fetch(url, { cache: "no-store" });

// 🔹 Revalidate every 60 seconds (ISR behavior)
await fetch(url, { next: { revalidate: 60 } });

// 🔹 Revalidate by tag
await fetch(url, { next: { tags: ["products"] } });

// In Server Action:
import { revalidateTag, revalidatePath } from "next/cache";
revalidateTag("products");        // revalidate by tag
revalidatePath("/products");      // revalidate by path



/* ┌─────────────────────────────────────────────────┐
   │  🔵  20. NEXT.JS PROJECT STRUCTURE              │
   └─────────────────────────────────────────────────┘

   📁 my-nextjs-app/
   ├── 📁 app/                    ← App Router (main)
   │   ├── layout.js              ← Root layout
   │   ├── page.js                ← Home page (/)
   │   ├── loading.js             ← Loading UI
   │   ├── error.js               ← Error UI
   │   ├── not-found.js           ← 404 page
   │   ├── globals.css            ← Global styles
   │   ├── 📁 about/
   │   │   └── page.js            ← /about
   │   ├── 📁 blog/
   │   │   ├── page.js            ← /blog
   │   │   └── 📁 [slug]/
   │   │       └── page.js        ← /blog/:slug
   │   └── 📁 api/
   │       └── 📁 users/
   │           └── route.js       ← /api/users
   ├── 📁 public/                 ← Static files (images, icons)
   ├── 📁 components/             ← Reusable components
   ├── middleware.js               ← Middleware
   ├── next.config.js              ← Configuration
   ├── package.json
   └── .env.local                  ← Environment variables

   ✅ This is the recommended structure for Next.js 13+ projects.
*/


/*
╔══════════════════════════════════════════════════════════════╗
║               🎉  END OF NEXT.JS Q&A  🎉                   ║
║            Happy Learning & Good Luck! 🚀                   ║
╚══════════════════════════════════════════════════════════════╝
*/
