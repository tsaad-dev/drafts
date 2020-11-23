---
title: Realizing Network Slices in IP/MPLS Networks
abbrev: IP/MPLS Network Slicing
docname: draft-bestbar-teas-ns-packet-00
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
    ins: V. Beeram
    name: Vishnu Pavan Beeram
    organization: Juniper Networks
    email: vbeeram@juniper.net


normative:
  RFC2119:
  RFC8174:

informative:

--- abstract

Network slicing provides the ability to partition a physical network into
multiple isolated logical networks of varying sizes, structures, and functions
so that each slice can be dedicated to specific services or customers.  Network
slices need to operate in parallel with varying degrees of isolation while
providing slice elasticity in terms of network resource allocation. The
Differentiated Service (Diffserv) model allows for carrying multiple services
on top of a single physical network by relying on compliant nodes to apply
specific forwarding treatments on to packets that carry the respective Diffserv
code point. This document proposes a solution based on the Diffserv model to
realize network slicing in IP/MPLS networks.  The proposed solution is agnostic
to the path control technology used in the network slicing domain and allows
service differentiation of traffic within a given network slice.



--- middle

# Introduction

Network slicing allows a Service Provider, or a network operator to create
independent and isolated logical networks on top of a common or shared physical
network infrastructure. Such network slices can be offered to customers or used
internally by the Service Provider to facilitate or enhance their service
offerings. A Service Provider can also use network slicing to structure and
organize the elements of its infrastructure. For example, certain network
resource capabilities and functionality can be grouped together providing a
self-contained unit (network slice) of varying size and complexity.

When logical networks representing network slices are realized on top of a
shared physical network, it is important to steer traffic on the specific
network resources allocated for the network slice. In packet networks,
the packets that traverse a specific network slice MAY be identified by specific field(s)
carried within the packet. A network slice boundary node will usually mark or
populate the respective field(s) in packets that enter a network slice to allow
interior slice nodes to identity those packets and apply the specific Per Hop
Behavior (PHB) that is associated with the slice and that defines the
scheduling treatment and, in some cases, the packet drop probability.

In a Differentiated Service (Diffserv) domain {{?RFC2475}}, packets requiring
the same forwarding treatment are classified and marked with a Class Selector
(CS) at domain ingress nodes. At transit nodes, the CS field inside the packet
is inspected to determine the specific forwarding treatment to be applied
before the packet is forwarded further.

Multiple network slices can be realized on top of a shared physical
infrastructure network. A single network slice may also support multiple
forwarding treatments or Diffserv classes that can be carried over the same
logical network slice. This document proposes a solution that allows proper
placement of paths and respective treatment of traffic traversing network slice
resource(s) in IP/MPLS networks. The network slice traffic may be marked at
slice boundary nodes with a Slice Selector (SS) to allow routers to apply a
specific forwarding treatment that guarantees the slice Service Level
Agreements (SLAs). Network slice traffic may further carry a Diffserv CS to
allow differentiation of forwarding treatments for packets forwarded over the
same network slice network resources.

For example, when using MPLS as a dataplane, it is possible to identify packets
belonging to the same slice by carrying a global MPLS Slice Selector Label
(SSL) in the MPLS label stack that identifies the slice in each packet.
Additional Diffserv classification may be indicated in the MPLS Traffic
Class (TC) bits of the SSL to allow further differentiation of traffic
treatments of traffic traversing the same slice network resources.

## Terminology

The reader is expected to be familiar with the terminology specified in
{{?I-D.nsdt-teas-ietf-network-slice-definition}} and
{{?I-D.draft-nsdt-teas-ns-framework-04}}.

The following terminology is used in the document:

{: vspace="0"}
Slicing capable node:
: a node that supports one of the network slicing approaches described in this document.

Slicing incapable node:
: a node that does not support one of the network slicing approaches described in this document.

Slice traffic:
: traffic that is forwarded over network resource(s) associated with a specific network slice.

Slice path:
: a path that is setup over network resource(s) associated with a specific network slice.

Slice-aware TE:
: a mechanism for TE path selection that takes into account the available network resource(s) associated with a specific network slice.


The key words "MUST", "MUST NOT", "REQUIRED", "SHALL", "SHALL NOT", "SHOULD",
"SHOULD NOT", "RECOMMENDED", "NOT RECOMMENDED", "MAY", and "OPTIONAL" in this
document are to be interpreted as described in BCP 14 {{RFC2119}} {{RFC8174}}
when, and only when, they appear in all capitals, as shown here.

## Acronyms and Abbreviations

> CS: Class Selector

> SS: Slice Selector

> Slice-PHD: Slice Per-Hop Definition as described in {{SliceDefinition}}

> Slice-PHB: Slice Per-Hop Behavior as described in {{SlicePHB}}

> SSL: Slice Selector Label as described in section {{SliceSelector}}

> SSLI: Slice Selector Label Indicator

> SLA: Service Level Agreement

> SLO: Service Level Objective

> Diffserv: Differentiated Services

> DS-TE: Differentiated Services Traffic Engineering

> MPLS: Multiprotocol Label Switching

> LSP: Label Switched Path

> LSR: Label Switching Router

> LER: Label Edge Router

> RSVP: Resource Reservation Protocol

> TE: Traffic Engineering

> SR: Segment Routing


## Scope

The definition of Network Slice for use within the IETF and the characteristics
of IETF Network Slice are specified in
{{?I-D.draft-nsdt-teas-transport-slice-definition-04}}. A framework for reusing IETF
VPN and traffic-engineering technologies to realize IETF Network Slices is
discussed  in {{?I-D.draft-nsdt-teas-ns-framework-04}}.

This document provides a solution that addresses the network slice
requirements in packet networks from a device and network resource level
perspective based on DiffServ principles.

# Network Resource Slicing Membership

A network slice can span multiple parts of an IP/MPLS network (e.g. all or
specific network resources in the access, aggregation, or core network), and
can stretch  across multiple operator domains.  A network slice may include all
or a sub-set of the physical nodes and links of an IP/MPLS network, and it may
be comprised of dedicated and/or shared network resources (e.g. in terms of
processing power, storage, and bandwidth) and may have varying degrees of
isolation from the other network slices.

## Dedicated Network Resources

Physical network resources may be fully dedicated to a specific network slice.
For example, this allows traffic belonging to a slice to traverse the dedicated
resources without network resource contention from traffic of another network
slice.  Dedicated network resource slicing allows for simple partitioning of the
physical network resources into multiple isolated network slices without the
need to distinguish packets traversing the dedicated network resources since only one
slice traffic can use them.

## Shared Network Resources

To optimize network utilization, sharing of the physical network resources may
be desirable. In such case, the same physical network resource capacity is partitioned
among logical network slice(s). Shared network resources can be partitioned in the dataplane
(for example by applying hardware policers and shapers), partitioned in the
control plane by providing a logical representation of the physical link that
has a subset of the network resources available to it.

# Path Selection

Path selection in a network can be network state dependent, or network state
independent as described in Section 5 of {{?I-D.draft-dt-teas-rfc3272bis-11}}.
The latter is the choice commonly used by IGP(s) when selecting a best path to
a destination prefix, while the former is used by ingress TE routers, or Path
Computation Engines (PCEs) when optimizing the placement of a flow based on the
current network resource utilization.

For example, when steering traffic on a delay optimized path, the IGP can use
its Link State Database (LSDB)'s view of the network topology to compute a path
optimizing for the delay metric of each link in the network resulting in a
cumulative lowest delay path.

When path selection is network state dependent, the path computation can 
leverage Traffic Engineering mechanisms (e.g. as defined in {{?RFC2702}})
to compute feasible paths taking into account the incoming traffic demand
rate and current state of network. This allows avoiding overly utilized
link(s), and reduces the chance of congestion on traversed link(s).

To enable TE path placement, the link state is advertised with current
reservation(s), thereby reflecting the available bandwidth on each link.  Such
link reservations may be maintained centrally on a network wide network
resource manager, or distributed on devices (as usually done with RSVP). TE
extensions exist today to allow IGPs (e.g. {{!RFC3630}} and {{!RFC5305}}), and
BGP-LS {{!RFC7752}} to advertise such link state reservations.

When network resource reservations are also slice aware, the link state can
carry per network slice state (e.g. per network slice link reservable
bandwidth).  This allows path computation to take into account the specific
network resources available for a network slice when determining the path for a
specific flow.  In this case, we refer to the process of path placement and
path provisioning has Slice-aware Traffic Engineering (Slice-aware TE).

# Approaches to Network Resource Slicing {#SliceModes}

The partitioning of the shared network resources amongst multiple slices can be
achieved in:

{:req: counter="bar" style="format %c)"}
 * control plane only, or
 * data plane only, or
 * both control and data planes.
{: req}


## Data Plane Network Resource Slicing {#DataplaneSlicing}

The physical network resources can be partitioned on network devices
by applying a Per-Hop forwarding Behavior (PHB) onto packets that traverse the
network device(s). In the Diffserv model, a Class Selector (CS) is carried in the
packet and is used by transit node(s) to apply the PHB that
determines the scheduling treatment and, in some cases, drop probability for packet(s).

When dataplane network resource slicing is required, packets need to be forwarded on the
specific slice network resources and be applied a specific forwarding treatment that
is dictated by the Slice Per-Hop Definition (Slice-PHD) (refer to
{{SliceDefinition}} below) consumed by each device.  A slice Selector (SS) MAY
be carried in each slice packet to identify the slice that it belongs to. 

The ingress node of a slice domain, in addition to marking packets with a
Diffserv CS, MAY also add a SS to each slice packet. The transit node(s) within
a slice domain MAY use the SS to associate packets with a slice and to
determine the Slice Per Hop Behavior (Slice-PHB) that is applied to the packet (refer to
{{SlicePHB}} for further details). The CS MAY be used to apply a Diffserv PHB
on to the packet to allow differentiation of traffic treatment within the
same network slice.

When dataplane only network resource slicing is desirable, routers may rely on a
network state independent view of the topology to determine the best path(s) to
reach destination(s). In this case, the best path selection dictates the
forwarding path of packets to the destination. The SS that is carried in each
packet determines the specific Slice-PHB treatment for each slice along the
selected path.

For example, Segment-Routing flexible algorithm may be deployed in a network to
steer packet(s) on the lowest cumulative delay. A Slice-PHD may be used to enable
the link(s) along the least latency path for dataplane slicing.  Network slice
packet(s) forwarded along the lowest delay path can carry the SS when forwarded
along the least latency path. Transit nodes along the lowest delay path can
inspect the SS and Diffserv CS to determine the Slice-PHB and the Diffserv
class PHB to apply to packets before they are forwarded downstream.

## Control Plane Network Resource Slicing

The physical network resources in the network can be logically partitioned by having
a representation of network resources appear in a virtual topology.  The
virtual topology can contain all or a subset of the physical network
resource(s). The logical network resources that appear in the virtual topology can
reflect a part, whole, or in-excess of the physical network resource capacity (when
oversubscription is desirable). For example, a physical link bandwidth can be
divided into fractions, each belonging to a slice. Each fraction of the
physical link bandwidth can be represented as a logical link in a virtual
topology that is used when determining path(s) in a specific slice. The per slice
virtual network can be used by routing protocol(s), or by the ingress/PCE when
computing slice aware path(s).

To perform network state dependent path computation in each slice, the resource
reservation on each link needs to be slice aware (Slice-aware TE). Depending on
the network Slice-PHD, a physical link may be part of one or more slice(s).
Each such link may be sliced 'n' ways so that each slice will have certain
network resources associated with it.  The per slice network resource
availability on link(s) are updated (and may eventually be advertised in the
network) when new path(s) are placed in the network. The per slice resource
reservation, in this case, can be maintained on each device(s) or be
centralized on a resource reservation manager that holds link reservation
state(s) on links in the network.

A number of network slice(s) can share the available network resource(s) allocated to
each network slice amongst a group. In this case, a node can update the
reservable bandwidth for each slice to take into consideration the available
bandwidth from other slice(s) in the same group.

For illustration purposes, the diagram below represents bandwidth isolation or
sharing amongst a group of network slice(s). In Figure 1a, the network slices:
Slice1, Slice2, Slice3 and Slice4 are not sharing any bandwidths between each
other. In Figure 1b, the network slices: Slice1 and Slice2 can share the
available bandwidth portion allocated to each amongst them.
Similarly, Slice3 and Slice4 can share amongst themselves any available bandwidth
allocated to them, but they cannot share available bandwidth allocated to
Slice1 or Slice2.  In both cases, the Max Reservable Bandwidth may exceed the
actual physical link resource capacity to allow for over subscription.

~~~~~~
   I-----------------------------I       I-----------------------------I 
   <--Slice1->                   I       I-----------------I           I
   I---------I                   I       I <-Slice1->      I           I
   I         I                   I       I I-------I       I           I
   I---------I                   I       I I       I       I           I
   I                             I       I I-------I       I           I
   <-----Slice2------>           I       I                 I           I
   I-----------------I           I       I <-Slice2->      I           I
   I                 I           I       I I---------I     I           I
   I-----------------I           I       I I         I     I           I
   I                             I       I I---------I     I           I
   <---Slice3---->               I       I                 I           I
   I-------------I               I       I Slice1 + Slice2 I           I
   I             I               I       I-----------------I           I
   I-------------I               I       I                             I
   I                             I       I                             I
   <---Slice4---->               I       I-----------------I           I
   I-------------I               I       I <-Slice3->      I           I
   I             I               I       I I-------I       I           I
   I-------------I               I       I I       I       I           I
   I                             I       I I-------I       I           I
   I Slice1+Slice2+Slice3+Slice4 I       I                 I           I
   I                             I       I <-Slice4->      I           I
   I-----------------------------I       I I---------I     I           I
   <--Max Reservable Bandwidth-->        I I         I     I           I
                                         I I---------I     I           I
                                         I                 I           I
                                         I Slice3 + Slice4 I           I
                                         I-----------------I           I
                                         I Slice1+Slice2+Slice3+Slice4 I
                                         I                             I
                                         I-----------------------------I
                                         <--Max Reservable Bandwidth-->
           (a)                                      (b)
~~~~~~
{: #resource-sharing title="
(a) bandwidth allocation(s) when no sharing between slice(s),
(b) bandwidth allocation(s) when sharing between slice(s) of the same group."}


## Data and Control Plane Network Resource Slicing 

In order to support strict guarantees and hard isolation between network
slice(s), the network resource(s) can be partitioned in both the control plane
and data plane.

The control plane partitioning allows the creation of customized
topologies per slice that router(s) or a Path Computation Engine (PCE) can use
to determine optimal path placement for specific demand flows (Slice-aware TE).

The data plane partitioning protects slice traffic from network resource contention 
that occurs due to bursts in traffic from different slice(s) traversing the
same shared network resource.

# Network Slice Instantiation

A network slice can span multiple technologies and multiple administrative
domains.  Depending on the network slice consumer's requirements, a network
slice can be isolated from other network slices in terms of data, control
or management planes.

The instantiation of a network slice may necessitate a network Slice Manager or
service orchestrator that accepts a Service Layer Slice Intent as input and is
translates it to a network wide device specific Slice-PHD as shown in
{{ns-instantiation}}.

The Diffserv procedures may be employed within the same network slice to
realize multiple classes of traffic belonging to the same slice.

~~~~~
                        +----------+
                        | Slice    |
                        | Manager  |
                        +----------+
                             |   Network Slice
                             |   Service Layer
           =========================================
                             |   Network Slice
                             |   Device/Resource Layer
                             |
                             |   Slice Per-Hop Definition
                             |   Distribution
                         XXXX|XXXXXX
                       XX   /|      XX
                     XX    / |        XX
                   XX     /  |          XX
               XXXX      v   v            XXXX
              XXX Ingress    All            XXX
              XXX node(s)    nodes           XXX
               XXX                          XXX
                XXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
             <----------- Path Control --------->
                     RSVP-TE/SR-Policy /SR-FlexAlgo ..
~~~~~
{: #ns-instantiation title="Network Slice instantiation model."}


## Slice Intent

A network slicing solution may be realized using a network slice service Layer, and a
device/resource Layer.  The service layer can be managed by a service
orchestrator that exposes a north bound interface to slice consumers that can
be used to convey the intent. Depending on the use cases and type of services
for which the end-to-end slice is instantiated, multiple levels of control may
be exposed to the tenants by a slice provider.

For example, network slicing provider may allow for a connectivity and data
processing that is tailored to specific customer requirements.  At the service
layer, the consumer of a network slice expresses their intent for a particular
network slice by specifying requirements rather than how a slice is realized.
The requirements for a network slice can vary and can be expressed in terms of
connectivity needs between end-points (point-to-point, point-to-multipoint or
multipoint-to-multipoint) with customizable network capabilities that may
include data speed, quality, latency, reliability, security, and services
(refer to {{?I-D.draft-nsdt-teas-transport-slice-definition-04}} for more details).
These capabilities are always provided based on a Service Level Agreement (SLA)
between the network slice consumer and the provider.

The network slice orchestrator is responsible for translating the network slice
consumer intent into a Slice-PHD that can be instantiated by network
elements at Device/Resource layer so that the network slice consumer requirements
in terms of network characteristics are met.

## Slice Per-Hop Definition {#SliceDefinition}

The high-level slice intent is consumed to produce a set of features and
attributes that can be provisioned on network elements. The device level Slice-PHD
includes attributes related to:

- Dataplane specific properties: This includes the SS, any firewall
  rules or flow-spec filters, and QoS profiles associated with the slice
  and any classes within it.

- Control plane specific properties: This includes guaranteed bandwidth, any
  network resource sharing amongst slice(s), and slice reservation preference to
  prioritize any reservations of a specific slice over others.

- Membership policies: This defines policies that dictate node/link/function network resource
  topology association for a specific slice.

There is a desire for flexibility in implementing network slices to support the
services across networks consisting of products from multiple vendors, and may
be grouped into disparate domains and using various path control
technologies and tunnel types. It is expected that having a standardized data
model for a Slice-PHD will facilitate the instantiation of a network
slice on a network slicing capable node.

It is also possible to deliver a Slice-PHD to network devices using several
mechanisms, including using protocols such as NETCONF or RESTCONF, or
exchanging it using a suitable routing protocol that network devices
participate in (such as IGP(s) or BGP).

### Slice Data Plane Selector {#SliceSelector}

A router MUST be able to identify a packet as belonging to a network slice
before it can apply the proper forwarding treatment or PHB associated with the slice.
One or more fields within the packet MAY be selected as a SS to do this.

Per Slice Forwarding Address:

>  One approach to distinguish packets targeted to
a destination but belong to different slices is to assign multiple forwarding
addresses (or multiple MPLS label bindings in the case of MPLS network) to the same destination
-- one for each slice the destination can be reached over.  For example, when
realizing a network slice over an IP dataplane, the same destination can be
assigned multiple IP addresses (or multiple SRv6 locators in the case of SRv6 network) to enable steering of traffic to the same destination over multiple network slices.

> Similarly, when an MPLS dataplane is used, {{!RFC3031}} states in Section 2.1
that: 'Some routers analyze a packet's network layer header not
merely to choose the packet's next hop, but also to determine a packet's
"precedence" or "class of service'. In such case, the same destination can be
assigned multiple MPLS label bindings corresponding to an LSP that traverses
network resources of a specific slice towards the destination.


> The specific slice forwarding address (or MPLS forwarding label) can be
> carried in the packet belonging to a network slice to allow (IP or MPLS) routers
along the path to identify the packets and apply the respective per Slice-PHB
and forwarding treatment. This approach requires maintaining per slice state
for each destination in the network in both the control and data plane and on
each router in the network.

> For example, consider a network slicing provider
with a network composed of 'N' nodes, each with 'K' adjacencies to its
neighbors.  Assuming a node is reachable in as many as 'M' network slice(s),
the node will have to assign and advertise reachability for 'N' unique
forwarding addresses, or MPLS forwarding labels corresponding to the 'N'
slices. Similarly, each node will have to assign a unique forwarding address
(or MPLS forwarding label) for each of its 'K' adjacencies to enable strict
steering over each.  Consequently, the control plane at any node in the network
will need to store as many as (N+K)\*M states. In addition, a node will have to
store and program (N+K)\*M forwarding addresses or labels entries in its
Forwarding Information Base (FIB) to realize this. Therefore, as 'N', 'K', and
'M' parameters increase, this approach will have scalability challenges
both in the control and data planes.

Per Slice Selector:

> A Slice Selector (SS) field can be carried in each packet to
identify the packet belonging to a specific slice, independent of
the forwarding address or MPLS forwarding label that is bound to the destination. Routers
within the network slice domain can use the forwarding address (or MPLS
forwarding label) to determine the forwarding path, and use the SS field in the packet to
determine the specific Slice-PHB that gets applied on the packet. This
approach allows better scale since it relies on a single forwarding address or
MPLS label binding to be used independent of the number of network slices
required along the path.
In this case, the additional SS field will need to be carried, and maintained
in each packet while it traverses the slice domain.

> The SS can be carried in one of multiple fields within the packet, depending on
the dataplane type used. For example in MPLS networks, the SS can be
represented as a global MPLS label that is carried in the packet's MPLS label stack.
All packets that belong to the same slice MAY carry the same SS label in the
MPLS label stack. It is possible, as well, to have multiple SS label(s) point
to the same Slice-PHB.

> The MPLS SS Label (SSL) may appear in
several positions in the MPLS label stack. For example, the MPLS SSL can be
maintained at the top of the label stack while the packet is forwarded along the MPLS
path. In this case, the forwarding at each hop is determined by the forwarding
label that resides below the SSL.  {{top-stack}} shows an example where the SSL
appears at the top of MPLS label stack in a packet. PE1 is a network Slice edge node
that receives the packet that needs to be steered over a slice specific MPLS Path. PE1
computes the SR Path composed of the Label Segment-List={9012, 9023}. It
imposes a SSL=1001 corresponding to Slice-ID=1001 followed by the SR Path
Segment-List.  At P1, the top label sets the context of the packet to
Slice-ID=1001. The forwarding of the packet is determined by inspecting the
forwarding label (below the SSL) within the context of SSL.

~~~~
  SR Adj-SID:           SSL: 1001
     9012: P1-P2
     9023: P2-PE2

         /-----\        /-----\        /-----\       /-----\
         | PE1 | -----  | P1  | ------ | P2  |------ | PE2 |
         \-----/        \-----/        \-----/       \-----/

In 
packet: 
+------+       +------+         +------+        +------+
| IP   |       | 1001 |         | 1001 |        | 1001 |
+------+       +------+         +------+        +------+
| Pay- |       | 9012 |         | 9023 |        | IP   | 
| Load |       +------+         +------+        +------+
+----- +       | 9023 |         | IP   |        | Pay- |
               +------+         +------+        | Load |
               | IP   |         | Pay- |        +------+
               +------+         | Load |
               | Pay- |         +------+
               | Load |
               +------+
~~~~
{: #top-stack title="SSL at top of label stack."}

> The SSL can also reside at the bottom of the label stack. For example,
the VPN service label may also be used as an SSL which allows steering of
traffic towards one or more egress PEs over the same network slice.
In such cases, one or more service labels MAY be mapped to the same slice.
The same VPN label may also be allocated on all Egress PEs so it can serve
as a single SSL for a specific network slice. Alternatively, a
range of SSL (VPN labels) may be mapped to a single network slice to
allow carrying multiple VPN(s) over the same network slice as
shown in {{bottom-stack}}.


~~~~
  SR Adj-SID:          SSL (VPN) on PE2: 1001
     9012: P1-P2
     9023: P2-PE2

         /-----\        /-----\        /-----\       /-----\
         | PE1 | -----  | P1  | ------ | P2  |------ | PE2 |
         \-----/        \-----/        \-----/       \-----/

In 
packet: 
+------+       +------+         +------+        +------+
| IP   |       | 9012 |         | 9023 |        | 1001 |
+------+       +------+         +------+        +------+
| Pay- |       | 9023 |         | 1001 |        | IP   | 
| Load |       +------+         +------+        +------+
+----- +       | 1001 |         | IP   |        | Pay- |
               +------+         +------+        | Load |
               | IP   |         | Pay- |        +------+
               +------+         | Load |
               | Pay- |         +------+
               | Load |
               +------+
~~~~
{: #bottom-stack title="SSL or VPN label at bottom of label stack."}

> In some cases, the position of the SSL may not be at a fixed place
in the MPLS label header. In this case, transit routers cannot expect
the SSL at a fixed place in the MPLS label stack. This can be addressed
by introducing a new Special Purpose Label from the label reserved space called
a Slice Selector Label Indicator (SSLI). The slice network ingress boundary
node, in this case, will need to impose at least two additional MPLS labels
(SSLI + SSL) to identify the slice that the packets belong to as shown in {{sli-sl}}.

~~~~
     SR Adj-SID:          SSLI/SSL: SSLI/1001
        9012: P1-P2
        9023: P2-PE2

            /-----\        /-----\        /-----\       /-----\
            | PE1 | -----  | P1  | ------ | P2  |------ | PE2 |
            \-----/        \-----/        \-----/       \-----/

   In
   packet:
   +------+       +------+         +------+        +------+
   | IP   |       | 9012 |         | 9023 |        | SSLI |
   +------+       +------+         +------+        +------+
   | Pay- |       | 9023 |         | SSLI |        | 1001 |
   | Load |       +------+         +------+        +------+
   +------+       | SSLI |         | 1001 |        | IP   |
                  +------+         +------+        +------+
                  | 1001 |         | IP   |        | Pay- |
                  +------+         +------+        | Load |
                  | IP   |         | Pay- |        +------+
                  +------+         | Load |
                  | Pay- |         +------+
                  | Load |
                  +------+
~~~~
{:#sli-sl title="SSLI and bottom SSL at bottom of label stack."}



> When the slice is realized over an IP dataplane, the SSL can be encoded in
the IP header. For example, the SSL can be encoded in portion of the IPv6
Flow Label field as described in {{!I-D.draft-filsfils-spring-srv6-stateless-slice-id-01}}.

### Slice Network Resource Reservation

Bandwidth and network resource allocation strategies for network slicing are
essential to achieve optimal placement of paths within the
network while still meeting the target SLOs.

Resource reservation allows for the managing of available bandwidth and for
prioritization of existing allocations to enable preference based preemption
when contention on a specific network resource arises. Sharing of a network resource's
available bandwidth amongst a group of slices may also be desirable.  For
example, a slice may not always be using all of its reservable bandwidth; this
allows other slices in the same group to use the available bandwidth resources.

Congestion on shared network resources may result from sub-optimal placement
of paths in different network slices. When this occurs, preemption
of some slice specific paths may be desirable to alleviate congestion.
A preference based allocation scheme enables prioritization of slice paths
that can be preempted.

Since network characteristics and its state can change over time, the per slice
topology and its state also needs to be propagated in the network to enable
ingress TE routers or Path Computation Engine (PCEs) to perform accurate  path placement
based on the current state of the network slice.

### Slice Per-Hop Behavior {#SlicePHB}

In Diffserv terminology, the forwarding behavior that is assigned to a specific
class is called a Per-Hop Behavior (PHB). The PHB defines the forwarding
precedence that a marked packet with a specific CS receives in relation to
other traffic on the Diffserv-aware network.

A Slice Per Hop Behavior (Slice-PHB) is the externally observable forwarding behavior
applied to a specific packet belonging to a slice. The goal of a Slice-PHB is
to provide a specified amount of network resources for traffic belonging to a
specific slice. A single network slice may also support multiple forwarding treatments or
services that can be carried over the same logical network slice. 

The slice traffic may be
identified at slice boundary nodes by carrying a SS to allow
router(s) to apply a specific forwarding treatment that guarantee the slice
SLA(s). 

With Differentiated Services (Diffserv) it is possible to carry  multiple
service(s) over a single converged network. Packets requiring the same forwarding
treatment are marked with a Class Selector (CS) at domain ingress nodes. Up to
eight classes or Behavior Aggregated (BAs) may be supported for a given
Forwarding Equivalence Class (FEC) {{?RFC2475}}.  To support multiple
services over the same network slice, a slice packet MAY also carry a Diffserv
CS to identify the specific Diffserv forwarding treatment to be applied on the
different service traffic belonging to the same slice.

At transit nodes, the CS field carried inside the packets are used to determine the
specific Per Hop Behavior (PHB) that determines the forwarding and scheduling
treatment before packets are forwarded, and in some cases, drop probability for
each packet.


### Slice Topology Membership

A network slice is built on top of a customized topology that may include the
full or subset of the physical network topology. The network slice topology
could also span multiple administrative domains and/or multiple dataplane
technologies.

The network slice topology can overlap or share a subset of links with another
network slice topology. A number of policies or topology filters can be
defined to limit the specific topology elements that belong to a network
slice.

The Slice-PHD membership can carry the topology filtering policies. For example,
such policies can leverage Resource Affinities as defined in {{?RFC2702}}
to include or exclude certain link(s) in a specific network slice topology.
The Slice-PHD may also include a reference to a predefined topology (e.g. derived from
from a Flexible Algorithm Definition (FAD) as defined in {{!I-D.ietf-lsr-flex-algo}},
or Multi-Topology ID as defined {{!RFC4915}}.

Alternatively, the topology filtering policies can specify specific link properties (such as 
delay, bandwidth capacity, security) to filter/include such link(s) in a network slice
topology.

## Network Slice Boundary

A network slice originates at the boundary of a network slice provider at edge
node(s).  Traffic that is steered over the network slice may traverse
network slicing capable interior nodes, as well as, network slicing incapable
interior nodes.

The network slice may compose of one or more administrative domain(s); for
example, an organization's intranet or an ISP.  The administration of the
network is responsible for ensuring that adequate network resources are provisioned
and/or reserved to support the SLAs offered by the network end-to-end.

### Network Slice Edge Nodes

Network slicing edge nodes sit at the boundary of a network slice
provider network and receive traffic that requires steering over
network resources specific to a network slice. The slice edge nodes are responsible
for identifying network slice specific traffic flows by possibly inspecting multiple fields from inbound
packets (e.g. implementations may inspect IP traffic's network 5-tuple in the
IP and transport protocol headers) to decide on which network slice it can be
forwarded.

Network slice ingress nodes may condition the inbound traffic at network boundaries in
accordance with the requirements or rules of each service's SLA(s).  The
requirements and rules for network slice services are set using
mechanisms which are outside the scope of this document.

When dataplane slicing is required, the slice boundary nodes are responsible for
adding a suitable SS onto packets that belong to specific
network slices. In addition, edge nodes MAY mark the corresponding
Diffserv CS to differentiate between different types of traffic carried
over the same network slice.

### Network Slice Interior Nodes

A network slice interior node receives slice traffic and MAY be able to identify the
packets belonging to a specific network slice by inspecting the SS
field carried inside each packet, or by inspecting other fields
within the packet that may identify specific flows belonging to a specific
network slice. For example when dataplane slicing is required, interior
nodes can use the SS carried within the packet to apply the corresponding Slice-PHB
forwarding behavior. Nodes within the network slice provider network may also
inspect the Diffserv CS within each packet to apply a per Diffserv class PHB
within the network slice, and allow differentiation of forwarding treatments
for packets forwarded over the same network slice network resources.

### Network Slice Incapable Nodes

Packets that belong to a network slice may need to traverse nodes that are
incapable of network slicing. In this case, several options are possible to
allow the network slice traffic to continue to be forwarded over such devices
and be able to resume the network slice forwarding treatment once the traffic
reaches devices that are capable of network slicing.

When dataplane network slicing is desirable, packets carry a SS to
allow slice interior nodes to identify them. To enable end-to-end network
slicing, the SS MUST be maintained in the packets as they traverse
devices within the network -- including devices incapable of network
slicing.

For example, when the SS is an MPLS label at the bottom of the MPLS label
stack, packets can traverse over devices that are incapable of network
slicing without any further considerations. On the other hand, when the SSL
is at the top of the MPLS label stack, packets can be bypassed (or tunneled)
over the network slicing incapable devices towards the next device that
supports network slicing as shown in {{sl-interworking}}.

~~~~
  SR Node-SID:           SSL: 1001    @@@: network slicing enforced
     1601: P1                         ...: network slicing not enforced
     1602: P2
     1603: P3
     1604: P4
     1605: P5

            @@@@@@@@@@@@@@ ........................
                                                  .
           /-----\        /-----\        /-----\  .
           | P1  | -----  | P2  | ----- | P3  |   .
           \-----/        \-----/        \-----/  .
                                            |     @@@@@@@@@@
                                            |     
                                         /-----\        /-----\ 
                                         | P4  | ------ | P5  |
                                         \-----/        \-----/


            +------+       +------+        +------+     
            | 1001 |       | 1604 |        | 1001 |     
            +------+       +------+        +------+     
            | 1605 |       | 1001 |        | IP   |     
            +------+       +------+        +------+     
            | IP   |       | 1605 |        | Pay- |     
            +------+       +------+        | Load |     
            | Pay- |       | IP   |        +------+     
            | Load |       +------+                     
            +----- +       | Pay- |                     
                           | Load |                     
                           +------+                     
~~~~
{:#sl-interworking title="Extending network slice over slicing incapable device(s)."}

### Combining Network Resource Slicing Approaches

It is possible to employ a combination of the approaches that were discussed in
{{SliceModes}} to realize an end-to-end network slice. For example, data and
control plane network resource slicing can be employed in parts of a network, while
control plane only slicing can be employed in the other parts of the network. The Slice-aware path
selection in such case can take into account the per slice available network resources.
Packets carry a SS within them so the corresponding Slice-PHB can be enforced
on the parts of the network that realize dataplane network resource slicing. The SS can
be maintained while traffic traverses nodes that do not enforce any dataplane
slicing, and so slice PHB enforcement can resume once traffic traverses 
slicing capable nodes.

## Slice Traffic Steering

The usual techniques to steer traffic onto paths can be applicable when
steering traffic over paths established in a specific network slice.

For example, one or more (layer-2 or layer-3) VPN services can be directly mapped to
paths established in a specific network slice. In this case, traffic
that arrives on the Provider Edge (PE) router over external interface(s) can be
directly mapped to a specific network slice path. External interface(s) can be
further partitioned (e.g. using VLANs) to allow mapping one or more VLANs to specific
network slice paths.

Another option is steer specific destinations directly over specific
network slices. This allows traffic arriving on any external interface and targeted
to such destinations to be directly steered over the slice transport paths.

A third option that can also be used is to utilize a dataplane firewall filter
or classifier to enable matching of several fields in the incoming packets to
decide whether the packet is steered on a specific slice. This option
allows for applying a rich set of rule(s) to identify specific packets to be
mapped to a network slice. However, it requires dataplane network resources to be able
to perform the additional checks in hardware.

# Control Plane Extensions

Routing protocol(s) may need to be extended to carry additional per slice link
state. For example, {{!RFC5305}}, {{!RFC3630}}, and {{!RFC7752}} are ISIS, OSPF, and BGP
protocol extensions to exchange network link state information to allow
ingress TE routers and PCE(s) to do proper path placement in the network.  The
extensions required to support network slicing may be defined in other
document(s), and are outside the scope of this document.

The provisioning of the network slicing device Slice-PHD may need to be
automated.  Multiple options are possible to facilitate automation of provisioning
a network slice definition on device(s) that are capable of network slicing.

For example, a YANG data model for the network Slice-PHD may be
supported on network devices and controllers. A suitable transport (e.g.
NETCONF {{?RFC6241}}, RESTCONF {{?RFC8040}}, or gRPC) may be used to enable
configuration and retrieval of state information for network slicing on network
device(s). The network Slice-PHD YANG data model may be defined in a separate document,
and is outside the scope of this document.

# Applicability to Path Control Technologies

The network slicing approach(s) described in this document are agnostic to the
technology used to setup path(s) that carry networking slice traffic. Once
feasible path(s) within a network slice are selected, it is possible to use
RSVP-TE protocol {{!RFC3209}} to setup or signal the LSP(s) that would be used
to carry slice traffic.  Specific extension(s) to RSVP-TE protocol to enable
signaling of slice aware RSVP LSP(s) are outside the scope and will be tackled
in a separate document(s).

Alternatively, Segment Routing (SR) {{!RFC8402}} may be used and the feasible
path(s) can realized by steering over specific segment(s) or segment-list(s)
using an SR policy. Further detail(s) on how the approach(es) presented in this
document can be realized over an SR network will be tackled in a separate
document.

# IANA Considerations

This document has no IANA actions.

# Security Considerations

The main goal of network slicing is to allow for some level of isolation for
traffic from multiple different network slices that are utilizing a common
network infrastructure and to allow for different levels of services to be
provided for traffic traversing a single network slice resource(s).

A variety of techniques may be used to achieve this, but the end result will be
that some packets may be mapped to specific resource(s) and may receive
different (e.g., better) service treatment than others.  The mapping of network
traffic to a specific slice is indicated primarily by the SS, and hence an
adversary may be able to utilize resource(s) allocated to a specific network
slice by injecting packets carrying the same SS field in their packets.

Such theft-of-service may become a denial-of-service attack when the modified
or injected traffic depletes the resources available to forward legitmiate
traffic belonging to a specific network slice.

The defense against this type of theft and denial-of-service attacks consists
of the combination of traffic conditioning at network slicing domain boundaries
with security and integrity of the network infrastructure within a network
slicing domain.

# Acknowledgement

The authors would like to thank Krzysztof Szarkowicz, Swamy SRK, and Prabhu Raj
Villadathu Karunakaran for their review of this document, and for providing
valuable feedback on it.

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
