---
title: A YANG Data Model for Resource Reservation Protocol (RSVP)
abbrev: RSVP YANG Data Model
docname: draft-ietf-teas-yang-rsvp-14
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
    organization: Volta Networks
    email: xufeng.liu.ietf@gmail.com

 -
    ins: I. Bryskin
    name: Igor Bryskin
    organization: Individual
    email: i_bryskin@yahoo.com


normative:
  RFC2119:
  RFC8174:
  RFC6020:
  RFC6241:
  RFC6991:
  RFC7950:

informative:
  I-D.ietf-teas-yang-rsvp-te:

--- abstract

This document defines a YANG data model for the configuration and management of
RSVP Protocol. The model covers the building blocks of the RSVP protocol that
can be augmented and used by other RSVP extension models such as RSVP
extensions to Traffic-Engineering (RSVP-TE).  The model is divided into
base and extended modules that cover data for
configuration, operational state, remote procedure calls, and event
notifications.

--- middle

# Introduction

YANG {{!RFC6020}} and {{!RFC7950}} is a data modeling language that was
introduced to define the contents of a conceptual data store that allows
networked devices to be managed using NETCONF {{!RFC6241}}. YANG has proved
relevant beyond its initial confines, as bindings to other interfaces (e.g.
RESTCONF {{!RFC8040}}) and encoding other than XML (e.g. JSON) are being defined.
Furthermore, YANG data models can be used as the basis of implementation for
other interfaces, such as CLI and programmatic APIs.


This document defines a YANG data model that can be used to configure and
manage the RSVP protocol {{?RFC2205}}. The model is separated into two modules:
a base and RSVP extended YANG modules. The RSVP base YANG module models the
data that is core to the function of the RSVP protocol and MUST be supported by
vendors that support RSVP protocol {{?RFC2205}}.  The RSVP extended module
models data that is either optional or provides ability to tune
basic RSVP protocol functionality. The support for RSVP extended  
features by all vendors is considered optional.

The RSVP YANG model provides the building blocks needed to allow augmentation
by other models that extend the RSVP protocol-- such as using RSVP extensions to
signal Label Switched Paths (LSPs) as defined in {{?RFC3209}}.

The YANG module(s) defined in this document are compatible with the Network
Management Datastore Architecture (NMDA) {{!RFC7950}}.

# Requirements Language

The key words "MUST", "MUST NOT", "REQUIRED", "SHALL", "SHALL NOT", "SHOULD",
"SHOULD NOT", "RECOMMENDED", "NOT RECOMMENDED", "MAY", and "OPTIONAL" in this
document are to be interpreted as described in BCP 14 {{RFC2119}} {{RFC8174}}
when, and only when, they appear in all capitals, as shown here.

The terminology for describing YANG data models is found in {{!RFC7950}}.

## Prefixes in Data Node Names

In this document, names of data nodes and other data model objects are prefixed
using the standard prefix associated with the corresponding YANG imported
modules, as shown in Table 1.

   | Prefix    | YANG module        | Reference |
   |-----------|--------------------|-----------|
   | yang      | ietf-yang-types    | {{!RFC6991}} |
   | inet      | ietf-inet-types    | {{!RFC6991}} |
   | rt-types  | ietf-routing-types | {{!RFC8294}} |
   | key-chain | ietf-key-chain     | {{!RFC8177}} |
   |-----------|--------------------|-----------|

~~~~~~~~~~
          Table 1: Prefixes and corresponding YANG modules
~~~~~~~~~~

## Model Tree Diagram

A full tree diagram of the module(s) defined in this document is given in
subsequent sections  as per the syntax defined in {{!RFC8340}}.

# Model Overview

The RSVP base YANG module augments the "control-plane-protocol" list in
ietf-routing {{!RFC8349}} module with specific RSVP parameters in an "rsvp"
container. It also defines an extension identity "rsvp" of base
"rt:routing-protocol" to identify the RSVP protocol.

The augmentation of the RSVP model by other models (e.g. YANG models that
support RSVP Traffic Engineering (TE) extensions for signaling Label Switched
Paths (LSPs)) are outside the scope of this document and are discussed in
separate document(s), e.g. {{I-D.ietf-teas-yang-rsvp-te}}.

## Module(s) Relationship

This document divides the RSVP model into two modules: base and RSVP extended
modules. Some RSVP data are categorized as core to the function of the
protocol and MUST be supported by vendors claiming the support for RSVP
protocol {{?RFC2205}}.  Such configuration and state data are grouped in the RSVP base
module.

Other RSVP extended features are categorized as either optional or providing
ability to better tune the basic functionality of the RSVP protocol. The support for
RSVP extended features by all vendors is considered optional. Such features are
grouped in a separate RSVP extended module.

The relationship between the base and RSVP extended YANG modules and the IETF
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

* Authentication ({{?RFC2747}})
* Refresh Reduction ({{?RFC2961}})
* Hellos ({{?RFC3209}})
* Graceful Restart ({{?RFC3473}}, {{?RFC5063}})

The RSVP extended YANG module covers the configuration for optional
features that are not must for basic RSVP protocol operation.

The defined data model supports configuration inheritance for neighbors, and
interfaces.  Data nodes defined under the main container (e.g. the container
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

# RSVP Base YANG Model

The RSVP base module defines the main building blocks for modeling the RSVP
protocol and augments the IETF routing module.

## Module Structure

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
            +-- ro <<derived state associated with the LSP Tunnel>>
         .
         .
      +--rw sessions
            .
            +-- ro <<derived state associated with the LSP Tunnel>>
         .
   rpcs:
      +--x clear-session
      +--x clear-neighbor
      +--x clear-authentication

~~~~~~~~~~~
{: #fig-highlevel title="RSVP high-level tree model view"}

Configuration and state data are grouped to those applicable on per node
(global), per interface, per neighbor, or per session.

'globals':

> The globals container includes configuration and state data that is applicable globally and affects the RSVP protocol behavior.

'interfaces':

> The 'interfaces' container includes a list of RSVP enabled interfaces. It also includes configuration and state data that are applicable to all interfaces.  An entry in the interfaces list MAY carry its own configuration or state data. Any data or state under the "interfaces" container level is equally applicable to all interfaces unless it is explicitly overridden by configuration or state under a specific interface.

'neighbors' :

> The 'neighbors' container includes a list of RSVP neighbors. An entry in the RSVP neighbor list MAY carry its own
configuration and state relevant to the specific RSVP neighbor. RSVP neighbors can be dynamically discovered using RSVP signaling or explicitly configured.

'sessions':

> The 'sessions' container includes a list RSVP sessions. An entry in the RSVP session list MAY carry its own configuration and state relevant to a specific RSVP session. RSVP sessions are usually derived state that are created as result of signaling. This model defines attributes related to IP RSVP sessions as defined in {{?RFC2205}}.

## Tree Diagram

{{fig-rsvp-tree}} shows the YANG tree representation for configuration and state
data that is augmenting the RSVP base module:

~~~~~~~~~~~
{::include ../../te/ietf-rsvp.yang.tree}
~~~~~~~~~~~
{: #fig-rsvp-tree title="RSVP model tree diagram"}

## YANG Module {#rsvp-yang-mod}

The ietf-rsvp module imports from the following modules:

- ietf-interfaces defined in {{!RFC8343}}
- ietf-yang-types and ietf-inet-types defined in {{!RFC6991}}
- ietf-routing defined in {{!RFC8349}}
- ietf-key-chain defined in {{!RFC8177}}

This module references the following documents:
{{?RFC2205}}, {{?RFC2747}}, and {{?RFC2961}}.

~~~~~~~~~~
<CODE BEGINS> file "ietf-rsvp@2020-07-24.yang"
{::include ../../te/ietf-rsvp.yang}
<CODE ENDS>
~~~~~~~~~~

# RSVP Extended YANG Model

The RSVP extended module augments the RSVP base module with additional and optional feature data.

## Module Structure

The RSVP extended YANG module covers non-core RSVP feature(s). It also covers
feature(s) that MAY be supported vendors claiming support for RSVP protocol.

## Tree Diagram

{{fig-rsvp-extended}} shows the YANG tree representation for configuration and
state data that is augmenting the RSVP extended module:

~~~~~~~~~~
{::include ../../te/ietf-rsvp-extended.yang.tree}
~~~~~~~~~~
{: #fig-rsvp-extended title="RSVP extended module tree diagram"}

 
## YANG Module

The ietf-rsvp-extended module imports from the following modules:

- ietf-rsvp defined in this document
- ietf-routing defined in {{!RFC8349}}
- ietf-yang-types and ietf-inet-types defined in {{!RFC6991}}
- ietf-key-chain defined in {{!RFC8177}}

{{fig-rsvp-extended-mod}} shows the RSVP extended YANG module:

This module references the following documents:
{{?RFC2747}}, {{?RFC3209}}, and {{?RFC5495}}.

~~~~~~~~~~
<CODE BEGINS> file "ietf-rsvp-extended@2020-07-24.yang"
{::include ../../te/ietf-rsvp-extended.yang}
<CODE ENDS>
~~~~~~~~~~
{: #fig-rsvp-extended-mod title="RSVP extended YANG module"}

# IANA Considerations

This document registers the following URIs in the IETF XML registry
{{!RFC3688}}.  Following the format in {{!RFC3688}}, the following registration
is requested to be made.

~~~
   URI: urn:ietf:params:xml:ns:yang:ietf-rsvp
   Registrant Contact:  The IESG.
   XML: N/A, the requested URI is an XML namespace.

   URI: urn:ietf:params:xml:ns:yang:ietf-rsvp-extended
   Registrant Contact:  The IESG.
   XML: N/A, the requested URI is an XML namespace.
~~~

This document registers two YANG modules in the YANG Module Names
registry {{!RFC6020}}.

~~~
   name:       ietf-rsvp
   namespace:  urn:ietf:params:xml:ns:yang:ietf-rsvp
   prefix:     rsvp
   reference:  RFCXXXX

   name:       ietf-rsvp-extended
   namespace:  urn:ietf:params:xml:ns:yang:ietf-rsvp-extended
   prefix:     rsvp-extendeed
   reference:  RFCXXXX
~~~

# Security Considerations

The YANG module specified in this document defines a schema for data that is
designed to be accessed via network management protocols such as NETCONF
{{!RFC6241}} or RESTCONF {{!RFC8040}}. The lowest NETCONF layer is the secure
transport layer, and the mandatory-to-implement secure transport is Secure
Shell (SSH) {{!RFC6242}}.  The lowest RESTCONF layer is HTTPS, and the
mandatory-to-implement secure transport is TLS {{!RFC8446}}.

The Network Configuration Access Control Model (NACM) {{!RFC8341}} provides the
means to restrict access for particular NETCONF or RESTCONF users to a
preconfigured subset of all available NETCONF or RESTCONF protocol operations
and content.

There are a number of data nodes defined in the YANG module(s) defined in this
document that are writable/creatable/deletable (i.e., config true, which is the
default).  These data nodes may be considered sensitive or vulnerable in some
network environments.  Write operations (e.g., \<edit-config\>) to these data
nodes without proper protection can have a negative effect on network
operations. These are the subtrees and data nodes and their sensitivity/vulnerability:

/rt:routing/rt:control-plane-protocols/rt:control-plane-protocol/rsvp:rsvp/
    /rsvp:globals
    /rsvp:interfaces
    /rsvp:sessions

> All of which are considered sensitive and if access to either of these is
> compromised, it can result in temporary network outages or be employed to
> mount DoS attacks.

Some of the readable data nodes in this YANG module may be considered sensitive
or vulnerable in some network environments. It is thus important to control
read access (e.g., via get, get-config, or notification) to these data nodes.
These are the subtrees and data nodes and their sensitivity/vulnerability:

/rt:routing/rt:control-plane-protocols/rt:control-plane-protocol/rsvp:rsvp/
    /rsvp:globals
    /rsvp:interfaces
    /rsvp:sessions

> Additional information from these state data nodes can be inferred with respect
> to the network topology, and device location and subsequently be used to mount
> other attacks in the network.

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
{{!RFC7950}} apply for this document as well.

# Acknowledgement

The authors would like to thank Tom Petch for reviewing and providing useful
feedback about the document. The authors would also like to thank Lou Berger
for reviewing and providing valuable feedback on this document.

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

