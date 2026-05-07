// @amlhubs/osm — OMG Organization Structure Metamodel v0.5 (bmi/06-11-02)
//
// Re-export facade over `./osm.js`. Two layers:
//   1. Concrete-class re-exports (runtime-usable) — every OSM metaclass,
//      including `abstract class` declarations for the spec-marked yellow
//      types (NamedElement, OrgElement, OrgNode, Role, Addressable, LegalEntity).
//   2. Interface type re-exports (type-only) — every IFoo plus the UML/SBVR
//      cross-link aliases declared at the top of ./osm.ts.
//
// Call-site form (flat — no nested namespace):
//   import { OrgUnit, OrgPosition, Company, Person, BusinessFunction } from '@amlhubs/osm';
//   import type { INamedElement, IOrgElement, IOrgNode } from '@amlhubs/osm';

// ─── Runtime concrete-class re-exports ──────────────────────────────────────

// Section 1 — §3.1.1 Core abstracts
export { NamedElement, OrgElement, OrgNode, Role } from './osm.js';

// Section 2 — §3.1.1 Core concretes
export {
  OrgUnit,
  OrgRelationship,
  OrgPosition,
  OrgAssignment,
  RelationshipType,
} from './osm.js';

// Section 3 — §3.1.2 Legal Entity
export {
  Addressable,
  LegalEntity,
  ContactInfo,
  Company,
  Person,
  JobClassification,
  Community,
} from './osm.js';

// Section 4 — §3.1.3 Position
export {
  ParticipationType,
  PosAuthority,
  PosRequirements,
  ContAssignment,
  ContAgent,
} from './osm.js';

// Section 5 — §3.1.4 OrgUnit
export { BusinessFunction } from './osm.js';

// Section 6 — §4.2 Business Rules Extension (Vocab-prefixed M1 noun concepts)
export {
  VocabOrganization,
  VocabOrganizationalUnit,
  VocabParticipant,
  VocabOrganizationalRole,
  VocabPerson,
  VocabPosition,
  VocabOrganizationType,
} from './osm.js';

// ─── Interface type re-exports ──────────────────────────────────────────────

// Section 1 — §3.1.1 Core abstract interfaces
export type { INamedElement, IOrgElement, IOrgNode, IRole } from './osm.js';

// Section 2 — §3.1.1 Core concrete interfaces
export type {
  IOrgUnit,
  IOrgRelationship,
  IOrgPosition,
  IOrgAssignment,
  IRelationshipType,
} from './osm.js';

// Section 3 — §3.1.2 Legal Entity interfaces
export type {
  IAddressable,
  ILegalEntity,
  IContactInfo,
  ICompany,
  IPerson,
  IJobClassification,
  ICommunity,
} from './osm.js';

// Section 4 — §3.1.3 Position interfaces
export type {
  IParticipationType,
  IPosAuthority,
  IPosRequirements,
  IContAssignment,
  IContAgent,
} from './osm.js';

// Section 5 — §3.1.4 OrgUnit interfaces
export type { IBusinessFunction } from './osm.js';

// Section 6 — §4.2 Business Rules Extension interfaces
export type {
  IVocabOrganization,
  IVocabOrganizationalUnit,
  IVocabParticipant,
  IVocabOrganizationalRole,
  IVocabPerson,
  IVocabPosition,
  IVocabOrganizationType,
} from './osm.js';

// ─── UML 2.5.1 cross-link type aliases ──────────────────────────────────────

export type {
  UmlElementOfOsm,
  UmlNamedElementOfOsm,
  UmlPackageOfOsm,
  UmlClassRealizingOsmMetaclass,
  UmlAssociationRealizingOsmAssociation,
  UmlPropertyRealizingOsmAttribute,
  UmlGeneralizationRealizingOsmGeneralization,
  UmlLiteralUnlimitedNaturalRealizingOsmMultiplicity,
} from './osm.js';

// ─── SBVR 1.5 cross-link type aliases ───────────────────────────────────────

export type {
  SbvrConceptOfOsm,
  SbvrFactTypeOfOsm,
  SbvrRuleOfOsm,
  SbvrVocabularyOfOsm,
} from './osm.js';
