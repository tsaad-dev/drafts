---
title: A YANG Data Model for Traffic Engineering Tunnels and Interfaces
abbrev: TE YANG Data Model
docname: draft-ietf-teas-yang-te-23
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

This document defines a YANG data model for the configuration and management of
Traffic Engineering (TE) interfaces, tunnels and Label Switched Paths (LSPs).
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

This document describes YANG data model for TE Tunnels, Label Switched Paths
(LSPs) and TE interfaces and covers data applicable to generic or
device-independent, device-specific, and Multiprotocol Label Switching (MPLS)
technology specific.

The document describes a high-level relationship between the modules defined in
this document, as well as other external protocol YANG modules.  The TE generic
YANG data model does not include any data specific to a signaling protocol.  It
is expected other data plane technology model(s) will augment the TE generic
YANG data model. 

Also, it is expected other YANG module(s) that model TE signaling protocols,
such as RSVP-TE ({{RFC3209}}, {{!RFC3473}}), or Segment-Routing TE (SR-TE) will
augment the TE generic YANG  module.

## Terminology

The key words "MUST", "MUST NOT", "REQUIRED", "SHALL", "SHALL NOT", "SHOULD",
"SHOULD NOT", "RECOMMENDED", "NOT RECOMMENDED", "MAY", and "OPTIONAL" in this
document are to be interpreted as described in BCP 14 {{!RFC2119}} {{!RFC8174}}
when, and only when, they appear in all capitals, as shown here.

The terminology for describing YANG data models is found in {{!RFC7950}}.

## Prefixes in Data Node Names

In this document, names of data nodes and other data model objects are prefixed
using the standard prefix associated with the corresponding YANG imported
modules, as shown in Table 1.

~~~~~~~~~~
 +---------------+--------------------+-------------------------------+
 | Prefix        | YANG module        | Reference                     |
 +---------------+--------------------+-------------------------------+
 | yang          | ietf-yang-types    | [RFC6991]                     |
 | inet          | ietf-inet-types    | [RFC6991]                     |
 | rt-types      | ietf-routing-types | [RFC8294]                     |
 | te            | ietf-te            | this document                 |
 | te-dev        | ietf-te-device     | this document                 |
 | te-types      | ietf-te-types      | [I-D.ietf-teas-yang-te-types] |
 | te-mpls-types | ietf-te-mpls-types | [I-D.ietf-teas-yang-te-types] |
 +---------------+--------------------+-------------------------------+

            Table 1: Prefixes and corresponding YANG modules
~~~~~~~~~~

## TE Technology Models

This document describes the TE generic YANG data model that is independent of
any dataplane technology.  One of the design objectives is to allow specific
data plane technology models to reuse the TE generic data model and possibly
augment it with technology specific data.

The elements of the TE generic YANG data model, including TE tunnels, LSPs, and
interfaces have leaf(s) that identify the technology layer where they reside.
For example, the LSP encoding type can identify the technology associated with a
TE tunnel or LSP.

Also, the TE generic YANG data model does not cover signaling protocol data.
This is expected to be covered by augmentations defined in other document(s).

## State Data Organization

The Network Management Datastore Architecture (NMDA) {{!RFC8342}} addresses
modeling state data for ephemeral objects.  This document adopts the NMDA proposal
for configuration and state data representation as per IETF guidelines for new
IETF YANG models.

# Model Overview

The data model(s) defined in this document cover core TE features that are
commonly supported across different vendor implementations. The support of
extended or vendor specific TE feature(s) is expected to be in augmentations to
the model defined in this document.

## Module(s) Relationship

The TE generic YANG data model defined in "ietf-te.yang" covers the building
blocks that are device independent and agnostic of any specific technology or
control plane instances. The TE device model defined in "ietf-te-device.yang"
augments the TE generic YANG data model and covers data that is specific to a
device --  for example, attributes of TE interfaces, or TE timers that are local
to a TE node.

The TE data model for specific instances of data plane technology exist in a
separate YANG module(s) that augment the TE generic YANG data model. For
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
{: #figctrl title="Relationship of TE module(s) with other signaling protocol modules"}


## Design Considerations

The following design considerations are taken into account with respect data
organization:

* Reusable TE data types that are data plane independent are grouped in the TE
  generic types module "ietf-te-types.yang" defined in
  {{!I-D.ietf-teas-yang-te-types}}.
* Reusable TE data types that are data plane specific are defined in a data
  plane type module, e.g. "ietf-te-packet-types.yang" as defined in
  {{!I-D.ietf-teas-yang-te-types}}.  Other data plane types are
  expected to be defined in separate module(s).
* The TE generic YANG data model "ietf-te" contains device independent data and
  can be used to model data off a device (e.g. on a controller).  The
  device-specific TE data is defined in module "ietf-te-device" as
  shown in {{figctrl}},
* In general, minimal elements in the model are designated as "mandatory" to
  allow freedom to vendors to adapt the data model to their specific product
  implementation.
* Suitable defaults are specified for all configurable elements.
* The model declares a number of TE functions as features that can be
  optionally supported.

## Model Tree Diagram

{{fig-globals-tree}} shows the tree diagram of the TE YANG model defined in
modules: ietf-te.yang, and ietf-te-device.yang.

~~~~~~~~~~~
{::include ../../te/ietf-te-all.tree}
~~~~~~~~~~~
{: #fig-globals-tree title="TE generic model configuration and state tree"}

# Model Organization

The TE generic YANG data module "ietf-te" covers configuration, state, and RPC
data pertaining to TE tunnels, and global objects that are device independent.

The container "te" is the top level container in the data model. The presence of
this container enables TE function system wide.

The model top level organization is shown below in {{fig-highlevel}}:

~~~~~~~~~~~
module: ietf-te
   +--rw te!
      +--rw globals
         .
         .

      +--rw tunnels
         .
         .

      +-- lsps-state

rpcs:
   +---x tunnels-path-compute
   +---x tunnels-action
~~~~~~~~~~~
{: #fig-highlevel title="TE generic highlevel model view"}

## Global Configuration and State Data

The global TE branch of the data model covers configurations that control TE
features behavior system-wide, and its respective state. Examples of such
configuration data are:

* Table of named SRLG mappings
* Table of named (extended) administrative groups mappings
* Table of named path-constraints sets
* System-wide capabilities for LSP reoptimization
    * Reoptimization timers (periodic interval, LSP installation and cleanup)
    * Link state flooding thresholds 
    * Periodic flooding interval
*  Global capabilities that affect originating, transiting and terminating
   LSPs.  For example:
    * Path selection parameters (e.g. metric to optimize, etc.)
    * Path or segment protection parameters

## Interfaces Configuration and State Data

This branch of the model covers configuration and state data corresponding to TE
interfaces that are present on a device. The module "ietf-te-device"
is introduced to hold such TE device specific properties.

Examples of TE interface properties are:
* Maximum reservable bandwidth, bandwidth constraints (BC)
* Flooding parameters
   * Flooding intervals and threshold values
* interface attributes
   * (Extended) administrative groups
   * SRLG values
   * TE metric value
* Fast reroute backup tunnel properties (such as static, auto-tunnel)

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
{: #fig-if-te-state title="TE interface state"}

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

## Tunnels Configuration and State Data

This branch covers data related to TE tunnels configuration and state.  The
derived state associated with tunnels is grouped under a state container as
shown in {{fig-tunnel-te-state}}.

~~~~~~~~~~~
module: ietf-te
   +--rw te!
      +--rw tunnels
            <<intended and applied configurations>>
~~~~~~~~~~~
{: #fig-tunnel-te-state title="TE interface state tree"}

Examples of tunnel configuration data for TE tunnels:

* Name and type (e.g. P2P, P2MP) of the TE tunnel
* Administrative and operational state of the TE tunnel
* Set of primary and corresponding secondary paths and corresponding path
  attributes
* Bidirectional path attribute(s) including forwarding and reverse path
  properties
* Protection and restoration path parameters

### Tunnel Compute-Only Mode

A configured TE tunnel, by default, is provisioned so it can carry traffic as
soon as a valid path is computed and an LSP instantiated. In some cases,
however, a TE tunnel may be provisioned for the only purpose of computing a path
and reporting it without the need to instantiate the LSP or commit any
resources. In such a case, the tunnel is configured in "compute-only" mode to
distinguish it from default tunnel behavior.

A "compute-only" TE tunnel is configured as a usual TE tunnel with associated
per path constraint(s) and properties on a device or controller. The device or
controller computes the feasible path(s) subject to configured constraints and
reflects the computed path(s) in the LSP(s) Record-Route Object (RRO) list.  At
any time, a client may query "on-demand" the "compute-only" TE tunnel computed
path(s) properties by querying the state of the tunnel. Alternatively, the
client can subscribe on the "compute-only" TE tunnel to be notified of computed
path(s) and whenever it changes.

### Tunnel Hierarchical Link Endpoint

TE LSPs can be set up in MPLS or Generalized MPLS (GMPLS) networks to be used to
form links to carry traffic in in other (client) networks {{RFC6107}}.  In this
case, the model introduces the TE tunnel hierarchical link endpoint parameters
to identify the specific link in the client layer that the underlying TE tunnel is
associated with.

# TE Generic and Helper YANG Modules

The TE generic YANG module "ietf-te" imports the following modules:

- ietf-yang-types and ietf-inet-types defined in {{!RFC6991}}
- ietf-te-types defined in {{!I-D.ietf-teas-yang-te-types}}

This module references the following documents:
{{!RFC6991}}, {{!RFC4875}}, {{!RFC7551}}, {{!RFC4206}}, {{?RFC4427}},
{{!RFC4872}}, {{!RFC3945}}, {{!RFC3209}}, {{!RFC4872}}, {{!RFC6780}}, and
{{!RFC7308}}.

~~~~~~~~~~
<CODE BEGINS> file "ietf-te@2020-03-09.yang"
{::include ../../te/ietf-te.yang}
<CODE ENDS>
~~~~~~~~~~
{: #fig-basic-te title="TE generic YANG module"}

The TE device YANG module "ietf-te-device" imports the following module(s):

- ietf-yang-types and ietf-inet-types defined in {{!RFC6991}}
- ietf-interfaces defined in {{!RFC8343}}
- ietf-routing-types defined in {{!RFC8294}}
- ietf-te-types defined in {{!I-D.ietf-teas-yang-te-types}}
- ietf-te defined in this document

~~~~~~~~~~
<CODE BEGINS> file "ietf-te-device@2020-03-09.yang"
{::include ../../te/ietf-te-device.yang}
<CODE ENDS>
~~~~~~~~~~
{: #fig-te-device-types title="TE device specific YANG module"}

# IANA Considerations

This document registers the following URIs in the IETF XML registry
{{!RFC3688}}.
Following the format in {{RFC3688}}, the following registrations are
requested to be made.

~~~~
   URI: urn:ietf:params:xml:ns:yang:ietf-te
   XML: N/A, the requested URI is an XML namespace.

   URI: urn:ietf:params:xml:ns:yang:ietf-te-device
   XML: N/A, the requested URI is an XML namespace.
~~~~

This document registers two YANG modules in the YANG Module Names
registry {{RFC6020}}.

~~~~
   name:       ietf-te
   namespace:  urn:ietf:params:xml:ns:yang:ietf-te
   prefix:     ietf-te
   reference:  RFCXXXX

   name:       ietf-te-device
   namespace:  urn:ietf:params:xml:ns:yang:ietf-te-device
   prefix:     ietf-te-device
   reference:  RFCXXXX
~~~~

# Security Considerations

The YANG module defined in this memo is designed to be accessed via the NETCONF
protocol {{!RFC6241}}.  The lowest NETCONF layer is the secure transport layer
and the mandatory-to-implement secure transport is SSH {{!RFC6242}}.  The
NETCONF access control model {{!RFC8341}} provides means to restrict access for
particular NETCONF

users to a pre-configured subset of all available NETCONF protocol operations
and content.

There are a number of data nodes defined in the YANG module which are
writable/creatable/deletable (i.e., config true, which is the default).  These
data nodes may be considered sensitive or vulnerable in some network
environments.  Write operations (e.g., \<edit-config\>) to these data nodes
without proper protection can have a negative effect on network operations.
Following are the subtrees and data nodes and their sensitivity/vulnerability:

"/te/globals":  This module specifies the global TE configurations on a device.
Unauthorized access to this container could cause the device to ignore packets
it should receive and process.

"/te/tunnels":  This list specifies the configured TE tunnels on a device.
Unauthorized access to this list could cause the device to ignore packets it
should receive and process.

"/te/lsps-state":  This list specifies the state derived LSPs.  Unauthorized
access to this list could cause the device to ignore packets it should receive
and process.

"/te/interfaces":  This list specifies the configured TE interfaces on a device.
Unauthorized access to this list could cause the device to ignore packets it
should receive and process.

# Acknowledgement

The authors would like to thank the  members of the multi-vendor YANG design
team who are involved in the definition of this model.

The authors would also like to thank Loa Andersson, Lou Berger, Sergio Belotti,
Italo Busi, Carlo Perocchio, Francesco Lazzeri, Aihua Guo, Dhruv Dhody, Anurag
Sharma, and Xian Zhang for their comments and providing valuable feedback on
this document.

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
