# Team workflow

1. Pick an agreed issue from the project. Confirm its priority, dependencies, acceptance criteria, sprint, assignee and story-point estimate.
2. Use a feature branch and link the issue in your pull request. Keep changes small and explain observable behavior.
3. Request review and attach evidence appropriate to the work. Shared-core changes need the cross-company review arrangement agreed in the architecture decision record.
4. Move the project task to In Review while it is reviewed. Close it and mark Done only when its acceptance criteria and agreed Definition of Done are met.

## Acceptance evidence
- Code: relevant automated checks plus manual keyboard/assistive-technology checks, supported-page behavior, restoration/reset and reading position.
- Research: consent-aware, anonymized findings; clearly distinguish assumptions and simulations from observed user experience.
- Planning and documentation: reviewed artifacts, recorded decisions and links to deliverables.
- Always record limitations and unresolved defects. Do not claim universal third-party site accessibility or infer accessibility conformance solely from scanners.

## Privacy and scope
Do not commit secrets, participant identities, diagnoses, interview recordings or private learning materials. Keep AI off by default; send only text the user has explicitly authorized and document actual provider behavior. Use appropriately licensed demo assets.

## Shared decisions
Keep architecture and API changes in short decision records. Confirm Company A agreement rather than treating Company B's proposal as a shared commitment. Record at least one joint integration meeting per sprint.

## Review and release
Use the PR template. Do not mark unchecked tasks complete to satisfy the checklist. The release issue tracks regression evidence, documentation, versioned artifacts and known limitations. Future CI commands must match the actual implementation; this planning-only repository does not yet define a build or test command.
