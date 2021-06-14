---
title: A YANG Data Model for Traffic Engineering Tunnels, Label Switched Paths and Interfaces
abbrev: TE YANG Data Model
docname: draft-ietf-teas-yang-te-27
category: std
ipr: trust200902
workgroup: TEAS Working Group
keyword: Internet-Draft

stand_alone: yes
pi: [toc, sortrefs, symrefs, comments]

author:

 -
    ins: T. Saad
    name: Tarek Saad
    organization: Juniper Networks
    email: tsaad@juniper.net
 -
   ins: R. Gandhi
   name: Rakesh Gandhi
   organization: Cisco Systems Inc
   email: rgandhi@cisco.com

 -
   ins: X. Liu
   name: Xufeng Liu
   organization: Volta Networks
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

 -
    ins: O. Gonzalez de Dios
    name: Oscar Gonzalez de Dios
    organization: Telefonica
    email: oscar.gonzalezdedios@telefonica.com

normative:
  RFC3209:
  RFC2119:
  RFC6020:
  RFC6241:
  RFC6991:
  RFC6107:
  RFC8040:
  I-D.ietf-teas-yang-rsvp:

informative:

--- abstract

This document defines a YANG data model for the provisioning and management of
Traffic Engineering (TE) tunnels, Label Switched Paths (LSPs), and interfaces.
The model is divided into YANG modules that classify data into generic,
device-specific, technology agnostic, and technology-specific elements.

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

This document describes YANG data model for Traffic Engineering (TE) tunnels,
Label Switched Paths (LSPs), and interfaces. The model covers data applicable
to generic or device-independent, device-specific, and Multiprotocol Label
Switching (MPLS) technology specific.

The document describes a high-level relationship between the modules defined in
this document, as well as other external protocol YANG modules.  The TE generic
YANG data model does not include any data specific to a signaling protocol.  It
is expected other data plane technology model(s) will augment the TE generic
YANG data model. 

Also, it is expected other YANG module(s) that model TE signaling protocols,
such as RSVP-TE ({{RFC3209}}, {{!RFC3473}}), or Segment-Routing TE (SR-TE) 
{{?I-D.ietf-spring-segment-routing-policy}} will augment the generic TE YANG  module.

# Requirements Language

The key words "MUST", "MUST NOT", "REQUIRED", "SHALL", "SHALL NOT", "SHOULD",
"SHOULD NOT", "RECOMMENDED", "NOT RECOMMENDED", "MAY", and "OPTIONAL" in this
document are to be interpreted as described in BCP 14 {{!RFC2119}} {{!RFC8174}}
when, and only when, they appear in all capitals, as shown here.

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
modules, as shown in Table 1.

 | Prefix          | YANG module          | Reference          |
 |-----------------|----------------------|--------------------|
 | yang            | ietf-yang-types      | {{!RFC6991}}       |
 | inet            | ietf-inet-types      | {{!RFC6991}}       |
 | rt-types        | ietf-routing-types   | {{!RFC8294}}       |
 | te-types        | ietf-te-types        | {{!RFC8776}}       |
 | te-packet-types | ietf-te-packet-types | {{!RFC8776}}       |
 | te              | ietf-te              | this document      |
 | te-dev          | ietf-te-device       | this document      |
 |-----------------|----------------------|--------------------|

~~~~~~~~~~
         Table 1: Prefixes and corresponding YANG modules
~~~~~~~~~~

## Model Tree Diagrams

The tree diagrams extracted from the module(s) defined in this document are given in
subsequent sections as per the syntax defined in {{!RFC8340}}.

# Design Considerations

This document describes a generic TE YANG data model that is independent of
any dataplane technology.  One of the design objectives is to allow specific
data plane technology models to reuse the TE generic data model and possibly
augment it with technology specific data.

The elements of the generic TE YANG data model, including TE Tunnels, LSPs, and
interfaces have leaf(s) that identify the technology layer where they reside.
For example, the LSP encoding type can identify the technology associated with a
TE Tunnel or LSP.

Also, the generic TE YANG data model does not cover signaling protocol data.
The signaling protocol used to instantiate TE LSPs are outside the scope of this
document and expected to be covered by augmentations defined in other document(s).

The following other design considerations are taken into account with respect data
organization:

* The generic TE YANG data model 'ietf-te' contains device independent data and
  can be used to model data off a device (e.g. on a TE controller).  The
  device-specific TE data is defined in module 'ietf-te-device' as
  shown in {{figctrl}},
* In general, minimal elements in the model are designated as "mandatory" to
  allow freedom to vendors to adapt the data model to their specific product
  implementation.
* Suitable defaults are specified for all configurable elements.
* The model declares a number of TE functions as features that can be
  optionally supported.

## State Data Organization

The Network Management Datastore Architecture (NMDA) {{!RFC8342}} addresses
modeling state data for ephemeral objects.  This document adopts the NMDA model
for configuration and state data representation as per IETF guidelines for new
IETF YANG models.

# Model Overview

The data models defined in this document cover the core TE features that are
commonly supported by different vendor implementations. The support of extended
or vendor specific TE feature(s) is expected to be in either augmentations, or
deviations to the model defined in this document.


## Module Relationship

The generic TE YANG data model that is defined in "ietf-te.yang" covers the
building blocks that are device independent and agnostic of any specific
technology or control plane instances. The TE device model defined in
"ietf-te-device.yang" augments the generic TE YANG data model and covers data
that is specific to a device --  for example, attributes of TE interfaces, or
TE timers that are local to a TE node.

The TE data model for specific instances of data plane technology exist in a
separate YANG module(s) that augment the generic TE YANG data model. For
example, the MPLS-TE module "ietf-te-mpls.yang" is defined in another document
and augments the TE generic model as shown in {{figctrl}}.

The TE data model for specific instances of signaling protocol are outside the
scope of this document and are defined in other documents. For example, the
RSVP-TE YANG model augmentation of the TE model is covered in
{{I-D.ietf-teas-yang-rsvp}}.

~~~

  TE generic     +---------+         o: augment
  module         | ietf-te |o-------------+        
                 +---------+               \
                        o                   \
                        |\                   \
                        | \                   \
                        |  +----------------+  \
                        |  | ietf-te-device | TE device module
                        |  +----------------+    \
                        |       o        o        \
                        |     /           \        \
                        |   /              \        \
                 +--------------+           +---------------+ 
  RSVP-TE module | ietf-rsvp-te |o .        | ietf-te-mpls^ |
                 +--------------+   \       +---------------+
                    |                \
                    |                 \
                    |                  \
                    |                   \
                    |                    \
                    o                 +-------------------+  
                 +-----------+        | ietf-rsvp-otn-te^ |  
  RSVP module    | ietf-rsvp |        +-------------------+  
                 +-----------+           RSVP-TE with OTN
                                         extensions

                        ^ shown for illustration
                          (not in this document)

~~~
{: #figctrl title="Relationship of TE module(s) with signaling protocol modules"}

# TE YANG Model

The generic TE YANG module ('ietf-te') is meant to manage and operate a TE network.
This includes creating, modifying and retrieving TE Tunnels, LSPs, and interfaces
and their associated attributes (e.g. Administrative-Groups, SRLGs, etc.).

The detailed tree structure is provided in {{fig-highlevel}}.

## Module Structure

The 'ietf-te' uses three main containers grouped under the main 'te' container
(see {{fig-highlevel}}). The 'te' container is the top level container in the
data model. The presence of the 'te' container enables TE function system wide.
Below provides further descriptions of containers that exist under the 'te' top
level container.

globals:

> The 'globals' container maintains the set of global TE attributes that can be
applicable to TE Tunnel(s) and interface(s).

tunnels:

> The 'tunnels' container includes the list of TE Tunnels that are instantiated. Refer to
{{TE_TUNNELS}} for further details on the properties of a TE Tunnel.

lsps:

> The 'lsps' container includes the list of TE LSP(s) that are instantiated for
> TE Tunnels. Refer to {{TE_LSPS}} for further details on the properties of a TE LSP.

tunnels-path-compute:

> A Remote Procedure Call (RPC) to request path computation for a specific TE Tunnel.
The RPC allows requesting path computation using atomic and stateless operation.
A tunnel may also be configured in 'compute-only' mode to provide stateful path updates
- see {{TE_TUNNELS}} for further details.

tunnels-action:

> An RPC to request a specific action (e.g. reoptimize, or tear-and-setup) to be taken
on a specific tunnel or all tunnels.

~~~~~~~~~~~
module: ietf-te
   +--rw te!
      +--rw globals
         .
         .

      +--rw tunnels
         .
         .

      +-- lsps

rpcs:
   +---x tunnels-path-compute
   +---x tunnels-action
~~~~~~~~~~~
{: #fig-highlevel title="TE Tunnel model high-level YANG tree view"}

### TE Globals

The 'globals' container covers properties that control TE features behavior
system-wide, and its respective state (see {{fig-globals}}).
The TE globals configuration include:

named-admin-groups:

> A YANG container for the list of named (extended) administrative groups that may be applied
to TE links.

named-srlgs:

> A YANG container for the list named Shared Risk Link Groups (SRLGs) that may be
applied to TE links.

named-path-constraints:

> A YANG container for a list of named path constraints. Each named path constraint is
composed of a set of constraints that can be applied during path computation.
A named path constraint can be applied to multiple TE Tunnels. Path constraints may also
be specified directly under the TE Tunnel. The path constraint specified under
the TE Tunnel take precedence over the path constraints 
derived from the referenced named path constraint.


~~~~~~~
     +--rw globals
     |  +--rw named-admin-groups
     |  |  +--rw named-admin-group* [name]
     ..
     |  +--rw named-srlgs
     |  |  +--rw named-srlg* [name] {te-types:named-srlg-groups}?
     ..
     |  +--rw named-path-constraints
     |  |  +--rw named-path-constraint* [name]
     ..
~~~~~~~
{: #fig-globals title="TE globals YANG subtree high-level structure"}

### TE Tunnels {#TE_TUNNELS}

The 'tunnels' container holds the list of TE Tunnels that are provisioned on
devices in the network (see {{fig-te-tunnel}}).

A TE Tunnel in the list is uniquely identified by a name.
When the model is used to manage a specific device, the 'tunnels' list contains
the TE Tunnels originating from the specific device. When the model is used to
manage a TE controller, the 'tunnels' list contains all TE Tunnels and TE
tunnel segments originating from device(s) that the TE controller manages.

The TE Tunnel model allows the configuration and management of the following TE
tunnel related objected:

TE Tunnel:

> A YANG container of one or more LSPs established between the source and destination
TE Tunnel termination points. A TE Tunnel LSP is a connection-oriented service
provided by the network layer for the delivery of client data between a source and
the destination of the TE Tunnel termination points.

TE Tunnel Segment:

> A part of a multi-domain TE Tunnel that is within a specific network domain.


TE Tunnel Hand-off:

> An inter-domain link on which the path of a multi-domain TE Tunnel enters or
> exits a given network domain.


~~~~~~~~~~~
     +--rw tunnels
     |  +--rw tunnel* [name]
     |     +--ro operational-state?              identityref
     |     +--rw name                            string
     |     +--rw identifier?                     uint32
     |     +--rw description?                    string
     |     +--rw encoding?                       identityref
     |     +--rw switching-type?                 identityref
     |     +--rw admin-state?                    identityref
     |     +--rw reoptimize-timer?               uint16
     |     +--rw source?                         te-types:te-node-id
     |     +--rw destination?                    te-types:te-node-id
     |     +--rw src-tunnel-tp-id?               binary
     |     +--rw dst-tunnel-tp-id?               binary
     |     +--rw controller
     |     |  +--rw protocol-origin?             identityref
     |     |  +--rw controller-entity-id?        string
     |     +--rw bidirectional?                  boolean
     |     +--rw association-objects
     |     |  +--rw association-object* [association-key]
     // ..
     |     |
     |     +--rw protection
     // ..
     |     +--rw restoration
     // ..
     |     +--rw te-topology-identifier
     // ..
     |     +--rw hierarchy
     // ..

~~~~~~~~~~~
{: #fig-te-tunnel title="TE Tunnel list YANG subtree structure"}

The TE Tunnel has a number of attributes that are set directly under the
tunnel (see {{fig-te-tunnel}}). The main attributes of a TE Tunnel are described below:

operational-state:

> A YANG leaf that holds the operational state of the tunnel.

name:

> A YANG leaf that holds the name of a TE Tunnel.  The name of the
TE Tunnel uniquely identifies the tunnel within the TE tunnel list.  The name
of the TE Tunnel can be formatted as a Uniform Resource Indicator (URI) by
including the namespace to ensure uniqueness of the name amongst all the TE
Tunnels present on devices and controllers.

identifier:

> A YANG leaf that holds an identifier of the tunnel. This identifier is unique amongst tunnels
originated from an ingress device.

encoding/switching:

> The 'encoding' and 'switching-type' are YANG leafs that define the specific
technology in which the tunnel operates.

reoptimize-timer:

> A YANG leaf to set the inteval period for tunnel reoptimization.

source/destination:

> YANG leafs that define the tunnel source and destination node endpoints.

src-tunnel-tp-id/dst-tunnel-tp-id:

>  YANG leafs that hold the identifiers of source and destination TE Tunnel
>  Termination Points (TTPs) {{!RFC8795}} residing on the source and
>  destination nodes. The TTP identifiers are optional on nodes that have a
>  single TTP per node. For example, TTP identifiers are optional for packet
>  (IP/MPLS) routers.


controller:

> A YANG container that holds tunnel data relevant to an optional external TE controller that
may initiate or control a tunnel. This target node may be augmented by external module(s), for example, to add data for PCEP initiated and/or
delegated tunnels.

bidirectional:

> A YANG leaf that when present indicates the tunnel is bidirectional and co-routed.

association-objects:

> A YANG container that holds the set of associations of the TE Tunnel to other
> TE Tunnels. Associations at the TE Tunnel level apply to all paths of the TE
> Tunnel.  The TE tunnel associations can be overridden by associations
> configured directly under the TE Tunnel path.

protection:

> A YANG container that holds the TE Tunnel protection properties.

restoration:

> A YANG container that holds the TE Tunnel restoration properties.

te-topology-identifier:

> A YANG container that holds the topology identifier associated with the topology where paths for the TE tunnel are computed.


~~~~~~~
    +--rw hierarchy
    |  +--rw dependency-tunnels
    |  |  +--rw dependency-tunnel* [name]
    |  |     +--rw name
    |  |     |       -> ../../../../../../tunnels/tunnel/name
    |  |     +--rw encoding?         identityref
    |  |     +--rw switching-type?   identityref
    |  +--rw hierarchical-link
    |     +--rw local-te-node-id?         te-types:te-node-id
    |     +--rw local-te-link-tp-id?      te-types:te-tp-id
    |     +--rw remote-te-node-id?        te-types:te-node-id
    |     +--rw te-topology-identifier
    |        +--rw provider-id?   te-global-id
    |        +--rw client-id?     te-global-id
    |        +--rw topology-id?   te-topology-id
~~~~~~~
{: #fig-hierarchy title="TE Tunnel hierarchy YANG subtree"}


hierarchy:

> A YANG container that holds hierarchy related properties of the TE Tunnel (see {{fig-hierarchy}}. A TE LSP
  can be set up in MPLS or Generalized MPLS (GMPLS) networks to be used as
  a TE links to carry traffic in other (client) networks {{RFC6107}}.  In this
  case, the model introduces the TE Tunnel hierarchical link endpoint parameters
  to identify the specific link in the client layer that the underlying TE Tunnel is
  associated with. The hierarchy container includes the following:

>>
- dependency-tunnels: a hierarchical TE Tunnel provisioned or to be
  provisioned in an immediately adjacent server layer a given
  client layer TE Tunnel depends on for multi-layer path
  computation. A dependency TE Tunnel is provisioned if and only if
  it is used (selected by path computation) at least by one client
  layer TE Tunnel. The TE link in the client layer network topology
  supported by a dependent TE Tunnel is dynamically created only
  when the dependency TE Tunnel is actually provisioned.

>>
- hierarchical-link: A YANG container that holds the identity of a
  hierarchical link (in client layer) that this tunnel is
  associated with. A hierarchical-link is by a node hosting the
  link and its source and destination link termination point identifiers.


#### TE Tunnel Paths

The TE Tunnel can be configured with a set of paths that define the tunnel
forward and reverse paths as described in {{fig-tunnel-paths}}. Moreover, a primary
path can be specified a set of candidate secondary paths that can be visited to
support path protection. The following describe further the list of paths associated with a
TE Tunnel.

~~~~~~

     |     +--rw primary-paths
     |     |  +--rw primary-path* [name]
     |     |     +--rw name                             string
     // ..
     |     |     +
     |     |     +--rw primary-reverse-path
     |     |     |  +--rw name?                                string
     // ..
     |     |     |  |
     |     |     |  +--rw candidate-secondary-reverse-paths
     |     |     |     +--rw candidate-secondary-reverse-path*
     |     |     |             [secondary-path]
     |     |     |        +--rw secondary-path    leafref
     |     |     +--rw candidate-secondary-paths
     |     |        +--rw candidate-secondary-path* [secondary-path]
     |     |           +--rw secondary-path    leafref
     |     |           +--ro active?           boolean

     |     +--rw secondary-paths
     |     |  +--rw secondary-path* [name]
     |     |     +--rw name                             string
     // ..
     |     |
     |     +--rw secondary-reverse-paths
     |     |  +--rw secondary-reverse-path* [name]
     |     |     +--rw name                             string

~~~~~~
{: #fig-tunnel-paths title="TE Tunnel paths YANG tree structure"}

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
  protection. The candidate secondary path(s) reference path(s)  from the
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
'candidate-secondary-path' list. A secondary path contains attributes similar to a primary path.

secondary-reverse-paths:

> A YANG container that holds teh set of secondary reverse paths. A secondary reverse
path is identified by 'name'. A secondary reverse path can be referenced from the
TE Tunnel's 'candidate-secondary-reverse-paths' list. A secondary reverse path contains
attributes similar to a primary path.

The following set common path attributes are shared for primary forward and reverse primary and secondary paths:

compute-only:

> A path of TE Tunnel is, by default, provisioned so that it can is instantiated
  in forwarding to carry traffic as soon as a valid path is computed. In some cases,
  a TE path may be provisioned for the only purpose of computing a path
  and reporting it without the need to instantiate the LSP or commit any
  resources. In such a case, the path is configured in 'compute-only' mode to
  distinguish it from the default behavior. A 'compute-only' path is configured
  as a usual with the associated per path constraint(s) and properties on a
  device or TE controller. The device or TE controller computes the feasible path(s) subject
  to configured constraints.  A client may query the
  'compute-only' computed path properties 'on-demand', or alternatively, can subscribe
  to be notified of computed path(s) and whenever the path properties change.


use-path-computation:

> A YANG leaf that indicates whether or not path computation is to
  be used for a specified path.

lockdown:

> A YANG leaf that when set indicates the existing path should not be reoptimized
  after a failure on any of its traversed links.


te-topology-identifier:

> A YANG container that holds the topology identifier
  associated with the tunnel.

optimizations:

> a YANG container that holds the optimization objectives
  that path computation will use to select a path.

computed-paths-properties:
> A YANG container that holds properties for the list of computed paths.

computed-path-error-infos:

> A YANG container that holds a list of errors related to the path.

lsps:

> a YANG container that holds a list of LSPs that are instantiated for this specific path.

### TE LSPs {#TE_LSPS}

The 'lsps' container includes the set of TE LSP(s) that are instantiated.
A TE LSP is identified by a 3-tuple ('tunnel-name', 'node', 'lsp-id').

When the model is used to manage a specific device, the 'lsps' list contains all TE
LSP(s) that traverse the device (including ingressing, transiting and egressing the device).

When the model is used to manage a TE controller, the 'lsps' list contains all
TE LSP(s) that traverse all network devices (including ingressing, transiting and
egressing the device) that the TE controller manages.

## Tree Diagram

{{fig-te-tree}} shows the tree diagram of the generic TE YANG model defined in
modules 'ietf-te.yang'.

~~~~~~~~~~~
{::include ../../te/ietf-te.tree}
~~~~~~~~~~~
{: #fig-te-tree title="TE Tunnel generic model YANG tree diagram"}


## YANG Module

The generic TE YANG module 'ietf-te' imports the following modules:

- ietf-yang-types and ietf-inet-types defined in {{!RFC6991}}
- ietf-te-types defined in {{!RFC8776}}

This module references the following documents:
{{!RFC6991}}, {{!RFC4875}}, {{!RFC7551}}, {{!RFC4206}}, {{?RFC4427}},
{{!RFC4872}}, {{!RFC3945}}, {{!RFC3209}}, {{!RFC6780}}, {{?RFC8800}}, and
{{!RFC7308}}.

~~~~~~~~~~
<CODE BEGINS> file "ietf-te@2021-05-16.yang"
{::include ../../te/ietf-te.yang}
<CODE ENDS>
~~~~~~~~~~
{: #fig-basic-te title="TE Tunnel data model YANG module"}

# TE Device YANG Model

The device TE YANG module ('ietf-te-device') models data that is specific to
managing a TE device.  This module augments the generic TE YANG module.

## Module Structure

### TE Interfaces

This branch of the model manages TE interfaces that are present on a device. 
Examples of TE interface properties are:

* Maximum reservable bandwidth, bandwidth constraints (BC)
* Flooding parameters
   * Flooding intervals and threshold values
* interface attributes
   * (Extended) administrative groups
   * SRLG values
   * TE metric value
* Fast reroute backup tunnel properties (such as static, auto-tunnel)

The derived state associated with interfaces is grouped under the interface
"state" sub-container as shown in {{fig-if-te-state}}.  This covers state data
such as:

* Bandwidth information: maximum bandwidth, available bandwidth at different
  priorities and for each class-type (CT)
* List of admitted LSPs
    * Name, bandwidth value and pool, time, priority
* Statistics: state counters, flooding counters, admission counters
  (accepted/rejected), preemption counters
* Adjacency information
    * Neighbor address
    * Metric value

~~~~~~~~~~~
module: ietf-te-device
  augment /te:te:
      +--rw interfaces
         .
         +-- rw te-dev:te-attributes
                <<intended configuration>>
             .
             +-- ro state
                <<derived state associated with the TE interface>>
~~~~~~~~~~~
{: #fig-if-te-state title="TE interface state YANG subtree"}

## Tree Diagram

{{fig-te-dev-tree}} shows the tree diagram of the device TE YANG model defined in
modules 'ietf-te.yang'.

~~~~~~~~~~~
{::include ../../te/ietf-te-dev.tree}
~~~~~~~~~~~
{: #fig-te-dev-tree title="TE Tunnel device model YANG tree diagram"}


## YANG Module

The device TE YANG module 'ietf-te-device' imports the following module(s):

- ietf-yang-types and ietf-inet-types defined in {{!RFC6991}}
- ietf-interfaces defined in {{!RFC8343}}
- ietf-routing-types defined in {{!RFC8294}}
- ietf-te-types defined in {{!RFC8776}}
- ietf-te defined in this document

~~~~~~~~~~
<CODE BEGINS> file "ietf-te-device@2021-05-16.yang"
{::include ../../te/ietf-te-device.yang}
<CODE ENDS>
~~~~~~~~~~
{: #fig-te-device-types title="TE device data model YANG module"}


# Notifications

Notifications are a key component of any topology data model.

{{!RFC8639}} and {{!RFC8641}} define a subscription mechanism and a push
mechanism for YANG datastores.  These mechanisms currently allow the
user to:

*  Subscribe to notifications on a per-client basis.

*  Specify subtree filters or XML Path Language (XPath) filters so
   that only contents of interest will be sent.

*  Specify either periodic or on-demand notifications.

# TE Generic and Helper YANG Modules

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

"/te/tunnels":  This list specifies the configured TE Tunnels on a device.
Unauthorized access to this list could cause the device to ignore packets it
should receive and process.

"/te/interfaces":  This list specifies the configured TE interfaces on a device.
Unauthorized access to this list could cause the device to ignore packets it
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

"unnels-actions": using this RPC, an attacker can modify existing paths that
may be carrying live traffic, and hence result to interruption to services
carried over the network.

"/te/tunnels-path-compute": using this RPC, an attacker can retrieve secured
information about the network provider which can be used to orchestrate further
attacks.

The security considerations spelled out in the YANG 1.1 specification
{{!RFC7950}} apply for this document as well.

# Acknowledgement

The authors would like to thank the  members of the multi-vendor YANG design
team who are involved in the definition of this model.

The authors would like to thank Tom Petch for reviewing and providing useful
feedback about the document. The authors would also like to thank Loa
Andersson, Lou Berger, Sergio Belotti, Italo Busi, Carlo Perocchio, Francesco
Lazzeri, Aihua Guo, Dhruv Dhody, for providing useful feedback on this
document.

# Contributors

~~~~

   Himanshu Shah
   Ciena

   Email: hshah@ciena.com


   Xia Chen
   Huawei Technologies

   Email: jescia.chenxia@huawei.com


   Raqib Jones
   Brocade

   Email: raqib@Brocade.com


   Bin Wen
   Comcast

   Email: Bin_Wen@cable.comcast.com

~~~~

# Appendix A: Examples

This section contains examples of use of the model with RESTCONF {{RFC8040}} and JSON encoding. 

For the example we will use a 4 nodes MPLS network were RSVP-TE Tunnels can be setup. The
loopbacks of each router are shown. The router network in 
figure X will be used across the section

~~~

 10.0.0.1         10.0.0.2      10.0.0.4
 +-----+         +------+      +------+
 |     |         |      |      |      |
 |  A  +---------+  B   +------+  D   |
 +--+--+         +------+      +--+---+
    |                             |
    |            +-------+        |
    |            |       |        |
    +------------+   C   +--------+
                 |       |
                 +-------+
                 10.0.0.3
~~~
{: #AppFig-Topo title="Example TE topology"}


## Basic Tunnel Setup {#TeTunnel}

This example uses the TE Tunnel YANG data model defined in this document to create an
RSVP-TE signaled Tunnel. First, the TE Tunnel is created with no specific restrictions or constraints (e.g., protection or restoration).
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
      "encoding": "te-types:lsp-encoding-packet",
      "admin-state": "te-types:tunnel-state-up",
      "source": "10.0.0.1",
      "destination": "10.0.0.4",
      "bidirectional": "false",
      "signaling-type": "te-types:path-setup-rsvp"
    }
  ]
}
~~~

## Global Named Path Constraints

This example uses the YANG data model to create a 'named path constraitnt' that can be reference by TE Tunnels.
The path constraint, in this case, limits the TE Tunnel hops for the computed path.

~~~
POST /restconf/data/ietf-te:te/globals/named-path-constraints HTTP/1.1
    Host: example.com
    Accept: application/yang-data+json
    Content-Type: application/yang-data+json

{
  "ietf-te:named-path-constraint": {
          "name": "max-hop-3",
          "path-metric-bounds": {
            "path-metric-bound": {
              "metric-type": "te-types:path-metric-hop",
              "upper-bound": "3"
    }
   }
  }
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
  "ietf-te:ietf-tunnel": [
    {
      "name": "Example_LSP_Tunnel_A_4_1",
      "encoding": "te-types:lsp-encoding-packet",
      "description": "Simple_LSP_with_named_path",
      "admin-state": "te-types:tunnel-state-up",
      "source": "10.0.0.1",
      "destination": "10.0.0.4",
      "signaling-type": "path-setup-rsvp",
      "bidirectional": "false",
      "primary-paths": [
        {
          "primary-path": {
            "name": "Simple_LSP_1",
            "use-path-computation": "true",
            "named-path-constraint": "max-hop-3"
          }
        }
      ]
    }
  ]
}
~~~

## Tunnel with Per-tunnel Path Constraint

In this example, the a per tunnel path constraint is explicitly indicated under the TE Tunnel created in {{TeTunnel}} to constrain the computed path for the tunnel.

~~~
POST /restconf/data/ietf-te:te/tunnels HTTP/1.1
    Host: example.com
    Accept: application/yang-data+json
    Content-Type: application/yang-data+json

{
  "ietf-te:tunnel": [
    {
      "name": "Example_LSP_Tunnel_A_4_2",
      "encoding": "te-types:lsp-encoding-packet",
      "admin-state": "te-types:tunnel-state-up",
      "source": "10.0.0.1",
      "destination": "10.0.0.4",
      "bidirectional": "false",
      "signaling-type": "te-types:path-setup-rsvp",
      "primary-paths": {
        "primary-path": [
          {
            "name": "path1",
            "path-metric-bounds": {
              "path-metric-bound": [ 
                {
                  "metric-type": "te-types:path-metric-hop",
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
GET  /restconf/data/ietf-te:te/tunnels/tunnel="Example_LSP_Tunnel_A_4_1"
     /p2p-primary-paths/ HTTP/1.1
    Host: example.com
    Accept: application/yang-data+json
~~~~

The request, with status code 200 would include, for example, the following json:

~~~
{
  "ietf-te:primary-paths": {
    "primary-path": [
      {
        "name": "path1",
        "path-computation-method": "te-types:path-locally-computed",
        "computed-paths-properties": {
          "computed-path-properties": [
            {
              "k-index": "1",
              "path-properties": {
                "path-route-objects": {
                  "path-route-object": [
                    {
                      "index": "1",
                      "numbered-node-hop": {
                        "node-id": "10.0.0.2"
                      }
                    },
                    {
                      "index": "2",
                      "numbered-node-hop": {
                        "node-id": "10.0.0.4"
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
              "tunnel-name": "Example_LSP_Tunnel_A_4_1",
              "node": "10.0.0.1 ",
              "lsp-id": "25356"
            }
          ]
        }
      }
    ]
  }
}
~~~
