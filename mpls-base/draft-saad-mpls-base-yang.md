---
title: A YANG Data Model for MPLS Base 
abbrev: MPLS Base YANG Data Model
docname: draft-ietf-mpls-base-yang-06
date: 2018-02-15
category: std
ipr: trust200902
workgroup: MPLS Working Group
keyword: Internet-Draft

stand_alone: yes
pi: [toc, sortrefs, symrefs]

normative:
  RFC2119:
  RFC8022:

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

This document contains a specification of the the MPLS base YANG model. The MPLS base YANG module
serves as a base framework for configuring and managing an MPLS switching subsystem.
It is expected that other MPLS technology YANG models (e.g. MPLS LSP Static, LDP or RSVP-TE models)
will augment the MPLS base YANG model.

--- middle

# Introduction

A core routing data model is defined in
{{!RFC8022}}, and it provides a basis for the
development of data models for routing protocols.  The MPLS base model
augments this model with additional data specific to MPLS switching {{!RFC3031}}.
The interface data model is defined in {{!RFC7223}} and is used for referencing interface
from the MPLS base model. 

The MPLS base YANG module augments the "routing" read-write (rw) and "routing-state" read-only
(ro) branches of the ietf-routing module defined in {{RFC8022}}.

This document defines the specification for the "ietf-mpls" YANG module that 
provides base components of the MPLS data model. It is expected that other MPLS 
YANG modules will augment the "ietf-mpls" base model
to define data models for other MPLS technologies (e.g. MPLS LDP or MPLS RSVP-TE).

This document also defines a way to model MPLS labelled routes as an augmentation of the the
routing RIB model defined in {{RFC8022}} for IP prefix routes that are MPLS labelled.
Other MPLS non-IP prefix routes are also modelled by introducing a new "mpls" address-family RIB.


## Terminology

The key words "MUST", "MUST NOT", "REQUIRED", "SHALL", "SHALL NOT",
"SHOULD", "SHOULD NOT", "RECOMMENDED", "MAY", and "OPTIONAL" in this
document are to be interpreted as described in BCP 14, RFC 2119 RFC2119}}.

### Keywords

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


## MPLS Base Tree Diagram

The MPLS base tree diagram is shown in {{fig-mpls-base-tree}}.

~~~~~~~~~~~
{::include /Users/tsaad/yang/jun/te/ietf-mpls.yang.tree}
~~~~~~~~~~~
{: #fig-mpls-base-tree title="MPLS Base tree diagram"}

## MPLS Base Module

~~~~~~~~~~
<CODE BEGINS> file "ietf-mpls@2017-07-02.yang"
{::include /Users/tsaad/yang/jun/te/ietf-mpls.yang}
<CODE ENDS>
~~~~~~~~~~
{: #fig-module-mpls-base title="MPLS base YANG module"}

# IANA Considerations

This document registers the following URIs in the IETF XML registry
{{!RFC3688}}.
Following the format in {{RFC3688}}, the following registration is
requested to be made.

   URI: urn:ietf:params:xml:ns:yang:ietf-mpls
   XML: N/A, the requested URI is an XML namespace.

This document registers a YANG module in the YANG Module Names
registry {{RFC6020}}.

   name:       ietf-mpls
   namespace:  urn:ietf:params:xml:ns:yang:ietf-mpls
   prefix:     ietf-mpls
   reference:  RFC3031

# Security Considerations

The YANG module defined in this document is designed to be accessed via
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

