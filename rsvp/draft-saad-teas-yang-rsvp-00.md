---
title: A YANG Data Model for RSVP-TE
abbrev: RSVP YANG Data Model
docname: draft-ietf-teas-yang-rsvp-te-02
date: 2017-10-29
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
  RFC3209:
  RFC2119:
  RFC6020:
  RFC6241:
  RFC6991:
  RFC2205:
  I-D.ietf-teas-yang-te:
  I-D.ietf-teas-yang-rsvp:

informative:
  I-D.draft-dsdt-nmda-guidelines-01:

--- abstract

This document defines a YANG data model for the configuration and management of RSVP (Resource
Reservation Protocol) to establish Traffic-Engineered (TE) Label-Switched Paths (LSPs) for
MPLS (Multi-Protocol Label Switching) and other technologies.

The model defines a generic RSVP-TE module for signaling LSPs that is technology agnostic.
The generic RSVP-TE module is to be augmented by technology specific RSVP-TE modules that define
technology specific data. This document defines the augmentation for RSVP-TE MPLS LSPs model.

This model covers data for the configuration, operational state, remote procedural calls, 
and event notifications.

--- middle

# Introduction

YANG {{!RFC6020}} is a data definition language that was introduced to define the contents of a
conceptual data store that allows networked devices to be managed using NETCONF {{RFC6241}}. YANG
is proving relevant beyond its initial confines, as bindings to other interfaces (e.g. ReST) and
encoding other than XML (e.g. JSON) are being defined. Furthermore, YANG data models can be used
as the basis of implementation for other interfaces, such as CLI and programmatic APIs.

This document defines a generic YANG data model for configuring and managing RSVP-TE LSP(s) {{RFC3209}}.
The RSVP-TE generic model augments the RSVP base and extended models defined in {{I-D.ietf-teas-yang-rsvp}}, 
and adds TE extensions to the RSVP protocol {{RFC2205}}
model configuration and state data. The technology specific RSVP-TE models augment
the generic RSVP-TE model with additional technology specific parameters. For example, this 
document also defines the MPLS RSVP-TE model for configuring and managing MPLS RSVP TE LSP(s).

In addition to augmenting the RSVP YANG module, the modules defined in this document augment
the TE Interfaces, Tunnels and LSP(s) YANG module defined in {{I-D.ietf-teas-yang-te}} to define
additional parameters to enable signaling for RSVP-TE.

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

# Design Considerations

## Module Hierarchy

The data pertaining to RSVP-TE in this document is divided into two modules: a technology agnostic
RSVP-TE module that holds generic parameters for RSVP-TE applicable to all technologies, and a
technology specific RSVP-TE module (e.g. for MPLS RSVP-TE) that holds parameters specific to the
technology.

This document defines YANG data models for RSVP-TE,
and RSVP-TE MPLS configuration, state, notification and RPCs.
The relationship between the different modules is depicted
in {{figctrl}}.

## State Data Organization

The Network Management Datastore Architecture (NMDA) {{I-D.dsdt-nmda-guidelines}} addresses the "OpState" that was discussed in the IETF.
As per NMDA guidelines for new models and models that are not concerned with the operational
state of configuration information, this revision of the draft adopts the NMDA proposal for 
configuration and state data of this model.


~~~
  TE basic       +---------+        ^: import
  module         | ietf-te |        o: augment
                 +---------+
                    |   o
                    |   |
                    v   |
                 +--------------+
  RSVP-TE module | ietf-rsvp-te |o . . .
                 +--------------+         \
                    ^   |                  \
                    |   o               +-------------------+
                 +-----------+          | ietf-rsvp-otn-te  |
  RSVP module    | ietf-rsvp |          +-------------------+
                 +-----------+             RSVP-TE with OTN
                      o                    extensions
                      |                   (shown for illustration
  RSVP extended       |                    not in this document)
    module       +--------------------+
                 | ietf-rsvp-extended |
                 +--------------------+
~~~
{: #figctrl title="Relationship of RSVP and RSVP-TE modules with other
 protocol modules"}

## RSVP-TE Generic Model {#rsvp-te-yang}

The RSVP-TE generic module augments the RSVP base and extended YANG modules defined in {{I-D.ietf-teas-yang-rsvp}}  as well as the TE tunnels
and interfaces module {{I-D.ietf-teas-yang-te}} to cover parameters specific to the configuration and
management of RSVP-TE interfaces, tunnels and LSP(s).

### Tree Diagram

There are three types of configuration and state data nodes in this module:

* those augmenting or extending the base RSVP module
* those augmenting or extending the base TE module
* those that are specific to the RSVP-TE module

Below is a YANG tree representation for data items defined in the RSVP-TE generic module:

~~~~~~~~~~
{::include /Users/tsaad/yang/sept/te/ietf-rsvp-te.yang.tree}
~~~~~~~~~~
{: #fig-rsvp-te title="RSVP-TE model Tree diagram"}

### YANG Module {#rsvp-te-yang-mod}

~~~~~~~~~~
<CODE BEGINS> file "ietf-rsvp-te@2017-10-29.yang"
{::include /Users/tsaad/yang/sept/te/ietf-rsvp-te.yang}
<CODE ENDS>
~~~~~~~~~~
{: #fig-rsvp-te-module title="RSVP TE generic YANG module"}

## RSVP-TE MPLS Model

The MPLS RSVP-TE YANG module augments the RSVP-TE
generic module with parameters to configure and manage signaling of MPLS RSVP-TE LSPs.
RSVP-TE YANG modules for other dataplane technologies (e.g. OTN or WDM) are outside the
scope of this document and are defined in other documents.

### Tree Diagram

The following are possible types of configuration and state data nodes in this module:

* those augmenting or extending the generic RSVP-TE module
* those augmenting or extending the TE module
* those that are specific to the RSVP-TE MPLS module

Below is a YANG tree representation for data items defined in the RSVP-TE MPLS module:

~~~~~~~~~~
{::include /Users/tsaad/yang/sept/te/ietf-rsvp-te-mpls.yang.tree}
~~~~~~~~~~
{: #fig-rsvp-te-mpls title="RSVP-TE MPLS Tree diagram"}

### YANG Module {#rsvp-te-mpls-yang-mod}

~~~~~~~~~~
<CODE BEGINS> file "ietf-rsvp-te-mpls@2017-10-29.yang"
{::include /Users/tsaad/yang/sept/te/ietf-rsvp-te-mpls.yang}
<CODE ENDS>
~~~~~~~~~~
{: #fig-rsvp-te-mpls-module title="RSVP TE MPLS YANG module"}

{{fig-rsvp-te-mpls-module}} shows the YANG tree representation of
the RSVP TE MPLS module that augments RSVP-TE module as well as RSVP
and TE YANG modules.

# IANA Considerations

This document registers the following URIs in the IETF XML registry {{!RFC3688}}.
Following the format in {{RFC3688}}, the following registration is
requested to be made.

   URI: urn:ietf:params:xml:ns:yang:ietf-rsvp-te
   XML: N/A, the requested URI is an XML namespace.

   URI: urn:ietf:params:xml:ns:yang:ietf-rsvp-te-mpls
   XML: N/A, the requested URI is an XML namespace.

This document registers a YANG module in the YANG Module Names
registry {{RFC6020}}.

   name:       ietf-rsvp
   namespace:  urn:ietf:params:xml:ns:yang:ietf-rsvp-te
   prefix:     ietf-rsvp
   reference:  RFC3209

   name:       ietf-rsvp-te
   namespace:  urn:ietf:params:xml:ns:yang:ietf-rsvp-te-mpls
   prefix:     ietf-rsvp-te
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
effect on network operations.

# Acknowledgement

The authors would like to thank Lou Berger for reviewing and providing valuable feedback
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
