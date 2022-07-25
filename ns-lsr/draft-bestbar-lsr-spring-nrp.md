---
title: IGP Extensions for SR Network Resource Partition SIDs
abbrev: IGP SR NRP SIDs
docname: draft-bestbar-lsr-spring-nrp-01
category: std
ipr: trust200902
workgroup: LSR Working Group
keyword: Internet-Draft

stand_alone: yes
pi: [toc, sortrefs, symrefs]

normative:

informative:

author:

 -
    ins: T. Saad
    name: Tarek Saad
    organization: Juniper Networks
    email: tsaad@juniper.net

 -
    ins: V. P. Beeram
    name: Vishnu Pavan Beeram
    organization: Juniper Networks
    email: vbeeram@juniper.net

 -
    ins: R. Chen 
    name: Ran Chen
    organization: ZTE Corporation
    email: chen.ran@zte.com.cn

 -
    ins: S. Peng
    name: Shaofu Peng
    organization: ZTE Corporation
    email: peng.shaofu@zte.com.cn

 -
    ins: B. Wen
    name: Bin Wen
    organization: Comcast
    email: Bin_Wen@cable.comcast.com

 -
   ins: D. Ceccarelli
   name: Daniele Ceccarelli
   organization: Ericsson
   email: daniele.ceccarelli@ericsson.com


normative:
  RFC2119:
  RFC8174:


informative:

--- abstract

Segment Routing (SR) defines a set of topological "segments" within an IGP
topology to enable steering over a specific SR path.  These segments are
advertised by the link-state routing protocols (IS-IS and OSPF).

This document describes extensions to the IS-IS and OSPF required to support
the signaling of Resource Partition (NRP) segments that operate over SR-MPLS
and SRv6 dataplanes.  Multiple SR NRP segments can be associated with the same
topological element to allow offering of different forwarding treatments
(e.g. scheduling and drop policy) associated with each NRP.

--- middle

# Introduction

The Segment Routing (SR) architecture {{!RFC8402}} defines a set of topological
"segments" within an IGP topology as means to enable steering over a specific
SR end-to-end path.  These segments are advertised by the IGP link-state
routing protocols (IS-IS and OSPF). The SR control plane can be applied to both
IPv6 and MPLS data planes.

The definition of a network slice for use within the IETF and the characteristics
of IETF network slice are specified in
{{?I-D.ietf-teas-ietf-network-slice-definition}}. A framework for reusing IETF
VPN and traffic-engineering technologies to realize IETF network slices is
discussed  in {{?I-D.nsdt-teas-ns-framework}}. 

{{!I-D.bestbar-teas-ns-packet}} introduces a Slice-Flow Aggregate as the
collection of packets (from one or more IETF network slice traffic streams)
that match an NRP Policy selection criteria and are offered the same forwarding
treatment. The NRP Policy is used to realize an NRP by
instantiating specific control and data plane resources on select topological
elements in an IP/MPLS network.

{{!I-D.bestbar-spring-scalable-ns}} describes an approach to extend SR to
advertise new SID types called NRP SIDs. Such NRP SIDs are
used by a router to define the forwarding action for a packet (next-hop selection),
as well as to enforce the specific treatment (scheduling and drop policy) associated
with the NRP.

This document defines the IS-IS and OSPF specific encodings for the IGP-Prefix Segment,
the IGP-Adjacency Segment, the IGP-LAN-Adjacency Segment that are required to
support the signaling of SR NRP SIDs operating over SR-MPLS and SRv6
dataplanes.

When the NRP segments share the same topology (and Algorithm for
NRP Prefix-SIDs), the different NRP SIDs of the same topological element share
the same forwarding path (i.e., IGP next-hop(s)), but are associated with the specific
forwarding treatment (e.g. scheduling and drop policy) of each NRP.

# Requirements Language

The key words "MUST", "MUST NOT", "REQUIRED", "SHALL", "SHALL
NOT", "SHOULD", "SHOULD NOT", "RECOMMENDED", "NOT RECOMMENDED",
"MAY", and "OPTIONAL" in this document are to be interpreted as
described in BCP 14 {{!RFC2119}} {{!RFC8174}} when, and only when, they
appear in all capitals, as shown here.

# NRP SIDs for SR-MPLS

Segment Routing can be directly instantiated on the MPLS data plane
through the use of the Segment Routing header instantiated as a stack of MPLS labels 
defined in {{!RFC8402}}.

## IS-IS NRP Prefix-SID Sub-TLV {#NrpPrefixSID}

{{!RFC8667}} defines the IS-IS Prefix Segment Identifier sub-TLV (Prefix-SID
sub-TLV) that is applicable to SR-MPLS dataplane.  The Prefix-SID sub-TLV
carries the Segment Routing IGP-Prefix-SID, and is associated with a prefix
advertised by a router.

A new IS-IS SR Network Resource Partition Prefix SID (NRP Prefix-SID) sub-TLV
is defined to allow a router advertising a prefix to associate multiple NRP
Prefix-SIDs to the same prefix.  The NRP Prefix-SIDs associated with the same
prefix share the same IGP path to the destination prefix within the specific
mapped or customized topology/algorithm but offer the specific QoS treatment
associated with the specific NRP.

The NRP ID is carried in the NRP Prefix-SID sub-TLV in order to associate
the Prefix-SID with the specific NRP. The NRP Prefix-SID sub-TLV has the
following format:

~~~
    0                   1                   2                   3
    0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1
   +-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
   |   Type        |    Length     |     Flag      |   Algorithm   |
   +-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
   |                             NRP-ID                            |
   +-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
   |                      SID/Index/Label(Variable)                |
   +-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+

~~~
{:#SaPrefixSID title="NRP Prefix-SID sub-TLV for SR-MPLS."}

where:

> Type: TBD1 (Suggested value to be assigned by IANA)

> Length: Variable.  Depending on the size of the SID.

> The "Flags" and "SID/Index/Label" fields are the same as the Prefix-SID sub-TLV {{!RFC8667}}.

> Algorithm: 1 octet. Associated algorithm. Algorithm values are defined in the IGP Algorithm Type registry

> NRP-ID: Identifies a specific NRP within the IGP domain.

This sub-TLV MAY be present in any of the following TLVs:

> TLV-135 (Extended IPv4 reachability) defined in {{!RFC5305}}.

> TLV-235 (Multitopology IPv4 Reachability) defined in {{!RFC5120}}.

> TLV-236 (IPv6 IP Reachability) defined in {{!RFC5308}}.

> TLV-237 (Multitopology IPv6 IP Reachability) defined in {{!RFC5120}}.

This sub-TLV MAY appear multiple times in each TLV.

## IS-IS NRP Adjacency-SID Sub-TLV {#NrpAdjSID}

{{!RFC8667}} defines the IS-IS Adjacency Segment Identifier sub-TLV (Adj-SID
sub-TLV). The Adj-SID sub-TLV is an optional sub-TLV carrying the Segment
Routing IGP Adjacency-SID as defined in {{!RFC8402}}.

A new SR Network Resource Partition Adjacency SID (NRP Adj-SID) sub-TLV is
defined to allow a router to allocate and advertise multiple NRP Adj-SIDs
towards the same IS-IS neighbor (adjacency).  The NRP Adj-SIDs allows a router
to enforce the specific treatment associated with the NRP on the specific
adjacency.

The NRP ID is carried in the NRP Adj-SID sub-TLV to associate
it to the specific NRP, and has the following format:

~~~
    0                   1                   2                   3
    0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1
   +-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
   |   Type        |     Length    |     Flags     |     Weight    |
   +-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
   |                           NRP-ID                              |
   +-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
   |                      SID/Index/Label(Variable)                |
   +-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
~~~
{:#SaAdjSID title="NRP Adj-SID sub-TLV for SR-MPLS."}

where:

> Type: TBD2 (Suggested value to be assigned by IANA)

> Length: Variable.  Depending on the size of the SID.

> The "Flags", "SID/Index/Label", and "Weight" fields are the same as those defined for the Adj-SID sub-TLV in {{!RFC8667}}.

> NRP-ID: Identifies a specific NRP within the IGP domain.

This sub-TLV MAY be present in any of the following TLVs:

> TLV-22 (Extended IS reachability) {{!RFC5305}}.

> TLV-222 (Multitopology IS) {{!RFC5120}}.

> TLV-23 (IS Neighbor Attribute) {{!RFC5311}}.

> TLV-223 (Multitopology IS Neighbor Attribute) {{!RFC5311}}.

> TLV-141 (inter-AS reachability information) {{!RFC5316}}.

Multiple Adj-SID sub-TLVs MAY be associated with a single IS-IS
neighbor.  This sub-TLV MAY appear multiple times in each TLV.

## IS-IS NRP per Algorithm Adjacency-SID Sub-TLV {#NrpAlgoAdjSID}

{{!I-D.ietf-lsr-algorithm-related-adjacency-sid}} defines ISIS Adjacency Segment Identifier (Adj-SID) per Algorithm Sub-TLV.

A new per Algorithm SR NRP Adj-SID is defined to allow a router to allocate
and advertise multiple NRP Adj-SIDs towards the same adjacency. The per
Algorithm NRP Adj-SID allow the router to enforce the specific forwarding
treatment associated with the NRP on to packets using that NRP Adj-SID as
active segment.

The NRP ID is carried in the NRP per Algorithm Adj-SID sub-TLV to associate
it to the specific NRP. The sub-TLV has the following format:

~~~
     0                   1                   2                   3
    0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1
   +-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
   |   Type        |     Length    |     Flags     |     Weight    |
   +-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
   |   Algorithm   |
   +-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
   |                           NRP-ID                              |
   +-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
   |                         SID/Label/Index (variable)            |
   +-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+

~~~
{:#AlgoSaAdjSID title="Per Algorithm NRP Adj-SID sub-TLV for SR-MPLS."}

where:

> Type: TBD3.

> Length: 10 or 11 depending on size of the SID.

> NRP-ID: Identifies a specific NRP within the IGP domain.

> The "Flags", "SID/Index/Label", and "Weight" fields are the same as those defined for the Adj-SID sub-TLV in {{!RFC8667}}.

> The "Algorithm" field is as defined in {{!I-D.ietf-lsr-algorithm-related-adjacency-sid}}
for the per Algorithm Adj-SID Sub-TLV.


## IS-IS NRP LAN Adjacency-SID Sub-TLV {#NrpLanAdjSID}

In LAN subnetworks, {{!RFC8667}} defines the SR-MPLS LAN-Adj-SID sub-TLV for a
router to advertise the Adj-SID of each of its neighbors.

A new SR Network Resource Partition LAN Adjacency SID (NRP LAN-Adj-SID) sub-TLV is defined to
allow a router to allocate and advertise multiple NRP LAN-Adj-SIDs towards
each of its neighbors on the LAN.  The NRP LAN-Adj-SIDs allows a router to
enforce the specific treatment associated with the specific NRP towards
a neighbor.

The NRP ID is carried in the NRP LAN-Adj-SID sub-TLV to associate
it to the specific NRP, and it has the following format:

~~~
    0                   1                   2                   3
    0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1
   +-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
   |   Type        |     Length    |      Flags    |    Weight     |
   +-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
   |                           NRP-ID                              |
   +-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
   
   +-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
   |                  Neighbor System-ID (ID length octets)        |
   +                               +-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
   |                               |
   +-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+

   +-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
   |                   SID/Label/Index (variable)                  |
   +-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
~~~~
{:#SaLANAdjSID title="NRP LAN Adj-SID sub-TLV for SR-MPLS."}

where:

> Type: TBD4 (Suggested value to be assigned by IANA)

> Length: Variable.  Depending on the size of the SID.

> The "Flags" and "SID/Index/Label" fields are the same as the LAN-Adj-SID sub-TLV {{!RFC8667}}.

> NRP-ID: Identifies a specific NRP within the IGP domain.

This sub-TLV MAY be present in any of the following TLVs:

> TLV-22 (Extended IS reachability) {{!RFC5305}}.

> TLV-222 (Multitopology IS) {{!RFC5120}}.

> TLV-23 (IS Neighbor Attribute) {{!RFC5311}}.

> TLV-223 (Multitopology IS Neighbor Attribute) {{!RFC5311}}.

Multiple LAN-Adj-SID sub-TLVs MAY be associated with a single IS-IS neighbor.  This sub-TLV MAY appear multiple times in each TLV.

## IS-IS NRP per Algorithm LAN Adjacency-SID Sub-TLV {#NrpAlgoLanAdjSID}

ISIS Adjacency Segment Identifier (LAN-Adj-SID) per Algorithm Sub-TLV
has the following format:

~~~
    0                   1                   2                   3
    0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1
   +-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
   |     Type      |     Length    |      Flags    |    Weight     |
   +-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
   |   Algorithm   |
   +-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
   |                           NRP-ID                              |
   +-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
   |                  Neighbor System-ID (ID length octets)        |
   +                               +-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
   |                               |
   +-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+

   +-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
   |                   SID/Label/Index (variable)                  |
   +-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
~~~
{:#LANAlgoSaAdjSID title="Per Algorithm NRP LAN Adj-SID sub-TLV for SR-MPLS."}

where:

> Type: TBD5.

> Length: Variable.

> The "Flags", "SID/Index/Label", "Weight", and "Neighbor System-ID" fields are
> the same as those defined for the LAN-Adj-SID sub-TLV in {{!RFC8667}}.

> The "Algorithm" field is as defined in {{!I-D.ietf-lsr-algorithm-related-adjacency-sid}}
for the per Algorithm LAN-Adj-SID Sub-TLV.


> Editor Note: the OSPF Sub-TLV sections will be populated in further update.


# NRP SIDs for SRv6

Segment Routing can be directly instantiated on the IPv6 data plane through the
use of the Segment Routing Header defined in {{!RFC8754}}.  SRv6 refers to this
SR instantiation on the IPv6 dataplane.

The SRv6 Locator TLV was introduced in {{!I-D.ietf-lsr-isis-srv6-extensions}}
to advertise SRv6 Locators and End SIDs associated with each locator.

## SRv6 NRP SID Sub-Sub-TLV {#Srv6NrpSID}

The SRv6 End SID sub-TLV was introduced in
{{!I-D.ietf-lsr-isis-srv6-extensions}} to advertise SRv6 Segment Identifiers
(SID) with Endpoint behaviors which do not require a particular neighbor.

The SRv6 End SID sub-TLV is advertised in the SRv6 Locator TLV, and inherits
the topology/algorithm from the parent locator. The SRv6 End SID sub-TLV
defined in {{!I-D.ietf-lsr-isis-srv6-extensions}} carries optional
sub-sub-TLVs.

A new SRv6 NRP SID Sub-Sub-TLV is defined to allow a router to
assign and advertise an SRv6 End SID that is associated with a specific NRP.
The SRv6 SID NRP Sub-Sub-TLV allows routers to infer and enforce
the specific treatment associated with the NRP on the selected
next-hops along the path to the End SID destination.

~~~
    0                   1                   2                   3
    0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1
   +-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
   |   Type        |     Length    |
   +-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
   |                           NRP-ID                              |
   +-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
~~~
{:#SaEndSID title="SRv6 SID NRP Sub-Sub-TLV format for SRv6."}


where:

> Type: TBD6

> Length: 4 octets.

> NRP-ID: Identifies a specific NRP within the IGP domain.

ISIS SRv6 SID NRP Sub-Sub-TLV MUST NOT appear more than once in
its parent Sub-TLV. If it appears more than once in its parent Sub-
TLV, the parent Sub-TLV MUST be ignored by the receiver.

The new SRv6 SID NRP Sub-Sub-TLV is an optional Sub-Sub-TLV of:

> SRv6 End SID Sub-TLV (Section 7.2 of {{!I-D.ietf-lsr-isis-srv6-extensions}})

> SRv6 End.X SID Sub-TLV (Section 8.1 of {{!I-D.ietf-lsr-isis-srv6-extensions}})

> SRv6 LAN End.X SID Sub-TLV (Section 8.2 of {{!I-D.ietf-lsr-isis-srv6-extensions}})

# IANA Considerations

This document requests allocation for the following Sub-TLVs types.

## IS-IS Consideration

Table 1 summarizes registrations made in the "Sub-TLVs for TLV
135,235,226 and 237 registry".

 | Sub-TLV Type | Description                      |  Reference          |
 |--------------|----------------------------------|--------------------|
 | TBD1         | NRP Prefix-SID Sub-TLV           | {{NrpPrefixSID}}   |

~~~~~~~~~~
   Table 1: Summary of Sub-TLV registrations for TLVs 135,235,226 and
                         237 (to be assigned by IANA).
~~~~~~~~~~

Table 2 summarizes registrations made in the "Sub-TLVs for TLV
22, 23, 25, 141, 222, and 223" registry.


 | Sub-TLV Type | Description                      |  Reference          |
 |--------------|----------------------------------|--------------------|
 | TBD2         | NRP Adj-SID Sub-TLV              | {{NrpAdjSID}}      |
 | TBD3         | NRP LAN-Adj-SID Sub-TLV          | {{NrpLanAdjSID}}  |
 | TBD4         | NRP Per Algo Adj-SID Sub-TLV     | {{NrpAlgoAdjSID}}  |
 | TBD5         | NRP Per Algo LAN-Adj-SID Sub-TLV | {{NrpAlgoLanAdjSID}}|

~~~~~~~~~~
   Table 2: Summary of Sub-TLV registrations for TLVs 22, 23, 25, 141,
                         222, and 223 (to be assigned by IANA).
~~~~~~~~~~

## SRv6 IS-IS NRP SID Sub-Sub-TLV

The below is a request to allocate a new sub-sub-TLV type from the
"sub-sub-TLVs for SRv6 End SID and SRv6 End.X SID" registry:

> Type: TBD5 (to be assigned by IANA).
> Reference: {{Srv6NrpSID}}

# Security Considerations

TBD.

# Acknowledgement

The authors would like to thank Swamy SRK, and Prabhu Raj Villadathu
Karunakaran for their review of this document, and for providing valuable
feedback on it.

# Contributors

The following individuals contributed to this document:

~~~
   Colby Barth
   Juniper Networks
   Email: cbarth@juniper.net

   Srihari R.  Sangli
   Juniper Networks
   Email: ssangli@juniper.net

   Chandra Ramachandran
   Juniper Networks
   Email: csekar@juniper.net
~~~
