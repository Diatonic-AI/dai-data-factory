/**
 * @dai/data-factory
 *
 * Diatonic AI dev data abstraction + ETL plugin integrating Prisma (@vav/prisma)
 * and Supabase (@vav/supabase).
 *
 * This package is designed to live in a separate Git repository
 * (Diatonic-AI/dai-data-factory) and be consumed as a git submodule in the
 * vav-atlas-demo monorepo under vendor/.
 */

import { prisma } from "@vav/prisma";
import { getSupabaseClient } from "@vav/supabase";

export interface SyncOptions {
  /** Optional tenant identifier for multi-tenant ETL jobs */
  tenantId?: string;
  /** Run in dry-run mode (no writes to targets) */
  dryRun?: boolean;
}

/**
 * Example ETL job: sync a small slice of Prisma data into Supabase for
 * development / sandbox analytics.
 *
 * This is intentionally minimal; we can extend it with concrete table
 * mappings once the Diatonic data model is finalized.
 */
export async function syncSamplePropertiesToSupabase(
  options: SyncOptions = {},
): Promise<void> {
  const supabase = getSupabaseClient({ admin: true });

  // 1) Read from Prisma (Postgres in Atlas)
  const properties = await prisma.property.findMany({
    take: 100,
  });

  if (options.dryRun) {
    console.log(`[dev-data-factory] Would sync ${properties.length} properties`);
    return;
  }

  // 2) Upsert into Supabase (e.g. dev_analytics.properties)
  const { error } = await supabase.from("dev_properties").upsert(
    properties.map((p) => ({
      id: p.id,
      county_name: (p as any).countyName ?? null,
      parcel_id: (p as any).parcelId ?? null,
      updated_at: new Date().toISOString(),
    })),
    { onConflict: "id" },
  );

  if (error) {
    throw new Error(`Supabase upsert failed: ${error.message}`);
  }

  console.log(
    `[dev-data-factory] Synced ${properties.length} properties into dev_properties`,
  );
}

export * from "@vav/prisma";
export * from "@vav/supabase";