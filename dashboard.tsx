import { ArrowRight, BookOpen, CalendarClock, Check, ChevronRight, FileText, Gauge, Map, Sparkles, Route } from 'lucide-react';
import { Link } from 'wouter';
import { useListUniversities, getListUniversitiesQueryKey } from '@workspace/api-client-react';
import { UniversityCard, UniversitySkeleton } from '@/components/university-card';
import { demoUniversities } from '@/lib/demo-data';

const savedIds = ['uva', 'polimi'];

export default function Dashboard() {
  const universitiesQuery = useListUniversities({ limit: 6 }, { query: { queryKey: getListUniversitiesQueryKey({ limit: 6 }) } });
  const universities = universitiesQuery.data?.length ? universitiesQuery.data : demoUniversities;

  return (
    <div className="mx-auto max-w-[1440px] px-5 py-8 md:px-10 md:py-10">
      <section className="rise-in flex flex-col justify-between gap-5 md:flex-row md:items-end">
        <div>
          <p className="font-mono-ui text-[10px] uppercase tracking-[0.2em] text-accent">Tuesday, 14 October 2025</p>
          <h1 className="mt-3 font-display text-4xl leading-none tracking-[-0.04em] text-foreground md:text-5xl">Good morning, Maya.</h1>
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground">Your Europe shortlist is taking shape. Two applications are in the target zone; one prerequisite is worth closing next.</p>
        </div>
        <Link href="/counselor" className="inline-flex w-fit items-center gap-2 rounded-xl bg-primary px-4 py-3 text-[12px] font-semibold text-primary-foreground shadow-sm transition-transform hover:-translate-y-0.5" data-testid="link-update-profile"><Sparkles size={15} className="text-accent" /> Re-run my profile</Link>
      </section>

      <section className="mt-9 grid gap-4 lg:grid-cols-[1.6fr_1fr_1fr]">
        <div className="relative overflow-hidden rounded-2xl bg-primary p-6 text-primary-foreground shadow-md md:p-7">
          <div className="map-grid absolute inset-0 opacity-60" />
          <div className="relative">
            <div className="flex items-start justify-between"><div><p className="font-mono-ui text-[9px] uppercase tracking-[0.18em] text-primary-foreground/55">Profile strength</p><div className="mt-2 flex items-baseline gap-2"><span className="font-display text-6xl leading-none">78</span><span className="text-sm text-primary-foreground/55">/100</span></div></div><Gauge size={24} className="text-accent" /></div>
            <div className="mt-7 h-1.5 overflow-hidden rounded-full bg-primary-foreground/15"><div className="h-full w-[78%] rounded-full bg-accent" /></div>
            <p className="mt-4 max-w-sm text-[12px] leading-relaxed text-primary-foreground/68">Your academic record and English score are carrying the profile. Adding one quantitative prerequisite will widen your reach.</p>
            <Link href="/counselor" className="mt-5 inline-flex items-center gap-1.5 text-[11px] font-semibold text-accent hover:underline" data-testid="link-improve-profile">See what moves the score <ArrowRight size={13} /></Link>
          </div>
        </div>
        {[
          { label: 'Universities in orbit', value: '12', note: 'across 7 countries', icon: Map, tone: 'text-secondary-foreground bg-secondary' },
          { label: 'Next deadline', value: '18', note: 'days · KU Leuven', icon: CalendarClock, tone: 'text-accent-foreground bg-accent/20' },
        ].map(({ label, value, note, icon: Icon, tone }) => <div key={label} className="rounded-2xl border border-card-border bg-card p-6 shadow-sm"><div className={`grid h-9 w-9 place-items-center rounded-xl ${tone}`}><Icon size={17} /></div><p className="mt-7 text-[11px] text-muted-foreground">{label}</p><p className="mt-1 font-display text-4xl">{value}</p><p className="mt-1 text-[11px] text-muted-foreground">{note}</p></div>)}
      </section>

      <section className="mt-12 grid gap-9 xl:grid-cols-[1.45fr_0.75fr]">
        <div>
          <div className="flex items-end justify-between"><div><p className="font-mono-ui text-[10px] uppercase tracking-[0.18em] text-accent">Your shortlist</p><h2 className="mt-2 font-display text-3xl tracking-[-0.03em]">Keep these close</h2></div><Link href="/finder" className="flex items-center gap-1 text-[11px] font-semibold text-muted-foreground hover:text-foreground" data-testid="link-see-all-universities">Explore all <ChevronRight size={14} /></Link></div>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">{universitiesQuery.isLoading ? [1, 2].map((i) => <UniversitySkeleton key={i} />) : universities.filter((u) => savedIds.includes(u.id)).slice(0, 2).map((university) => <UniversityCard key={university.id} university={university} saved compact />)}</div>
          {!universitiesQuery.isLoading && !universities.filter((u) => savedIds.includes(u.id)).length && <div className="rounded-2xl border border-dashed border-border bg-card/40 p-8 text-center"><BookOpen className="mx-auto text-muted-foreground" size={23} /><p className="mt-3 text-sm font-semibold">Your shortlist is waiting</p><p className="mt-1 text-xs text-muted-foreground">Save universities from the finder to see them here.</p><Link href="/finder" className="mt-4 inline-flex rounded-lg bg-primary px-3 py-2 text-[11px] font-semibold text-primary-foreground" data-testid="link-find-universities">Find universities</Link></div>}
        </div>
        <aside className="rounded-2xl border border-card-border bg-card p-6 shadow-sm">
          <div className="flex items-center justify-between"><div><p className="font-mono-ui text-[10px] uppercase tracking-[0.18em] text-accent">Research queue</p><h2 className="mt-2 font-display text-2xl">Small next moves</h2></div><FileText size={18} className="text-muted-foreground" /></div>
          <div className="mt-6 space-y-1">
            {[
              ['Check English requirement', 'University of Amsterdam', true],
              ['Add linear algebra course', 'Profile prerequisite', false],
              ['Save application portal', 'Politecnico di Milano', false],
            ].map(([title, note, done], i) => <button key={String(title)} onClick={() => undefined} className="flex w-full items-start gap-3 rounded-xl p-3 text-left transition-colors hover:bg-muted" data-testid={`button-queue-item-${i}`}><span className={`mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full border ${done ? 'border-secondary bg-secondary text-secondary-foreground' : 'border-border text-transparent'}`}><Check size={12} /></span><span><span className={`block text-[12px] font-semibold ${done ? 'text-muted-foreground line-through' : ''}`}>{title}</span><span className="mt-1 block text-[10px] text-muted-foreground">{note}</span></span></button>)}
          </div>
          <div className="mt-6 border-t border-border pt-5"><p className="text-[11px] leading-relaxed text-muted-foreground">A good research plan is not a longer list. It is knowing what to verify next.</p><Link href="/counselor" className="mt-3 flex items-center gap-1 text-[11px] font-semibold text-accent" data-testid="link-plan-prerequisites">Plan prerequisites <ArrowRight size={13} /></Link></div>
        </aside>
      </section>

      <section className="mt-8 flex flex-col justify-between gap-4 rounded-2xl border border-card-border bg-card p-5 shadow-sm md:flex-row md:items-center md:p-6">
        <div className="flex items-start gap-3">
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-secondary text-secondary-foreground"><Route size={17} /></span>
          <div><p className="text-xs font-semibold">Ready to turn the shortlist into a plan?</p><p className="mt-1 text-[11px] text-muted-foreground">Compare costs, check funding routes, and start your visa timeline in one workspace.</p></div>
        </div>
        <Link href="/planner" className="inline-flex w-fit items-center gap-2 rounded-lg bg-primary px-3 py-2.5 text-[11px] font-semibold text-primary-foreground" data-testid="link-open-planner">Open plan & move <ArrowRight size={13} /></Link>
      </section>
    </div>
  );
}