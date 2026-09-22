import { useMemo, useState } from 'react';
import { Filter, Search, SlidersHorizontal, X } from 'lucide-react';
import { useListUniversities, getListUniversitiesQueryKey } from '@workspace/api-client-react';
import type { University } from '@workspace/api-client-react';
import { UniversityCard, UniversitySkeleton } from '@/components/university-card';
import { demoUniversities } from '@/lib/demo-data';

const fieldOptions = ['All fields', 'Computer Science', 'Data Science', 'Engineering', 'Design', 'Business', 'Architecture'];
const regionOptions = ['All Europe', 'Northern Europe', 'Western Europe', 'Central Europe', 'Southern Europe'];

export default function Finder() {
  const [search, setSearch] = useState('');
  const [field, setField] = useState('All fields');
  const [region, setRegion] = useState('All Europe');
  const [tier, setTier] = useState('all');
  const [saved, setSaved] = useState<string[]>(['uva-amsterdam', 'polimi-milan']);
  const params = useMemo(() => ({ search: search || undefined, field: field === 'All fields' ? undefined : field, region: region === 'All Europe' ? undefined : region, tier: tier === 'all' ? undefined : tier as 'safe' | 'target' | 'reach', limit: 30 }), [field, region, search, tier]);
  const query = useListUniversities(params, { query: { queryKey: getListUniversitiesQueryKey(params) } });
  const universities: University[] = query.data?.length ? query.data : demoUniversities.filter((university) => {
    const textMatch = !search || `${university.name} ${university.city} ${university.country}`.toLowerCase().includes(search.toLowerCase());
    const fieldMatch = field === 'All fields' || university.fields.includes(field);
    const regionMatch = region === 'All Europe' || university.region === region;
    const tierMatch = tier === 'all' || university.tier === tier;
    return textMatch && fieldMatch && regionMatch && tierMatch;
  });

  const toggleSave = (id: string) => setSaved((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);
  const reset = () => { setSearch(''); setField('All fields'); setRegion('All Europe'); setTier('all'); };

  return (
    <div className="mx-auto max-w-[1440px] px-5 py-8 md:px-10 md:py-10">
      <section className="rise-in">
        <p className="font-mono-ui text-[10px] uppercase tracking-[0.2em] text-accent">The catalogue</p>
        <div className="mt-3 flex flex-col justify-between gap-5 md:flex-row md:items-end"><div><h1 className="font-display text-4xl leading-none tracking-[-0.04em] md:text-5xl">Find your European fit.</h1><p className="mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground">A considered starting point: compare cost, selectivity, language, and how each institution fits your profile.</p></div><div className="font-mono-ui text-[10px] uppercase tracking-widest text-muted-foreground">{query.isFetching ? 'Updating matrix…' : `${universities.length} institutions indexed`}</div></div>
      </section>

      <section className="mt-9 rounded-2xl border border-card-border bg-card p-4 shadow-sm md:p-5">
        <div className="flex flex-col gap-3 lg:flex-row">
          <label className="relative flex-1"><Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" size={17} /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search by university, city, or country" className="h-11 w-full rounded-xl border border-input bg-background pl-10 pr-10 text-sm outline-none transition-shadow placeholder:text-muted-foreground/65 focus:ring-2 focus:ring-ring/30" data-testid="input-search-universities" />{search && <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground" aria-label="Clear search" data-testid="button-clear-search"><X size={15} /></button>}</label>
          <div className="flex flex-wrap gap-2">
            <select value={field} onChange={(event) => setField(event.target.value)} className="h-11 min-w-[148px] rounded-xl border border-input bg-background px-3 text-xs outline-none focus:ring-2 focus:ring-ring/30" aria-label="Filter by field" data-testid="select-field-filter">{fieldOptions.map((option) => <option key={option}>{option}</option>)}</select>
            <select value={region} onChange={(event) => setRegion(event.target.value)} className="h-11 min-w-[148px] rounded-xl border border-input bg-background px-3 text-xs outline-none focus:ring-2 focus:ring-ring/30" aria-label="Filter by region" data-testid="select-region-filter">{regionOptions.map((option) => <option key={option}>{option}</option>)}</select>
            <select value={tier} onChange={(event) => setTier(event.target.value)} className="h-11 min-w-[120px] rounded-xl border border-input bg-background px-3 text-xs capitalize outline-none focus:ring-2 focus:ring-ring/30" aria-label="Filter by fit tier" data-testid="select-tier-filter"><option value="all">All fits</option><option value="safe">Safer fits</option><option value="target">Target fits</option><option value="reach">Reach fits</option></select>
          </div>
        </div>
        <div className="mt-4 flex items-center justify-between border-t border-border/70 pt-3"><div className="flex items-center gap-2 text-[11px] text-muted-foreground"><SlidersHorizontal size={14} /> Refine your first pass; detail comes next.</div><button onClick={reset} className="text-[11px] font-semibold text-accent hover:underline" data-testid="button-reset-filters">Reset filters</button></div>
      </section>

      <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {query.isLoading ? [1, 2, 3, 4, 5, 6].map((item) => <UniversitySkeleton key={item} />) : universities.map((university) => <UniversityCard key={university.id} university={university} saved={saved.includes(university.id)} onSave={() => toggleSave(university.id)} />)}
      </div>
      {!query.isLoading && !universities.length && <div className="mt-8 rounded-2xl border border-dashed border-border bg-card/40 px-6 py-16 text-center"><Filter className="mx-auto text-muted-foreground" size={24} /><h2 className="mt-4 font-display text-2xl">No close matches yet</h2><p className="mx-auto mt-2 max-w-sm text-sm text-muted-foreground">Try widening the region or removing a field filter. The right shortlist usually starts with a wider map.</p><button onClick={reset} className="mt-5 rounded-lg bg-primary px-4 py-2.5 text-xs font-semibold text-primary-foreground" data-testid="button-empty-reset">Clear filters</button></div>}
      {query.isError && <div className="mt-5 flex items-center justify-between rounded-xl border border-amber-300/60 bg-amber-50 px-4 py-3 text-xs text-amber-900"><span>Showing a cached catalogue while the matrix reconnects.</span><button onClick={() => query.refetch()} className="font-semibold underline" data-testid="button-retry-finder">Retry</button></div>}
    </div>
  );
}