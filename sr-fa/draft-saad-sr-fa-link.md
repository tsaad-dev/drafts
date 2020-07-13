---
title: Segment-Routing over Forwarding Adjacency Links
abbrev: SR over FA Links
docname: draft-saad-sr-fa-link-02
category: info
ipr: trust200902
workgroup: SPRING Working Group
keyword: Internet-Draft

stand_alone: yes
pi: [toc, sortrefs, symrefs]

author:

 -
   ins: T. Saad
   name: Tarek Saad
   organization: Juniper Networks, Inc.
   email: tsaad@juniper.net
 -
   ins: V. P. Beeram
   name: Vishnu Pavan Beeram
   organization: Juniper Networks, Inc.
   email: vbeeram@juniper.net
 -
   ins: C. Barth
   name: Colby Barth
   organization: Juniper Networks, Inc.
   email: cbarth@juniper.net
 -
   ins: S. Sivabalan
   name: Siva Sivabalan
   organization: Ciena Corporation.
   email: ssivabal@ciena.com


normative:
  RFC2119:

informative:

--- abstract

Label Switched Paths (LSPs) set up in Multiprotocol Label Switching (MPLS)
networks can be used to form Forwarding Adjacency (FA) links that carry traffic
in those networks. An FA link can be assigned Traffic Engineering (TE)
parameters that allow other LSR(s) to include it in their constrained path
computation.  FA link(s) can be also assigned Segment-Routing (SR) segments
that enable the steering of traffic on to the associated FA link(s).  The TE and SR
attributes of an FA link can be advertised using known protocols that carry link state
information. This document elaborates on the usage of FA link(s) and their attributes
in SR enabled networks.

--- middle

# Introduction

To improve scalability in Multi-Protocol Label Switching (MPLS) networks, it
may be useful to create a hierarchy of LSPs as Forwarding Adjacencies (FA).
The concept of FA link(s) and FA-LSP(s) was introduced in {{!RFC4206}}.

In Segment-Routing (SR), this is particularly useful for two main reasons.

First, it allows the stitching of sub-path(s) so as to realize an end-to-end SR
path.  Each sub-path can be represented by a FA link that is supported by one
or more underlying LSP(s).  The underlying LSP(s) that support an FA link can be
setup using different technologies-- including RSVP-TE, LDP, and SR.  The
sub-path(s), or FA link(s) in this case, can possibly interconnect multiple
administrative domains, allowing each FA link within a domain to use a
different technology to setup the underlying LSP(s).

Second, it allows shortening of a large SR Segment-List by compressing one or
more slice(s) of the list into a corresponding FA TE link that each can be
represented by a single segment- see {{SR_FA_LINK}}. Effectively, it reduces
the number of segments that an ingress router has to impose to realize an
end-to-end path.

The FA links are treated as normal link(s) in the network and hence it can
leverage existing link state protocol extensions to advertise properties
associated with the FA link. For example, Traffic-Engineering (TE) link
parameters and Segment-Routing (SR) segments parameters can be associated
with the FA link and advertised throughout the network.

Once advertised in the network using a suitable protocols that support carrying
link state information, such as OSPF, ISIS or BGP Link State (LS)), other LSR(s) in the
network can use the FA TE link(s) as well as possibly other normal TE link(s)
when performing path computation and/or when specifying the desired explicit
path.

Though the concepts discussed in this document are specific to MPLS technology,
these are also extensible to other dataplane technologies - e.g. SRv6.

# Terminology

The key words "MUST", "MUST NOT", "REQUIRED", "SHALL", "SHALL NOT", "SHOULD",
"SHOULD NOT", "RECOMMENDED", "NOT RECOMMENDED", "MAY", and "OPTIONAL" in this
document are to be interpreted as described in BCP 14 {{!RFC2119}} {{!RFC8174}}
when, and only when, they appear in all capitals, as shown here.


# Forwarding Adjacency Links

FA Link(s) can be created and supported by underlying FA LSPs. The FA link is
of type point-to-point. FA links may be represented as either unnumbered or numbered.
The nodes connected by an FA link do not usually establish a routing
adjacency over the FA link. When FA links are numbered with IPv4 addresses, the
local and remote IPv4 addresses can come out of a /31 that is allocated by the LSR
that originates the FA-LSP. For unnumbered FA link(s), other provisions may
exist to exchange link identifier(s) between the endpoints of the FA.

## Creation and Management

In general, the creation/termination of an FA link and its FA-LSP is driven
either via configuration on the LSR at the head-end of the adjacency, or
dynamically using suitable North Bound Interface (NBI) protocol, e.g. Netconf,
gRPC, PCEP, etc.

The following FA-LSP attributes may be configured, including: bandwidth and
resource colors, and other constraints. The path taken by the FA-LSP may be either
computed by the LSR at the head-end of the FA-LSP, or externally by a PCE and
furnished to the headend.

The attributes of the FA link can be inherited from the underlying LSP(s) that
induced its creation. In general, for dynamically provisioned FAs, a
policy-based mechanism may be needed to associate link attributes to those of
the FA-LSPs.

When the FA link is supported by bidirectional FA LSP(s), a pair of FA link(s) are
advertised from each endpoint of the FA. These are usually referred to as symmetrical
link(s).

## Link Flooding

Multiple protocols exist that can exchange link state information in the
network. For example, when advertising TE link(s) and their attribute(s) using
OSPF and ISIS protocols, the respective extensions are defined in {{!RFC3630}}
and {{!RFC5305}}. Also, when exchanging such information in BGP protocol,
extensions for BGP link state are defined in {{!RFC7752}} and {{!RFC8571}}. The
same protocol encodings can be used to advertise FA(s) as TE link(s). As a
result, the FA TE link(s) and other normal TE link(s) will appear in the TE
link state database of any LSR in the network, and can be used for computing
end-to-end TE path(s).

When IGP protocols are used to advertise link state information about FA links,
the FA link(s) can appear in both the TE topology as well as the IGP topology.
It is desirable, sometimes, to restrict the use of the FA link(s) within the TE
topology to compute traffic engineered paths, and not use them during normal
IGP Shortest Path First (SPF) computations.  This is possible using different
mechanisms and depending on the IGP protocol used to exchange the FA link state
information.

For example, when using ISIS to carry FA link state information, {{!RFC5305}}
section 3 describes a way to restrict the link to the TE topology by setting
the IGP link metric to maximum (2^24 - 1). Alternatively, when using OSPF, the
FA link(s) can be advertised using TE Opaque LSA(s) only, and hence, strictly
show up in the TE topology as described in {{!RFC3630}} .

## Underlay LSP(s)

The LSR that hosts an FA link can setup the underlying LSP(s) using different
technologies - e.g. RSVP-TE, LDP, and SR.

The FA link can be supported by one or more underlay LSP(s) that terminate on
the same remote endpoint. The underlay path(s) can be setup using different
signaling technologies, e.g. using RSVP-TE, LDP, SR, etc.  When multiple LSP(s)
support the same FA link, the attributes of the FA link can be derived from the
aggregate properties of each of the underlying LSP(s).

## State Changes

The state of an FA TE link reflects the state of the underlying LSP path that supports
it. The TE link is assumed operational and is advertised as long as the underlying
LSP path is valid. When all underlying LSP paths are invalidated, the FA TE link
advertisement is withdrawn.

## TE Parameters

The TE metrics and TE attributes are used by path computation algorithms to
select the TE link(s) that a TE path traverses.  When advertising an FA link
in OSPF or ISIS, or BGP-LS, the following TE parameters are defined:

TE Path metrics:

: the FA link advertisement can include information about TE, IGP, and other
performance metrics (e.g. delay, and loss). The FA link TE metrics, in this case,
can be derived from the underlying path(s) that support the FA link by
producing the path accumulative metrics. When multiple LSP(s) support the same FA
link, then the higher accumulative metric amongst the LSP(s) is inherited by
the FA link.

Resource Class/Color:

: An FA link can be assigned (e.g. via configuration) a specific set of
admin-groups. Alternatively, in some cases, this can be derived from the
underlying path affinity - for example, the underlying path strictly includes a
specific admin-group.

SRLGs:

: An FA advertisement could contain the information about the Shared Risk Link
Groups (SRLG) for the path taken by the FA LSP associated with that FA.  This
information may be used for path calculation by other LSRs.  The information
carried is the union of the SRLGs of the underlying TE links that make up the
FA LSP path. It is possible that the underlying path information might change
over time, via configuration updates or dynamic route modifications, resulting
in the change of the union of SRLGs for the FA link. If multiple LSP(s)
support the same FA link, then it is expected all LSP(s) have the same SRLG
union - note, that the exact paths need not be the same.

It is worth noting, that topology changes in the network may affect the FA link
underlying LSP path(s), and hence, can dynamically change the TE metrics and TE
attributes of the FA links.

## Link Local and Remote Identifiers

It is possible for the FA link to be numbered or unnumbered. {{!RFC4206}}
describes a procedure for identifying a numbered FA TE link using IPv4
addresses.

For unnumbered FA link(s), the assignment and handling of the local and remote
link identifiers is specified in {{!RFC3477}}.  The LSR at each end of the
unnumbered FA link assigns an identifier to that link.  This identifier is a
non-zero 32-bit number that is unique within the scope of the LSR that assigns
it. There is no a priori relationship between the identifiers assigned to a
link by the LSRs at each end of that link.

The FA link is a unidirectional and point-to-point link. Hence, the combination
of link local identifier and advertising node can uniquely identify the link in
the TED. In some cases, however, it is desirable to associate the forward and
reverse FA links in the TED. In this case, the combination of link local and
remote identifier can identify the pair of forward and reverse FA link(s). The
LSRs at the two end points of an unnumbered link can exchange with each other
the identifiers they assign to the link. Exchanging the identifiers may be
accomplished by configuration, or by means of protocol extensions. For example,
when the FA link is established over RSVP-TE FA LSP(s), then RSVP extensions
have been introduced to exchange the FA link identifier in {{!RFC3477}}.  Other
protocol extensions pertaining to specific link state protocols, and LSP setup
technologies will be discussed in a separate document.

If the link remote identifier is unknown, the value advertised
is set to 0 {{!RFC5307}}.


# Segment-Routing over FA Links {#SR_FA_LINK}

The Segment Routing (SR) architecture {{!RFC4206}} describes that an IGP
adjacency can be formed over a FA link -- in which the remote node of an IGP
adjacency is a non-adjacent IGP neighbor.

In Segment-Routing (SR), the adjacency that is established over a link can be
assigned an SR Segment {{!RFC8402}}. For example, the Adj-SID allows to
strictly steer traffic on to the specific adjacency that is associated with the
Adj-SID.

## SR IGP Segments for FA

Extensions have been defined to ISIS {{!RFC8667}} and OSPF {{!RFC8665}} in
order to advertise the the Adjacency-SID associated with a specific IGP
adjacency.  The same extensions apply to adjacencies over FA link.  A node can
bind an Adj-SID to an FA data-link. The Adj-SID dictates the forwarding of
packets through the specific FA link or FA link(s) identified by the Adj-SID,
regardless of its IGP/SPF cost.

When the FA link Adj-SID is supported by a single underlying LSP that is
associated with a binding label or SID, the same binding label can be used for
the FA link Adj-SID.  For example, if the FA link is supported by an SR Policy
that is assigned a Binding SID B, the Adj-SID of the FA link can be assigned
the same Binding SID B.

When the FA link Adj-SID is supported by multiple underlying LSP(s) or SR
Policies - each having its own Binding label or SID, an independent FA link
Adj-SID is allocated and bound to the multiple underlying LSP(s).


### Parallel Adjacencies

Adj-SIDs can also be used in order to represent a set of parallel FA link(s)
between two endpoints.

When parallel FA links are associated with the same Adj-SID, a "weight" factor
can be assigned to each link and advertised with the Adj-SID advertised with
each FA link.  The weight informs the ingress (or an SDN/orchestration system)
about the load-balancing factor over the parallel adjacencies.

## SR BGP Segments for FA

BGP segments are allocated and distributed by BGP. The SR architecture {{!RFC8402}}
defines three types of BGP segments for Egress Peer Engineering (EPE): PeerNode
SID, PeerAdj SID, and PeerSet SID.

The applicability of each of the three types to FA links is
discussed below:

 o  PeerNode SID: a BGP PeerNode segment/SID is a local segment.  At the BGP
 node advertising, the forwarding semantics are:

> *  SR operation: NEXT.
  *  Next-Hop: forward over any FA link associated with the segment that
       terminates on remote endpoint.

o  PeerAdj SID: a BGP PeerAdj segment/SID is a local segment.  At the BGP node
advertising it, the forwarding semantics are:

> *  SR operation: NEXT.
  *  Next-Hop: forward over the specific FA link to the remote endpoint to
       which the segment is related.

o  PeerSet SID: a BGP PeerSet segment/SID is a local segment.  At the BGP node
advertising it, the semantics are:

> *  SR operation: NEXT.
  *  Next-Hop: load-balance across any of the FA links to any remote endpoint
       in the related set.  The group definition is a policy set by the
       operator.


## Applicability to Interdomain

In order to determine the potential to establish a TE path through a series of
interconnected domains or multi-domain network, it is necessary to have
available a certain amount of TE information about each network domain.  This
need not be the full set of TE information available within each network but
does need to express the potential of providing such TE connectivity.

Topology abstraction is described in {{!RFC7926}}. Abstraction allows applying
a policy to the available TE information within a domain so to produce
selective information that represents the potential ability to connect across
the domain.  Thus, abstraction does not necessarily offer all possible
connectivity options, but presents a general view of potential connectivity
according to the policies that determine how the domain's administrator wants
to allow the domain resources to be used.

Hence, the domain may be constructed as a mesh of border node to border node TE
FA links.  When computing a path for an LSP that crosses the domain, a
computation point can see which domain entry points can be connected to which
others, and with what TE attributes.

# IANA Considerations

TBD.

# Security Considerations

TBD.

# Acknowledgement

The authors would like to thank Peter Psenak for reviewing and providing valuable feedback
on this document.

