"use client";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import logoSrc from "public/logo.svg";
import { cx } from "lib/cx";
import { useSession, signIn, signOut } from "next-auth/react";

export const TopNavBar = () => {
  const pathName = usePathname();
  const router = useRouter(); // Add useRouter hook
  const isHomePage = pathName === "/";
  const { data: session, status } = useSession();

  // Common class for navigation links and buttons for consistent styling
  const navItemClassName = "rounded-md px-1.5 py-2 text-gray-500 hover:bg-gray-100 focus-visible:bg-gray-100 lg:px-4";
  

  return (
    <header
      aria-label="Site Header"
      className={cx(
        "flex h-[var(--top-nav-bar-height)] items-center border-b-2 border-gray-100 px-3 lg:px-12",
        isHomePage && "bg-dot"
      )}
    >
      <div className="flex h-10 w-full items-center justify-between">
        <Link href="/">
          <span className="sr-only">Ture</span>
          <Image
            src={logoSrc}
            alt="Ture Logo"
            className="h-8 w-full"
            priority
          />
        </Link>
        <nav
          aria-label="Site Nav Bar"
          className="flex items-center gap-2 text-sm font-medium"
        >
          {status === "authenticated" && (
            <>
              {[
            ["/resume-builder", "Builder"],
            ["/resume-parser", "Parser"],
          ].map(([href, text]) => (
            <Link
              key={text}
              className={navItemClassName} // Apply common style
              href={href}
            >
              {text}
            </Link>
          ))}
            </>
          )}

          {/* Auth Links/Buttons Start */}
          {status === "loading" && (
            <span className={navItemClassName}>Loading...</span> // Apply common style (adjust if needed for span)
          )}
          {status === "unauthenticated" && pathName !== "/auth/login" && (
            <button
              onClick={() => router.push('/auth/login')}
              className={navItemClassName} // Apply common style
            >
              Sign In
            </button>
          )}
          {status === "authenticated" && (
            <>
              <Link href="/dashboard" className={navItemClassName}>
                Dashboard
              </Link>
              <button
                onClick={() => signOut({ callbackUrl: '/' })}
                className={navItemClassName} // Apply common style
              >
                Sign Out
              </button>
            </>
          )}
          {/* Auth Links/Buttons End */}
        </nav>
      </div>
    </header>
  );
};
