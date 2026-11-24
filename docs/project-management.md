# Delivery project guide

[Open the project](https://github.com/orgs/CompanyB-AUD/projects/1). The source backlog is [Sprint 1 scope](https://github.com/CompanyB-AUD/IIC-Cog-Plugin/blob/sprint-1/docs/sprint-1/03-mvp-scope-and-epics.md).

## Views
- Delivery board: actionable tasks by workflow status.
- Sprint 2: the initial current-sprint view; update or duplicate it for later sprints.
- MVP backlog: Must tasks.
- Epics: eight parent issues and sub-issue progress.
- Sprint plan: all tasks with sprint and milestone fields.
- Optional features: Should and Could work.

## Fields and labels
Status: Backlog, Ready, In Progress, In Review, Blocked, Done.
Priority: Must, Should, Could. Sprint: Sprint 1–5 or Unscheduled. Workstream: Shared platform, Cognitive, Hearing, Lecturer tools, Quality and delivery.
Estimate is in team-agreed story points and is initially blank. Individual assignees are intentionally unset. The owner:shared label is a responsibility boundary, not confirmation that Company A accepted an assignment.

Epics have no sprint milestone because they span sprints. Task milestones and Sprint fields contain the proposed delivery sprint; when replanning, update both. Could items have no milestone. Use native blocked-by links to inspect prerequisites; the issue body also lists them.

## Status policy
- Backlog: not yet selected or verified ready.
- Ready: acceptance criteria, dependencies, owner and estimate agreed.
- In Progress: work actually started.
- In Review: implementation or artifact awaits review and acceptance evidence.
- Blocked: state the blocker and next action; link the prerequisite issue.
- Done: acceptance and Definition of Done met with evidence.

Project status and issue state should be checked together. Do not assume moving a card closes an issue or that future issues are automatically added to the project. Add new issues to this project when triaging them.

## Sprint evidence
Use each sprint's Scrum issue to link planning, Daily Scrum notes, burndown, joint integration meeting, increment demo, review and retrospective. Use the [evidence template](templates/sprint-evidence.md). Record actual dates and actual work only; for elapsed Sprint 1, link existing evidence and document gaps.

## Initial planning decisions
- #9: scope, priorities, roles and traceability.
- #10: Company A agreement on D1–D12 and the Definition of Done.
- #11: stakeholder research and persona assumptions.
- #49: Sprint 2 planning and evidence.

The repository documents cognitive-first scope with limited hearing support. Any change to cognitive-only scope must be reflected in scope approval, FR08/FR09 handling, priorities and the backlog. Do not silently delete or claim completion of deferred work.
