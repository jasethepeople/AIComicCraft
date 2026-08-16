import { sql, desc, eq, and } from "drizzle-orm";
import { db } from "../db";
import { srfPipelineRuns, type InsertSrfPipelineRun, type SrfPipelineRun } from "@shared/schema";

let storageReady = false;

export async function ensureSrfStorage() {
  if (storageReady) return;

  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS srf_pipeline_runs (
      id TEXT PRIMARY KEY,
      tenant_id TEXT NOT NULL,
      client_id TEXT NOT NULL,
      input_snapshot JSONB NOT NULL,
      correlation_version TEXT NOT NULL,
      risk_algorithm_version TEXT NOT NULL,
      exposures JSONB NOT NULL,
      summary JSONB NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `);
  storageReady = true;
}

export async function createSrfPipelineRun(
  run: InsertSrfPipelineRun,
): Promise<SrfPipelineRun> {
  await ensureSrfStorage();
  const [created] = await db.insert(srfPipelineRuns).values(run).returning();
  return created;
}

export async function listSrfPipelineRuns(
  tenantId: string,
  clientId: string,
): Promise<SrfPipelineRun[]> {
  await ensureSrfStorage();
  return db
    .select()
    .from(srfPipelineRuns)
    .where(
      and(
        eq(srfPipelineRuns.tenantId, tenantId),
        eq(srfPipelineRuns.clientId, clientId),
      ),
    )
    .orderBy(desc(srfPipelineRuns.createdAt));
}

export async function getSrfPipelineRun(
  id: string,
  tenantId: string,
  clientId: string,
): Promise<SrfPipelineRun | undefined> {
  await ensureSrfStorage();
  const [run] = await db
    .select()
    .from(srfPipelineRuns)
    .where(
      and(
        eq(srfPipelineRuns.id, id),
        eq(srfPipelineRuns.tenantId, tenantId),
        eq(srfPipelineRuns.clientId, clientId),
      ),
    );
  return run;
}