---
title: A YANG Data Model for Traffic Engineering Tunnels and Interfaces
abbrev: TE YANG Data Model
docname: draft-ietf-teas-yang-te-10
date: 2017-12-19
category: std
ipr: trust200902
workgroup: TEAS Working Group
keyword: Internet-Draft

stand_alone: yes
pi: [toc, sortrefs, symrefs]

author:

 -
    ins: T. Saad
    name: Tarek Saad
    role: editor
    organization: Cisco Systems Inc
    email: tsaad@cisco.com
 -
   ins: R. Gandhi
   name: Rakesh Gandhi
   organization: Cisco Systems Inc
   email: rgandhi@cisco.com

 -
   ins: X. Liu
   name: Xufeng Liu
   organization: Jabil
   email: Xufeng_Liu@jabil.com

 -
   ins: V. P. Beeram
   name: Vishnu Pavan Beeram
   organization: Juniper Networks
   email: vbeeram@juniper.net

 -
   ins: H. Shah
   name: Himanshu Shah
   organization: Ciena
   email: hshah@ciena.com

 -
    ins: I. Bryskin
    name: Igor Bryskin
    organization: Huawei Technologies
    email: Igor.Bryskin@huawei.com

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
Traffic Engineering (TE) interfaces, tunnels and Label Switched Paths (LSPs). The model is divided into YANG modules
that classify data into generic, device-specific, technology agnostic, and technology-specific elements.
The model also includes module(s) that contain reusable TE data types and data groupings.

This model covers data for configuration, operational state, remote procedural calls,
and event notifications.

--- middle

# Introduction

YANG {{!RFC6020}} is a data definition language that was introduced to define the
contents of a conceptual data store that allows networked devices to be managed
using NETCONF {{!RFC6241}}. YANG is proving relevant beyond its initial confines, as
bindings to other interfaces (e.g. RESTCONF {{RFC8040}}) and encoding other than XML (e.g. JSON)
are being defined. Furthermore, YANG data models can be used as the basis of implementation
for other interfaces, such as CLI and programmatic APIs.

This document describes the YANG data models for TE Tunnels, Label Switched Paths (LSPs) and TE interfaces
that cover data applicable to generic or device-independent, device-specific, Multiprotocol Label Switching (MPLS) technology specific,
and Segment Routing (SR) TE technology. It also describes helper modules that define TE grouping(s) and
data types that can be imported by other modules.

The document defines the high-level relationship between the modules defined in this document, as well
as other external protocol modules. It is expected other data plane technology model(s)
will augment the TE generic model. Also, the TE generic model does not include any data specific to
a signaling protocol. It is expected YANG models for TE signaling protocols, such as RSVP-TE ({{RFC3209}}, {{!RFC3473}}),
or Segment-Routing TE (SR-TE) will augment the TE generic module.

## Terminology

The key words "MUST", "MUST NOT", "REQUIRED", "SHALL", "SHALL NOT",
"SHOULD", "SHOULD NOT", "RECOMMENDED", "MAY", and "OPTIONAL" in this
document are to be interpreted as described in BCP 14, RFC 2119 {{RFC2119}}.

## Tree Diagram

A simplified graphical representation of the data model is presented in each section of the model.
The following notations are used for the YANG model data tree representation.

~~~~~~~~~~
   <status> <flags> <name> <opts> <type>

    <status> is one of:
      +  for current
      x  for deprecated
      o  for obsolete

    <flags> is one of:
      rw  for read-write configuration data
      ro  for read-only non-configuration data
      -x  for execution rpcs
      -n  for notifications

    <name> is the name of the node

   If the node is augmented into the tree from another module, its name
   is printed as <prefix>:<name>

    <opts> is one of:
      ? for an optional leaf or node
      ! for a presence container
      * for a leaf-list or list
      Brackets [<keys>] for a list's keys
      Curly braces {<condition>} for optional feature that make node
   conditional
      Colon : for marking case nodes
      Ellipses ("...") subtree contents not shown

      Parentheses enclose choice and case nodes, and case nodes are also
      marked with a colon (":").

    <type> is the name of the type for leafs and leaf-lists.
~~~~~~~~~~

## Prefixes in Data Node Names

In this document, names of data nodes and other data model objects
are prefixed using the standard prefix associated with the
corresponding YANG imported modules, as shown in Table 1.

~~~~~~~~~~
        +---------------+--------------------+---------------+
        | Prefix        | YANG module        | Reference     |
        +---------------+--------------------+---------------+
        | yang          | ietf-yang-types    | [RFC6991]     |
        | inet          | ietf-inet-types    | [RFC6991]     |
        | te            | ietf-te            | this document |
        | te-types      | ietf-te-types      | this document |
        | te-mpls-types | ietf-te-mpls-types | this document |
        | te-dev        | ietf-te-device     | this document |
        | te-mpls       | ietf-te-mpls       | this document |
        | te-sr-mpls    | ietf-te-sr-mpls    | this document |
        +---------------+--------------------+---------------+

            Table 1: Prefixes and corresponding YANG modules
~~~~~~~~~~

## Open Issues and Next Steps

This section describes the number of open issues that are under consideration. As issues
are resolved, this section will be updated to reflect this and be left there for reference.
It is expected that all the issues in this section will be addressed before the document will
be ready for final publication.

### TE Technology Models

This document describes the generic TE YANG data model that is independent of any dataplane technology.
One of the design objectives is to allow specific data plane technologies models to reuse the generic TE
data model and possibly augment it with technology specific data model(s). There are multiple options
being considered to achieve this:

* The generic TE model, including the lists of TE tunnels, LSPs, and interfaces can be defined
and rooted at the top of the YANG tree.
Specific leaf(s) under the TE tunnel, LSP, or interface, in this case, can identify the
specific technology layer that it belongs to. This approach implies a single list for each of
TE tunnel(s), LSP(s), and interface(s) in the model carries elements of different technology layers.

* An instance of the generic TE YANG model can be mounted in the YANG tree once for each TE technology layer(s).
This approach provides separation of elements belonging to different technology layers into separate lists per layer in the data model. 

* The generic TE data node(s) and TE list(s) for tunnels, LSPs, and interfaces are defined as grouping(s) in a separate module.
The specific technology layer imports the generic TE groupings and uses them their respective technology specific module.

This revision of the model leverages the LSP encoding type of a tunnel (and interfaces) to identify the specific
technology associated with the a TE interfaces, tunnel(s) and the LSP(s). For example, for an MPLS TE LSP, the
LSP encoding type is assumed to be "lsp-encoding-packet".

Finally, the TE generic model does not include any signaling protocol data. It is
expected that TE signaling protocol module(s) will be defined in other document(s) that will cover
the RSVP-TE ({{RFC3209}}, {{RFC3473}}), and Segment-Routing TE (SR-TE) model and that augment
the TE generic model.

### State Data Organization
Pure state data (for example, ephemeral or protocol derived state objects) can be modeled using
one of the options below:

* Contained inside a read-write container, in a "state" sub-container, as shown in {{fig-highlevel}}
* Contained inside a separate read-only container, for example a lsps-state container

The Network Management Datastore Architecture (NMDA) addresses the "OpState" that was discussed in the IETF.
As per NMDA guidelines for new models and models that are not concerned with the operational
state of configuration information, this revision of the draft adopts the NMDA proposal for 
configuration and state data of this model.

# Model Overview

The data model defined in this document covers the core TE features that are commonly supported
across different vendor implementations. The support of extended or vendor specific TE 
feature(s) are expected to be in augmentations to the data models defined in this document.

## Module(s) Relationship

The TE generic model defined in "ietf-te.yang" covers the building blocks that are device
independent and agnostic of any specific technology or control plane instances. The TE device
model defined in "ietf-te-device.yang" augments the TE generic model and covers
data that is specific to a device --  for example, attributes of TE interfaces, or TE timers that
are local to a TE node.

The TE data relevant to a specific instantiations of data plane technology 
exists in a separate YANG module(s) that augment the TE generic model. For example,
the MPLS-TE module "ietf-te-mpls.yang" is defined in {{fig-mpls-te}} and augments the TE
generic model as shown in {{figctrl}}. Similarly, the module "ietf-te-sr-mpls.yang"
models the Segment Routing (SR) TE specific data and augments the TE generic and MPLS-TE model(s).

The TE data relevant to a TE specific signaling protocol instantiation is outside the scope
and is covered in other documents. For example, the RSVP-TE {{RFC3209}} YANG model augmentation of the
TE model is covered in {{I-D.ietf-teas-yang-rsvp}}, and other signaling protocol model(s) 
(e.g. for Segment-Routing TE) are expected to also augment the TE generic model.

~~~
                                     ^: import  
  TE generic     +---------+         o: augment
  module         | ietf-te |o-------------+        
                 +---------+               \
                    |   o  \                \
                    |   |\  \                \
                    |   | \  V                \
                    |   |  +----------------+  \
                    |   |  | ietf-te-device | TE device module
                    |   |  +----------------+    \
                    |   |       o        o        \
                    |   |     /           \        \
                    v   |   /              V        V
                 +--------------+           +---------------+ 
  RSVP-TE module | ietf-rsvp-te |o .        | ietf-te-mpls  |
                 +--------------+   \       +---------------+
                    ^                \       o                   
                    |                 \      +-----------------+
                    |                  \     | ietf-te-sr-mpls |
                    |                   \    +-----------------+
                    |                    \                   
                    o                 +-------------------+  
                 +-----------+        | ietf-rsvp-otn-te  |  
  RSVP module    | ietf-rsvp |        +-------------------+  
                 +-----------+           RSVP-TE with OTN
                                         extensions
                                        (shown for illustration
                                         not in this document)

~~~
{: #figctrl title="Relationship of TE module(s) with other signaling protocol modules"}

~~~
          +---------+
          | ietf-te |       ^: import
          +---------+       o: augment
        import ^
               |
               |
         +---------------+
         | ietf-te-types |
         +---------------+
            o          o
            |            \
            |             \
    +-------------------+  +-------------------+
    | ietf-te-mpls-types |  | ietf-te-otn-types |
    +-------------------+  +-------------------+
                            (shown for illustration
                             not in this document)
~~~
{: #figtypes title="Relationship between generic and technology specific TE types modules"}


## Design Considerations

The following considerations with respect data organization are taken into account:

* reusable data elements are grouped into separate TE types module(s) that can be readily imported
by other modules whenever needed
* reusable TE data types that are data plane independent are grouped in the TE generic types module
"ietf-te-types.yang"
* reusable TE data elements that are data plane specific (e.g. packet MPLS or switching technologies
as defined in {{?RFC3473}}) are expected to be grouped in a technology-
specific types module, e.g. "ietf-te-mpls-types.yang". It is expected that technology specific types will augment
TE generic types as shown in {{figtypes}}
* The TE generic model contains device independent data and can be used to model data off a device (e.g. on a controller).
 The TE data that is device-specific are grouped in a separate module as shown in {{figctrl}}.
* In general, little information in the model is designated as "mandatory", to allow freedom to vendors to
adapt the data model to their specific product implementation.


## Optional Features

Optional features that are beyond the base TE model are left to the specific vendor
to decide support using vendor model augmentation and/or using feature checks.

This model declares a number of TE functions as features (such as P2MP-TE, soft-preemption
etc.).

## Configuration Inheritance

The defined data model supports configuration inheritance for tunnels, paths, and interfaces.
Data elements defined in the main container (e.g. that encompasses the list of tunnels,
interfaces, or paths) are assumed to apply equally to all elements of the list, unless overridden explicitly
for a certain element of a list (e.g. a tunnel, interface or path).

# TE Generic Model Organization

The TE generic model covers configuration, state, RPCs, and notifications data pertaining to
TE global parameters, interfaces, tunnels and LSPs parameters that are device independent.

The container "te" is the top level container in this data model.  The presence of this container is
expected to enable TE function system wide.

The model follows the guidelines in for modeling the intended,
applied and derived state.

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
   +---x globals-rpc
   +---x tunnels-rpc
notifications:
   +---n globals-notif
   +---n tunnels-notif
~~~~~~~~~~~
{: #fig-highlevel title="TE generic highlevel model view"}

## Global Configuration and State Data

This branch of the data model covers configurations that control TE features behavior system-wide,
and its respective state. Examples of such configuration data are:

* Table of named SRLG mappings
* Table of named (extended) administrative groups mappings
* Table of named explicit paths to be referenced by TE tunnels
* Table of named path-constraints sets
* Auto-bandwidth global parameters
* TE diff-serve TE-class maps
*  System-wide capabilities for LSP reoptimization (included in the TE device model)
    * Reoptimization timers (periodic interval, LSP installation and cleanup)
*  System-wide capabilities for TE state flooding (included in the TE device model)
    * Periodic flooding interval
*  Global capabilities that affect the originating,
   traversing and terminating LSPs.  For example:
    * Path selection parameters (e.g. metric to optimize, etc.)
    * Path or segment protection parameters

The global state data is represented under the global "state" sub-container as shown in {{fig-highlevel}}.

Examples of such states are:

* Global statistics (signaling, admission, preemption, flooding)
* Global counters (number of tunnels/LSPs/interfaces)

## Interfaces Configuration and State Data

This branch of the model covers configuration and state data items
corresponding to TE interfaces that are present on a specific device.
A new module is introduced that holds the TE device specific properties.

Examples of TE interface properties are:

* Maximum reservable bandwidth, bandwidth constraints (BC)
* Flooding parameters
   * Flooding intervals and threshold values
* Fast reroute backup tunnel properties (such as static, auto-tunnel)
* interface attributes
   * (Extended) administrative groups
   * SRLG values
   * TE metric value

The state corresponding to the TE interfaces applied
configuration, protocol derived state, and stats and counters all fall under
the interface "state" sub-container as shown in {{fig-if-te-state}} below:

~~~~~~~~~~~
module: ietf-te
   +--rw te!
      +--rw interfaces
         .
         +-- rw te-attributes
             +-- rw config
                <<intended configuration>>
             .
             +-- ro state
                <<applied configuration>>
                <<derived state associated with the TE interface>>
~~~~~~~~~~~
{: #fig-if-te-state title="TE interface state"}

This covers state data for TE interfaces such as:

* Bandwidth information: maximum bandwidth, available bandwidth
  at different priorities and for each class-type (CT)
* List of admitted LSPs
    * Name, bandwidth value and pool, time, priority
* Statistics: state counters, flooding counters, admission
  counters (accepted/rejected), preemption counters
* Adjacency information
    * Neighbor address
    * Metric value

## Tunnels Configuration and State Data

This branch of the model covers intended, and
corresponding applied configuration for tunnels. As well, it holds
possible derived state pertaining to TE tunnels.

~~~~~~~~~~~
module: ietf-te
   +--rw te!
      +--rw tunnels
         .
         +-- rw config
            <<intended configuration>>
         .
         +-- ro state
            <<applied configuration>>
            <<derived state associated with the tunnel>>
~~~~~~~~~~~
{: #fig-tunnel-te-state title="TE interface state tree"}

Examples of tunnel configuration date for TE tunnels:

* Name and type (e.g. P2P, P2MP) of the TE tunnel
* Admin-state
* Set of primary and corresponding secondary paths
* Routing usage (auto-route announce, forwarding adjacency)
* Policy based routing (PBR) parameters

### Tunnel Compute-Only Mode

By default, a configured TE tunnel is provisioned so it can carry traffic as soon as a valid path is computed and an LSP instantiated in the network. In other cases,
a TE tunnel may be provisioned for computed path reporting purposes without the need to instantiate an LSP or commit resources in the network. In such a case, a tunnel
configuration in "compute-only" mode to distinguish it from default tunnel behavior.

A "compute-only" TE tunnel is configured as a usual TE tunnel with associated path constraint(s) and properties on a device or controller. The device or controller is expected to
compute the feasible path(s) subject to configured constraints for of "compute-only" tunnel and reflect the computed path(s) in the LSP(s) Record-Route Object (RRO) list.
A client may query "on-demand" the "compute-only" TE tunnel computed path(s) properties by querying the state of the tunnel. Alternatively,
the client can subscribe on the "compute-only" TE tunnel to be notified of computed path(s) and whenever it changes.

### Tunnel Hierarchical Link Endpoint

TE LSPs can be set up in MPLS or Generalized MPLS (GMPLS) networks to be used to form links to carry traffic in in other (client) networks {{RFC6107}}.
In this case, the model introduces the TE tunnel hierarchical link endpoint parameters to identify the specific link in the client layer that the TE tunnel
is associated with.

## TE LSPs State Data

TE LSPs are derived state data that is usually instantiated via signaling protocols. TE LSPs exists on routers as ingress (starting point of LSP), transit (mid-point of LSP ), or egress (termination point of the LSP).
TE LSPs are distinguished by the 5 tuple, and LSP type (P2P or P2MP). In the model, the nodes holding LSPs data exist in the read-only lsps-state list as show in {{fig-globals-tree}}.

## Global RPC Data

This branch of the model covers system-wide RPC execution data to trigger actions and optionally
expect responses. Examples of such TE commands are to:

* Clear global TE statistics of various features

## Interface RPC Data

This collection of data in the model defines TE interface RPC execution commands. Examples of these
are to:

* Clear TE statistics for all or for individual TE interfaces
* Trigger immediate flooding for one or all TE interfaces

## Tunnel RPC Data

This branch of the model covers TE tunnel RPC execution data to trigger actions and optionally
expect responses. Examples of such TE commands are:

* Clear statistics for all or for individual tunnels
* Trigger the tear and setup of existing tunnels or LSPs.

## Global Notifications Data

This branch of the model covers system-wide notifications data.
The node notifies the registered events to the server using the defined notification messages.

## Interfaces Notifications Data

This branch of the model covers TE interfaces related notifications data. The TE interface configuration
is used for specific events registration.  Notifications are sent for registered events to the server.
Example events for TE interfaces are:

* Interface creation and deletion
* Interface state transitions
* (Soft) preemption triggers
* Fast reroute activation

## Tunnel Notification Data

This branch of the model covers TE tunnels related notifications data. The TE tunnels configuration
is used for specific events registration. Notifications are sent for registered events to the server.
Example events for TE tunnels are:

   * Tunnel creation and deletion events
   * Tunnel state up/down changes
   * Tunnel state reoptimization changes

Figure {{fig-globals-tree}} below shows the tree diagram of the YANG model defined in modules: ietf-te.yang,
ietf-te-device.yang, ietf-te-mpls.yang, and ietf-te-sr.yang.

~~~~~~~~~~~
{::include /Users/tsaad/yang/sept/te/ietf-te-all.tree}
~~~~~~~~~~~
{: #fig-globals-tree title="TE generic model configuration and state tree"}


# TE Generic and Helper YANG Modules

~~~~
<CODE BEGINS> file "ietf-te-types@2017-10-29.yang"
{::include /Users/tsaad/yang/sept/te/ietf-te-types.yang}
<CODE ENDS>
~~~~
{: #fig-basic-types title="TE basic types YANG module"}

~~~~~~~~~~
<CODE BEGINS> file "ietf-te@2017-10-29.yang"
{::include /Users/tsaad/yang/sept/te/ietf-te.yang}
<CODE ENDS>
~~~~~~~~~~
{: #fig-basic-te title="TE generic YANG module"}


~~~~~~~~~~
<CODE BEGINS> file "ietf-te-device@2017-10-29.yang"
{::include /Users/tsaad/yang/sept/te/ietf-te-device.yang}
<CODE ENDS>
~~~~~~~~~~
{: #fig-basic-mpls-types title="TE MPLS specific types YANG module"}

~~~~~~~~~~
<CODE BEGINS> file "ietf-te-mpls@2017-10-29.yang"
{::include /Users/tsaad/yang/sept/te/ietf-te-mpls.yang}
<CODE ENDS>
~~~~~~~~~~
{: #fig-mpls-te title="TE MPLS YANG module"}

~~~~~~~~~~
<CODE BEGINS> file "ietf-te-mpls-types@2017-10-29.yang"
{::include /Users/tsaad/yang/sept/te/ietf-te-mpls-types.yang}
<CODE ENDS>
~~~~~~~~~~
{: #fig-mpls-te-types title="TE MPLS types YANG module"}


~~~~~~~~~~
<CODE BEGINS> file "ietf-te-sr-mpls@2017-10-29.yang"
{::include /Users/tsaad/yang/sept/te/ietf-te-sr-mpls.yang}
<CODE ENDS>
~~~~~~~~~~
{: #fig-mpls-te-sr title="SR TE MPLS YANG module"}

# IANA Considerations

This document registers the following URIs in the IETF XML registry
{{!RFC3688}}.
Following the format in {{RFC3688}}, the following registration is
requested to be made.

   URI: urn:ietf:params:xml:ns:yang:ietf-te
   XML: N/A, the requested URI is an XML namespace.

   URI: urn:ietf:params:xml:ns:yang:ietf-te-device
   XML: N/A, the requested URI is an XML namespace.

   URI: urn:ietf:params:xml:ns:yang:ietf-te-mpls
   XML: N/A, the requested URI is an XML namespace.

   URI: urn:ietf:params:xml:ns:yang:ietf-te-sr-mpls
   XML: N/A, the requested URI is an XML namespace.

   URI: urn:ietf:params:xml:ns:yang:ietf-te-types
   XML: N/A, the requested URI is an XML namespace.

   URI: urn:ietf:params:xml:ns:yang:ietf-te-mpls-types
   XML: N/A, the requested URI is an XML namespace.

This document registers a YANG module in the YANG Module Names
registry {{RFC6020}}.

   name:       ietf-te
   namespace:  urn:ietf:params:xml:ns:yang:ietf-te
   prefix:     ietf-te
   reference:  RFC3209

   name:       ietf-te-device
   namespace:  urn:ietf:params:xml:ns:yang:ietf-te
   prefix:     ietf-te-device
   reference:  RFC3209

   name:       ietf-te-mpls
   namespace:  urn:ietf:params:xml:ns:yang:ietf-te-mpls
   prefix:     ietf-te-mpls
   reference:  RFC3209

   name:       ietf-te-sr-mpls
   namespace:  urn:ietf:params:xml:ns:yang:ietf-te-sr-mpls
   prefix:     ietf-te-sr-mpls

   name:       ietf-te-types
   namespace:  urn:ietf:params:xml:ns:yang:ietf-te-types
   prefix:     ietf-te-types
   reference:  RFC3209

   name:       ietf-te-mpls-types
   namespace:  urn:ietf:params:xml:ns:yang:ietf-te-mpls-types
   prefix:     ietf-te-mpls-types
   reference:  RFC3209

# Security Considerations

The YANG module defined in this memo is designed to be accessed via
the NETCONF protocol {{!RFC6241}}.  The lowest NETCONF layer is the
secure transport layer and the mandatory-to-implement secure
transport is SSH {{!RFC6242}}.  The NETCONF access control model
{{!RFC6536}} provides means to restrict access for particular NETCONF

users to a pre-configured subset of all available NETCONF protocol
operations and content.

There are a number of data nodes defined in the YANG module which are
writable/creatable/deletable (i.e., config true, which is the
default).  These data nodes may be considered sensitive or vulnerable
in some network environments.  Write operations (e.g., \<edit-config\>)
to these data nodes without proper protection can have a negative
effect on network operations.  Following are the subtrees and data
nodes and their sensitivity/vulnerability:

"/te/globals":  This module specifies the global TE configurations
on a device.  Unauthorized access to this container could cause the device
to ignore packets it should receive and process.

"/te/tunnels":  This list specifies the configured TE
tunnels on a device.  Unauthorized access to this list could cause
the device to ignore packets it should receive and process.

"/te/lsps-state":  This list specifies the state derived LSPs.
Unauthorized access to this list could cause
the device to ignore packets it should receive and process.

"/te/interfaces":  This list specifies the configured TE interfaces on
a device.  Unauthorized access to this list could cause the device to
ignore packets it should receive and process.

# Acknowledgement

The authors would like to thank the  members of the multi-vendor YANG design team 
who are involved in the definition of this model.

The authors would also like to thank Loa Andersson, Lou Berger, Sergio Belotti,
Italo Busi, Aihua Guo, Dhruv Dhody, Anurag Sharma, and Xian Zhang for their 
comments and providing valuable feedback on this document.

# Contributors

~~~~

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
