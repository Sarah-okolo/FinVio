import ThemeSetting from "@/components/themeSetting";
import { Outlet, Link } from "react-router-dom";

export default function AuthLayout() {
  return (
    <div className="min-h-screen text-foreground relative overflow-hidden">
      <div className="relative max-w-6xl mx-auto px-5 sm:px-8 lg:px-12 py-10 lg:py-14">
        <header className="flex items-center justify-between mb-8">
          <Link to="/" className="flex items-center gap-3">
            <span className="grid place-items-center h-12 w-12 rounded-xl bg-primary">
              <img
                src="/logo-img.png"
                alt="Finvio logo"
                className="h-10 w-10 rounded-full"
              />
            </span>
            <div>
              <p className="font-bold text-xl">Finvio</p>
              <p className="text-muted-foreground text-sm">
                Invoice workflow made simple
              </p>
            </div>
          </Link>

          <ThemeSetting />
        </header>

        <div className="grid lg:grid-cols-[1.05fr_0.95fr] gap-8 lg:gap-12 items-stretch">
          <div className="bg-card/80 backdrop-blur border border-border/60 shadow-xl hidden lg:block rounded-2xl p-8 lg:p-10 relative overflow-hidden">
            <div className="absolute inset-0 bg-linear-to-br from-accent/20 via-transparent to-primary/10 dark:from-sidebar/20 dark:via-transparent dark:to-primary/20 pointer-events-none" />
            <div className="relative space-y-4 h-full grid justify-between text-center">
              <span className="mx-auto flex items-center gap-2 rounded-3xl text-white h-max py-3 px-5 bg-sidebar">
                Invoice smarter
                <span className="h-1.5 w-1.5 rounded-full bg-primary" />
              </span>
              <h2 className="text-3xl lg:text-4xl font-bold leading-tight">
                Keep billing organized and fast.
              </h2>
              <p className="text-muted-foreground text-base leading-relaxed max-w-xl">
                Manage clients, track payments, and send polished invoices from
                one focused dashboard.
              </p>
            </div>
          </div>

          <div className="bg-card border border-border/80 shadow-2xl rounded-2xl p-6 sm:p-8">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
}
