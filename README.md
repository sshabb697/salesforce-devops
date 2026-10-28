# Salesforce DevOps Mastery — 60 Day Interactive Course

An offline-friendly, interactive course for Salesforce professionals with ~5 years of experience. Each of the 60 days has:

- 🎯 Learning objectives
- 💡 A plain-English analogy for non-technical learners
- 🖼️ A visual diagram (flowcharts, sequence diagrams, git graphs)
- 🧠 Key concepts, real-world pitfalls and copy-paste code
- ❓ A quiz with instant feedback
- 🧪 A hands-on lab with a step checklist, a way to verify it and a stretch challenge
- 👩‍🏫 Trainer notes (toggle **Trainer mode**) and a personal notes box

Progress, quiz answers, lab checkboxes and notes are saved in the browser (localStorage).

## Run it

```powershell
powershell -ExecutionPolicy Bypass -File serve.ps1
# If port 8080 is busy:
powershell -ExecutionPolicy Bypass -File serve.ps1 -Port 8088
```

This opens http://localhost:8080 (or the port you chose). Mermaid diagrams need internet once; lesson images under `assets/images/` work offline.

## Syllabus (12 weeks × 5 sessions)

| Week | Days | Module |
|------|------|--------|
| 1 | 1–5 | 🏗️ Foundations: DevOps, environments, metadata, change sets, DORA |
| 2–3 | 6–12 | 🌿 Git: commits, branches, PRs, conflicts, branching strategies, hygiene |
| 3–4 | 13–20 | ⌨️ Salesforce CLI: retrieve/deploy, quick deploy, destructive changes, scratch orgs, JWT, data, tests |
| 5 | 21–26 | 🛡️ Quality: test strategy, Code Analyzer, LWC Jest, hooks, sfdx-git-delta, unlocked packages |
| 6–7 | 27–36 | 🐙 GitHub Actions: PR validation, environments & approvals, quick deploy, reusable workflows, releases |
| 8–10 | 37–48 | 🔷 Azure DevOps: Boards, Repos policies, YAML, secure files, multi-stage CD, templates, artifacts, dashboards |
| 10–11 | 49–53 | 🧭 Copado & DevOps Center, tool selection |
| 11–12 | 54–60 | 🎓 Security, rollback, hotfix & drift, monitoring, AI-assisted DevOps, capstone & demo day |

## Editing content

All lesson content lives in `data/*.js`, one file per module. Each day is a plain object (`t`, `obj`, `analogy`, `diagram`, `concepts`, `code`, `quiz`, `lab`, `teach`), so you can add or reorder days without touching the app code in `assets/app.js`. Diagrams use [Mermaid](https://mermaid.js.org) syntax. Inside code template literals, write GitHub/Azure expressions as `\${{ ... }}`.
