---
title: A YANG Data Model for Resource Reservation Protocol (RSVP)
abbrev: RSVP YANG Data Model
docname: draft-ietf-teas-yang-rsvp-09
date: 2018-05-8
category: std
ipr: trust200902
workgroup: TEAS Working Group
keyword: Internet-Draft

stand_alone: yes
pi: [toc, sortrefs, symrefs]

author:
 -
    ins: V. P. Beeram
    name: Vishnu Pavan Beeram
    organization: Juniper Networks
    email: vbeeram@juniper.net

 -
    ins: T. Saad
    name: Tarek Saad
    role: editor
    organization: Cisco Systems, Inc.
    email: tsaad@cisco.com

 -
    ins: R. Gandhi
    name: Rakesh Gandhi
    organization: Cisco Systems, Inc.
    email: rgandhi@cisco.com

 -
    ins: X. Liu
    name: Xufeng Liu
    organization: Jabil
    email: Xufeng_Liu@jabil.com

 -
    ins: I. Bryskin
    name: Igor Bryskin
    organization: Huawei Technologies
    email: Igor.Bryskin@huawei.com

 -
    ins: H. Shah
    name: Himanshu Shah
    organization: Ciena
    email: hshah@ciena.com


normative:
  RFC8349:
  RFC2119:
  RFC6020:
  RFC6241:
  RFC6991:
  RFC2205:

informative:
  I-D.ietf-teas-yang-rsvp-te:

--- abstract

This document defines a YANG data model for the configuration and management of RSVP Protocol. The model covers
the building blocks of the RSVP protocol that can be augmented and used by other RSVP extension models such as
RVSP extensions to Traffic-Engineering (RSVP-TE).
The model covers the configuration, operational state, remote procedural calls, and event notifications data.

--- middle

# Introduction

YANG {{!RFC6020}} is a data definition language that was introduced to define the contents of a conceptual
data store that allows networked devices to be managed using NETCONF {{RFC6241}}. YANG is proving relevant
beyond its initial confines, as bindings to other interfaces (e.g. ReST) and encoding other than XML
(e.g. JSON) are being defined. Furthermore, YANG data models can be used as the basis of implementation
for other interfaces, such as CLI and programmatic APIs.

This document defines a YANG data model that can be used to configure and manage the RSVP protocol {{RFC2205}}. This
model covers RSVP protocol building blocks that can be augmented and used by other RSVP extension
models-- such as for signaling RSVP-TE MPLS (or other technology specific) Label Switched Paths (LSP)s.


## Terminology

In this document, the key words "MUST", "MUST NOT", "REQUIRED",
"SHALL", "SHALL NOT", "SHOULD", "SHOULD NOT", "RECOMMENDED", "MAY",
and "OPTIONAL" are to be interpreted as described in BCP 14, RFC 2119
{{RFC2119}}.

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
            +-----------+--------------------+-----------+
            | Prefix    | YANG module        | Reference |
            +-----------+--------------------+-----------+
            | yang      | ietf-yang-types    | [RFC6991] |
            | inet      | ietf-inet-types    | [RFC6991] |
            | rt-type   | ietf-routing-types | XX        |
            | key-chain | ietf-key-chain     | XX        |
            +---------+----------------------+-----------+

            Table 1: Prefixes and corresponding YANG modules
~~~~~~~~~~


# Design Considerations

## Module Hierarchy

The RSVP base YANG module augments the "control-plane-protocol" list in ietf-routing {{RFC8349}}
module with specific RSVP parameters in an "rsvp" container. It also defines an extensiion identity
"rsvp" of base "rt:routing-protocol" to identify the RSVP protocol.

Some RSVP features are categorized as core to the function
of the protocol that are supported by most vendors claiming support for RSVP protocol. Such
features configuration and state are grouped in the RSVP base module.

Other extended RSVP features are categorized as either optional or providing knobs to better
tune basic functionality of the RSVP protocol. The support for extended RSVP features by all
vendors is considered optional. Such features are grouped in a separate RSVP extended module.

The augmentation of the RSVP model by other models (e.g. RSVP-TE for MPLS or other technologies)
are outside the scope of this document and are discussed in separate document(s), e.g. {{I-D.ietf-teas-yang-rsvp-te}}.

~~~
                +--------------+
       Routing  | ietf-routing |
                +--------------+
                      o
                      |
                 +-----------+ 
  RSVP module    | ietf-rsvp |
                 +-----------+
                      o
                      |
  RSVP extended       |
    module       +--------------------+
                 | ietf-rsvp-extended |
                 +--------------------+
~~~
{: #figctrl title="Relationship of RSVP and RSVP extended modules with other
 protocol modules"}


The RSVP base model does not aim to be feature complete. The primary intent is to cover a set
of standard core features that are commonly in use. For example:

* Authentication ({{!RFC2747}})
* Refresh Reduction ({{!RFC2961}})
* Hellos ({{!RFC3209}})
* Graceful Restart ({{!RFC3473}}, {{!RFC5063}})

The extended RSVP YANG model covers non-basic configuration(s) for RSVP feature(s)
as well as optional RSVP feature that are not a must for basic RSVP operation.

## Configuration Inheritance

The defined data model supports configuration inheritance for neighbors, and interfaces.
Data elements defined in the main container (e.g. the container that encompasses the list of interfaces,
or neighbors) are assumed to apply equally to all elements of the list, unless overridden explicitly
for a certain element (e.g. interface). Vendors are expected to augment the above container(s)
to provide the list of inheritance command for their implementations.

# Model Organization

This document divides the RSVP model into two modules: base and extended RSVP modules. Each module covers
configuration, state, notifications and RPCs data. The relationship between the different modules
is depicted in {{figctrl}}.

## RSVP Base YANG Model
The RSVP base YANG data model defines thee container "rsvp"  as the top level
container in this data model.  The presence of this container enables the RSVP protocol functionality.

Data for such state is contained under the respective "state" sub-container of the
intended object (e.g. interface) as shown in {{fig-highlevel}}.

~~~~~~~~~~~
module: ietf-rsvp
   +--rw rsvp!
      +--rw globals
         .
         .
      +--rw interfaces
            .
            +-- ro state
               <<derived state associated with interfaces>>
         .
         .
      +--rw neighbors
            .
            +-- ro state
               <<derived state associated with the tunnel>>
         .
         .
      +--rw sessions
            .
            +-- ro state
               <<derived state associated with the tunnel>>
         .
   rpcs:
      +--x global-rpc
      +--x interfaces-rpc
      +--x neighbors-rpc
      +--x sessions-rpc
   notifications:
      +--n global-notif
      +--n interfaces-notif
      +--n neighbors-notif
      +--n sessions-notif

~~~~~~~~~~~
{: #fig-highlevel title="RSVP high-level tree model view"}

The following subsections provide overview of the parts of the model pertaining to
configuration and state data.

Configuration and state data are organized into those applicable globally (node scope),
per interfaces, per neighbors, or per session.

### Global Data

The global data branch of the model covers configuration and state that are applicable the RSVP
protocol behavior.

### Interface Data

The interface data branch of the data model covers configuration and state elements relevant to one or all
RSVP interfaces. Any data configuration applied at the "interfaces" container level are equally
applicable to all interfaces -- unless overridden by explicit configuration under a specific interface.

### Neighbor Data

The neighbor data branch of the data model covers configuration and state elements relevant to
RSVP neighbors.

### Session Data

The sessions data branch covers configuration of elements relevant to RSVP sessions.

### Tree Diagram

~~~~~~~~~~~
{::include /Users/tsaad/yang/sept/te/ietf-rsvp.yang.tree}
~~~~~~~~~~~
{: #fig-rsvp-tree title="RSVP model tree diagram"}

### YANG Module {#rsvp-yang-mod}

~~~~~~~~~~
<CODE BEGINS> file "ietf-rsvp@2017-10-29.yang"
{::include /Users/tsaad/yang/sept/te/ietf-rsvp.yang}
<CODE ENDS>
~~~~~~~~~~

## RSVP Extended YANG Model

The RSVP extended YANG model covers optional or non-core RSVP feature(s). It also
covers feature(s) that are not necessarily supported by all vendors, and hence,
guarded with "if-feature" checks.

### Tree Diagram

{{fig-rsvp-extended}} shows the YANG tree representation for configuration and state data that is
augmenting the RSVP basic module:

~~~~~~~~~~
{::include /Users/tsaad/yang/sept/te/ietf-rsvp-extended.yang.tree}
~~~~~~~~~~
{: #fig-rsvp-extended title="RSVP extended model tree diagram"}

### YANG Module

{{fig-rsvp-extended-mod}} shows the RSVP extended YANG module:

~~~~~~~~~~
<CODE BEGINS> file "ietf-rsvp-extended@2017-10-29.yang"
{::include /Users/tsaad/yang/sept/te/ietf-rsvp-extended.yang}
<CODE ENDS>
~~~~~~~~~~
{: #fig-rsvp-extended-mod title="RSVP extended YANG module"}

# IANA Considerations

This document registers the following URIs in the IETF XML registry {{!RFC3688}}.
Following the format in {{RFC3688}}, the following registration is
requested to be made.

   URI: urn:ietf:params:xml:ns:yang:ietf-rsvp
   XML: N/A, the requested URI is an XML namespace.

   URI: urn:ietf:params:xml:ns:yang:ietf-rsvp-extended
   XML: N/A, the requested URI is an XML namespace.

This document registers a YANG module in the YANG Module Names
registry {{RFC6020}}.

   name:       ietf-rsvp
   namespace:  urn:ietf:params:xml:ns:yang:ietf-rsvp
   prefix:     ietf-rsvp
   reference:  RFC3209

   name:       ietf-rsvp-extended
   namespace:  urn:ietf:params:xml:ns:yang:ietf-rsvp-extended
   prefix:     ietf-rsvp-extendeed
   reference:  RFC3209

# Security Considerations

The YANG module defined in this memo is designed to be accessed via
the NETCONF protocol {{!RFC6241}}.  The lowest NETCONF layer is the
secure transport layer and the mandatory-to-implement secure
transport is SSH {{!RFC6242}}.  The NETCONF access control model
{{!RFC8341}} provides means to restrict access for particular NETCONF

users to a pre-configured subset of all available NETCONF protocol
operations and content.

There are a number of data nodes defined in the YANG module which are
writable/creatable/deletable (i.e., config true, which is the
default).  These data nodes may be considered sensitive or vulnerable
in some network environments.  Write operations (e.g., \<edit-config\>)
to these data nodes without proper protection can have a negative
effect on network operations.

# Acknowledgement

The authors would like to thank Lou Berger,  for reviewing and providing valuable feedback
on this document.

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

