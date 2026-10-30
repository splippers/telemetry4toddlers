# Telemetry4Toddlers

> **Same evidence. Different explanation.**

**Kid-scale network health:** loud colours, **Comic Sans**, and words a
**Primary School Trainee Tech** can shout across the playground.

Telemetry4Toddlers is the original member of the emerging **T4 family**: an
experiment in presenting real technical evidence at different levels of
complexity without changing the underlying truth.

Today, this repository ships a genuinely working MARVIN-facing network
dashboard.

The UI reads:

```text
/api/devices
```

using data gathered from MARVIN's Linux IPv4 neighbour table (`ip neigh`) plus
ICMP ping probes.

Optionally, SNMPv2 read-only credentials can be configured for deliberately
trusted hosts. Devices which authenticate successfully gain **EXTRA SPY
GLASSES**.

The current application is deliberately silly.

The telemetry is not.

---

# The T4 Principle

Technical systems frequently present information in language intended for
specialists.

T4 asks:

> **Can the same evidence be explained appropriately to different people
> without changing what actually happened?**

The core rule is:

> **The explanation may change. The evidence must not.**

Conceptually:

```text
               REAL EVIDENCE
                    |
                    v
                    T4
                    |
       +------------+------------+
       |            |            |
       v            v            v
     T4Tots      T4Teens     T4Techies
       |            |            |
       v            v            v
    Simple        Learning      Technical
   language       language      evidence
```

T4 is therefore not about producing a "child version" of reality.

It is about providing different routes into the same reality.

---

# The T4 Family

The names describe explanation profiles rather than separate truths.

## T4Tots

**Telemetry for beginners.**

T4Tots uses:

- simple language
- strong visual cues
- cause and effect
- friendly metaphors
- minimal jargon
- obvious escalation
- gloriously unnecessary colours

For example:

```text
THIS COMPUTER ISN'T ANSWERING!
```

rather than immediately presenting the player with protocol details.

The aim is understanding, not technical precision theatre.

---

## T4Teens

**Telemetry for learners ready for the real terminology.**

T4Teens begins introducing technical concepts while continuing to explain what
they mean.

For example:

```text
PING IS SLOW

We sent a small network message and the computer took longer than usual to
answer.

Technical name:
ICMP response time
```

T4Teens should bridge friendly explanation and genuine technical vocabulary.

The learner should not remain permanently insulated from the real terminology.

---

## T4Techies

**Telemetry for people who want the technical evidence.**

T4Techies can expose:

- raw measurements
- technical names
- source information
- timestamps
- probe results
- confidence
- diagnostic context
- evidence provenance

For example:

```text
Probe:
ICMP

RTT:
187 ms

Packet loss:
25%

Source:
MARVIN
```

The friendly explanation can remain available.

Technical expertise should unlock detail, not remove clarity.

---

# Progressive Reveal

The T4 family should not become three isolated interfaces.

A user should be able to drill down.

For example:

```text
T4Tots

THIS COMPUTER ISN'T ANSWERING!
        |
        v
WHY?
        |
        v
"We sent it a message but didn't hear anything back."
        |
        v
SHOW ME MORE
        |
        v
T4Teens
        |
        v
"This is an ICMP probe."
        |
        v
SHOW ME THE TECHIE STUFF
        |
        v
T4Techies
        |
        v
Raw evidence
```

This is important.

T4 should help people progress from:

> **I understand the symptom.**

to:

> **I understand the concept.**

to:

> **I can inspect the evidence myself.**

---

# One Truth, Multiple Explanations

A T4 profile must never silently alter the underlying technical state.

For example:

```text
UNDERLYING OBSERVATION

ICMP RTT:
187 ms

Packet loss:
25%
```

might be presented as:

```text
T4Tots

THE MESSAGES ARE HAVING A HARD TIME!

Some are taking ages.
Some aren't getting back at all.
```

or:

```text
T4Teens

NETWORK RESPONSE IS POOR

The device is answering slowly and some test messages are being lost.

ICMP response:
187 ms

Packet loss:
25%
```

or:

```text
T4Techies

ICMP RTT:
187 ms

Packet loss:
25%

[technical evidence]
```

Different language.

Same observation.

---

# Who Is This For?

Today, Telemetry4Toddlers is aimed at:

- **Junior digital leaders** practising the idea that devices on a LAN/WLAN
  communicate with each other
- learners who benefit from immediate visual feedback
- mentors teaching basic network-health concepts
- adults who secretly prefer dashboards that smell like crayons
- technically experienced people who would quite like the computer to explain
  itself clearly for once

Longer term, the wider T4 family should allow the same technical source to
serve users with very different levels of knowledge.

---

# Current Implementation

Today, T4T gathers network information from MARVIN.

The API implementation in:

```text
server/lanScan.mjs
```

gathers:

- IP and MAC information from the IPv4 neighbour table
- neighbour state from `ip -4 neigh show dev <iface>`
- ICMP RTT using `ping -c 1 -W 1`
- optional reverse DNS PTR information
- optional SNMP system information for configured hosts

The dashboard consumes this information through:

```text
/api/devices
```

This current MARVIN network dashboard is the first working T4 implementation.

The larger T4 family architecture is a product direction rather than a claim
that all profiles already exist.

---

# The Vibe

## Visual Language

Telemetry4Toddlers should remain unmistakably Telemetry4Toddlers.

### Font

```text
Comic Sans MS
```

with friendly fallbacks.

Non-negotiable silly-serious readability.

### Palette

Chunky primary and confectionery-adjacent colours:

- hot pink
- lime citrus
- lemonade yellow
- electric aqua
- lavender grape

### Layout

Postcard-sized tiles with:

- thick ink outlines
- double drop-shadows
- slight rotation
- absolutely no desire to look like a financial-services dashboard

### LAN vs WLAN

Possible visual language includes:

- rainbow-blue borders for tethered dinosaurs
- lime-wave badges for airborne unicorns

Technical information should remain discoverable beneath the silliness.

---

# Current Concepts and Microcopy

Adults might expect tables of network measurements.

T4Tots uses approachable language.

| Technical concept | Trainee wording |
| --- | --- |
| ICMP RTT | **HOW FAST DID IT ANSWER?** |
| Packet loss | **LOST MESSAGES** |
| Signal/link quality | **RAINBOW WI-FI / WIRE POWERS LEVEL** |

The long-term architecture should allow these labels to coexist with the
technical terminology rather than permanently replacing it.

---

# Current Health Tiers

## Green

Feeling:

```text
teddy-bear hugs
```

The system appears happy.

Celebrate appropriately.

Confetti punctuation is encouraged.

---

## Amber

Feeling:

```text
meh yoghurt
```

Something deserves attention.

The interface can suggest sensible investigation or asking a more experienced
person for help.

---

## Red

Feeling:

```text
sirens-but-safe
```

Something looks significantly wrong.

Escalation may be appropriate.

Red should communicate importance without making a learner believe the
computer is about to explode.

Unless another system has actual evidence that it is about to explode.

---

# Mentor Mode Becomes T4Techies

The existing idea of a **Mentor Mode** that reveals raw graphs naturally
becomes part of the wider T4 architecture.

Rather than:

```text
Kid view
   |
   v
Mentor view
```

the longer-term model becomes:

```text
                 SAME EVIDENCE
                      |
                      v
                     T4
                      |
        +-------------+-------------+
        |             |             |
        v             v             v
      T4Tots        T4Teens      T4Techies
```

Mentors can still use technical views while learners retain the friendly
presentation.

The important architectural change is that both interfaces consume the same
evidence.

---

# BIG RE-SCAN

The **BIG RE-SCAN** button remains.

It politely re-queries the LAN.

It should continue to do so with appropriate Comic Sans fireworks.

There are serious architectural limits to how much dignity this project should
be allowed to acquire.

---

# LAN Scout

## What MARVIN Does Today

The LAN scout gathers:

```text
IP addresses
MAC addresses
Neighbour state
ICMP response time
Optional reverse DNS
Optional SNMP information
```

Neighbour data comes from:

```bash
ip -4 neigh show dev <iface>
```

ICMP probing uses:

```bash
ping -c 1 -W 1
```

with capped concurrency bursts.

Optional SNMP information can include:

```text
sysName
sysUpTime
sysDescr
```

for configured hosts.

---

# EXTRA SPY GLASSES

SNMP uses read-only credentials deliberately supplied for trusted devices.

Hosts which successfully authenticate can receive:

> **EXTRA SPY GLASSES**

This is a visual indication that additional information is available.

Do not commit SNMP credentials to Git.

Use:

```text
server/auth-devices.json
```

created from:

```text
server/auth-devices.example.json
```

or provide configuration through:

```text
T4T_AUTH_DEVICES
```

---

# SNMP on the Fleet

T4T polls SNMP only where an appropriate host answers on UDP/161 and
credentials have been configured.

Existing supporting material includes:

```text
docs/SNMP_EVERYWHERE.md

scripts/install-snmp-agent-debian.sh
scripts/install-snmp-agent-redhat.sh
scripts/fleet-install-snmp.sh
```

These tools remain part of the current MARVIN network-monitoring
implementation.

---

# Environment Variables

| Variable | Meaning |
| --- | --- |
| `T4T_LAN_IFACE` | NIC name such as `enp2s0` if MARVIN cannot infer the default route |
| `T4T_AUTH_FILE` | Alternate JSON path describing SNMP secrets |
| `T4T_AUTH_DEVICES` | Inline JSON overriding the secrets file |
| `T4T_API_HOST` | Standalone `npm run dev:api` bind address |
| `T4T_API_PORT` | Standalone scout TCP port |
| `VITE_ALLOWED_HOSTS` | Additional hostnames allowed by the Vite UI |

---

# Embedded Mode

The normal development mode keeps the API embedded.

```bash
npm run dev
```

and:

```bash
npm run preview
```

use:

```text
server/vitePluginApi.mjs
```

to answer:

```text
GET /api/*
```

in-process.

This allows DAD to load:

```text
http://marvin:5173/
```

while:

```javascript
fetch("/api/devices")
```

works without requiring a separate proxy or second terminal.

---

# Standalone Mode

A standalone scout remains available.

```bash
npm run dev:api
```

or:

```bash
node server/index.mjs
```

can expose the scout separately when split-process or service-style operation
is useful.

The relevant controls are:

```text
T4T_API_HOST
T4T_API_PORT
```

---

# Preview and Static Builds

Build with:

```bash
npm run build
```

Preview with:

```bash
npm run preview
```

The preview server retains the embedded LAN scout.

`preview:live` remains an alias of `preview`.

---

# Develop

```bash
npm install
npm run dev
npm run dev:api
npm run build
npm run preview
npm run preview:live
```

Typical roles:

```text
npm run dev

Vite development server
+
embedded /api


npm run dev:api

optional standalone API


npm run build

build dist/


npm run preview

serve built application
+
embedded /api
```

---

# Vite Host Checks

The UI permits:

```text
marvin
localhost
```

Additional names can be provided through a comma-separated:

```text
VITE_ALLOWED_HOSTS
```

For example:

```bash
export VITE_ALLOWED_HOSTS=marvin,mybox
npm run dev
```

---

# Privacy

T4 should collect only what it needs for the explanation being offered.

The current LAN scout can obtain identifying information such as:

- IP addresses
- MAC addresses
- reverse DNS information
- SNMP-provided descriptions

That information can be useful locally, but it should not automatically become
appropriate for every future consumer.

The wider T4 architecture should support the principle:

> **Explain what matters without exposing what doesn't.**

This becomes particularly important when T4 eventually consumes generalised
VNA information.

---

# Evidence Provenance

As T4 expands, explanations should retain a route back to their source
evidence.

Conceptually:

```text
FRIENDLY EXPLANATION
        |
        v
TECHNICAL CONCEPT
        |
        v
OBSERVATION
        |
        v
SOURCE
```

For example:

```text
"THIS COMPUTER ISN'T ANSWERING!"
        |
        v
No ICMP response
        |
        v
Probe result
        |
        v
MARVIN LAN scout
```

A friendly interface should make evidence easier to understand.

It should not cut the evidence loose from its source.

---

# T4 as an Explanation Layer

Long term, T4 should not be tied exclusively to the MARVIN LAN scout.

The existing scout is the first evidence source.

Future evidence might come from other systems.

Conceptually:

```text
MARVIN
   |
   +------------------+
                      |
SysMedic              |
   |                  |
   +----------+       |
              |       |
Charkive      |       |
   |          |       |
   +------> EVIDENCE
              |
              v
              T4
              |
      +-------+-------+
      |       |       |
      v       v       v
    Tots    Teens   Techies
```

This is a long-term architecture.

The current application remains useful without any of those integrations.

---

# Relationship With VNA

Virtual Network Admin may eventually become a major consumer and provider of
T4-compatible information.

The intended relationship is:

```text
VNA
 |
 | observation / finding
 v
T4
 |
 | audience-appropriate explanation
 v
PLAYER
```

VNA owns infrastructure context.

T4 owns explanation.

T4 should not need to become an infrastructure management system.

Likewise, VNA should not need to maintain separate wording for every audience
it supports.

---

# VNA Example

Underlying VNA finding:

```text
Layer:
1

Observation:
Network interface reports no carrier.
```

T4 might provide:

```text
T4Tots

THE CONNECTION IS BROKEN!

These computers can't talk right now.


T4Teens

THE PHYSICAL NETWORK CONNECTION IS DOWN

The computer cannot currently detect a working network link.

This is a Layer 1 problem.


T4Techies

Layer:
1 / Physical

Interface state:
No carrier

[underlying observation and provenance]
```

The fault did not change.

Only its explanation changed.

---

# Relationship With SysMedic

SysMedic gathers diagnostic evidence from real computers.

T4 may eventually explain SysMedic findings in audience-appropriate language.

For example:

```text
SYSMEDIC FINDING
      |
      v
      T4
      |
  +---+---------+
  |             |
  v             v
Learner       Engineer
```

SysMedic remains responsible for evidence collection and diagnosis.

T4 remains responsible for explanation.

---

# Relationship With Charkive

Charkive produces storage-health, preservation, sanitation, and archaeological
findings.

T4 may eventually explain those findings.

For example:

```text
Charkive TA finding
        |
        v
        T4
```

could become:

```text
T4Tots

"These photographs say they're from one time, but the camera's clock might
have been wrong."


T4Teens

"These timestamps don't match the surrounding files. The source device may
have had an incorrect clock."


T4Techies

TEMPORAL ANOMALY

[recorded timestamps]
[inferred period]
[evidence]
[confidence]
[provenance]
```

T4 does not rewrite Charkive's evidence or conclusions.

---

# Relationship With FileCity

FileCity can use T4 explanations when a user investigates storage objects or
incidents.

A user might encounter:

```text
Storage building
      |
      v
Warning
      |
      v
"Explain this"
      |
      v
T4 explanation
```

FileCity owns the geography.

T4 owns the explanation.

---

# Relationship With BoreDOOM!

BoreDOOM! remains fundamentally a domestic chore game.

It shares the general principle that different players may need different
levels of explanation.

VNA is the more natural integration point between T4 and technical gameplay.

T4 does not need to become a game system itself.

---

# Future Evidence Sources

Potential future evidence sources include:

```text
Network telemetry
SysMedic findings
VNA findings
Charkive findings
FileCity events
Operating-system telemetry
Vendor equipment
Synthetic training scenarios
```

Each source should remain identifiable.

T4 must distinguish between:

```text
Real observation
Captured historical evidence
Machine inference
Synthetic training data
```

Friendly wording must never blur those distinctions.

---

# Future Homework

## Better Network Evidence

Potential engineering work includes:

1. SNMP walks beyond current `sys*` OIDs
2. Interface counters
3. Jitter
4. Additional network-health measurements
5. Controller or infrastructure APIs after appropriate risk review
6. Better evidence provenance

---

## Live Displays

Explore a WebSocket-based carnival board for wall displays.

Still Comic Sans.

Obviously.

---

## T4Tots

Formalise the existing Telemetry4Toddlers presentation as the first T4 profile.

The current application is effectively the prototype.

---

## T4Teens

Introduce an intermediate explanation profile.

Goals include:

- genuine terminology
- plain-English definitions
- cause-and-effect explanations
- progressive reveal
- easy movement between friendly and technical views

---

## T4Techies

Evolve the current Mentor Mode concept into a proper technical profile.

Potential goals include:

- raw measurements
- graphs
- observation provenance
- technical names
- timestamps
- underlying findings
- confidence where relevant
- source evidence

---

# Non-Goals

T4 should not become:

- a second VNA
- a second SysMedic
- a network-control system
- a storage manager
- an autonomous remediation tool
- a source of invented telemetry
- a system that hides evidence behind cute wording

Its job is:

> **Explain technical reality at the right level without changing the
> technical reality.**

---

# Philosophy

Telemetry is spooky when jargon hides behind glass.

But removing jargon entirely can be just as limiting.

T4 should create a path between the two.

A beginner can start with:

> **THE WIFI IS SAD.**

Then ask:

> **Why?**

Then discover:

> The signal appears weak.

Then:

> **What's that called?**

Then learn:

> Signal strength.

Then:

> **Show me the actual numbers.**

And eventually inspect the technical evidence themselves.

The interface has not dumbed the information down.

It has built a staircase up to it.

Keep the scary words available.

Explain them when they become useful.

Respect attention spans measured in raisins.

Keep badges earned.

Use glitter where operationally appropriate.

And regardless of audience:

> **Same evidence. Different explanation.**
> 
