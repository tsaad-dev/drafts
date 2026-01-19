---
title: A YANG Data Model for RSVP-TE Protocol
abbrev: RSVP-TE Protocol YANG Data Model
docname: draft-ietf-teas-yang-rsvp-te-10
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
    organization: Cisco Systems, Inc.
    email: tsaad.net@gmail.com

 -
    ins: R. Gandhi
    name: Rakesh Gandhi
    organization: Cisco Systems, Inc.
    email: rgandhi@cisco.com

 -
   ins: X. Liu
   name: Xufeng Liu
   organization: Volta Networks
   email: xufeng.liu.ietf@gmail.com

 -
    ins: I. Bryskin
    name: Igor Bryskin
    organization: Individual
    email: i_bryskin@yahoo.com

 -
    ins: H. Shah
    name: Himanshu Shah
    organization: Ciena
    email: hshah@ciena.com

normative:
  RFC2119:
  RFC6020:
  RFC6241:
  RFC6991:
  RFC2205:
  I-D.ietf-teas-yang-te:
  I-D.ietf-teas-yang-rsvp:

informative:

--- abstract

This document defines a YANG data model for the configuration and management of
RSVP (Resource Reservation Protocol) to establish Traffic-Engineered (TE)
Label-Switched Paths (LSPs) for MPLS (Multi-Protocol Label Switching) and other
technologies.

The model defines a generic RSVP-TE module for signaling LSPs that are
technology agnostic.  The generic RSVP-TE module is to be augmented by
technology specific RSVP-TE modules that define technology specific data. This
document also defines the augmentation for RSVP-TE MPLS LSPs model.

This model covers data for the configuration, operational state, remote
procedural calls, and event notifications.

--- middle

# Introduction

YANG {{!RFC7950}} is a data modeling language that was introduced to define the
contents of a conceptual data store that allows networked devices to be managed
using NETCONF {{!RFC6241}}. YANG has proved relevant beyond its initial
confines, as bindings to other interfaces (e.g. RESTCONF {{!RFC8040}}) and
encoding other than XML (e.g. JSON) are being defined. Furthermore, YANG data
models can be used as the basis of implementation for other interfaces, such as
CLI and programmatic APIs.

This document defines a generic YANG data model for configuring and managing
RSVP-TE LSP(s) {{?RFC3209}}.  The RSVP-TE generic model augments the RSVP base
and extended models defined in {{I-D.ietf-teas-yang-rsvp}}, and adds TE
extensions to the RSVP protocol {{RFC2205}} model configuration and state data.
The technology specific RSVP-TE models augment the generic RSVP-TE model with
additional technology specific parameters. For example, this document also
defines the MPLS RSVP-TE model for configuring and managing MPLS RSVP TE
LSP(s).

In addition to augmenting the RSVP YANG module, the modules defined in this
document augment the TE Interfaces, Tunnels and LSP(s) YANG module defined in
{{I-D.ietf-teas-yang-te}} to define additional parameters to enable signaling
for RSVP-TE.

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
 | te            | ietf-te            | [I-D.ietf-teas-yang-te]       |
 | rsvp          | ietf-rsvp          | [I-D.ietf-teas-yang-rsvp]     |
 | te-dev        | ietf-te-device     | [I-D.ietf-teas-yang-te]       |
 | te-types      | ietf-te-types      | [I-D.ietf-teas-yang-te-types] |
 | te-mpls-types | ietf-te-mpls-types | [I-D.ietf-teas-yang-te-types] |
 | rsvp-te       | ietf-rsvp-te       | this document                 |
 | rsvp-te-mpls  | ietf-rsvp-te-mpls  | this document                 |
 +---------------+--------------------+-------------------------------+

            Table 1: Prefixes and corresponding YANG modules
~~~~~~~~~~

# Model Overview

The RSVP-TE generic model augments the RSVP base and extended YANG models
defined in {{I-D.ietf-teas-yang-rsvp}}. It also augments the TE tunnels and
interfaces module defined in {{I-D.ietf-teas-yang-te}} to cover parameters
specific to the configuration and management of RSVP-TE interfaces, tunnels and
LSP(s).

The RSVP-TE MPLS YANG model augments the RSVP-TE generic model with parameters
to configure and manage signaling of MPLS RSVP-TE LSPs.  RSVP-TE model
augmentation for other dataplane technologies (e.g. OTN or WDM) are outside the
scope of this document.

There are three types of configuration and state data nodes in module(s)
defined in this document:

* those augmenting or extending the base RSVP module that is defined in
  {{!I-D.ietf-teas-yang-rsvp}}
* those augmenting or extending the base TE module defined in
  {{I-D.ietf-teas-yang-te}}
* those that are specific to the RSVP-TE and RSVP-TE MPLS modules defined in
  this document.

## Module Relationship

The data pertaining to RSVP-TE in this document is divided into two modules: a
technology agnostic RSVP-TE module that holds generic parameters for RSVP-TE
applicable to all technologies, and a MPLS technology specific RSVP-TE module
that holds parameters specific to MPLS technology.

The relationship between the different modules is shown in {{figctrl}}.

~~~
  TE basic       +---------+
  module         | ietf-te |        o: augment
                 +---------+
                      o
                      |
                      |
                 +--------------+
  RSVP-TE module | ietf-rsvp-te |o . . .
                 +--------------+         \
                      |                    \
                      o                 +--------------------+
                 +-----------+          | ietf-rsvp-te-mpls  |
  RSVP module    | ietf-rsvp |          +--------------------+
                 +-----------+             RSVP-TE with MPLS
                      o
                      |
  RSVP extended       |
    module       +--------------------+
                 | ietf-rsvp-extended |
                 +--------------------+
~~~
{: #figctrl title="Relationship of RSVP and RSVP-TE modules with other
 protocol modules"}

## Model Tree Diagrams

A full tree diagram of the module(s) defined in this document as per the syntax
defined in {{!RFC8340}} are given in subsequent sections.

### RSVP-TE Model Tree Diagram

{{fig-rsvp-te}} shows the YANG tree diagram of the RSVP-TE generic YANG model
defined in module ietf-rsvp-te.yang.

~~~~~~~~~~
{::include ../../te/ietf-rsvp-te.yang.tree}
~~~~~~~~~~
{: #fig-rsvp-te title="RSVP-TE model Tree diagram"}

### RSVP-TE MPLS Model Tree Diagram

{{fig-rsvp-te-mpls-module}} shows the YANG tree diagram of the RSVP-TE MPLS
YANG model defined in module ietf-rsvp-te-mpls.yang and that augments RSVP-TE
module as well as RSVP and TE YANG modules.

~~~~~~~~~~
{::include ../../te/ietf-rsvp-te-mpls.yang.tree}
~~~~~~~~~~
{: #fig-rsvp-te-mpls title="RSVP-TE MPLS Tree diagram"}

## YANG Modules {#te-yang-mod}

### RSVP-TE YANG Module {#rsvp-te-yang-mod}

The RSVP-TE generic YANG module "ietf-rsvp-te" imports the following modules:

- ietf-rsvp defined in {{I-D.ietf-teas-yang-rsvp}}
- ietf-routing-types defined in {{!RFC8294}}
- ietf-te-types defined in {{!I-D.ietf-teas-yang-te-types}}
- ietf-te and ietf-te-dev defined in {{!I-D.ietf-teas-yang-te}}

This module references the following documents:
{{!I-D.ietf-teas-yang-rsvp}}, {{!RFC8349}}, {{!I-D.ietf-teas-yang-te}},
{{!I-D.ietf-teas-yang-te-types}}, {{?RFC2210}}, {{?RFC4920}},
{{?RFC5420}}, {{?RFC7570}}, {{?RFC4859}}.

~~~~~~~~~~
<CODE BEGINS> file "ietf-rsvp-te@2026-01-19.yang"
{::include ../../te/ietf-rsvp-te.yang}
<CODE ENDS>
~~~~~~~~~~
{: #fig-rsvp-te-module title="RSVP TE generic YANG module"}

### RSVP-TE MPLS YANG Module {#rsvp-te-mpls-yang-mod}

The RSVP-TE MPLS YANG module "ietf-rsvp-te-mpls" imports the following module(s):

- ietf-rsvp defined in {{I-D.ietf-teas-yang-rsvp}}
- ietf-routing-types defined in {{!RFC8294}}
- ietf-te-mpls-types defined in {{!I-D.ietf-teas-yang-te-types}}
- ietf-te and ietf-te-dev defined in {{!I-D.ietf-teas-yang-te}}

This module references the following documents:
{{!I-D.ietf-teas-yang-rsvp}}, {{!RFC8349}}, {{!I-D.ietf-teas-yang-te-types}},
{{!I-D.ietf-teas-yang-te}}, {{?RFC3209}}.

~~~~~~~~~~
<CODE BEGINS> file "ietf-rsvp-te-mpls@2026-01-19.yang"
{::include ../../te/ietf-rsvp-te-mpls.yang}
<CODE ENDS>
~~~~~~~~~~
{: #fig-rsvp-te-mpls-module title="RSVP TE MPLS YANG module"}

# IANA Considerations

This document registers the following URIs in the IETF XML registry {{!RFC3688}}.
Following the format in {{RFC3688}}, the following registration is
requested to be made.

~~~
   URI: urn:ietf:params:xml:ns:yang:ietf-rsvp-te
   Registrant Contact:  The IESG.
   XML: N/A, the requested URI is an XML namespace.

   URI: urn:ietf:params:xml:ns:yang:ietf-rsvp-te-mpls
   Registrant Contact:  The IESG.
   XML: N/A, the requested URI is an XML namespace.
~~~

This document registers two YANG modules in the YANG Module Names
registry {{RFC6020}}.

~~~
   name:       ietf-rsvp-te
   namespace:  urn:ietf:params:xml:ns:yang:ietf-rsvp-te
   prefix:     rsvp-te
   reference:  RFCXXXX

   name:       ietf-rsvp-te-mpls
   namespace:  urn:ietf:params:xml:ns:yang:ietf-rsvp-te-mpls
   prefix:     rsvp-te-mpls
   reference:  RFCXXXX
~~~

# Security Considerations

The YANG module defined in this memo is designed to be accessed via
the NETCONF protocol {{!RFC6241}}.  The lowest NETCONF layer is the
secure transport layer and the mandatory-to-implement secure
transport is SSH {{!RFC6242}}.  The NETCONF access control model
{{!RFC8341}} provides means to restrict access for particular NETCONF
users to a pre-configured subset of all available NETCONF protocol
operations and content.

There are a number of data nodes defined in the YANG module(s) defined
in this document which are
writable/creatable/deletable (i.e., config true, which is the
default).  These data nodes may be considered sensitive or vulnerable
in some network environments.  Write operations (e.g., \<edit-config\>)
to these data nodes without proper protection can have a negative
effect on network operations.

/rt:routing/rt:control-plane-protocols/rt:control-plane-protocol/rsvp:rsvp/globals:
The data nodes defined defined in this document and under this branch are applicable device-wide and can affect
all RSVP established sessions. Unauthorized access to this container can potentially
cause disruptive event(s) on all established sessions.

/rt:routing/rt:control-plane-protocols/rt:control-plane-protocol/
rsvp:rsvp/rsvp:globals/rsvp:sessions:
The data nodes defined in this document and under this branch are applicable to one or all RSVP-TE session(s).
Unauthorized access to this container can potentially affect the impacted RSVP session(s).

/rt:routing/rt:control-plane-protocols/rt:control-plane-protocol/rsvp:rsvp/rsvp:interfaces:
The data nodes defined defined in this document and under this branch are applicable to one or all RSVP interfaces.
Unauthorized access to this container can potentially affect established session(s)
over impacted interface(s).
      
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
