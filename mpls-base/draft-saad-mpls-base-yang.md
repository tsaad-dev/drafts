---
title: A YANG Data Model for MPLS Base 
abbrev: MPLS Base YANG Data Model
docname: draft-ietf-mpls-base-yang-09
date: 2018-11-04
category: std
ipr: trust200902
workgroup: MPLS Working Group
keyword: Internet-Draft

stand_alone: yes
pi: [toc, sortrefs, symrefs]

normative:

informative:

author:

 -
    ins: T. Saad
    name: Tarek Saad
    organization: Cisco Systems Inc
    email: tsaad@cisco.com

 -
    ins: K. Raza
    name: Kamran Raza
    organization: Cisco Systems Inc
    email: skraza@cisco.com

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


normative:

informative:

--- abstract

This document contains a specification of the the MPLS base YANG model. The MPLS base YANG model serves as a base framework for configuring and managing an MPLS switching subsystem on an MPLS-enabled router.
It is expected that other MPLS YANG models (e.g. MPLS LSP Static, LDP or RSVP-TE YANG models) will augment the MPLS base YANG model.

--- middle

# Introduction

A core routing data model is defined in {{!RFC8349}}, and it provides a basis for the
development of data models for routing protocols.  The MPLS base model
augments core routing data model with additional data specific to MPLS technology as described in the MPLS architecture document {{!RFC3031}}. 

The MPLS base model serves as a basis for future development of MPLS data models covering
more-sophisticated MPLS feauture(s) and sub-system(s). The main purpose is to provide essential building blocks for the more-complicated data models involving different 
control-plane protocols, and advanced MPLS functions.

To this end, it is expected that the MPLS base data
model will be augmented by a number of other modules developed at IETF (e.g. by TEAS and MPLS working groups).

The YANG module in this document conforms to the Network Management Datastore Architecture (NMDA) {{!RFC8342}}.


## Terminology

The key words "MUST", "MUST NOT", "REQUIRED", "SHALL", "SHALL NOT",
"SHOULD", "SHOULD NOT", "RECOMMENDED", "NOT RECOMMENDED", "MAY", and
"OPTIONAL" in this document are to be interpreted as described in BCP 14 {{!RFC2119}} {{!RFC8174}} when, and only when, they appear in all capitals, as shown here.

The terminology for describing YANG data models is found in {{!RFC7950}}.

## Acronyms and Abbreviations

> MPLS: Multiprotocol Label Switching

> RIB: Routing Information Base

> LSP: Label Switched Path

> LSR: Label Switching Router

> LER: Label Edge Router

> FEC: Forwarding Equivalence Class

> NHLFE: Next Hop Label Forwarding Entry

> ILM: Incoming Label Map

# MPLS Base Model

This document describes the ietf-mpls YANG module that 
provides base components of the MPLS data model. It is expected that other MPLS 
YANG modules will augment the ietf-mpls base module for other MPLS extension to provision LSP(s) (e.g. MPLS Static, MPLS LDP or MPLS RSVP-TE LSP(s)).

## Model Overview

This document defines a mechanism to model MPLS labeled routes as an augmentation of the the routing RIB data model defined in {{!RFC8349}} for IP prefix routes that are MPLS labelled.

The other MPLS route(s) that are non-IP prefix routes are modelled by introducing a new "mpls" address-family RIB as per recommendation .

## Model Organization

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
                      o      o------+
                      |              \
                      v               v
              +-------------------+ +---------------------+
  MPLS Static | ietf-mpls-static@ | | ietf-mpls-ldp.yang@ | . .
  LSP module  +-------------------+ +---------------------+

        @: not in this document, shown for illustration only
~~~~~~~~~~~
{: #fig-mpls-relation title="Relationship between MPLS modules"}


The ietf-mpls module imports the followinig modules:

- ietf-routing defined in {{!RFC8349}}
- ietf-routing-types defined in {{!RFC8294}}
- ietf-interfaces defined in {{!RFC8343}}


ietf-mpls module contains the following high-level types and groupings:

label-block-alloc-mode:

> A base YANG identity for supported label block allocation mode(s).

mpls-operations-type:

> An enumeration type that represents support possible MPLS operation types (impose-and-forward, pop-and-forward, pop-impose-and-forward, and pop-and-lookup)


nhlfe-role:

> An enumeration type that represents the role of the NHLFE entry.

nhlfe-single-contents:

> A YANG grouping that describes single NHLFE and its associated parameters as described in the MPLS architecture document {{!RFC3031}}.

nhlfe-multiple-contents:

> A YANG grouping that describes a set of NHLFE(s) and their associated parameters as described in the MPLS architecture document {{!RFC3031}}.


interface-mpls-properties:

> A YANG grouping that describes the properties of an MPLS interface on a device.

interfaces-mpls:

> A YANG grouping that describes the list of MPLS enabled interfaces on a device.

label-block-properties:

> A YANG grouping that describes the properties of an MPLS label block.

label-blocks:

> A YANG grouping that describes the list of MPLS enabled interfaces on a device.

## Model Tree Diagram

The MPLS base tree diagram that follows the notation defined in {{!RFC8340}} is shown in {{fig-mpls-base-tree}}.

~~~~~~~~~~~
{::include /Users/tsaad/yang/sept/te/ietf-mpls.yang.tree}
~~~~~~~~~~~
{: #fig-mpls-base-tree title="MPLS Base tree diagram"}

## Model YANG Module

This section describes the "ietf-mpls" YANG module that 
provides base components of the MPLS data model. Other YANG module(s) may import and augment the base MPLS module to add feature specific data.

~~~~~~~~~~
<CODE BEGINS> file "ietf-mpls@2018-11-04.yang"
{::include /Users/tsaad/yang/sept/te/ietf-mpls.yang}
<CODE ENDS>
~~~~~~~~~~
{: #fig-module-mpls-base title="MPLS base YANG module"}

# IANA Considerations

This document registers the following URIs in the IETF XML registry
{{!RFC3688}}.
Following the format in {{RFC3688}}, the following registration is
requested to be made.

~~~
   URI: urn:ietf:params:xml:ns:yang:ietf-mpls
   Registrant Contact: The MPLS WG of the IETF.
   XML: N/A, the requested URI is an XML namespace.
~~~

This document registers a YANG module in the YANG Module Names
registry {{!RFC6020}}.

~~~
   name:       ietf-mpls
   namespace:  urn:ietf:params:xml:ns:yang:ietf-mpls
   prefix:     ietf-mpls
   // RFC Ed.: replace XXXX with RFC number and remove this note
   reference:  RFCXXXX
~~~

# Security Considerations


The YANG modules specified in this document define a schema for data
that is designed to be accessed via network management protocols such
as NETCONF {{!RFC6241}} or RESTCONF {{!RFC8040}}.  The lowest NETCONF layer
is the secure transport layer, and the mandatory-to-implement secure
transport is Secure Shell (SSH) {{!RFC6242}}.  The lowest RESTCONF layer
is HTTPS, and the mandatory-to-implement secure transport is TLS
{{!RFC8446}}.

The NETCONF access control model {{!RFC8341}} provides the means to
restrict access for particular NETCONF or RESTCONF users to a
preconfigured subset of all available NETCONF or RESTCONF protocol
operations and content.

Some of the readable data nodes in these YANG modules may be
considered sensitive or vulnerable in some network environments.  It
is thus important to control read access (e.g., via get, get-config,
or notification) to these data nodes.  These are the subtrees and
data nodes and their sensitivity/vulnerability:

/rt:routing/rt:ribs/rt:rib/rt:active-route/rt:output/rt:route: this path is augmented
by additional MPLS leaf(s) defined in this model. Access to this information may disclose the per prefix and/or other information.

/rt:routing/rt:ribs/rt:rib/rt:active-route/rt:output/rt:route/rt:next-hop/rt:next-hop-options/rt:simple-next-hop: this path is augmented by additional MPLS leaf(s) defined in this model. Access to this information may disclose the next-hop or path per prefix and/or other information.


# Acknowledgement

The authors would like to thank the  members of the multi-vendor YANG design team 
who are involved in the definition of this model.

# Contributors

~~~~

   Igor Bryskin
   Huawei Technologies
   email: Igor.Bryskin@huawei.com


   Himanshu Shah
   Ciena
   email: hshah@ciena.com

~~~~

