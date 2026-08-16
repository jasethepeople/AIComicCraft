import { z } from "zod";

export const CORRELATION_VERSION = "0.4.1";
export const RISK_ALGORITHM_VERSION = "0.4.1-deterministic";

export type Tenant = {
  id: string;
  name: string;
};

export type Client = {
  id: string;
  tenantId: string;
  name: string;
};

export type Asset = {
  id: string;
  clientId: string;
  hostname: string;
  environment: "production" | "staging" | "development";
  criticality: number;
  exposureContext: number;
  tags: string[];
};

export type Software = {
  id: string;
  assetId: string;
  packageName: string;
  installedVersion: string;
};

export type Evidence = {
  id: string;
  assetId: string;
  softwareId: string;
  kind: "software_inventory" | "network_observation" | "collector_metadata";
  source: string;
  observedAt: string;
  packageName?: string;
  installedVersion?: string;
  confidence: number;
  details: Record<string, string>;
};

export type Vulnerability = {
  id: string;
  title: string;
  affectedProducts: string[];
  fixedVersion: string;
  severity: number;
  exploitSignal: number;
  publishedAt: string;
};

export type RiskFactors = {
  severity: number;
  confidence: number;
  exploitability: number;
  assetCriticality: number;
  exposureContext: number;
};

export type RiskScore = RiskFactors & {
  value: number;
  level: "low" | "medium" | "high" | "critical";
  formula: string;
};

export type Exposure = {
  id: string;
  tenantId: string;
  clientId: string;
  assetId: string;
  softwareId: string;
  vulnerabilityId: string;
  evidenceIds: string[];
  whyExposed: string;
  risk: RiskScore;
  status: "open";
};

export type PipelineInput = {
  tenant: Tenant;
  client: Client;
  assets: Asset[];
  software: Software[];
  evidence: Evidence[];
  vulnerabilities: Vulnerability[];
};

export type PipelineSummary = {
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

export type PipelineResult = {
  input: PipelineInput;
  exposures: Exposure[];
  summary: PipelineSummary;
  correlationVersion: string;
  riskAlgorithmVersion: string;
};

const numberInRange = (value: number, fallback: number): number =>
  Number.isFinite(value) ? Math.min(1, Math.max(0, value)) : fallback;

const severityInRange = (value: number): number =>
  Number.isFinite(value) ? Math.min(10, Math.max(0, value)) : 0;

const normalize = (value: string): string => value.trim().toLowerCase();

/**
 * Compare the numeric parts of common software versions. This intentionally
 * stays conservative: prerelease labels are ignored instead of guessed at.
 */
export function compareVersions(left: string, right: string): number {
  const parse = (version: string) =>
    version
      .split(/[.-]/)
      .slice(0, 4)
      .map((part) => Number.parseInt(part.replace(/\D/g, ""), 10) || 0);
  const a = parse(left);
  const b = parse(right);
  for (let index = 0; index < Math.max(a.length, b.length); index += 1) {
    const difference = (a[index] ?? 0) - (b[index] ?? 0);
    if (difference !== 0) return difference;
  }
  return 0;
}

function scoreRisk(factors: RiskFactors): RiskScore {
  const value = Math.round(
    (factors.severity / 10) *
      factors.confidence *
      factors.exploitability *
      factors.assetCriticality *
      factors.exposureContext *
      100,
  );

  const level: RiskScore["level"] =
    value >= 80 ? "critical" : value >= 60 ? "high" : value >= 35 ? "medium" : "low";

  return {
    ...factors,
    value,
    level,
    formula: "severity/10 × confidence × exploitability × asset_criticality × exposure_context × 100",
  };
}

export function runDeterministicPipeline(input: PipelineInput): PipelineResult {
  const exposures: Exposure[] = [];

  for (const asset of input.assets) {
    const assetSoftware = input.software.filter((item) => item.assetId === asset.id);
    for (const software of assetSoftware) {
      const inventoryEvidence = input.evidence.filter(
        (item) =>
          item.assetId === asset.id &&
          item.softwareId === software.id &&
          item.kind === "software_inventory",
      );

      for (const vulnerability of input.vulnerabilities) {
        const productMatches = vulnerability.affectedProducts.some(
          (product) => normalize(product) === normalize(software.packageName),
        );
        const versionIsAffected =
          compareVersions(software.installedVersion, vulnerability.fixedVersion) < 0;

        if (!productMatches || !versionIsAffected || inventoryEvidence.length === 0) continue;

        const confidence =
          inventoryEvidence.reduce(
            (sum, evidence) => sum + numberInRange(evidence.confidence, 0.5),
            0,
          ) / inventoryEvidence.length;
        const risk = scoreRisk({
          severity: severityInRange(vulnerability.severity),
          confidence,
          exploitability: numberInRange(vulnerability.exploitSignal, 0),
          assetCriticality: numberInRange(asset.criticality, 0.5),
          exposureContext: numberInRange(asset.exposureContext, 1),
        });
        const evidenceIds = inventoryEvidence.map((evidence) => evidence.id);

        exposures.push({
          id: `${asset.id}:${software.id}:${vulnerability.id}`,
          tenantId: input.tenant.id,
          clientId: input.client.id,
          assetId: asset.id,
          softwareId: software.id,
          vulnerabilityId: vulnerability.id,
          evidenceIds,
          whyExposed: `${asset.hostname} reported ${software.packageName} ${software.installedVersion}; ${vulnerability.id} affects versions before ${vulnerability.fixedVersion}. Evidence: ${evidenceIds.join(", ")}.`,
          risk,
          status: "open",
        });
      }
    }
  }

  const counts = exposures.reduce(
    (result, exposure) => {
      result[`${exposure.risk.level}Count` as keyof PipelineSummary] += 1;
      result.maxRisk = Math.max(result.maxRisk, exposure.risk.value);
      return result;
    },
    {
      assetCount: input.assets.length,
      evidenceCount: input.evidence.length,
      vulnerabilityCount: input.vulnerabilities.length,
      exposureCount: exposures.length,
      criticalCount: 0,
      highCount: 0,
      mediumCount: 0,
      lowCount: 0,
      maxRisk: 0,
    } as PipelineSummary,
  );

  return {
    input,
    exposures,
    summary: counts,
    correlationVersion: CORRELATION_VERSION,
    riskAlgorithmVersion: RISK_ALGORITHM_VERSION,
  };
}

export function buildDemoPipelineInput(): PipelineInput {
  return {
    tenant: { id: "tenant-demo", name: "Northstar Manufacturing" },
    client: { id: "client-demo", tenantId: "tenant-demo", name: "Northstar production" },
    assets: [
      {
        id: "asset-payments-api",
        clientId: "client-demo",
        hostname: "payments-api-01",
        environment: "production",
        criticality: 1,
        exposureContext: 1,
        tags: ["internet-facing", "payments", "production"],
      },
      {
        id: "asset-warehouse",
        clientId: "client-demo",
        hostname: "warehouse-worker-02",
        environment: "production",
        criticality: 0.65,
        exposureContext: 0.75,
        tags: ["internal", "warehouse"],
      },
      {
        id: "asset-dev-tools",
        clientId: "client-demo",
        hostname: "dev-tools-01",
        environment: "development",
        criticality: 0.35,
        exposureContext: 0.5,
        tags: ["development"],
      },
    ],
    software: [
      { id: "software-payments-nginx", assetId: "asset-payments-api", packageName: "nginx", installedVersion: "1.18.0" },
      { id: "software-warehouse-openssl", assetId: "asset-warehouse", packageName: "openssl", installedVersion: "3.0.2" },
      { id: "software-dev-nginx", assetId: "asset-dev-tools", packageName: "nginx", installedVersion: "1.25.4" },
    ],
    evidence: [
      {
        id: "evidence-payments-nginx",
        assetId: "asset-payments-api",
        softwareId: "software-payments-nginx",
        kind: "software_inventory",
        source: "osquery-inventory",
        observedAt: "2026-08-16T12:00:00.000Z",
        packageName: "nginx",
        installedVersion: "1.18.0",
        confidence: 0.99,
        details: { collector: "osquery", packageManager: "apt" },
      },
      {
        id: "evidence-warehouse-openssl",
        assetId: "asset-warehouse",
        softwareId: "software-warehouse-openssl",
        kind: "software_inventory",
        source: "osquery-inventory",
        observedAt: "2026-08-16T12:02:00.000Z",
        packageName: "openssl",
        installedVersion: "3.0.2",
        confidence: 0.94,
        details: { collector: "osquery", packageManager: "apt" },
      },
      {
        id: "evidence-dev-nginx",
        assetId: "asset-dev-tools",
        softwareId: "software-dev-nginx",
        kind: "software_inventory",
        source: "developer-laptop-collector",
        observedAt: "2026-08-16T11:58:00.000Z",
        packageName: "nginx",
        installedVersion: "1.25.4",
        confidence: 0.9,
        details: { collector: "agent", packageManager: "brew" },
      },
    ],
    vulnerabilities: [
      {
        id: "CVE-2023-44487",
        title: "HTTP/2 Rapid Reset",
        affectedProducts: ["nginx"],
        fixedVersion: "1.25.3",
        severity: 7.5,
        exploitSignal: 1,
        publishedAt: "2023-10-10",
      },
      {
        id: "CVE-2023-2650",
        title: "OpenSSL certificate verification issue",
        affectedProducts: ["openssl"],
        fixedVersion: "3.0.9",
        severity: 7.5,
        exploitSignal: 0.65,
        publishedAt: "2023-07-31",
      },
    ],
  };
}

export const pipelineInputSchema = z.object({
  tenant: z.object({ id: z.string(), name: z.string() }),
  client: z.object({ id: z.string(), tenantId: z.string(), name: z.string() }),
  assets: z.array(z.any()),
  software: z.array(z.any()),
  evidence: z.array(z.any()),
  vulnerabilities: z.array(z.any()),
});