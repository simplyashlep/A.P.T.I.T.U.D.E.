# Aptitudinal Alignment Manual

One manual, compartmentalized. `00-main.tex` is the master document; every
other `NN-*.tex` file is a separately editable compartment that the master
`\input{}`s. Compile the whole thing with `bash build.sh` (run it twice).

| File | Concern |
|------|---------|
| 01-overview | Mission, product language, design principles |
| 02-vocabulary | Canonical vocabulary and dimension symbols |
| 03-evidence-foundation | Shared provenance and evidence model |
| 04-legal-intelligence | The bounded legal-intelligence pipeline |
| 05-alignment-scoring | Scoring flow, universal contract, thresholds, hard floors |
| 06-dimensions | Six dimensions and the metric registry |
| 07-sources-normalization | Credibility hierarchy and normalization bounds |
| 08-governance-reproducibility | Safeguards and audit rules |
| 09-implementation-phases | Build phases and current status |

Terminology is locked: Alignment Score (never "Composite Score"), dimension
scores, Alignment Status, entity, potential profile.
