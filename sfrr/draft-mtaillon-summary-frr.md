---
title: RSVP-TE Summary Fast Reroute Extensions for LSP Tunnels
abbrev: RSVP-TE Summary FRR
docname: draft-ietf-mpls-summary-frr-rsvpte-04
category: std
ipr: trust200902
workgroup: MPLS Working Group
keyword: Internet-Draft

stand_alone: yes
pi: [toc, sortrefs, symrefs]

author:
 -
    ins: M. Taillon
    name: Mike Taillon
    organization: Cisco Systems, Inc.
    email: mtaillon@cisco.com
 -
    ins: T. Saad
    name: Tarek Saad
    role: editor
    organization: Juniper Networks
    email: tsaad@juniper.net
 -
    ins: R. Gandhi
    name: Rakesh Gandhi
    organization: Cisco Systems, Inc.
    email: rgandhi@cisco.com

 -
    ins: A. Deshmukh
    name: Abhishek Deshmukh
    organization: Juniper Networks
    email: adeshmukh@juniper.net

 -
    ins: M. Jork
    name: Markus Jork
    organization: 128 Technology
    email: mjork@128technology.com

 -
    ins: V. P. Beeram
    name: Vishnu Pavan Beeram
    organization: Juniper Networks
    email: vbeeram@juniper.net

normative:
  RFC2119:

informative:

--- abstract

This document defines Resource Reservation Protocol (RSVP) Traffic-
Engineering (TE) signaling extensions that reduce the amount of RSVP
signaling required for Fast Reroute (FRR) procedures and subsequently
improve the scalability of the RSVP-TE signaling when undergoing FRR
convergence after a link or node failure.  Such extensions allow the
RSVP message exchange between the Point of Local Repair (PLR) and the
Merge Point (MP) to be independent of the number of protected Label
Switched Paths (LSPs) traversing between them when facility bypass
FRR protection is used.  The signaling extensions are fully backwards
compatible with nodes that do not support them.

--- middle

# Introduction

The Fast Reroute (FRR) procedures defined in {{!RFC4090}} describe the
mechanisms for the Point of Local Repair (PLR) to reroute traffic and signaling
of a protected RSVP-TE LSP onto the bypass tunnel in the event of a TE link or
node failure. Such signaling procedures are performed individually for each
affected protected LSP.  This may eventually lead to control plane scalability
and latency issues on the PLR and/or the MP due to limited memory and CPU
processing resources. This condition is exacerbated when the failure affects
large number of protected LSPs that traverse the same PLR and Merge Point (MP)
nodes.


For example, in a large scale RSVP-TE LSPs deployment, a single LSR acting as a
PLR node may host tens of thousands of protected RSVP-TE LSPs egressing the
same link, and also act as a MP node for similar number of LSPs ingressing the
same link.  In the event of the failure of the link or neighbor node, the
RSVP-TE control plane of the node when acting as PLR becomes busy rerouting
protected LSPs signaling over the bypass tunnel(s) in one direction, and when
acting as an MP node becomes busy merging RSVP states from signaling received
over bypass tunnels for LSP(s) in the reverse direction. Subsequently, the
head-end LER(s) that are notified of the local repair at downstream LSR will
attempt to (re)converge affected RSVP- TE LSPs onto newly computed paths -
possibly traversing the same previously affected LSR(s).  As a result, the
RSVP-TE control plane at the PLR and MP becomes overwhelmed by the amount of
FRR RSVP-TE processing overhead following the link or node failure, and the
competing other control plane protocol(s) (e.g. the IGP) that undergo their
convergence at the same time.

The extensions defined in this document enable a MP node to become aware of the
PLR node's bypass tunnel assignment group and allow FRR procedures between PLR
node and MP node to be signaled and processed on groups of LSPs.

As defined in [RFC2961], Summary Refresh procedures use MESSAGE_ID to refresh
the RSVP Path and Resv states to help with the scale.  The MESSAGE_ID
information for the rerouted PATH and RESV states are exchanged between PLR and
MP nodes between PLR and MP nodes a priori to the fault such that Summary
Refresh procedures defined in {{!RFC2961}} can continue to be used to refresh
the rerouted state(s) after FRR has occurred.

# Conventions Used in This Document

## Terminology

The key words "MUST", "MUST NOT", "REQUIRED", "SHALL", "SHALL NOT",
"SHOULD", "SHOULD NOT", "RECOMMENDED", "MAY", and "OPTIONAL" in this
document are to be interpreted as described in BCP 14, RFC 2119 {{RFC2119}}.

## Acronyms and Abbreviations

The reader is assumed to be familiar with terms and abbreviations used in
{{!RFC3209}} and {{!RFC4090}}.

The following abbreviations are also used in this document:

> LSR: Label Switching Router

> LER: Label Edge Router

> MPLS: Multiprotocol Label Switching

> LSP: Label Switched Path

> MP: Merge Point node as defined in {{!RFC4090}}

> PLR: Point of Local Repair node as defined in {{!RFC4090}}

> FRR: Fast Reroute as defined in {{!RFC4090}}

> B-SFRR-Ready: Bypass Summary FRR Ready Extended ASSOCIATION object. Added
by the PLR for each LSP protected by the bypass tunnel.

> B-SFRR-Active: Bypass Summary FRR Active Extended ASSOCIATION object.
Used to notify the MP node of one ore more groups of protected LSP(s)
that are being protected by the specified bypass tunnel are being rerouted.

# Extensions for Summary FRR Signaling

The RSVP ASSOCIATION object is defined in {{!RFC4872}} as a means to associate
LSPs with each other.  For example, in the context of GMPLS-controlled LSP(s),
the object is used to associate recovery LSPs with the LSP they are protecting.
The Extended ASSOCIATION object is introduced in {{!RFC6780}} to expand on the
possible usage of the ASSOCIATION object and generalize the definition of the
Extended Association ID field.

This document proposes the use of the Extended ASSOCIATION object to carry the
Summary FRR information and associate the protected LSP(s) with the bypass
tunnel that protects them. Two new Association Types for the Extended
ASSOCIATION object, and new Extended Association IDs are proposed in this draft
to describe the Bypass Summary FRR Ready (B-SFRR-Ready) and the Bypass Summary
FRR Active (B-SFRR-Active) associations.

The PLR creates and manages the Summary FRR LSP groups
(Bypass_Group_Identifiers) and shares them with the MP via signaling.
Protected LSPs sharing the same egress link and bypass assignment are grouped
together and are assigned the same group.  The MP maintains the PLR group
assignments learned via signaling, and acknowledges the group assignments via
signaling.  Once the PLR receives the acknowledgment, FRR signaling can proceed
as group based.

The PLR node that supports Summary FRR procedures adds the Extended ASSOCIATION
object with Type B-SFRR-Ready and respective Extended Association ID in the
RSVP Path message of the protected LSP to inform the MP of the PLR's assigned
bypass tunnel, Summary FRR Bypass_Group_Identifier, and the MESSAGE_ID that the
PLR will use to refresh the protected LSP PATH state after FRR occurs.

The MP node that supports Summary FRR procedures adds the B-SFRR-Ready Extended
ASSOCIATION object and respective Extended Association ID in the RSVP Resv
message of the protected LSP to acknowledge the PLR's bypass tunnel assignment,
and provide the MESSAGE_ID object that the MP node will use to refresh the
protected LSP RESV state after FRR occurs.

This document also defines a new Association Type for the Extended ASSOCIATION
object and new Extended Association ID to describe the B-SFRR-Active
association.  The B-SFRR-Active Extended ASSOCIATION object and Extended
Association ID are sent by PLR after activating FRR procedures on the PLR. The
B-SFRR-Active Extended ASSOCIATION object and Extended Association ID are sent
within the RSVP Path message of the bypass LSP to inform the MP node that one
or more groups of protected LSPs protected by the bypass tunnel are now being
rerouted over the bypass tunnel.

## B-SFRR-Ready Extended ASSOCIATION Object {#ext-assoc-obj}

The Extended ASSOCIATION object is populated using the rules defined below to
associate a protected LSP with the bypass LSP that is protecting it when
Summary FRR procedures are enabled.

The Association Type, Association ID, and Association Source MUST be set as
defined in {{RFC4872}} for the ASSOCIATION Object.  More specifically:

   Association Source:

      The Association Source is set to an address of the PLR node.

   Association Type:

      A new Association Type is defined for B-SFRR-Ready as follows:

      Value      Type
      -------    ------
      (TBD-1)    Bypass Summary FRR Ready Association (B-SFRR-Ready)

   Extended ASSOCIATION ID for B-SFRR-Ready:

      The B-SFRR-Ready Extended ASSOCIATION ID is
      populated by the PLR for the Bypass Summary FRR Ready association.
      The rules to populate the Extended ASSOCIATION ID in this case are
      described below.

### IPv4 B-SFRR-Ready IPv4 Extended ASSOCIATION ID

The IPv4 Extended ASSOCIATION ID for the B-SFRR-Ready association type has the
following format:

~~~~~
     0                   1                   2                   3
     0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1
    +-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
    |         Bypass_Tunnel_ID      |           Reserved            |
    +-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
    |                Bypass_Source_IPv4_Address                     |
    +-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
    |                Bypass_Destination_IPv4_Address                |
    +-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
    |                Bypass_Group_Identifier                        |
    +-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
    |                MESSAGE_ID                                     |
    +-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
~~~~~
{: #fig_IPv4_Extended_Association_ID title="The IPv4 Extended ASSOCIATION ID for B-SFRR-Ready"}


      Bypass_Tunnel_ID: 16 bits

            The bypass tunnel identifier.

      Reserved: 16 bits

            Reserved for future use.

      Bypass_Source_IPv4_Address: 32 bits

            The bypass tunnel source IPV4 address.

      Bypass_Destination_IPv4_Address: 32 bits

            The bypass tunnel destination IPV4 address.

      Bypass_Group_Identifier: 32 bits

            The bypass tunnel group identifier.

      MESSAGE_ID

            A MESSAGE_ID object as defined by [RFC2961].


### IPv6 B-SFRR-Ready IPv6 Extended ASSOCIATION ID

The IPv6 Extended ASSOCIATION ID field for the B-SFRR-Ready association type
has the following format:

~~~~~
     0                   1                   2                   3
     0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1
    +-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
    |         Bypass_Tunnel_ID      |           Reserved            |
    +-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
    |                                                               |
    +                                                               +
    |                                                               |
    +                Bypass_Source_IPv6_Address                     +
    |                                                               |
    +                                                               +
    |                                                               |
    +-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
    |                                                               |
    +                                                               +
    |                                                               |
    +                Bypass_Destination_IPv6_Address                +
    |                                                               |
    +                                                               +
    |                                                               |
    +-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
    |                Bypass_Group_Identifier                        |
    +-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
    |                MESSAGE_ID                                     |
    +-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
~~~~~
{: #fig_IPv6_Extended_Association_ID title="The IPv6 Extended ASSOCIATION ID for B-SFRR-Ready"}


      Bypass_Tunnel_ID: 16 bits

            The bypass tunnel identifier.

      Reserved: 16 bits

            Reserved for future use.

      Bypass_Source_IPv6_Address: 128 bits

            The bypass tunnel source IPV6 address.

      Bypass_Destination_IPv6_Address: 128 bits

            The bypass tunnel destination IPV6 address.

      Bypass_Group_Identifier: 32 bits

            The bypass tunnel group identifier.

      MESSAGE_ID

            A MESSAGE_ID object as defined by [RFC2961].

The PLR assigns a bypass tunnel and Bypass_Group_Identifier for each protected
LSP. The same Bypass_Group_Identifier is used for the set of protected LSPs
that share the same bypass tunnel and traverse the same egress link and are not
already rerouted.  The PLR also generates a MESSAGE_ID object (flags SHOULD be
clear, Epoch and Message_Identifier MUST be set according to {{!RFC2961}}).

The PLR MUST generate a new Message_Identifier each time the contents of the
B-SFRR-Ready Extended ASSOCIATION ID changes;  for example, when PLR node
changes the bypass tunnel assignment.  

The PLR node notifies the MP node of the bypass tunnel assignment via adding a
B-SFRR-Ready Extended ASSOCIATION object and Association ID in the RSVP Path
message for the protected LSP using procedures described in [ ](#post-failure).

The MP node acknowledges the PLR node assignment by signaling the B-SFRR-Ready
Extended ASSOCIATION object and Association ID within the RSVP Resv message of
the protected LSP.  With exception of the MESSAGE_ID objects, all other fields
of the received in the B-SFRR-Ready Extended ASSOCIATION ID in the RSVP Path
message are copied into the B-SFRR-Ready Extended ASSOCIATION ID to be added in
the Resv message. The MESSAGE_ID object is set according to {{!RFC2961}} with
the Flags being clear.  A new Message_Identifier MUST be used to acknowledge an
updated PLR assignment.

The PLR considers the protected LSP as Summary FRR capable only if all the
fields in the B-SFRR-Ready Extended ASSOCIATION ID that are sent in the RSVP
Path message and the ones received in the RSVP Resv message (with exception of
the MESSAGE_ID) match. If it does not match, or if B-SFRR-Ready Extended
ASSOCIATION object is absent in a subsequent refresh, the PLR node MUST
consider the protected LSP as not Summary FRR capable.

## B-SFRR-Active Extended ASSOCIATION Object {#sfrr-bypass-active}

The Extended ASSOCIATION object for B-SFRR-Active association type is populated
by a PLR node to indicate to the MP node (bypass tunnel destination) that one
or more groups of protected LSPs that are being protected by the specified
bypass tunnel are being rerouted over the bypass tunnel.

The B-SFRR-Active Extended ASSOCIATION object is carried in the RSVP Path
message of a bypass LSP and signaled downstream towards the MP (bypass LSP
destination). 

The Association Type, Association ID, and Association Source MUST be set as
defined in {{RFC4872}} for the ASSOCIATION Object.  More specifically:

   Association Source:

      The Association Source is set to an address of the PLR node.

   Association Type:

      A new Association Type is defined for B-SFRR-Active as follows:

      Value      Type
      -------    ------
      (TBD-2)    Bypass Summary FRR Active Association (B-SFRR-Active)

   Extended ASSOCIATION ID for B-SFRR-Active:

      The B-SFRR-Active Extended ASSOCIATION ID is
      populated by the PLR for the Bypass Summary FRR Active association.
      The rules to populate the Extended ASSOCIATION ID in this case are
      described below.

### IPv4 B-SFRR-Active Extended ASSOCIATION ID {#V4_SFRR_ACTIVE}

The IPv4 Extended ASSOCIATION ID for the B-SFRR-Active association type is
carried inside the IPv4 Extended ASSOCIATION object and has the following
format:

~~~~~
    0                   1                   2                   3
    0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1
   +-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
   |            Num-BGIDs          |          Reserved             |
   +-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
   |                       Bypass_Group_Identifier                 |
   +-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
   |                               :                               |
   //                              :                              //
   |                               :                               |
   +-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
   |                       Bypass_Group_Identifier                 |
   +-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
   //                      RSVP_HOP_Object                        //
   +-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
   //                      TIME_VALUES                            //
   +-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
   |                       IPv4 tunnel sender address              |
   +-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+

~~~~~
{: #fig_IPV4_SFRR_ACTIVE title="The IPv4 Extended ASSOCIATION ID for B-SFRR-Active"}

Num-BGIDs: 16 bits

> Number of Bypass_Group_Identifier fields.

Reserved: 16 bits

> Reserved for future use.

Bypass_Group_Identifier: 32 bits

> The Bypass_Group_Identifier that is previously signaled by the
PLR using the Extended Association object.  One or
more Bypass_Group_Identifiers may be included.

RSVP_HOP_Object: Class 3, as defined by {{!RFC2205}}

> Replacement RSVP HOP object to be applied to all LSPs associated
with each of the following Bypass_Group_Identifiers. This corresponds
to C-Type = 1 for IPv4 RSVP HOP.

TIME_VALUES object: Class 5, as defined by {{RFC2205}}

> Replacement TIME_VALUES object to be applied to all LSPs associated
with each of the following Bypass_Group_Identifiers after receiving
the B-SFRR-Active Extended ASSOCIATION Object.

IPv4 tunnel sender address:

> The IPv4 address that the PLR sets to identify backup path(s) as
described in Section 6.1.1 of {{RFC4090}}.


### IPv6 B-SFRR-Active Extended ASSOCIATION ID {#V6_SFRR_ACTIVE}

The IPv6 Extended ASSOCIATION ID for the B-SFRR-Active association type is
carried inside the IPv6 Extended ASSOCIATION object and has the following
format:

~~~~~
    0                   1                   2                   3
    0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1
   +-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
   |            Num-BGIDs          |          Reserved             |
   +-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
   |                       Bypass_Group_Identifier                 |
   +-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
   |                               :                               |
   //                              :                              //
   |                               :                               |
   +-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
   |                       Bypass_Group_Identifier                 |
   +-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
   //                      RSVP_HOP_Object                        //
   +-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
   //                      TIME_VALUES                            //
   +-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
   |                                                               |
   +                                                               +
   |                                                               |
   +                       IPv6 tunnel sender address              +
   |                                                               |
   +                                                               +
   |                                                               |
   +-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+

~~~~~
{: #fig_IPV6_SFRR_ACTIVE title="The IPv6 Extended ASSOCIATION ID for B-SFRR-Active"}

Num-BGIDs: 16 bits

> Number of Bypass_Group_Identifier fields.

Reserved: 16 bits

> Reserved for future use.

Bypass_Group_Identifier: 32 bits

> The Bypass_Group_Identifier that is previously signaled by the
PLR using the Extended Association object.  One or
more Bypass_Group_Identifiers may be included.

RSVP_HOP_Object: Class 3, as defined by {{RFC2205}}

> Replacement RSVP HOP object to be applied to all LSPs associated
with each of the following Bypass_Group_Identifiers. This corresponds
to C-Type = 2 for IPv6 RSVP HOP.

TIME_VALUES object: Class 5, as defined by {{RFC2205}}

> Replacement TIME_VALUES object to be applied to all LSPs associated
with each of the following Bypass_Group_Identifiers after receiving
the B-SFRR-Active Extended ASSOCIATION Object.

IPv6 tunnel sender address:

> The IPv6 address that the PLR sets to identify backup path(s) as
described in Section 6.1.1 of {{RFC4090}}.

## Signaling Procedures Prior to Failure {#sig-prior-failure}

Before Summary FRR procedures can be used, a handshake MUST be completed
between the PLR and MP. This handshake is performed using Extended ASSOCIATION
object that carries the B-SFRR-Ready Extended Association ID in both the RSVP
Path and Resv messages of the protected LSP.

When using procedures defined in this document, the PLR MUST ensure bypass
tunnel assignment can satisfy the protected LSP MTU requirements post FRR. This
avoids any packets from being dropped due to exceeding the MTU size of
the bypass tunnel after traffic is  rerouted on the bypass tunnel post
failure.

### PLR Signaling Procedure 

The B-SFRR-Ready Extended ASSOCIATION object is added by each PLR in the RSVP
Path message of the protected LSP to record the bypass tunnel assignment. This
object is updated every time the PLR updates the bypass tunnel assignment and
that triggers an RSVP Path change message.

Upon receiving an RSVP Resv message with B-SFRR-Ready Extended ASSOCIATION
object, the PLR node checks if the expected subobjects from the B-SFRR-Ready
ASSOCIATION ID are present. If present, the PLR determines if the MP has
acknowledged the current PLR assignment.

To be a valid acknowledgement, the received B-SFRR-Ready ASSOCIATION ID
contents within the RSVP Resv message of the protected LSP MUST match the
latest B-SFRR-Ready Extended ASSOCIATION object and Association ID contents
that the PLR node had sent within the RSVP Path message (with exception of the
MESSAGE_ID).

Note, when forwarding an RSVP Resv message upstream, the PLR node SHOULD remove
any/all B-SFRR-Ready Extended ASSOCIATION objects whose Association Source
matches the PLR node address.

### MP Signaling Procedure

Upon receiving an RSVP Path message with a B-SFRR-Ready Extended ASSOCIATION
object, the MP node processes all (there may be multiple PLRs for a single MP)
B-SFRR-Ready Extended ASSOCIATION objects that have the MP node address as
Bypass Destination address in the Association ID.

The MP node first ensures the existence of the bypass tunnel and that the
Bypass_Group_Identifier is not already FRR active.  That is, an LSP cannot join
a group that is already FRR rerouted.

The MP node builds a mirrored Summary FRR Group database per PLR, which is
determined using the Bypass_Source_Address field.  The MESSAGE_ID is extracted
and recorded for the protected LSP PATH state.  The MP node signals a
B-SFRR-Ready Extended Association object and Association ID in the RSVP Resv
message of the protected LSP.  With exception of the MESSAGE_ID objects, all
other fields of the received B-SFRR-Ready Extended ASSOCIATION object in the
RSVP Path message are copied into the B-SFRR-Ready Extended ASSOCIATION object
to be added in the Resv message. The MESSAGE_ID object is set according to
{{!RFC2961}} with the Flags being clear.

Note, an MP may receive more than one RSVP Path message with the B-SFRR-Ready
Extended ASSOCIATION object from different upstream PLR node(s).  In this case,
the MP node is expected to save all the received MESSAGE_IDs from the different
upstream PLR node(s). After a failure, the MP node determines and activates the
associated Summary Refresh ID to use once it receives and processes the RSVP
Path message containing B-SFRR-Active Extended ASSOCIATION object that is
signaled over the bypass LSP from the PLR, as described [ ](#post-failure) 

When forwarding an RSVP Path message downstream, the MP SHOULD remove any/all
B-SFRR-Ready Extended ASSOCIATION object(s) whose Association ID contains
Bypass_Destination_Address matching the MP node address.

## Signaling Procedures Post Failure {#post-failure}

Upon detection of the fault (egress link or node failure) the PLR first
performs the object modification procedures described by Section 6.4.3 of
{{RFC4090}} for all affected protected LSPs. For Summary FRR LSPs assigned to
the same bypass tunnel a common RSVP_HOP and SENDER_TEMPLATE MUST be used. 

The PLR MUST signal non-Summary FRR enabled LSPs over the bypass tunnel before
signaling the Summary FRR enabled LSPs.  This is needed to allow for the case
when the PLR node has recently changed a bypass assignment and the MP has not
processed the change yet. 

The B-SFRR-Active Extended ASSOCIATION object is sent within the RSVP Path
message of the bypass LSP to reroute RSVP state of Summary FRR enabled LSPs.

### PLR Signaling Procedure {#plr-sfrr}

After a failure event, when using the Summary FRR path signaling procedures,
an individual RSVP Path message for each Summary FRR LSP is not signaled.
Instead, to reroute Summary FRR LSPs via the bypass tunnel, the PLR adds the
B-SFRR-Active Extended Association object in the RSVP Path message of the
RSVP session of the bypass tunnel.  

The RSVP_HOP_Object field in the B-SFRR-Active Extended ASSOCIATION ID is
set to the common RSVP_HOP that was used by the PLR in [ ](#post-failure)
of this document.

The previously received MESSAGE_ID from the MP is activated. As a result,
the MP may refresh the protected rerouted RESV state using
Summary Refresh procedures.

For each affected Summary FRR group, its Bypass_Group_Identifier is added to
B-SFRR-Active Extended ASSOCIATION ID.

### MP Signaling Procedure

Upon receiving an RSVP Path message with a B-SFRR-Active Extended Association
object, the MP performs normal merge point processing for each protected LSP
associated with each Bypass_Group_Identifier, as if it received
individual RSVP Path messages for the LSP.

For each Summary FRR LSP being merged, the MP first modifies the Path
state as follows:

1. The RSVP_HOP object is copied from the B-SFRR-Active Extended ASSOCIATION ID.

2. The TIME_VALUES object is copied from the TIMES_VALUE field in the B-SFRR-Active Extended ASSOCIATION ID.
   The TIME_VALUES object contains the refresh time of the PLR to generate refreshes
   and that would have exchanged in a Path message sent to the MP after the failure
   when no SFRR procedures are in effect.

3. The tunnel sender address field in the SENDER_TEMPLATE object is copied from the tunnel sender address of
   the B-SFRR-Active Extended ASSOCIATION ID.

4. The ERO object is modified as per Section 6.4.4 of {{RFC4090}}.
   Once the above modifications are completed, the MP then performs the
   merge processing as per {{RFC4090}}. 

5. The previously received MESSAGE_ID from the PLR is activated, meaning
   that the PLR may now refresh the protected rerouted PATH state using
   Summary Refresh procedures.

A failure during merge processing of any individual rerouted LSP MUST
result in an RSVP Path Error message.

An individual RSVP Resv message for each successfully merged Summary
FRR LSP is not signaled. The MP node SHOULD immediately use Summary
Refresh procedures to refresh the protected LSP RESV state.

## Refreshing Summary FRR Active LSPs

Refreshing of Summary FRR active LSPs is performed using Summary
Refresh as defined by {{RFC2961}}.

# Compatibility

The (Extended) ASSOCIATION object is defined in {{RFC4872}} with a class number
in the form 11bbbbbb, which ensures compatibility with non-supporting node(s).
Such nodes will ignore the object and forward it without modification.

# Security Considerations

This document updates an existing RSVP object.
Thus, in the event of the interception of a signaling message, a slightly more 
information could be deduced about the state of the network than was previously
the case. Existing mechanisms for maintaining the integrity and authenticity of
RSVP protocol messages {{!RFC2747}} can be applied. Other considerations mentioned
in {{!RFC4090}} and {{?RFC5920}} also apply.

# IANA Considerations

IANA maintains the "Generalized Multi-Protocol Label Switching
(GMPLS) Signaling Parameters" registry (see
<http://www.iana.org/assignments/gmpls-sig-parameters>).  The
"Association Type" subregistry is included in this registry.

This registry has been updated by new Association Type for
Extended ASSOCIATION Object defined in this document
as follows:

~~~
   Value  Name                         Reference
   -----  ----                         ---------
   TBD-1  B-SFRR-Ready Association     Section 3.1
   TBD-2  B-SFRR-Active Association    Section 3.2
~~~

IANA also maintains and assigns the values for the RSVP-TE protocol parameters
"Resource Reservation Protocol (RSVP) Parameters" (see
http://www.iana.org/assignments/rsvp-parameters).

# Acknowledgments

The authors would like to thank Loa Andersson, Lou Berger, Eric Osborne, 
Gregory Mirsky, and Mach Chen for reviewing and providing valuable comments
to this document.

# Contributors

~~~~
   Nicholas Tan
   Arista Networks

   Email: ntan@arista.com
~~~~
