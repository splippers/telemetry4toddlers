# Telemetry4Toddlers Roadmap

> **The explanation may change. The evidence must not.**

## Vision

Telemetry4Toddlers (T4T) began with a simple idea:

> **Serious telemetry does not need to look serious to be useful.**

Today, T4T is a colourful, deliberately silly network-health dashboard aimed
at Primary School Trainee Techs, junior digital leaders, mentors, and adults
who secretly prefer their infrastructure monitoring with more Comic Sans.

It already works with real network evidence.

The longer-term vision is to grow Telemetry4Toddlers into the first member of
a wider **T4 family**:

```text
                         T4
               TELEMETRY TRANSLATION
                         |
            ┌────────────┼────────────┐
            |            |            |
            v            v            v
         T4Tots        T4Teens     T4Techies
            |            |            |
            v            v            v
        SIMPLE        LEARNING      TECHNICAL
```

All three views describe the same underlying reality.

They differ in:

- vocabulary
- explanation
- visual complexity
- assumed knowledge
- amount of interpretation
- level of raw evidence exposed

They must not differ in the underlying facts.

---

# Core Principle

## One truth, many explanations

A technical observation should have one authoritative underlying value.

For example:

```text
UNDERLYING EVIDENCE

ICMP RTT:
187 ms

Packet loss:
25%

        |
        v
       T4
        |
   ┌────┼────────────┐
   |    |            |
   v    v            v

 T4Tots T4Teens    T4Techies


"Bit    "This       RTT: 187 ms
slow!"  connection  Loss: 25%
        is having   Source: ICMP probe
        trouble."
```

T4 must not manufacture different technical realities for different audiences.

The presentation changes.

The evidence does not.

---

# Current Foundation

Telemetry4Toddlers already has a real technical foundation.

The current implementation includes:

- a MARVIN-facing network-health dashboard
- real `/api/devices` data
- IPv4 neighbour discovery through `ip neigh`
- ICMP ping probes
- response-time measurements
- optional reverse DNS
- optional read-only SNMP information for deliberately configured hosts
- LAN and WLAN presentation
- device tiles
- simplified health tiers
- embedded development API support
- optional standalone API operation
- a deliberately child-friendly visual language

The current application should remain useful independently of the wider T4
architecture.

Do not break the existing colourful dashboard merely to make T4 theoretically
more general.

---

# The T4 Family

The T4 architecture should emerge from the working T4T implementation rather
than replacing it.

The initial family should remain deliberately small.

```text
T4Tots
T4Teens
T4Techies
```

Do not immediately invent an enormous catalogue of audience profiles.

Prove that these three views are useful first.

---

# T4Tots

T4Tots is the natural evolution of the current Telemetry4Toddlers experience.

Its priorities are:

- clear colours
- strong visual cues
- simple language
- short explanations
- obvious cause and effect
- encouragement
- safe escalation
- curiosity

Technical terminology can appear, but it should be introduced rather than
assumed.

Example:

```text
REAL OBSERVATION

Packet loss:
40%


T4Tots

LOST MESSAGES

Some of our messages aren't getting there!

That's not very healthy.
```

The objective is not to hide computing.

It is to give somebody a reason to want to understand it.

---

# T4Teens

T4Teens bridges friendly explanation and real technical terminology.

Instead of replacing technical concepts with metaphors, it begins explicitly
connecting the two.

Example:

```text
Packet loss:
40%

Some network packets are not reaching their destination.

High packet loss can make connections slow, unreliable, or appear broken.
```

T4Teens should increasingly expose:

- real metric names
- units
- protocols
- devices
- networking concepts
- likely relationships between symptoms

The user should be able to graduate naturally from:

```text
LOST MESSAGES
```

to:

```text
PACKET LOSS
```

without encountering an abrupt wall of jargon.

---

# T4Techies

T4Techies presents technical evidence directly.

It can include:

- metric names
- raw values
- units
- timestamps
- source
- probe method
- provenance
- thresholds
- trends
- supporting evidence
- technical interpretation

For example:

```text
Target:
device.example

Probe:
ICMP echo

RTT:
187 ms

Packet loss:
25%

Source:
MARVIN

Interpretation:
Degraded connectivity
```

The technical view should avoid unnecessary cuteness where cuteness interferes
with precision.

It does not need to abandon T4's personality completely.

Nobody said network engineers are allergic to bright colours.

---

# Mentor Mode Becomes T4Techies

The existing idea of a Mentor Mode should evolve into the wider T4Techies
concept.

Instead of maintaining two unrelated UIs:

```text
KID VIEW

and

MENTOR VIEW
```

prefer:

```text
SAME EVIDENCE
     |
     v
    T4
     |
 ┌───┼───────┐
 |   |       |
 v   v       v
Tots Teens Techies
```

A mentor can view the same device and the same observation at greater technical
depth.

This improves teaching because mentor and trainee are discussing the same
thing.

---

# Progressive Reveal

Users should not necessarily have to select one permanent explanation level.

T4 should support progressively revealing more technical detail.

For example:

```text
THIS COMPUTER ISN'T ANSWERING
             |
             v
          WHY?
             |
             v
We sent it a message and did not hear anything back.
             |
             v
     SHOW ME MORE
             |
             v
An ICMP echo request timed out.
             |
             v
   TECHIE DETAILS
             |
             v
Target: ...
Probe: ICMP
Result: timeout
Source: MARVIN
Timestamp: ...
```

This is one of the most important T4 learning mechanisms.

Curiosity should let the user descend naturally into the evidence.

---

# First Roadmap Priority: Separate Evidence From Presentation

The current T4T application already collects and presents real evidence.

The first architectural step should be to make the boundary between those
concerns clearer.

Conceptually:

```text
PROBE
  |
  v
EVIDENCE
  |
  v
NORMALISED OBSERVATION
  |
  v
T4 PRESENTATION
```

The system should avoid burying technical meaning inside UI-specific strings.

For example, prefer an underlying representation resembling:

```json
{
  "metric": "icmp.rtt",
  "value": 187,
  "unit": "ms",
  "source": "icmp"
}
```

with T4Tots separately deciding to render:

```text
HOW FAST DID IT ANSWER?
```

The exact schema should emerge from the existing implementation rather than
being over-designed in advance.

---

# Milestone 1: Observation Model

## Goal

Define the smallest useful machine-readable representation of the evidence T4T
already uses.

Start with existing real data:

- discovered device
- IP address
- neighbour state
- ICMP response
- response time
- packet loss where available
- reverse DNS where available
- SNMP-derived information where available

Avoid adding imaginary future telemetry purely to make the schema look
comprehensive.

## Success criterion

> The current T4T interface can be rendered from structured observations
> without the probe layer needing to understand trainee-facing language.

---

# Milestone 2: Explicit Provenance

Technical evidence should identify where it came from.

For example:

```text
Observation:
Response time

Value:
18 ms

Source:
ICMP probe

Collector:
MARVIN
```

Where available, provenance may include:

- collector
- probe type
- target
- observation time
- source interface
- collection success/failure
- relevant configuration

T4 should make provenance available even if T4Tots normally hides it.

---

# Milestone 3: Translation Layer

Introduce an explicit translation layer between observation and presentation.

Conceptually:

```text
OBSERVATION
    |
    v
   T4
    |
    ├── label
    ├── explanation
    ├── severity wording
    ├── suggested next question
    └── technical detail
```

The first implementation only needs to support metrics that T4T already
understands.

## Success criterion

The same observation can be rendered meaningfully in at least two different
audience profiles.

---

# Milestone 4: T4Tots

Formalise the existing T4T experience as T4Tots.

Preserve its personality.

That includes:

- loud colours
- Comic Sans
- chunky cards
- silly language
- positive reinforcement
- obvious health states
- low cognitive load
- safe escalation

The goal is not to make it corporate.

The crayons stay.

## Quick wins

- [ ] Move trainee wording into explicit T4Tots translations
- [ ] Keep technical metric identifiers underneath
- [ ] Add "Why?" progressive-reveal actions
- [ ] Add "Show me more" explanations
- [ ] Add "Show techie details" for curious users
- [ ] Preserve current dashboard behaviour during refactoring

---

# Milestone 5: T4Techies

Turn the existing Mentor Mode idea into a genuine technical view.

Expose the same devices and observations with increased detail.

Potential content includes:

- raw measurements
- metric identifiers
- protocol/probe information
- timestamps
- evidence source
- thresholds
- SNMP details where available
- diagnostic context
- collection failures

## Success criterion

A trainee and mentor can stand in front of the same dashboard and discuss the
same observation while viewing it at different levels of detail.

---

# Milestone 6: T4Teens

Build the bridge between T4Tots and T4Techies.

T4Teens should introduce real terminology while keeping explanations concise
and approachable.

For example:

```text
T4Tots

LOST MESSAGES


T4Teens

PACKET LOSS

Some packets sent across the network did not arrive.


T4Techies

ICMP packet loss: 25%
```

T4Teens should not simply be T4Tots with Comic Sans removed.

Its role is educational transition.

---

# Milestone 7: Profile Switching

Allow a user to move between explanation levels without changing the
underlying observation.

Potential interaction:

```text
T4Tots
   |
   v
T4Teens
   |
   v
T4Techies
```

and back again.

Switching viewpoint should not trigger a different probe merely because the
user asked for a more detailed explanation.

The evidence remains the same.

---

# Milestone 8: Mixed-Level Collaboration

Different users may eventually view the same evidence through different T4
profiles simultaneously.

Example:

```text
TRAINEE TABLET
T4Tots

MENTOR LAPTOP
T4Techies

WALL DISPLAY
T4Teens

        |
        v
SAME OBSERVATIONS
```

This creates a useful teaching environment.

The mentor can say:

> "See your LOST MESSAGES warning? On my screen that's packet loss."

The trainee learns that the friendly concept and technical concept refer to
the same underlying evidence.

---

# Milestone 9: Wallboard Mode

Expand the existing dashboard towards a live classroom, household, lab, or
club display.

Potential features:

- [ ] WebSocket updates
- [ ] Large-screen layout
- [ ] Device arrival/departure
- [ ] Health changes
- [ ] T4 profile selection
- [ ] Mentor controls
- [ ] Reduced-interaction display mode

The wallboard should remain useful even when nobody is actively operating it.

---

# Milestone 10: Better Network Evidence

Extend collection cautiously.

Potential future evidence sources include:

- richer SNMP information
- interface counters
- jitter
- controller APIs
- additional network-health measurements

Every new source should receive a grown-up risk and privacy review first.

The collection engine should answer:

```text
What are we collecting?

Why?

From which device?

Using which protocol?

Under whose authorisation?

How is it presented?

Who can see it?
```

Do not add telemetry merely because a device exposes it.

---

# Milestone 11: Findings

Observations describe evidence.

Findings describe something worth drawing attention to.

Example:

```text
OBSERVATION

ICMP RTT:
310 ms


FINDING

Network response appears unusually slow.
```

These concepts should remain separate.

A finding should retain the evidence supporting it.

Possible initial finding classes can evolve from actual T4T behaviour.

Do not create a giant speculative diagnostic taxonomy.

---

# Milestone 12: Explanation Confidence

Not all interpretations have equal certainty.

T4 should eventually distinguish:

```text
Fact
Observation
Likely interpretation
Suggestion
Unknown
```

For example:

```text
OBSERVATION

No ICMP reply was received.


BAD EXPLANATION

"This computer is offline."


BETTER EXPLANATION

"We did not receive an ICMP reply.

That can happen when a device is unavailable, but there may be other reasons."
```

T4's job is to make technical information easier to understand.

It should not make uncertainty disappear.

---

# Milestone 13: Questions, Not Just Answers

T4 should encourage investigation.

Useful prompts might include:

```text
Why?

What does that mean?

Is that bad?

What should I check?

Show me the evidence.

Explain the technical term.

Show me the Techie view.
```

The most educational dashboard is one that makes somebody curious enough to
keep digging.

---

# Milestone 14: VNA Integration

T4 should eventually be capable of explaining structured VNA observations and
findings.

The relationship is:

```text
VNA
 |
 | evidence / finding
 v
T4
 |
 ├── T4Tots
 ├── T4Teens
 └── T4Techies
```

VNA owns infrastructure context.

T4 owns audience-appropriate explanation.

Neither should duplicate the other's responsibility.

---

# VNA Example

Underlying VNA finding:

```text
Network interface reports no carrier.
```

Possible T4 presentations:

```text
T4Tots

THE CONNECTION IS BROKEN

This computer can't use this network connection right now.


T4Teens

PHYSICAL NETWORK CONNECTION DOWN

The network interface cannot detect a working physical connection.


T4Techies

Interface state:
No carrier

Finding category:
Physical connectivity

Evidence:
[VNA evidence]
```

The technical truth remains the same.

---

# Milestone 15: OSI-Aware Explanation

VNA's OSI world creates an important use case for T4.

T4 should be able to explain layer-related evidence at appropriate levels.

Example:

```text
T4Tots

"The computers can't talk because their connection is broken."


T4Teens

"Layer 1 is down. The physical connection is not working, so the layers above
it cannot communicate."


T4Techies

"Layer 1 finding: interface reports no carrier.

Higher-layer failures are propagated symptoms rather than independent root
causes."
```

This creates a route towards making OSI terminology ordinary language without
requiring every user to begin with networking jargon.

---

# Milestone 16: SysMedic Integration

SysMedic may eventually provide evidence from running, broken, offline, or
isolated machines.

T4 can explain SysMedic findings without becoming a rescue environment itself.

Conceptually:

```text
SYSMEDIC
    |
    v
STRUCTURED FINDING
    |
    v
T4
    |
    ├── simple explanation
    ├── learner explanation
    └── technical explanation
```

The raw evidence remains available where appropriate.

---

# Milestone 17: Charkive Integration

Charkive provides storage-health, preservation, Data Archaeology, and Temporal
Anomaly findings.

T4 can explain them according to audience.

For example:

```text
T4Tots

"These photos say they're from a different time, but the camera clock might
have been wrong."


T4Teens

"TEMPORAL ANOMALY

The timestamps on these photographs do not match the surrounding evidence.
The device clock may have been incorrect."


T4Techies

"Charkive TA finding.

Recorded timestamps conflict with surrounding modification-history evidence.

Original metadata remains unchanged."
```

Again:

> **Explanation changes. Evidence does not.**

---

# Milestone 18: FileCity Integration

FileCity provides geography.

T4 provides explanation.

A user inspecting a FileCity building might receive:

```text
T4Tots

"This building is getting very full."


T4Teens

"This storage location is almost full and may need attention."


T4Techies

"Storage utilisation: [value]

Source: [evidence]

Finding: [structured FileCity/VNA/Charkive finding]"
```

FileCity does not need to become an educational-language engine.

T4 does not need to become a storage map.

---

# Milestone 19: Oracle Integration

VNA's Oracles can use T4 as an audience adapter.

Conceptually:

```text
EVIDENCE
   |
   v
VNA ORACLE
   |
   v
T4 PROFILE
   |
   v
PLAYER
```

The Oracle may reason about evidence.

T4 determines how the explanation is expressed.

This separation helps avoid creating entirely different AI behaviours for each
age or expertise level.

---

# Oracle Rule

T4 should never become a mechanism for making an uncertain AI answer sound
more certain.

If the Oracle says:

```text
"This may indicate a Layer 1 problem."
```

T4Tots must not translate that into:

```text
"THE CABLE IS DEFINITELY BROKEN!"
```

Meaning must survive translation.

---

# Milestone 20: Generalised Explanation API

Once T4 has proven itself across several real integrations, expose a small
translation interface.

Conceptually:

```text
INPUT

observation / finding
audience profile
context


OUTPUT

label
short explanation
expanded explanation
technical terms
suggested next question
evidence references
```

The exact API should emerge from working implementations.

Do not build a grand translation service before T4Tots, T4Teens, and
T4Techies work against real evidence.

---

# Audience Profiles Are Not Intelligence Levels

T4 must avoid insulting assumptions.

A user selecting T4Tots is not necessarily unintelligent.

They may be:

- young
- unfamiliar with the topic
- tired
- learning
- dyslexic
- overwhelmed
- quickly checking a problem
- simply fond of Comic Sans and unicorns

Likewise, a highly technical user may sometimes want the simplest possible
summary.

Profiles describe the style and depth of explanation requested.

They do not rank the worth of the user.

---

# Language Design

T4 explanations should aim for:

```text
Clear
Short
Accurate
Curious
Friendly
Non-patronising
Explainable
```

Avoid replacing accurate technical terminology with cute phrases permanently.

Instead:

```text
Friendly concept
      |
      v
Real terminology
      |
      v
Technical evidence
```

The user should always have a route downward into the real technical concept.

---

# Visual Design

T4Tots should preserve the existing visual identity.

That means the silly-serious aesthetic remains legitimate product design, not
temporary scaffolding.

Current principles include:

- Comic Sans
- loud primary colours
- chunky tiles
- strong outlines
- exaggerated badges
- playful language
- obvious health states

T4Teens may moderate the style without becoming a corporate dashboard.

T4Techies may prioritise density and precision while retaining enough shared
visual language that all three views still feel like one family.

---

# Accessibility

T4 should not rely on colour alone.

As the visual system evolves, health and status should also be communicated
through combinations of:

- text
- icons
- shape
- position
- labels
- optional sound
- explicit values

The goal is clarity, not merely brightness.

---

# Privacy

T4 can expose information about real devices and networks.

Audience simplification must not accidentally reveal more data than the user
is authorised to see.

A simplified explanation should be capable of working against already
generalised or pseudonymised evidence.

Conceptually:

```text
REAL NETWORK
     |
     v
AUTHORISED / GENERALISED EVIDENCE
     |
     v
T4
     |
     v
AUDIENCE EXPLANATION
```

T4 is an explanation boundary.

It is not an authorisation boundary.

---

# Safety and Escalation

T4T currently uses friendly health tiers.

That idea should remain.

A simplified interface should help inexperienced users know when to stop and
ask somebody with more experience.

For example:

```text
GREEN

Everything looks happy.


AMBER

Something looks a bit odd.

Have another look or ask a Mentor Tech.


RED

This needs attention.

Ask a Mentor Tech before changing things.
```

The exact wording can remain playful.

The safety concept is serious.

---

# Mentor Tech

The Mentor Tech role should remain part of T4T's identity.

A Mentor Tech can:

- inspect deeper evidence
- explain technical concepts
- compare T4 profiles
- guide trainees
- review findings
- prevent unnecessary changes

The goal is not to replace human teaching with automation.

T4 should make human teaching easier.

---

# Scoring and Badges

T4 may eventually support learning progression, but badges should represent
useful understanding or behaviour rather than dashboard clicking.

Possible achievements might recognise:

```text
Correctly identified a device

Explained packet loss

Escalated appropriately

Found the evidence behind a warning

Successfully moved from T4Tots to T4Teens explanation

Helped another trainee understand a finding
```

Do not turn telemetry into meaningless XP grinding.

---

# Relationship With Binary4Babies

T4 and Binary4Babies have related but different jobs.

```text
T4

"What does THIS evidence mean?"


Binary4Babies

"Teach me HOW this concept works."
```

For example:

```text
T4

"This device is losing packets."


Binary4Babies

"What is a packet?"
```

T4 may therefore link to deeper learning material without absorbing the entire
curriculum.

---

# Relationship With BoreDOOM!

BoreDOOM! may reuse the broader principle of audience-appropriate explanation,
but T4 is primarily a technical explanation system.

BoreDOOM! remains the domestic chore game.

VNA is the natural bridge between T4 and technical gameplay.

---

# Non-Goals

T4 should not become:

- the authoritative source of telemetry
- a network-management system
- a replacement for VNA
- a replacement for SysMedic
- a storage-health engine
- a game engine
- a universal AI assistant
- a system that hides raw evidence permanently
- a mechanism for inventing certainty
- a way of talking down to inexperienced users

T4's job is:

> **Make technical evidence understandable without changing what it means.**

---

# Delivery Horizons

## Horizon 1: Separate Evidence From Crayons

- [ ] Define initial observation model
- [ ] Preserve current `/api/devices` behaviour
- [ ] Move trainee wording out of probe logic
- [ ] Add explicit provenance
- [ ] Preserve existing T4T UI
- [ ] Add progressive reveal

### Question

> Can the existing dashboard run from structured evidence while remaining just
> as gloriously silly?

---

## Horizon 2: Establish the Family

- [ ] Formalise T4Tots
- [ ] Build T4Techies / Mentor Mode
- [ ] Build T4Teens
- [ ] Switch explanation profiles
- [ ] Ensure all profiles consume the same evidence

### Question

> Can three very different interfaces describe exactly the same technical
> reality?

---

## Horizon 3: Make T4 Educational

- [ ] Why? interactions
- [ ] Show me more
- [ ] Technical-term reveal
- [ ] Evidence drill-down
- [ ] Mentor workflow
- [ ] Safe escalation
- [ ] Learning-oriented badges

### Question

> Does T4 make users want to understand the technical concept underneath the
> friendly explanation?

---

## Horizon 4: Improve Telemetry

- [ ] Better network observations
- [ ] Richer SNMP evidence
- [ ] Interface counters
- [ ] Jitter where useful
- [ ] Better provenance
- [ ] Live wallboard
- [ ] Evidence history

### Question

> Can T4 describe increasingly rich evidence without becoming confusing?

---

## Horizon 5: Join the Ecosystem

- [ ] VNA finding support
- [ ] OSI-aware explanations
- [ ] SysMedic finding support
- [ ] Charkive finding support
- [ ] FileCity explanation overlays
- [ ] Generalised/pseudonymised inputs

### Question

> Can T4 explain evidence produced by systems other than MARVIN without
> becoming tightly coupled to them?

---

## Horizon 6: Oracle Adapter

- [ ] T4-aware Oracle responses
- [ ] Preserve uncertainty
- [ ] T4Tots Oracle style
- [ ] T4Teens teaching style
- [ ] T4Techies evidence-first style
- [ ] Evidence references

### Question

> Can an AI explanation change depth without changing the meaning of the
> evidence?

---

## Horizon 7: General T4 Interface

- [ ] Stable translation contract
- [ ] Versioned audience profiles
- [ ] External consumers
- [ ] Specialist profile experimentation
- [ ] Documentation for adding new evidence types

Only begin this once the earlier horizons have proven the real requirements.

---

# Quick-Win Sequence

The immediate implementation path should remain small.

## Quick Win 1

Take one existing metric such as ICMP response time.

Represent it as a structured observation.

Render the current T4T wording from that observation.

Nothing should look different to the user.

---

## Quick Win 2

Add a Techie-details reveal beneath that same observation.

```text
HOW FAST DID IT ANSWER?

Pretty quickly!


SHOW TECHIE DETAILS

ICMP RTT: 18 ms
Source: MARVIN
```

One observation.

Two representations.

---

## Quick Win 3

Add T4Teens wording.

```text
T4Tots:
HOW FAST DID IT ANSWER?

T4Teens:
NETWORK RESPONSE TIME

T4Techies:
ICMP RTT
```

This proves the family concept with one real metric.

---

## Quick Win 4

Repeat the model for the other telemetry T4T already understands.

Do not add new telemetry yet.

Prove the architecture using current evidence.

---

## Quick Win 5

Introduce profile switching.

The user can move:

```text
Tots
  |
  v
Teens
  |
  v
Techies
```

without triggering a new observation solely because the profile changed.

---

# First Integration Slice

Once the family works with current network telemetry, consume one external
structured finding.

Prefer something simple and explainable.

Conceptually:

```text
EXTERNAL FINDING
      |
      v
     T4
      |
 ┌────┼─────┐
 v    v     v
Tots Teens Techies
```

This will prove that T4 has become a genuine translation layer rather than
merely three versions of the MARVIN dashboard.

---

# Long-Term Vision

Telemetry4Toddlers begins with a deliberately ridiculous premise:

> **What if network telemetry looked like it had been designed with crayons?**

But beneath the Comic Sans is a serious idea.

Technical systems often communicate through:

```text
numbers
jargon
logs
graphs
codes
acronyms
alerts
```

Those representations are useful to experts.

They are barriers to everyone else.

T4 should not remove the technical truth.

It should build a staircase down to it.

```text
         FRIENDLY
            |
            v
       EXPLAINED
            |
            v
       TECHNICAL
            |
            v
        EVIDENCE
```

A child might begin with:

> **LOST MESSAGES**

Then learn:

> **PACKET LOSS**

Then inspect:

```text
ICMP packet loss:
25%
```

The knowledge is not replaced as the user progresses.

It accumulates.

Eventually T4 can perform the same job across:

- network telemetry
- VNA infrastructure findings
- SysMedic diagnostics
- Charkive storage findings
- FileCity health information
- OSI troubleshooting
- technical Oracles

But the rule never changes:

> **The explanation may change. The evidence must not.**

## North Star

A trainee sees:

> **THIS COMPUTER ISN'T ANSWERING!**

They ask:

> **Why?**

T4 explains:

> We sent it a message and didn't hear anything back.

They ask:

> **What's that called?**

T4 says:

> An ICMP echo request timed out.

They ask:

> **Show me.**

And now they're looking at the real evidence.

At that point, Telemetry4Toddlers has done its job.

The crayons were never there to hide the technology.

They were there to make somebody curious enough to learn it.
