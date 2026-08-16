import { useEffect, useMemo, useState } from "react";
import {
  Activity,
  ArrowUpRight,
  CheckCircle2,
  ChevronRight,
  Clock3,
  Database,
  FileSearch,
  LockKeyhole,
  RefreshCw,
  Server,
  ShieldAlert,
  Workflow,
} from "lucide-react";

type Summary = {
  assetCount: number;
  evidenceCount: number;
  vulnerabilityCount: number;
  exposureCount: number;
  criticalCount: number;
  highCount: number;
  mediumCount: number;
  lowCount: number;
  maxRisk: number;
};

type Exposure = {
  id: string;
  assetId: string;
  softwareId: string;
  vulnerabilityId: string;
  evidenceIds: string[];
  whyExposed: string;
  risk: {
    value: number;
    level: "low" | "medium" | "high" | "critical";
    severity: number;
    confidence: number;
    exploitability: number;
    assetCriticality: number;
    exposureContext: number;
  };
};

type PipelineRun = {
  id: string;
  correlationVersion: string;
  riskAlgorithmVersion: string;
  summary: Summary;
  exposures: Exposure[];
  createdAt: string;
};

type Overview = {
  context: { tenantId: string; clientId: string };
  latest: PipelineRun;
  runs: PipelineRun[];
};

const levelStyles: Record<Exposure["risk"]["level"], string> = {
  critical: "border-rose-400/30 bg-rose-400/10 text-rose-200",
  high: "border-orange-400/30 bg-orange-400/10 text-orange-200",
  medium: "border-amber-400/30 bg-amber-400/10 text-amber-200",
  low: "border-emerald-400/30 bg-emerald-400/10 text-emerald-200",
};

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value));
}

function shortId(value: string) {
  return value.length > 22 ? `${value.slice(0, 18)}…` : value;
}

export default function SrfDashboard() {
  const [overview, setOverview] = useState<Overview | null>(null);
  const [loading, setLoading] = useState(true);
  const [running, setRunning] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadOverview = async () => {
    try {
      setError(null);
      const response = await fetch("/api/srf/overview");
      if (!response.ok) throw new Error("The SRF overview could not be loaded.");
      setOverview((await response.json()) as Overview);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Unable to load SRF.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadOverview();
  }, []);

  const runPipeline = async () => {
    try {
      setRunning(true);
      setError(null);
      const response = await fetch("/api/srf/pipeline-runs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });
      if (!response.ok) throw new Error("The pipeline run failed.");
      await loadOverview();
    } catch (runError) {
      setError(runError instanceof Error ? runError.message : "Unable to run SRF.");
    } finally {
      setRunning(false);
    }
  };

  const latest = overview?.latest;
  const summary = latest?.summary;
  const exposures = useMemo(
    () => (latest?.exposures ?? []).slice().sort((a, b) => b.risk.value - a.risk.value),
    [latest],
  );

  return (
    <div className="min-h-screen bg-[#07111f] text-slate-100">
      <div className="mx-auto max-w-7xl px-5 py-10 sm:px-8 lg:px-10">
        <div className="mb-10 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <div className="mb-4 flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.24em] text-cyan-300">
              <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-cyan-400/10 ring-1 ring-cyan-300/20">
                <ShieldAlert className="h-4 w-4" />
              </span>
              Security Risk Fabric
            </div>
            <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-white sm:text-5xl">
              Evidence you can defend.
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-slate-400">
              A deterministic security pipeline that correlates inventory evidence to
              vulnerabilities and preserves every score as an immutable run.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <a
              href="/"
              className="rounded-xl border border-slate-700 px-4 py-2.5 text-sm font-medium text-slate-300 transition hover:border-slate-500 hover:text-white"
            >
              Back to ComicAI
            </a>
            <button
              type="button"
              onClick={() => void runPipeline()}
              disabled={running || loading}
              className="inline-flex items-center gap-2 rounded-xl bg-cyan-400 px-4 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <RefreshCw className={`h-4 w-4 ${running ? "animate-spin" : ""}`} />
              {running ? "Running pipeline" : "Run pipeline"}
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-6 flex items-center gap-3 rounded-2xl border border-rose-400/30 bg-rose-400/10 px-5 py-4 text-sm text-rose-200">
            <ShieldAlert className="h-5 w-5 shrink-0" />
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex min-h-[360px] items-center justify-center rounded-3xl border border-slate-800 bg-slate-900/60">
            <div className="flex items-center gap-3 text-sm text-slate-400">
              <RefreshCw className="h-4 w-4 animate-spin text-cyan-300" />
              Loading the evidence chain…
            </div>
          </div>
        ) : (
          <>
            <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <MetricCard
                icon={<ShieldAlert className="h-5 w-5" />}
                label="Open exposures"
                value={summary?.exposureCount ?? 0}
                detail={`${summary?.criticalCount ?? 0} critical · ${summary?.highCount ?? 0} high`}
                accent="rose"
              />
              <MetricCard
                icon={<Server className="h-5 w-5" />}
                label="Assets analyzed"
                value={summary?.assetCount ?? 0}
                detail={`${summary?.evidenceCount ?? 0} evidence records`}
                accent="cyan"
              />
              <MetricCard
                icon={<Activity className="h-5 w-5" />}
                label="Highest deterministic risk"
                value={summary?.maxRisk ?? 0}
                detail="0–100 risk score"
                accent="amber"
              />
              <MetricCard
                icon={<LockKeyhole className="h-5 w-5" />}
                label="Algorithm status"
                value="Pinned"
                detail={latest?.riskAlgorithmVersion ?? "Awaiting run"}
                accent="emerald"
              />
            </div>

            <div className="grid gap-6 lg:grid-cols-[1.45fr_0.85fr]">
              <section className="overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/60">
                <div className="flex items-center justify-between border-b border-slate-800 px-6 py-5">
                  <div>
                    <div className="flex items-center gap-2 text-sm font-semibold text-white">
                      <FileSearch className="h-4 w-4 text-cyan-300" />
                      Correlated exposures
                    </div>
                    <p className="mt-1 text-xs text-slate-500">
                      Every result links software, vulnerability, and source evidence.
                    </p>
                  </div>
                  <span className="rounded-full border border-slate-700 px-3 py-1 text-xs text-slate-400">
                    {exposures.length} findings
                  </span>
                </div>
                <div className="divide-y divide-slate-800">
                  {exposures.length === 0 ? (
                    <div className="px-6 py-12 text-center text-sm text-slate-500">
                      No correlated exposures in this run.
                    </div>
                  ) : (
                    exposures.map((exposure) => (
                      <div key={exposure.id} className="px-6 py-5 transition hover:bg-white/[0.02]">
                        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
                          <div>
                            <div className="mb-2 flex flex-wrap items-center gap-2">
                              <span className={`rounded-full border px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider ${levelStyles[exposure.risk.level]}`}>
                                {exposure.risk.level} · {exposure.risk.value}
                              </span>
                              <span className="text-xs font-medium text-slate-300">
                                {exposure.vulnerabilityId}
                              </span>
                            </div>
                            <p className="text-sm leading-6 text-slate-300">{exposure.whyExposed}</p>
                          </div>
                          <ChevronRight className="hidden h-5 w-5 shrink-0 text-slate-600 sm:block" />
                        </div>
                        <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-xs text-slate-500">
                          <span>Asset: {shortId(exposure.assetId)}</span>
                          <span>Evidence: {exposure.evidenceIds.join(", ")}</span>
                          <span>Confidence: {Math.round(exposure.risk.confidence * 100)}%</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </section>

              <section className="rounded-3xl border border-slate-800 bg-slate-900/60">
                <div className="border-b border-slate-800 px-6 py-5">
                  <div className="flex items-center gap-2 text-sm font-semibold text-white">
                    <Workflow className="h-4 w-4 text-cyan-300" />
                    Pipeline history
                  </div>
                  <p className="mt-1 text-xs text-slate-500">
                    Immutable snapshots make score changes explainable over time.
                  </p>
                </div>
                <div className="space-y-1 p-3">
                  {(overview?.runs ?? []).map((run, index) => (
                    <div
                      key={run.id}
                      className={`rounded-2xl px-3 py-3 ${index === 0 ? "bg-cyan-400/[0.08] ring-1 ring-cyan-300/10" : "hover:bg-white/[0.03]"}`}
                    >
                      <div className="flex items-center justify-between gap-3">
                        <span className="flex items-center gap-2 text-xs font-medium text-slate-300">
                          {index === 0 ? (
                            <CheckCircle2 className="h-4 w-4 text-emerald-300" />
                          ) : (
                            <Clock3 className="h-4 w-4 text-slate-500" />
                          )}
                          {index === 0 ? "Latest run" : "Historical run"}
                        </span>
                        <span className="text-[11px] text-slate-500">{formatDate(run.createdAt)}</span>
                      </div>
                      <div className="mt-2 flex items-center justify-between gap-3">
                        <span className="font-mono text-[11px] text-slate-500">{shortId(run.id)}</span>
                        <span className="text-xs text-slate-400">
                          {run.summary.exposureCount} exposures · max {run.summary.maxRisk}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
                {latest && (
                  <div className="m-3 rounded-2xl border border-slate-800 bg-slate-950/50 p-4">
                    <div className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
                      <Database className="h-3.5 w-3.5" />
                      Run provenance
                    </div>
                    <div className="space-y-2 text-xs text-slate-400">
                      <div className="flex justify-between gap-3">
                        <span>Correlation</span>
                        <span className="font-mono text-slate-300">{latest.correlationVersion}</span>
                      </div>
                      <div className="flex justify-between gap-3">
                        <span>Risk algorithm</span>
                        <span className="font-mono text-slate-300">{latest.riskAlgorithmVersion}</span>
                      </div>
                      <div className="flex justify-between gap-3">
                        <span>Client context</span>
                        <span className="font-mono text-slate-300">{overview?.context.clientId}</span>
                      </div>
                    </div>
                  </div>
                )}
              </section>
            </div>

            <div className="mt-6 rounded-3xl border border-cyan-300/10 bg-cyan-400/[0.05] p-6">
              <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                <div>
                  <p className="text-sm font-semibold text-cyan-100">Deterministic by design</p>
                  <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-400">
                    AI can later explain these structured facts, but it cannot silently
                    change identity, evidence, confidence, criticality, or the risk score.
                  </p>
                </div>
                <a href="/api/srf/overview" className="inline-flex items-center gap-2 text-sm font-semibold text-cyan-200 hover:text-white">
                  View raw API <ArrowUpRight className="h-4 w-4" />
                </a>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function MetricCard({
  icon,
  label,
  value,
  detail,
  accent,
}: {
  icon: React.ReactNode;
  label: string;
  value: number | string;
  detail: string;
  accent: "rose" | "cyan" | "amber" | "emerald";
}) {
  const accents = {
    rose: "text-rose-300 bg-rose-400/10",
    cyan: "text-cyan-300 bg-cyan-400/10",
    amber: "text-amber-300 bg-amber-400/10",
    emerald: "text-emerald-300 bg-emerald-400/10",
  };

  return (
    <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-slate-500">{label}</p>
          <p className="mt-3 text-3xl font-semibold tracking-tight text-white">{value}</p>
        </div>
        <span className={`flex h-10 w-10 items-center justify-center rounded-2xl ${accents[accent]}`}>{icon}</span>
      </div>
      <p className="mt-3 truncate text-xs text-slate-500">{detail}</p>
    </div>
  );
}