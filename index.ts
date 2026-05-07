// @amlhubs/osm — OMG Organization Structure Metamodel v0.5 (bmi/06-11-02)
//
// Re-export facade over `./osm.js`. Two layers:
//   1. Concrete-class re-exports (runtime-usable) — every OSM metaclass.
//   2. Interface type re-exports (type-only) — every IFoo plus the UML/SBVR
//      cross-link aliases.
//
// Call-site form (flat — no nested namespace):
//   import { OrgUnit, OrgPosition, Company, Person, BusinessFunction } from '@amlhubs/osm';
//   import type { INamedElement, IOrgElement, IOrgNode } from '@amlhubs/osm';
//
// Optionally a frozen `osm` namespace will be exposed for consumers that
// prefer dotted access (Phase 3):
//   import { osm } from '@amlhubs/osm';
//   const u = new osm.core.OrgUnit();
//   const p = new osm.legalentity.Person();

// ─── Runtime concrete-class re-exports ──────────────────────────────────────

// (Phase 3 — populated as Section 3 Core, Section 3.1.2 Legal Entity,
//  Section 3.1.3 Position, Section 3.1.4 OrgUnit, and Section 4 Business
//  Rules Extension metaclasses are authored inside ./osm.ts.)

// ─── Interface type re-exports ──────────────────────────────────────────────

// (Phase 3 — populated alongside the runtime re-exports above. Includes the
//  UML and SBVR cross-link type aliases declared at the top of ./osm.ts.)

export {};
