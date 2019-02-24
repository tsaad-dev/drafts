---
title: A YANG Data Model for MPLS Static LSPs
abbrev: MPLS Static LSPs YANG Data Model
docname: draft-ietf-mpls-static-yang-08
date: 2019-02-24
category: std
ipr: trust200902
workgroup: MPLS Working Group
keyword: Internet-Draft

stand_alone: yes
pi: [toc, sortrefs, symrefs]

normative:
  I-D.ietf-teas-yang-te:

informative:

author:

 -
    ins: T. Saad
    name: Tarek Saad
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
    organization: Huawei Technologies
    email: Igor.Bryskin@huawei.com


normative:

informative:

--- abstract

This document contains the specification for the MPLS Static Label Switched
Paths (LSPs) YANG model. The model allows for the provisioning of static LSP(s)
on Label Edge Router(s) LER(s) and Label Switched Router(s) LSR(s) devices
along a LSP path without the dependency on any signaling protocol.  The MPLS
Static LSP model augments the MPLS base YANG model with specific data to
configure and manage MPLS Static LSP(s).

--- middle

# Introduction

This document describes a YANG {{!RFC7950}} data model for configuring and
managing the Multiprotocol Label Switching (MPLS) {{!RFC3031}} Static LSPs.
The model allows the configuration of LER and LSR devices with the necessary
MPLS cross-connects or bindings to realize an end-to-end LSP service.

A static LSP is established by manually specifying incoming and outgoing MPLS
label(s) and necessary forwarding information on each of the traversed LER and
LSR devices (ingress, transit, or egress nodes) of the forwarding path.

For example, on an ingress LER device, the model is used to associate a
specific Forwarding Equivalence Class (FEC) of packets-- e.g. matching a
specific IP prefix in a Virtual Routing or Forwarding (VRF) instance-- to an
MPLS outgoing label imposition, next-hop(s) and respective outgoing
interface(s) to forward the packet.  On an LSR device, the model is used to
create a binding that swaps the incoming label with an outgoing label and
forwards the packet on one or multiple egress path(s).  On an egress LER, it is
used to create a binding that decapsulates the incoming MPLS label and performs
forwarding based on the inner MPLS label (if present) or IP forwarding in the
packet.

The MPLS Static LSP YANG model is broken into two modules "ietf-mpls-static"
and "ietf-mpls-static-extended".  The "ietf-mpls-static" module covers basic
features for the configuration and management of unidirectional Static LSP(s),
while "ietf-mpls-static-extended" covers extended features like the
configuration and management of bidirectional Static LSP(s) and LSP admission
control.

The module "ietf-mpls-static" augments the MPLS Base YANG model defined in
module "ietf-mpls" in {{!I-D.ietf-mpls-base-yang}}.

## Terminology

The key words "MUST", "MUST NOT", "REQUIRED", "SHALL", "SHALL NOT", "SHOULD",
"SHOULD NOT", "RECOMMENDED", "NOT RECOMMENDED", "MAY", and "OPTIONAL" in this
document are to be interpreted as described in BCP 14 {{!RFC2119}} {{!RFC8174}}
when, and only when, they appear in all capitals, as shown here.

The terminology for describing YANG data models is found in {{!RFC7950}}.

## Acronyms and Abbreviations

> MPLS: Multiprotocol Label Switching

> LSP: Label Switched Path

> LSR: Label Switching Router

> LER: Label Edge Router

> FEC: Forwarding Equivalence Class

> NHLFE: Next Hop Label Forwarding Entry

> ILM: Incoming Label Map

# MPLS Static LSP Model

## Model Organization

The base MPLS Static LSP model covers the core features with the minimal set of
configuration parameters needed to manage and operate MPLS Static LSPs.

Additional MPLS Static LSP parameters as well as optional feature(s) are
grouped in a separate MPLS Static LSP extended model. The relationship between
the MPLS base and other MPLS modules are shown in {{fig-mpls-relation}}.
 
~~~~~~~~~~~

  Routing module   +---------------+    v: import
                   | ietf-routing  |    o: augment
                   +---------------+
                       o
                       |
                       v
  MPLS base        +-----------+    v: import
  module           | ietf-mpls |    o: augment
                   +-----------+
                      o          o
                      |           \
                      v            v
              +------------------+ +--------------------+
  MPLS Static | ietf-mpls-static | | ietf-mpls-ldp.yang | . . .
  LSP module  +------------------+ +--------------------+
                          o
                          |
                          v
                 +---------------------------+
 Extended MPLS   | ietf-mpls-static-extended |
 Static LSP      +---------------------------+
 module

~~~~~~~~~~~
{: #fig-mpls-relation title="Relationship between MPLS modules"}

## Model Tree Diagram

The MPLS Static and extended LSP tree diagram as per {{?RFC8340}} is shown in
{{fig-mpls-static-tree}}.

~~~~~~~~~~
{::include /Users/tsaad/yang/sept/te/ietf-mpls-static.tree}
~~~~~~~~~~
{: #fig-mpls-static-tree title="MPLS Static LSP tree diagram"}

## Model Overview

This document defines two YANG modules for MPLS Static LSP(s) configuration and
management: ietf-mpls-static.yang and ietf-mpls-static-extended.yang.

The ietf-mpls-static module contains the following high-level types and groupings:

static-lsp-ref:

> A YANG reference type for a static LSP that can be used by data models to reference
a configured static LSP.

in-segment:

> A YANG grouping that describes parameters of an incoming class of FEC associated with a specific LSP as described in the MPLS architecture document {{!RFC3031}}.
The model allows the following types of traffic to be mapped onto the static LSP on an ingress LER:

            o   Unlabeled traffic destined to a specific prefix
            o   Labeled traffic arriving with a specific label
            o   Traffic carried on a TE tunnel whose LSP is 
                statically created via this model.

out-segment:

> A YANG grouping that describes parameters for the forwarding path(s) and their associated attributes for an LSP.
The model allows for the following cases:

            o   single forwarding path or NHLFE
            o   multiple forwarding path(s) or NHLFE(s), each of which can
                serve a primary, backup or both role(s).

The ietf-mpls-static-extended module contains the following high-level types and groupings:

bidir-static-lsp:

> A YANG grouping that describes list of static bidirectional LSPs

The ietf-mpls-static-extended augments the ietf-mpls-static model with
additional parameters to configure and manage:

 * Bidirectional Static LSP(s)
 * Defining Static LSP bandwidth allocation
 * Defining Static LSP preemption priorities

## Model YANG Module(s)

Configuring LSPs through an LSR/LER involves the following steps:

-  Enabling MPLS on MPLS capable interfaces.
-  Configuring in-segments and out-segments on LER(s) and LSR(s) traversed by the LSP.
-  Setting up the cross-connect per LSP to associate segments and/or to
   indicate connection origination and termination.
-  Optionally specifying label stack actions.
-  Optionally specifying segment traffic parameters.

The objects covered by this model are derived from the Incoming Label Map (ILM)
and Next Hop Label Forwarding Entry (NHLFE) as specified in the MPLS
architecture document {{!RFC3031}}.

The ietf-mpls-static module imports the followinig modules:

- ietf-inet-types defined in {{!RFC6991}}
- ietf-routing defined in {{!RFC8349}}
- ietf-routing-types defined in {{!RFC8294}}
- ietf-interfaces defined in {{!RFC8343}}
- ietf-mpls defined in {{!I-D.ietf-mpls-base-yang}}
- ietf-te defined in {{!I-D.ietf-teas-yang-te}}

The ietf-mpls-static module is shown below:

~~~
<CODE BEGINS> file "ietf-mpls-static@2019-02-24.yang"
{::include /Users/tsaad/yang/sept/te/ietf-mpls-static.yang}
<CODE ENDS>
~~~

The ietf-mpls-static-extended module imports the followinig modules:

- ietf-mpls defined in {{!I-D.ietf-mpls-base-yang}}
- ietf-mpls-static defined in this document
- ietf-routing defined in {{!RFC8349}}

The ietf-mpls-static-extended module is shown below:

~~~~~~~~~~
<CODE BEGINS> file "ietf-mpls-static-extended@2019-02-24.yang"
{::include /Users/tsaad/yang/sept/te/ietf-mpls-static-extended.yang}
<CODE ENDS>
~~~~~~~~~~

# IANA Considerations

This document registers the following URIs in the IETF XML registry
{{!RFC3688}}.
Following the format in {{RFC3688}}, the following registration is
requested to be made.

~~~
   URI: urn:ietf:params:xml:ns:yang:ietf-mpls-static
   Registrant Contact: The MPLS WG of the IETF.
   XML: N/A, the requested URI is an XML namespace.

   URI: urn:ietf:params:xml:ns:yang:ietf-mpls-static-extended
   Registrant Contact: The MPLS WG of the IETF.
   XML: N/A, the requested URI is an XML namespace.

~~~

This document registers two YANG modules in the YANG Module Names
registry {{!RFC6020}}.

~~~
   name:       ietf-mpls-static
   namespace:  urn:ietf:params:xml:ns:yang:ietf-mpls-static
   prefix:     ietf-mpls-static
   // RFC Ed.: replace XXXX with RFC number and remove this note
   reference:  RFCXXXX

   name:       ietf-mpls-static-extended
   namespace:  urn:ietf:params:xml:ns:yang:ietf-mpls-static-extended
   prefix:     ietf-mpls-static-extended
   // RFC Ed.: replace XXXX with RFC number and remove this note
   reference:  RFCXXXX
~~~

# Security Considerations


The YANG modules specified in this document define schemas for data
that is designed to be accessed via network management protocols such
as NETCONF {{!RFC6241}} or RESTCONF {{!RFC8040}}.  The lowest NETCONF layer
is the secure transport layer, and the mandatory-to-implement secure
transport is Secure Shell (SSH) {{!RFC6242}}.  The lowest RESTCONF layer
is HTTPS, and the mandatory-to-implement secure transport is TLS
{!RFC8446}}.

The NETCONF access control model {{!RFC8341}} provides the means to
restrict access for particular NETCONF or RESTCONF users to a
preconfigured subset of all available NETCONF or RESTCONF protocol
operations and content.

All nodes defined in this YANG module that are
writable/creatable/deletable (i.e., config true, which is the
default) may be considered sensitive or vulnerable
in some network environments. Write operations (e.g., edit-config) to these
data nodes without proper protection can have a negative effect on network
operations. These are the subtrees and data nodes and their
sensitivity/vulnerability:

o /ietf-routing:routing/ietf-mpls:mpls:/ietf-mpls:static-lsps: This entire
subtree is related to security.

An administrator needs to restrict write access to all configurable
objects within this data model.

# Contributors

~~~~

   Himanshu Shah
   Ciena
   email: hshah@ciena.com

   Kamran Raza
   Cisco Systems, Inc.
   email: skraza@cisco.com

~~~~
