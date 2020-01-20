---
title: A YANG Data Model for Resource Reservation Protocol (RSVP)
abbrev: RSVP YANG Data Model
docname: draft-ietf-teas-yang-rsvp-12
category: std
ipr: trust200902
workgroup: TEAS Working Group
keyword: Internet-Draft

stand_alone: yes
pi: [toc, sortrefs, symrefs]

author:
 -
    ins: V. P. Beeram
    name: Vishnu Pavan Beeram
    organization: Juniper Networks
    email: vbeeram@juniper.net

 -
    ins: T. Saad
    name: Tarek Saad
    organization: Juniper Networks
    email: tsaad@juniper.net

 -
    ins: R. Gandhi
    name: Rakesh Gandhi
    organization: Cisco Systems, Inc.
    email: rgandhi@cisco.com

 -
    ins: X. Liu
    name: Xufeng Liu
    organization: Jabil
    email: Xufeng_Liu@jabil.com

 -
    ins: I. Bryskin
    name: Igor Bryskin
    organization: Huawei Technologies
    email: Igor.Bryskin@huawei.com


normative:
  RFC8349:
  RFC2119:
  RFC8174:
  RFC6020:
  RFC6241:
  RFC6991:
  RFC7950:
  RFC2205:

informative:
  I-D.ietf-teas-yang-rsvp-te:

--- abstract

This document defines a YANG data model for the configuration and management of
RSVP Protocol. The model covers the building blocks of the RSVP protocol that
can be augmented and used by other RSVP extension models such as RSVP
extensions to Traffic-Engineering (RSVP-TE).  The model covers the
configuration, operational state, remote procedure calls, and event
notifications data.

--- middle

# Introduction

YANG {{!RFC6020}} is a data definition language that was introduced to define
the contents of a conceptual data store that allows networked devices to be
managed using NETCONF {{RFC6241}}. YANG is proving relevant beyond its initial
confines, as bindings to other interfaces (e.g. ReST) and encoding other than
XML (e.g. JSON) are being defined. Furthermore, YANG data models can be used as
the basis of implementation for other interfaces, such as CLI and programmatic
APIs.

This document defines a YANG data model that can be used to configure and manage
the RSVP protocol {{RFC2205}}. This model covers RSVP protocol building blocks
that can be augmented and used by other RSVP extension models-- such as for
signaling RSVP-TE MPLS (or other technology specific) Label Switched Paths
(LSP)s.


## Terminology

The key words "MUST", "MUST NOT", "REQUIRED", "SHALL", "SHALL NOT", "SHOULD",
"SHOULD NOT", "RECOMMENDED", "NOT RECOMMENDED", "MAY", and "OPTIONAL" in this
document are to be interpreted as described in BCP 14 {{RFC2119}} {{RFC8174}}
when, and only when, they appear in all capitals, as shown here.

The terminology for describing YANG data models is found in {{RFC7950}}.

## Model Tree Diagram

A full tree diagram of the module(s) defined in this document is given in
subsequent sections  as per the syntax defined in {{!RFC8340}}.

## Prefixes in Data Node Names

In this document, names of data nodes and other data model objects are prefixed
using the standard prefix associated with the corresponding YANG imported
modules, as shown in Table 1.

~~~~~~~~~~
            +-----------+--------------------+-----------+
            | Prefix    | YANG module        | Reference |
            +-----------+--------------------+-----------+
            | yang      | ietf-yang-types    | [RFC6991] |
            | inet      | ietf-inet-types    | [RFC6991] |
            | rt-type   | ietf-routing-types | XX        |
            | key-chain | ietf-key-chain     | XX        |
            +---------+----------------------+-----------+

            Table 1: Prefixes and corresponding YANG modules
~~~~~~~~~~

# Model Overview

The RSVP base YANG module augments the "control-plane-protocol" list in
ietf-routing {{RFC8349}} module with specific RSVP parameters in an "rsvp"
container. It also defines an extension identity "rsvp" of base
"rt:routing-protocol" to identify the RSVP protocol.

The augmentation of the RSVP model by other models (e.g. RSVP-TE for MPLS or
other technologies) are outside the scope of this document and are discussed in
separate document(s), e.g. {{I-D.ietf-teas-yang-rsvp-te}}.

## Module(s) Relationship

This document divides the RSVP model into two modules: base and extended RSVP
modules. Some RSVP features are categorized as core to the function of the
protocol and are supported by most vendors claiming the support for RSVP
protocol.  Such features configuration and state are grouped in the RSVP base
module.

Other extended RSVP features are categorized as either optional or providing
ability to better tune the basic functionality of the RSVP protocol. The support for
extended RSVP features by all vendors is considered optional. Such features are
grouped in a separate RSVP extended module.

The relationship between the base and extended RSVP YANG model and the IETF
routing YANG model is shown in {{figctrl}}.

~~~
                +--------------+
       Routing  | ietf-routing |
                +--------------+
                      o
                      |
                 +-----------+ 
  RSVP module    | ietf-rsvp |
                 +-----------+
                      o
                      |                    o: augment relationship
  RSVP extended       |
    module       +--------------------+
                 | ietf-rsvp-extended |
                 +--------------------+
~~~
{: #figctrl title="Relationship of RSVP and RSVP extended modules with other
protocol modules"}

## Design Considerations

The RSVP base model does not aim to be feature complete. The primary intent is
to cover a set of standard core features that are commonly in use. For example:

* Authentication ({{!RFC2747}})
* Refresh Reduction ({{!RFC2961}})
* Hellos ({{!RFC3209}})
* Graceful Restart ({{!RFC3473}}, {{!RFC5063}})

The extended RSVP YANG model covers the configuration for optional
features that are not must for basic RSVP protocol operation.

The defined data model supports configuration inheritance for neighbors, and
interfaces.  Data elements defined in the main container (e.g. the container
that encompasses the list of interfaces, or neighbors) are assumed to apply
equally to all elements of the list, unless overridden explicitly for a certain
element (e.g. interface). Vendors are expected to augment the above
container(s) to provide the list of inheritance command for their
implementations.

## Model Notifications

Notifications data modeling is key in any defined data model.

{{!RFC8639}} and {{!RFC8641}} define a subscription and push mechanism
for YANG datastores. This mechanism currently allows the user to:

- Subscribe notifications on a per client basis
- Specify subtree filters or xpath filters so that only interested
  contents will be sent.
- Specify either periodic or on-demand notifications.

## RSVP Base YANG Model

The RSVP base YANG data model defines the container "rsvp"  as the top level
container in this data model.  The presence of this container enables the RSVP
protocol functionality.

The derived state data is contained in "read-only" nodes directly under the
intended object as shown in {{fig-highlevel}}.

~~~~~~~~~~~
module: ietf-rsvp
   +--rw rsvp!
      +--rw globals
         .
         .
      +--rw interfaces
            .
            +-- ro <<derived state associated with interfaces>>
         .
         .
      +--rw neighbors
            .
            +-- ro <<derived state associated with the tunnel>>
         .
         .
      +--rw sessions
            .
            +-- ro <<derived state associated with the tunnel>>
         .
   rpcs:
      +--x clear-session
      +--x clear-neighbor

~~~~~~~~~~~
{: #fig-highlevel title="RSVP high-level tree model view"}

Configuration and state data are grouped to those applicable on per node
(global), per interface, per neighbor, or per session.

Global Data:

> The global data cover the configuration and state that is
applicable the RSVP protocol behavior.

Interface Data:

> The interface data configuration and state model relevant attributes
> applicable to one or all RSVP interfaces.  Any data or state at
> the "interfaces" container level is equally applicable to all interfaces --
> unless overridden by explicit configuration or state under a specific interface.

Neighbor Data:

> The neighbor data cover configuration and state relevant to RSVP neighbors. Neighbors
can be dynamically discovered using RSVP signaling or explicitly configured.

Session Data:

> The sessions data branch covers configuration and state relevant to RSVP sessions. This is usually derived state that is result of signaling. This model defines attributes related to IP RSVP sessions as defined in {{RFC2205}}.

### Tree Diagram

{{fig-rsvp-tree}} shows the YANG tree representation for configuration and state
data that is augmenting the RSVP basic module:

~~~~~~~~~~~
{::include ../../te/ietf-rsvp.yang.tree}
~~~~~~~~~~~
{: #fig-rsvp-tree title="RSVP model tree diagram"}

### YANG Module {#rsvp-yang-mod}

The ietf-rsvp module imports from the following modules:

- ietf-interfaces defined in {{!RFC8343}}
- ietf-yang-types and ietf-inet-types defined in {{RFC6991}}
- ietf-routing defined in {{!RFC8349}}
- ietf-key-chain defined in {{!RFC8177}}

~~~~~~~~~~
<CODE BEGINS> file "ietf-rsvp@2020-01-13.yang"
{::include ../../te/ietf-rsvp.yang}
<CODE ENDS>
~~~~~~~~~~

## RSVP Extended YANG Model

The RSVP extended YANG model covers non-core RSVP feature(s). It also covers
feature(s) that are not necessarily supported by all vendors, and hence, can be
guarded with "if-feature" checks.

### Tree Diagram

{{fig-rsvp-extended}} shows the YANG tree representation for configuration and
state data that is augmenting the RSVP extended module:

~~~~~~~~~~
{::include ../../te/ietf-rsvp-extended.yang.tree}
~~~~~~~~~~
{: #fig-rsvp-extended title="RSVP extended model tree diagram"}

 
### YANG Module

The ietf-rsvp-extended module imports from the following modules:

- ietf-rsvp defined in this document
- ietf-routing defined in {{!RFC8349}}
- ietf-yang-types and ietf-inet-types defined in {{RFC6991}}
- ietf-key-chain defined in {{!RFC8177}}

{{fig-rsvp-extended-mod}} shows the RSVP extended YANG module:

~~~~~~~~~~
<CODE BEGINS> file "ietf-rsvp-extended@2019-07-04.yang"
{::include ../../te/ietf-rsvp-extended.yang}
<CODE ENDS>
~~~~~~~~~~
{: #fig-rsvp-extended-mod title="RSVP extended YANG module"}

# IANA Considerations

This document registers the following URIs in the IETF XML registry
{{!RFC3688}}.  Following the format in {{RFC3688}}, the following registration
is requested to be made.

~~~
   URI: urn:ietf:params:xml:ns:yang:ietf-rsvp
   XML: N/A, the requested URI is an XML namespace.

   URI: urn:ietf:params:xml:ns:yang:ietf-rsvp-extended
   XML: N/A, the requested URI is an XML namespace.
~~~

This document registers two YANG modules in the YANG Module Names
registry {{RFC6020}}.

~~~
   name:       ietf-rsvp
   namespace:  urn:ietf:params:xml:ns:yang:ietf-rsvp
   prefix:     ietf-rsvp
   reference:  RFCXXXX

   name:       ietf-rsvp-extended
   namespace:  urn:ietf:params:xml:ns:yang:ietf-rsvp-extended
   prefix:     ietf-rsvp-extendeed
   reference:  RFCXXXX
~~~

# Security Considerations

The YANG module specified in this document defines a schema for data that is
designed to be accessed via network management protocols such as NETCONF
{{RFC6241}} or RESTCONF {{!RFC8040}}. The lowest NETCONF layer is the secure
transport layer, and the mandatory-to-implement secure transport is Secure
Shell (SSH) {{!RFC6242}}.  The lowest RESTCONF layer is HTTPS, and the
mandatory-to-implement secure transport is TLS {{!RFC8446}}.

The Network Configuration Access Control Model (NACM) {{!RFC8341}} provides the
means to restrict access for particular NETCONF or RESTCONF users to a
preconfigured subset of all available NETCONF or RESTCONF protocol operations
and content.

There are a number of data nodes defined in the YANG module which are
writable/creatable/deletable (i.e., config true, which is the default).  These
data nodes may be considered sensitive or vulnerable in some network
environments.  Write operations (e.g., \<edit-config\>) to these data nodes
without proper protection can have a negative effect on network operations.

/rt:routing/rt:control-plane-protocols/rt:control-plane-protocol/rsvp:

> The presence of this container enables the RSVP protocol functionality on a
> device. It alsocontrols the configuration settings on data nodes pertaining
> to RSVP sessions, interfaces and neighbors. All of which are considered
> sensitive and if access to either of these is compromised, it can result in
> temporary network outages or be employed to mount DoS attacks.

For RSVP authentication, the configuration supported is via the specification of
key-chains {{!RFC8177}} or the direct specification of key and authentication
algorithm, and hence security considerations of {{!RFC8177}} are inherited.  This
includes the considerations with respect to the local storage and handling of
authentication keys.

Some of the RPC operations defined in this YANG module may be considered
sensitive or vulnerable in some network environments.  It is thus
important to control access to these operations.  The RSVP YANG
module support the "clear-session" and "clear-neighbor" RPCs.  If
access to either of these is compromised, they can result in
temporary network outages be employed to mount DoS attacks.

The security considerations spelled out in the YANG 1.1 specification
{{RFC7950}} apply for this document as well.


# Acknowledgement

The authors would like to thank Lou Berger for reviewing and providing valuable
feedback on this document.

# Contributors

~~~~


   Himanshu Shah
   Ciena

   Email: hshah@ciena.com


   Xia Chen
   Huawei Technologies

   Email: jescia.chenxia@huawei.com


   Raqib Jones
   Brocade

   Email: raqib@Brocade.com


   Bin Wen
   Comcast

   Email: Bin_Wen@cable.comcast.com

~~~~

