import { ArrowUpRight, Bookmark, MapPin, Star } from 'lucide-react';
import { Link } from 'wouter';
import type { University } from '@workspace/api-client-react';

const tierLabel: Record<string, string> = { safe: 'Safer fit', target: 'Target fit', reach: 'Reach fit' };
const tierClass: Record<string, string> = {
  safe: 'bg-emerald-100 text-emerald-800',
  target: 'bg-secondary text-secondary-foreground',
  reach: 'bg-amber-100 text-amber-800',
};

export function UniversityCard({ university, saved, onSave, compact = false }: { university: University; saved?: boolean; onSave?: () => void; compact?: boolean }) {
  return (
    <article className={`group relative overflow-hidden rounded-2xl border border-card-border bg-card shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md ${compact ? 'p-4' : 'p-5'}`} data-testid={`card-university-${university.id}`}>
      {!compact && university.image && <div className="mb-4 overflow-hidden rounded-xl bg-muted"><img src={university.image} alt={`${university.name} campus`} loading="lazy" className="h-32 w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]" data-testid={`img-campus-${university.id}`} /></div>}
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-start gap-3">
          <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-primary text-[10px] font-bold tracking-tight text-primary-foreground">{university.logo || university.countryCode}</div>
          <div className="min-w-0">
            <Link href={`/finder/${university.id}`} className="line-clamp-2 text-[15px] font-semibold leading-snug text-card-foreground hover:text-accent" data-testid={`link-university-${university.id}`}>{university.name}</Link>
            <div className="mt-1 flex items-center gap-1 text-[11px] text-muted-foreground"><MapPin size={12} /> {university.city}, {university.country}</div>
          </div>
        </div>
        <button onClick={onSave} className={`rounded-lg p-1.5 transition-colors ${saved ? 'bg-accent/15 text-accent' : 'text-muted-foreground/60 hover:bg-muted hover:text-foreground'}`} aria-label={saved ? `Remove ${university.name} from saved` : `Save ${university.name}`} data-testid={`button-save-${university.id}`}><Bookmark size={16} fill={saved ? 'currentColor' : 'none'} /></button>
      </div>
      <div className="mt-5 flex items-end justify-between border-t border-border/70 pt-4">
        <div>
          <div className="font-mono-ui text-[9px] uppercase tracking-[0.14em] text-muted-foreground">Matrix fit</div>
          <div className="mt-1 flex items-baseline gap-1"><span className="font-display text-3xl font-semibold">{university.fitScore}</span><span className="text-[11px] text-muted-foreground">/100</span></div>
        </div>
        <div className="text-right">
          <span className={`inline-flex items-center rounded-full px-2 py-1 text-[10px] font-semibold ${tierClass[university.tier] || 'bg-muted text-muted-foreground'}`}>{tierLabel[university.tier] || university.tier}</span>
          <div className="mt-2 flex items-center justify-end gap-1 text-[10px] text-muted-foreground"><Star size={11} className="fill-accent text-accent" /> #{university.rank} Europe</div>
        </div>
      </div>
      {!compact && <div className="mt-4 flex flex-wrap gap-1.5">{university.fields.slice(0, 2).map((field) => <span key={field} className="rounded-md bg-muted px-2 py-1 text-[10px] text-muted-foreground">{field}</span>)}</div>}
      {!compact && <Link href={`/finder/${university.id}`} className="mt-4 flex items-center gap-1 text-[11px] font-semibold text-accent opacity-80 transition-opacity group-hover:opacity-100" data-testid={`link-view-details-${university.id}`}>View profile <ArrowUpRight size={13} /></Link>}
    </article>
  );
}

export function UniversitySkeleton() {
  return <div className="rounded-2xl border border-card-border bg-card p-5"><div className="flex gap-3"><div className="skeleton h-11 w-11 rounded-xl" /><div className="flex-1"><div className="skeleton h-4 w-3/4 rounded" /><div className="skeleton mt-2 h-3 w-1/2 rounded" /></div></div><div className="skeleton mt-7 h-14 rounded-xl" /></div>;
}