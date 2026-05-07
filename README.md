# @amlhubs/osm

OMG **Organization Structure Metamodel** (OSM) — `bmi/06-11-02`. 2nd Initial
Submission, version 0.5 (2006-11-09). Co-submitted by 88Solutions, Adaptive,
Borland Software, Data Access Technologies, EDS, and Lombardi Software, with
support from Unisys.

OSM standardizes the elements that describe the *who* and *how* of an
enterprise's organizational scaffolding: the units that compose it
(OrgUnit, BusinessFunction), the legal and natural persons that staff it
(LegalEntity, Company, Person), the positions through which work is
allocated (OrgPosition), the assignments that bind persons to positions
(OrgAssignment), and the relationships that knit those nodes together
(OrgRelationship + RelationshipType). A Business Rules Extension layers
SBVR vocabulary onto the structural core so that organizational policies
are expressed in the same terms as the structure they govern.

This package provides the extensible TypeScript base classes and
interfaces for the OSM metaclasses, building on `@amlhubs/uml` (the
underlying metamodeling form per RFP §6.5.3 "Express as UML") and
`@amlhubs/sbvr` (the source vocabulary specialized by the Business Rules
Extension per §1.3 Conformance and Section 4).

## Root Abstraction

OSM organizes its metaclasses around three layers of abstract supertypes
and a partition of concrete nodes:

| Layer | Metaclass | Purpose |
|---|---|---|
| Naming root | `NamedElement` | Every OSM concept that carries a name specializes this root |
| Effective-dates root | `OrgElement` | Every OSM concept that has a start/end of effectivity specializes this root |
| Node partition | `OrgNode` | Common parent of the three concrete node kinds — `OrgUnit`, `OrgPosition`, `OrgAssignment` |
| Concrete node | `OrgUnit` | A unit of organization — department, team, business function |
| Concrete node | `OrgPosition` | A staffable position — job slot, role assignment target |
| Concrete node | `OrgAssignment` | The binding of a person (or contractor) to a position |
| Edge | `OrgRelationship` | A typed edge connecting two `OrgNode` instances |
| Edge classifier | `RelationshipType` | The named kind of an `OrgRelationship` (reports-to, member-of, …) |
| Legal-entity branch | `LegalEntity` (`Company`, `Person`) | The juridical and natural persons that the structure refers to |
| Specialization | `BusinessFunction` | A specialization of `OrgUnit` denoting a functional capability rather than a structural unit |
| Profile | `Role`, `Addressable`, `ContactInfo`, `JobClassification`, `Community`, `ParticipationType`, `PosAuthority`, `PosRequirements`, `ContAssignment`, `ContAgent` | Supporting metaclasses introduced by Sections 3.1.2 – 3.1.4 |

## Install

The package is published privately on GitHub Packages under the
`@amlhubs` scope. Authentication is required.

```bash
# .npmrc (do NOT commit)
@amlhubs:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${GITHUB_TOKEN}

# install
npm install @amlhubs/osm
```

## Build

```bash
npm install
npm run build
```

## Specifications

The original OMG OSM submission (PDF) and any companion XMI files are
downloaded into `specs/` by the AML metamodel-import pipeline.

## Status

`0.0.1` — initial scaffold. Metaclass implementation pending.
