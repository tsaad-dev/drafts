---
title: A YANG Data Model for Traffic Engineering Tunnels, Label Switched Paths, and Interfaces
abbrev: TE YANG Data Model
docname: draft-ietf-teas-yang-te-39
ipr: trust200902
category: std
workgroup: TEAS Working Group
keyword: Internet-Draft

stand_alone: true
submissiontype: IETF
pi: [toc, sortrefs, symrefs, comments]

author:

 -
    ins: T. Saad
    name: Tarek Saad
    organization: Cisco Systems Inc
    email: tsaad.net@gmail.com
 -
   ins: R. Gandhi
   name: Rakesh Gandhi
   organization: Cisco Systems Inc
   email: rgandhi@cisco.com

 -
   ins: X. Liu
   name: Xufeng Liu
   organization: Alef Edge
   email: xufeng.liu.ietf@gmail.com

 -
   ins: V. P. Beeram
   name: Vishnu Pavan Beeram
   organization: Juniper Networks
   email: vbeeram@juniper.net

 -
    ins: I. Bryskin
    name: Igor Bryskin
    organization: Individual
    email: i_bryskin@yahoo.com

normative:
  RFC3209:
  RFC6020:
  RFC6241:
  RFC6991:
  RFC6107:
  RFC8040:
  ITU_G.808.1:
    title: Generic protection switching - Linear trail and subnetwork protection
    author:
      org: ITU-T Recommendation G.808.1
    date: May 2014
    seriesinfo: ITU-T G.808.1

informative:

--- abstract

This document defines a YANG data model for the provisioning and management of
Traffic Engineering (TE) tunnels, Label Switched Paths (LSPs), and interfaces.
The model covers data that is independent of any technology or dataplane encapsulation
and is divided into two YANG modules that cover device-specific, and device independent
data.

This model covers data for configuration, operational state, remote procedural
calls, and event notifications.

--- middle

# Introduction

YANG {{!RFC6020}} and {{!RFC7950}} is a data modeling language that was
introduced to define the contents of a conceptual data store that allows
networked devices to be managed using NETCONF {{!RFC6241}}. YANG has proved
relevant beyond its initial confines, as bindings to other interfaces (e.g.
RESTCONF {{RFC8040}}) and encoding other than XML (e.g. JSON) are being defined.
Furthermore, YANG data models can be used as the basis of implementation for
other interfaces, such as CLI and programmatic APIs.

This document describes a YANG data model for Traffic Engineering (TE) tunnels,
Label Switched Paths (LSPs), and interfaces. The data model is divided into two
YANG modules. The 'ietf-te' module includes data that is generic and
device independent, while the 'ietf-te-device' module includes data that is
device-specific.

The document describes a high-level relationship between the modules defined in
this document, as well as other external protocol YANG modules.  The TE generic
YANG data model does not include any data specific to a signaling protocol.  It
is expected other data plane technology models will augment the TE generic
YANG data model. 

Also, it is expected that other YANG modules that model TE signaling protocols,
such as RSVP-TE ({{RFC3209}}, {{!RFC3473}}), or Segment-Routing TE (SR-TE) 
{{?RFC9256}} will augment the generic TE YANG  module.

# Terms and Conventions

## Terminology

The following terms are defined in {{!RFC6241}} and are used in this specification:

* client
* configuration data
* state data

This document also makes use of the following terminology introduced in the
YANG Data Modeling Language {{!RFC7950}}:

* augment
* data model
* data node

## Prefixes in Data Node Names

In this document, names of data nodes and other data model objects are prefixed
using the standard prefix associated with the corresponding YANG imported
modules, as shown in {{tab1}}.

 | Prefix          | YANG module          | Reference          |
 |-----------------|----------------------|--------------------|
 | yang            | ietf-yang-types      | {{!RFC6991}}       |
 | inet            | ietf-inet-types      | {{!RFC6991}}       |
 | rt-types        | ietf-routing-types   | {{!RFC8294}}       |
 | te-types        | ietf-te-types        | {{!I-D.draft-ietf-teas-rfc8776-update}}       |
 | te-packet-types | ietf-te-packet-types | {{!I-D.draft-ietf-teas-rfc8776-update}}       |
 | te              | ietf-te              | this document      |
 | te-dev          | ietf-te-device       | this document      |
{: #tab1 title="Prefixes and corresponding YANG modules"}

## Model Tree Diagrams

The tree diagrams extracted from the modules defined in this document are given in
subsequent sections as per the syntax defined in {{!RFC8340}}.

# Design Considerations

This document describes a generic TE YANG data model that is independent of
any dataplane technology.  One of the design objectives is to allow specific
data plane technology models to reuse the TE generic data model and possibly
augment it with technology specific data.

The elements of the generic TE YANG data model, including TE Tunnels, LSPs, and
interfaces have leafs that identify the technology layer where they reside.
For example, the LSP encoding type can identify the technology associated with a
TE Tunnel or LSP.

Also, the generic TE YANG data model does not cover signaling protocol data.
The signaling protocols used to instantiate TE LSPs are outside the scope of this
document and expected to be covered by augmentations defined in other documents.

The following other design considerations are taken into account with respect to data
organization:

* The device independent TE data is defined in the 'ietf-te' module, and
  can be used to manage data off a device, such as a TE controller. When the
  model is used to manage a specific device, the model contains the TE Tunnels
  originating from the specific device.  When the model is used to manage a TE
  controller, the 'tunnel' list contains all TE Tunnels and TE tunnel segments
  originating from devices that the TE controller manages.
* The device-specific TE data is defined in the 'ietf-te-device' module.
* Minimal elements in the model are designated as "mandatory" to
  allow freedom to vendors to adapt the data model to their specific product
  implementation.
* Suitable defaults are specified for all configurable elements.
* Where TE functions or features might be optional within the
  deployed TE network, the model declares them as optional.

## State Data Organization

The Network Management Datastore Architecture (NMDA) {{!RFC8342}} addresses
modeling state data for ephemeral objects.  This document adopts the NMDA model
for configuration and state data representation as per IETF guidelines for new
IETF YANG data models.

# Model Overview

The data models defined in this document cover the core TE features that are
commonly supported by different vendor implementations. The support of extended
or vendor specific TE features is expected to either be in augmentations, or
deviations to this model that are defined in separate documents.


## Module Relationship

The generic TE YANG data model defined in the 'ietf-te' module covers the
building blocks that are device independent and agnostic of any specific
technology or control plane instances. The TE device YANG data model defined in
the 'ietf-te-device' module augments the 'ietf-te' module and covers data
that is specific to a device --  for example, attributes of TE interfaces, or
TE timers that are local to a TE node.

The TE data models for specific instances of data plane technology and
signaling protocols are outside the scope of this document.  They could be
defined in separate YANG modules that augment the generic TE YANG data model.

~~~

     TE generic     +---------+
     module         | ietf-te |o-------------+
                    +---------+               \
                        o  o                   \
                        |   \                   \
                        |    \ TE device module  \
                        |     +----------------+  \
                        |     | ietf-te-device |   \
                        |     +----------------+    \
                        |        o                   \
                        |        |                    \
                        |        |                     \
                    +---------------+          +---------------+
     RSVP-TE module | ietf-rsvp-te^ |o         | ietf-te-mpls^ |
                    +---------------+ \        +---------------+
                        |              \
                        |               \
                        |                \
                        |                 \
                        |                  \
                        o                +-------------------+
                    +------------+       | ietf-rsvp-otn-te^ |
     RSVP module    | ietf-rsvp^ |       +-------------------+
                    +------------+         RSVP-TE with OTN
                                              extensions

                   X---oY indicates that module X augments module Y
                   ^ indicates a module defined in other documents

~~~
{: #figctrl title="Relationship of TE modules with signaling protocol modules"}

# TE YANG Model

The generic TE YANG data model defined in the 'ietf-te' module supports the management and
operation of a TE network. This includes creating, modifying, and retrieving
information about TE Tunnels, LSPs, and interfaces and their associated
attributes (e.g.  Administrative-Groups, SRLGs, etc.).

A full tree diagram of the TE YANG data model is shown in {{AppendixB}}.

## Module Structure

The 'te' container is the top level container in the 'ietf-te' module. The
presence of the 'te' container enables TE function system-wide.  Further
descriptions of containers that exist under the 'te' top level container are
provided in the following sections.

The three containers grouped under the 'te'
container as shown in {{fig-highlevel}} and described below.

globals:

> The 'globals' container maintains the set of global TE attributes that can be
applicable to TE Tunnels and interfaces. Refer to {{TeGlobals}} for further details.

tunnels:

> The 'tunnels' container includes the list of TE Tunnels that are instantiated.
Refer to {{TE_TUNNELS}} for further details on the properties of a TE Tunnel.

lsps:

> The 'lsps' container includes the list of TE LSPs that are instantiated for
> TE Tunnels. Refer to {{TE_LSPS}} for further details on the properties of a TE LSP.

The model also contains two Remote Procedure Calls (RPCs) as shown
in {{AppendixB}} and described below.

tunnels-path-compute:

> An RPC to request path computation for a specific TE Tunnel.
The RPC allows requesting path computation using atomic and stateless operation.
A tunnel may also be configured in 'compute-only' mode to provide stateful path updates
- see {{TE_TUNNELS}} for further details.

tunnels-action:

> An RPC to request a specific action (e.g. reoptimize, or tear-and-setup) to be taken
on a specific tunnel or all tunnels.

~~~~~~~~~~~
{::include ../../te/ietf-te-01.tree}
~~~~~~~~~~~
{: #fig-highlevel title="TE Tunnel model high-level YANG tree view"}

### TE Globals {#TeGlobals}

The 'globals' container covers properties that control a TE feature's
behavior system-wide, and its respective state as shown in {{fig-globals}}
and described in the text that follows.


~~~~~~~
     +--rw globals
     |  +--rw named-admin-groups
     |  |  +--rw named-admin-group* [name]
     |  |        ...
     |  +--rw named-srlgs
     |  |  +--rw named-srlg* [name]
     |  |        ...
     |  +--rw named-path-constraints
     |     +--rw named-path-constraint* [name]
~~~~~~~
{: #fig-globals title="TE globals YANG subtree high-level structure"}


named-admin-groups:

> A YANG container for the list of named (extended) administrative groups that may be applied
to TE links.

named-srlgs:

> A YANG container for the list of named Shared Risk Link Groups (SRLGs) that may be
applied to TE links.

named-path-constraints:

> A YANG container for a list of named path constraints. Each named path constraint is
composed of a set of constraints that can be applied during path computation.
A named path constraint can be applied to multiple TE Tunnels. Path constraints may also
be specified directly under the TE Tunnel. The path constraints specified under
the TE Tunnel take precedence over the path constraints 
derived from the referenced named path constraint. A named path constraint entry can be
formed of the path constraints shown in {{fig-named-constraints}}:

~~~~~
     |  +--rw named-path-constraints
     |     +--rw named-path-constraint* [name]
     |             {te-types:named-path-constraints}?
     |        +--rw name                             string
     |        +--rw te-bandwidth
     |        |     ...
     |        +--rw link-protection?                 identityref
     |        +--rw setup-priority?                  uint8
     |        +--rw hold-priority?                   uint8
     |        +--rw signaling-type?                  identityref
     |        +--rw path-metric-bounds
     |        |     ...
     |        +--rw path-affinities-values
     |        |     ...
     |        +--rw path-affinity-names
     |        |     ...
     |        +--rw path-srlgs-lists
     |        |     ...
     |        +--rw path-srlgs-names
     |        |     ...
     |        +--rw disjointness?
     |        |       te-path-disjointness
     |        +--rw explicit-route-objects
     |        |     ...
     |        +--rw path-in-segment!
     |        |     ...
     |        +--rw path-out-segment!
     |              ...

~~~~~
{: #fig-named-constraints title="Named path constraints YANG subtree"}

>
- name: A YANG leaf that holds the named path constraint entry. This is unique in the list and used as a key.
- te-bandwidth: A YANG container that holds the technology agnostic TE bandwidth constraint.
- link-protection: A YANG leaf that holds the link protection type constraint required for the links to be included in the computed path.
- setup/hold priority: YANG leafs that hold the LSP setup and hold admission priority as defined in {{?RFC3209}}.
- signaling-type: A YANG leaf that holds the LSP setup type, such as RSVP-TE or SR.
- path-metric-bounds: A YANG container that holds the set of metric bounds applicable on the
computed TE tunnel path.
- path-affinities-values: A YANG container that holds the set of affinity values and
mask to be used during path computation.
- path-affinity-names: A YANG container that holds the set of named affinity constraints and
corresponding inclusion or exclusion instructions for each to be used during path computation.
- path-srlgs-lists: A YANG container that holds the set of SRLG values and
corresponding inclusion or exclusion instructions to be used during path computation.
- path-srlgs-names: A YANG container that holds the set of named SRLG constraints and
corresponding inclusion or exclusion instructions for each to be used during path computation.
- disjointness: The level of resource disjointness constraint that the secondary path
of a TE tunnel has to adhere to.
- explicit-route-objects: A YANG container that holds path constraints in the form of route entries present in the following two lists:
    - 'route-object-exclude-always': a list of route entries that are always excluded from the path computation. The exclusion of a route entry in this list during path computation is not order sensitive.
    - 'route-object-include-exclude':
    : a list of route entries to include or exclude for the path computation.
    : The constraint type (include or exclude) is specified with each route entry. The path computation considers route entry constraints in the order they appear in this list. Once a route entry constraint is consumed from this list, it is not considered any further in the computation of the TE path.
    : The 'route-object-include-exclude' is used to configure constraints on which route objects (e.g., nodes, links) are included or excluded in the path computation.
    : The interpretation of an empty 'route-object-include-exclude' list depends on the TE Tunnel (end-to-end or Tunnel Segment) and on the specific path, according to the following rules:
        1. An empty 'route-object-include-exclude' list for the primary path of an end-to-end TE Tunnel indicates that there are no route objects to be included or excluded in the path computation.
        1. An empty 'route-object-include-exclude' list for the primary path of a TE Tunnel Segment indicates that no primary LSP is required for that TE Tunnel Segement.
        1. An empty 'route-object-include-exclude' list for a reverse path means it always follows the forward path (i.e., the TE Tunnel is co-routed). When the 'route-object-include-exclude' list is not empty, the reverse path is routed independently of the forward path.
        1. An empty 'route-object-include-exclude' list for the secondary (forward) path of a TE Tunnel segment indicates that the secondary path has the same endpoints as the primary path.
- path-in-segment: A YANG container that contains a list of label restrictions
  that have to be taken into considerations when stitching to another tunnel
  segment such as at a domain boundary.  The TE tunnel segment in this case
  is being stitched to the upstream TE tunnel segment.
- path-out-segment: A YANG container that contains a list of label restrictions
  that have to be taken into considerations when stitching to another tunnel
  segment such as at a domain boundary.  The TE tunnel segment in this case
  is being stitched to the downstream TE tunnel segment.


### TE Tunnels {#TE_TUNNELS}

The 'tunnels' container holds the list of TE Tunnels that are provisioned on
ingress Label Egress Router (LER) devices in the network as shown in {{fig-te-tunnel}}.

~~~~~~~~~~~

module: ietf-te
  +--rw te
     +--rw tunnels
        +--rw tunnel* [name]
           +--rw name                            string
           +--rw alias?                          string
           +--rw identifier?                     uint32
           +--rw color?                          uint32
           +--rw description?                    string
           +--rw admin-state?                    identityref
           +--ro operational-state?              identityref
           +--rw encoding?                       identityref
           +--rw switching-type?                 identityref
           +--rw source
           |     ...
           +--rw destination
           |     ...
           +--rw bidirectional?                  boolean
           +--rw controller
           |     ...
           +--rw reoptimize-timer?               uint16
           +--rw association-objects
           |     ...
           +--rw protection
           |     ...
           +--rw restoration
           |     ...
           +--rw network-id?                     nw:network-id
           +--rw te-topology-identifier
           |     ...
           +--rw te-bandwidth
           |     ...
           +--rw link-protection?                identityref
           +--rw setup-priority?                 uint8
           +--rw hold-priority?                  uint8
           +--rw signaling-type?                 identityref
           +--rw hierarchy
           |     ...
           +--rw primary-paths
           |     ...
           +--rw secondary-paths
           |     ...
           +--rw secondary-reverse-paths
           |     ...
           +---x tunnel-action
           |     ...
           +---x protection-external-commands
                 ...

~~~~~~~~~~~
{: #fig-te-tunnel title="TE Tunnel YANG subtree structure"}


When the model is used to manage a specific device, the 'tunnel' list contains
the TE Tunnels originating from the specific device. When the model is used to
manage a TE controller, the 'tunnel' list contains all TE Tunnels and TE
tunnel segments originating from devices that the TE controller manages.

The TE Tunnel model allows the configuration and management of the following TE
tunnel objects:

TE Tunnel:

> A YANG container of one or more TE LSPs established between the source and destination
TE Tunnel termination points. 

TE Path:

> An engineered path that once instantiated in the forwarding plane can be used
> to forward traffic from the source to the destination TE Tunnel termination points.

TE LSP:

> A TE LSP is a connection-oriented service established over a TE Path
and that allows the delivery of traffic between the TE Tunnel source and
destination termination points.

TE Tunnel Segment:

> A segment of a TE Tunnel that is stitched with other segments in order to provision an end-to-end tunnel.

The TE Tunnel has a number of attributes that are set directly under the
tunnel (as shown in {{fig-te-tunnel}}). The main attributes of a TE Tunnel are described below:

name:

> A YANG leaf that holds the name of a TE Tunnel.  The name of the
TE Tunnel uniquely identifies the tunnel within the TE tunnel list.  The name
of the TE Tunnel can be formatted as a Uniform Resource Indicator (URI) by
including the namespace to ensure uniqueness of the name among all the TE
Tunnels present on devices and controllers. The configured TE Tunnels can
be reported with the name of the device embedded within the TE Tunnel name.
For TE Tunnels initiated by the controller, the controller is responsible
to ensure that TE Tunnel names are unique.

alias:

> A YANG leaf that holds an alternate name to the TE tunnel. Unlike the TE tunnel
name, the alias can be modified at any time during the lifetime of the TE tunnel.

identifier:

> A YANG leaf that holds an identifier of the tunnel. This identifier is unique among tunnels
originated from the same ingress device.

color:

> A YANG leaf that holds the color associated with the TE tunnel. The color is used
to map or steer services that carry matching color onto the TE tunnel as described in
{{?RFC9012}}.

admin-state:

> A YANG leaf that holds the tunnel administrative state.

operational-state:

> A YANG leaf that holds the tunnel operational state.

encoding/switching:

> The 'encoding' and 'switching-type' are YANG leafs that define the specific
technology in which the tunnel operates in as described in {{?RFC3945}}.

source/destination:

> YANG containers that hold the tunnel source and destination node endpoint identities, including:

>  * te-node-id:  A YANG leaf that holds the TE node identifier (as defined in {{!I-D.draft-ietf-teas-rfc8776-update}}) of the source
>  or destination of the TE Tunnel.
>
>  * node-id: A YANG leaf that holds the node identifier (as defined in {{!RFC8345}}) of the source or
>  destination of the TE Tunnel.
>
>  * tunnel-tp-id: A YANG leaf that holds the identifier of the source or destination of the TE Tunnel
>    Termination Points (TTPs) as defined in {{!RFC8795}}. The TTP identifiers are optional
>    on nodes that have a single TTP per node. For example, TTP identifiers are optional for packet
>    (IP/MPLS) routers.


bidirectional:

> A YANG leaf that when present indicates the LSP of a TE Tunnel is bidirectional
as defined in {{?rfc3473}}.

controller:

> A YANG container that holds tunnel data relevant to an optional external TE controller that
may initiate or control a tunnel. This target node may be augmented by external modules, for example, to add data for Path Computation Element Protocol (PCEP) initiated and/or
delegated tunnels.

reoptimize-timer:

> A YANG leaf to set the interval period for tunnel reoptimization.


association-objects:

> A YANG container that holds the set of associations of the TE Tunnel to other
> TE Tunnels. Associations at the TE Tunnel level apply to all paths of the TE
> Tunnel. The TE tunnel associations can be overridden by associations
> configured directly under the TE Tunnel path.

protection:

> A YANG container that holds the TE Tunnel protection properties.

restoration:

> A YANG container that holds the TE Tunnel restoration properties.

te-topology-identifier:

> A YANG container that holds the topology identifier associated with the topology where paths for the TE tunnel are computed as defined in {{!RFC8795}}.

network-id:

> A YANG leaf that can optionally be used to identify the network topology where paths for the TE tunnel are computed as defined in {{!RFC8345}}.

hierarchy:

> A YANG container that holds hierarchy related properties of the TE Tunnel. A TE LSP
  can be set up in MPLS or Generalized MPLS (GMPLS) networks to be used as
  a TE link to carry traffic in other (client) networks {{RFC6107}}.  In this
  case, the model introduces the TE Tunnel hierarchical link endpoint parameters
  to identify the specific link in the client layer that the underlying TE Tunnel is
  associated with. The hierarchy container includes the following:

>
* dependency-tunnels: A hierarchical set of TE Tunnels either provisioned or
  to be provisioned in the immediate lower layer, upon which the
  current TE Tunnel relies for multi-layer path computation. A dependency TE
  Tunnel is provisioned if it has been selected by path computation to support
  at least one client-layer TE Tunnel. When a dependency TE Tunnel is
  provisioned, it makes the TE link operational in the client layer's network
  topology, enabling the provisioning of TE Tunnels in the client layer.

>
* hierarchical-link: A YANG container that holds the identity of the
hierarchical link (in the client layer) that is supported by this TE Tunnel.
The endpoints of the hierarchical link are defined by TE tunnel source and
destination node endpoints. The hierarchical link can be identified by its source
and destination link termination point identifiers.

primary-paths:

> A YANG container that holds the list of primary paths.
A primary path is identified by 'name'. A primary path is selected from the list
to instantiate a primary forwarding LSP for the tunnel.  The list of primary
paths is visited by order of preference. A primary path has the following
attributes:

>
- primary-reverse-path: A YANG container that holds properties of the
  primary reverse path. The reverse path is applicable to
  bidirectional TE Tunnels.

>
- candidate-secondary-paths: A YANG container that holds a list of candidate
  secondary paths which may be used for the primary path to support path
  protection. The candidate secondary paths reference paths from the
  tunnel secondary paths list.  The preference of the secondary paths is
  specified within the list and dictates the order of visiting the secondary
  path from the list. The attributes of a secondary path can be defined
  separately from the primary path. The attributes of a secondary path will be
  inherited from the associated 'active' primary when not explicitly defined
  for the secondary path.

>

secondary-paths:

> A YANG container that holds the set of secondary paths. A secondary path is
 identified by 'name'. A secondary path can be referenced from the TE Tunnel's
'candidate-secondary-path' list.

secondary-reverse-paths:

> A YANG container that holds the set of secondary reverse paths. A secondary reverse
path is identified by 'name'. A secondary reverse path can be referenced from the
TE Tunnel's 'candidate-secondary-reverse-paths' list. A secondary reverse path is modeled with
the same data attributes as those of the primary path.

The following set of common path attributes are shared for primary (forward and reverse) and secondary paths:

path-computation-method:

> A YANG leaf that specifies the method used for computing the TE path.

path-computation-server:

> A YANG container that holds the path computation server properties when the path is
 externally queried.

compute-only:

> A path of a TE Tunnel is, by default, provisioned so that it can be instantiated
  in the forwarding plane so that it can carry traffic.
  In some cases, a TE path may be configured only for the
  purpose of computing a path and reporting it without the need to instantiate
  the LSP or commit any resources. In such a case, the path is configured in
  'compute-only' mode to distinguish it from the default behavior. A
  'compute-only' path is configured as usual with the associated per-path
  constraints and properties on a device or TE controller. The device or TE
  controller computes the feasible paths subject to configured constraints.
  A client may query the 'compute-only' computed path properties 'on-demand',
  or alternatively, can subscribe to be notified of computed paths and
  whenever the path properties change.


use-path-computation:

> A YANG leaf that indicates whether or not path computation is to
  be used for a specified path.

lockdown:

> A YANG leaf that when set indicates the existing path should not
> be globally repaired or reoptimized.

path-scope:

> A YANG leaf that specifies whether the path is a segment or an end-to-end path.

preference:

> A YANG leaf that specifies the preference for the path, used to
choose between paths in a list.  The lower the number, the higher the
preference. Paths with the same preference are treated as equal
and other methods are used to choose between them.

k-requested-paths:

> A YANG leaf that specifies the number of k-shortest-paths requested from the path
computation server and returned sorted by its optimization
objective.

association-objects:

> A YANG container that holds a list of tunnel association properties.

optimizations:

> A YANG container that holds the optimization objectives
  that path computation will use to select a path.

named-path-constraint:

> A YANG leafref that references an entry from the global list of named path constraints.


te-bandwidth:

> A YANG container that holds the path bandwidth (see {{I-D.draft-ietf-teas-rfc8776-update}}).

link-protection:

> A YANG leaf that specifies the link protection type required for the links to
be included in the computed path (see {{I-D.draft-ietf-teas-rfc8776-update}}).

setup/hold-priority:

> see description provided in {{TeGlobals}}. These values override
those provided in the referenced named-path-constraint.

signaling-type:

> see description provided in {{TeGlobals}}. This value overrides
the provided one in the referenced named-path-constraint.

path-metric-bounds:

> see description provided in {{TeGlobals}}. These values override
those provided in the referenced named-path-constraint.

path-affinities-values:

> see description provided in {{TeGlobals}}. These values override
those provided in the referenced named-path-constraint.

path-affinity-names:

> see description provided in {{TeGlobals}}. These values override
those provided in the referenced named-path-constraint.

path-srlgs-lists:

> see description provided in {{TeGlobals}}. These values override
those provided in the referenced named-path-constraint.

path-srlgs-names:

> see description provided in {{TeGlobals}}. These values override
those provided in the referenced named-path-constraint.

disjointness:

> see description provided in {{TeGlobals}}. These values override
those provided in the referenced named-path-constraint.

explicit-route-objects:

> see description provided in {{TeGlobals}}. These values override
those provided in the referenced named-path-constraint.

path-in-segment:

> see description provided in {{TeGlobals}}. These values override
those provided in the referenced named-path-constraint.

path-out-segment:

> see description provided in {{TeGlobals}}. These values override
those provided in the referenced named-path-constraint.

computed-paths-properties:

> A YANG container that holds properties for the list of computed paths.

computed-path-error-infos:

> A YANG container that holds the list of path computation error information. The
> TE system populates entries in this list whenever an error is encountered during the computation of the TE path.

path-compute-info:

> A YANG grouping that contains leafs representing the path attributes that are passed to the TE path computation engine
> to be considered during the path computation. This includes:
>
>  - path constraints,
>  - path optimization objectives, and
>  - path associations
>
> Note, unless overridden under a specific path of the TE tunnel, the TE tunnel's primary path constraints, optimization objectives, and associations are inherited by the primary reverse path, secondary path and secondary reverse path.

lsps:

> A YANG container that holds a list of LSPs that have been instantiated for this specific path.

In addition to the path common attributes, the primary path has the following
attributes that are not present in the secondary path:

- Only the primary path contains the list of 'candidate-secondary-paths' that
  can protect the primary path.

- Only the primary path can contain a primary-reverse-path associated with the
  primary path (and its associated list of
  'candidate-secondary-reverse-path').

lsp-provisioning-error-infos:

> A YANG container that holds the list of LSP provisioning error information. The
> TE system populates entries in this list whenever an error is encountered during the LSP provisioning.

### TE LSPs {#TE_LSPS}

The 'lsps' container includes the set of TE LSPs that have been instantiated.
A TE LSP is identified by a 3-tuple ('tunnel-name', 'lsp-id', 'node').

When the model is used to manage a specific device, the 'lsps' list contains all TE
LSPs that traverse the device (including ingressing, transiting and egressing the device).

When the model is used to manage a TE controller, the 'lsps' list
contains the TE LSPs on devices managed by the controller that act as ingress, and may optionally include
TE LSPs on devices managed by the controller that act as transit or egress role.

## Tree Diagram

{{fig-te-tree}} shows the tree diagram of depth=4 for the generic TE YANG data model defined in
the 'ietf-te' module. The full tree diagram is shown in {{AppendixB}}.

~~~~~~~~~~~
{::include ../../te/ietf-te-02.tree}
~~~~~~~~~~~
{: #fig-te-tree title="Tree diagram of depth-4 of TE Tunnel YANG data model"}


## YANG Module

The generic TE YANG module 'ietf-te' imports the following modules:

- ietf-te-types defined in {{!I-D.draft-ietf-teas-rfc8776-update}}
- ietf-yang-types and ietf-inet-types defined in {{!RFC6991}}
- ietf-network and ietf-network-topology defined in {{!RFC8345}}

This module references the following documents:
{{!RFC4206}}, {{!RFC4427}},
{{!RFC4872}}, {{!RFC3209}}, {{!RFC6780}},
{{!RFC7471}}, {{!RFC9012}}, {{!RFC8570}},
{{!RFC8232}}, {{!RFC7271}}, {{!RFC8234}}, {{!RFC7308}}, and {{ITU_G.808.1}}.

~~~~~~~~~~
<CODE BEGINS> file "ietf-te@2025-10-06.yang"
{::include ../../te/ietf-te.yang}
<CODE ENDS>
~~~~~~~~~~

# TE Device YANG Model

The device TE YANG module 'ietf-te-device' models data that is specific to
managing a TE device.  This module augments the generic TE YANG module.

## Module Structure

The 'ietf-te-device' modufle defines the configuration and operational state data
that is specific to the device, including those related to the TE subsystem, tunnels, LSPs, and interfaces.

### TE Device Globals, Tunnels and LSPs

The 'ietf-te-device' module augments the generic 'ietf-te' module at the
'globals', 'tunnels', and 'lsps' levels to include the device-specific
configurations and operational state.

{{fig-if-te-01}} shows the
'ietf-te-device' subtree generated with depth=4 that describes those
augmentations.

~~~~~~~~~~~
{::include ../../te/ietf-te-dev-01.tree}
~~~~~~~~~~~
{: #fig-if-te-01 title="TE Device Augmentations to Globals, Tunnels, and LSPs YANG Subtree"}

The following is the description of the augmented data at each level.

Global Timers (Augmenting /te:te/te:globals):

These are device-specific global configuration parameters related to LSP timers, applied system-wide.

lsp-install-interval
:
: An optional leaf that specifies the delay time, in seconds, before a newly provisioned LSP is installed into the forwarding plane to carry traffic.

lsp-cleanup-interval
:
: An optional leaf that specifies the delay time, in seconds, before an LSP is completely removed from the system after it is no longer in use.

lsp-invalidation-interval
:
: An optional leaf that specifies the delay time, in seconds, during which a TE LSP's path is considered invalid before any corrective action is taken.

Tunnel Device-Dependent Attributes (Augmenting /te:te/te:tunnels/te:tunnel).

These are device-specific configuration parameters that apply to individual TE Tunnels:

path-invalidation-action
:
: An optional identityref that specifies the action to be taken when a TE Tunnel's path is deemed invalid (e.g., tear down, recompute).

lsp-install-interval
:
: An optional leaf that specifies the delay time, in seconds, for this specific TE Tunnel before its LSPs are installed into the forwarding plane. This value can override the global lsp-install-interval.

lsp-cleanup-interval
:
: An optional leaf that specifies the delay time, in seconds, for this specific TE Tunnel before its LSPs are cleaned up. This value can override the global lsp-cleanup-interval.

lsp-invalidation-interval
:
: An optional leaf that specifies the delay time, in seconds, for this specific TE Tunnel during which its path is considered invalid before action is taken. This value can override the global lsp-invalidation-interval.

LSP Device-Dependent State (Augmenting /te:te/te:lsps/te:lsp).

These are read-only operational state parameters providing device-specific details for individual LSPs:

lsp-timers
:
: A container that holds various timer-related operational state for an LSP, applicable primarily to ingress LSPs.

uptime
:
: An optional leaf that indicates the total time, in seconds, that the LSP has been operational.

time-to-install
:
: An optional leaf that indicates the remaining time, in seconds, for a new LSP to be fully instantiated and ready to carry traffic.

time-to-destroy
:
: An optional leaf that indicates the remaining time, in seconds, before an existing LSP is torn down.

downstream-info
:
: A container that holds information about the downstream neighbor and label for the LSP, applicable when the LSP is not at its egress.

upstream-info
:
: A container that holds information about the upstream neighbor and label for the LSP, applicable when the LSP is not at its ingress.

### TE Device Interfaces

{{fig-if-te-02}} shows the TE interface subtree from the TE device module 'ietf-te-device' with depth=4.
The full tree diagram is shown in {{AppendixB}}.

~~~~~~~~~~~
{::include ../../te/ietf-te-dev-02.tree}
~~~~~~~~~~~
{: #fig-if-te-02 title="TE interfaces YANG subtree from the TE device YANG data model"}


The main elements under the interfaces container are:

threshold-type:

> An optional enumeration that specifies the type of thresholding mechanism used for flooding bandwidth updates for all TE interfaces on the device. Options include 'delta' (flooding on a change greater than a specified delta) or 'threshold-crossed' (flooding when bandwidth crosses a defined threshold).

delta-percentage:

> An optional percentage value, used when threshold-type is 'delta', indicating the change in reservable bandwidth that triggers an IGP update for all TE interfaces.

threshold-specification:

> An optional enumeration, used when threshold-type is 'threshold-crossed', to define whether a single set of 'mirrored-up-down' thresholds or separate 'separate-up-down' thresholds are used for increasing and decreasing bandwidth. This applies globally to all TE interfaces.

up-thresholds:

> A list of percentage values, used with 'separate-up-down' thresholding, that define the points at which bandwidth updates are triggered when the reservable bandwidth is increasing across all TE interfaces.

down-thresholds:

>  A list of percentage values, used with 'separate-up-down' thresholding, that define the points at which bandwidth updates are triggered when the reservable bandwidth is decreasing across all TE interfaces.

up-down-thresholds:

> A list of percentage values, used with 'mirrored-up-down' thresholding, that define the points at which bandwidth updates are triggered for both increasing and decreasing reservable bandwidth across all TE interfaces.

interface:

> A list of individual TE interfaces configured on the device. Each entry represents a network interface enabled for Traffic Engineering and contains its specific attributes and state. A TE interface is identified by the 'name' leaf, which references an existing network interface on the device.


> name:

>> A leaf that uniquely identifies the TE interface, referencing an existing network interface.

> te-metric:

>> An optional leaf that holds the TE metric value associated with this specific interface, used during path computation.

>admin-group-type:

>> A choice node that allows configuring administrative groups for the interface using either direct values or named references.

> value-admin-groups:

>> A choice for defining administrative groups using direct bitmask values.

> named-admin-groups:

>> A list of named administrative groups applied to this TE interface, referencing globally defined named administrative groups.

> srlg-type:

>> A choice node that allows configuring Shared Risk Link Groups (SRLGs) for the interface using either direct values or named references.

>> value-srlgs:

>>> A list of direct SRLG values that this link is a part of.

>> named-srlgs:

>>> A list of named SRLGs applied to this interface, referencing globally defined named SRLGs.

> threshold-type:

>> An optional enumeration, similar to the global threshold-type, but specifically for this individual TE interface, allowing per-interface override of the global bandwidth flooding behavior.

> delta-percentage:

>> An optional percentage value, specific to this interface, used when its threshold-type is 'delta'.

> threshold-specification:

>> An optional enumeration, specific to this interface, used when its threshold-type is 'threshold-crossed'.

> up-thresholds:

>> A list of percentage values, specific to this interface, used with 'separate-up-down' thresholding for increasing bandwidth.

> down-thresholds:

>> A list of percentage values, specific to this interface, used with 'separate-up-down' thresholding for decreasing bandwidth.

> up-down-thresholds:

>> A list of percentage values, specific to this interface, used with 'mirrored-up-down' thresholding for both increasing and decreasing bandwidth.

> switching-capabilities:

>> A list of switching capabilities supported by this interface.

>> switching-capability:

>>> An identityref indicating a specific switching capability (e.g., Packet, Lambda, Fiber).

>> encoding:

>>> An optional identityref indicating the LSP encoding type supported by this capability on the interface.

> te-advertisements-state:

>> A read-only container that provides operational state information related to how this TE interface's attributes are advertised.

>> flood-interval:

>>> An optional leaf indicating the configured periodic flooding interval for this interface.

>> last-flooded-time:

>>> An optional leaf showing the time elapsed since the last advertisement flood for this interface.

>> next-flooded-time:

>>> An optional leaf showing the time remaining until the next scheduled advertisement flood for this interface.

>> last-flooded-trigger:

>>> An optional enumeration indicating the event that triggered the last advertisement flood (e.g., link-up, bandwidth-change, periodic-timer).

>> advertised-level-areas:

>>> A list of IGP level-areas in which this TE interface's link state information is advertised.


## Tree Diagram

{{fig-te-dev-tree}} shows the tree diagram of the device TE YANG data model defined in
the 'ietf-te-device' module.

~~~~~~~~~~~
{::include ../../te/ietf-te-dev.tree}
~~~~~~~~~~~
{: #fig-te-dev-tree title="TE Tunnel device model YANG tree diagram"}


## YANG Module

The 'ietf-te-device' module imports the following modules:

- ietf-interfaces defined in {{!RFC8343}}
- ietf-routing-types defined in {{!RFC8294}}
- ietf-te-types defined in {{!I-D.draft-ietf-teas-rfc8776-update}}
- ietf-te defined in this document

~~~~~~~~~~
<CODE BEGINS> file "ietf-te-device@2025-10-06.yang"
{::include ../../te/ietf-te-device.yang}
<CODE ENDS>
~~~~~~~~~~

# Notifications

Notifications are a key component of any topology data model.

{{!RFC8639}} and {{!RFC8641}} define a subscription mechanism and a push
mechanism for YANG datastores.  These mechanisms currently allow the
user to:

*  Subscribe to notifications on a per-client basis.

*  Specify subtree filters or XML Path Language (XPath) filters so
   that only contents of interest will be sent.

*  Specify either periodic or on-demand notifications.

# IANA Considerations

This document registers the following URIs in the IETF XML registry
{{!RFC3688}}.
Following the format in {{RFC3688}}, the following registrations are
requested to be made.

~~~~
   URI: urn:ietf:params:xml:ns:yang:ietf-te
   Registrant Contact:  The IESG.
   XML: N/A, the requested URI is an XML namespace.

   URI: urn:ietf:params:xml:ns:yang:ietf-te-device
   Registrant Contact:  The IESG.
   XML: N/A, the requested URI is an XML namespace.
~~~~

This document registers two YANG modules in the YANG Module Names
registry {{RFC6020}}.

~~~~
   Name:       ietf-te
   Namespace:  urn:ietf:params:xml:ns:yang:ietf-te
   Prefix:     te
   Reference:  RFCXXXX

   Name:       ietf-te-device
   Namespace:  urn:ietf:params:xml:ns:yang:ietf-te-device
   Prefix:     te-device
   Reference:  RFCXXXX
~~~~

# Security Considerations

The YANG module specified in this document defines a schema for data that is
designed to be accessed via network management protocols such as NETCONF
{{!RFC6241}} or RESTCONF {{!RFC8040}}. The lowest NETCONF layer is the secure
transport layer, and the mandatory-to-implement secure transport is Secure
Shell (SSH) {{!RFC6242}}. The lowest RESTCONF layer is HTTPS, and the
mandatory-to-implement secure transport is TLS {{!RFC8446}}.

The Network Configuration Access Control Model (NACM) {{!RFC8341}} provides the
means to restrict access for particular NETCONF or RESTCONF users to a
preconfigured subset of all available NETCONF or RESTCONF protocol operations
and content.

There are a number of data nodes defined in this YANG module that are
writable/creatable/deletable (i.e., config true, which is the default). These
data nodes may be considered sensitive or vulnerable in some network
environments. Write operations (e.g., edit-config) to these data nodes without
proper protection can have a negative effect on network operations. These are
the subtrees and data nodes and their sensitivity/vulnerability:

"/te/globals":  This module specifies the global TE configurations on a device.
Unauthorized access to this container could cause the device to ignore packets
it should receive and process.

"/te/tunnels":  This list specifies the configuration and state of TE Tunnels
present on the device or controller.  Unauthorized access to this list could
cause the device to ignore packets it should receive and process. An attacker
may also use state to derive information about the network topology,
and subsequently orchestrate further attacks.

"/te/interfaces":  This list specifies the configuration and state TE interfaces
on a device. Unauthorized access to this list could cause the device to ignore packets it
should receive and process.

Some of the readable data nodes in this YANG module may be considered sensitive
or vulnerable in some network environments. It is thus important to control
read access (e.g., via get, get-config, or notification) to these data nodes.
These are the subtrees and data nodes and their sensitivity/vulnerability:

"/te/lsps": this list contains information state about established LSPs in the network.
An attacker can use this information to derive information about the network topology,
and subsequently orchestrate further attacks.

Some of the RPC operations in this YANG module may be considered sensitive or
vulnerable in some network environments. It is thus important to control access
to these operations. These are the operations and their
sensitivity/vulnerability:

"/te/tunnels-actions": using this RPC, an attacker can modify existing paths that
may be carrying live traffic, and hence result in interruption to services
carried over the network.

"/te/tunnels-path-compute": using this RPC, an attacker can retrieve sensitive
information about the network provider which can be used to orchestrate further
attacks.

The security considerations spelled out in the YANG 1.1 specification
{{!RFC7950}} apply for this document as well.

# Acknowledgement

The authors would like to thank the  members of the multi-vendor YANG design
team who are involved in the definition of this model.

The authors would like to thank Tom Petch and Adrian Farrel for reviewing and
providing useful feedback about the document. The authors would also like to
thank Loa Andersson, Lou Berger, Sergio Belotti, Italo Busi, Carlo Perocchio,
Francesco Lazzeri, Aihua Guo, Dhruv Dhody, and Raqib Jones for providing
feedback on this document.

# Contributors

~~~~

   Oscar Gonzalez de Dios
   Telefonica

   Email: oscar.gonzalezdedios@telefonica.com

   Himanshu Shah
   Ciena

   Email: hshah@ciena.com


   Xia Chen
   Huawei Technologies

   Email: jescia.chenxia@huawei.com


   Bin Wen
   Comcast

   Email: Bin_Wen@cable.comcast.com

~~~~

--- back

# Data Tree Examples {#AppendixA}

This section contains examples of use of the model with RESTCONF {{RFC8040}} and JSON encoding.

For the example we will use a 4-node MPLS network were RSVP-TE MPLS Tunnels can be setup. The
loopbacks of each router are shown. The network in {{AppFig-Topo}} will be used in the examples
described in the following sections.

~~~

 192.0.2.1        192.0.2.2      192.0.2.4
 +-------+        +-------+      +-------+
 |       |        |       |      |       |
 |   A   +--------+   B   +------+   D   |
 +---+---+        +-------+      +---+---+
     |                               |
     |            +-------+          |
     |            |       |          |
     +------------+   C   +----------+
                  |       |
                  +-------+
                  192.0.2.3
~~~
{: #AppFig-Topo title="TE network used in data tree examples"}


## Basic Tunnel Setup {#TeTunnel}

This example uses the TE Tunnel YANG data model defined in this document to create an
RSVP-TE signaled Tunnel of packet LSP encoding type. First, the TE Tunnel is created with no specific restrictions or constraints (e.g., protection or restoration).
The TE Tunnel ingresses on router A and egresses on router D.

In this case, the TE Tunnel is created without specifying additional information about the primary paths.

~~~
POST /restconf/data/ietf-te:te/tunnels HTTP/1.1
    Host: example.com
    Accept: application/yang-data+json
    Content-Type: application/yang-data+json

{
  "ietf-te:tunnel": [
    {
      "name": "Example_LSP_Tunnel_A_2",
      "admin-state": "ietf-te-types:tunnel-admin-state-up",
      "encoding": "ietf-te-types:lsp-encoding-packet",
      "source": {
        "te-node-id": "192.0.2.1"
      },
      "destination": {
        "te-node-id": "192.0.2.4"
      },
      "bidirectional": false,
      "signaling-type": "ietf-te-types:path-setup-rsvp"
    }
  ]
}

{
  "ietf-te:tunnel": [
    {
      "name": "Example_LSP_Tunnel_A_2 (IPv6)",
      "admin-state": "ietf-te-types:tunnel-admin-state-up",
      "encoding": "ietf-te-types:lsp-encoding-packet",
      "source": {
        "te-node-id": "2001:db8::1"
      },
      "destination": {
        "te-node-id": "2001:db8::4"
      },
      "bidirectional": false,
      "signaling-type": "ietf-te-types:path-setup-rsvp"
    }
  ]
}

~~~

## Global Named Path Constraints

This example uses the YANG data model to create a 'named path constraint' that can be referenced by TE Tunnels.
The path constraint, in this case, limits the TE Tunnel hops for the computed path.

~~~
POST /restconf/data/ietf-te:te/globals/named-path-constraints
     HTTP/1.1
    Host: example.com
    Accept: application/yang-data+json
    Content-Type: application/yang-data+json

{
  "ietf-te:named-path-constraint": [
    {
      "name": "max-hop-3",
      "path-metric-bounds": {
        "path-metric-bound": [
          {
            "metric-type": "ietf-te-types:path-metric-hop",
            "upper-bound": "3"
          }
        ]
      }
    }
  ]
}
~~~

## Tunnel with Global Path Constraint

In this example, the previously created 'named path constraint' is applied to the TE Tunnel created in {{TeTunnel}}.

~~~
POST /restconf/data/ietf-te:te/tunnels HTTP/1.1
    Host: example.com
    Accept: application/yang-data+json
    Content-Type: application/yang-data+json

{
  "ietf-te:tunnel": [
    {
      "name": "Example_LSP_Tunnel_A_4_1",
      "description": "Simple_LSP_with_named_path",
      "admin-state": "ietf-te-types:tunnel-admin-state-up",
      "encoding": "ietf-te-types:lsp-encoding-packet",
      "source": {
        "te-node-id": "192.0.2.1"
      },
      "destination": {
        "te-node-id": "192.0.2.4"
      },
      "signaling-type": "ietf-te-types:path-setup-rsvp",
      "primary-paths": {
        "primary-path": [
          {
            "name": "Simple_LSP_1",
            "use-path-computation": true,
            "path-scope": "ietf-te-types:path-scope-end-to-end",
            "named-path-constraint": "max-hop-3"
          }
        ]
      }
    }
  ]
}
~~~

## Tunnel with Per-tunnel Path Constraint

In this example, the a per-tunnel path constraint is explicitly indicated under the TE Tunnel created in {{TeTunnel}} to constrain the computed path for the tunnel.

~~~
POST /restconf/data/ietf-te:te/tunnels HTTP/1.1
    Host: example.com
    Accept: application/yang-data+json
    Content-Type: application/yang-data+json

{
  "ietf-te:tunnel": [
    {
      "name": "Example_LSP_Tunnel_A_4_2",
      "admin-state": "ietf-te-types:tunnel-admin-state-up",
      "encoding": "ietf-te-types:lsp-encoding-packet",
      "source": {
        "te-node-id": "192.0.2.1"
      },
      "destination": {
        "te-node-id": "192.0.2.4"
      },
      "bidirectional": false,
      "signaling-type": "ietf-te-types:path-setup-rsvp",
      "primary-paths": {
        "primary-path": [
          {
            "name": "path1",
            "path-scope": "ietf-te-types:path-scope-end-to-end",
            "path-metric-bounds": {
              "path-metric-bound": [
                {
                  "metric-type": "ietf-te-types:path-metric-hop",
                  "upper-bound": "3"
                }
              ]
            }
          }
        ]
      }
    }
  ]
}
~~~

## Tunnel State

In this example, the 'GET' query is sent to return the state stored about the tunnel.

~~~
GET  /restconf/data/ietf-te:te/tunnels +
     /tunnel="Example_LSP_Tunnel_A_4_1"
     /primary-paths/ HTTP/1.1
    Host: example.com
    Accept: application/yang-data+json
~~~~

The request, with status code 200 would include, for example, the following json:

~~~
{
  "ietf-te:primary-path": [
    {
      "name": "path1",
      "path-computation-method": "ietf-te-types:path-locally-computed",
      "path-scope": "ietf-te-types:path-scope-end-to-end",
      "computed-paths-properties": {
        "computed-path-properties": [
          {
            "k-index": 1,
            "path-properties": {
              "path-route-objects": {
                "path-route-object": [
                  {
                    "index": 1,
                    "numbered-node-hop": {
                      "node-id": "192.0.2.2",
                      "hop-type": "strict"
                    }
                  },
                  {
                    "index": 2,
                    "numbered-node-hop": {
                      "node-id": "192.0.2.4",
                      "hop-type": "strict"
                    }
                  }
                ]
              }
            }
          }
        ]
      },
      "lsps": {
        "lsp": [
          {
            "node": "192.0.2.1",
            "lsp-id": 25356,
            "tunnel-name": "Example_LSP_Tunnel_A_4_1"
          }
        ]
      }
    }
  ]
}
~~~

## Example TE Tunnel with Primary and Secondary Paths

~~~
                       +----------+          +----------+
                     +-|192.0.2.9 |---+      |192.0.2.10|
                     | +----------+   |      +----------+
                     |                |          |   |
+----------+    +----------+     +----------+    |   |
|192.0.2.8 |----|192.0.2.3 |-----|192.0.2.4 |----+   |
+----------+    +----------+     +----------+        |
  |                  |                |              |
+----------+         |                |              |
|192.0.2.1 |---------+                |           +----------+
+----------+                          +-----------|192.0.2.5 |
      |  |                                        +----------+
      |  |              +----------+                     | |
      |  +--------------|192.0.2.2 |---------------------+ |
      |                 +----------+                       |
      |                       | |                          |
  +----------+                | |                   +----------+
  |192.0.2.6 |----------------+ +-------------------|192.0.2.7 |
  +----------+                                      +----------+

~~~
{: #AppFig-Topo2 title="TE network used in data tree examples"}

Below is the state retrieved for a TE tunnel from source 192.0.2.1 to 192.0.2.5
with primary, secondary, reverse, and secondary reverse paths as shown in {{AppFig-Topo2}}.

~~~
{
  "ietf-te:te": {
    "tunnels": {
      "tunnel": [
        {
          "name": "example-1",
          "description": "Example in slide 1",
          "source": {
            "te-node-id": "192.0.2.1"
          },
          "destination": {
            "te-node-id": "192.0.2.5"
          },
          "bidirectional": true,
          "primary-paths": {
            "primary-path": [
              {
                "name": "primary-1 (fwd)",
                "path-scope": "ietf-te-types:path-scope-end-to-end",
                "co-routed": false,
                "explicit-route-objects": {
                  "route-object-include-exclude": [
                    {
                      "index": 1,
                      "explicit-route-usage":
                        "ietf-te-types:route-include-object",
                      "numbered-node-hop": {
                        "node-id": "192.0.2.2",
                        "hop-type": "loose"
                      }
                    }
                  ]
                },
                "primary-reverse-path": {
                  "name": "primary-2 (rev)",
                  "path-scope": "ietf-te-types:path-scope-end-to-end",
                  "explicit-route-objects": {
                    "route-object-include-exclude": [
                      {
                        "index": 1,
                        "explicit-route-usage":
                          "ietf-te-types:route-include-object",
                        "numbered-node-hop": {
                          "node-id": "192.0.2.3",
                          "hop-type": "loose"
                        }
                      }
                    ]
                  },
                  "candidate-secondary-reverse-paths": {
                    "candidate-secondary-reverse-path": [
                      {
                        "secondary-reverse-path": "secondary-3 (rev)"
                      },
                      {
                        "secondary-reverse-path": "secondary-4 (rev)"
                      },
                      {
                        "secondary-reverse-path": "secondary-5 (rev)"
                      }
                    ]
                  }
                },
                "candidate-secondary-paths": {
                  "candidate-secondary-path": [
                    {
                      "secondary-path": "secondary-1 (fwd)"
                    },
                    {
                      "secondary-path": "secondary-2 (fwd)"
                    }
                  ]
                }
              }
            ]
          },
          "secondary-paths": {
            "secondary-path": [
              {
                "name": "secondary-1 (fwd)",
                "path-scope": "ietf-te-types:path-scope-end-to-end",
                "explicit-route-objects": {
                  "route-object-include-exclude": [
                    {
                      "index": 1,
                      "explicit-route-usage":
                        "ietf-te-types:route-include-object",
                      "numbered-node-hop": {
                        "node-id": "192.0.2.1"
                      }
                    },
                    {
                      "index": 2,
                      "numbered-node-hop": {
                        "node-id": "192.0.2.2",
                        "hop-type": "loose"
                      }
                    }
                  ]
                }
              },
              {
                "name": "secondary-2 (fwd)",
                "path-scope": "ietf-te-types:path-scope-end-to-end",
                "explicit-route-objects": {
                  "route-object-include-exclude": [
                    {
                      "index": 1,
                      "explicit-route-usage": 
                        "ietf-te-types:route-include-object",
                      "numbered-node-hop": {
                        "node-id": "192.0.2.2"
                      }
                    },
                    {
                      "index": 2,
                      "numbered-node-hop": {
                        "node-id": "192.0.2.5",
                        "hop-type": "loose"
                      }
                    }
                  ]
                }
              }
            ]
          },
          "secondary-reverse-paths": {
            "secondary-reverse-path": [
              {
                "name": "secondary-3 (rev)",
                "path-scope": "ietf-te-types:path-scope-end-to-end",
                "explicit-route-objects": {
                  "route-object-include-exclude": [
                    {
                      "index": 1,
                      "explicit-route-usage":
                        "ietf-te-types:route-include-object",
                      "numbered-node-hop": {
                        "node-id": "192.0.2.5"
                      }
                    },
                    {
                      "index": 2,
                      "numbered-node-hop": {
                        "node-id": "192.0.2.4",
                        "hop-type": "loose"
                      }
                    }
                  ]
                }
              },
              {
                "name": "secondary-4 (rev)",
                "path-scope": "ietf-te-types:path-scope-end-to-end",
                "explicit-route-objects": {
                  "route-object-include-exclude": [
                    {
                      "index": 1,
                      "explicit-route-usage":
                        "ietf-te-types:route-include-object",
                      "numbered-node-hop": {
                        "node-id": "192.0.2.4"
                      }
                    },
                    {
                      "index": 2,
                      "numbered-node-hop": {
                        "node-id": "192.0.2.3",
                        "hop-type": "loose"
                      }
                    }
                  ]
                }
              },
              {
                "name": "secondary-5 (rev)",
                "path-scope": "ietf-te-types:path-scope-end-to-end",
                "explicit-route-objects": {
                  "route-object-include-exclude": [
                    {
                      "index": 1,
                      "explicit-route-usage":
                        "ietf-te-types:route-include-object",
                      "numbered-node-hop": {
                        "node-id": "192.0.2.3"
                      }
                    },
                    {
                      "index": 2,
                      "numbered-node-hop": {
                        "node-id": "192.0.2.1",
                        "hop-type": "loose"
                      }
                    }
                  ]
                }
              }
            ]
          }
        },
        {
          "name": "example-3",
          "description": "Example in slide 3",
          "source": {
            "te-node-id": "192.0.2.1"
          },
          "destination": {
            "te-node-id": "192.0.2.5"
          },
          "bidirectional": true,
          "primary-paths": {
            "primary-path": [
              {
                "name": "primary-1 (bidir)",
                "path-scope": "ietf-te-types:path-scope-end-to-end",
                "co-routed": true,
                "explicit-route-objects": {
                  "route-object-include-exclude": [
                    {
                      "index": 1,
                      "explicit-route-usage":
                        "ietf-te-types:route-include-object",
                      "numbered-node-hop": {
                        "node-id": "192.0.2.2",
                        "hop-type": "loose"
                      }
                    }
                  ]
                },
                "primary-reverse-path": {
                  "path-scope": "ietf-te-types:path-scope-end-to-end"
                },
                "candidate-secondary-paths": {
                  "candidate-secondary-path": [
                    {
                      "secondary-path": "secondary-1 (bidir)"
                    },
                    {
                      "secondary-path": "secondary-2 (bidir)"
                    }
                  ]
                }
              }
            ]
          },
          "secondary-paths": {
            "secondary-path": [
              {
                "name": "secondary-1 (bidir)",
                "path-scope": "ietf-te-types:path-scope-end-to-end",
                "explicit-route-objects": {
                  "route-object-include-exclude": [
                    {
                      "index": 1,
                      "explicit-route-usage":
                        "ietf-te-types:route-include-object",
                      "numbered-node-hop": {
                        "node-id": "192.0.2.1"
                      }
                    },
                    {
                      "index": 2,
                      "numbered-node-hop": {
                        "node-id": "192.0.2.2",
                        "hop-type": "loose"
                      }
                    }
                  ]
                }
              },
              {
                "name": "secondary-2 (bidir)",
                "path-scope": "ietf-te-types:path-scope-end-to-end",
                "explicit-route-objects": {
                  "route-object-include-exclude": [
                    {
                      "index": 1,
                      "explicit-route-usage":
                        "ietf-te-types:route-include-object",
                      "numbered-node-hop": {
                        "node-id": "192.0.2.2"
                      }
                    },
                    {
                      "index": 2,
                      "numbered-node-hop": {
                        "node-id": "192.0.2.5",
                        "hop-type": "loose"
                      }
                    }
                  ]
                }
              }
            ]
          }
        },
        {
          "name": "example-4",
          "description": "Example in slide 4",
          "source": {
            "te-node-id": "192.0.2.1"
          },
          "destination": {
            "te-node-id": "192.0.2.5"
          },
          "bidirectional": true,
          "primary-paths": {
            "primary-path": [
              {
                "name": "primary-1 (fwd)",
                "path-scope": "ietf-te-types:path-scope-end-to-end",
                "co-routed": true,
                "explicit-route-objects": {
                  "route-object-include-exclude": [
                    {
                      "index": 1,
                      "explicit-route-usage":
                        "ietf-te-types:route-include-object",
                      "numbered-node-hop": {
                        "node-id": "192.0.2.2",
                        "hop-type": "loose"
                      }
                    }
                  ]
                },
                "primary-reverse-path": {
                  "name": "primary-2 (rev)",
                  "path-scope": "ietf-te-types:path-scope-end-to-end",
                  "candidate-secondary-reverse-paths": {
                    "candidate-secondary-reverse-path": [
                      {
                        "secondary-reverse-path": "secondary-3 (rev)"
                      },
                      {
                        "secondary-reverse-path": "secondary-4 (rev)"
                      }
                    ]
                  }
                },
                "candidate-secondary-paths": {
                  "candidate-secondary-path": [
                    {
                      "secondary-path": "secondary-1 (fwd)"
                    },
                    {
                      "secondary-path": "secondary-2 (fwd)"
                    }
                  ]
                }
              }
            ]
          },
          "secondary-paths": {
            "secondary-path": [
              {
                "name": "secondary-1 (fwd)",
                "path-scope": "ietf-te-types:path-scope-end-to-end",
                "explicit-route-objects": {
                  "route-object-include-exclude": [
                    {
                      "index": 1,
                      "explicit-route-usage":
                        "ietf-te-types:route-include-object",
                      "numbered-node-hop": {
                        "node-id": "192.0.2.1"
                      }
                    },
                    {
                      "index": 2,
                      "numbered-node-hop": {
                        "node-id": "192.0.2.2",
                        "hop-type": "loose"
                      }
                    }
                  ]
                }
              },
              {
                "name": "secondary-2 (fwd)",
                "path-scope": "ietf-te-types:path-scope-end-to-end",
                "explicit-route-objects": {
                  "route-object-include-exclude": [
                    {
                      "index": 1,
                      "explicit-route-usage":
                        "ietf-te-types:route-include-object",
                      "numbered-node-hop": {
                        "node-id": "192.0.2.2"
                      }
                    },
                    {
                      "index": 2,
                      "numbered-node-hop": {
                        "node-id": "192.0.2.5",
                        "hop-type": "loose"
                      }
                    }
                  ]
                }
              }
            ]
          },
          "secondary-reverse-paths": {
            "secondary-reverse-path": [
              {
                "name": "secondary-3 (rev)",
                "path-scope": "ietf-te-types:path-scope-end-to-end"
              },
              {
                "name": "secondary-4 (rev)",
                "path-scope": "ietf-te-types:path-scope-end-to-end"
              }
            ]
          }
        }
      ]
    }
  }
}
~~~


## Example Multi-domain TE Tunnel with Primary and Secondary Paths

~~~
                2  +------------+  3               
                /--|  Domain 2  |--\               
        1  /----   +------------+   ---\ 4         
+------------+                        +------------+
|  Domain 1  |                        |  Domain 3  |
+------------+                        +------------+
        5  \---    +------------+   ---/ 8         
                \--|  Domain 4  |--/               
                6  +------------+  7               
~~~
{: #AppFig-Topo3 title="TE network used in the multi-domain TE Tunnel example"}

The following state is retrieved for a multi-domain TE tunnel, where both the
primary and secondary paths consist of TE tunnel segments, as shown in {{AppFig-Topo3}}.
 In each domain, a TE tunnel segment is established to form the complete end-to-end TE path.

~~~
{
  "ietf-te:te": {
    "tunnels": {
      "tunnel": [
        {
          "name": "Example_Head_End_Tunnel_Segment",
          "admin-state": "ietf-te-types:tunnel-admin-state-up",
          "encoding": "ietf-te-types:lsp-encoding-packet",
          "source": {
            "te-node-id": "192.0.2.100"
          },
          "bidirectional": true,
          "signaling-type": "ietf-te-types:path-setup-rsvp",
          "primary-paths": {
            "primary-path": [
              {
                "name": "primary-path-1",
                "path-scope": "ietf-te-types:path-scope-end-to-end",
                "co-routed": true,
                "explicit-route-objects": {
                  "route-object-include-exclude": [
                    {
                      "index": 1,
                      "explicit-route-usage": "ietf-te-types:route-include-object",
                      "numbered-link-hop": {
                        "link-tp-id": "192.0.2.1"
                      }
                    }
                  ]
                },
                "primary-reverse-path": {
                  "path-scope": "ietf-te-types:path-scope-end-to-end"
                },
                "candidate-secondary-paths": {
                  "candidate-secondary-path": [
                    {
                      "secondary-path": "secondary-path-1"
                    }
                  ]
                }
              }
            ]
          },
          "secondary-paths": {
            "secondary-path": [
              {
                "name": "secondary-path-1",
                "path-scope": "ietf-te-types:path-scope-end-to-end",
                "explicit-route-objects": {
                  "route-object-include-exclude": [
                    {
                      "index": 1,
                      "explicit-route-usage": "ietf-te-types:route-include-object",
                      "numbered-link-hop": {
                        "link-tp-id": "192.0.2.5"
                      }
                    }
                  ]
                }
              }
            ]
          }
        },
        {
          "name": "Example_Primary_Transit_Tunnel_Segment",
          "admin-state": "ietf-te-types:tunnel-admin-state-up",
          "encoding": "ietf-te-types:lsp-encoding-packet",
          "bidirectional": true,
          "signaling-type": "ietf-te-types:path-setup-rsvp",
          "primary-paths": {
            "primary-path": [
              {
                "name": "primary-path-2",
                "path-scope": "ietf-te-types:path-scope-end-to-end",
                "co-routed": true,
                "explicit-route-objects": {
                  "route-object-include-exclude": [
                    {
                      "index": 1,
                      "explicit-route-usage": "ietf-te-types:route-include-object",
                      "numbered-link-hop": {
                        "link-tp-id": "192.0.2.2"
                      }
                    },
                    {
                      "index": 2,
                      "explicit-route-usage": "ietf-te-types:route-include-object",
                      "numbered-link-hop": {
                        "link-tp-id": "192.0.2.3"
                      }
                    }
                  ]
                },
                "primary-reverse-path": {
                  "path-scope": "ietf-te-types:path-scope-end-to-end"
                }
              }
            ]
          }
        },
        {
          "name": "Example_Secondary_Transit_Tunnel_Segment",
          "admin-state": "ietf-te-types:tunnel-admin-state-up",
          "encoding": "ietf-te-types:lsp-encoding-packet",
          "bidirectional": true,
          "signaling-type": "ietf-te-types:path-setup-rsvp",
          "primary-paths": {
            "primary-path": [
              {
                "name": "primary-path-4",
                "path-scope": "ietf-te-types:path-scope-end-to-end",
                "co-routed": true,
                "primary-reverse-path": {
                  "path-scope": "ietf-te-types:path-scope-end-to-end"
                },
                "candidate-secondary-paths": {
                  "candidate-secondary-path": [
                    {
                      "secondary-path": "secondary-path-4"
                    }
                  ]
                }
              }
            ]
          },
          "secondary-paths": {
            "secondary-path": [
              {
                "name": "secondary-path-4",
                "path-scope": "ietf-te-types:path-scope-end-to-end",
                "explicit-route-objects": {
                  "route-object-include-exclude": [
                    {
                      "index": 1,
                      "explicit-route-usage": "ietf-te-types:route-include-object",
                      "numbered-link-hop": {
                        "link-tp-id": "192.0.2.6"
                      }
                    },
                    {
                      "index": 2,
                      "explicit-route-usage": "ietf-te-types:route-include-object",
                      "numbered-link-hop": {
                        "link-tp-id": "192.0.2.7"
                      }
                    }
                  ]
                }
              }
            ]
          }
        },
        {
          "name": "Example_Tail_End_Tunnel_Segment",
          "admin-state": "ietf-te-types:tunnel-admin-state-up",
          "encoding": "ietf-te-types:lsp-encoding-packet",
          "destination": {
            "te-node-id": "192.0.2.200"
          },
          "bidirectional": true,
          "signaling-type": "ietf-te-types:path-setup-rsvp",
          "primary-paths": {
            "primary-path": [
              {
                "name": "primary-path-3",
                "path-scope": "ietf-te-types:path-scope-end-to-end",
                "co-routed": true,
                "explicit-route-objects": {
                  "route-object-include-exclude": [
                    {
                      "index": 1,
                      "explicit-route-usage": "ietf-te-types:route-include-object",
                      "numbered-link-hop": {
                        "link-tp-id": "192.0.2.4"
                      }
                    }
                  ]
                },
                "primary-reverse-path": {
                  "path-scope": "ietf-te-types:path-scope-end-to-end"
                },
                "candidate-secondary-paths": {
                  "candidate-secondary-path": [
                    {
                      "secondary-path": "secondary-path-3"
                    }
                  ]
                }
              }
            ]
          },
          "secondary-paths": {
            "secondary-path": [
              {
                "name": "secondary-path-3",
                "path-scope": "ietf-te-types:path-scope-end-to-end",
                "explicit-route-objects": {
                  "route-object-include-exclude": [
                    {
                      "index": 1,
                      "explicit-route-usage": "ietf-te-types:route-include-object",
                      "numbered-link-hop": {
                        "link-tp-id": "192.0.2.8"
                      }
                    }
                  ]
                }
              }
            ]
          }
        }
      ]
    }
  }
}
~~~


# Full Model Tree Diagram {#AppendixB}

The full tree diagram of the TE YANG data model defined in
module 'ietf-te' is shown below.

~~~~~~~~~~~
{::include ../../te/ietf-te.tree}
~~~~~~~~~~~

