import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  Navigate,
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
  const { hydrate, hydrated, sessionReady, authLoading, user } = useAppStore();

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  const redirectTo = useMemo(() => {
    const path = location.pathname;
    const authRoutes = ["/login", "/signup", "/register", "/admin-login"];
    const publicRoutes = ["/", ...authRoutes, "/forgot-password", "/verify-otp", "/reset-password", "/email-verified"];
    const studentRoutes = ["/dashboard", "/mcq-practice", "/quiz", "/custom-exam", "/mock-test", "/flash-cards", "/short-notes", "/qns-bank", "/classes", "/notifications", "/profile"];
    const isAdminRoute = path === "/admin" || path.startsWith("/admin/");
    const isStudentRoute = studentRoutes.includes(path);

    if (!hydrated || !sessionReady) return null;
    if (user && authRoutes.includes(path)) return user.role === "admin" ? "/admin" : "/dashboard";
    if (!user && (isAdminRoute || isStudentRoute)) return "/login";
    if (user && isAdminRoute && user.role !== "admin") return "/dashboard";
    if (!publicRoutes.includes(path) && !user && !isAdminRoute && !isStudentRoute) return null;
    return null;
  }, [hydrated, location.pathname, sessionReady, user]);

  return (
    <QueryClientProvider client={queryClient}>
      {!hydrated || !sessionReady || authLoading ? <AuthLoader /> : redirectTo ? <Navigate to={redirectTo as never} replace /> : <Outlet />}
      <Toaster position="top-right" richColors closeButton />
    </QueryClientProvider>
  );
}

function AuthLoader() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4 text-foreground">
      <section className="glass shadow-card-soft max-w-md rounded-3xl p-8 text-center">
        <div className="mx-auto h-10 w-10 animate-spin rounded-full border-2 border-[var(--neon-purple)] border-t-transparent" />
        <h1 className="mt-4 font-display text-2xl font-bold">Restoring session</h1>
        <p className="mt-2 text-sm text-muted-foreground">Preparing your EduMaster Pro workspace…</p>
      </section>
    </main>
  );
}
