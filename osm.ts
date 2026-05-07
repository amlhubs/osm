// ═══════════════════════════════════════════════════════════════════════════
// osm.ts
// OMG OSM v0.5 — Organization Structure Metamodel
// bmi/06-11-02 (OMG document number bmi/06-11-02)
// 2nd Initial Submission to the Organization Structure Metamodel (OSM) RFP,
// version 0.5, dated 2006-11-09. Co-submitted by 88Solutions, Adaptive,
// Borland Software, Data Access Technologies, EDS, and Lombardi Software,
// with support from Unisys. Authoritative PDF: ./specs/bmi-06-11-02.pdf.
//
// Scope: ISO-compliant TypeScript surface for the OSM metamodel covering the
// full M2 metaclass inventory of bmi/06-11-02 v0.5 — partitioned into the
// canonical four-section structure documented in the OSM submission:
//
//   1. Core             (Section 3)        — abstract NamedElement, OrgElement,
//                                              OrgNode, Role + concrete OrgUnit,
//                                              OrgRelationship, OrgPosition,
//                                              OrgAssignment, RelationshipType
//   2. Legal Entity     (Section 3.1.2)    — LegalEntity, Addressable,
//                                              ContactInfo, Company, Person,
//                                              JobClassification, Community
//   3. Position          (Section 3.1.3)    — ParticipationType, PosAuthority,
//                                              PosRequirements, ContAssignment,
//                                              ContAgent
//   4. OrgUnit          (Section 3.1.4)    — BusinessFunction
//   5. Business Rules   (Section 4)        — Business Rules Extension that
//                                              specializes the SBVR vocabulary
//                                              and projects organizational
//                                              policy in SBVR terms
//
// Generation chain:
//   @amlhubs/uml  (UML 2.5.1)  ─upstream (type-only cross-link)─►
//   @amlhubs/sbvr (SBVR 1.5)   ─upstream (type-only cross-link)─►
//   @amlhubs/osm  (THIS FILE)
//
// Architectural decision — type-only cross-link, not structural inheritance:
//   OSM is downstream of UML and SBVR *at the metamodeling layer*. RFP §6.5.3
//   ("Express as UML") requires that the OSM metamodel itself be projected
//   as UML, so every OSM metaclass is realizable as a uml:Class in a future
//   OSM XMI document. Section 1.3 Conformance and Section 4 (Business Rules
//   Extension) require that organizational policy be expressed in SBVR
//   vocabulary, so every Business Rules Extension construct is realizable as
//   an SBVR concept-or-fact-type. However, the v0.5 submission does not
//   ship a published XMI artifact and does not enumerate structural
//   specialization edges from OSM metaclasses to UML or SBVR metaclasses;
//   the spec text is the authoritative source. For this reason, this surface
//   declares INamedElement (the OSM naming root) and IOrgElement (the OSM
//   effective-dates root) without structural `extends` parents — UML and
//   SBVR cross-links are documented through JSDoc citations and through the
//   exported type aliases below. A future Vocabulary or reflection consumer
//   that needs to materialize an OSM metaclass into a uml:Class (e.g., for
//   XMI serialization) consults the type aliases at the top of this file,
//   not a structural inheritance relation. This matches BMM's IMotivationElement
//   pattern (bmm.ts § "Architectural decision") which intentionally does not
//   extend a UML metaclass even though the BMM XMI realizes every BMM Class
//   as a uml:Class.
//
// Pattern conformance (per .claude/rules/convention/* metamodel-surface
// exemptions):
//   - Header banners + `// --- N. IFoo (§x.y) ---` markers per metaclass.
//   - JSDoc with @standard, @section, @metaclass, @generalization,
//     @definition, @associationEnds, @ownedAttributes, @constraints (where
//     the spec carries OCL or natural-language constraints).
//   - Every interface name `IFoo`, every concrete class name `Foo`. The
//     metamodel-surface exemption (`.claude/rules/convention/classes.md` §
//     "Scope Exemption — Metamodel Surfaces") permits the entire OSM
//     metaclass inventory to be declared in this single file and obliges the
//     surface to mirror the spec's `isAbstract` declarations exactly: where
//     the v0.5 PDF marks a metaclass as abstract (NamedElement, OrgElement,
//     OrgNode, Role, LegalEntity, ParticipationType), the surface declares
//     `abstract class`; where the PDF declares the metaclass concrete
//     (OrgUnit, OrgPosition, OrgAssignment, OrgRelationship, RelationshipType,
//     Company, Person, BusinessFunction, …), the surface declares it concrete.
//     Inserting an extra abstract layer that the spec does not require is a
//     metamodel-surface defect under the exemption rule.
//   - Concrete classes appear after their parent and follow the form
//     `export class {Concept} extends {Parent} implements I{Concept}`.
//   - No `enum` declarations, no bare string-union types for closed sets.
//     OSM's enumeration-shaped surfaces (e.g., the Section 3.1.3
//     ParticipationType partition, RelationshipType named-kind partition)
//     are modeled through UML Generalization / first-class metaclasses,
//     never through enum literals. Exception: the metaclass-name
//     discriminator literal `metaClass: '{Name}' = '{Name}'` is permitted by
//     the metamodel-surface exemption since the literal IS the spec's own
//     metaclass name, not a domain instance.
//
// Spec citation discipline:
//   The OSM v0.5 PDF (./specs/bmi-06-11-02.pdf) is the authoritative natural-
//   language source. No machine-readable XMI artifact is published with
//   this submission, so JSDoc citations carry the PDF section number (e.g.,
//   §3.1.2 for Legal Entity, §3.1.3 for Position, §4 for Business Rules
//   Extension) and, where the PDF is silent on a precise location, fall
//   back to "OSM v0.5 / pp.{n}" citations resolved against the extracted
//   text at ./specs/bmi-06-11-02.txt.
//
// CMOF whitelist conformance:
//   Every OSM metaclass surfaced here will be expressible inside the CMOF
//   26-metaclass whitelist (Class, Association, Property, Generalization,
//   Package, LiteralUnlimitedNatural, LiteralInteger). No use of metaclasses
//   outside the whitelist. Phase 3 implementation will enforce this
//   constraint per metaclass at the JSDoc @cmof annotation.
// ═══════════════════════════════════════════════════════════════════════════

// UML 2.5.1 metaclasses — used as type-only cross-link aliases. OSM
// metaclasses do NOT structurally extend these interfaces (see header
// "Architectural decision" note above). The aliases keep the cross-link
// visible to consumers that need to traverse from an OSM metaclass back to
// its UML metaclass realization (per RFP §6.5.3, every OSM metaclass is
// realizable as a uml:Class, every OSM Association as a uml:Association).
import type {
  IElement as _UmlIElement,
  INamedElement as _UmlINamedElement,
  IPackage as _UmlIPackage,
  IClass as _UmlIClass,
  IAssociation as _UmlIAssociation,
  IProperty as _UmlIProperty,
  IGeneralization as _UmlIGeneralization,
  ILiteralUnlimitedNatural as _UmlILiteralUnlimitedNatural,
} from '@amlhubs/uml';

export type UmlElementOfOsm = _UmlIElement;
export type UmlNamedElementOfOsm = _UmlINamedElement;
export type UmlPackageOfOsm = _UmlIPackage;
export type UmlClassRealizingOsmMetaclass = _UmlIClass;
export type UmlAssociationRealizingOsmAssociation = _UmlIAssociation;
export type UmlPropertyRealizingOsmAttribute = _UmlIProperty;
export type UmlGeneralizationRealizingOsmGeneralization = _UmlIGeneralization;
export type UmlLiteralUnlimitedNaturalRealizingOsmMultiplicity = _UmlILiteralUnlimitedNatural;

// SBVR 1.5 metaclasses — used as type-only cross-link aliases. Per OSM v0.5
// §1.3 Conformance and §4 (Business Rules Extension), the OSM Business
// Rules Extension specializes the SBVR vocabulary so that organizational
// policy is expressed in SBVR concept-types and fact-types. Consumers that
// need to materialize an OSM Business Rules Extension construct as an SBVR
// element wrap the OSM instance in an SBVR adapter at their own boundary.
import type {
  IConcept as _SbvrIConcept,
  IFactType as _SbvrIFactType,
  IRule as _SbvrIRule,
  IVocabulary as _SbvrIVocabulary,
} from '@amlhubs/sbvr';

export type SbvrConceptOfOsm = _SbvrIConcept;
export type SbvrFactTypeOfOsm = _SbvrIFactType;
export type SbvrRuleOfOsm = _SbvrIRule;
export type SbvrVocabularyOfOsm = _SbvrIVocabulary;

// ═══════════════════════════════════════════════════════════════════════════
// 0. ROOT — SECTIONS BELOW (Phase 3 implementation pending)
// ═══════════════════════════════════════════════════════════════════════════
