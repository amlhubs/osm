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
//   5. Business Rules   (Section 4)        — Business Rules Extension. The
//                                              v0.5 §4.2 OSM English Vocabulary
//                                              contributes seven SBVR-aligned
//                                              noun concepts: VocabOrganization,
//                                              VocabOrganizationalUnit,
//                                              VocabParticipant,
//                                              VocabOrganizationalRole,
//                                              VocabPerson, VocabPosition,
//                                              VocabOrganizationType. The
//                                              `Vocab` prefix carries the
//                                              M2-vs-M1 distinction (§3 = M2
//                                              metaclass; §4 = M1 vocabulary
//                                              noun concept) into the
//                                              TypeScript identifier so the
//                                              §4 vocabulary terms do not
//                                              collide with the §3 metaclass
//                                              identifiers (OrgUnit, Person,
//                                              OrgPosition).
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
  IConceptBase as _SbvrIConcept,
  IFactType as _SbvrIFactType,
  IRule as _SbvrIRule,
  IVocabulary as _SbvrIVocabulary,
} from '@amlhubs/sbvr';

export type SbvrConceptOfOsm = _SbvrIConcept;
export type SbvrFactTypeOfOsm = _SbvrIFactType;
export type SbvrRuleOfOsm = _SbvrIRule;
export type SbvrVocabularyOfOsm = _SbvrIVocabulary;

// ═══════════════════════════════════════════════════════════════════════════
// 1. SECTION 3.1.1 — CORE ABSTRACTS
//    (NamedElement, OrgElement, OrgNode, Role — the partition roots of the
//     OSM metamodel; every concrete metaclass eventually extends one of these)
// ═══════════════════════════════════════════════════════════════════════════

// --- 1.1. INamedElement (§3.1.1) ---
/**
 * @standard OMG OSM v0.5 -- bmi/06-11-02 (2006-11-09)
 * @section §3.1.1 Core
 * @metaclass NamedElement
 * @generalization (root — no parent in the OSM metamodel)
 * @definition NamedElement: this is a super-type for all elements that have
 *   names. (OSM v0.5 §3.1.1, p.24, line 792 of ./specs/bmi-06-11-02.txt)
 *
 *   The §3.1.1 Core diagram (p.23) places NamedElement at the top of the
 *   partition, with OrgElement directly beneath it (OrgElement extends
 *   NamedElement to add the temporal `startDate`/`endDate`/`purpose` axis).
 *   Role appears as a *sibling* of NamedElement in the same diagram, NOT as
 *   a child — the spec text on p.24 (line 805 of the extracted .txt) explicitly
 *   calls Role "a common root for roles in organizations as well as roles in
 *   processes", confirming that Role is its own partition root rather than a
 *   NamedElement specialization. The metamodel-surface exemption in
 *   `.claude/rules/convention/classes.md` requires this surface to mirror the
 *   spec's partition structure exactly, so NamedElement and Role are declared
 *   as two independent abstract roots.
 * @ownedAttributes
 *   name : String [1]    -- "-name : String" (§3.1.1 p.23 diagram); the
 *                          NamedElement metaclass declares a single owned
 *                          attribute carrying the element's identifying string
 * @associationEnds (none — every Association is owned by a more specific
 *   subtype's ownedAttribute; NamedElement participates in no Association
 *   directly per §3.1.1)
 * @constraints The §3.1.1 prose marks NamedElement as one of the "types in
 *   yellow" (p.22, line 772) — yellow indicates abstract types per the spec's
 *   own legend — so this surface declares NamedElement as an `abstract class`
 *   per the metamodel-surface exemption in `.claude/rules/convention/classes.md`
 *   ("If the spec marks a metaclass `isAbstract = true`, the surface declares
 *   it as `abstract class`").
 */
export interface INamedElement {
  /** Spec-edition tag — present so downstream agents can audit the conformance
   *  edition by a single property read. Always 'OSM-v0.5' for this package. */
  readonly osmVersion: string;
  /** XMI cross-link — every OSM metaclass would be realized as a uml:Class in
   *  a future OSM XMI document (the v0.5 submission ships no XMI artifact, so
   *  this xmiId is anticipatory and follows the BMM convention 'OSM-{Name}').
   *  For NamedElement, the value is 'OSM-NamedElement'. */
  readonly xmiId: string;
  /** The metaclass name discriminator (per metamodel-surface exemption in
   *  `.claude/rules/convention/interfaces.md`). For NamedElement this is the
   *  literal 'NamedElement'; concrete subclasses narrow to their own metaclass
   *  name. */
  readonly metaClass: string;
  /** UML NamedElement::name — the OSM metaclass identifier. For NamedElement,
   *  the value is 'NamedElement'. Mirrors the OSM §3.1.1 ownedAttribute
   *  `-name : String` (multiplicity [1] per UML convention when no
   *  multiplicity decoration is shown in the diagram). */
  readonly name: string;
}

// --- 1.2. abstract class NamedElement ---
/**
 * @standard OMG OSM v0.5 -- bmi/06-11-02 (2006-11-09)
 * @section §3.1.1 Core
 * @metaclass NamedElement
 * @generalization (root — no parent in the OSM metamodel)
 * @definition Abstract partition root for every OSM element that carries a
 *   name. The §3.1.1 spec text (p.24) marks NamedElement as a yellow type
 *   meaning "not instantiated in a model" (line 772-773); per the metamodel-
 *   surface exemption in `.claude/rules/convention/classes.md`, this surface
 *   declares NamedElement as `abstract class` exactly as the spec marks it.
 *   Concrete subclasses provide values for `osmVersion`, `xmiId`, `metaClass`,
 *   and `name`.
 */
export abstract class NamedElement implements INamedElement {
  abstract readonly osmVersion: string;
  abstract readonly xmiId: string;
  abstract readonly metaClass: string;
  abstract readonly name: string;
}

// --- 1.3. IOrgElement (§3.1.1) ---
/**
 * @standard OMG OSM v0.5 -- bmi/06-11-02 (2006-11-09)
 * @section §3.1.1 Core
 * @metaclass OrgElement
 * @generalization INamedElement
 * @definition OrgElement: This is a super-type for all elements that have
 *   effective dates and a statement of purpose. (OSM v0.5 §3.1.1, p.24,
 *   lines 794-795 of ./specs/bmi-06-11-02.txt)
 *
 *   The §3.1.1 Core diagram places OrgElement directly beneath NamedElement
 *   and shows it carrying three owned attributes: `-startDate : Date`,
 *   `-endDate : Date`, and `-purpose : String` (p.23 diagram, lines 779-782 of
 *   the extracted .txt). OrgElement is the temporally-bounded specialization
 *   of NamedElement: every OrgUnit, OrgRelationship, OrgPosition, and
 *   OrgAssignment in the metamodel inherits its `startDate`/`endDate` window
 *   and its `purpose` string from this metaclass.
 * @ownedAttributes
 *   startDate : Date   [0..1]   -- "-startDate : Date" (§3.1.1 p.23 diagram)
 *   endDate   : Date   [0..1]   -- "-endDate : Date"   (§3.1.1 p.23 diagram)
 *   purpose   : String [0..1]   -- "-purpose : String" (§3.1.1 p.23 diagram)
 * @associationEnds (none — every Association is owned by a more specific
 *   subtype's ownedAttribute; OrgElement participates in no Association
 *   directly per §3.1.1)
 * @constraints The §3.1.1 prose marks OrgElement as one of the abstract
 *   "types in yellow" (p.22, line 772 of the .txt) so this surface declares
 *   OrgElement as an `abstract class` per the metamodel-surface exemption in
 *   `.claude/rules/convention/classes.md`. The spec is silent on the exact
 *   multiplicity of `startDate`, `endDate`, and `purpose` (the diagram does
 *   not show explicit multiplicity decorations); in keeping with UML 2.5.1
 *   convention for diagram-declared attributes whose multiplicity is omitted
 *   AND whose semantics describe optional temporal/descriptive metadata, this
 *   surface types them as `Date | undefined` and `string | undefined`
 *   respectively, encoding the [0..1] reading. A Vocabulary consumer that
 *   needs to enforce a stricter [1] multiplicity does so at its own boundary.
 */
export interface IOrgElement extends INamedElement {
  /** OSM ownedAttribute `startDate : Date [0..1]` — the effective date on
   *  which this OrgElement begins to participate in the organization
   *  structure. Spec text §3.1.1 p.24: "all elements that have effective
   *  dates and a statement of purpose". */
  readonly startDate: Date | undefined;
  /** OSM ownedAttribute `endDate : Date [0..1]` — the effective date on which
   *  this OrgElement ceases to participate in the organization structure.
   *  Spec text §3.1.1 p.24: "all elements that have effective dates and a
   *  statement of purpose". */
  readonly endDate: Date | undefined;
  /** OSM ownedAttribute `purpose : String [0..1]` — the statement of purpose
   *  describing why this OrgElement exists in the organization structure.
   *  Spec text §3.1.1 p.24: "all elements that have effective dates and a
   *  statement of purpose". */
  readonly purpose: string | undefined;
}

// --- 1.4. abstract class OrgElement ---
/**
 * @standard OMG OSM v0.5 -- bmi/06-11-02 (2006-11-09)
 * @section §3.1.1 Core
 * @metaclass OrgElement
 * @generalization NamedElement
 * @definition Abstract specialization of NamedElement that adds the
 *   temporally-bounded triple (`startDate`, `endDate`, `purpose`). The §3.1.1
 *   spec text (p.24, line 794-795) declares OrgElement to be "a super-type
 *   for all elements that have effective dates and a statement of purpose";
 *   the §3.1.1 Core diagram (p.23) marks OrgElement as a yellow (abstract)
 *   type. Per the metamodel-surface exemption in
 *   `.claude/rules/convention/classes.md`, this surface declares OrgElement
 *   as `abstract class`. Concrete subclasses provide values for the
 *   inherited identification quad and for the temporal triple declared here.
 */
export abstract class OrgElement extends NamedElement implements IOrgElement {
  abstract readonly startDate: Date | undefined;
  abstract readonly endDate: Date | undefined;
  abstract readonly purpose: string | undefined;
}

// --- 1.5. IOrgNode (§3.1.1) ---
/**
 * @standard OMG OSM v0.5 -- bmi/06-11-02 (2006-11-09)
 * @section §3.1.1 Core
 * @metaclass OrgNode
 * @generalization IOrgElement
 * @definition OrgNode: This is a super-type for elements that identify nodes
 *   in the organization structure. (OSM v0.5 §3.1.1, p.24, lines 797-798 of
 *   ./specs/bmi-06-11-02.txt)
 *
 *   The §3.1.1 Core diagram (p.23) places OrgNode directly beneath OrgElement
 *   and shows OrgUnit, OrgRelationship, and OrgPosition arranged as siblings
 *   beneath OrgNode (p.23 diagram, line 786 of the .txt). OrgNode is therefore
 *   the partition root of the {OrgUnit, OrgRelationship, OrgPosition} ternary
 *   — every metaclass that "identifies a node in the organization structure"
 *   eventually reaches OrgElement (and through it, NamedElement) by way of
 *   OrgNode. The spec text is explicit that OrgNode contributes no owned
 *   attributes of its own (the §3.1.1 diagram shows OrgNode as a label only,
 *   with no attribute compartment).
 * @ownedAttributes (none — OrgNode contributes no owned attributes; the
 *   §3.1.1 diagram shows OrgNode as a label-only metaclass with no attribute
 *   compartment, and the spec text on p.24 lines 797-798 does not enumerate
 *   any owned attribute on this metaclass)
 * @associationEnds (none — every Association is owned by a more specific
 *   subtype's ownedAttribute; OrgNode participates in no Association directly
 *   per §3.1.1)
 * @constraints The §3.1.1 prose marks OrgNode as one of the abstract "types
 *   in yellow" (p.22, line 772 of the .txt) so this surface declares OrgNode
 *   as an `abstract class` per the metamodel-surface exemption in
 *   `.claude/rules/convention/classes.md`.
 */
export interface IOrgNode extends IOrgElement {}

// --- 1.6. abstract class OrgNode ---
/**
 * @standard OMG OSM v0.5 -- bmi/06-11-02 (2006-11-09)
 * @section §3.1.1 Core
 * @metaclass OrgNode
 * @generalization OrgElement
 * @definition Abstract specialization of OrgElement that contributes no owned
 *   attributes of its own — it exists purely as the partition root for
 *   OrgUnit, OrgRelationship, and OrgPosition. The §3.1.1 spec text (p.24,
 *   line 797-798) declares OrgNode to be "a super-type for elements that
 *   identify nodes in the organization structure"; the §3.1.1 Core diagram
 *   (p.23) marks OrgNode as a yellow (abstract) type. Per the metamodel-
 *   surface exemption in `.claude/rules/convention/classes.md`, this surface
 *   declares OrgNode as `abstract class`. Concrete subclasses provide values
 *   for the inherited identification quad (osmVersion, xmiId, metaClass,
 *   name) and the inherited temporal triple (startDate, endDate, purpose).
 */
export abstract class OrgNode extends OrgElement implements IOrgNode {}

// --- 1.7. IRole (§3.1.1) ---
/**
 * @standard OMG OSM v0.5 -- bmi/06-11-02 (2006-11-09)
 * @section §3.1.1 Core
 * @metaclass Role
 * @generalization (root — no parent in the OSM metamodel; sibling of
 *   NamedElement per the §3.1.1 diagram)
 * @definition Role: This is a common super-type for elements that define
 *   roles. This provides a common root for roles in organizations as well as
 *   roles in processes. A role defines the characteristics of an entity in a
 *   particular context. Here the general concept of role is specialized to a
 *   position within an organization. (OSM v0.5 §3.1.1, p.24, lines 805-810 of
 *   ./specs/bmi-06-11-02.txt)
 *
 *   The §3.1.1 Core diagram (p.23, line 776 of the .txt) places Role at the
 *   top of the partition diagram as a sibling of NamedElement, NOT as a
 *   child — the two boxes appear side-by-side at the top register of the
 *   diagram, with OrgAssignment shown between them (a connector, not a
 *   parent). Per the metamodel-surface exemption in
 *   `.claude/rules/convention/classes.md` ("A metamodel surface mirrors the
 *   spec's `isAbstract` declarations exactly … Inserting an extra abstract
 *   layer that the spec does not require is a defect"), Role is therefore
 *   declared as an independent abstract root that does NOT extend
 *   NamedElement. The downstream specialization Role -> OrgPosition is owned
 *   by OrgPosition's `extends` declaration, which Phase 3 implementer 2 will
 *   author.
 *
 *   The spec text is explicit that Role contributes no owned attributes of
 *   its own (the §3.1.1 diagram shows Role as a label-only box with no
 *   attribute compartment).
 * @ownedAttributes (none — Role contributes no owned attributes; the §3.1.1
 *   diagram shows Role as a label-only metaclass with no attribute compartment,
 *   and the spec text on p.24 lines 805-810 does not enumerate any owned
 *   attribute on this metaclass)
 * @associationEnds (none — every Association is owned by a more specific
 *   subtype's ownedAttribute; Role participates in no Association directly
 *   per §3.1.1)
 * @constraints The §3.1.1 prose marks Role as one of the abstract "types in
 *   yellow" (p.22, line 772 of the .txt) so this surface declares Role as an
 *   `abstract class` per the metamodel-surface exemption in
 *   `.claude/rules/convention/classes.md`. Role does not declare a `name`
 *   ownedAttribute because it is a sibling of NamedElement in the §3.1.1
 *   diagram, not a NamedElement specialization — the spec is silent on
 *   whether Role instances carry a name, so this surface does not invent one.
 *   Concrete Role specializations (e.g., OrgPosition) reach NamedElement
 *   through their own multi-parent generalization path (OrgPosition extends
 *   both OrgNode and Role per §3.1.1).
 */
export interface IRole {
  /** Spec-edition tag — present so downstream agents can audit the conformance
   *  edition by a single property read. Always 'OSM-v0.5' for this package. */
  readonly osmVersion: string;
  /** XMI cross-link — every OSM metaclass would be realized as a uml:Class in
   *  a future OSM XMI document (the v0.5 submission ships no XMI artifact, so
   *  this xmiId is anticipatory and follows the BMM convention 'OSM-{Name}').
   *  For Role, the value is 'OSM-Role'. */
  readonly xmiId: string;
  /** The metaclass name discriminator (per metamodel-surface exemption in
   *  `.claude/rules/convention/interfaces.md`). For Role this is the literal
   *  'Role'; concrete subclasses narrow to their own metaclass name. */
  readonly metaClass: string;
}

// --- 1.8. abstract class Role ---
/**
 * @standard OMG OSM v0.5 -- bmi/06-11-02 (2006-11-09)
 * @section §3.1.1 Core
 * @metaclass Role
 * @generalization (root — no parent in the OSM metamodel; sibling of
 *   NamedElement per the §3.1.1 diagram)
 * @definition Abstract partition root for every OSM element that defines a
 *   role. The §3.1.1 spec text (p.24, lines 805-810) declares Role to be "a
 *   common super-type for elements that define roles", explicitly providing
 *   "a common root for roles in organizations as well as roles in processes";
 *   the §3.1.1 Core diagram (p.23) marks Role as a yellow (abstract) type and
 *   places it as a sibling of NamedElement rather than as a NamedElement
 *   specialization. Per the metamodel-surface exemption in
 *   `.claude/rules/convention/classes.md`, this surface declares Role as
 *   `abstract class` and does NOT extend NamedElement. Concrete subclasses
 *   (e.g., OrgPosition, which the §3.1.1 diagram shows extending both OrgNode
 *   and Role) provide values for `osmVersion`, `xmiId`, and `metaClass`.
 */
export abstract class Role implements IRole {
  abstract readonly osmVersion: string;
  abstract readonly xmiId: string;
  abstract readonly metaClass: string;
}

// ═══════════════════════════════════════════════════════════════════════════
// 2. SECTION 3.1.1 — CORE CONCRETES
//    (OrgUnit, OrgRelationship, OrgPosition, OrgAssignment, RelationshipType
//     — the concrete leaves of the §3.1.1 Core partition)
// ═══════════════════════════════════════════════════════════════════════════

// --- 2.1. IOrgUnit (§3.1.1) ---
/**
 * @standard OMG OSM v0.5 -- bmi/06-11-02 (2006-11-09)
 * @section §3.1.1 Core
 * @metaclass OrgUnit
 * @generalization IOrgNode
 * @definition OrgUnit: This represents a organizational unit in and
 *   organizational structure. Units may be comprised of other units as defined
 *   by OrgRelationships and/or people as defined by OrgPositions. An
 *   independent OrgUnit (independent = True) does not have a parent
 *   organization. (OSM v0.5 §3.1.1, p.24, lines 800-803 of
 *   ./specs/bmi-06-11-02.txt)
 *
 *   Section 2.1 (lines 686-690 of the .txt) reinforces the role of the
 *   `independent` attribute: "The top-level organization unit of a corporation
 *   is designated as 'independent' to indicate that it represents the legal
 *   entity. There is only one such organizational unit associated with a
 *   company." The §3.1.1 diagram (p.23, line 786 of the .txt) shows OrgUnit
 *   in the partition row beneath OrgNode together with OrgRelationship and
 *   OrgPosition; the attribute compartment lists `-independent : Boolean`
 *   (line 787 of the .txt).
 * @ownedAttributes
 *   independent : Boolean [1]   -- "-independent : Boolean" (§3.1.1 p.23
 *                                  diagram, line 787 of the .txt). The §2.1
 *                                  prose (line 802) treats the value True as
 *                                  the marker that this OrgUnit is the legal
 *                                  entity root and has no parent organization;
 *                                  the value False indicates a child OrgUnit
 *                                  that participates in an OrgRelationship.
 * @associationEnds (none cited in OSM v0.5 spec text — every Association
 *   between OrgUnit and other Core metaclasses (e.g., OrgRelationship,
 *   OrgPosition) is declared on the *other* metaclass's owned attributes per
 *   the §3.1.1 prose pattern; OrgUnit itself contributes no associationEnd
 *   ownedAttribute)
 * @constraints The §3.1.1 diagram (p.22, line 772 of the .txt) shows OrgUnit
 *   in white (concrete), not yellow (abstract) — so this surface declares
 *   OrgUnit as a concrete `class` per the metamodel-surface exemption in
 *   `.claude/rules/convention/classes.md` ("If the spec declares it concrete,
 *   the surface declares it concrete").
 */
export interface IOrgUnit extends IOrgNode {
  readonly metaClass: 'OrgUnit';
  /** OSM ownedAttribute `independent : Boolean [1]` — True iff this OrgUnit
   *  is the top-level legal-entity root and has no parent organization
   *  (§2.1 p.20, lines 686-690 of ./specs/bmi-06-11-02.txt). The §3.1.1
   *  diagram (p.23, line 787) shows the attribute as `-independent : Boolean`
   *  with no explicit multiplicity — UML 2.5.1 convention reads this as [1]
   *  for a Boolean owned attribute. Concrete subclasses materialize it as a
   *  raw `boolean` per the metamodel-surface exemption in
   *  `.claude/rules/convention/valueobjects.md`. */
  readonly independent: boolean;
}

// --- 2.2. class OrgUnit ---
export class OrgUnit extends OrgNode implements IOrgUnit {
  override readonly osmVersion: 'OSM-v0.5' = 'OSM-v0.5';
  override readonly xmiId: 'OSM-OrgUnit' = 'OSM-OrgUnit';
  override readonly metaClass: 'OrgUnit' = 'OrgUnit';
  override readonly name: 'OrgUnit' = 'OrgUnit';
  override readonly startDate: Date | undefined = undefined;
  override readonly endDate: Date | undefined = undefined;
  override readonly purpose: string | undefined = undefined;
  /** OSM ownedAttribute `independent : Boolean [1]` materialized at the
   *  metamodel-surface layer with a default value of `false`. The default
   *  encodes the expectation that *most* OrgUnit instances are NOT
   *  independent (§2.1 p.20, line 688 of the .txt: "There is only one such
   *  organizational unit associated with a company"). */
  readonly independent: boolean = false;
}

// --- 2.3. IOrgRelationship (§3.1.1) ---
/**
 * @standard OMG OSM v0.5 -- bmi/06-11-02 (2006-11-09)
 * @section §3.1.1 Core
 * @metaclass OrgRelationship
 * @generalization IOrgNode
 * @definition OrgRelationship: An OrgRelationship defines a relationship
 *   between OrgUnits. Relationships may be for different purposes. The normal
 *   hierarchical relationship is one type. A committee with sub-committees
 *   could have a different relationship. An oversight authority could be
 *   another type of relationship. (OSM v0.5 §3.1.1, p.24, lines 823-826 of
 *   ./specs/bmi-06-11-02.txt)
 *
 *   Section 2.2 (lines 692-698 of the .txt) reinforces the OrgRelationship
 *   role: "Organization units are linked by relationships. These
 *   relationships generally reflect some form of authority… Today, authority
 *   relationships are often specialized, creating different relationships for
 *   different authority subject matter." The §3.1.1 diagram (p.23, line 786
 *   of the .txt) shows OrgRelationship in the partition row beneath OrgNode
 *   together with OrgUnit and OrgPosition; the attribute compartment lists
 *   `-context : String` (line 787 of the .txt). The classification of the
 *   relationship itself (hierarchical, oversight, committee, etc.) is
 *   delegated to the RelationshipType metaclass declared as a peer in §3.1.1.
 * @ownedAttributes
 *   context : String [0..1]   -- "-context : String" (§3.1.1 p.23 diagram,
 *                                line 787 of the .txt). The diagram shows no
 *                                explicit multiplicity decoration; in the
 *                                absence of one, this surface reads it as
 *                                [0..1] because the prose treats `context`
 *                                as a free-form descriptive label, not an
 *                                identifying attribute (§3.1.1 p.24, line 823:
 *                                "Relationships may be for different
 *                                purposes").
 * @associationEnds (none cited in OSM v0.5 spec text — the §3.1.1 prose
 *   describes OrgRelationship as a connector between OrgUnits but does not
 *   spell out the source/target Association memberEnd ownedAttributes; a
 *   downstream Phase that adds the OrgUnit-pair Association will own those
 *   memberEnd declarations)
 * @constraints The §3.1.1 diagram (p.22, line 772 of the .txt) shows
 *   OrgRelationship in white (concrete), not yellow (abstract) — so this
 *   surface declares OrgRelationship as a concrete `class` per the
 *   metamodel-surface exemption in `.claude/rules/convention/classes.md`.
 */
export interface IOrgRelationship extends IOrgNode {
  readonly metaClass: 'OrgRelationship';
  /** OSM ownedAttribute `context : String [0..1]` — free-form label that
   *  records the purpose of this relationship instance (§3.1.1 p.24,
   *  lines 823-826: "Relationships may be for different purposes. The
   *  normal hierarchical relationship is one type. A committee with
   *  sub-committees could have a different relationship. An oversight
   *  authority could be another type of relationship."). Materialized as a
   *  raw `string | undefined` per the metamodel-surface exemption in
   *  `.claude/rules/convention/valueobjects.md`. */
  readonly context: string | undefined;
}

// --- 2.4. class OrgRelationship ---
export class OrgRelationship extends OrgNode implements IOrgRelationship {
  override readonly osmVersion: 'OSM-v0.5' = 'OSM-v0.5';
  override readonly xmiId: 'OSM-OrgRelationship' = 'OSM-OrgRelationship';
  override readonly metaClass: 'OrgRelationship' = 'OrgRelationship';
  override readonly name: 'OrgRelationship' = 'OrgRelationship';
  override readonly startDate: Date | undefined = undefined;
  override readonly endDate: Date | undefined = undefined;
  override readonly purpose: string | undefined = undefined;
  readonly context: string | undefined = undefined;
}

// --- 2.5. IOrgPosition (§3.1.1) ---
/**
 * @standard OMG OSM v0.5 -- bmi/06-11-02 (2006-11-09)
 * @section §3.1.1 Core
 * @metaclass OrgPosition
 * @generalization IRole
 * @definition OrgPosition: An OrgPosition defines the role of one or more
 *   people in an organization unit. It can specify an idealNumber as the
 *   intended number of people so that the number can be over or under target
 *   and still be represented. An OrgUnit may have multiple different
 *   OrgPositions that are concurrently effective. Generally, an OrgUnit will
 *   have an OrgPosition with idealNumber = 1 for a manager. People can occupy
 *   multiple OrgPositions, but generally the positions will be in different
 *   OrgUnits. (OSM v0.5 §3.1.1, p.24, lines 812-817 of
 *   ./specs/bmi-06-11-02.txt)
 *
 *   Section 2.3 (line 703 of the .txt) defines OrgPosition unambiguously as
 *   a Role specialization: "A position defines a role in and organization.
 *   This is a specialization of the general concept of role." The §3.1.1
 *   prose on p.24 (line 805 and lines 809-810 of the .txt) reinforces this:
 *   "Role: This is a common super-type for elements that define roles… Here
 *   the general concept of role is specialized to a position within an
 *   organization."
 * @ownedAttributes
 *   idealNumber : Integer [0..1]   -- "-idealNumber : Integer" (§3.1.1 p.23
 *                                     diagram, line 787 of the .txt). The
 *                                     diagram shows no explicit multiplicity
 *                                     decoration; the prose (§3.1.1 p.24,
 *                                     line 813: "It can specify an
 *                                     idealNumber") treats the attribute as
 *                                     optional, so this surface reads it as
 *                                     [0..1].
 * @associationEnds (none cited in OSM v0.5 spec text on the OrgPosition side
 *   directly — the §3.1.1 prose describes OrgPosition as the target of an
 *   OrgAssignment Association, with the assignment owning the link from
 *   Person to OrgPosition per §2.5 lines 729-731; an OrgPosition is also
 *   contained-by an OrgUnit per §2.3 lines 707-710, but neither memberEnd is
 *   spelled out as an owned attribute on OrgPosition itself in the v0.5 prose)
 * @constraints The §3.1.1 diagram (p.22, line 772 of the .txt) shows
 *   OrgPosition in white (concrete), not yellow (abstract) — so this surface
 *   declares OrgPosition as a concrete `class` per the metamodel-surface
 *   exemption in `.claude/rules/convention/classes.md`.
 *
 *   PROSE-VS-DIAGRAM DISAGREEMENT (resolved in favor of prose): The §3.1.1
 *   ASCII diagram in ./specs/bmi-06-11-02.txt lines 776-790 lays OrgPosition
 *   visually in the same row as OrgUnit and OrgRelationship beneath OrgNode
 *   (line 786), suggesting OrgPosition might be a child of OrgNode. But the
 *   §2.3 prose at line 703 explicitly states "A position defines a role in
 *   and organization. This is a specialization of the general concept of
 *   role.", and the §3.1.1 prose at line 805 reinforces "Role: This is a
 *   common super-type for elements that define roles… Here the general
 *   concept of role is specialized to a position within an organization."
 *   The prose is unambiguous; the ASCII diagram's visual layout (without
 *   explicit edges in the extracted .txt) is necessarily ambiguous.
 *
 *   This surface resolves the disagreement in favor of the prose: OrgPosition
 *   `extends Role` ONLY. A future PRE-engine consumer that reads the diagram
 *   alone would arrive at a different conclusion (OrgPosition extends OrgNode
 *   instead of, or in addition to, Role) — that consumer would be defective
 *   relative to the §2.3 / §3.1.1 prose. The metamodel-surface exemption in
 *   `.claude/rules/convention/classes.md` permits the prose-driven choice
 *   because the prose is explicit and the ASCII-extracted diagram cannot be
 *   relied upon to disambiguate parent/sibling layout.
 *
 *   A consequence of this choice: OrgPosition does NOT inherit `name`,
 *   `startDate`, `endDate`, `purpose` from NamedElement / OrgElement, because
 *   Role is declared as an independent abstract root by Implementer 1 (it is
 *   a sibling of NamedElement in the §3.1.1 diagram, not a child). A future
 *   §3.1.2 / §3.1.3 implementation that needs OrgPosition to carry a `name`
 *   must add the appropriate Association from OrgPosition to NamedElement
 *   rather than retro-introducing Generalization.
 */
export interface IOrgPosition extends IRole {
  /** Implementer 4 widening: OrgPosition is a non-leaf concrete — §3.1.3
   *  declares ContAgent as a "specialization of position" (line 923 of the
   *  .txt). The metaClass discriminator is therefore the union of OrgPosition
   *  itself and every metaclass in §3.1.3 that specializes it; this widening
   *  preserves the literal-narrowing invariant at the leaf classes (which
   *  pin to a single literal) while permitting subtype `override` to narrow
   *  to a child literal. Reflection consumers that need the exact metaclass
   *  identity at runtime read the concrete class's own initializer. */
  readonly metaClass: 'OrgPosition' | 'ContAgent';
  /** OSM ownedAttribute `idealNumber : Integer [0..1]` — the intended
   *  number of people that should occupy this position so that the actual
   *  occupancy can be reported as over- or under-target (§3.1.1 p.24,
   *  lines 812-815). Materialized as a raw `number | undefined` per the
   *  metamodel-surface exemption in `.claude/rules/convention/valueobjects.md`. */
  readonly idealNumber: number | undefined;
}

// --- 2.6. class OrgPosition ---
export class OrgPosition extends Role implements IOrgPosition {
  override readonly osmVersion: 'OSM-v0.5' = 'OSM-v0.5';
  /** Implementer 4 widening: OrgPosition is a non-leaf concrete (§3.1.3
   *  ContAgent specializes it). The xmiId field type widens to the union
   *  of OrgPosition's own xmi id and every specialization's xmi id so that
   *  child classes (ContAgent) can `override` to their own literal value. */
  override readonly xmiId: 'OSM-OrgPosition' | 'OSM-ContAgent' = 'OSM-OrgPosition';
  override readonly metaClass: 'OrgPosition' | 'ContAgent' = 'OrgPosition';
  readonly idealNumber: number | undefined = undefined;
}

// --- 2.7. IOrgAssignment (§3.1.1) ---
/**
 * @standard OMG OSM v0.5 -- bmi/06-11-02 (2006-11-09)
 * @section §3.1.1 Core
 * @metaclass OrgAssignment
 * @generalization IOrgElement
 * @definition OrgAssignment: An OrgAssignment links a person to an
 *   OrgPosition. The assignment identifies the effective dates for that
 *   particular person. A person may be assigned to multiple positions with
 *   overlapping effective dates. (OSM v0.5 §3.1.1, p.24, lines 819-821 of
 *   ./specs/bmi-06-11-02.txt)
 *
 *   Section 2.5 (lines 729-731 of the .txt) reinforces the OrgAssignment
 *   role: "People are linked to positions through assignments. A person may
 *   have multiple assignments, linking them to multiple positions. The
 *   assignments may have different effective dates that may or may not
 *   overlap." The §3.1.1 diagram (p.23, line 777 of the .txt) shows
 *   OrgAssignment as a label-only metaclass between NamedElement and Role at
 *   the top of the partition diagram, with NO attribute compartment of its
 *   own — OrgAssignment carries only the `startDate`, `endDate`, `purpose`
 *   triple inherited from OrgElement. Section 2.5 line 731 makes the
 *   inheritance explicit by referring to the assignment's "effective dates"
 *   without introducing a new attribute name.
 * @ownedAttributes (none — OrgAssignment introduces no owned attributes of
 *   its own; the §3.1.1 diagram on line 777 of the .txt shows OrgAssignment
 *   as a label-only box. The temporal triple `startDate`/`endDate`/`purpose`
 *   is inherited from OrgElement and is the canonical surface through which
 *   §2.5 line 730 expresses the assignment's "effective dates")
 * @associationEnds OrgAssignment links a Role/OrgPosition instance to a
 *   Person instance per §2.5 lines 729-731 of the .txt: "People are linked
 *   to positions through assignments. A person may have multiple
 *   assignments, linking them to multiple positions." The Person and
 *   OrgPosition memberEnds are declared in the §3.1.2 (Legal Entity) and
 *   §3.1.3 (Position) diagrams respectively; in this §3.1.1 surface, no
 *   memberEnd ownedAttribute is declared on OrgAssignment because the spec
 *   does not enumerate one in the §3.1.1 attribute compartment (the diagram
 *   shows OrgAssignment as a label-only box).
 * @constraints The §3.1.1 diagram (p.22, line 772 of the .txt) shows
 *   OrgAssignment in white (concrete), not yellow (abstract) — so this
 *   surface declares OrgAssignment as a concrete `class` per the
 *   metamodel-surface exemption in `.claude/rules/convention/classes.md`.
 *   OrgAssignment extends OrgElement directly (NOT OrgNode), because §2.5
 *   classifies an assignment as a temporally-bounded link between a Person
 *   and an OrgPosition rather than as a "node" in the organization
 *   structure — the §3.1.1 diagram (line 777) places OrgAssignment between
 *   NamedElement and Role at the top of the partition, NOT in the OrgNode
 *   row (line 786) with OrgUnit/OrgRelationship/OrgPosition.
 */
export interface IOrgAssignment extends IOrgElement {
  /** Implementer 4 widening: OrgAssignment is a non-leaf concrete — §3.1.3
   *  declares ContAssignment as a "specialization of assignment" (line 920
   *  of the .txt). The metaClass discriminator is therefore the union of
   *  OrgAssignment itself and every metaclass in §3.1.3 that specializes
   *  it; this widening preserves the literal-narrowing invariant at the
   *  leaf classes (which pin to a single literal) while permitting subtype
   *  `override` to narrow to a child literal. Reflection consumers that
   *  need the exact metaclass identity at runtime read the concrete class's
   *  own initializer. */
  readonly metaClass: 'OrgAssignment' | 'ContAssignment';
  /** Implementer 4 widening: OrgAssignment is a non-leaf concrete; the
   *  identification quad fields widen to the union of OrgAssignment's own
   *  literal and every specialization's literal so child classes
   *  (ContAssignment) can `override` to their own literal value. */
  readonly xmiId: 'OSM-OrgAssignment' | 'OSM-ContAssignment';
  readonly name: 'OrgAssignment' | 'ContAssignment';
}

// --- 2.8. class OrgAssignment ---
export class OrgAssignment extends OrgElement implements IOrgAssignment {
  override readonly osmVersion: 'OSM-v0.5' = 'OSM-v0.5';
  override readonly xmiId: 'OSM-OrgAssignment' | 'OSM-ContAssignment' = 'OSM-OrgAssignment';
  override readonly metaClass: 'OrgAssignment' | 'ContAssignment' = 'OrgAssignment';
  override readonly name: 'OrgAssignment' | 'ContAssignment' = 'OrgAssignment';
  /** Inherited from abstract OrgElement; OrgAssignment introduces no new
   *  owned attribute on top of `startDate`/`endDate`/`purpose`. The triple
   *  is the canonical surface through which §2.5 line 730 expresses the
   *  assignment's "effective dates". Default-initialized to `undefined` so
   *  this surface remains a typed registry without forcing instantiation
   *  values; downstream consumers that materialize an OrgAssignment instance
   *  populate the triple at their own boundary. */
  override readonly startDate: Date | undefined = undefined;
  override readonly endDate: Date | undefined = undefined;
  override readonly purpose: string | undefined = undefined;
}

// --- 2.9. IRelationshipType (§3.1.1) ---
/**
 * @standard OMG OSM v0.5 -- bmi/06-11-02 (2006-11-09)
 * @section §3.1.1 Core
 * @metaclass RelationshipType
 * @generalization INamedElement
 * @definition RelationshipType: This defines the types of relationships that
 *   occur within an organization. A default set should be defined and
 *   additional types can be defined by a user. (OSM v0.5 §3.1.1, p.24,
 *   lines 828-830 of ./specs/bmi-06-11-02.txt)
 *
 *   The §3.1.1 diagram (p.23, lines 789-790 of the .txt) shows
 *   RelationshipType as a peer of OrgNode and its descendants, with a single
 *   attribute compartment listing `-description` (line 790 of the .txt; the
 *   diagram omits the explicit `: String` type but the prose at line 828
 *   confirms the textual nature of the attribute). RelationshipType is the
 *   classification register that an OrgRelationship instance refers to in
 *   order to declare *what kind* of relationship it is (hierarchical,
 *   oversight, committee, …); §3.1.1 prose at lines 823-826 enumerates the
 *   intended values of this register.
 * @ownedAttributes
 *   description : String [0..1]   -- "-description" (§3.1.1 p.23 diagram,
 *                                    line 790 of the .txt). The diagram
 *                                    omits the type but the §3.1.1 prose
 *                                    (line 828: "This defines the types of
 *                                    relationships that occur within an
 *                                    organization") implies a free-form
 *                                    textual description. The diagram shows
 *                                    no explicit multiplicity decoration; in
 *                                    the absence of one, this surface reads
 *                                    it as [0..1] because a description is
 *                                    descriptive metadata rather than an
 *                                    identifying attribute.
 * @associationEnds (none cited in OSM v0.5 spec text — the §3.1.1 prose
 *   does not enumerate an explicit Association from OrgRelationship to
 *   RelationshipType, although the relationship is implied by the prose at
 *   lines 823-826 ("Relationships may be for different purposes. The normal
 *   hierarchical relationship is one type…") and lines 828-830. A future
 *   surface that adds the Association will declare its memberEnd as an
 *   ownedAttribute on whichever metaclass spec text declares it on)
 * @constraints The §3.1.1 diagram (p.22, line 772 of the .txt) shows
 *   RelationshipType in white (concrete), not yellow (abstract) — so this
 *   surface declares RelationshipType as a concrete `class` per the
 *   metamodel-surface exemption in `.claude/rules/convention/classes.md`.
 *   RelationshipType extends NamedElement directly (NOT OrgElement), because
 *   the §3.1.1 diagram places it at the bottom of the partition outside the
 *   OrgElement temporally-bounded sub-tree (line 789 — beneath the OrgNode
 *   row but not connected to OrgElement) and the spec text at lines 828-830
 *   describes a classification register, not a temporally-bounded element.
 *   A future surface that needs RelationshipType to carry effective dates
 *   would have to either re-rebase it on OrgElement or add an explicit
 *   Association to a temporal qualifier — both of which are outside the
 *   v0.5 §3.1.1 scope.
 */
export interface IRelationshipType extends INamedElement {
  readonly metaClass: 'RelationshipType';
  /** OSM ownedAttribute `description : String [0..1]` — free-form textual
   *  description of this relationship type (§3.1.1 p.24, lines 828-830:
   *  "This defines the types of relationships that occur within an
   *  organization. A default set should be defined and additional types can
   *  be defined by a user."). Materialized as a raw `string | undefined`
   *  per the metamodel-surface exemption in
   *  `.claude/rules/convention/valueobjects.md`. */
  readonly description: string | undefined;
}

// --- 2.10. class RelationshipType ---
export class RelationshipType extends NamedElement implements IRelationshipType {
  override readonly osmVersion: 'OSM-v0.5' = 'OSM-v0.5';
  override readonly xmiId: 'OSM-RelationshipType' = 'OSM-RelationshipType';
  override readonly metaClass: 'RelationshipType' = 'RelationshipType';
  override readonly name: 'RelationshipType' = 'RelationshipType';
  readonly description: string | undefined = undefined;
}

// ═══════════════════════════════════════════════════════════════════════════
// 3. SECTION 3.1.2 — LEGAL ENTITY
//    (Addressable + LegalEntity abstract roots; ContactInfo, Company, Person,
//     JobClassification, Community concrete leaves)
// ═══════════════════════════════════════════════════════════════════════════

// --- 3.1. IAddressable (§3.1.2) ---
/**
 * @standard OMG OSM v0.5 -- bmi/06-11-02 (2006-11-09)
 * @section §3.1.2 Legal Entity
 * @metaclass Addressable
 * @generalization INamedElement
 * @definition Addressable: Addressable is an abstract super-type for
 *   association of contact information with legal entities and organizations.
 *   (OSM v0.5 §3.1.2, p.25, line 860-861 of ./specs/bmi-06-11-02.txt)
 *
 *   The §3.1.2 diagram (p.25, lines 838-854 of the .txt) places Addressable
 *   immediately beneath NamedElement and immediately above LegalEntity in the
 *   partition. Addressable contributes no owned attributes of its own — its
 *   sole purpose is to provide a typed surface to which one or more
 *   ContactInfo instances can be associated. The §3.1.2 prose at line 860 is
 *   explicit that Addressable is "an abstract super-type", which is the
 *   metamodel-surface signal to declare it as an `abstract class` per the
 *   exemption in `.claude/rules/convention/classes.md` ("If the spec marks a
 *   metaclass `isAbstract = true`, the surface declares it as `abstract
 *   class`").
 * @ownedAttributes (none — Addressable contributes no owned attributes of its
 *   own; the §3.1.2 diagram shows Addressable as a label-only metaclass with
 *   no attribute compartment, and the spec text on p.25 lines 860-861 does
 *   not enumerate any owned attribute on this metaclass)
 * @associationEnds Addressable is the typed surface to which ContactInfo
 *   instances attach per §3.1.2 lines 860-865 of the .txt. The §3.1.2 prose
 *   at lines 863-865 says ContactInfo "carries address, phone number, etc.,
 *   of a person, company or organization unit that enable that entity to be
 *   contacted" — i.e., the relationship is `Addressable::contactInfo :
 *   ContactInfo [0..*]` (an Addressable instance may have zero or more
 *   ContactInfo records). The §3.1.2 diagram shows ContactInfo and
 *   Addressable as adjacent boxes in the partition (lines 842-846 of the
 *   .txt) but does NOT enumerate the memberEnd as an explicit
 *   ownedAttribute on either side. Per the metamodel-surface rule "If the
 *   spec is silent, the implementation is silent", this surface declares no
 *   memberEnd ownedAttribute on Addressable; a future surface that adds the
 *   Association will declare its memberEnd as an ownedAttribute on whichever
 *   metaclass spec text declares it on.
 * @constraints The §3.1.2 prose at line 860 explicitly marks Addressable as
 *   "an abstract super-type" — so this surface declares Addressable as an
 *   `abstract class` per the metamodel-surface exemption in
 *   `.claude/rules/convention/classes.md`. Addressable extends NamedElement
 *   because the §3.1.2 diagram (p.25, lines 839-844 of the .txt) places
 *   Addressable directly beneath the NamedElement box, and because every
 *   Addressable instance — being a person, company, or organization unit —
 *   inherently carries a `name` (the contact label that distinguishes the
 *   addressable entity).
 */
export interface IAddressable extends INamedElement {}

// --- 3.2. abstract class Addressable ---
/**
 * @standard OMG OSM v0.5 -- bmi/06-11-02 (2006-11-09)
 * @section §3.1.2 Legal Entity
 * @metaclass Addressable
 * @generalization NamedElement
 * @definition Abstract specialization of NamedElement that contributes no
 *   owned attributes of its own — it exists purely as the typed surface to
 *   which one or more ContactInfo instances attach. The §3.1.2 spec text
 *   (p.25, line 860-861) explicitly declares Addressable to be "an abstract
 *   super-type for association of contact information with legal entities
 *   and organizations". Per the metamodel-surface exemption in
 *   `.claude/rules/convention/classes.md`, this surface declares Addressable
 *   as `abstract class`. Concrete subclasses (LegalEntity, Company, Person,
 *   Community) provide values for the inherited identification quad
 *   (osmVersion, xmiId, metaClass, name).
 */
export abstract class Addressable extends NamedElement implements IAddressable {
  abstract override readonly osmVersion: string;
  abstract override readonly xmiId: string;
  abstract override readonly metaClass: string;
  abstract override readonly name: string;
}

// --- 3.3. ILegalEntity (§3.1.2) ---
/**
 * @standard OMG OSM v0.5 -- bmi/06-11-02 (2006-11-09)
 * @section §3.1.2 Legal Entity
 * @metaclass LegalEntity
 * @generalization IAddressable
 * @definition LegalEntity: LegalEntity represents entities that have legal
 *   status to enter into contracts, own property, etc. This generally
 *   represents people, corporations or government agencies. (OSM v0.5
 *   §3.1.2, p.25, lines 856-858 of ./specs/bmi-06-11-02.txt)
 *
 *   The §3.1.2 diagram (p.25, lines 844-854 of the .txt) places LegalEntity
 *   directly beneath Addressable in the partition, with Company, Person, and
 *   Community arrayed beneath as its concrete subtypes (lines 848-854).
 *   Section 2.4 (lines 716-728 of the .txt) reinforces this picture: "A
 *   legal entity is an entity that has legal status to enter into contracts,
 *   to own property, etc.… Legal entities can include people, corporations
 *   or government agencies". The §3.1.2 prose at lines 856-858 does not use
 *   the word "abstract" — but every LegalEntity in any §3.1.2 example is
 *   either a Company (lines 866-871), a Person (lines 873-876), or a
 *   Community (lines 883-885), and the diagram on p.25 shows the three
 *   subtypes consuming the entire partition beneath LegalEntity. Per the
 *   metamodel-surface convention that abstractness is established by the
 *   partition's having only specialized leaves, this surface declares
 *   LegalEntity as `abstract class`. (See also §3.1.2 lines 873-885 for the
 *   subtype enumeration: Person, then JobClassification — a peer of
 *   LegalEntity, NOT a child — then Community.)
 * @ownedAttributes (none — LegalEntity contributes no owned attributes of
 *   its own; the §3.1.2 diagram shows LegalEntity as a label-only metaclass
 *   with no attribute compartment, and the spec text on p.25 lines 856-858
 *   does not enumerate any owned attribute on this metaclass. The
 *   per-subtype attributes (`Company::external`, `Community::description`)
 *   live on the concrete subtypes)
 * @associationEnds (none cited in OSM v0.5 spec text on the LegalEntity
 *   side directly — every Association from a LegalEntity to another OSM
 *   metaclass is owned by either Addressable's contactInfo association
 *   (§3.1.2 lines 860-865) or by a concrete subtype's owned attributes
 *   (§3.1.4 lines 933-948 declares the OrgUnit::company association on the
 *   OrgUnit side, not on Company)).
 * @constraints DISAMBIGUATION 1 — `LegalEntity` ABSTRACTNESS: §3.1.2 prose
 *   at lines 856-858 does NOT use the word "abstract" when introducing
 *   LegalEntity. However, §3.1.2 enumerates Person (lines 873-876), Company
 *   (lines 866-871), and Community (lines 883-885) as the three subtypes
 *   that consume the partition, and the §3.1.2 diagram (p.25, lines 844-854
 *   of the .txt) shows LegalEntity with these three concrete leaves below it.
 *   LegalEntity itself is never instantiated independently of one of these
 *   three subtypes in any spec example. Per the metamodel-surface convention
 *   in `.claude/rules/convention/classes.md` that abstractness is
 *   established by the partition's having only specialized leaves, this
 *   surface declares LegalEntity as `abstract class`. Citations: §3.1.2
 *   lines 856-858 (definition), §3.1.2 lines 866-871 (Company subtype),
 *   §3.1.2 lines 873-876 (Person subtype), §3.1.2 lines 883-885 (Community
 *   subtype).
 */
export interface ILegalEntity extends IAddressable {}

// --- 3.4. abstract class LegalEntity ---
/**
 * @standard OMG OSM v0.5 -- bmi/06-11-02 (2006-11-09)
 * @section §3.1.2 Legal Entity
 * @metaclass LegalEntity
 * @generalization Addressable
 * @definition Abstract specialization of Addressable that partitions the
 *   {Company, Person, Community} ternary. The §3.1.2 spec text (p.25,
 *   lines 856-858) declares LegalEntity to "represent entities that have
 *   legal status to enter into contracts, own property, etc.", and the
 *   §3.1.2 partition enumerates Person, Company, and Community as the three
 *   subtypes that consume it. Per the metamodel-surface exemption in
 *   `.claude/rules/convention/classes.md`, this surface declares LegalEntity
 *   as `abstract class`. Concrete subclasses provide values for the
 *   inherited identification quad (osmVersion, xmiId, metaClass, name) and
 *   contribute their own owned attributes (`Company::external`,
 *   `Community::description`).
 */
export abstract class LegalEntity extends Addressable implements ILegalEntity {
  abstract override readonly osmVersion: string;
  abstract override readonly xmiId: string;
  abstract override readonly metaClass: string;
  abstract override readonly name: string;
}

// --- 3.5. IContactInfo (§3.1.2) ---
/**
 * @standard OMG OSM v0.5 -- bmi/06-11-02 (2006-11-09)
 * @section §3.1.2 Legal Entity
 * @metaclass ContactInfo
 * @generalization INamedElement
 * @definition ContactInfo: This carries address, phone number, etc., of a
 *   person, company or organization unit that enable that entity to be
 *   contacted. (OSM v0.5 §3.1.2, p.25, lines 863-865 of
 *   ./specs/bmi-06-11-02.txt)
 *
 *   The §3.1.2 diagram (p.25, lines 842-846 of the .txt) places ContactInfo
 *   adjacent to Addressable but NOT as a child of it — the two boxes are
 *   peers in the partition, with ContactInfo extending NamedElement and
 *   Addressable being its own NamedElement specialization. ContactInfo is
 *   therefore the bearer of the contact-info data (address, phone number)
 *   that an Addressable instance is associated with, but it is itself NOT
 *   an Addressable.
 * @ownedAttributes (none declared in the §3.1.2 diagram — the prose at
 *   lines 863-865 enumerates "address, phone number, etc." as the kinds of
 *   data ContactInfo carries, but the §3.1.2 diagram on p.25 does not
 *   declare these as explicit owned attributes with types. Per the
 *   metamodel-surface rule "If the spec is silent on a precise type, the
 *   surface remains silent", this surface declares no owned attributes on
 *   ContactInfo. A future Vocabulary or §3.1.5 implementation that needs to
 *   carry typed `address`/`phone` properties will declare them at that time)
 * @associationEnds ContactInfo is the target of the Addressable -->
 *   ContactInfo association — see Addressable's @associationEnds for the
 *   relationship description. From ContactInfo's side, the inverse member-
 *   end would be `ContactInfo::addressable : Addressable [0..1]` or similar,
 *   but the §3.1.2 spec text does not enumerate it as an explicit owned
 *   attribute on either side, so this surface declares no memberEnd
 *   ownedAttribute on ContactInfo.
 * @constraints DISAMBIGUATION 2 — WHERE DOES `ContactInfo` ATTACH?:
 *   §3.1.2 prose at lines 863-865 of the .txt says ContactInfo "carries
 *   address, phone number, etc., of a person, company or organization unit
 *   that enable that entity to be contacted." The §3.1.2 diagram on p.25
 *   (lines 842-846 of the .txt) shows ContactInfo and Addressable as
 *   adjacent boxes — the diagram associates ContactInfo with Addressable
 *   (i.e., ContactInfo is what an Addressable HAS, not what an Addressable
 *   IS). This surface treats the relationship as
 *   `Addressable::contactInfo : ContactInfo [0..*]` (declared as an
 *   @associationEnds note on Addressable, NOT as a structural ownedAttribute
 *   on either side, because the §3.1.2 diagram does not enumerate the
 *   memberEnd in either attribute compartment). ContactInfo extends
 *   NamedElement (NOT Addressable) because every ContactInfo instance has
 *   a name (the contact label, e.g., "Primary Office") but is not itself
 *   addressable — addressability is the property of the entity (Person,
 *   Company, Community, OrgUnit) that the ContactInfo serves. The §3.1.2
 *   diagram (p.25, lines 838-846 of the .txt) shows ContactInfo extending
 *   NamedElement at the same generalization depth as Addressable, NOT as a
 *   child of Addressable. This surface declares ContactInfo as a concrete
 *   `class` per the metamodel-surface exemption in
 *   `.claude/rules/convention/classes.md` because the §3.1.2 prose at
 *   lines 863-865 describes a populated, contactable record rather than
 *   an abstract super-type.
 */
export interface IContactInfo extends INamedElement {
  readonly metaClass: 'ContactInfo';
}

// --- 3.6. class ContactInfo ---
export class ContactInfo extends NamedElement implements IContactInfo {
  override readonly osmVersion: 'OSM-v0.5' = 'OSM-v0.5';
  override readonly xmiId: 'OSM-ContactInfo' = 'OSM-ContactInfo';
  override readonly metaClass: 'ContactInfo' = 'ContactInfo';
  override readonly name: 'ContactInfo' = 'ContactInfo';
}

// --- 3.7. ICompany (§3.1.2) ---
/**
 * @standard OMG OSM v0.5 -- bmi/06-11-02 (2006-11-09)
 * @section §3.1.2 Legal Entity
 * @metaclass Company
 * @generalization ILegalEntity
 * @definition Company: Company is the legal entity that is associated with
 *   an organization. Generally, the company will be associated with the top
 *   level of an organizational hierarchy. It is possible that subsidiaries
 *   could be companies (i.e., legal entities) so these companies might be
 *   associated with subsidiary organizational units. In addition, a primary
 *   organization may have relationships with contracting companies as
 *   described in the section on position. (OSM v0.5 §3.1.2, p.25,
 *   lines 866-871 of ./specs/bmi-06-11-02.txt)
 *
 *   The §3.1.2 diagram (p.25, lines 848-849 of the .txt) shows Company
 *   beneath LegalEntity, with the attribute compartment listing
 *   `-external : Boolean`. Section 3.1.4 (lines 933-949 of the .txt)
 *   reinforces the role of the `external` attribute: "The 'external'
 *   attribute indicates if this is the primary company being modeled or is
 *   an external company with which the primary company has a relationship."
 * @ownedAttributes
 *   external : Boolean [1]   -- "-external : Boolean" (§3.1.2 p.25 diagram,
 *                               line 849 of the .txt). The §3.1.4 prose
 *                               (line 944) treats the attribute as
 *                               distinguishing the primary modeled company
 *                               (external = false) from external companies
 *                               with which the primary has a relationship
 *                               (external = true). The diagram shows no
 *                               explicit multiplicity decoration; UML 2.5.1
 *                               convention reads this as [1] for a Boolean
 *                               owned attribute.
 * @associationEnds (none cited in OSM v0.5 §3.1.2 spec text on the Company
 *   side directly — §3.1.4 lines 933-948 declares the
 *   `OrgUnit::company : Company [1]` association, with the memberEnd owned
 *   on the OrgUnit side rather than on Company)
 * @constraints The §3.1.2 diagram (p.25, lines 848-849 of the .txt) shows
 *   Company in the standard concrete-leaf position beneath LegalEntity,
 *   with an explicit attribute compartment — so this surface declares
 *   Company as a concrete `class` per the metamodel-surface exemption in
 *   `.claude/rules/convention/classes.md` ("If the spec declares it
 *   concrete, the surface declares it concrete"). The metamodel-surface
 *   default value for `external` is `true` per the convention that the
 *   default encodes the more numerous of the two enumeration outcomes —
 *   most Company instances in any given OSM model are external relative
 *   to the primary modeled company (a single OSM model has one primary
 *   company by §3.1.4 lines 935-948, but it can reference many external
 *   companies); the default carries no business meaning at the M2 layer,
 *   only a metamodel-surface default that downstream M1 instantiations
 *   override.
 */
export interface ICompany extends ILegalEntity {
  readonly metaClass: 'Company';
  /** OSM ownedAttribute `external : Boolean [1]` — True iff this Company
   *  is an external company with which the primary modeled company has a
   *  relationship; False iff this Company IS the primary modeled company
   *  (§3.1.4 p.27, lines 943-946 of ./specs/bmi-06-11-02.txt: "The
   *  'external' attribute indicates if this is the primary company being
   *  modeled or is an external company with which the primary company has
   *  a relationship."). Materialized as a raw `boolean` per the
   *  metamodel-surface exemption in
   *  `.claude/rules/convention/valueobjects.md`. */
  readonly external: boolean;
}

// --- 3.8. class Company ---
export class Company extends LegalEntity implements ICompany {
  override readonly osmVersion: 'OSM-v0.5' = 'OSM-v0.5';
  override readonly xmiId: 'OSM-Company' = 'OSM-Company';
  override readonly metaClass: 'Company' = 'Company';
  override readonly name: 'Company' = 'Company';
  /** OSM ownedAttribute `external : Boolean [1]` materialized at the
   *  metamodel-surface layer with a default value of `true`. The default
   *  encodes the expectation that *most* Company instances in a given
   *  OSM model are external relative to the single primary modeled
   *  company (§3.1.4 p.27, lines 935-948 of the .txt). The default
   *  carries no business meaning at the M2 layer; downstream M1
   *  instantiations override it as needed. */
  readonly external: boolean = true;
}

// --- 3.9. IPerson (§3.1.2) ---
/**
 * @standard OMG OSM v0.5 -- bmi/06-11-02 (2006-11-09)
 * @section §3.1.2 Legal Entity
 * @metaclass Person
 * @generalization ILegalEntity
 * @definition Person: Person represents a human associated with the
 *   organization. Persons are only associated through assignments to
 *   positions. Persons can have only have relationships with other persons
 *   as members of a community or through positions and organization units.
 *   (OSM v0.5 §3.1.2, p.25-26, lines 873-876 of ./specs/bmi-06-11-02.txt)
 *
 *   The §3.1.2 diagram (p.25, lines 851-852 of the .txt) shows Person
 *   beneath LegalEntity with NO attribute compartment — Person carries
 *   only the inherited identification quad from NamedElement / Addressable
 *   / LegalEntity. Section 2.5 (lines 729-731 of the .txt) reinforces
 *   this: "People are linked to positions through assignments. A person
 *   may have multiple assignments, linking them to multiple positions."
 *   — i.e., Person is a passive participant in the OSM metamodel; its
 *   relationships to OrgPosition flow through the OrgAssignment metaclass
 *   declared in §3.1.1.
 * @ownedAttributes (none cited in the §3.1.2 diagram beyond inheritance —
 *   the §3.1.2 diagram on p.25 lines 851-852 of the .txt shows Person as
 *   a label-only box with no attribute compartment. Person carries only
 *   the inherited `name` from NamedElement)
 * @associationEnds (none cited in OSM v0.5 §3.1.2 spec text on the Person
 *   side directly — every Association from Person to another OSM metaclass
 *   is owned by the other metaclass: OrgAssignment carries the link from
 *   Person to OrgPosition per §2.5 lines 729-731, and Community carries
 *   the membership link per §3.1.2 lines 883-885)
 * @constraints The §3.1.2 diagram (p.25, lines 851-852 of the .txt) shows
 *   Person in the concrete-leaf position beneath LegalEntity, with no
 *   attribute compartment — so this surface declares Person as a concrete
 *   `class` per the metamodel-surface exemption in
 *   `.claude/rules/convention/classes.md` ("If the spec declares it
 *   concrete, the surface declares it concrete").
 */
export interface IPerson extends ILegalEntity {
  readonly metaClass: 'Person';
}

// --- 3.10. class Person ---
export class Person extends LegalEntity implements IPerson {
  override readonly osmVersion: 'OSM-v0.5' = 'OSM-v0.5';
  override readonly xmiId: 'OSM-Person' = 'OSM-Person';
  override readonly metaClass: 'Person' = 'Person';
  override readonly name: 'Person' = 'Person';
}

// --- 3.11. IJobClassification (§3.1.2) ---
/**
 * @standard OMG OSM v0.5 -- bmi/06-11-02 (2006-11-09)
 * @section §3.1.2 Legal Entity
 * @metaclass JobClassification
 * @generalization INamedElement
 * @definition JobClassification: This specifies a job classifications for
 *   people in an organization. A number of people can have the same job
 *   classification and be in different positions and organization units.
 *   (OSM v0.5 §3.1.2, p.26, lines 879-881 of ./specs/bmi-06-11-02.txt)
 *
 *   The §3.1.2 diagram (p.25, lines 848-849 of the .txt) places
 *   JobClassification as a peer of Company in the partition row beneath
 *   LegalEntity, but the prose at lines 879-881 of the .txt makes it
 *   clear that JobClassification is a metaclass that *classifies people*
 *   rather than a kind of LegalEntity itself — a job classification cannot
 *   "enter into contracts, own property, etc." (the LegalEntity definition
 *   at line 856-858). The diagram lists `-description : String` in the
 *   attribute compartment alongside JobClassification (line 849). Per the
 *   §3.1.2 prose, JobClassification therefore extends NamedElement directly
 *   (it carries a `name` — the classification label — and a `description`
 *   string), NOT LegalEntity.
 * @ownedAttributes
 *   description : String [0..1]   -- "-description : String" (§3.1.2 p.25
 *                                    diagram, line 849 of the .txt). The
 *                                    diagram shows the attribute as a
 *                                    free-form string. The diagram shows
 *                                    no explicit multiplicity decoration;
 *                                    in the absence of one, this surface
 *                                    reads it as [0..1] because a
 *                                    description is descriptive metadata
 *                                    rather than an identifying attribute.
 * @associationEnds (none cited in OSM v0.5 §3.1.2 spec text — the prose
 *   at line 879-881 says JobClassification classifies "people" but does
 *   not enumerate an explicit Association from Person to JobClassification.
 *   A future Vocabulary or §3.1.3 implementation that needs to bind
 *   Person to JobClassification will declare the memberEnd at that time)
 * @constraints The §3.1.2 diagram (p.25, lines 848-849 of the .txt) shows
 *   JobClassification in the concrete-leaf position with an explicit
 *   attribute compartment — so this surface declares JobClassification as
 *   a concrete `class` per the metamodel-surface exemption in
 *   `.claude/rules/convention/classes.md`. JobClassification extends
 *   NamedElement directly (NOT LegalEntity) because the §3.1.2 prose at
 *   lines 879-881 of the .txt describes a classification register, not a
 *   contracting entity — "A number of people can have the same job
 *   classification" (line 880) implies JobClassification is a referenced
 *   classification, not a participant in legal relationships.
 */
export interface IJobClassification extends INamedElement {
  readonly metaClass: 'JobClassification';
  /** OSM ownedAttribute `description : String [0..1]` — free-form textual
   *  description of this job classification (§3.1.2 p.26, lines 879-881
   *  of ./specs/bmi-06-11-02.txt: "This specifies a job classifications
   *  for people in an organization. A number of people can have the same
   *  job classification and be in different positions and organization
   *  units."). Materialized as a raw `string | undefined` per the
   *  metamodel-surface exemption in
   *  `.claude/rules/convention/valueobjects.md`. */
  readonly description: string | undefined;
}

// --- 3.12. class JobClassification ---
export class JobClassification extends NamedElement implements IJobClassification {
  override readonly osmVersion: 'OSM-v0.5' = 'OSM-v0.5';
  override readonly xmiId: 'OSM-JobClassification' = 'OSM-JobClassification';
  override readonly metaClass: 'JobClassification' = 'JobClassification';
  override readonly name: 'JobClassification' = 'JobClassification';
  readonly description: string | undefined = undefined;
}

// --- 3.13. ICommunity (§3.1.2) ---
/**
 * @standard OMG OSM v0.5 -- bmi/06-11-02 (2006-11-09)
 * @section §3.1.2 Legal Entity
 * @metaclass Community
 * @generalization ILegalEntity
 * @definition Community: A community is a group of people with a common
 *   interest. These may be communities within the organization or outside
 *   the organization (as in professional associations). (OSM v0.5 §3.1.2,
 *   p.26, lines 883-885 of ./specs/bmi-06-11-02.txt)
 *
 *   The §3.1.2 diagram (p.25, lines 853-854 of the .txt) shows Community
 *   beneath LegalEntity, with the attribute compartment listing
 *   `-description : String`. Section 3.1.2 prose at line 883-885 of the
 *   .txt explicitly classifies a Community as "a group of people with a
 *   common interest" that can be either internal or external to the
 *   organization, with the external case covering "professional
 *   associations" — entities that have legal status (a professional
 *   association can sign agreements, hold collective IP, have legal
 *   standing as an association), which justifies Community's placement
 *   beneath LegalEntity in the partition.
 * @ownedAttributes
 *   description : String [0..1]   -- "-description : String" (§3.1.2 p.25
 *                                    diagram, line 854 of the .txt). The
 *                                    diagram shows the attribute as a
 *                                    free-form string. The diagram shows
 *                                    no explicit multiplicity decoration;
 *                                    in the absence of one, this surface
 *                                    reads it as [0..1] because a
 *                                    description is descriptive metadata
 *                                    rather than an identifying attribute.
 * @associationEnds (none cited in OSM v0.5 §3.1.2 spec text — the prose
 *   at lines 883-885 says a community is "a group of people" but does not
 *   enumerate an explicit Association from Person to Community. A future
 *   Vocabulary that needs to bind Person to Community as members will
 *   declare the memberEnd at that time)
 * @constraints DISAMBIGUATION 3 — `Community`'s PARENT: §3.1.2 prose at
 *   lines 883-885 of the .txt says "A community is a group of people with
 *   a common interest. These may be communities within the organization
 *   or outside the organization (as in professional associations)." The
 *   §3.1.2 diagram on p.25 (lines 853-854 of the .txt) shows Community
 *   beneath LegalEntity in the partition. This surface treats Community
 *   as a `LegalEntity` specialization because: (a) the diagram explicitly
 *   places Community beneath LegalEntity; (b) the spec prose's reference
 *   to "professional associations" (line 884) describes entities that
 *   have legal status — a professional association can sign agreements,
 *   hold collective IP, and have legal standing as an association; (c) a
 *   Community has a `description` (per the diagram) which is a typical
 *   LegalEntity-class concern rather than a NamedElement concern. Citation:
 *   §3.1.2 lines 883-885 of ./specs/bmi-06-11-02.txt.
 *
 *   The §3.1.2 diagram (p.25, lines 853-854 of the .txt) shows Community
 *   in the concrete-leaf position with an explicit attribute compartment
 *   — so this surface declares Community as a concrete `class` per the
 *   metamodel-surface exemption in `.claude/rules/convention/classes.md`.
 */
export interface ICommunity extends ILegalEntity {
  readonly metaClass: 'Community';
  /** OSM ownedAttribute `description : String [0..1]` — free-form textual
   *  description of this community (§3.1.2 p.26, lines 883-885 of
   *  ./specs/bmi-06-11-02.txt: "A community is a group of people with a
   *  common interest. These may be communities within the organization or
   *  outside the organization (as in professional associations).").
   *  Materialized as a raw `string | undefined` per the metamodel-surface
   *  exemption in `.claude/rules/convention/valueobjects.md`. */
  readonly description: string | undefined;
}

// --- 3.14. class Community ---
export class Community extends LegalEntity implements ICommunity {
  override readonly osmVersion: 'OSM-v0.5' = 'OSM-v0.5';
  override readonly xmiId: 'OSM-Community' = 'OSM-Community';
  override readonly metaClass: 'Community' = 'Community';
  override readonly name: 'Community' = 'Community';
  readonly description: string | undefined = undefined;
}

// ═══════════════════════════════════════════════════════════════════════════
// 4. SECTION 3.1.3 — POSITION
//    (ParticipationType, PosAuthority, PosRequirements typing/specifying
//     concretes; ContAssignment + ContAgent contractor specializations of
//     OrgAssignment + OrgPosition)
// ═══════════════════════════════════════════════════════════════════════════

// --- 4.1. IParticipationType (§3.1.3) ---
/**
 * @standard OMG OSM v0.5 -- bmi/06-11-02 (2006-11-09)
 * @section §3.1.3 Position
 * @metaclass ParticipationType
 * @generalization INamedElement
 * @definition ParticipationType: This characterizes the nature of
 *   participation of the position in the organization. This would be used to
 *   designate a manager, a primary management relationship (e.g., payroll and
 *   performance), a matrixed relationship or possibly other forms of
 *   participation. (OSM v0.5 §3.1.3, p.27, lines 906-909 of
 *   ./specs/bmi-06-11-02.txt)
 *
 *   The §3.1.3 diagram (p.27, line 901 of the .txt) places ParticipationType
 *   as a peer of PosAuthority and PosRequirements adjacent to OrgPosition,
 *   with no attribute compartment shown next to ParticipationType itself.
 *   ParticipationType is a classification register that an OrgPosition or an
 *   OrgAssignment instance refers to in order to declare *what kind* of
 *   participation the position implies (manager, primary management,
 *   matrixed, …); §3.1.3 prose at lines 906-909 of the .txt enumerates the
 *   intended values of this register.
 * @ownedAttributes (none cited — the §3.1.3 diagram on line 901 of the .txt
 *   shows ParticipationType as a label-only box with no attribute
 *   compartment, and the §3.1.3 prose at lines 906-909 of the .txt does not
 *   enumerate any owned attribute. ParticipationType carries only the
 *   inherited `name` from NamedElement)
 * @associationEnds (none cited in OSM v0.5 §3.1.3 spec text — the prose at
 *   lines 906-909 of the .txt describes ParticipationType as "characterizing
 *   the nature of participation of the position", but the §3.1.3 diagram
 *   does not enumerate an explicit Association from OrgPosition or
 *   OrgAssignment to ParticipationType. A future surface that adds the
 *   Association will declare its memberEnd as an ownedAttribute on whichever
 *   metaclass spec text declares it on)
 * @constraints DISAMBIGUATION 1 — `ParticipationType`'s PARENT: §3.1.3
 *   diagram (line 901 of the .txt) shows ParticipationType adjacent to
 *   OrgPosition and PosAuthority/PosRequirements. The §3.1.3 prose at lines
 *   906-909 of the .txt says "This characterizes the nature of participation
 *   of the position in the organization" — this is a typing concept,
 *   parallel to RelationshipType (which Implementer 2 already established
 *   extends NamedElement directly per §3.1.1 line 828-830). This surface
 *   therefore declares ParticipationType `extends NamedElement`, exactly
 *   parallel to RelationshipType:
 *     - both are classification registers (RelationshipType classifies
 *       OrgRelationship instances; ParticipationType classifies OrgPosition
 *       /OrgAssignment participation kinds);
 *     - both carry only a `name` (the classification label) at the §3.1
 *       layer;
 *     - both are placed in the §3.1.x diagram adjacent to the metaclass
 *       they classify, without being a temporally-bounded element (so
 *       neither extends OrgElement).
 *   Citation: §3.1.3 lines 906-909 of ./specs/bmi-06-11-02.txt; parallel
 *   §3.1.1 lines 828-830 (RelationshipType pattern).
 *
 *   The §3.1.3 diagram (line 901 of the .txt) shows ParticipationType in the
 *   concrete-leaf position — so this surface declares ParticipationType as a
 *   concrete `class` per the metamodel-surface exemption in
 *   `.claude/rules/convention/classes.md`.
 */
export interface IParticipationType extends INamedElement {
  readonly metaClass: 'ParticipationType';
}

// --- 4.2. class ParticipationType ---
export class ParticipationType extends NamedElement implements IParticipationType {
  override readonly osmVersion: 'OSM-v0.5' = 'OSM-v0.5';
  override readonly xmiId: 'OSM-ParticipationType' = 'OSM-ParticipationType';
  override readonly metaClass: 'ParticipationType' = 'ParticipationType';
  override readonly name: 'ParticipationType' = 'ParticipationType';
}

// --- 4.3. IPosAuthority (§3.1.3) ---
/**
 * @standard OMG OSM v0.5 -- bmi/06-11-02 (2006-11-09)
 * @section §3.1.3 Position
 * @metaclass PosAuthority
 * @generalization INamedElement
 * @definition PosAuthority: This designates an authority associated with the
 *   position. This could indicate spending limit, hiring and firing
 *   authority, specific transaction types, etc.. Not clear how much should be
 *   included in OSM. (OSM v0.5 §3.1.3, p.27, lines 912-914 of
 *   ./specs/bmi-06-11-02.txt)
 *
 *   The §3.1.3 diagram (p.27, line 901 of the .txt) places PosAuthority as a
 *   peer of ParticipationType and PosRequirements adjacent to OrgPosition,
 *   with no attribute compartment shown next to PosAuthority. The spec
 *   itself (line 914 of the .txt: "Not clear how much should be included in
 *   OSM") explicitly flags PosAuthority's structure as open-ended at v0.5;
 *   the metaclass exists as a placeholder for the authority concept, with
 *   the precise typed properties left for a future revision or for a
 *   downstream Vocabulary phase.
 * @ownedAttributes DISAMBIGUATION 4 — `PosAuthority` OWNED ATTRIBUTES (NONE):
 *   the §3.1.3 diagram on line 901 of the .txt shows PosAuthority as a
 *   label-only box with no attribute compartment, and the §3.1.3 prose at
 *   lines 912-914 of the .txt enumerates conceptual examples ("spending
 *   limit, hiring and firing authority, specific transaction types") but
 *   declares no typed properties. The spec line 914 is explicit: "Not clear
 *   how much should be included in OSM." Per the metamodel-surface "If the
 *   spec is silent, the implementation is silent" rule (per
 *   `.claude/rules/convention/classes.md`: "A metamodel surface mirrors the
 *   spec's `isAbstract` declarations exactly. … Inserting an extra abstract
 *   layer that the spec does not require is a defect"), this surface
 *   declares NO owned attributes for PosAuthority. A future Vocabulary
 *   phase that needs to populate PosAuthority with typed properties (e.g.,
 *   `spendingLimit : Currency`, `hiringAuthority : Boolean`,
 *   `transactionTypes : String [*]`) does so at its own boundary.
 * @associationEnds (none cited in OSM v0.5 §3.1.3 spec text — the prose at
 *   lines 912-914 of the .txt describes PosAuthority as designating "an
 *   authority associated with the position", but the §3.1.3 diagram does
 *   not enumerate an explicit Association from OrgPosition to PosAuthority.
 *   A future surface that adds the Association will declare its memberEnd
 *   as an ownedAttribute on whichever metaclass spec text declares it on)
 * @constraints The §3.1.3 diagram (line 901 of the .txt) shows PosAuthority
 *   in the concrete-leaf position — so this surface declares PosAuthority
 *   as a concrete `class` per the metamodel-surface exemption in
 *   `.claude/rules/convention/classes.md`. PosAuthority extends NamedElement
 *   directly (NOT OrgElement), because the §3.1.3 diagram places it as a
 *   peer of ParticipationType (which itself extends NamedElement) and the
 *   spec text describes a typing/categorization concept rather than a
 *   temporally-bounded element. Citation: §3.1.3 lines 912-914 of
 *   ./specs/bmi-06-11-02.txt.
 */
export interface IPosAuthority extends INamedElement {
  readonly metaClass: 'PosAuthority';
}

// --- 4.4. class PosAuthority ---
export class PosAuthority extends NamedElement implements IPosAuthority {
  override readonly osmVersion: 'OSM-v0.5' = 'OSM-v0.5';
  override readonly xmiId: 'OSM-PosAuthority' = 'OSM-PosAuthority';
  override readonly metaClass: 'PosAuthority' = 'PosAuthority';
  override readonly name: 'PosAuthority' = 'PosAuthority';
}

// --- 4.5. IPosRequirements (§3.1.3) ---
/**
 * @standard OMG OSM v0.5 -- bmi/06-11-02 (2006-11-09)
 * @section §3.1.3 Position
 * @metaclass PosRequirements
 * @generalization INamedElement
 * @definition PosRequirements: Specifies requirements for a person to occupy
 *   the position. This would be applied to the person's capabilities
 *   (defined outside OSM) to determine if the person is qualified. (OSM v0.5
 *   §3.1.3, p.27, lines 916-918 of ./specs/bmi-06-11-02.txt)
 *
 *   The §3.1.3 diagram (p.27, line 904 of the .txt) shows PosRequirements
 *   as a peer of ParticipationType and PosAuthority adjacent to OrgPosition,
 *   with no attribute compartment shown next to PosRequirements. The §3.1.3
 *   prose at lines 916-918 of the .txt is explicit that the requirements
 *   themselves are "applied to the person's capabilities (defined outside
 *   OSM)" — i.e., the structure of a PosRequirements instance points outside
 *   OSM, and the metaclass exists at v0.5 as a label-only placeholder for
 *   the requirements concept.
 * @ownedAttributes DISAMBIGUATION 4 — `PosRequirements` OWNED ATTRIBUTES
 *   (NONE): the §3.1.3 diagram on line 904 of the .txt shows PosRequirements
 *   as a label-only box with no attribute compartment, and the §3.1.3 prose
 *   at lines 916-918 of the .txt declares no typed properties. The
 *   capabilities the requirements bind to are explicitly "defined outside
 *   OSM" (line 917). Per the metamodel-surface "If the spec is silent, the
 *   implementation is silent" rule (per
 *   `.claude/rules/convention/classes.md`), this surface declares NO owned
 *   attributes for PosRequirements. A future Vocabulary phase or a
 *   capabilities-aligned package that needs to populate PosRequirements
 *   with typed properties does so at its own boundary.
 * @associationEnds (none cited in OSM v0.5 §3.1.3 spec text — the prose at
 *   lines 916-918 of the .txt references "the person's capabilities (defined
 *   outside OSM)" but the §3.1.3 diagram does not enumerate an explicit
 *   Association from OrgPosition to PosRequirements or from PosRequirements
 *   to a Capability metaclass. A future surface that adds the Association
 *   will declare its memberEnd as an ownedAttribute on whichever metaclass
 *   spec text declares it on)
 * @constraints The §3.1.3 diagram (line 904 of the .txt) shows
 *   PosRequirements in the concrete-leaf position — so this surface declares
 *   PosRequirements as a concrete `class` per the metamodel-surface
 *   exemption in `.claude/rules/convention/classes.md`. PosRequirements
 *   extends NamedElement directly (NOT OrgElement), because the §3.1.3
 *   diagram places it as a peer of ParticipationType / PosAuthority (both
 *   of which extend NamedElement) and the spec text describes a
 *   requirements-specification concept rather than a temporally-bounded
 *   element. Citation: §3.1.3 lines 916-918 of ./specs/bmi-06-11-02.txt.
 */
export interface IPosRequirements extends INamedElement {
  readonly metaClass: 'PosRequirements';
}

// --- 4.6. class PosRequirements ---
export class PosRequirements extends NamedElement implements IPosRequirements {
  override readonly osmVersion: 'OSM-v0.5' = 'OSM-v0.5';
  override readonly xmiId: 'OSM-PosRequirements' = 'OSM-PosRequirements';
  override readonly metaClass: 'PosRequirements' = 'PosRequirements';
  override readonly name: 'PosRequirements' = 'PosRequirements';
}

// --- 4.7. IContAssignment (§3.1.3) ---
/**
 * @standard OMG OSM v0.5 -- bmi/06-11-02 (2006-11-09)
 * @section §3.1.3 Position
 * @metaclass ContAssignment
 * @generalization IOrgAssignment
 * @definition ContAssignment: This specialization of assignment provides for
 *   a position to be occupied by a contract person. It adds a relationship
 *   to a contracting agent. (OSM v0.5 §3.1.3, p.27, lines 920-921 of
 *   ./specs/bmi-06-11-02.txt)
 *
 *   The §3.1.3 diagram (p.27, lines 892-896 of the .txt) places
 *   ContAssignment beneath OrgAssignment in the partition (line 894), with
 *   ContAgent shown beneath ContAssignment (line 896) — visually indicating
 *   the contractor specialization chain OrgAssignment -> ContAssignment and
 *   the related OrgPosition -> ContAgent specialization. ContAssignment
 *   inherits OrgAssignment's temporal triple (`startDate`, `endDate`,
 *   `purpose`, all coming from OrgElement) and exists at v0.5 as a label-
 *   only specialization that flags an assignment as a contractor assignment;
 *   the spec text (line 921) cites "a relationship to a contracting agent"
 *   as the distinguishing feature, but the §3.1.3 diagram does not
 *   enumerate the relationship as an explicit owned attribute on
 *   ContAssignment.
 * @ownedAttributes (none cited — the §3.1.3 diagram on line 894 of the .txt
 *   shows ContAssignment as a label-only specialization box with no
 *   attribute compartment of its own. ContAssignment carries only the
 *   inherited identification quad from NamedElement and the inherited
 *   temporal triple from OrgElement, both reaching it through OrgAssignment)
 * @associationEnds (none cited in OSM v0.5 §3.1.3 spec text — the prose at
 *   line 921 says ContAssignment "adds a relationship to a contracting
 *   agent", but the §3.1.3 diagram does not enumerate the memberEnd as an
 *   owned attribute on ContAssignment. The contracting-agent link is
 *   realized via the ContAgent metaclass below, which "associates a
 *   contractor agent with the assignment of a contractor person" per
 *   §3.1.3 lines 923-925)
 * @constraints DISAMBIGUATION 2 — `ContAssignment` PARENT: per §3.1.3 line
 *   920 of the .txt, "This specialization of assignment provides for a
 *   position to be occupied by a contract person." ContAssignment therefore
 *   `extends OrgAssignment`. Because OrgAssignment is concrete (Implementer
 *   2's surface declared `OrgAssignment.metaClass = 'OrgAssignment'`), this
 *   surface re-`override`s `metaClass`, `xmiId`, and `name` to narrow them
 *   to ContAssignment's own literal values. The interface narrows
 *   accordingly: `interface IContAssignment extends IOrgAssignment {
 *   readonly metaClass: 'ContAssignment'; }`. Citation: §3.1.3 line 920 of
 *   ./specs/bmi-06-11-02.txt.
 *
 *   The §3.1.3 diagram (line 894 of the .txt) shows ContAssignment in the
 *   concrete-leaf position — so this surface declares ContAssignment as a
 *   concrete `class` per the metamodel-surface exemption in
 *   `.claude/rules/convention/classes.md`.
 */
export interface IContAssignment extends IOrgAssignment {
  readonly metaClass: 'ContAssignment';
}

// --- 4.8. class ContAssignment ---
export class ContAssignment extends OrgAssignment implements IContAssignment {
  override readonly osmVersion: 'OSM-v0.5' = 'OSM-v0.5';
  override readonly xmiId: 'OSM-ContAssignment' = 'OSM-ContAssignment';
  override readonly metaClass: 'ContAssignment' = 'ContAssignment';
  override readonly name: 'ContAssignment' = 'ContAssignment';
  /** Inherited from abstract OrgElement via OrgAssignment; ContAssignment
   *  introduces no new owned attribute on top of `startDate`/`endDate`/
   *  `purpose`. The triple is the canonical surface through which §2.5 line
   *  730 expresses the assignment's "effective dates", which apply equally
   *  to a contractor assignment per §3.1.3 lines 920-921 of the .txt.
   *  Default-initialized to `undefined` so this surface remains a typed
   *  registry without forcing instantiation values. */
  override readonly startDate: Date | undefined = undefined;
  override readonly endDate: Date | undefined = undefined;
  override readonly purpose: string | undefined = undefined;
}

// --- 4.9. IContAgent (§3.1.3) ---
/**
 * @standard OMG OSM v0.5 -- bmi/06-11-02 (2006-11-09)
 * @section §3.1.3 Position
 * @metaclass ContAgent
 * @generalization IOrgPosition
 * @definition ContAgent: This specialization of position associates a
 *   contractor agent with the assignment of a contractor person. The agent
 *   position is in the contractor company while the contractor assignment is
 *   in the primary company. (OSM v0.5 §3.1.3, p.27, lines 923-925 of
 *   ./specs/bmi-06-11-02.txt)
 *
 *   The §3.1.3 diagram (p.27, line 896 of the .txt) places ContAgent
 *   beneath ContAssignment, but the prose at line 923 of the .txt is
 *   explicit that ContAgent is a "specialization of position" — i.e.,
 *   ContAgent extends OrgPosition (NOT ContAssignment). The diagram's
 *   visual layout with ContAgent rendered beneath ContAssignment reflects a
 *   conceptual association between the two specializations (the contractor
 *   agent's position lives in the contractor company while the contractor
 *   assignment lives in the primary company per §3.1.3 lines 924-925), not
 *   a Generalization relationship. Per the prose-vs-diagram precedent
 *   established by Implementer 2 for OrgPosition (which the §3.1.1 prose at
 *   line 703 calls a "specialization of role" while the diagram visually
 *   places it beneath OrgNode), this surface resolves the disagreement in
 *   favor of the §3.1.3 prose: ContAgent `extends OrgPosition`.
 * @ownedAttributes (none cited — the §3.1.3 diagram on line 896 of the .txt
 *   shows ContAgent as a label-only specialization box with no attribute
 *   compartment of its own. ContAgent inherits OrgPosition's `idealNumber`
 *   ownedAttribute and provides no new owned attribute of its own)
 * @associationEnds (the spec text at lines 923-925 of the .txt describes
 *   ContAgent as "associating a contractor agent with the assignment of a
 *   contractor person", suggesting an Association from ContAgent to
 *   ContAssignment, but the §3.1.3 diagram does not enumerate the memberEnd
 *   as an owned attribute on ContAgent. A future surface that adds the
 *   Association will declare its memberEnd as an ownedAttribute on whichever
 *   metaclass spec text declares it on)
 * @constraints DISAMBIGUATION 3 — `ContAgent` PARENT: per §3.1.3 line 923
 *   of the .txt, "This specialization of position associates a contractor
 *   agent with the assignment of a contractor person." ContAgent therefore
 *   `extends OrgPosition`. Because OrgPosition is concrete (Implementer 2's
 *   surface declared `OrgPosition.metaClass = 'OrgPosition'`), this surface
 *   re-`override`s `metaClass` and `xmiId` to narrow them to ContAgent's
 *   own literal values. OrgPosition extends Role (NOT NamedElement) per
 *   Implementer 2's prose-vs-diagram resolution at §3.1.1 lines 632-651 of
 *   this file, so ContAgent does NOT inherit a `name` ownedAttribute and
 *   therefore does NOT declare an `override readonly name` initializer.
 *   The interface narrows accordingly: `interface IContAgent extends
 *   IOrgPosition { readonly metaClass: 'ContAgent'; }`.
 *   Citation: §3.1.3 line 923 of ./specs/bmi-06-11-02.txt; parallel
 *   §3.1.1 line 703 (OrgPosition is a Role specialization).
 *
 *   The §3.1.3 diagram (line 896 of the .txt) shows ContAgent in the
 *   concrete-leaf position — so this surface declares ContAgent as a
 *   concrete `class` per the metamodel-surface exemption in
 *   `.claude/rules/convention/classes.md`.
 */
export interface IContAgent extends IOrgPosition {
  readonly metaClass: 'ContAgent';
}

// --- 4.10. class ContAgent ---
export class ContAgent extends OrgPosition implements IContAgent {
  override readonly osmVersion: 'OSM-v0.5' = 'OSM-v0.5';
  override readonly xmiId: 'OSM-ContAgent' = 'OSM-ContAgent';
  override readonly metaClass: 'ContAgent' = 'ContAgent';
  /** Inherited from concrete OrgPosition; ContAgent introduces no new
   *  owned attribute on top of `idealNumber`. ContAgent inherits the
   *  intended-occupancy semantics from OrgPosition per §3.1.1 lines 812-815
   *  of the .txt — a contractor-agent position can equally specify a target
   *  occupancy. Default-initialized to `undefined` so this surface remains
   *  a typed registry without forcing instantiation values. */
  override readonly idealNumber: number | undefined = undefined;
}

// ═══════════════════════════════════════════════════════════════════════════
// 5. SECTION 3.1.4 — ORGUNIT
//    (BusinessFunction — capability/responsibility of a business unit, peer
//     of LegalEntity in the §3.1.4 diagram)
// ═══════════════════════════════════════════════════════════════════════════

// --- 5.1. IBusinessFunction (§3.1.4) ---
/**
 * @standard OMG OSM v0.5 -- bmi/06-11-02 (2006-11-09)
 * @section §3.1.4 OrgUnit
 * @metaclass BusinessFunction
 * @generalization INamedElement
 * @definition BusinessFunction: This defines a business function, a
 *   capability and responsibility of a business unit. A business function
 *   may be performed by multiple business units as where an enterprise may
 *   have multiple manufacturing plants or regional sales organizations. A
 *   single business unit may have multiple business functions. (OSM v0.5
 *   §3.1.4, p.28, lines 951-954 of ./specs/bmi-06-11-02.txt)
 *
 *   The §3.1.4 diagram (p.28, line 940 of the .txt) places BusinessFunction
 *   adjacent to OrgUnit (showing the multiplicity `1..*` between them on
 *   line 938 of the .txt) and adjacent to NamedElement on line 940. The
 *   attribute compartment lists `-description` (line 941 of the .txt; the
 *   diagram omits the explicit `: String` type but the §3.1.4 prose at line
 *   951 confirms the textual nature of the attribute). BusinessFunction is
 *   a capability/responsibility register, not a contracting entity, and is
 *   therefore a peer of LegalEntity in the §3.1.4 partition rather than a
 *   LegalEntity specialization.
 * @ownedAttributes
 *   description : String [0..1]   -- "-description" (§3.1.4 p.28 diagram,
 *                                    line 941 of the .txt). The diagram
 *                                    omits the type but the §3.1.4 prose
 *                                    (lines 951-954) implies a free-form
 *                                    textual description ("a business
 *                                    function, a capability and
 *                                    responsibility of a business unit").
 *                                    The diagram shows no explicit
 *                                    multiplicity decoration; in the absence
 *                                    of one, this surface reads it as
 *                                    [0..1] because a description is
 *                                    descriptive metadata rather than an
 *                                    identifying attribute.
 * @associationEnds DISAMBIGUATION 5 — `BusinessFunction` <-> `OrgUnit`
 *   ASSOCIATION: the §3.1.4 diagram (line 938 of the .txt) shows the
 *   multiplicity `1..*` between OrgUnit and BusinessFunction, and the
 *   §3.1.4 prose at lines 952-954 says "A business function may be
 *   performed by multiple business units … A single business unit may have
 *   multiple business functions." This is a many-to-many Association
 *   between OrgUnit and BusinessFunction. Per the §3.1.4 diagram layout,
 *   the Association memberEnd is conventionally owned by OrgUnit
 *   (`OrgUnit::businessFunction : BusinessFunction [0..*]`); the §3.1.1
 *   surface for OrgUnit (Implementer 2's surface) does not currently
 *   declare this memberEnd because §3.1.4 is the section that introduces
 *   BusinessFunction. A future revision that re-exports OrgUnit with the
 *   `businessFunction` ownedAttribute would land on OrgUnit, NOT on
 *   BusinessFunction (because metaclass-surface convention places the
 *   memberEnd on the metaclass that conceptually "contains" the related
 *   set, and an OrgUnit conceptually performs zero or more BusinessFunctions
 *   per §3.1.4 line 953). Citation: §3.1.4 lines 938 and 951-954 of
 *   ./specs/bmi-06-11-02.txt.
 * @constraints DISAMBIGUATION 5 — `BusinessFunction`'s PARENT: §3.1.4
 *   diagram (line 940 of the .txt) places BusinessFunction adjacent to
 *   NamedElement on the same row as the LegalEntity partition is rendered
 *   at line 940 of the .txt. The §3.1.4 prose at lines 951-954 of the .txt
 *   describes BusinessFunction as "a capability and responsibility of a
 *   business unit" — i.e., a capability/responsibility register, not a
 *   contracting entity. This surface therefore declares BusinessFunction
 *   `extends NamedElement` directly (peer of LegalEntity), exactly parallel
 *   to JobClassification (which Implementer 3's surface at line 1246
 *   established extends NamedElement directly because it is a
 *   classification register, not a LegalEntity). The OrgUnit ↔
 *   BusinessFunction `1..*` relationship is an `@associationEnds`
 *   attribute on OrgUnit (`OrgUnit::businessFunction : BusinessFunction
 *   [0..*]`), not a Generalization. Citation: §3.1.4 lines 940-941 and
 *   951-954 of ./specs/bmi-06-11-02.txt; parallel §3.1.2 lines 879-881
 *   (JobClassification pattern).
 *
 *   The §3.1.4 diagram (line 940 of the .txt) shows BusinessFunction in the
 *   concrete-leaf position with an explicit attribute compartment — so this
 *   surface declares BusinessFunction as a concrete `class` per the
 *   metamodel-surface exemption in `.claude/rules/convention/classes.md`.
 */
export interface IBusinessFunction extends INamedElement {
  readonly metaClass: 'BusinessFunction';
  /** OSM ownedAttribute `description : String [0..1]` — free-form textual
   *  description of this business function (§3.1.4 p.28, lines 951-954 of
   *  ./specs/bmi-06-11-02.txt: "This defines a business function, a
   *  capability and responsibility of a business unit. A business function
   *  may be performed by multiple business units…"). Materialized as a raw
   *  `string | undefined` per the metamodel-surface exemption in
   *  `.claude/rules/convention/valueobjects.md`. */
  readonly description: string | undefined;
}

// --- 5.2. class BusinessFunction ---
export class BusinessFunction extends NamedElement implements IBusinessFunction {
  override readonly osmVersion: 'OSM-v0.5' = 'OSM-v0.5';
  override readonly xmiId: 'OSM-BusinessFunction' = 'OSM-BusinessFunction';
  override readonly metaClass: 'BusinessFunction' = 'BusinessFunction';
  override readonly name: 'BusinessFunction' = 'BusinessFunction';
  readonly description: string | undefined = undefined;
}

// ═══════════════════════════════════════════════════════════════════════════
// 6. SECTION 4 — BUSINESS RULES EXTENSION
//    (Section 4 of bmi/06-11-02 — OSM English Vocabulary noun concepts that
//     the OSM Business Rules Extension contributes to an SBVR vocabulary).
//
//    NAMING: Section 4 vocabulary terms `organizational unit`, `position`,
//    and `person` collide with the Section 3 metamodel classes OrgUnit,
//    OrgPosition, and Person already declared above. Per the M2-vs-M1
//    distinction (§3 declares the metaclass; §4 declares the M1 vocabulary
//    noun concept), the seven Section 4 metaclasses carry the `Vocab`
//    prefix to avoid TypeScript identifier collision: VocabOrganization,
//    VocabOrganizationalUnit, VocabParticipant, VocabOrganizationalRole,
//    VocabPerson, VocabPosition, VocabOrganizationType.
//
//    JSDoc CONVENTION: Each Section 4 metaclass carries a new tag
//    `@sbvrSpecialization sbvr:{ConceptKind}` documenting which SBVR concept
//    it specializes. The SBVR cross-link is type-only via the import-type
//    aliases at the top of this file (SbvrConceptOfOsm, SbvrFactTypeOfOsm,
//    etc.). Section 4 metaclasses extend NamedElement structurally; the
//    SBVR specialization is documentation-only at the M2 layer.
// ═══════════════════════════════════════════════════════════════════════════

// --- 6.1. IVocabOrganization (§4.2) ---
/**
 * @standard OMG OSM v0.5 -- bmi/06-11-02 (2006-11-09)
 * @section §4.2 OSM English Vocabulary
 * @metaclass VocabOrganization
 * @vocabularyTerm organization
 * @generalization NamedElement
 * @sbvrSpecialization sbvr:NounConcept
 * @definition organization: "group of people or organizations joined together
 *   for a purpose" (OSM v0.5 §4.2, lines 997-999 of
 *   ./specs/bmi-06-11-02.txt). The §4.2 entry declares no Concept Type and
 *   no General Concept for `organization`, so this surface treats
 *   `organization` as the root noun concept of the Section 4 vocabulary —
 *   the term every other Section 4 metaclass eventually generalizes to or
 *   composes with. Figure 4.1 (lines 979-993 of the .txt) renders
 *   `organization` as the central anchor of the vocabulary's fact-type
 *   diagram, joined by `[participant] fills [organizational role] in
 *   [organization]` and by `organization contains organizational unit`.
 * @ownedAttributes (none — §4.2 carries the noun-concept term and its
 *   verbatim definition; the v0.5 vocabulary table does not enumerate
 *   typed properties on `organization`. A Vocabulary consumer that needs
 *   to populate the noun concept with typed properties does so at its own
 *   boundary, e.g., by binding `organization` to the Section 3 OrgUnit
 *   metaclass at the M1-vs-M2 layer)
 * @associationEnds (none cited in the §4.2 vocabulary table for
 *   `organization` itself — the verb-concept fact types
 *   `organization contains organizational unit`,
 *   `organization has participant in organizational role`, and
 *   `organization type uses organizational role` are owned by SBVR
 *   verb-concept declarations rather than by the noun concept's owned
 *   attribute compartment)
 * @constraints VOCAB PREFIX RATIONALE — the bare term `Organization` does
 *   not collide with any Section 3 metaclass identifier in this file,
 *   but the seven Section 4 metaclasses are kept under a uniform `Vocab`
 *   prefix so the M2-vs-M1 distinction is visible at every call site:
 *   §3 declares the OSM metaclass (M2), §4 declares the M1 vocabulary
 *   noun concept that the Business Rules Extension contributes to an SBVR
 *   vocabulary. The M2-vs-M1 distinction is explicit in §4 line 965-966
 *   of the .txt: "The OSM concepts become concepts incorporated into
 *   rules, that can be expressed in alternative vocabularies". The
 *   uniform `Vocab` prefix carries that distinction into the TypeScript
 *   identifier so reflection consumers can route §3 metaclass instances
 *   and §4 vocabulary noun-concept instances to different downstream
 *   adapters (UML for §3, SBVR for §4).
 *
 *   Section 4 metaclasses extend `NamedElement` structurally; the SBVR
 *   specialization is documentation-only via the `@sbvrSpecialization`
 *   tag and the type-only `SbvrConceptOfOsm` alias at the top of this
 *   file. Citation: §4.2 lines 997-999 of ./specs/bmi-06-11-02.txt; §4
 *   lines 965-966 (M2-vs-M1 distinction).
 */
export interface IVocabOrganization extends INamedElement {
  readonly metaClass: 'VocabOrganization';
}

// --- 6.2. class VocabOrganization ---
export class VocabOrganization extends NamedElement implements IVocabOrganization {
  override readonly osmVersion: 'OSM-v0.5' = 'OSM-v0.5';
  override readonly xmiId: 'OSM-VocabOrganization' = 'OSM-VocabOrganization';
  override readonly metaClass: 'VocabOrganization' = 'VocabOrganization';
  override readonly name: 'VocabOrganization' = 'VocabOrganization';
}

// --- 6.3. IVocabOrganizationalUnit (§4.2) ---
/**
 * @standard OMG OSM v0.5 -- bmi/06-11-02 (2006-11-09)
 * @section §4.2 OSM English Vocabulary
 * @metaclass VocabOrganizationalUnit
 * @vocabularyTerm organizational unit
 * @generalization NamedElement
 * @sbvrSpecialization sbvr:NounConcept
 * @definition organizational unit: "organization that is a part of another
 *   organization" (OSM v0.5 §4.2, lines 1001-1003 of
 *   ./specs/bmi-06-11-02.txt). The §4.2 entry declares General Concept:
 *   `organization` (line 1004 of the .txt) — i.e., `organizational unit`
 *   is a noun concept that specializes the `organization` noun concept.
 *   The §4.2 verb-concept fact types `organization contains organizational
 *   unit` and the synonymous `organizational unit is within organization`
 *   (lines 1007-1009 of the .txt) realize the partitive relationship.
 * @ownedAttributes (none — §4.2 carries the noun-concept term and its
 *   verbatim definition; the v0.5 vocabulary table does not enumerate
 *   typed properties on `organizational unit`)
 * @associationEnds (none cited in the §4.2 vocabulary table for
 *   `organizational unit` itself — the verb-concept fact type
 *   `organization contains organizational unit` is owned by an SBVR
 *   verb-concept declaration)
 * @constraints VOCAB PREFIX RATIONALE — the bare term `OrganizationalUnit`
 *   collides directly with the Section 3 metamodel class `OrgUnit`
 *   already declared above (the §3.1.1 metaclass that represents the M2
 *   organizational-unit type). Per the M2-vs-M1 distinction (§3 declares
 *   the OSM metaclass; §4 declares the M1 vocabulary noun concept), this
 *   metaclass is named `VocabOrganizationalUnit` to make the distinction
 *   explicit in the TypeScript surface. The SBVR specialization is
 *   documentation-only via `@sbvrSpecialization sbvr:NounConcept`.
 *   Citation: §4.2 lines 1001-1003 of ./specs/bmi-06-11-02.txt; §4
 *   lines 965-966 (M2-vs-M1 distinction); parallel §3.1.1 lines
 *   783-786 (OrgUnit M2 metaclass).
 */
export interface IVocabOrganizationalUnit extends INamedElement {
  readonly metaClass: 'VocabOrganizationalUnit';
}

// --- 6.4. class VocabOrganizationalUnit ---
export class VocabOrganizationalUnit extends NamedElement implements IVocabOrganizationalUnit {
  override readonly osmVersion: 'OSM-v0.5' = 'OSM-v0.5';
  override readonly xmiId: 'OSM-VocabOrganizationalUnit' = 'OSM-VocabOrganizationalUnit';
  override readonly metaClass: 'VocabOrganizationalUnit' = 'VocabOrganizationalUnit';
  override readonly name: 'VocabOrganizationalUnit' = 'VocabOrganizationalUnit';
}

// --- 6.5. IVocabParticipant (§4.2) ---
/**
 * @standard OMG OSM v0.5 -- bmi/06-11-02 (2006-11-09)
 * @section §4.2 OSM English Vocabulary
 * @metaclass VocabParticipant
 * @vocabularyTerm participant
 * @generalization NamedElement
 * @sbvrSpecialization sbvr:Role
 * @definition participant: "person or organization that takes part in
 *   something, such as in an organization" (OSM v0.5 §4.2, lines
 *   1011-1013 of ./specs/bmi-06-11-02.txt). The §4.2 entry declares
 *   General Concept: `person or organization` (line 1013 of the .txt) and
 *   Concept Type: `role` (line 1017 of the .txt). The "role" Concept
 *   Type signals that `participant` is an SBVR Role rather than a plain
 *   NounConcept — i.e., a role taken on by a person or organization
 *   when they take part in an organization. Figure 4.1 (lines 979-993)
 *   places `participant` at the centre of the fact type
 *   `[participant] fills [organizational role] in [organization]`.
 * @ownedAttributes (none — §4.2 carries the noun-concept term and its
 *   verbatim definition; the v0.5 vocabulary table does not enumerate
 *   typed properties on `participant`)
 * @associationEnds (none cited directly on `participant` — the verb-
 *   concept fact types `participant fills organizational role in
 *   organization` and `participant fills position` are owned by SBVR
 *   verb-concept declarations rather than by the noun concept's owned
 *   attribute compartment)
 * @constraints VOCAB PREFIX RATIONALE — the bare term `Participant` does
 *   not currently collide with any Section 3 metaclass identifier in this
 *   file, but the uniform `Vocab` prefix is applied across every Section 4
 *   metaclass to make the M2-vs-M1 distinction visible at every call site:
 *   §3 declares the OSM metaclass (M2), §4 declares the M1 vocabulary
 *   noun concept that the Business Rules Extension contributes to an SBVR
 *   vocabulary. The Concept Type `role` (line 1017) is captured in
 *   `@sbvrSpecialization sbvr:Role` rather than `sbvr:NounConcept` — the
 *   SBVR Role metaclass is the appropriate cross-link target because the
 *   §4.2 declaration explicitly classifies `participant` as a role.
 *   Citation: §4.2 lines 1011-1017 of ./specs/bmi-06-11-02.txt; §4 lines
 *   965-966 (M2-vs-M1 distinction).
 */
export interface IVocabParticipant extends INamedElement {
  readonly metaClass: 'VocabParticipant';
}

// --- 6.6. class VocabParticipant ---
export class VocabParticipant extends NamedElement implements IVocabParticipant {
  override readonly osmVersion: 'OSM-v0.5' = 'OSM-v0.5';
  override readonly xmiId: 'OSM-VocabParticipant' = 'OSM-VocabParticipant';
  override readonly metaClass: 'VocabParticipant' = 'VocabParticipant';
  override readonly name: 'VocabParticipant' = 'VocabParticipant';
}

// --- 6.7. IVocabOrganizationalRole (§4.2) ---
/**
 * @standard OMG OSM v0.5 -- bmi/06-11-02 (2006-11-09)
 * @section §4.2 OSM English Vocabulary
 * @metaclass VocabOrganizationalRole
 * @vocabularyTerm organizational role
 * @generalization NamedElement
 * @sbvrSpecialization sbvr:Role
 * @definition organizational role: "role of a participant within an
 *   organization" (OSM v0.5 §4.2, lines 1019-1023 of
 *   ./specs/bmi-06-11-02.txt). The §4.2 entry declares General Concept:
 *   `role` (line 1020 of the .txt) and a Necessity rule: "If a participant
 *   fills an organizational role in an organization, then the participant
 *   is an instance of the organizational role" (lines 1021-1023). The
 *   verb-concept fact type `participant fills organizational role in
 *   organization` (line 1025) — with synonymous form
 *   `organization has participant in organizational role` (line 1027) —
 *   binds `organizational role` to `participant` and `organization`
 *   simultaneously.
 * @ownedAttributes (none — §4.2 carries the noun-concept term and its
 *   verbatim definition; the v0.5 vocabulary table does not enumerate
 *   typed properties on `organizational role`)
 * @associationEnds (none cited directly on `organizational role` — the
 *   verb-concept fact types `participant fills organizational role in
 *   organization` and `organization type uses organizational role` are
 *   owned by SBVR verb-concept declarations)
 * @constraints VOCAB PREFIX RATIONALE — the bare term `OrganizationalRole`
 *   does not directly collide with any Section 3 metaclass identifier
 *   (Section 3 uses `Role` as the abstract sibling-of-NamedElement and
 *   `OrgPosition` as the position specialization), but the uniform
 *   `Vocab` prefix is applied to keep the M2-vs-M1 distinction visible:
 *   §3 declares the OSM Role metaclass (M2), §4 declares the M1
 *   vocabulary noun concept `organizational role` that the Business Rules
 *   Extension contributes to an SBVR vocabulary. Per General Concept
 *   `role` (line 1020), the SBVR specialization target is `sbvr:Role`
 *   rather than `sbvr:NounConcept`. Citation: §4.2 lines 1019-1023 of
 *   ./specs/bmi-06-11-02.txt; §4 lines 965-966 (M2-vs-M1 distinction);
 *   parallel §3.1.1 lines 805-810 (Role M2 metaclass).
 */
export interface IVocabOrganizationalRole extends INamedElement {
  readonly metaClass: 'VocabOrganizationalRole';
}

// --- 6.8. class VocabOrganizationalRole ---
export class VocabOrganizationalRole extends NamedElement implements IVocabOrganizationalRole {
  override readonly osmVersion: 'OSM-v0.5' = 'OSM-v0.5';
  override readonly xmiId: 'OSM-VocabOrganizationalRole' = 'OSM-VocabOrganizationalRole';
  override readonly metaClass: 'VocabOrganizationalRole' = 'VocabOrganizationalRole';
  override readonly name: 'VocabOrganizationalRole' = 'VocabOrganizationalRole';
}

// --- 6.9. IVocabPerson (§4.2) ---
/**
 * @standard OMG OSM v0.5 -- bmi/06-11-02 (2006-11-09)
 * @section §4.2 OSM English Vocabulary
 * @metaclass VocabPerson
 * @vocabularyTerm person
 * @generalization NamedElement
 * @sbvrSpecialization sbvr:NounConcept
 * @definition person: "human being" (OSM v0.5 §4.2, line 1029 of
 *   ./specs/bmi-06-11-02.txt). The §4.2 entry declares no General Concept
 *   and no Concept Type for `person`, leaving it as a basic noun concept
 *   inside the Section 4 vocabulary. The §4.3 example vocabulary
 *   demonstrates that `person` participates indirectly in the
 *   `participant` General Concept ("person or organization") and that
 *   downstream organization types (e.g., `corporate officer`,
 *   `manager`, `sales person`) declare General Concept: `person,
 *   participant` (lines 1114-1133 of the .txt), confirming that `person`
 *   is treated as a specialization of `participant` by convention.
 * @ownedAttributes (none — §4.2 carries the noun-concept term and its
 *   verbatim definition; the v0.5 vocabulary table does not enumerate
 *   typed properties on `person`)
 * @associationEnds (none cited in the §4.2 vocabulary table — `person`
 *   participates in fact types only indirectly through the `participant`
 *   General Concept it specializes)
 * @constraints VOCAB PREFIX RATIONALE — the bare term `Person` collides
 *   directly with the Section 3 metamodel class `Person` already declared
 *   above (the §3.1.2 LegalEntity specialization that represents the M2
 *   person type). Per the M2-vs-M1 distinction (§3 declares the OSM
 *   metaclass; §4 declares the M1 vocabulary noun concept), this
 *   metaclass is named `VocabPerson` to make the distinction explicit
 *   in the TypeScript surface. The SBVR specialization is documentation-
 *   only via `@sbvrSpecialization sbvr:NounConcept`. Citation: §4.2
 *   line 1029 of ./specs/bmi-06-11-02.txt; §4 lines 965-966 (M2-vs-M1
 *   distinction); parallel §3.1.2 lines 871-873 (Person M2 metaclass).
 */
export interface IVocabPerson extends INamedElement {
  readonly metaClass: 'VocabPerson';
}

// --- 6.10. class VocabPerson ---
export class VocabPerson extends NamedElement implements IVocabPerson {
  override readonly osmVersion: 'OSM-v0.5' = 'OSM-v0.5';
  override readonly xmiId: 'OSM-VocabPerson' = 'OSM-VocabPerson';
  override readonly metaClass: 'VocabPerson' = 'VocabPerson';
  override readonly name: 'VocabPerson' = 'VocabPerson';
}

// --- 6.11. IVocabPosition (§4.2) ---
/**
 * @standard OMG OSM v0.5 -- bmi/06-11-02 (2006-11-09)
 * @section §4.2 OSM English Vocabulary
 * @metaclass VocabPosition
 * @vocabularyTerm position
 * @generalization NamedElement
 * @sbvrSpecialization sbvr:Role
 * @definition position: "organizational role of participation in a
 *   particular organization that is filled or is intended to be filled
 *   by an individual participant" (OSM v0.5 §4.2, lines 1033-1035 of
 *   ./specs/bmi-06-11-02.txt). The §4.2 entry declares General Concept:
 *   `organizational role` (line 1036 of the .txt) and three Necessity
 *   rules (lines 1037-1041): "Each position is in exactly one
 *   organization", "Each position is filled by at most one participant",
 *   and the equivalence "A participant fills a position in an
 *   organization if and only if the participant fills the position and
 *   the position is in the organization". The verb-concept fact types
 *   `participant fills position`, `position is filled`, `position is
 *   open`, and `position is in organization` (lines 1043-1055) realize
 *   the binary relations on this noun concept.
 * @ownedAttributes (none — §4.2 carries the noun-concept term and its
 *   verbatim definition; the v0.5 vocabulary table does not enumerate
 *   typed properties on `position`. The Necessity rules at lines
 *   1037-1041 are realized by SBVR rule declarations that consume this
 *   noun concept rather than by typed properties on the noun concept
 *   itself)
 * @associationEnds (none cited directly on `position` — the verb-concept
 *   fact types `participant fills position`, `position is in
 *   organization`, etc. are owned by SBVR verb-concept declarations)
 * @constraints VOCAB PREFIX RATIONALE — the bare term `Position`
 *   collides directly with the Section 3 metamodel class `OrgPosition`
 *   already declared above (the §3.1.1 metaclass that represents the M2
 *   position type, with the §3.1.3 specialization ContAgent). Per the
 *   M2-vs-M1 distinction (§3 declares the OSM metaclass; §4 declares the
 *   M1 vocabulary noun concept), this metaclass is named `VocabPosition`
 *   to make the distinction explicit in the TypeScript surface. The
 *   General Concept `organizational role` (line 1036) is itself a Role
 *   concept type, so the SBVR specialization target is `sbvr:Role`
 *   rather than `sbvr:NounConcept`. Citation: §4.2 lines 1033-1041 of
 *   ./specs/bmi-06-11-02.txt; §4 lines 965-966 (M2-vs-M1 distinction);
 *   parallel §3.1.1 lines 812-815 (OrgPosition M2 metaclass).
 */
export interface IVocabPosition extends INamedElement {
  readonly metaClass: 'VocabPosition';
}

// --- 6.12. class VocabPosition ---
export class VocabPosition extends NamedElement implements IVocabPosition {
  override readonly osmVersion: 'OSM-v0.5' = 'OSM-v0.5';
  override readonly xmiId: 'OSM-VocabPosition' = 'OSM-VocabPosition';
  override readonly metaClass: 'VocabPosition' = 'VocabPosition';
  override readonly name: 'VocabPosition' = 'VocabPosition';
}

// --- 6.13. IVocabOrganizationType (§4.2) ---
/**
 * @standard OMG OSM v0.5 -- bmi/06-11-02 (2006-11-09)
 * @section §4.2 OSM English Vocabulary
 * @metaclass VocabOrganizationType
 * @vocabularyTerm organization type
 * @generalization NamedElement
 * @sbvrSpecialization sbvr:NounConcept
 * @definition organization type: "category of organizations based on
 *   characteristics that distinguish it from other kinds of
 *   organizations" (OSM v0.5 §4.2, lines 1057-1059 of
 *   ./specs/bmi-06-11-02.txt). The §4.2 entry declares Concept Type:
 *   `noun concept` (line 1059 of the .txt) and a Necessity rule: "Each
 *   organization type specializes the concept `organization'" (lines
 *   1060-1062). The verb-concept fact type `organization type uses
 *   organizational role` (line 1064) — with the implicit binary fact
 *   type pattern "Given a term `O' designating an organization type and
 *   a term `R' designating an organizational role used by that
 *   organization type, there is implicitly a binary fact type having
 *   the form `O has R'" (lines 1067-1075) — generates per-organization-
 *   type role-binding fact types at the M1 layer.
 * @ownedAttributes (none — §4.2 carries the noun-concept term and its
 *   verbatim definition; the v0.5 vocabulary table does not enumerate
 *   typed properties on `organization type`. The implicit binary fact
 *   type pattern at lines 1067-1075 is realized by SBVR rule
 *   declarations that consume this noun concept rather than by typed
 *   properties on the noun concept itself)
 * @associationEnds (none cited directly on `organization type` — the
 *   verb-concept fact type `organization type uses organizational role`
 *   is owned by an SBVR verb-concept declaration)
 * @constraints VOCAB PREFIX RATIONALE — the bare term `OrganizationType`
 *   does not currently collide with any Section 3 metaclass identifier
 *   in this file, but the uniform `Vocab` prefix is applied across
 *   every Section 4 metaclass to make the M2-vs-M1 distinction visible
 *   at every call site: §3 declares the OSM metaclass (M2), §4 declares
 *   the M1 vocabulary noun concept that the Business Rules Extension
 *   contributes to an SBVR vocabulary. Per Concept Type `noun concept`
 *   (line 1059), the SBVR specialization target is `sbvr:NounConcept`.
 *   The §4.3 example vocabulary illustrates this pattern with
 *   `corporation` and `department` declared as Concept Type:
 *   `organization type` (lines 1106 and 1112 of the .txt). Citation:
 *   §4.2 lines 1057-1066 of ./specs/bmi-06-11-02.txt; §4 lines 965-966
 *   (M2-vs-M1 distinction).
 */
export interface IVocabOrganizationType extends INamedElement {
  readonly metaClass: 'VocabOrganizationType';
}

// --- 6.14. class VocabOrganizationType ---
export class VocabOrganizationType extends NamedElement implements IVocabOrganizationType {
  override readonly osmVersion: 'OSM-v0.5' = 'OSM-v0.5';
  override readonly xmiId: 'OSM-VocabOrganizationType' = 'OSM-VocabOrganizationType';
  override readonly metaClass: 'VocabOrganizationType' = 'VocabOrganizationType';
  override readonly name: 'VocabOrganizationType' = 'VocabOrganizationType';
}
