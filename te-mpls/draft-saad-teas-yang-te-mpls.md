---
title: A YANG Data Model for MPLS Traffic Engineering Tunnels and Interfaces
abbrev: MPLS TE YANG Data Model
docname: draft-ietf-teas-yang-te-mpls-00
date: 2019-02-18
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
    organization: Cisco Systems Inc
    email: tsaad@cisco.com
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
  RFC3209:
  RFC2119:
  RFC6020:
  RFC6241:
  RFC6991:
  RFC8040:
  I-D.ietf-teas-yang-rsvp:

informative:

--- abstract

This document defines a YANG data model for the configuration and management of
Multiprotocol Label Switching (MPLS) Traffic Engineering (TE) interfaces,
tunnels and Label Switched Paths (LSPs). The model augments the TE generic YANG
model for MPLS packet dataplane technology.

This model covers data for configuration, operational state, remote procedural
calls, and event notifications.

--- middle

# Introduction

YANG {{!RFC6020}} and {{!RFC7950}} is a data modeling language used to define
the contents of a conceptual data store that allows networked devices to be
managed using NETCONF {{!RFC6241}}. YANG has proved relevant beyond its initial
confines, as bindings to other interfaces (e.g. RESTCONF {{RFC8040}}) and
encoding other than XML (e.g. JSON) are being defined. Furthermore, YANG data
models can be used as the basis of implementation for other interfaces, such as
CLI and programmatic APIs.

This document describes the YANG data model for configuration and management of
MPLS TE tunnels, LSPs, and interfaces.  Other YANG module(s) that model TE
signaling protocols, such as RSVP-TE ({{RFC3209}}, {{!RFC3473}}) may augment
this model with MPLS signaling specific data.

## Terminology

The key words "MUST", "MUST NOT", "REQUIRED", "SHALL", "SHALL NOT", "SHOULD",
"SHOULD NOT", "RECOMMENDED", "NOT RECOMMENDED", "MAY", and "OPTIONAL" in this
document are to be interpreted as described in BCP 14 {{!RFC2119}} {{!RFC8174}}
when, and only when, they appear in all capitals, as shown here.

The terminology for describing YANG data models is found in {{!RFC7950}}.

## Prefixes in Data Node Names

In this document, names of data nodes and other data model objects are prefixed
using the standard prefix associated with the corresponding YANG imported
modules, as shown in Table 1.

~~~~~~~~~~
 +---------------+--------------------+-------------------------------+
 | Prefix        | YANG module        | Reference                     |
 +---------------+--------------------+-------------------------------+
 | yang          | ietf-yang-types    | [RFC6991]                     |
 | inet          | ietf-inet-types    | [RFC6991]                     |
 | rt-types      | ietf-routing-types | [RFC8294]                     |
 | te            | ietf-te            | [I-D.ietf-teas-yang-te]       |
 | te-dev        | ietf-te-device     | [I-D.ietf-teas-yang-te]       |
 | te-mpls       | ietf-te-mpls       | This document                 |
 | te-types      | ietf-te-types      | [I-D.ietf-teas-yang-te-types] |
 | te-mpls-types | ietf-te-mpls-types | [I-D.ietf-teas-yang-te-types] |
 +---------------+--------------------+-------------------------------+

            Table 1: Prefixes and corresponding YANG modules
~~~~~~~~~~

## Acronyms and Abbreviations

> MPLS: Multiprotocol Label Switching
> LSP: Label Switched Path
> LSR: Label Switching Router
> LER: Label Edge Router
> TE: Traffic Engineering


# MPLS TE YANG Model

The MPLS TE YANG model covers the configuration, state, RPC and notifications
data pertaining to MPLS TE interfaces, tunnels and LSPs parameters. The data
specific to the signaling protocol used to establish MPLS LSP(s) is outside the
scope of this document and is covered in other documents, e.g. in
{{!I-D.ietf-teas-yang-rsvp}} and {{!I-D.ietf-teas-yang-rsvp-te}}.

## Module(s) Relationship

The MPLS TE YANG module "ietf-te-mpls" imports the following modules:

- ietf-te defined in {{!I-D.ietf-teas-yang-te}}
- ietf-te-types and ietf-te-mpls-types defined in
  {{!I-D.ietf-teas-yang-te-types}}
- ietf-routing-types defined in {{!RFC8294}}
- ietf-mpls-static defined in {{!I-D.ietf-mpls-static-yang}}

~~~

  TE generic       +---------+         o: augment
  module           | ietf-te |
                   +---------+
                      o  o
                      |  |
                +-----+  +-----+
                |              |
          +--------------+   +--------------+ 
  RSVP-TE | ietf-rsvp-te |   | ietf-te-mpls |
          +--------------+   +--------------+

~~~
{: #figctrl title="Relationship of MPLS TE module with TE generic and RSVP-TE
YANG modules"}

The MPLS TE YANG module "ietf-te-mpls" augments the "ietf-te" TE generic YANG
module as shown in {{figctrl}}.

## Model Tree Diagram

{{fig-globals-tree}} shows the tree diagram of the MPLS TE YANG model that is
defined in ietf-te-mpls.yang.

~~~~~~~~~~~
{::include /Users/tsaad/yang/sept/te/ietf-mpls-te.tree}
~~~~~~~~~~~
{: #fig-globals-tree title="MPLS TE model configuration and state tree"}


## MPLS TE YANG Module

~~~~~~~~~~
<CODE BEGINS> file "ietf-te-mpls@2018-11-02.yang"
{::include /Users/tsaad/yang/sept/te/ietf-te-mpls.yang}
<CODE ENDS>
~~~~~~~~~~
{: #fig-basic-te title="TE generic YANG module"}

# IANA Considerations

This document registers the following URIs in the IETF XML registry
{{!RFC3688}}.
Following the format in {{RFC3688}}, the following registration is
requested to be made.

~~~
   URI: urn:ietf:params:xml:ns:yang:ietf-te-mpls
   XML: N/A, the requested URI is an XML namespace.
~~~

This document registers a YANG module in the YANG Module Names
registry {{RFC6020}}.

~~~
   name:       ietf-te-mpls
   namespace:  urn:ietf:params:xml:ns:yang:ietf-te-mpls
   prefix:     ietf-te-mpls
   reference:  RFC3209
~~~

# Security Considerations

The YANG module defined in this memo is designed to be accessed via
the NETCONF protocol {{!RFC6241}}.  The lowest NETCONF layer is the
secure transport layer and the mandatory-to-implement secure
transport is SSH {{!RFC6242}}.  The NETCONF access control model
{{!RFC8341}} provides means to restrict access for particular NETCONF
users to a pre-configured subset of all available NETCONF protocol
operations and content.

A number of data nodes defined in this YANG module are
writable/creatable/deletable (i.e., config true, which is the
default).  These data nodes may be considered sensitive or vulnerable
in some network environments.  Write operations (e.g., \<edit-config\>)
to these data nodes without proper protection can have a negative
effect on MPLS network operations.  Following are the subtrees and data
nodes and their sensitivity/vulnerability:

"/te/tunnels":  This list specifies the configured TE
tunnels on a device.  Unauthorized access to this list could cause
the device to ignore packets it should receive and process.

# Contributors
~~~~

   Himanshu Shah
   Ciena
   Email: hshah@ciena.com

~~~~

