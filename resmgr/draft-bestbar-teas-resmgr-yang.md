---
title: A YANG Data Model for Network Resource Reservation Manager
abbrev: Resource Manager YANG Data Model
docname: draft-bestbar-teas-resmgr-yang-00
category: std
ipr: trust200902
workgroup: TEAS Working Group
keyword: Internet-Draft

stand_alone: yes
pi: [toc, sortrefs, symrefs, comments]

author:

 -
    ins: T. Saad
    name: Tarek Saad
    organization: Juniper Networks
    email: tsaad@juniper.net

 -
   ins: V. P. Beeram
   name: Vishnu Pavan Beeram
   organization: Juniper Networks
   email: vbeeram@juniper.net

 -
   ins: X. Liu
   name: Xufeng Liu
   organization: Volta Networks
   email: xufeng.liu.ietf@gmail.com

normative:

informative:

--- abstract

This document defines a YANG data model for the network Resource Reservation
Manager (RRM).  The RRM can be deployed to manage set of network resources
scoped to a node, a region of a network, a domain of the network, or globally
for all resources in a network.

This model covers data for configuration, operational state, remote procedural
calls pertaining to links managed by the RRM.

--- middle

# Introduction

YANG {{!RFC6020}} and {{!RFC7950}} is a data modeling language that was
introduced to define the contents of a conceptual data store that allows
networked devices to be managed using NETCONF {{!RFC6241}}. YANG data models
can be used as the basis of implementation for other interfaces, such as gRPC,
CLI and other programmatic APIs.

This document describes YANG data model for the Resource Reservation Manager
(RRM). The RRM can be deployed to manage set of network resources scoped to a
node, a region of a network, a domain of the network, or globally for all
resources in a network.

The RRM can acquire topological elements and their attributes from the devices
using routing protocols or another suitable interface to the network devices.
An aggregate view of the dynamic resource reservation state on links managed by the RRM
can be downloaded to the device. The device can then disseminate the dynamic
link state to the network using known means (e.g. link state protocols).
The headend or Path Computation Engine (PCE) can update their topologies with current
network state and use it to make further for path computations.

It is possible to deploy multiple instances of RRM to service different parts of the network. For example,
a per-domain RRM may be deployed to service requests within a domain. A per-node
RRM instance may be deployed to manage resources specific to a node.

# Requirements Language

{::boilerplate bcp14}

The following terms are defined in {{!RFC6241}} and are used in this specification:

* client
* configuration data
* state data

This document also makes use of the following terminology introduced in the
YANG Data Modeling Language {{!RFC7950}}:

* augment
* data model
* data node

## Prefixes in Data Node Names

In this document, names of data nodes and other data model objects are prefixed
using the standard prefix associated with the corresponding YANG imported
modules, as shown in Table 1.

 | Prefix          | YANG module          | Reference          |
 |-----------------|----------------------|--------------------|
 | inet            | ietf-inet-types      | {{!RFC6991}}       |
 | te-types        | ietf-te-types        | {{!RFC8776}}       |
 | te-packet-types | ietf-te-packet-types | {{!RFC8776}}       |
 | rrm             | ietf-resmgr          | this document      |
 |-----------------|----------------------|--------------------|

~~~~~~~~~~
         Table 1: Prefixes and corresponding YANG modules
~~~~~~~~~~

## Model Tree Diagrams

The tree diagrams extracted from the module(s) defined in this document are given in
subsequent sections as per the syntax defined in {{!RFC8340}}.

# Design Considerations

The following other design considerations are taken into account with respect data
organization:

* In general, minimal elements in the model are designated as "mandatory" to
  allow freedom to vendors to adapt the data model to their specific product
  implementation.

* The Network Management Datastore Architecture (NMDA) {{!RFC8342}} addresses
modeling state data for ephemeral objects.  This document adopts the NMDA model
for configuration and state data representation as per IETF guidelines for new
IETF YANG models.


# Network Resource Reservation Manager YANG Model

The network RRM YANG module ('ietf-resmgr') is meant to manage resource reservation
on a set of resources of a network.

This includes admitting and releasing paths on specific links and nodes managed by
the RRM.

## Module Structure

The 'ietf-resmgr' structured hierarchically. The set of network resources managed
by the RRM are organized by domain and node membership.

domains:

> A YANG container that includes the list of domain resources managed by this RRM.

nodes:

> A YANG container that includes the list of node resources under a specific domain
 that are managed by this RRM.

links:

> A YANG container that includes the list of link resources under a specific node in a domain
 that are managed by this RRM.

path-admit:

> A Remote Procedure Call (RPC) to request path admission of a specific path on a set of
network resources managed by this RRM.

topology-update:

> An RPC to request a addition or removal of a network element whose resources are managed by this
RRM.


## Tree Diagram

{{fig-te-tree}} shows the tree diagram of the generic TE YANG model defined in
modules 'ietf-resmgr.yang'.

~~~~~~~~~~~
{::include ./ietf-resmgr.yang.tree}
~~~~~~~~~~~
{: #fig-te-tree title="The RRM data model YANG tree diagram"}


## YANG Module

The generic TE YANG module 'ietf-te' imports the following modules:

- ietf-yang-types and ietf-inet-types defined in {{!RFC6991}}
- ietf-te-types defined in {{!RFC8776}}

~~~~~~~~~~
<CODE BEGINS> file "ietf-resmgr@2021-07-01.yang"
{::include ./ietf-resmgr.yang}
<CODE ENDS>
~~~~~~~~~~
{: #fig-basic-te title="TE Tunnel data model YANG module"}

# IANA Considerations

This document registers the following URIs in the IETF XML registry
{{!RFC3688}}.
Following the format in {{RFC3688}}, the following registrations are
requested to be made.

~~~~
   URI: urn:ietf:params:xml:ns:yang:ietf-resmgr
   Registrant Contact:  The IESG.
   XML: N/A, the requested URI is an XML namespace.
~~~~

This document registers two YANG modules in the YANG Module Names
registry {{RFC6020}}.

~~~~
   Name:       ietf-resmgr
   Namespace:  urn:ietf:params:xml:ns:yang:ietf-resmgr
   Prefix:     rrm
   Reference:  RFCXXXX

~~~~

# Security Considerations

The YANG module specified in this document defines a schema for data that is
designed to be accessed via network management protocols such as NETCONF
{{!RFC6241}} or RESTCONF {{!RFC8040}}. The lowest NETCONF layer is the secure
transport layer, and the mandatory-to-implement secure transport is Secure
Shell (SSH) {{!RFC6242}}. The lowest RESTCONF layer is HTTPS, and the
mandatory-to-implement secure transport is TLS {{!RFC8446}}.

The Network Configuration Access Control Model (NACM) {{!RFC8341}} provides the
means to restrict access for particular NETCONF or RESTCONF users to a
preconfigured subset of all available NETCONF or RESTCONF protocol operations
and content.

There are a number of data nodes defined in this YANG module that are
writable/creatable/deletable (i.e., config true, which is the default). These
data nodes may be considered sensitive or vulnerable in some network
environments. Write operations (e.g., edit-config) to these data nodes without
proper protection can have a negative effect on network operations. These are
the subtrees and data nodes and their sensitivity/vulnerability:

"/domains":  This container and any of its encompassing data nodes represent
the set of network resources managed by this RRM.  Unauthorized access to 
this list could cause the device to ignore packets it should receive and process.

Some of the readable data nodes in this YANG module may be considered sensitive
or vulnerable in some network environments. It is thus important to control
read access (e.g., via get, get-config, or notification) to these data nodes.
These are the subtrees and data nodes and their sensitivity/vulnerability:

Some of the RPC operations in this YANG module may be considered sensitive or
vulnerable in some network environments. It is thus important to control access
to these operations. These are the operations and their
sensitivity/vulnerability:

"path-admit": using this RPC, an attacker can attempt to deplete certain
network resources managed by this RRM. Also, it is possible for an attacker to
preempt existing admitted paths on a set of resources by sending higher
priority requests on the same set of network resources.  This may affect paths
that can be carrying live traffic, and hence may result in interruptions to
services carried over the network.

"topology-update": using this RPC, an attacker can attempt to delete certain
network resources that are already managed by this RRM. This may result in
preemption of existing paths admitted on those network resources and result
in interruptions to services carried over the network.

The security considerations spelled out in the YANG 1.1 specification
{{!RFC7950}} apply for this document as well.
