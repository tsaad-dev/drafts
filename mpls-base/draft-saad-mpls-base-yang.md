---
title: A YANG Data Model for MPLS Base 
abbrev: MPLS Base YANG Data Model
docname: draft-ietf-mpls-base-yang-16
category: std
ipr: trust200902
workgroup: MPLS Working Group
keyword: Internet-Draft

stand_alone: yes
pi: [toc, sortrefs, symrefs]

normative:
  RFC3032:
  RFC3031:

informative:

author:

 -
    ins: T. Saad
    name: Tarek Saad
    organization: Juniper Networks
    email: tsaad@juniper.net

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

This document contains a specification of the MPLS base YANG data model. The MPLS
base YANG data model serves as a base framework for configuring and managing an MPLS
switching subsystem on an MPLS-enabled router.  It is expected that other MPLS
YANG data models (e.g. MPLS Label Switched Path (LSP) Static, LDP or RSVP-TE YANG
models) will augment the MPLS base YANG data model.

--- middle

# Introduction

A core routing YANG data model is defined in {{!RFC8349}}, and it provides a basis
for the development of routing data models for specific Address Families (AFs).
Specifically, {{!RFC8349}} defines a model for a generic Routing Information
Base (RIB) that is Address-Family (AF) agnostic. {{!RFC8349}} also defines two
instances of RIBs based on the generic RIB model for IPv4 and IPv6 AFs.

The MPLS base model that is defined in this document augments the generic RIB model
defined in {{!RFC8349}} with additional data that enables MPLS
forwarding for the specific destination prefix(es) present in the AF RIB(s) as described in
the MPLS architecture document {{?RFC3031}}. 

The MPLS base model also defines a new instance of the generic RIB YANG data model as
defined in {{!RFC8349}} to store native MPLS routes. The native MPLS RIB
instance stores route(s) that are not associated with other AF instance RIBs
(such as IPv4, or IPv6 instance RIB(s)), but are enabled for MPLS forwarding.
Examples of such native MPLS routes are routes programmed by RSVP on
transit MPLS router(s) along the path of a Label Switched Path (LSP). Other example(s) are
MPLS routes that cross-connect to specific Layer-2 adjacencies, such as Layer-2
Attachment Circuit(s) (ACs)), or Layer-3 adjacencies, such as Segment-Routing
(SR) Adjacency Segments (Adj-SIDs) described in {{!RFC8402}}.

The MPLS base YANG data model serves as a basis for future development of MPLS YANG data
models covering more-sophisticated MPLS feature(s) and sub-system(s). The main
purpose is to provide essential building blocks for other YANG data models involving
different control-plane protocols, and MPLS functions.

To this end, it is expected that the MPLS base data model will be augmented by
a number of other YANG modules developed at IETF (e.g. by TEAS and MPLS working
groups).

The YANG module in this document conforms to the Network Management Datastore
Architecture (NMDA) {{!RFC8342}}.

## Terminology

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

This document describes the 'ietf-mpls' YANG module that provides base components
of the MPLS data model. It is expected that other MPLS YANG modules will
augment 'ietf-mpls' YANG module for other MPLS extension to provision Label Switched Paths (LSPs)
(e.g. MPLS Static, MPLS LDP or MPLS RSVP-TE LSP(s)).

## Model Overview

This document models MPLS labeled routes as an
augmentation of the generic routing RIB data model as defined in {{!RFC8349}}.
For example, IP prefix routes (e.g. routes stored in IPv4 or IPv6 RIBs) are
augmented to carry additional data to enable it for MPLS forwarding.

This document also defines a new instance of the generic RIB defined in
{{!RFC8349}} to store native MPLS route(s) (described further in
{{model-design}}) by extending the identity 'address-family' defined in
{{!RFC8349}} with a new "mpls" identity as suggested in Section 3 of {{!RFC8349}}.

## Model Organization

~~~~~~~~~~~

  Routing          +---------------+    v: import
  YANG module      | ietf-routing  |    o: augment
                   +---------------+
                       o
                       |
                       v
  MPLS base        +-----------+    v: import
  YANG module      | ietf-mpls |    o: augment
                   +-----------+
                      o      o------+
                      |              \
                      v               v
              +-------------------+ +---------------------+
  MPLS Static | ietf-mpls-static@ | | ietf-mpls-ldp.yang@ | . .
  LSP YANG    +-------------------+ +---------------------+
  module
        @: not in this document, shown for illustration only
~~~~~~~~~~~
{: #fig-mpls-relation title="Relationship between MPLS modules"}

The 'ietf-mpls' YANG module defines the following identities:

mpls:

> This identity extends the 'address-family' identity for RIB instance(s) identity as defined in {{!RFC8349}} to represent the native MPLS RIB instance.

label-block-alloc-mode:

> A base YANG identity for supported label block allocation mode(s).

The 'ietf-mpls' YANG module contains the following high-level types and groupings:

mpls-operations-type:

> An enumeration type that represents support for possible MPLS operation types (impose-and-forward, pop-and-forward, pop-impose-and-forward, and pop-and-lookup)


nhlfe-role:

> An enumeration type that represents the role of the NHLFE entry.

nhlfe-single-contents:

> A YANG grouping that describes single Next Hop Label Forwarding Entry (NHLFE) and its associated parameters as described in the MPLS architecture document {{?RFC3031}}. This grouping is
specific to the case when a single next-hop is associated with the route.

The NHLFE is used when forwarding labeled packet.  It contains the following information:

   1. the packet's next hop. For 'nhlfe-single-contents' only a single next hop is expected, while for
      'nhlfe-multiple-contents' multiple next hops are possible.

   2. the operation to perform on the packet's label stack; this can be  one
      of the following operations:
      a) replace the label at the top of the label stack with one or more
         specified new label
      b) pop the label stack
      c) replace the label at the top of the label stack with a
         specified new label, and then push one or more specified new
         labels onto the label stack.
      d) push one or more label(s) on an unlabeled packe

   It may also contain:

      d) the data link encapsulation to use when transmitting the packet

      e) the way to encode the label stack when transmitting the packet

      f) any other information needed in order to properly dispose of
         the packet.


nhlfe-multiple-contents:

> A YANG grouping that describes a set of NHLFE(s) and their associated parameters as described in the MPLS architecture document {{?RFC3031}}. This grouping
is used when multiple next-hops are associated with the route.


interfaces-mpls:

> A YANG grouping that describes the list of MPLS enabled interfaces on a device.

label-blocks:

> A YANG grouping that describes the list of assigned MPLS label blocks and their properties.

rib-mpls-properties:

> A YANG grouping for the augmentation of the generic RIB with MPLS label forwarding data as defined in {{?RFC3031}}.

rib-active-route-mpls-input:

> A YANG grouping for the augmentation to the 'active-route' RPC that is specific to the MPLS RIB instance.

## Model Design {#model-design}

The MPLS routing model is based on the core routing data model defined in {{!RFC8349}}.
{{fig-mpls-rib-relation}} shows the extensions introduced by the MPLS base model on defined RIB(s).

~~~~~~~~~~~
                             +-----------------+
                             | MPLS base model |
                             +-----------------+
                           ____/  |  |_____  |________
                          /       |        \          \
                         /        |         \          \
                        o         o          o          +
                 +---------+  +---------+  +--------+ +-----------+ 
                 | RIB(v4) |  | RIB(v6) |  | RIB(x) | | RIB(mpls) |
                 +---------+  +---------+  +--------+ +-----------+


        +: created by the MPLS base model
        o: augmented by the MPLS base model
~~~~~~~~~~~
{: #fig-mpls-rib-relation title="Relationship between MPLS model and RIB instances"}

As shown in {{fig-mpls-rib-relation}}, the MPLS base YANG data model augments
defined instance(s) of AF RIB(s) with additional data that enables MPLS
forwarding for destination prefix(es) store in such RIB(s). For example, an IPv4 prefix
stored in RIB(v4) is augmented to carry a MPLS local label and per next-hop
remote label(s) to enable MPLS forwarding for such prefix.

The MPLS base model also creates a separate instance of the generic RIB model
defined in {{!RFC8349}} to store MPLS native route(s) that are enabled for MPLS forwarding,
but not stored in other AF RIB(s).

Some examples of such native MPLS routes are:

 - routes programmed by RSVP on Label Switched Router(s) (LSRs) along the path
   of a Label Switched Path (LSP),
 - routes that cross-connect an MPLS local label to a Layer-2, or Layer-3 VRF,
 - routes that cross-connect an MPLS local label to a specific Layer-2
   adjacency or interface, such as  Layer-2 Attachment Circuit(s) (ACs), or
 - routes that cross-connect an MPLS local label to a Layer-3 adjacency or interface -
   such as MPLS Segment-Routing (SR) Adjacency Segments (Adj-SIDs), SR MPLS Binding SIDs,
   etc. as defined in {{!RFC8402}}.


## Model Tree Diagram

The MPLS base tree diagram that follows the notation defined in {{!RFC8340}} is shown in {{fig-mpls-base-tree}}.

~~~~~~~~~~~
{::include ../../te/ietf-mpls.yang.tree}
~~~~~~~~~~~
{: #fig-mpls-base-tree title="MPLS Base tree diagram"}

## Model YANG Module

This section describes the 'ietf-mpls' YANG module that provides base
components of the MPLS data model. Other YANG module(s) may import and augment
the base MPLS module to add feature specific data.

The ietf-mpls YANG module imports the following YANG modules:

- ietf-routing defined in {{!RFC8349}}
- ietf-routing-types defined in {{!RFC8294}}
- ietf-interfaces defined in {{!RFC8343}}

This YANG module also references the following RFCs in defining the types and YANG grouping of the YANG module:
{{!RFC3032}}, {{RFC3031}}, and {{?RFC7424}}.

~~~~~~~~~~
<CODE BEGINS> file "ietf-mpls@2020-10-15.yang"
{::include ../../te/ietf-mpls.yang}
<CODE ENDS>
~~~~~~~~~~
{: #fig-module-mpls-base title="MPLS base YANG module."}

# IANA Considerations

This document registers the following URIs in the 'ns' sub-registry of the IETF XML registry
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
   prefix:     mpls
   // RFC Ed.: replace XXXX with RFC number and remove this note
   reference:  RFCXXXX
~~~

# Security Considerations


The YANG module specified in this document define a schema for data
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

There are a number of data nodes defined in this YANG module that are writable/creatable/deletable (i.e., config true, which is the default). These data nodes may be considered sensitive or vulnerable in some network environments. Write operations (e.g., edit-config) to these data nodes without proper protection can have a negative effect on network operations. These are the subtrees and data nodes and their sensitivity/vulnerability:

"/rt:routing/mpls:mpls/mpls:label-blocks": there are data nodes under this path that are writeable such as 'start-label' and 'end-label'. Write operations to those data npdes may cause disruptive action to existing traffic.

Some of the readable data nodes in these YANG module may be
considered sensitive or vulnerable in some network environments.  It
is thus important to control read access (e.g., via get, get-config,
or notification) to these data nodes.  These are the subtrees and
data nodes and their sensitivity/vulnerability:

"/rt:routing/rt:ribs/rt:rib/rt:routes/rt:route/rt:next-hop/rt:next-hop-options/rt:next-hop-list/rt:next-hop-list/rt:next-hop" and
"/rt:routing/rt:ribs/rt:rib/rt:active-route/rt:output/rt:route/rt:next-hop/rt:next-hop-options/rt:simple-next-hop": these two paths are augmented by additional MPLS leaf(s) defined in this model. Access to this information may disclose the next-hop or path per prefix and/or other information.

Some of the RPC operations in this YANG module may be considered sensitive or vulnerable in some network environments. It is thus important to control access to these operations. These are the operations and their sensitivity/vulnerability:

"/rt:routing/rt:ribs/rt:rib/rt:active-route/rt:input" and "/rt:routing/rt:ribs/rt:rib/rt:active-route/rt:output/rt:route": these two paths are augmented
by additional MPLS data node(s) that are defined in this model. Access to those path(s) may may disclose information about per prefix route and/or other information and that may be further used for further attack(s).

The security considerations spelled out in {{RFC3031}} and {{RFC3032}} apply for this document as well.

# Acknowledgement

The authors would like to thank the members of the multi-vendor YANG design
team that includes the authors, contributors and Xia Chen who were involved in
the definition of this YANG data model.


# Appendix A. Data Tree Instance Example

A simple network setup is shown in {{fig-example}}.  R1 run ISIS routinig
protcol, and learns reachability about IPv4 prefixes: P1:10.10.0.1/32 and P2:
10.10.0.1/32, and IPv6 prefixes P3: 10:10::1/64 and P4: 10:10::1/64. We also
assume that R1 learns about local and remote MPLS label bindings for each
prefix using ISIS (e.g. using Segment-Routing (SR) extensions).


~~~~
State on R1:
============
    IPv4 Prefix    MPLS Label
P1: 10.10.0.1/32   16001
P2: 10.10.0.2/32   16002

    IPv6 Prefix    MPLS Label
P3: 10:10::1/64    16003
P4: 10:10::1/64    16004

RSVP MPLS LSPv4-Tunnel:
 Source: 1.1.1.1
 Destination: 2.2.2.2
 Tunnel-ID:10
 LSP-ID:1
                               50.0.0.1/31
                               50::1/64
                              eth0
                              +---
                             /
                        +-----+
                        | R1  |
                        +-----+
                             \
                              +---
                              eth1
                              50.0.0.2/31
                              50::2/64

~~~~
{:#fig-example title="Example of network configuration."}


The instance data tree could then be as follows:

~~~~
{
    "routing": {
        "ribs": {
            "rib": {
                "RIB-V4": {
                    "name": "RIB-V4",
                    "address-family": "v4ur:ipv4-unicast",
                    "routes": {
                        "route": {
                            "a64dcc40-0e68-11eb-af2e-acde48001122": {
                                "next-hop": {
                                    "outgoing-interface": "eth0",
                                    "mpls-label-stack": {
                                        "entry": {
                                            "1": {
                                                "id": 1,
                                                "label": 16001,
                                                "ttl": 255
                                            }
                                        }
                                    },
                                    "next-hop-address": "50.0.0.1"
                                },
                                "source-protocol": "isis:isis",
                                "mpls-enabled": true,
                                "mpls-local-label": 16001,
                                "destination-prefix": "10.10.0.1/32",
                                "route-context": "SID-IDX:1"
                            },
                            "a6506522-0e68-11eb-af2e-acde48001122": {
                                "next-hop": {
                                    "next-hop-list": {
                                        "next-hop": {
                                            "a65116de-0e68-11eb-af2e-acde48001122": {
                                                "outgoing-interface": "eth0",
                                                "index": "1",
                                                "backup-index": "2",
                                                "role": "primary-and-backup",
                                                "mpls-label-stack": {
                                                    "entry": {
                                                        "1": {
                                                            "id": 1,
                                                            "label": 16002,
                                                            "ttl": 255
                                                        }
                                                    }
                                                },
                                                "address": "50.0.0.1"
                                            },
                                            "a653df72-0e68-11eb-af2e-acde48001122": {
                                                "outgoing-interface": "eth1",
                                                "index": "2",
                                                "backup-index": "1",
                                                "role": "primary-and-backup",
                                                "mpls-label-stack": {
                                                    "entry": {
                                                        "1": {
                                                            "id": 1,
                                                            "label": 16002,
                                                            "ttl": 255
                                                        }
                                                    }
                                                },
                                                "address": "50.0.0.2"
                                            }
                                        }
                                    }
                                },
                                "source-protocol": "isis:isis",
                                "mpls-enabled": true,
                                "mpls-local-label": 16002,
                                "destination-prefix": "10.10.0.2/32",
                                "route-context": "SID-IDX:2"
                            }
                        }
                    }
                },
                "RIB-V6": {
                    "name": "RIB-V6",
                    "address-family": "v6ur:ipv6-unicast",
                    "routes": {
                        "route": {
                            "a64dcc40-0e68-11eb-af2e-acde48001124": {
                                "next-hop": {
                                    "outgoing-interface": "eth0",
                                    "mpls-label-stack": {
                                        "entry": {
                                            "1": {
                                                "id": 1,
                                                "label": 16003,
                                                "ttl": 255
                                            }
                                        }
                                    },
                                    "next-hop-address": "50::1"
                                },
                                "source-protocol": "isis:isis",
                                "mpls-enabled": true,
                                "mpls-local-label": 16003,
                                "destination-prefix": "10:10::1/64",
                                "route-context": "SID-IDX:1"
                            },
                            "a6506522-0e68-11eb-af2e-acde48001124": {
                                "next-hop": {
                                    "next-hop-list": {
                                        "next-hop": {
                                            "a65116de-0e68-11eb-af2e-acde48001123": {
                                                "outgoing-interface": "eth0",
                                                "index": "1",
                                                "backup-index": "2",
                                                "role": "primary-and-backup",
                                                "mpls-label-stack": {
                                                    "entry": {
                                                        "1": {
                                                            "id": 1,
                                                            "label": 16004,
                                                            "ttl": 255
                                                        }
                                                    }
                                                },
                                                "address": "50::1"
                                            },
                                            "a653df72-0e68-11eb-af2e-acde48001123": {
                                                "outgoing-interface": "eth1",
                                                "index": "2",
                                                "backup-index": "1",
                                                "role": "primary-and-backup",
                                                "mpls-label-stack": {
                                                    "entry": {
                                                        "1": {
                                                            "id": 1,
                                                            "label": 16004,
                                                            "ttl": 255
                                                        }
                                                    }
                                                },
                                                "address": "50::2"
                                            }
                                        }
                                    }
                                },
                                "source-protocol": "isis:isis",
                                "mpls-enabled": true,
                                "mpls-local-label": 16004,
                                "destination-prefix": "10:10::2/64",
                                "route-context": "SID-IDX:2"
                            }
                        }
                    }
                },
                "RIB-MPLS": {
                    "name": "RIB-MPLS",
                    "address-family": "mpls:mpls-unicast",
                    "routes": {
                        "route": {
                            "8dd8bc00-0e5a-11eb-946a-acde48001122": {
                                "next-hop": {
                                    "outgoing-interface": "eth0",
                                    "mpls-label-stack": {
                                        "entry": {
                                            "1": {
                                                "id": 1,
                                                "label": 24002,
                                                "ttl": 255
                                            }
                                        }
                                    }
                                },
                                "source-protocol": "rsvp:rsvp",
                                "mpls-enabled": true,
                                "mpls-local-label": 24001,
                                "destination-prefix": "24001",
                                "route-context": "RSVP Src:1.1.1.1,Dst:2.2.2.2,T:10,L:1"
                            }
                        }
                    }
                }
            }
        },
        "mpls": {
            "mpls-label-blocks": {
                "mpls-label-block": {
                    "mpls-srgb-label-block": {
                        "index": "mpls-srgb-label-block",
                        "start-label": 16000,
                        "end-label": 16500,
                        "block-allocation-mode": "mpls:label-block-alloc-mode-manager"
                    }
                }
            },
            "interfaces": {
                "interface": {
                    "eth0": {
                        "name": "eth0",
                        "mpls-enabled": true,
                        "maximum-labeled-packet": 1488
                    },
                    "eth1": {
                        "name": "eth1",
                        "mpls-enabled": true,
                        "maximum-labeled-packet": 1488
                    }
                }
            }
        }
    }
}

~~~~
{: #fib-ribs title="Foo bar."}



# Contributors

~~~~

   Igor Bryskin
   Huawei Technologies
   email: i_bryskin@yahoo.com


   Himanshu Shah
   Ciena
   email: hshah@ciena.com

~~~~
