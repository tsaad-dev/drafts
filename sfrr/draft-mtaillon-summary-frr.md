---
title: RSVP-TE Summary Fast Reroute Extensions for LSP Tunnels
abbrev: RSVP-TE Summary FRR
docname: draft-mtaillon-mpls-summary-frr-rsvpte-05
date: 2017-3-07
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
    organization: Cisco Systems, Inc.
    email: tsaad@cisco.com
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
    organization: Juniper Networks
    email: mjork@juniper.net

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
mechanisms for the Point of Local Repair (PLR) to reroute traffic and
signaling of a protected RSVP-TE LSP onto the bypass tunnel in the
event of a TE link or node failure.  Such signaling procedures are
performed individually for each affected protected LSP.  This may
eventually lead to control plane scalability and latency issues under
limited (memory and CPU processing) resources after a failure that
affects a large number of protected LSPs traversing the same PLR and
Merge Point (MP) nodes.


For example, in a large RSVP-TE LSPs scale deployment, a single LSR
acting as a PLR node may host tens of thousands of protected RSVP-TE
LSPs egressing the same link, and also act as a MP node for similar
number of LSPs ingressing the same link.  In the event of the failure
of the link or neighbor node, the RSVP-TE control plane of the node
when acting as PLR becomes busy rerouting protected LSPs signaling
over the bypass tunnel(s) in one direction, and when acting as an MP
node becomes busy merging RSVP states from signaling received over
bypass tunnels for LSP(s) in the reverse direction. Subsequently, the
head-end LER(s) that are notified of the local repair at downstream
LSR will attempt to (re)converge affected RSVP- TE LSPs onto newly
computed paths - possibly traversing the same previously affected
LSR(s).  As a result, the RSVP-TE control plane at the PLR and MP
becomes overwhelmed by the amount of FRR RSVP-TE processing overhead
following the link or node failure, and the competing other control
plane protocol(s) (e.g. the IGP) that undergo their convergence at
the same time.

The extensions defined in this document enable a MP node to become aware
of the PLR node's bypass tunnel assignment group and allow FRR procedures between PLR node
and MP node to be signaled and processed on groups of LSPs.  Further,
the MESSAGE_ID for the rerouted PATH and RESV states are
exchanged a priori to the fault such that Summary Refresh
procedures defined in {{!RFC2961}} can continue to be used
to refresh the rerouted state(s) after FRR has occurred.

# Conventions Used in This Document

## Key Word Definitions

The key words "MUST", "MUST NOT", "REQUIRED", "SHALL", "SHALL NOT",
"SHOULD", "SHOULD NOT", "RECOMMENDED", "MAY", and "OPTIONAL" in this
document are to be interpreted as described in BCP 14, RFC 2119 {{RFC2119}}.

## Terminology

The reader is assumed to be familiar with the terminology in
{{!RFC3209}} and {{!RFC4090}}.

# Summary FRR Signaling Procedures

The RSVP ASSOCIATION object is defined in {{!RFC4872}} as a means to
associate LSPs with each other.  For example, in the context of
GMPLS-controlled LSP(s), the object is used to associate recovery
LSPs with the LSP they are protecting.  The Extended ASSOCIATION
object is introduced in {{!RFC6780}} to expand on the possible usage of
the ASSOCIATION object and generalize the definition of the
Association ID field.

This document proposes the use of the Extended ASSOCIATION object to
carry the Summary FRR information and associate the protected LSP(s)
with the bypass tunnel that protects them.  To this extent, a new
Association Type for the Extended ASSOCIATION object, and a new
Association ID are proposed in this draft to describe the Bypass
Summary FRR (B-SFRR) association.

The PLR creates and manages the Summary FRR LSP groups
(Bypass_Group_Identifiers) and shares them with the MP via signaling.
Protected LSPs sharing the same egress link and bypass assignment
are grouped together and are assigned the same group.  The MP
maintains the PLR group assignments learned via signaling, and
acknowledges the group assignments via signaling.  Once the PLR
receives the acknowledgment, FRR signaling can proceed as group
based.

The PLR node that supports Summary FRR procedures adds the Extended ASSOCIATION object
with Bypass Summary FRR Association Type -- referred to thereon in this document as 
B-SFRR Extended ASSOCIATION object-- in the RSVP Path message of the protected LSP
to inform the MP of the PLR's assigned bypass tunnel, Summary FRR 
Bypass_Group_Identifier, and the MESSAGE_ID object that the PLR will use to refresh
the protected LSP PATH state after FRR occurs.

The MP node that supports Summary FRR procedures adds the B-SFRR Extended ASSOCIATION object in a
RSVP Resv message of the protected LSP to acknowledge the PLR's bypass tunnel assignment,
and provide the MESSAGE_ID object that the MP node will use to refresh the protected LSP
RESV state after FRR occurs.

This document also defines a new RSVP FRR_ACTIVE SUMMARY_FRR_BYPASS
object that is sent within the RSVP Path message of a bypass LSP to
inform the MP node that one or more groups of protected LSPs that are
being protected by the bypass tunnel are being rerouted i.e. signaling
is rerouted over the bypass tunnel.

## Signaling Procedures Prior to Failure {#sig-prior-failure}

Before Summary FRR procedures can be used, a handshake MUST be
completed between the PLR and MP. This handshake is performed using B-SFRR
Extended ASSOCIATION object that is carried in both the RSVP Path and Resv messages
of the protected LSP.

### Extended ASSOCIATION Object {#ext-assoc-obj}

The B-SFRR Extended ASSOCIATION object is populated using the rules defined below 
to associate the Summary FRR enabled protected LSP with the bypass LSP that
is protecting it.

The Association Type, Association ID, and Association Source MUST be
set as defined in {{RFC4872}} for the ASSOCIATION Object. 
More specifically:

   Association Source:

      The Association Source is set to an address selected by the node
      that originates the association. For Bypass Summary FRR association
      it is set to an address of the PLR node.

   Association Type:

      The Association Type is set to indicate the Bypass Summary FRR
      association. A new Association Type is defined as follows:

      Value      Type
      -------    ------
      (TBD-1)    Bypass Summary FRR Association (B-SFRR)

   Extended Association ID:

      The Extended Association ID is populated by the node originating the
      association -- i.e. the PLR for the Bypass Summary FRR association.
      The rules to populate the Extended Association ID in this case is
      described below.


#### IPv4 Extended Association ID

The IPv4 Extended Association ID for Summary FRR bypass assignment has the following
format:

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
{: #fig_IPv4_Extended_Association_ID title="The IPv4 Extended Association ID field"}


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


#### IPv6 Extended Association ID


The IPv6 Extended Association ID field for the Summary FRR information has the following
format:


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
{: #fig_IPv6_Extended_Association_ID title="The IPv6 Extended Association ID field"}


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

The PLR assigns a bypass tunnel and Bypass_Group_Identifier for each
protected LSP.  The same Bypass_Group_Identifier is used for the set
of protected LSPs that share the same bypass tunnel and traverse the
same egress link and are not already rerouted.  The PLR also
generates a MESSAGE_ID object (flags SHOULD be clear, Epoch and
Message_Identifier MUST be set according to {{!RFC2961}}).

The PLR MUST generate a new Message_Identifier each time the
contents of the B-SFRR Extended ASSOCIATION object change;  for
example, when PLR node changes the bypass tunnel assignment.  

The PLR node notifies the MP node of the bypass tunnel assignment via adding a
B-SFRR Extended ASSOCIATION object in the RSVP Path message for the protected LSP
using procedures described in [ ](#post-failure).

The MP node acknowledges the PLR node assignment by signaling the B-SFRR Extended
Association object within the RSVP Resv message of the protected LSP.
With exception of the MESSAGE_ID objects, all
other fields of the received B-SFRR Extended ASSOCIATION object in the RSVP Path
message are copied into the B-SFRR Extended ASSOCIATION object to be added
in the Resv message. The MESSAGE_ID object is set according to {{!RFC2961}}
with the Flags being clear.  A new Message_Identifier MUST
be used to acknowledge an updated PLR assignment.

The PLR considers the protected LSP as Summary FRR capable only if
the B-SFRR Extended ASSOCIATION objects sent in the RSVP
Path message and the one received in the RSVP Resv message
(with exception of the MESSAGE_ID) match. If it does not
match, or if B-SFRR Extended Association object is absent in a subsequent
refresh, the PLR node MUST consider the protected LSP as not Summary FRR
capable.

### PLR Summary FRR Signaling Procedure 

The B-SFRR Extended ASSOCIATION object is added by each PLR in the RSVP Path message of the
protected LSP to record the bypass tunnel assignment. This object
is updated every time the PLR updates the bypass tunnel assignment
(which triggers an RSVP Path change message).

Upon receiving an RSVP Resv message with B-SFRR Extended ASSOCIATION object, the PLR node
checks if the expected subobjects in the B-SFRR Extended ASSOCIATION ID are
present. If present, the PLR determines if the MP has acknowledged
the current PLR assignment.

To be a valid acknowledgement, the received
B-SFRR Extended ASSOCIATION object contents within the RSVP Resv message of
the protected LSP MUST match the latest B-SFRR Extended ASSOCIATION object
contents that the PLR node had sent within the RSVP Path message 
(with exception of the MESSAGE_ID).

Note, when forwarding an RSVP Resv message upstream, the PLR node SHOULD remove
any/all B-SFRR Extended ASSOCIATION objects whose Association Source
matches the PLR node address.

### MP Summary FRR Signaling Procedure

Upon receiving an RSVP Path message with an B-SFRR Extended ASSOCIATION object,
the MP node processes all (there may be multiple PLRs for a single MP)
B-SFRR Extended ASSOCIATION objects that have
the MP node address as Bypass Destination address in the Association ID.

The MP node first ensures the existence of the bypass tunnel and that the
Bypass_Group_Identifier is not already FRR active.  That is, an LSP
cannot join a group that is already FRR rerouted.

The MP node builds a mirrored Summary FRR Group database per PLR, which is
determined using the Bypass_Source_Address field.  The MESSAGE_ID is
extracted and recorded for the protected LSP PATH state.
The MP node signals a B-SFRR Extended Association object within the RSVP Resv message of the protected LSP.
With exception of the MESSAGE_ID objects, all
other fields of the received B-SFRR Extended ASSOCIATION object in the RSVP Path
message are copied into the B-SFRR Extended ASSOCIATION object to be added
in the Resv message. The MESSAGE_ID object is set according to {{!RFC2961}}
with the Flags being clear.

Note, an MP may receive more than one RSVP Path message with the
B-SFRR Extended ASSOCIATION object from different upstream PLR node(s).
In this case, the MP node is expected to save all the received 
MESSAGE_IDs from the different upstream PLR node(s). After a failure, the MP node determines
and activates the associated Summary Refresh ID to use once it
receives and processes the RSVP Path message with FRR_ACTIVE SUMMARY_FRR_BYPASS 
object over the bypass LSP from the PLR.

When forwarding an RSVP Path message downstream, the MP SHOULD remove
any/all B-SFRR Extended ASSOCIATION object(s) whose Association ID contains
Bypass_Destination_Address matching the MP node address.

## Signaling Procedures Post Failure {#post-failure}

Upon detection of the fault (egress link or node failure) the PLR
first performs the object modification procedures described by
Section 6.4.3 of {{RFC4090}} for all affected protected LSPs. For
Summary FRR LSPs assigned to the same bypass tunnel a common RSVP_HOP
and SENDER_TEMPLATE MUST be used. 

The PLR MUST signal non-Summary FRR enabled LSPs over the bypass tunnel
before signaling the Summary FRR enabled LSPs.  This is needed to allow for
the case when the PLR node has recently changed a bypass assignment and
the MP has not processed the change yet. 

A new object FRR_ACTIVE SUMMARY_FRR_BYPASS is defined in [ ](#sfrr-bypass-active)
and sent within the RSVP Path message of the bypass LSP to reroute RSVP state of
Summary FRR enabled LSPs.

### SUMMARY_FRR_BYPASS Object {#sfrr-bypass-active}

The SUMMARY_FRR_BYPASS Object with Type FRR_ACTIVE is carried in the Path message of a bypass
LSP. This object is added by the PLR node to indicate
to the MP node (bypass tunnel destination) that one
or more groups of protected LSPs that are being protected by the
specified bypass tunnel are being rerouted over the bypass tunnel.

The FRR_ACTIVE SUMMARY_FRR_BYPASS object is assigned the C-Type (TBD-3).
The FRR_ACTIVE SUMMARY_FRR_BYPASS object has the below format.

   SUMMARY_FRR_BYPASS Class-Num = (TBD-2) (of the form 11bbbbbb)
   Class-Name = SUMMARY_FRR_BYPASS Class, FRR_ACTIVE C-Type = (TBD-3)

~~~~~
    0                   1                   2                   3
    0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1
   +-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
   |            Length             | Class-N(TBD-2)| C-Type (TBD-3)|
   +-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
   |            Reserved           |       Num-BGIDs               |
   +-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
   |                       Bypass_Group_Identifier                 |
   +-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
   |                               :                               |
   //                              :                              //
   |                               :                               |
   +-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
   |                       Bypass_Group_Identifier                 |
   +-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
   |                           RSVP_HOP_Object                     |
   +-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
   |                           TIME_VALUES                         |
   +-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
~~~~~
{: #fig_SUMMARY_FRR_BYPASS_OBJ title="Summary FRR Bypass Object"}

   Reserved: 16 bits

       Reserved for future use.

   Num-BGIDs: 16 bits

       Number of Bypass_Group_Identifier fields.

   Bypass_Group_Identifier: 32 bits

       The Bypass_Group_Identifier that is previously advertised by the
       PLR using the Extended Association object.  One or
       more Bypass_Group_Identifiers may be included.

   RSVP_HOP_Object: Class 3, as defined by [RFC2205]

       Replacement RSVP HOP object to be applied to all LSPs associated
       with each of the following Bypass_Group_Identifiers. This corresponds
       to C-Type = 1 for IPv4 RSVP HOP, or C-Type = 2 for IPv6 RSVP HOP
       depending on the IP address family carried within the object.

   TIME_VALUES object: Class 5, as defined by [RFC2205]

       Replacement TIME_VALUES object to be applied to all LSPs associated
       with each of the following Bypass_Group_Identifiers after receiving
       the FRR_ACTIVE SUMMARY_FRR_BYPASS object.

### PLR Summary FRR Signaling Procedure {#plr-sfrr}

   After a failure event, when using the Summary FRR path signaling procedures,
   an individual RSVP Path message for each Summary FRR LSP is not signaled.
   Instead, to reroute Summary FRR LSPs via the bypass tunnel, the PLR adds the
   FRR_ACTIVE SUMMARY_FRR_BYPASS object in the RSVP Path message of the
   RSVP session of the bypass tunnel.  
 
   The RSVP_HOP_Object field of the FRR_ACTIVE SUMMARY_FRR_BYPASS object is
   set to the common RSVP_HOP that was used by the PLR in [ ](#post-failure)
   of this document.

   The previously received MESSAGE_ID from the MP is activated. As a result,
   the MP may refresh the protected rerouted RESV state using
   Summary Refresh procedures.

   For each affected Summary FRR group, its Bypass_Group_Identifier is added to
   the FRR_ACTIVE SUMMARY_FRR_BYPASS object.

### MP Summary FRR Signaling Procedure

   Upon receiving an RSVP Path message with a FRR_ACTIVE SUMMARY_FRR_BYPASS
   object, the MP performs normal merge point processing for each protected LSP
   associated with each Bypass_Group_Identifier, as if it received
   individual RSVP Path messages for the LSP.

   For each Summary FRR LSP being merged, the MP first modifies the Path
   state as follows:

1. The RSVP_HOP object is copied from the FRR_ACTIVE SUMMARY_FRR_BYPASS RSVP_HOP_Object field.

2. The TIME_VALUES object is copied from the FRR_ACTIVE SUMMARY_FRR_BYPASS TIMES_VALUE field.
   The TIME_VALUES object contains the refresh time of the PLR to generate refreshes
   and that would have exchanged in a Path message sent to the MP after the failure
   when no SFRR procedures are in effect.

3. The SENDER_TEMPLATE object SrcAddress field is copied from the bypass tunnel SENDER_TEMPLATE
object. For the case where PLR is also the head-end, and SENDER_TEMPLATE SrcAddress of the 
protected LSP and bypass tunnel are the same, the MP MUST use the modified HOP
Address field instead.

4. The ERO object is modified as per Section 6.4.4. of {{RFC4090}}.
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

The new FRR_ACTIVE SUMMARY_FRR_BYPASS object is to be defined with a
class number in the form 11bbbbbb, which ensures compatibility with
non-supporting nodes. Per {{!RFC2205}}, the nodes not supporting this
extension will ignore the object but forward it, unexamined and
unmodified, in all messages.

# Security Considerations

This document updates an existing RSVP object, and introduces a new RSVP object.
Thus, in the event of the interception of a signaling message, a slightly more 
information could be deduced about the state of the network than was previously
the case. Existing mechanisms for maintaining the integrity and authenticity of
RSVP protocol messages {{!RFC2747}} can be applied.

# IANA Considerations

   IANA maintains the "Generalized Multi-Protocol Label Switching
   (GMPLS) Signaling Parameters" registry (see
   <http://www.iana.org/assignments/gmpls-sig-parameters>).  The
   "Association Type" subregistry is included in this registry.

   This registry has been updated by new Association Type for
   Extended ASSOCIATION Object defined in this document
   as follows:

        Value    Name                                          Reference
        -----    ----                                          ---------
        TBD-1    Bypass Summary FRR Association (B-SFRR)       Section 2.1.1

   IANA also maintains and assigns the values for the RSVP-TE protocol parameters
   "Resource Reservation Protocol (RSVP) Parameters" (see
   http://www.iana.org/assignments/rsvp-parameters).

   From this registry, a new RSVP Class (TBD-2) and of the form 11bbbbbb and a
   new C-Type (TBD-3) are requested for the new FRR_ACTIVE SUMMARY_FRR_BYPASS object
   defined in this document.

   Class-Number = (TBD-2), Class-Name = SUMMARY_FRR_BYPASS

   C-Type = (TBD-3) Name = FRR_ACTIVE

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
