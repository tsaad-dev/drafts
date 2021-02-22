---
title: IGP Extensions for SR Slice Aggregate SIDs
abbrev: IGP SR Slice Aggregate SIDs
docname: draft-bestbar-lsr-spring-sa-00
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
topology to enable steering over a specific SR path.  These segments
are advertised by the link-state routing protocols (IS-IS and OSPF).

This document describes extensions to the IS-IS that enable advertising Slice
Aggregate SR segments that share the same IGP computed forwarding path but
offer a forwarding treatment (e.g. scheduling and drop policy) that is
associated with a specific Slice Aggregate.

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

{{!I-D.bestbar-teas-ns-packet}} introduces the notion of a Slice Aggregate as
the construct that comprises of one of more IETF network slice traffic streams. 
A slice policy can be used to realize a slice aggregate by
instantiating specific control and data plane resources on select topological
elements in an IP/MPLS network.

{{!I-D.bestbar-spring-scalable-ns}} describes an approach to extend SR to
advertiser new SID types called Slice Aggregate (SA) SIDs. Such SA SIDs are
used on a router to define the forwarding action for a packet (next-hop selection),
as well as enforce the specific treatment (scheduling and drop policy) associated
with the Slice Aggregate.

This document defines the IS-IS and OSPF encodings for the IGP-Prefix Segment, the
IGP-Adjacency Segment, the IGP-LAN-Adjacency Segment that are required to
support the signaling of SR Slice Aggregate SIDs operating over
SR-MPLS and SRv6 dataplanes. When the Slice Aggregate segments have the same
topology (and Algorithm for Prefix-SIDs), the SA SIDs share the same
forwarding path (IGP next-hop(s)), but are associated with different
forwarding treatment (e.g. scheduling and drop policy) that is associated with
the specific Slice Aggregate.

# Requirements Language

The key words "MUST", "MUST NOT", "REQUIRED", "SHALL", "SHALL
NOT", "SHOULD", "SHOULD NOT", "RECOMMENDED", "NOT RECOMMENDED",
"MAY", and "OPTIONAL" in this document are to be interpreted as
described in BCP 14 {{!RFC2119}} {{!RFC8174}} when, and only when, they
appear in all capitals, as shown here.

# Slice Aggregate SIDs for SR-MPLS

Segment Routing can be directly instantiated on the MPLS data plane
through the use of the Segment Routing header instantiated as a stack of MPLS labels 
defined in {{!RFC8402}}.

## IS-IS Slice Aggregate Prefix-SID Sub-TLV

{{!RFC8667}} defines the IS-IS Prefix Segment Identifier sub-TLV (Prefix-SID
sub-TLV) that is applicable to SR-MPLS dataplane.  The Prefix-SID sub-TLV
carries the Segment Routing IGP-Prefix-SID, and is associated with a prefix
advertised by a router.

A new IS-IS SR Slice Aggregate Prefix-SID (SA Prefix-SID) sub-TLV is defined to
allow a router advertising a prefix to associate multiple SA Prefix-SIDs to the
same prefix.  The SA Prefix-SIDs associated with the same prefix share the same
IGP path to the destination prefix within the specific mapped or customized
topology/algorithm but offer the specific QoS treatment associated with the
specific Slice Aggregate.

The Slice Aggregate ID is carried in the SA Prefix-SID sub-TLV to associate
it to Prefix-SID with a specific Slice Aggregate. The SA Prefix-SID sub-TLV has the
following format:

~~~
    0                   1                   2                   3
    0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1
   +-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
   |   Type=TBD1   |    Length     |     Flag      |   Algorithm   |
   +-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
   |                              SA-ID                            |
   +-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
   |                      SID/Index/Label(Variable)                |
   +-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+

~~~
{:#SaPrefixSID title="SA Prefix-SID sub-TLV for SR-MPLS."}

where:

> Type: TBD1 (Suggested value to be assigned by IANA)

> Length: Variable.  Depending on the size of the SID.

> The "Flags" and "SID/Index/Label" fields are the same as the Prefix-SID sub-TLV {{!RFC8667}}.

> Algorithm: 1 octet. Associated algorithm. Algorithm values are defined in the IGP Algorithm Type registry

> SA-ID: Identifies a specific Slice Aggregate within the IGP domain.

This sub-TLV MAY be present in any of the following TLVs:

> TLV-135 (Extended IPv4 reachability) defined in {{!RFC5305}}.

> TLV-235 (Multitopology IPv4 Reachability) defined in {{!RFC5120}}.

> TLV-236 (IPv6 IP Reachability) defined in {{!RFC5308}}.

> TLV-237 (Multitopology IPv6 IP Reachability) defined in {{!RFC5120}}.

This sub-TLV MAY appear multiple times in each TLV.

## IS-IS Slice Aggregate Adjacency-SID Sub-TLV

{{!RFC8667}} defines the IS-IS Adjacency Segment Identifier sub-TLV (Adj-SID
sub-TLV). The Adj-SID sub-TLV is an optional sub-TLV carrying the Segment
Routing IGP Adjacency-SID as defined in {{!RFC8402}}.

A new SR Slice Aggregate Adjacency-SID (SA Adj-SID) sub-TLV is defined to
allow a router to allocate and advertise multiple SA Adj-SIDs towards the
same IS-IS neighbor (adjacency).  The SA Adj-SIDs allows a router to
enforce the specific treatment associated with the Slice Aggregate.

The Slice Aggregate ID is carried in the SA Adj-SID sub-TLV to associate
it to the specific Slice Aggregate. The SA Adj-SID sub-TLV has the
following format:

~~~
    0                   1                   2                   3
    0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1
   +-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
   |   Type        |     Length    |     Flags     |     Weight    |
   +-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
   |                            SA-ID                              |
   +-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
   |                      SID/Index/Label(Variable)                |
   +-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
~~~
{:#SaAdjSID title="SA Adj-SID sub-TLV for SR-MPLS."}

where:

> Type: TBD2 (Suggested value to be assigned by IANA)

> Length: Variable.  Depending on the size of the SID.

> The "Flags" and "SID/Index/Label" fields are the same as the Adj-SID sub-TLV {{!RFC8667}}.

> SA-ID: Identifies a specific Slice Aggregate within the IGP domain.

This sub-TLV MAY be present in any of the following TLVs:

> TLV-22 (Extended IS reachability) {{!RFC5305}}.

> TLV-222 (Multitopology IS) {{!RFC5120}}.

> TLV-23 (IS Neighbor Attribute) {{!RFC5311}}.

> TLV-223 (Multitopology IS Neighbor Attribute) {{!RFC5311}}.

> TLV-141 (inter-AS reachability information) {{!RFC5316}}.

Multiple Adj-SID sub-TLVs MAY be associated with a single IS-IS
neighbor.  This sub-TLV MAY appear multiple times in each TLV.

## IS-IS Slice Aggregate LAN Adjacency-SIDs

In LAN subnetworks, {{!RFC8667}} defines the SR-MPLS LAN-Adj-SID sub-TLV for a
router to advertise the Adj-SID of each of its neighbors.

A new SR Slice Aggregate LAN Adjacency-SID (SA LAN-Adj-SID) sub-TLV is defined to
allow a router to allocate and advertise multiple SA LAN-Adj-SIDs towards
each of its neighbors on the LAN.  The SA LAN-Adj-SIDs allows a router to
enforce the specific treatment associated with the specific Slice Aggregate towards
a neighbor.

The Slice Aggregate ID is carried in the SA LAN-Adj-SID sub-TLV to associate
it to the specific Slice Aggregate. The SA LAN-Adj-SID sub-TLV has the
following format:

~~~
    0                   1                   2                   3
    0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1
   +-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
   |   Type=TBD3   |     Length    |      Flags    |    Weight     |
   +-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
   |                            SA-ID                              |
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
{:#SaLANAdjSID title="SA LAN Adj-SID sub-TLV for SR-MPLS."}

where:

> Type: TBD3 (Suggested value to be assigned by IANA)

> Length: Variable.  Depending on the size of the SID.

> The "Flags" and "SID/Index/Label" fields are the same as the LAN-Adj-SID sub-TLV {{!RFC8667}}.

> SA-ID: Identifies a specific Slice Aggregate within the IGP domain.

This sub-TLV MAY be present in any of the following TLVs:

> TLV-22 (Extended IS reachability) {{!RFC5305}}.

> TLV-222 (Multitopology IS) {{!RFC5120}}.

> TLV-23 (IS Neighbor Attribute) {{!RFC5311}}.

> TLV-223 (Multitopology IS Neighbor Attribute) {{!RFC5311}}.

Multiple LAN-Adj-SID sub-TLVs MAY be associated with a single IS-IS neighbor.  This sub-TLV MAY appear multiple times in each TLV.


> Editor Note: the OSPF Sub-TLV sections will be populated in further update.


# Slice Aggregate SIDs for SRv6

Segment Routing can be directly instantiated on the IPv6 data plane through the
use of the Segment Routing Header defined in {{!RFC8754}}.  SRv6 refers to this
SR instantiation on the IPv6 dataplane.

The SRv6 Locator TLV was introduced in {{!I-D.ietf-lsr-isis-srv6-extensions}}
to advertise SRv6 Locators and End SIDs associated with each locator.

## SRv6 SID Slice Aggregate Sub-Sub-TLV

The SRv6 End SID sub-TLV was introduced in
{{!I-D.ietf-lsr-isis-srv6-extensions}} to advertise SRv6 Segment Identifiers
(SID) with Endpoint behaviors which do not require a particular neighbor.

The SRv6 End SID sub-TLV is advertised in the SRv6 Locator TLV, and inherits
the topology/algorithm from the parent locator. The SRv6 End SID sub-TLV
defined in {{!I-D.ietf-lsr-isis-srv6-extensions}} carries optional
sub-sub-TLVs.

A new SRv6 Slice Aggregate (SA) SID Sub-Sub-TLV is defined to allow a router to
assign and advertise an SRv6 End SID that is associated with a specific Slice
Aggregate. The SRv6 SID SA Sub-Sub-TLV allows routers to infer and enforce
the specific treatment associated with the Slice Aggregate on the selected
next-hops along the path to the End SID destination.

~~~
    0                   1                   2                   3
    0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1
   +-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
   |   Type=TBD4   |     Length    |
   +-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
   |                            SA-ID                              |
   +-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
~~~
{:#SaEndSID title="SRv6 SID SA Sub-Sub-TLV format for SRv6."}


where:

> Type: TBD4

> Length: 4 octets.

> SA-ID: Identifies a specific Slice Aggregate within the IGP domain.

ISIS SRv6 SID SA Sub-Sub-TLV MUST NOT appear more than once in
its parent Sub-TLV. If it appears more than once in its parent Sub-
TLV, the parent Sub-TLV MUST be ignored by the receiver.

The new SRv6 SID SA Sub-Sub-TLV is an optional Sub-Sub-TLV of:

> SRv6 End SID Sub-TLV (Section 7.2 of {{!I-D.ietf-lsr-isis-srv6-extensions}})

> SRv6 End.X SID Sub-TLV (Section 8.1 of {{!I-D.ietf-lsr-isis-srv6-extensions}})

> SRv6 LAN End.X SID Sub-TLV (Section 8.2 of {{!I-D.ietf-lsr-isis-srv6-extensions}})

# IANA Considerations

This document requests allocation for the following Sub-TLVs.

## SR Slice Aggregate Prefix-SID sub-TLV

This TLV shares sub-TLV space with existing "Sub-TLVs for TLVs
135,235,226 and 237 registry".

> Type: TBD1 (to be assigned by IANA).

## SR Slice Aggregate Adjacency-SID sub-TLV

This TLV shares sub-TLV space with existing "Sub-TLVs for TLVs 22,
222, 23, 223 and 141 registry".

> Type: TBD2 (to be assigned by IANA).

## SR Slice Aggregate LAN-Adj-SID sub-TLV

This TLV shares sub-TLV space with existing "Sub-TLVs for TLVs 22,
222, 23, and 223 registry".

> Type: TBD3 (to be assigned by IANA).

## SRv6 SID Slice Aggregate Sub-Sub-TLV

> Type: TBD4 (to be assigned by IANA).

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
