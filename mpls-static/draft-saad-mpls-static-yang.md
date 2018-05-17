---
title: A YANG Data Model for MPLS Static LSPs
abbrev: MPLS Static LSPs YANG Data Model
docname: draft-ietf-mpls-static-yang-05
date: 2018-02-15
category: std
ipr: trust200902
workgroup: MPLS Working Group
keyword: Internet-Draft

stand_alone: yes
pi: [toc, sortrefs, symrefs]

normative:
  RFC8022:

informative:

author:

 -
    ins: T. Saad
    name: Tarek Saad
    organization: Cisco Systems, Inc.
    email: tsaad@cisco.com

 -
    ins: K. Raza
    name: Kamran Raza
    organization: Cisco Systems, Inc.
    email: skraza@cisco.com

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
    ins: V. P. Beeram
    name: Vishnu Pavan Beeram
    organization: Juniper Networks
    email: vbeeram@juniper.net

normative:

informative:

--- abstract

This document contains the specification for the MPLS Static Label Switched Paths (LSPs) YANG model. The model allows for
the provisioning of static LSP(s) on LER(s) and LSR(s) devices along a LSP path without the dependency on any signaling protocol.
The MPLS Static LSP model augments the MPLS base YANG model with specific data to configure and manage MPLS Static LSP(s).

--- middle

# Introduction

This document describes a YANG data model for configuring and managing the Static LSPs feature. The model allows
the configuration of LER and LSR devices with the necessary MPLS cross-connects or bindings to realize an
end-to-end LSP service.

A static LSP is established by manually specifying incoming and outgoing MPLS label(s) and necessary forwarding
information on each of the traversed Label Edge Router (LER) and Label Switched Router (LSR) devices 
(ingress, transit, or egress nodes) of the forwarding path.

For example, on an ingress LER device, the model is used to associate a specific Forwarding Equivalence Class
(FEC) of packets-- e.g. matching a specific IP prefix in a Virtual Routing or Forwarding (VRF) instance--
to an MPLS outgoing label imposition, next-hop(s) and respective outgoing interface(s) to forward the packet.
On an LSR device, the model is used to create a binding that
swaps the incoming label with an outgoing label and forwards the packet on one or multiple egress path(s).
On an egress LER, it is used to create a binding that decapsulates the incoming MPLS label and performs forwarding 
based on the inner MPLS label (if present) or IP forwarding in the packet.

The MPLS Static LSP YANG model is defined in module "ietf-mpls-static" and augments the MPLS Base YANG model defined
in module "ietf-mpls" in {{!I-D.saad-mpls-static-yang}}.

## Terminology

In this document, the key words "MUST", "MUST NOT", "REQUIRED",
"SHALL", "SHALL NOT", "SHOULD", "SHOULD NOT", "RECOMMENDED", "MAY",
and "OPTIONAL" are to be interpreted as described in BCP 14, RFC 2119
{{!RFC2119}}.

   The following terms are defined in {{!RFC6020}}:

   o  augment,

   o  configuration data,

   o  data model,

   o  data node,

   o  feature,

   o  mandatory node,

   o  module,

   o  schema tree,

   o  state data,

   o  RPC operation.

## Model Organization

The base MPLS Static LSP model covers the core features with the minimal set of configuration parameters needed to
manage and operate MPLS Static LSPs.

Additional MPLS Static LSP parameters as well as optional feature(s) are grouped in a separate MPLS Static LSP
extended model. The relationship between the MPLS base and other MPLS modules are shown in {{fig-mpls-relation}}.
 
~~~~~~~~~~~

  Routing RIB      +-----------+    v: import
  module           | ietf-rib  |    o: augment
                   +-----------+
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

## MPLS Static LSPs Model Tree Diagram

The MPLS Static and extendend LSP tree diagram is shown in {{fig-mpls-static-tree}}.

~~~~~~~~~~
{::include /Users/tsaad/yang/jun/te/ietf-mpls-static.yang.tree}
~~~~~~~~~~
{: #fig-mpls-static-tree title="MPLS Static LSP tree diagram"}

## MPLS Static LSP YANG Module(s)

The MPLS Static LSP module is shown in {{fig-module-mpls-static}}.

~~~
<CODE BEGINS> file "ietf-mpls-static@2017-07-02.yang"
{::include /Users/tsaad/yang/jun/te/ietf-mpls-static.yang}
<CODE ENDS>
~~~
{: #fig-module-mpls-static title="MPLS Static LSP YANG module"}


The extended MPLS Static LSP module is shown in {{fig-module-mpls-static-ext}}.

~~~~~~~~~~
<CODE BEGINS> file "ietf-mpls-static-extended@2017-07-02.yang"
{::include /Users/tsaad/yang/jun/te/ietf-mpls-static-extended.yang}
<CODE ENDS>
~~~~~~~~~~
{: #fig-module-mpls-static-ext title="Extended MPLS Static LSP YANG module"}

# IANA Considerations

This document registers the following URIs in the IETF XML registry
{{!RFC3688}}.
Following the format in {{RFC3688}}, the following registration is
requested to be made.

   URI: urn:ietf:params:xml:ns:yang:ietf-mpls-static
   XML: N/A, the requested URI is an XML namespace.

   URI: urn:ietf:params:xml:ns:yang:ietf-mpls-static-extended
   XML: N/A, the requested URI is an XML namespace.

This document registers two YANG modules in the YANG Module Names
registry {{RFC6020}}.

   name:       ietf-mpls-static
   namespace:  urn:ietf:params:xml:ns:yang:ietf-mpls-static
   prefix:     ietf-mpls-static
   reference:  RFC3031

   name:       ietf-mpls-static-exteneded
   namespace:  urn:ietf:params:xml:ns:yang:ietf-mpls-static-extended
   prefix:     ietf-mpls-static
   reference:  RFC3031

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

