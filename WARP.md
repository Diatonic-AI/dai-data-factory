# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

---

## Repository Overview

This is the **@dai/data-factory** package - a TypeScript data abstraction and ETL pipeline library for the VÄV Atlas platform. This package is maintained as a **git submodule** within the larger `vav-atlas-demo` monorepo.

**Key Purpose:** Provides dev data abstraction and ETL pipelines integrating Prisma (@vav/prisma) and Supabase (@vav/supabase) for the VÄV Atlas healthcare real estate analytics platform.

**Location in Monorepo:** `vendor/dai-data-factory/`  
**Upstream Repository:** `https://github.com/Diatonic-AI/dai-data-factory.git`

---

## Common Commands

### Build and Development
```bash
# Build the package (compiles TypeScript)
npm run build

# Type checking only (no output)
npm run typecheck

# Clean build artifacts
npm run clean
```

### Working from Parent Monorepo
Since this is a vendor package, most commands are typically run from the parent monorepo root:

```bash
# From /home/daclab-ai/dev/vav-atlas-demo/
npm run build              # Builds all workspaces including this vendor package
npm run typecheck          # Type checks all workspaces
npm run build:packages     # Builds packages only
```

### Git Submodule Commands
```bash
# Update submodule to latest upstream
git submodule update --remote vendor/dai-data-factory

# Initialize/update all submodules (from parent repo root)
git submodule update --init --recursive
```

---

## Architecture & Structure

### Package Structure
```
vendor/dai-data-factory/
├── src/
│   └── index.ts          # Main ETL logic and exports
├── dist/                 # Compiled output (generated)
├── package.json          # Package definition and scripts
├── tsconfig.json         # TypeScript configuration
└── WARP.md              # This file
```

### Core Architecture
This package serves as a **data abstraction layer** between:

1. **Source: Prisma/PostgreSQL** - Primary data store in the Atlas platform (`@vav/prisma`)
2. **Target: Supabase** - Development/analytics sandbox (`@vav/supabase`)

**Primary Export:** `syncSamplePropertiesToSupabase()` - ETL function that syncs property data from Prisma to Supabase for development analytics.

### Key Dependencies
- `@vav/prisma` - Prisma client for Atlas PostgreSQL database
- `@vav/supabase` - Supabase client wrapper
- Re-exports both packages for convenient access

### Integration Points
- **Monorepo Integration:** Consumed as workspace in parent `package.json` under `workspaces: ["vendor/*"]`
- **Build Integration:** Built automatically with `npm run build` from parent
- **Type Integration:** TypeScript configured to produce declarations in `dist/`

---

## Development Notes

### Working with this Package
1. **Local Development:** Make changes directly in this directory
2. **Testing Integration:** Test from parent monorepo context since dependencies are workspace-linked
3. **Deployment:** Changes propagate through the parent monorepo's build system

### ETL Function Usage
```typescript
import { syncSamplePropertiesToSupabase, SyncOptions } from '@dai/data-factory';

// Dry run mode
await syncSamplePropertiesToSupabase({ dryRun: true });

// Production sync with tenant
await syncSamplePropertiesToSupabase({ 
  tenantId: 'example-tenant',
  dryRun: false 
});
```

### Adding New ETL Functions
Follow the pattern in `src/index.ts`:
1. Define interfaces for options
2. Use Prisma for source data access
3. Use Supabase client for target operations
4. Include dry-run mode support
5. Export function and re-export dependencies

---

## Relationship to VÄV Atlas

This package is part of the broader VÄV Atlas healthcare real estate analytics platform:

- **Atlas Tools:** Works alongside Search, Trace, Map, Profile, and Report tools
- **3G Healthcare:** Supports 23+ healthcare intelligence tools
- **Entity Resolution:** Integrates with the platform's entity resolution engine
- **Vector Search:** Supports semantic search via Qdrant integration

The data factory specifically handles dev/sandbox ETL workloads, moving curated data from the production Prisma layer into Supabase for development analytics and testing.