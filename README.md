# Salesforce DevOps Mastery — 60 Day Interactive Course

Interactive course for Salesforce professionals (~5 years experience). Each of the 60 days has objectives, a plain-English analogy, diagrams/images, concepts + code, a quiz, a lab, and trainer notes.

Progress, quiz answers, lab checkboxes and notes are saved in each student's browser (localStorage).

---

## Share with students (recommended)

Students open a normal browser link — **no install, no `serve.ps1`**.

**Course URL (after Pages is enabled):**  
https://sshabb697.github.io/salesforce-devops/

**Source repo:**  
https://github.com/sshabb697/salesforce-devops

### One-time setup (instructor) — use “Deploy from a branch” (simplest)

Ignore the Actions error `Get Pages site failed … Not Found`. You do **not** need GitHub Actions for this static course.

1. Make the repo **Public**  
   Settings → General → Danger zone → Change visibility → **Public**  
   (Free GitHub accounts cannot publish Pages from a private repo.)
2. Open **Settings → Pages**  
   https://github.com/sshabb697/salesforce-devops/settings/pages
3. Under **Build and deployment**:
   - **Source:** Deploy from a branch  
   - **Branch:** `main`  
   - **Folder:** `/ (root)`  
   - Click **Save**
4. Wait about 1 minute. A green check / “Your site is live” appears on the same Pages settings page.
5. Open and share: **https://sshabb697.github.io/salesforce-devops/**  
   Example lesson link: `https://sshabb697.github.io/salesforce-devops/#day-6`

After each `git push origin main`, the site updates automatically (no Actions required).

### How you present in class

1. Open the Course URL on the projector.
2. Turn on **Trainer mode** (top right) for timings and discussion prompts.
3. Students open the **same URL** on their laptops and follow along (their progress is stored only in their browser).

### Update the course after you edit lessons

```powershell
git add -A
git commit -m "Update course content"
git push origin main
```

GitHub Actions republishes the site automatically. Refresh the Course URL after the workflow is green.

---

## Run locally (optional)

```powershell
powershell -ExecutionPolicy Bypass -File serve.ps1
# If port 8080 is busy:
powershell -ExecutionPolicy Bypass -File serve.ps1 -Port 8088
```

Mermaid diagrams need internet once; images under `assets/images/` work offline.

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

All lesson content lives in `data/*.js`, one file per module. Each day is a plain object (`t`, `obj`, `analogy`, `diagram`, `concepts`, `code`, `quiz`, `lab`, `teach`). Diagrams use [Mermaid](https://mermaid.js.org). Inside code template literals, write GitHub/Azure expressions as `\${{ ... }}`.
