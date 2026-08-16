import type { Express, Request } from "express";
import { randomUUID } from "crypto";
import { z } from "zod";
import {
  buildDemoPipelineInput,
  pipelineInputSchema,
  runDeterministicPipeline,
  type PipelineInput,
} from "./core";
import {
  createSrfPipelineRun,
  getSrfPipelineRun,
  listSrfPipelineRuns,
} from "./repository";

const requestSchema = z.object({
  input: pipelineInputSchema.optional(),
});

function requestContext(req: Request) {
  return {
    tenantId: req.header("X-SRF-Tenant") || "tenant-demo",
    clientId: req.header("X-SRF-Client") || "client-demo",
  };
}

function inputForContext(input: PipelineInput, tenantId: string, clientId: string): PipelineInput {
  return {
    ...input,
    tenant: { ...input.tenant, id: tenantId },
    client: { ...input.client, id: clientId, tenantId },
    assets: input.assets.map((asset) => ({ ...asset, clientId })),
  };
}

async function executeAndStore(input: PipelineInput) {
  const result = runDeterministicPipeline(input);
  const run = await createSrfPipelineRun({
    id: `run_${randomUUID()}`,
    tenantId: input.tenant.id,
    clientId: input.client.id,
    inputSnapshot: result.input,
    correlationVersion: result.correlationVersion,
    riskAlgorithmVersion: result.riskAlgorithmVersion,
    exposures: result.exposures,
    summary: result.summary,
  });
  return { ...run, inputSnapshot: result.input, exposures: result.exposures, summary: result.summary };
}

export function registerSrfRoutes(app: Express) {
  app.get("/api/srf/overview", async (req, res) => {
    try {
      const { tenantId, clientId } = requestContext(req);
      const runs = await listSrfPipelineRuns(tenantId, clientId);
      const latest = runs[0] ?? (await executeAndStore(inputForContext(buildDemoPipelineInput(), tenantId, clientId)));
      res.json({
        context: { tenantId, clientId },
        latest,
        runs: runs.length > 0 ? runs.slice(0, 8) : [latest],
      });
    } catch (error) {
      console.error("SRF overview failed:", error);
      res.status(500).json({ message: "Failed to load SRF overview" });
    }
  });

  app.get("/api/srf/pipeline-runs", async (req, res) => {
    try {
      const { tenantId, clientId } = requestContext(req);
      res.json(await listSrfPipelineRuns(tenantId, clientId));
    } catch (error) {
      console.error("SRF pipeline history failed:", error);
      res.status(500).json({ message: "Failed to load SRF pipeline history" });
    }
  });

  app.get("/api/srf/pipeline-runs/:id", async (req, res) => {
    try {
      const { tenantId, clientId } = requestContext(req);
      const run = await getSrfPipelineRun(req.params.id, tenantId, clientId);
      if (!run) return res.status(404).json({ message: "Pipeline run not found" });
      res.json(run);
    } catch (error) {
      console.error("SRF pipeline run failed:", error);
      res.status(500).json({ message: "Failed to load SRF pipeline run" });
    }
  });

  app.post("/api/srf/pipeline-runs", async (req, res) => {
    try {
      const { tenantId, clientId } = requestContext(req);
      const parsed = requestSchema.parse(req.body ?? {});
      const input = inputForContext(
        parsed.input ?? buildDemoPipelineInput(),
        tenantId,
        clientId,
      );
      res.status(201).json(await executeAndStore(input));
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: error.flatten() });
      }
      console.error("SRF pipeline execution failed:", error);
      res.status(500).json({ message: "Failed to execute SRF pipeline" });
    }
  });
}