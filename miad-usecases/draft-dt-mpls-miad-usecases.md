---
title: Use Cases for MPLS Network Action Indicators and MPLS Ancillary Data
abbrev: MNA Usecases
docname: draft-ietf-mpls-mna-usecases-01
category: info
ipr: trust200902
workgroup: MPLS Working Group
keyword: Internet-Draft
submissionType: IETF

stand_alone: yes
pi: [toc, sortrefs, symrefs]

author:

 -
    ins: T. Saad
    name: Tarek Saad
    organization: Cisco Systems, Inc.
    email: tsaad.net@gmail.com

 -
    ins: K. Makhijani
    name: Kiran Makhijani
    organization: Futurewei Technologies
    email: kiranm@futurewei.com

 -
    ins: H. Song
    name: Haoyu Song
    organization: Futurewei Technologies
    email: haoyu.song@futurewei.com

 -
    ins: G. Mirsky
    name: Greg Mirsky
    organization: Ericsson
    email: gregimirsky@gmail.com


normative:

informative:

--- abstract

This document presents a number of use cases that have a common need for
encoding network action indicators and associated ancillary data inside MPLS packets.
There has been significant recent interest in extending the MPLS data plane to
carry such indicators and ancillary data to address a number of use cases that
are described in this document.

The use cases described in this document are not an exhaustive set, but rather
the ones that are actively discussed by members of the IETF MPLS, PALS and
DETNET working groups participating in the MPLS Open Design Team.

--- middle

# Introduction

This document describes important cases that require carrying additional
ancillary data within the MPLS packets, as well as means to indicate the
ancillary data is present, and a specific action needs to be performed on the
packet.

These use cases have been identified by the MPLS Working Group Open Design Team
working on defining MPLS Network Actions for the MPLS data plane. The MPLS
Ancillary Data (AD) can be classified as:

- implicit, or "no-data" associated with a Network Action (NA) indicator,
- residing within the MPLS label stack and referred to as In Stack Data (ISD), and
- residing after the Bottom of MPLS label Stack (BoS) and referred to as Post Stack Data (PSD).

The use cases described in this document will be used to assist in
identifying requirements and issues to be considered for future resolution by
the working group.

## Terminology

The following terminology is used in the document:

{: vspace="0"}
IETF Network Slice:
: a well-defined composite of a set of
endpoints, the connectivity requirements between subsets of these
endpoints, and associated requirements; the term 'network slice'
in this document refers to 'IETF network slice' as defined in 
{{?I-D.ietf-teas-ietf-network-slices}}.

Time-Bound Networking:
: Networks that transport time-bounded traffic.

## Acronyms and Abbreviations

> ISD: In-stack data

> PSD: Post-stack data

> MNA: MPLS Network Action

> NAI: Network Action Indicator

> AD: Ancillary Data

# Use Cases

## No Further Fastreroute

MPLS Fast Reroute (FRR) {{?RFC4090}}, {{?RFC5286}} and {{?RFC7490}} is a useful
and widely deployed tool for minimizing packet loss in the case of a link or
node failure.

Several cases exist where, once FRR has taken place in an MPLS network and
resulted in rerouting a packet away from the failure, a second FRR that impacts
the same packet to rerouting  is not helpful, and may even be disruptive. 

For example, in such a case, the packet may continue to loop until its TTL
expires.  This can lead to link congestion and further packet loss.  Thus, the
attempt to prevent a packet from being dropped may instead affect many other
packets. A proposal to address this is presented in
{{?I-D.kompella-mpls-nffrr}}.


## In-situ OAM

In-situ Operations, Administration, and Maintenance (IOAM) is used to collect
operational and telemetry information while packets traverses a particular path
in a network domain.

The term "in-situ" refers to the fact that the IOAM data fields are added to
the data packets rather than being sent within the probe packets specifically
dedicated to OAM or Performance Measurement (PM). 

IOAM can run in two modes Edge-to-Edge (E2E) and Hop-by-Hop (HbH).  In E2E
mode, only the encapsulating and decapsulating nodes will process IOAM data
fields.  In HbH mode, the encapsulating and decapsulating nodes as well as
intermediate IOAM-capable nodes process IOAM data fields. The IOAM data fields
are defined in {{?I-D.ietf-ippm-ioam-data}}, and can be used for various
OAM use-cases.

Several IOAM Options have been defined:

* Pre-allocated and Incremental
* Edge-to-Edge
* Proof-of-Transit
* Direct Export (see {{IOAM-DEX}})

{{?I-D.gandhi-mpls-ioam-sr}} defines how IOAM data fields are transported using
the MPLS data plane encapsulations, including Segment Routing (SR) with MPLS
data plane (SR-MPLS).

The IOAM data may be added after the bottom of the MPLS label stack. The IOAM
data fields can be of fixed or incremental size as defined in
{{?I-D.ietf-ippm-ioam-data}}.  {{?I-D.gandhi-mpls-ioam}} describes the
applicability of IOAM to MPLS dataplane.  The encapsulating MPLS node needs to
know if the decapsulating MPLS node can process the IOAM data before adding it
in the packet. In HbH IOAM mode, nodes that are capable of processing IOAM will
intercept and process the IOAM data accordingly. The presence of IOAM header and optional IOAM 
data will betransparent to nodes that do not support or do not participate in the IOAM
process.

### In-situ OAM Direct Export {#IOAM-DEX}


IOAM Direct Export (DEX) {{?I-D.ietf-ippm-ioam-direct-export}} is an IOAM
Option-Type in which the operational state and telemetry information is
collected according to the specified profile and exported in a manner and
format defined by a local policy.

In IOAM DEX, the user data packet is only
used to trigger the IOAM data to be directly exported or locally aggregated
without being pushed into in-flight data packets.



## Network Slicing

An IETF Network Slice service provides connectivity coupled with a set of
network resource commitments and is expressed in terms of one or more
connectivity constructs.  A slice-flow aggregate
{{?I-D.bestbar-teas-ns-packet}} refers to the set of traffic streams from one
or more connectivity constructs belonging to one or more IETF Network Slices
that are mapped to a set of network resources and provided the same forwarding
treatment.  The packets associated with a slice-flow aggregate may carry a
marking in the packet's network layer header to identify this association and
this marking is referred to as Flow-Aggregate Selector (FAS).  The FAS is used
to map the packet to the associated set of network resources and provide the
corresponding forwarding treatment to the packet.

A router that requires forwarding of a packet that belongs to a slice-flow
aggregate may have to decide on the forwarding action to take based on selected
next-hop(s), and the forwarding treatment (e.g., scheduling and drop policy) to
enforce based on the associated  per-hop behavior.

In this case, the routers that forward traffic over resources that are shared
by multiple slice-flow aggregates need to identify the slice aggregate packets
in order to enforce the associated forwarding action and treatment.

MNA can be used to indicate the action and carry ancillary data for packets
traversing Label Switched Paths (LSPs). An MNA network action can be used to
carry the FAS in MPLS packets.

### Dedicated Identifier as Flow-Aggregate Selector

A dedicated Identifier that is independent of forwarding can be carried in the
packet as a Flow-Aggregate Selector (FAS). This can be encoded in the MPLS
packet as defined in {{?I-D.kompella-mpls-mspl4fa}},
{{?I-D.li-mpls-enhanced-vpn-vtn-id}}, and
{{?I-D.decraene-mpls-slid-encoded-entropy-label-id}}.  The FAS is used to
associate the packets belonging to Slice-Flow Aggregate to the underlying
Network Resource Partition (NRP) as described in
{{?I-D.bestbar-teas-ns-packet}}.

When MPLS packets carry a dedicated FAS identifier, the MPLS LSRs use the
forwarding label to select the forwarding next-hop(s), and use the FAS in the
MPLS packet to infer the specific forwarding treatment that needs to be applied
on the packet.

The FAS can be encoded within an MPLS label carried in the packet's MPLS label
stack. All MPLS packets that belong to the same flow aggregate MAY carry the
same FAS identifier.


### Forwarding Label as a Flow-Aggregate Selector

{{?RFC3031}} states in Section 2.1 that: 'Some routers analyze a packet's
network layer header not merely to choose the packet's next hop, but also to
determine a packet's "precedence" or "class of service"'.  

It is possible by assigning a unique MPLS forwarding label to each flow
aggregate (FEC) to distinguish the packets forwarded to the same destination.
from other flow aggregates.  In this case, LSRs can use the
top forwarding label to infer both the forwarding action and the forwarding
treatment to be invoked on the packets.

## Generic Delivery Functions

The Generic Delivery Functions (GDF), defined in
{{?I-D.zzhang-intarea-generic-delivery-functions}}, provide a new mechanism to
support functions analogous to those supported through the IPv6 Extension
Headers mechanism. For example, GDF can support fragmentation/reassembly
functionality in the MPLS network by using the Generic Fragmentation Header.
MNA can support GDF by placing a GDF header in an MPLS packet within the
Post-Stack Data block {{?I-D.ietf-mpls-mna-fwk}}. Multiple GDF headers can also
be present in the same MPLS packet organized as a list of headers.

## Delay Budgets for Time-Bound Applications

The routers in a network can perform two distinct functions on incoming
packets, namely forwarding (where the packet should be sent) and scheduling
(when the packet should be sent). IEEE-802.1 Time Sensitive Networking (TSN) and
Deterministic Networking provide several mechanisms for scheduling under the
assumption that routers are time-synchronized.  The most effective mechanisms
for delay minimization involve per-flow resource allocation.

Segment Routing (SR) is a forwarding paradigm that allows encoding forwarding
instructions in the packet in a stack data structure, rather than being
programmed into the routers.  The SR instructions are contained within a packet
in the form of a First-in First-out stack dictating the forwarding decisions of
successive routers.  Segment routing may be used to choose a path sufficiently
short to be capable of providing a bounded end-to-end latency but does
not influence the queueing of individual packets in each router along that path.

When carried over the MPLS data plane, a solution is required to enable the
delivery of such packets that can be delivered to their final destination by a
given time budget.

### Stack Based Methods for Latency Control

One efficient data structure for inserting local deadlines into
the headers is a "stack", similar to that used in Segment Routing to
carry forwarding instructions.  The number of deadline values in the
stack equals the number of routers the packet needs to traverse in
the network, and each deadline value corresponds to a specific
router.  The Top-of-Stack (ToS) corresponds to the first router's
deadline while the Bottom-of-Stack (BoS) refers to the last's.  All
local deadlines in the stack are later or equal to the current time
(upon which all routers agree), and times closer to the ToS are
always earlier or equal to times closer to the BoS.

The ingress router inserts the deadline stack into the packet headers; no other
router needs to be aware of the requirements of the time-bound flows.
Hence admitting a new flow only requires updating the information base of the
ingress router.

MPLS LSRs that expose the Top of Stack (ToS) label can also inspect the
associated "deadline" carried in the packet (either in MPLS stack as ISD or
after BoS as PSD). 

## NSH-based Service Function Chaining

{{?RFC8595}} describes how Service Function Chaining (SFC) can be realized in
an MPLS network by emulating the NSH by using only MPLS label stack elements.

The approach in {{?RFC8595}} introduces some limitations that are discussed in
{{?I-D.lm-mpls-sfc-path-verification}}. This approach, however, can benefit
from the framework introduced with MNA {{?I-D.andersson-mpls-mna-fwk}}.

For example, it may be possible to extend NSH emulation using MPLS
labels [RFC8595] to support the functionality of NSH Context Headers,
whether fixed or variable-length. One of the use cases could support Flow ID
{{?I-D.ietf-sfc-nsh-tlv}} that may be used for load-balancing among
Service Function Forwarders (SFFs) and/or the Service Function (SF)
within the same SFP.

## Network Programming

In SR, an ingress node steers a packet through an ordered list of instructions,
called "segments".  Each one of these instructions represents a
function to be called at a specific location in the network.  A
function is locally defined on the node where it is executed and may
range from simply moving forward in the segment list to any complex
user-defined behavior. 

Network Programming combines Segment Routing (SR) functions to achieve a
networking objective that goes beyond mere packet routing.

It may be desirable to encode a pointer to function and its arguments
within an MPLS packet transport header. For example, in MPLS we can encode the
FUNC::ARGs within the label stack or after the Bottom of Stack to support the
equivalent of FUNC::ARG in SRv6 as described in {{?RFC8986}}.

## Application Aware Networking

Application-aware Networking (APN) as described in
{{?I-D.li-apn-problem-statement-usecases}} allows application-aware information
(i.e., APN attributes) including APN identification (ID) and/or APN parameters
(e.g.  network performance requirements) to be encapsulated at network edge
devices and carried in packets traversing an APN domain. 

The APN data is carried in packets to facilitate service provisioning, and be
used to perform fine-granularity traffic steering and network resource
adjustment. To support APN in MPLS networks, mechanisms are needed to carry
such APN data in MPLS encapsulated packets.

# Co-existence of Usecases

Two or more of the aforementioned use cases MAY co-exist in the same packet.
This may require the presence of multiple ancilary data
(whether In-stack or Post-stack ancillary data) to be present in the same MPLS packet.

For example, IOAM may provide key functions along with network slicing to help
ensure that critical network slice SLOs are being met by the network provider.
In this case, IOAM is able to collect key performance measurement parameters of
network slice traffic flows as it traverses the transport network.

# IANA Considerations

This document has no IANA actions.

# Security Considerations

This document introduces no new security considerations.

# Acknowledgement

The authors gratefully acknowledge the input of the members of the
MPLS Open Design Team.


# Contributors

The following individuals contributed to this document:

~~~

   Loa Andersson
   Bronze Dragon Consulting
   Email: loa@pi.nu

~~~
