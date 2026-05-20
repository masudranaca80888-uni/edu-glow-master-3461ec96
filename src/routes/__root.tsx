import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  useLocation,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, useMemo } from "react";
import { Toaster } from "@/components/ui/sonner";
import { useAppStore } from "@/stores/app-store";

import appCss from "../styles.css?url";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "EduMaster Pro — Practice. Learn. Achieve." },
      { name: "description", content: "MCQ Practice, Quiz, Mock Test, Flash Cards, Short Notes & Smart Learning Platform for ambitious students." },
      { name: "author", content: "EduMaster Pro" },
      { property: "og:title", content: "EduMaster Pro — Practice. Learn. Achieve." },
      { property: "og:description", content: "Smart learning platform with MCQs, mock tests, flash cards and AI-powered analytics." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "twitter:site", content: "@Lovable" },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const location = useLocation();
  const { hydrate, hydrated, user } = useAppStore();

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  const guard = useMemo(() => {
    const path = location.pathname;
    const publicRoutes = ["/", "/login", "/register", "/admin-login", "/forgot-password", "/verify-otp", "/reset-password", "/email-verified"];
    if (!hydrated || publicRoutes.includes(path)) return null;
    if (path.startsWith("/admin") && user?.role !== "admin") return "admin";
    if (!path.startsWith("/admin") && !user) return "student";
    return null;
  }, [hydrated, location.pathname, user]);

  return (
    <QueryClientProvider client={queryClient}>
      {guard ? <UnauthorizedPage mode={guard} /> : <Outlet />}
      <Toaster position="top-right" richColors closeButton />
    </QueryClientProvider>
  );
}

function UnauthorizedPage({ mode }: { mode: "student" | "admin" }) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4 text-foreground">
      <section className="glass shadow-card-soft max-w-md rounded-3xl p-8 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--neon-purple)]">Protected route</p>
        <h1 className="mt-3 font-display text-3xl font-bold">Sign in required</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {mode === "admin" ? "Admin pages require an active admin session." : "Student pages require an active learning session."}
        </p>
        <div className="mt-6 flex justify-center gap-2">
          <Link to={mode === "admin" ? "/admin-login" : "/login"} className="bg-cta-gradient rounded-xl px-4 py-2 text-sm font-semibold text-white shadow-glow">
            Login
          </Link>
          <Link to="/" className="rounded-xl border border-border px-4 py-2 text-sm font-semibold hover:bg-muted">
            Home
          </Link>
        </div>
      </section>
    </main>
  );
}
