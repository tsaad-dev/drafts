---
title: Traffic Engineering Common YANG Types
abbrev: TE Common YANG Types
docname: draft-ietf-teas-yang-te-types-09
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
    organization: Huawei Technologies
    email: Igor.Bryskin@huawei.com

normative:
  RFC2119:
  RFC8174:
  RFC6020:
  RFC6241:
  RFC8294:
  RFC6991:
  RFC7951:
  RFC7950:
  RFC8345:
  RFC3688:

informative:
  RFC3209:
  RFC7308:
  RFC6511:
  RFC5541:
  RFC3272:
  RFC4657:
  RFC5817:
  RFC4328:
  RFC6004:
  RFC6205:
  RFC7139:
  RFC7551:
  RFC7571:
  RFC7579:
  RFC3471:
  RFC3477:
  RFC3785:
  RFC4124:
  RFC4202:
  RFC7471:
  RFC8570:
  RFC7823:
  RFC6370:
  RFC5003:
  RFC3630:
  RFC6827:
  RFC5305:
  RFC6119:
  RFC4203:
  RFC5307:
  RFC6378:
  RFC4427:
  RFC4090:
  RFC4561:
  RFC4736:
  RFC5712:
  RFC4920:
  RFC5420:
  RFC7570:
  RFC4875:
  RFC5151:
  RFC5150:
  RFC6001:
  RFC6790:
  RFC7260:
  RFC8001:
  RFC8149:
  RFC8169:
  RFC6780:
  RFC4872:
  RFC4873:


[comment]: #   G.873.1:
[comment]: #     target: https://www.itu.int/rec/T-REC-G.873.1
[comment]: #     title: "G.8131 : Linear protection switching for MPLS transport profile"
[comment]: #     date: 2014-07-07
[comment]: #   G.8131:
[comment]: #     target: https://www.itu.int/rec/T-REC-G.8131
[comment]: #     title: "G.8131 : Linear protection switching for MPLS transport profile"
[comment]: #     date: 2014-07-07
[comment]: #   G.8031:
[comment]: #     target: https://www.itu.int/rec/T-REC-G.8031
[comment]: #     title: "G.8031 : Ethernet linear protection switching"
[comment]: #     date: 2015-01-13
[comment]: #   G808:
[comment]: #     target: https://www.itu.int/rec/T-REC-G.808
[comment]: #     title: "G.808: Terms and definitions for network protection and restoration"
[comment]: #     date: 2016-11-13


--- abstract

This document defines a collection of common data types and groupings in YANG data modeling language.
These derived common types and groupings are intended to be imported by modules that model
Traffic Engineering (TE) configuration and state capabilities.

--- middle

# Introduction

YANG {{RFC6020}} and {{RFC7950}} is a data modeling language used to model
configuration data, state data, Remote Procedure Calls, and
notifications for network management protocols such as NETCONF {{RFC6241}}.
The YANG language supports a small set of built-in data types and provides mechanisms
to derive other types from the built-in types.

This document introduces a collection of common data types derived
from the built-in YANG data types.  The derived types and groupings 
are designed to be the common types applicable for modeling Traffic Engineering (TE) features
in model(s) defined outside of this document.

## Terminology

The key words "MUST", "MUST NOT", "REQUIRED", "SHALL", "SHALL NOT", "SHOULD",
"SHOULD NOT", "RECOMMENDED", "NOT RECOMMENDED", "MAY", and "OPTIONAL" in this
document are to be interpreted as described in BCP 14 {{RFC2119}} {{RFC8174}}
when, and only when, they appear in all capitals, as shown here.

The terminology for describing YANG data models is found in {{RFC7950}}.

## Prefixes in Data Node Names

In this document, names of data nodes and other data model objects
are prefixed using the standard prefix associated with the
corresponding YANG imported modules, as shown in Table 1.

~~~~~~~~~~
        +-----------------+----------------------+---------------+
        | Prefix          | YANG module          | Reference     |
        +-----------------+----------------------+---------------+
        | yang            | ietf-yang-types      | [RFC6991]     |
        | inet            | ietf-inet-types      | [RFC6991]     |
        | rt-types        | ietf-routing-types   | [RFC8294]     |
        | te-types        | ietf-te-types        | this document |
        | te-packet-types | ietf-te-packet-types | this document |
        +-----------------+----------------------+---------------+

            Table 1: Prefixes and corresponding YANG modules
~~~~~~~~~~

# Acronyms and Abbreviations

> GMPLS: Generalized Multiprotocol Label Switching

> LSP: Label Switched Path

> LSR: Label Switching Router

> LER: Label Edge Router

> MPLS: Multiprotocol Label Switching

> RSVP: Resource Reservation Protocol

> TE: Traffic Engineering

> DS-TE: Differentiated Services Traffic Engineering

> SRLG: Shared Link Risk Group

> NBMA: Non-Broadcast Multiple-access Network

> APS: Automatic Protection Switching

> SD: Signal Degrade

> SF: Signal Fail

> WTR: Wait to Restore

> PM: Performance Metrics

# Overview

This document defines two YANG modules for common TE types:
ietf-te-types for TE generic types and ietf-te-packet-types for
packet specific types. Other technology specific TE types are outside the
scope of this document.

## TE Types Module Contents {#te-types-contents}

The ietf-te-types module contains common TE types that are independent and
agnostic of any specific technology or control plane instance.

The ietf-te-types module contains the following YANG reusable types and groupings:

te-bandwidth:

> A YANG grouping that defines the generic TE bandwidth.
  The modeling structure allows augmentation for each technology.
  For un-specified technologies, the string encoded te-bandwidth
  type is used.

te-label:

> A YANG grouping that defines the generic TE label.
  The modeling structure allows augmentation for each technology.
  For un-specified technologies, rt-types:generalized-label
  is used.

performance-metrics-attributes:

> A YANG grouping that defines one-way and two-way measured performance metrics and anomalous indication on link(s) or the path as defined in {{RFC7471}}, {{RFC8570}}, and {{RFC7823}}.

performance-metrics-throttle-container:

> A YANG grouping that defines configurable thresholds for advertisement suppression and measurement intervals.

te-ds-class:

> A type representing the Differentiated-Services (DS) Class-Type of traffic as defined in {{RFC4124}}.

te-label-direction:

> An enumerated type for specifying the forward or reverse direction
  of a label.

te-hop-type:

> An enumerated type for specifying hop as loose or strict.

te-global-id:

> A type representing the identifier that uniquely identify an operator, which can be
  either a provider or a client.
  The definition of this type is taken from {{RFC6370}} and {{RFC5003}}.
  This attribute type is used solely to provide a globally
  unique context for TE topologies.

te-node-id:

> A type representing the identifier for a node in a TE topology.
  The identifier is represented as 32-bit unsigned integer in
  the dotted-quad notation.
  This attribute MAY be mapped to the Router Address described
  in Section 2.4.1 of {{RFC3630}}, the TE Router ID described in
  Section 3 of {{RFC6827}}, the Traffic Engineering Router ID
  described in Section 4.3 of {{RFC5305}}, or the TE Router ID
  described in Section 3.2.1 of {{RFC6119}}.
  The reachability of such a TE node MAY be achieved by a
  mechanism such as Section 6.2 of {{RFC6827}}.


te-topology-id:

> A type representing the identifier for a topology.
  It is optional to have one or more prefixes at the beginning,
  separated by colons. The prefixes can be the network-types,
  defined in ietf-network {{RFC8345}}, to help user to understand the
  topology better before further inquiry.

te-tp-id:

> A type representing the identifier of a TE interface link termination endpoint (TP) on a specific TE node where the TE link connects.  This attribute is mapped to local or remote link identifier in {{RFC3630}} and {{RFC5305}}.

te-path-disjointness:

> A type representing the different resource disjointness options for a TE tunnel path as defined in {{RFC4872}}.

admin-groups:

> A union type for TE link's classic or extended administrative groups as defined in
  {{RFC3630}} and {{RFC5305}}.

srlg:

> A type representing the Shared Risk Link Group (SRLG) as defined in {{RFC4203}} and {{RFC5307}}.

te-metric:

> A type representing the TE link metric as defined in {{RFC3785}}.

te-recovery-status:

> An enumerated type for the different status of a recovery action as defined in {{RFC4427}} and {{RFC6378}}.

path-attribute-flags:

> A base YANG identity for supported LSP path flags as defined in {{RFC3209}}, {{RFC4090}}, {{RFC4736}}, {{RFC5712}}, {{RFC4920}}, {{RFC5420}}, {{RFC7570}}, {{RFC4875}}, {{RFC5151}}, {{RFC5150}}, {{RFC6001}}, {{RFC6790}}, {{RFC7260}}, {{RFC8001}}, {{RFC8149}}, and {{RFC8169}}.

link-protection-type:

> A base YANG identity for supported link protection types as defined in {{RFC4872}}, {{RFC4427}}

restoration-scheme-type:

> A base YANG identity for supported LSP restoration schemes as defined in {{RFC4872}}.

protection-external-commands:

> A base YANG identity for supported protection external commands for trouble shooting  purposes as defined in {{RFC4427}}.

association-type:

> A base YANG identity for supported Label Switched Path (LSP) association types as defined
  in {{RFC6780}}, {{RFC4872}}, {{RFC4873}}.

objective-function-type:

> A base YANG identity for supported path computation objective functions as defined in
  {{RFC5541}}.

te-tunnel-type:

> A base YANG identity for supported TE tunnel types as defined in {{RFC3209}} and {{RFC4875}}.

lsp-encoding-types:

>  base YANG identity for supported LSP encoding types as defined in {{RFC3471}}.

lsp-protection-type:

> A base YANG identity for supported LSP protection types as defined in {{RFC4872}} and {{RFC4873}}.

switching-capabilities:

> A base YANG identity for supported interface switching capabilities as defined in {{RFC3471}}.

resource-affinities-type:

> A base YANG identity for supported attribute filters associated with a tunnel that must be satisfied for a link to be acceptable as defined in {{?RFC2702}} and {{RFC3209}}.

path-metric-type:

> A base YANG identity for supported path metric types as defined in {{RFC3785}} and {{RFC7471}}.

explicit-route-hop:

> A YANG grouping that defines supported explicit routes as defined in {{RFC3209}} and {{RFC3477}}.

te-link-access-type:

> An enumerated type for the different TE link access types as defined in {{RFC3630}}.

## Packet TE Types Module Contents

The ietf-te-packet-types module covers the common types and groupings specific packet technology.

The ietf-te-packet-types module contains the following YANG reusable types and groupings:

backup-protection-type:

> A base YANG identity for supported protection types that a backup or bypass tunnel can provide as defined in {{RFC4090}}.

te-class-type:

> A type that represents the Diffserv-TE class-type as defined in {{RFC4124}}.

bc-type:

> A type that represents the Diffserv-TE Bandwidth Constraint (BC) as defined in {{RFC4124}}.

bc-model-type:

> A base YANG identity for supported Diffserv-TE bandwidth constraint models as defined in {{?RFC4125}}, {{?RFC4126}} and {{?RFC4127}}.

te-bandwidth-requested-type:

> An enumerated type for the different options to request bandwidth for a specific tunnel.

performance-metrics-attributes-packet:

> A YANG grouping for the augmentation of packet specific metrics to the generic performance metrics grouping parameters.

# TE Types YANG Module

The ietf-te-types module imports from the following modules:

- ietf-yang-types and ietf-inet-types defined in {{RFC6991}}
- ietf-routing-types defined in {{RFC8294}}

In addition to the references cross-referenced in [ ](#te-types-contents), this model also references the following RFCs in defining the types and YANG grouping of the YANG module:
{{RFC3272}},
{{RFC4202}},
{{RFC4328}}, 
{{RFC4657}},
{{RFC5817}},
{{RFC6004}},
{{RFC6511}},
{{RFC6205}},
{{RFC7139}},
{{RFC7308}},
{{RFC7551}},
{{RFC7571}},
{{RFC7579}}, {{RFC4090}}, {{RFC4561}} and
{{RFC7951}}.


~~~~~~~~~~
<CODE BEGINS> file "ietf-te-types@2019-04-09.yang"
{::include ../../te/ietf-te-types.yang}
<CODE ENDS>
~~~~~~~~~~
{: #fig-basic-types title="TE basic types YANG module"}

# Packet TE Types YANG Module

The ietf-te-packet-types module imports from the following modules:

- ietf-te-types defined in this document.


~~~~~~~~~~
<CODE BEGINS> file "ietf-te-packet-types@2019-04-09.yang"
{::include ../../te/ietf-te-packet-types.yang}
<CODE ENDS>
~~~~~~~~~~
{: #fig-mpls-te-types title="TE packet types YANG module"}

# IANA Considerations

This document registers the following URIs in the IETF XML registry
{{RFC3688}}.
Following the format in {{RFC3688}}, the following registration is
requested to be made.

   URI: urn:ietf:params:xml:ns:yang:ietf-te-types
   XML: N/A, the requested URI is an XML namespace.

   URI: urn:ietf:params:xml:ns:yang:ietf-te-packet-types
   XML: N/A, the requested URI is an XML namespace.

This document registers two YANG modules in the YANG Module Names
registry {{RFC6020}}.

   name:       ietf-te-types
   namespace:  urn:ietf:params:xml:ns:yang:ietf-te-types
   prefix:     ietf-te-types
   reference:  RFCXXXX

   name:       ietf-te-packet-types
   namespace:  urn:ietf:params:xml:ns:yang:ietf-te-packet-types
   prefix:     ietf-te-packet-types
   reference:  RFCXXXX

# Security Considerations

The YANG module specified in this document defines a schema for data that is
designed to be accessed via network management protocols such as NETCONF
{{RFC6241}} or RESTCONF {{!RFC8040}}. The lowest NETCONF layer is the secure
transport layer, and the mandatory-to-implement secure transport is Secure
Shell (SSH) {{!RFC6242}}.  The lowest RESTCONF layer is HTTPS, and the
mandatory-to-implement secure transport is TLS {{!RFC8446}}.

The Network Configuration Access Control Model (NACM) {{!RFC8341}} provides the
means to restrict access for particular NETCONF or RESTCONF users to a
preconfigured subset of all available NETCONF or RESTCONF protocol operations
and content.

The YANG module in this document defines common TE type definitions
(i.e., typedef, identity and grouping statements) in YANG data modeling
language to be imported and used by other TE modules. When imported
and used, the resultant schema will have data nodes that can be writable, or
readable. The access to such data nodes may be considered sensitive or
vulnerable in some network environments.  Write operations (e.g., edit-config)
to these data nodes without proper protection can have a negative effect on
network operations. 

The security considerations spelled out in the YANG 1.1 specification
{{RFC7950}} apply for this document as well.

# Acknowledgement

The authors would like to thank the  members of the multi-vendor YANG design team 
who are involved in the definition of these data types.

The authors would also like to thank Tom Petch, Jan Lindblad, Sergio Belotti, Italo Busi,
Carlo Perocchio, Francesco Lazzeri, and Aihua Guo for their review 
comments and for providing valuable feedback on this document.


# Contributors

~~~~

   Himanshu Shah
   Ciena

   Email: hshah@ciena.com


   Young Lee
   Huawei Technologies

   Email: leeyoung@huawei.com

~~~~

