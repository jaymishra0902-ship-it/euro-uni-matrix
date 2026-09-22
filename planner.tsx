import { useMemo, useState } from "react";
import { Link } from "wouter";
import {
  ArrowRight,
  BadgeCheck,
  BookOpen,
  Check,
  ClipboardCheck,
  ExternalLink,
  FileCheck2,
  FileUp,
  FileText,
  Home,
  Landmark,
  LockKeyhole,
  MapPinned,
  PenLine,
  Plane,
  ScanSearch,
  ShieldCheck,
  Sparkles,
  UploadCloud,
  WalletCards,
} from "lucide-react";
import {
  useListUniversities,
  getListUniversitiesQueryKey,
} from "@workspace/api-client-react";
import type { University } from "@workspace/api-client-react";
import {
  applicationRoutes,
  housingProviders,
  scholarshipOptions,
  visaPhases,
} from "@/lib/planning-data";

type PlannerTab = "compare" | "funding" | "visa" | "housing" | "sop" | "ects";

const fallbackIds = ["uva", "tum", "polimi"];
const pgwpByCountry: Record<string, string> = {
  Germany: "18 months",
  Netherlands: "12–36 months",
  Switzerland: "6 months",
  Italy: "12 months",
  Sweden: "12 months",
  Finland: "2 years",
  Denmark: "3 years",
  Norway: "6 months",
  "United Kingdom": "2 years",
  Ireland: "24 months",
  France: "12–24 months",
  Belgium: "12 months",
  Austria: "12 months",
};

export default function Planner() {
  const [activeTab, setActiveTab] = useState<PlannerTab>("compare");
  const [selectedIds, setSelectedIds] = useState<string[]>(fallbackIds);
  const [visaTasks, setVisaTasks] = useState<string[]>([]);
  const [sopField, setSopField] = useState("Data Science");
  const [sopInterest, setSopInterest] = useState("");
  const [sopGoal, setSopGoal] = useState("");
  const [resumeText, setResumeText] = useState("");
  const [auditFiles, setAuditFiles] = useState<string[]>([]);

  const universitiesQuery = useListUniversities(
    { limit: 50 },
    { query: { queryKey: getListUniversitiesQueryKey({ limit: 50 }) } },
  );
  const universities = universitiesQuery.data ?? [];
  const selected = useMemo(
    () =>
      selectedIds
        .map((id) => universities.find((university) => university.id === id))
        .filter(Boolean) as University[],
    [selectedIds, universities],
  );
  const visibleSelected = selected.length ? selected : universities.slice(0, 3);
  const totalAnnual = visibleSelected.reduce(
    (sum, university) => sum + university.tuition + university.livingCost,
    0,
  );
  const resumeScore = Math.min(
    100,
    Math.round(54 + resumeText.trim().length / 5),
  );
  const activePhase =
    visaPhases.find((phase) =>
      phase.tasks.some((task) => !visaTasks.includes(task)),
    ) ?? visaPhases[visaPhases.length - 1];

  const toggleUniversity = (id: string) => {
    setSelectedIds((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : current.length < 4
          ? [...current, id]
          : current,
    );
  };

  const toggleVisaTask = (task: string) => {
    setVisaTasks((current) =>
      current.includes(task)
        ? current.filter((item) => item !== task)
        : [...current, task],
    );
  };

  const tabs: { id: PlannerTab; label: string; icon: typeof Landmark }[] = [
    { id: "compare", label: "Compare", icon: Landmark },
    { id: "funding", label: "Funding", icon: WalletCards },
    { id: "visa", label: "Visa pipeline", icon: ShieldCheck },
    { id: "housing", label: "Housing", icon: Home },
    { id: "ects", label: "ECTS matcher", icon: ScanSearch },
    { id: "sop", label: "SOP studio", icon: PenLine },
  ];

  return (
    <div className="mx-auto max-w-[1440px] px-5 py-8 md:px-10 md:py-10">
      <section className="rise-in flex flex-col justify-between gap-5 md:flex-row md:items-end">
        <div>
          <p className="font-mono-ui text-[10px] uppercase tracking-[0.2em] text-accent">
            Plan & move
          </p>
          <h1 className="mt-3 font-display text-4xl leading-none tracking-[-0.04em] md:text-5xl">
            Turn research into motion.
          </h1>
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground">
            Compare the real trade-offs, find the money route, and make the next
            administrative step obvious.
          </p>
        </div>
        <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
          <span className="grid h-7 w-7 place-items-center rounded-lg bg-secondary text-secondary-foreground">
            <ClipboardCheck size={14} />
          </span>
          A working plan, not another list
        </div>
      </section>

      <section className="mt-8 grid gap-3 md:grid-cols-3">
        <SummaryCard
          label="Shortlist annual study cost"
          value={`€${totalAnnual.toLocaleString()}`}
          note="tuition plus living estimate across selected options"
          icon={WalletCards}
        />
        <SummaryCard
          label="Visa phase"
          value={activePhase.phase}
          note={activePhase.title}
          icon={ShieldCheck}
        />
        <SummaryCard
          label="SOP readiness"
          value={sopInterest && sopGoal ? "Ready" : "Start"}
          note="curriculum-specific draft signal"
          icon={FileText}
        />
      </section>

      <div className="mt-8 flex gap-2 overflow-x-auto border-b border-border pb-px">
        {tabs.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`flex shrink-0 items-center gap-2 border-b-2 px-3 py-3 text-xs font-semibold transition-colors ${activeTab === id ? "border-accent text-foreground" : "border-transparent text-muted-foreground hover:text-foreground"}`}
            data-testid={`tab-planner-${id}`}
          >
            <Icon size={15} />
            {label}
          </button>
        ))}
      </div>

      {activeTab === "compare" && (
        <ComparePanel
          universities={universities}
          selected={visibleSelected}
          selectedIds={selectedIds}
          onToggle={toggleUniversity}
          isLoading={universitiesQuery.isLoading}
        />
      )}
      {activeTab === "funding" && <FundingPanel />}
      {activeTab === "visa" && (
        <VisaPanel
          visaTasks={visaTasks}
          auditFiles={auditFiles}
          onAuditFiles={setAuditFiles}
          onToggle={toggleVisaTask}
        />
      )}
      {activeTab === "housing" && <HousingPanel selected={visibleSelected} />}
      {activeTab === "ects" && <EctsPanel selected={visibleSelected} />}
      {activeTab === "sop" && (
        <SopPanel
          field={sopField}
          interest={sopInterest}
          goal={sopGoal}
          resumeText={resumeText}
          onFieldChange={setSopField}
          onInterestChange={setSopInterest}
          onGoalChange={setSopGoal}
          onResumeChange={setResumeText}
          resumeScore={resumeScore}
          university={visibleSelected[0]}
        />
      )}
    </div>
  );
}

function SummaryCard({
  label,
  value,
  note,
  icon: Icon,
}: {
  label: string;
  value: string;
  note: string;
  icon: typeof Landmark;
}) {
  return (
    <div className="rounded-2xl border border-card-border bg-card p-5 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[11px] text-muted-foreground">{label}</p>
          <p className="mt-2 font-display text-3xl">{value}</p>
          <p className="mt-1 text-[10px] text-muted-foreground">{note}</p>
        </div>
        <span className="grid h-9 w-9 place-items-center rounded-xl bg-secondary text-secondary-foreground">
          <Icon size={17} />
        </span>
      </div>
    </div>
  );
}

function ComparePanel({
  universities,
  selected,
  selectedIds,
  onToggle,
  isLoading,
}: {
  universities: University[];
  selected: University[];
  selectedIds: string[];
  onToggle: (id: string) => void;
  isLoading: boolean;
}) {
  return (
    <section className="mt-8 grid gap-6 xl:grid-cols-[0.75fr_1.65fr]">
      <div className="rounded-2xl border border-card-border bg-card p-5 shadow-sm">
        <p className="font-mono-ui text-[10px] uppercase tracking-[0.18em] text-accent">
          01 · Build your matrix
        </p>
        <h2 className="mt-2 font-display text-2xl">Pick up to four.</h2>
        <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
          Select the options you want to compare. Tuition is annual; living cost
          is the planning estimate.
        </p>
        <div className="mt-5 space-y-2">
          {(isLoading ? [] : universities.slice(0, 12)).map((university) => {
            const isSelected = selectedIds.includes(university.id);
            return (
              <button
                key={university.id}
                onClick={() => onToggle(university.id)}
                className={`flex w-full items-center justify-between rounded-xl border p-3 text-left transition-colors ${isSelected ? "border-accent/60 bg-accent/5" : "border-border/70 hover:bg-muted"}`}
                data-testid={`button-select-university-${university.id}`}
              >
                <span className="min-w-0">
                  <span className="block truncate text-xs font-semibold">
                    {university.name}
                  </span>
                  <span className="mt-1 block text-[10px] text-muted-foreground">
                    {university.city}, {university.country}
                  </span>
                </span>
                <span
                  className={`ml-3 grid h-5 w-5 shrink-0 place-items-center rounded-full border ${isSelected ? "border-accent bg-accent text-accent-foreground" : "border-border text-transparent"}`}
                >
                  <Check size={12} />
                </span>
              </button>
            );
          })}
        </div>
        <Link
          href="/finder"
          className="mt-5 flex items-center gap-1 text-[11px] font-semibold text-accent hover:underline"
          data-testid="link-planner-finder"
        >
          Find another university <ArrowRight size={13} />
        </Link>
      </div>
      <div className="rounded-2xl border border-card-border bg-card shadow-sm">
        <div className="flex items-center justify-between border-b border-border p-5">
          <div>
            <p className="font-mono-ui text-[10px] uppercase tracking-[0.18em] text-accent">
              Comparison matrix
            </p>
            <h2 className="mt-2 font-display text-2xl">
              Trade-offs in one view.
            </h2>
          </div>
          <BadgeCheck size={19} className="text-secondary-foreground" />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px] text-left text-xs">
            <thead>
              <tr className="border-b border-border text-[10px] uppercase tracking-wider text-muted-foreground">
                <th className="px-5 py-4 font-mono-ui">Signal</th>
                {selected.map((university) => (
                  <th
                    key={university.id}
                    className="min-w-[150px] px-4 py-4 font-mono-ui"
                  >
                    {university.logo}
                    <span className="mt-1 block font-sans text-xs font-semibold normal-case tracking-normal text-foreground">
                      {university.name}
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                [
                  "Fit score",
                  ...selected.map((university) => `${university.fitScore}%`),
                ],
                [
                  "Admission rate",
                  ...selected.map(
                    (university) => `${university.acceptanceRate}%`,
                  ),
                ],
                [
                  "Tuition / year",
                  ...selected.map((university) =>
                    university.tuition
                      ? `€${university.tuition.toLocaleString()}`
                      : "No tuition",
                  ),
                ],
                [
                  "Living estimate",
                  ...selected.map(
                    (university) =>
                      `€${university.livingCost.toLocaleString()}`,
                  ),
                ],
                [
                  "Language",
                  ...selected.map((university) =>
                    university.languages.join(" · "),
                  ),
                ],
                [
                  "Post-study work",
                  ...selected.map(
                    (university) =>
                      pgwpByCountry[university.country] ?? "Check authority",
                  ),
                ],
                ["Fit band", ...selected.map((university) => university.tier)],
              ].map(([label, ...values]) => (
                <tr
                  key={String(label)}
                  className="border-b border-border/70 last:border-0"
                >
                  <td className="px-5 py-4 font-semibold text-muted-foreground">
                    {label}
                  </td>
                  {values.map((value, index) => (
                    <td
                      key={`${String(label)}-${index}`}
                      className="px-4 py-4 font-mono-ui text-[11px] text-foreground"
                    >
                      {value}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex flex-wrap gap-2 border-t border-border bg-muted/40 p-4">
          {selected.map((university) => (
            <a
              key={university.id}
              href={university.applicationUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-[10px] font-semibold text-primary-foreground"
              data-testid={`link-compare-apply-${university.id}`}
            >
              {university.logo} official route <ExternalLink size={12} />
            </a>
          ))}
        </div>
        <div className="border-t border-border p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-mono-ui text-[10px] uppercase tracking-[0.18em] text-accent">
                Application map
              </p>
              <h3 className="mt-1 font-display text-xl">
                Use the right front door.
              </h3>
            </div>
            <Link
              href="/finder"
              className="text-[10px] font-semibold text-accent hover:underline"
              data-testid="link-application-map-finder"
            >
              Browse more <ArrowRight size={12} className="ml-1 inline" />
            </Link>
          </div>
          <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {applicationRoutes.map((route) => (
              <a
                key={route.portal}
                href={route.url}
                target="_blank"
                rel="noreferrer"
                className="rounded-lg border border-border/70 p-3 transition-colors hover:bg-muted"
                data-testid={`link-application-route-${route.region.toLowerCase().replaceAll(" ", "-")}`}
              >
                <div className="flex items-center justify-between gap-2">
                  <p className="text-[11px] font-semibold">{route.portal}</p>
                  <ExternalLink size={12} className="text-muted-foreground" />
                </div>
                <p className="mt-1 text-[10px] text-accent">{route.region}</p>
                <p className="mt-2 text-[10px] leading-relaxed text-muted-foreground">
                  {route.detail}
                </p>
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function FundingPanel() {
  const [budget, setBudget] = useState("18000");
  const [currency, setCurrency] = useState("EUR");
  const annualBudget = Number(budget) || 0;
  const conversion: Record<string, number> = {
    EUR: 1,
    GBP: 0.86,
    CHF: 0.96,
    INR: 90.2,
    USD: 1.09,
  };
  const budgetInEuro = annualBudget / conversion[currency];
  return (
    <section className="mt-8 grid gap-6 xl:grid-cols-[0.8fr_1.2fr]">
      <div className="rounded-2xl bg-primary p-6 text-primary-foreground shadow-md">
        <p className="font-mono-ui text-[10px] uppercase tracking-[0.18em] text-primary-foreground/55">
          Financial engine
        </p>
        <h2 className="mt-3 font-display text-3xl">
          Know what the year costs.
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-primary-foreground/70">
          Use the estimate as a planning floor, then verify the exact figure
          with the university and visa authority.
        </p>
        <div className="mt-7 grid grid-cols-[1fr_92px] gap-2">
          <label className="block">
            <span className="field-label text-primary-foreground/60">
              Annual budget
            </span>
            <input
              value={budget}
              onChange={(event) => setBudget(event.target.value)}
              type="number"
              className="field-input mt-2 border-primary-foreground/20 bg-primary-foreground/10 text-primary-foreground"
              data-testid="input-planner-budget"
            />
          </label>
          <label className="block">
            <span className="field-label text-primary-foreground/60">
              Currency
            </span>
            <select
              value={currency}
              onChange={(event) => setCurrency(event.target.value)}
              className="field-input mt-2 border-primary-foreground/20 bg-primary-foreground/10 text-primary-foreground"
              data-testid="select-planner-currency"
            >
              {Object.keys(conversion).map((item) => (
                <option key={item} value={item} className="text-foreground">
                  {item}
                </option>
              ))}
            </select>
          </label>
        </div>
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <div className="rounded-xl bg-primary-foreground/10 p-4">
            <p className="text-[10px] text-primary-foreground/55">
              Germany proof of funds
            </p>
            <p className="mt-1 font-display text-2xl">€11,904</p>
          </div>
          <div className="rounded-xl bg-primary-foreground/10 p-4">
            <p className="text-[10px] text-primary-foreground/55">
              Swiss planning floor
            </p>
            <p className="mt-1 font-display text-2xl">CHF 24,000</p>
          </div>
        </div>
        <p className="mt-6 text-[11px] leading-relaxed text-primary-foreground/60">
          {budgetInEuro >= 18000
            ? `Your ${currency} planning envelope covers several public-university routes. Keep a separate emergency buffer.`
            : "Raise the planning envelope or prioritize lower-tuition regions before committing to a shortlist."}
        </p>
      </div>
      <div className="rounded-2xl border border-card-border bg-card p-5 shadow-sm md:p-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="font-mono-ui text-[10px] uppercase tracking-[0.18em] text-accent">
              Scholarship matcher
            </p>
            <h2 className="mt-2 font-display text-2xl">
              Funding routes worth checking.
            </h2>
          </div>
          <Sparkles size={18} className="text-accent" />
        </div>
        <div className="mt-6 grid gap-3 md:grid-cols-2">
          {scholarshipOptions.map((scholarship) => (
            <a
              key={scholarship.name}
              href={scholarship.url}
              target="_blank"
              rel="noreferrer"
              className="group rounded-xl border border-border/70 p-4 transition-colors hover:bg-muted"
              data-testid={`link-scholarship-${scholarship.name.toLowerCase().replaceAll(" ", "-")}`}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold">{scholarship.name}</p>
                  <p className="mt-1 text-[10px] text-accent">
                    {scholarship.region} · {scholarship.amount}
                  </p>
                </div>
                <ExternalLink
                  size={13}
                  className="shrink-0 text-muted-foreground transition-transform group-hover:-translate-y-0.5"
                />
              </div>
              <p className="mt-3 text-[11px] leading-relaxed text-muted-foreground">
                {scholarship.fit}
              </p>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

function VisaPanel({
  visaTasks,
  auditFiles,
  onAuditFiles,
  onToggle,
}: {
  visaTasks: string[];
  auditFiles: string[];
  onAuditFiles: (files: string[]) => void;
  onToggle: (task: string) => void;
}) {
  const completed = visaTasks.length;
  const [groupFlight, setGroupFlight] = useState(false);
  const [airportPickup, setAirportPickup] = useState(false);
  const auditRisk =
    auditFiles.length === 0 ? null : Math.max(8, 36 - auditFiles.length * 7);
  return (
    <section className="mt-8 grid gap-6 xl:grid-cols-[1.25fr_0.75fr]">
      <div className="space-y-3">
        {visaPhases.map((phase, index) => (
          <div
            key={phase.id}
            className="rounded-2xl border border-card-border bg-card p-5 shadow-sm"
          >
            <div className="flex items-start gap-4">
              <div
                className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl ${phase.tasks.every((task) => visaTasks.includes(task)) ? "bg-secondary text-secondary-foreground" : "bg-muted text-muted-foreground"}`}
              >
                {phase.tasks.every((task) => visaTasks.includes(task)) ? (
                  <Check size={18} />
                ) : (
                  <span className="font-mono-ui text-xs">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <p className="font-mono-ui text-[10px] uppercase tracking-[0.16em] text-accent">
                      {phase.phase}
                    </p>
                    <h2 className="mt-1 font-display text-2xl">
                      {phase.title}
                    </h2>
                  </div>
                  <span className="text-[10px] text-muted-foreground">
                    {
                      phase.tasks.filter((task) => visaTasks.includes(task))
                        .length
                    }
                    /{phase.tasks.length} complete
                  </span>
                </div>
                <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                  {phase.detail}
                </p>
                <div className="mt-4 grid gap-2 md:grid-cols-3">
                  {phase.tasks.map((task) => (
                    <button
                      key={task}
                      onClick={() => onToggle(task)}
                      className={`flex items-start gap-2 rounded-lg border p-2.5 text-left text-[10px] transition-colors ${visaTasks.includes(task) ? "border-secondary/60 bg-secondary/30 text-foreground" : "border-border/70 hover:bg-muted"}`}
                      data-testid={`button-visa-task-${task.toLowerCase().replaceAll(" ", "-")}`}
                    >
                      <span
                        className={`mt-0.5 grid h-4 w-4 shrink-0 place-items-center rounded-full border ${visaTasks.includes(task) ? "border-secondary bg-secondary text-secondary-foreground" : "border-border text-transparent"}`}
                      >
                        <Check size={10} />
                      </span>
                      {task}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
        <DocumentAuditor
          auditFiles={auditFiles}
          onAuditFiles={onAuditFiles}
          risk={auditRisk}
        />
        <div className="rounded-2xl border border-card-border bg-card p-5 shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <p className="font-mono-ui text-[10px] uppercase tracking-[0.18em] text-accent">
                Phase 4 · Departure sync
              </p>
              <h2 className="mt-2 font-display text-2xl">
                Make arrival less uncertain.
              </h2>
            </div>
            <Plane size={19} className="text-secondary-foreground" />
          </div>
          <div className="mt-5 grid gap-2 sm:grid-cols-2">
            <button
              onClick={() => setGroupFlight((value) => !value)}
              className={`rounded-xl border p-4 text-left transition-colors ${groupFlight ? "border-secondary bg-secondary/30" : "border-border/70 hover:bg-muted"}`}
              data-testid="button-group-flight"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold">
                  Group flight board
                </span>
                <span
                  className={`grid h-5 w-5 place-items-center rounded-full border ${groupFlight ? "border-secondary bg-secondary text-secondary-foreground" : "border-border text-transparent"}`}
                >
                  <Check size={11} />
                </span>
              </div>
              <p className="mt-2 text-[10px] leading-relaxed text-muted-foreground">
                Coordinate arrival windows with other students headed to the
                same city.
              </p>
            </button>
            <button
              onClick={() => setAirportPickup((value) => !value)}
              className={`rounded-xl border p-4 text-left transition-colors ${airportPickup ? "border-secondary bg-secondary/30" : "border-border/70 hover:bg-muted"}`}
              data-testid="button-airport-pickup"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold">Airport pickup</span>
                <span
                  className={`grid h-5 w-5 place-items-center rounded-full border ${airportPickup ? "border-secondary bg-secondary text-secondary-foreground" : "border-border text-transparent"}`}
                >
                  <Check size={11} />
                </span>
              </div>
              <p className="mt-2 text-[10px] leading-relaxed text-muted-foreground">
                Add an arrival handoff to your relocation checklist.
              </p>
            </button>
          </div>
        </div>
      </div>
      <aside className="h-fit rounded-2xl bg-primary p-6 text-primary-foreground shadow-md xl:sticky xl:top-24">
        <p className="font-mono-ui text-[10px] uppercase tracking-[0.18em] text-primary-foreground/55">
          Visa readiness
        </p>
        <div className="mt-3 flex items-baseline gap-2">
          <span className="font-display text-5xl">{completed}</span>
          <span className="text-sm text-primary-foreground/55">/12 tasks</span>
        </div>
        <div className="mt-5 h-1.5 overflow-hidden rounded-full bg-primary-foreground/15">
          <div
            className="h-full rounded-full bg-accent transition-all"
            style={{ width: `${(completed / 12) * 100}%` }}
          />
        </div>
        <p className="mt-5 text-sm leading-relaxed text-primary-foreground/70">
          Keep evidence organized by phase. The fastest visa appointment is
          still useless without a complete packet.
        </p>
        <div className="mt-6 rounded-xl bg-primary-foreground/10 p-4 text-[11px] text-primary-foreground/75">
          <p className="font-semibold text-primary-foreground">
            External alerts stay external
          </p>
          <p className="mt-2 leading-relaxed">
            Embassy and VFS slot availability changes outside the app. Use the
            official portal for the final appointment and never pay an
            unofficial broker.
          </p>
        </div>
        <a
          href="https://home-affairs.ec.europa.eu/policies/schengen-borders-and-visa/visa-policy_en"
          target="_blank"
          rel="noreferrer"
          className="mt-6 inline-flex items-center gap-2 text-[11px] font-semibold text-accent hover:underline"
          data-testid="link-visa-guidance"
        >
          Check official guidance <ExternalLink size={13} />
        </a>
      </aside>
    </section>
  );
}

function DocumentAuditor({
  auditFiles,
  onAuditFiles,
  risk,
}: {
  auditFiles: string[];
  onAuditFiles: (files: string[]) => void;
  risk: number | null;
}) {
  const onFiles = (files: FileList | null) => {
    if (!files) return;
    onAuditFiles(Array.from(files).map((file) => file.name));
  };
  return (
    <div className="rounded-2xl border border-card-border bg-card p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-mono-ui text-[10px] uppercase tracking-[0.18em] text-accent">
            Document preflight
          </p>
          <h2 className="mt-2 font-display text-2xl">
            Catch avoidable rejection risk.
          </h2>
          <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
            Upload filenames for a local checklist pass. This does not replace
            embassy, HRD, or apostille verification.
          </p>
        </div>
        <FileCheck2 size={19} className="text-secondary-foreground" />
      </div>
      <label
        className="mt-5 flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-border bg-muted/40 px-4 py-5 text-xs font-semibold transition-colors hover:bg-muted"
        data-testid="label-upload-visa-documents"
      >
        <UploadCloud size={16} className="text-accent" /> Add passport, degree,
        or proof-of-funds files
        <input
          type="file"
          multiple
          accept=".pdf,.jpg,.jpeg,.png"
          onChange={(event) => onFiles(event.target.files)}
          className="sr-only"
          data-testid="input-upload-visa-documents"
        />
      </label>
      {auditFiles.length > 0 && (
        <div className="mt-4 grid gap-2 sm:grid-cols-2">
          {auditFiles.map((file) => (
            <div
              key={file}
              className="flex items-center gap-2 rounded-lg border border-border/70 p-2.5 text-[10px]"
            >
              <FileUp size={13} className="text-accent" />
              <span className="truncate">{file}</span>
            </div>
          ))}
        </div>
      )}
      {risk !== null && (
        <div
          className="mt-4 rounded-xl bg-secondary/30 p-4"
          data-testid="status-document-risk"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold">
              Preflight rejection-risk signal
            </span>
            <span className="font-mono-ui text-sm">{risk}/100</span>
          </div>
          <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-background/60">
            <div
              className="h-full rounded-full bg-accent"
              style={{ width: `${risk}%` }}
            />
          </div>
          <p className="mt-2 text-[10px] leading-relaxed text-muted-foreground">
            Low score means the file set still needs review. The app only checks
            that a working set has been selected; it cannot verify authenticity
            or immigration eligibility.
          </p>
        </div>
      )}
    </div>
  );
}

function EctsPanel({ selected }: { selected: University[] }) {
  const [syllabusFiles, setSyllabusFiles] = useState<string[]>([]);
  const [topics, setTopics] = useState<string[]>([
    "Advanced Mathematics",
    "Programming",
  ]);
  const required = [
    "Advanced Mathematics",
    "Programming",
    "Statistics",
    "Systems",
  ];
  const matched = required.filter((topic) => topics.includes(topic));
  const toggleTopic = (topic: string) =>
    setTopics((current) =>
      current.includes(topic)
        ? current.filter((item) => item !== topic)
        : [...current, topic],
    );
  return (
    <section className="mt-8 grid gap-6 xl:grid-cols-[0.8fr_1.2fr]">
      <div className="rounded-2xl border border-card-border bg-card p-6 shadow-sm">
        <p className="font-mono-ui text-[10px] uppercase tracking-[0.18em] text-accent">
          ECTS matcher
        </p>
        <h2 className="mt-2 font-display text-3xl">
          Translate your transcript into prerequisites.
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          Add syllabus PDFs, then mark the topics you have already covered. The
          result highlights what to verify with each programme.
        </p>
        <label
          className="mt-6 flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-border bg-muted/40 px-4 py-7 text-xs font-semibold transition-colors hover:bg-muted"
          data-testid="label-upload-syllabus"
        >
          <ScanSearch size={17} className="text-accent" /> Upload transcript
          syllabus PDFs
          <input
            type="file"
            multiple
            accept=".pdf"
            onChange={(event) =>
              setSyllabusFiles(
                Array.from(event.target.files ?? []).map((file) => file.name),
              )
            }
            className="sr-only"
            data-testid="input-upload-syllabus"
          />
        </label>
        {syllabusFiles.length > 0 && (
          <div className="mt-4 space-y-2">
            {syllabusFiles.map((file) => (
              <div
                key={file}
                className="flex items-center gap-2 rounded-lg bg-muted p-2.5 text-[10px]"
              >
                <FileText size={13} className="text-accent" />
                {file}
              </div>
            ))}
          </div>
        )}
        <p className="mt-5 field-label">Topics already covered</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {required.map((topic) => (
            <button
              key={topic}
              onClick={() => toggleTopic(topic)}
              className={`rounded-lg border px-2.5 py-2 text-[10px] transition-colors ${topics.includes(topic) ? "border-secondary bg-secondary text-secondary-foreground" : "border-input text-muted-foreground hover:bg-muted"}`}
              data-testid={`button-ects-topic-${topic.toLowerCase().replaceAll(" ", "-")}`}
            >
              {topics.includes(topic) && (
                <Check size={11} className="mr-1 inline" />
              )}
              {topic}
            </button>
          ))}
        </div>
      </div>
      <div className="rounded-2xl border border-card-border bg-card p-6 shadow-sm">
        <div className="flex items-start justify-between">
          <div>
            <p className="font-mono-ui text-[10px] uppercase tracking-[0.18em] text-accent">
              Gap readout
            </p>
            <h2 className="mt-2 font-display text-2xl">What needs evidence.</h2>
          </div>
          <BadgeCheck size={19} className="text-secondary-foreground" />
        </div>
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          {(selected.length
            ? selected
            : [
                {
                  id: "default",
                  name: "Selected programme",
                  country: "",
                  city: "",
                  countryCode: "",
                  region: "",
                  type: "",
                  rank: 0,
                  tuition: 0,
                  livingCost: 0,
                  acceptanceRate: 0,
                  fitScore: 0,
                  tier: "target" as const,
                  fields: [],
                  languages: [],
                  applicationUrl: "",
                  logo: "EU",
                  image: "",
                  highlights: [],
                },
              ]
          )
            .slice(0, 2)
            .map((university) => (
              <div key={university.id} className="rounded-xl bg-muted p-4">
                <p className="text-xs font-semibold">{university.name}</p>
                <p className="mt-1 text-[10px] text-muted-foreground">
                  {university.city}
                  {university.country ? `, ${university.country}` : ""}
                </p>
                <div className="mt-4 flex items-baseline gap-2">
                  <span className="font-display text-3xl">
                    {matched.length * 5}
                  </span>
                  <span className="text-[10px] text-muted-foreground">
                    ECTS evidenced
                  </span>
                </div>
                <p className="mt-2 text-[10px] leading-relaxed text-muted-foreground">
                  {required.length - matched.length
                    ? `${required.length - matched.length} prerequisite area(s) still need a syllabus or bridge course.`
                    : "Core prerequisite areas are represented; verify exact credit equivalence with the programme."}
                </p>
              </div>
            ))}
        </div>
        <div className="mt-6 border-t border-border pt-5">
          <p className="text-xs font-semibold">Matcher boundary</p>
          <p className="mt-2 text-[11px] leading-relaxed text-muted-foreground">
            This workspace records the files and topics you select. It does not
            claim to parse or certify transcript content until a
            document-processing service is connected.
          </p>
        </div>
      </div>
    </section>
  );
}

function HousingPanel({ selected }: { selected: University[] }) {
  const cities = selected.map((university) => university.city);
  return (
    <section className="mt-8 grid gap-6 xl:grid-cols-[0.75fr_1.25fr]">
      <div className="rounded-2xl border border-card-border bg-card p-6 shadow-sm">
        <p className="font-mono-ui text-[10px] uppercase tracking-[0.18em] text-accent">
          Housing signal
        </p>
        <h2 className="mt-2 font-display text-3xl">Start with the city.</h2>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          Housing is a parallel application. Begin as soon as you have an offer,
          especially in Amsterdam, Munich, Zürich, and Dublin.
        </p>
        <div className="mt-7 space-y-2">
          {(cities.length ? cities : ["Your selected city"]).map((city) => (
            <div
              key={city}
              className="flex items-center gap-3 rounded-xl bg-muted p-3"
            >
              <span className="grid h-8 w-8 place-items-center rounded-lg bg-secondary text-secondary-foreground">
                <MapPinned size={15} />
              </span>
              <span>
                <span className="block text-xs font-semibold">{city}</span>
                <span className="block text-[10px] text-muted-foreground">
                  Track availability and registration requirements
                </span>
              </span>
            </div>
          ))}
        </div>
      </div>
      <div className="rounded-2xl border border-card-border bg-card p-5 shadow-sm md:p-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="font-mono-ui text-[10px] uppercase tracking-[0.18em] text-accent">
              Verified routes
            </p>
            <h2 className="mt-2 font-display text-2xl">
              Places to search without guessing.
            </h2>
          </div>
          <LockKeyhole size={18} className="text-secondary-foreground" />
        </div>
        <div className="mt-6 grid gap-3">
          {housingProviders.map((provider) => (
            <a
              key={provider.name}
              href={provider.url}
              target="_blank"
              rel="noreferrer"
              className="group flex items-center justify-between rounded-xl border border-border/70 p-4 transition-colors hover:bg-muted"
              data-testid={`link-housing-${provider.name.toLowerCase().replaceAll(" ", "-")}`}
            >
              <div>
                <p className="text-xs font-semibold">{provider.name}</p>
                <p className="mt-1 text-[10px] text-accent">
                  {provider.coverage}
                </p>
                <p className="mt-2 max-w-xl text-[11px] leading-relaxed text-muted-foreground">
                  {provider.detail}
                </p>
              </div>
              <ExternalLink
                size={15}
                className="shrink-0 text-muted-foreground transition-transform group-hover:-translate-y-0.5"
              />
            </a>
          ))}
        </div>
        <div className="mt-5 border-t border-border pt-4">
          <p className="text-[10px] leading-relaxed text-muted-foreground">
            Never pay a deposit through an unverified channel. Confirm the
            landlord, contract, and platform protection before sending funds.
          </p>
        </div>
      </div>
    </section>
  );
}

function SopPanel({
  field,
  interest,
  goal,
  resumeText,
  onFieldChange,
  onInterestChange,
  onGoalChange,
  onResumeChange,
  resumeScore,
  university,
}: {
  field: string;
  interest: string;
  goal: string;
  resumeText: string;
  onFieldChange: (value: string) => void;
  onInterestChange: (value: string) => void;
  onGoalChange: (value: string) => void;
  onResumeChange: (value: string) => void;
  resumeScore: number;
  university?: University;
}) {
  const school = university?.name ?? "your selected university";
  return (
    <section className="mt-8 grid gap-6 xl:grid-cols-[0.85fr_1.15fr]">
      <div className="rounded-2xl border border-card-border bg-card p-5 shadow-sm md:p-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="font-mono-ui text-[10px] uppercase tracking-[0.18em] text-accent">
              SOP studio
            </p>
            <h2 className="mt-2 font-display text-2xl">
              Start with specificity.
            </h2>
          </div>
          <PenLine size={19} className="text-accent" />
        </div>
        <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
          Build a curriculum-specific outline from your experience and goals.
          Review every claim before using it in an application.
        </p>
        <div className="mt-6 space-y-4">
          <label className="block">
            <span className="field-label">Field of study</span>
            <input
              value={field}
              onChange={(event) => onFieldChange(event.target.value)}
              className="field-input mt-2"
              data-testid="input-sop-field"
            />
          </label>
          <label className="block">
            <span className="field-label">Research or curriculum interest</span>
            <textarea
              value={interest}
              onChange={(event) => onInterestChange(event.target.value)}
              placeholder="What problem, lab area, or course cluster keeps pulling you in?"
              className="field-input mt-2 min-h-24 resize-y"
              data-testid="textarea-sop-interest"
            />
          </label>
          <label className="block">
            <span className="field-label">Post-study goal</span>
            <textarea
              value={goal}
              onChange={(event) => onGoalChange(event.target.value)}
              placeholder="What do you want to build, research, or change after the degree?"
              className="field-input mt-2 min-h-24 resize-y"
              data-testid="textarea-sop-goal"
            />
          </label>
        </div>
        <div className="mt-6 rounded-xl bg-muted p-4">
          <div className="flex items-center gap-2 text-xs font-semibold">
            <BookOpen size={15} className="text-accent" /> LOR prompt
          </div>
          <p className="mt-2 text-[11px] leading-relaxed text-muted-foreground">
            Ask a recommender to describe one concrete project where you
            demonstrated the skills this programme values.
          </p>
        </div>
      </div>
      <div className="space-y-6">
        <div className="rounded-2xl bg-primary p-6 text-primary-foreground shadow-md">
          <p className="font-mono-ui text-[10px] uppercase tracking-[0.18em] text-primary-foreground/55">
            Draft structure
          </p>
          <h2 className="mt-3 font-display text-3xl">
            {interest && goal
              ? `Your ${field} story at ${school}.`
              : "Your story, made legible."}
          </h2>
          <div className="mt-6 space-y-3">
            {[
              "Origin: the experience that made this field matter",
              "Fit: the curriculum, lab, or method you are pursuing",
              "Proof: the work that shows you can contribute",
              "Direction: the problem you want to work on next",
            ].map((section, index) => (
              <div
                key={section}
                className="flex gap-3 border-t border-primary-foreground/15 pt-3 text-xs"
              >
                <span className="font-mono-ui text-primary-foreground/45">
                  0{index + 1}
                </span>
                <span className="text-primary-foreground/80">{section}</span>
              </div>
            ))}
          </div>
          <button
            className="mt-6 inline-flex items-center gap-2 rounded-lg bg-accent px-3 py-2 text-[11px] font-semibold text-accent-foreground"
            onClick={() => undefined}
            data-testid="button-export-sop-outline"
          >
            Copy outline <ArrowRight size={13} />
          </button>
        </div>
        <div className="rounded-2xl border border-card-border bg-card p-5 shadow-sm md:p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="font-mono-ui text-[10px] uppercase tracking-[0.18em] text-accent">
                EuroPass resume drafter
              </p>
              <h2 className="mt-2 font-display text-2xl">
                Make evidence easy to scan.
              </h2>
            </div>
            <FileText size={18} className="text-secondary-foreground" />
          </div>
          <textarea
            value={resumeText}
            onChange={(event) => onResumeChange(event.target.value)}
            placeholder="Paste a short experience summary to get a first-pass signal..."
            className="field-input mt-5 min-h-28 resize-y"
            data-testid="textarea-resume-summary"
          />
          <div className="mt-4 flex items-center justify-between rounded-xl bg-muted p-3">
            <span className="text-[11px] text-muted-foreground">
              ATS readability signal
            </span>
            <span className="font-mono-ui text-sm">{resumeScore}/100</span>
          </div>
          <p className="mt-3 text-[10px] leading-relaxed text-muted-foreground">
            This is a drafting aid, not a guarantee of selection or automated
            screening outcomes.
          </p>
        </div>
      </div>
    </section>
  );
}
