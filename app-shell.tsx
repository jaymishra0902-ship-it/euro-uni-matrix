import { useState, type ReactNode } from 'react';
import { Link, useLocation } from 'wouter';
import { Compass, LayoutDashboard, Menu, Network, Search, X, CircleHelp, Route } from 'lucide-react';
import { useHealthCheck } from '@workspace/api-client-react';

const navItems = [
  { href: '/', label: 'Overview', icon: LayoutDashboard },
  { href: '/finder', label: 'University finder', icon: Search },
  { href: '/counselor', label: 'Counselor studio', icon: Network },
  { href: '/planner', label: 'Plan & move', icon: Route },
];

export function AppShell({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  const [open, setOpen] = useState(false);
  const health = useHealthCheck();

  return (
    <div className="min-h-[100dvh] bg-background text-foreground">
      <aside className={`fixed inset-y-0 left-0 z-40 flex w-[252px] flex-col bg-sidebar px-4 py-5 text-sidebar-foreground transition-transform duration-300 md:translate-x-0 ${open ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-center justify-between px-3">
          <Link href="/" className="flex items-center gap-3" data-testid="link-brand">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-sidebar-primary text-sm font-bold text-sidebar-primary-foreground">E</span>
            <span>
              <span className="block text-[15px] font-bold tracking-[-0.02em]">EuroUni</span>
              <span className="block font-mono-ui text-[9px] uppercase tracking-[0.18em] text-sidebar-foreground/55">Matrix Engine</span>
            </span>
          </Link>
          <button className="rounded-lg p-2 text-sidebar-foreground/60 hover:bg-sidebar-accent md:hidden" onClick={() => setOpen(false)} aria-label="Close navigation" data-testid="button-close-navigation">
            <X size={17} />
          </button>
        </div>

        <div className="mt-12 px-3 font-mono-ui text-[9px] uppercase tracking-[0.18em] text-sidebar-foreground/45">Workspace</div>
        <nav className="mt-3 space-y-1" aria-label="Primary navigation">
          {navItems.map(({ href, label, icon: Icon }) => {
            const active = href === '/' ? location === '/' : location.startsWith(href);
            return (
              <Link key={href} href={href} onClick={() => setOpen(false)} className={`group flex items-center gap-3 rounded-xl px-3 py-3 text-[13px] font-medium transition-colors ${active ? 'bg-sidebar-accent text-sidebar-foreground' : 'text-sidebar-foreground/65 hover:bg-sidebar-accent/70 hover:text-sidebar-foreground'}`} data-testid={`link-nav-${label.toLowerCase().replaceAll(' ', '-')}`}>
                <Icon size={17} strokeWidth={active ? 2.2 : 1.7} />
                <span>{label}</span>
                {active && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-sidebar-primary" />}
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto space-y-3">
          <div className="rounded-2xl border border-sidebar-border bg-sidebar-accent/55 p-4">
            <div className="flex items-center gap-2 text-[11px] font-semibold">
              <CircleHelp size={15} className="text-sidebar-primary" />
              <span>Need a second opinion?</span>
            </div>
            <p className="mt-2 text-[11px] leading-relaxed text-sidebar-foreground/55">Use your profile to see how a counselor would balance your shortlist.</p>
            <Link href="/counselor" className="mt-3 inline-flex items-center gap-1.5 text-[11px] font-semibold text-sidebar-primary hover:underline" data-testid="link-sidebar-counselor">Open counselor studio <span aria-hidden="true">→</span></Link>
          </div>
          <div className="flex items-center gap-2 px-3 text-[10px] text-sidebar-foreground/40">
            <span className={`h-1.5 w-1.5 rounded-full ${health.isError ? 'bg-amber-400' : 'bg-emerald-400'}`} />
            {health.isError ? 'Local services reconnecting' : 'Matrix services online'}
          </div>
        </div>
      </aside>

      {open && <button className="fixed inset-0 z-30 bg-sidebar/40 md:hidden" onClick={() => setOpen(false)} aria-label="Close navigation overlay" data-testid="button-navigation-overlay" />}
      <main className="min-h-[100dvh] md:pl-[252px]">
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-border/80 bg-background/90 px-5 backdrop-blur-md md:px-10">
          <button className="rounded-lg p-2 text-muted-foreground hover:bg-muted md:hidden" onClick={() => setOpen(true)} aria-label="Open navigation" data-testid="button-open-navigation"><Menu size={20} /></button>
          <div className="hidden items-center gap-2 text-[11px] text-muted-foreground md:flex"><Compass size={15} className="text-accent" /> European study planning, made legible</div>
          <div className="ml-auto flex items-center gap-3">
            <span className="hidden text-right sm:block"><span className="block text-[11px] font-semibold">Maya Thompson</span><span className="block font-mono-ui text-[9px] uppercase tracking-wider text-muted-foreground">Applicant workspace</span></span>
            <span className="grid h-8 w-8 place-items-center rounded-full bg-secondary text-[11px] font-bold text-secondary-foreground">MT</span>
          </div>
        </header>
        {children}
      </main>
    </div>
  );
}