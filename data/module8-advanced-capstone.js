COURSE.modules.push({
  title: 'Advanced Operations & Capstone',
  icon: '🎓',
  color: '#9050e9',
  summary: 'Security & compliance, rollback, hotfixes & drift, monitoring, AI-assisted DevOps, then a capstone build, demo and teaching plan.',
  days: [
    {
      t: 'DevSecOps & Compliance: Least Privilege, Audit & Segregation of Duties',
      mins: 90, level: 'Advanced', tags: ['security', 'compliance', 'sox', 'audit'],
      obj: ['Harden integration users and pipeline secrets', 'Implement segregation of duties for SOX and ISO audits', 'Produce audit evidence automatically'],
      analogy: { icon: '🏰', text: 'A castle is not protected by one big wall. It has a moat, walls, guards, locked doors and a logbook of who entered. DevSecOps adds those layers to delivery: secret vaults, minimal permissions, required approvals and an automatic logbook of every change.' },
      diagram: `
flowchart TB
  L1["🔑 Secrets in vault, rotated"] --> L2["👤 Integration user: least privilege<br/>per environment"]
  L2 --> L3["🧑‍⚖️ Separation of duties<br/>author ≠ approver ≠ deployer"]
  L3 --> L4["🔍 Automated scans<br/>Code Analyzer, dependency checks"]
  L4 --> L5["📜 Evidence<br/>PR + pipeline + approval logs"]
  L5 --> L6["🕵️ Monitor<br/>Setup Audit Trail, Event Monitoring"]`,
      concepts: [
        ['Integration user', 'Use the Salesforce Integration user licence where appropriate, with a dedicated permission set ("Modify Metadata through Metadata API Functions", "Author Apex" and similar) and no interactive login.'],
        ['Segregation of duties', 'The PR author cannot approve their own PR, approvers are a separate group, and only the pipeline identity can deploy to production. Remove humans\' direct production deploy rights.'],
        ['Evidence pack', 'PR (review), pipeline run (tests and scans), environment approval (who and when) and the release tag. Export these per release.'],
        ['Detect out-of-band changes', 'Monitor Setup Audit Trail for production changes not made by the CI user, and alert on them.']
      ],
      code: [{ title: 'Detect manual prod changes (scheduled job)', src: `
sf data query --target-org acme-prod --json --query "
  SELECT CreatedDate, CreatedBy.Username, Action, Section, Display
  FROM SetupAuditTrail
  WHERE CreatedDate = LAST_N_DAYS:1
    AND CreatedBy.Username != 'ci.user@acme.com.prod'
  ORDER BY CreatedDate DESC" > manual-changes.json
COUNT=$(jq '.result.totalSize' manual-changes.json)
[ "$COUNT" -eq 0 ] || echo "::warning::$COUNT manual production changes detected"` }],
      quiz: [
        ['Which is a segregation-of-duties control?', ['Developers deploy to prod from their laptops', 'PR author cannot approve own PR; only the pipeline deploys', 'Shared admin password', 'Disabling tests'], 1, 'Separate authoring, approval and execution.'],
        ['Which Salesforce object records setup changes?', ['LoginHistory', 'SetupAuditTrail', 'AsyncApexJob', 'EventLogFile only'], 1, 'SetupAuditTrail keeps 180 days of setup changes.']
      ],
      lab: {
        title: 'Audit-ready pipeline',
        goal: 'Harden your pipeline and generate evidence.',
        steps: [
          'Create a permission set <code>CI_Deployer</code> with only the permissions needed to deploy, assign it to the CI user, and remove System Administrator if possible.',
          'Ensure branch protection prevents self-approval (GitHub: require approval from someone other than the last pusher; ADO: "Prohibit the most recent pusher from approving").',
          'Add the Setup Audit Trail check as a nightly scheduled workflow or pipeline.',
          'Make a manual change in acme-prod and confirm that the nightly job flags it.',
          'Write <code>docs/audit-evidence.md</code> explaining where each piece of evidence lives.'
        ],
        verify: 'The nightly job reports your manual change, and the CI user still deploys successfully with reduced permissions.',
        challenge: 'Rotate the JWT certificate with zero downtime (upload a new cert, update the secret, remove the old one).'
      },
      teach: ['Invite someone from InfoSec or Audit as a guest. Learners need to speak their language.']
    },
    {
      t: 'Rollback, Recovery & Feature Flags',
      mins: 90, level: 'Advanced', tags: ['rollback', 'recovery', 'feature-flags', 'backup'],
      obj: ['Choose the right rollback strategy per change type', 'Roll forward with Git revert or roll back to a tag', 'Decouple deploy from release with feature flags'],
      analogy: { icon: '🪂', text: 'Every pilot has a parachute plan before take-off. In Salesforce, "undo" is not one button: code can be reverted, but deleted data or changed field types cannot simply be undone. So you plan the parachute before deploying, and feature flags let you switch off a feature mid-flight without landing.' },
      diagram: `
flowchart TB
  INC["🔥 Prod issue after release"] --> Q{"What broke?"}
  Q -- "Apex / LWC / Flow logic" --> FF["🎚️ Turn off feature flag<br/>(Custom Permission / CMDT)"]
  Q -- "Logic, no flag" --> RV["↩️ git revert → pipeline redeploy<br/>(roll forward)"]
  Q -- "Package" --> PK["🧩 Install previous package version"]
  Q -- "Destructive / data loss" --> BK["💾 Restore from backup<br/>(Backup & Recover / Own / Odaseva)"]
  FF & RV & PK & BK --> PM["📝 Post-mortem, add test"]`,
      concepts: [
        ['Roll forward > roll back', 'Revert the commit and let the same pipeline redeploy. The process stays audited and tested.'],
        ['Tag-based rollback', 'Use sgd between the current tag and the previous release tag to build a "reverse" deployment. Destructive changes and data are the hard parts.'],
        ['Irreversible changes', 'Field deletions, type changes and data transformations. Mitigate them with pre-deploy backups, two-phase changes (deprecate, then delete later) and approvals.'],
        ['Feature flags', 'Custom Permissions or Custom Metadata checked in Apex, Flow and LWC. You can deploy dark and release later by assigning the permission.']
      ],
      code: [{ title: 'Feature flag check (Apex)', src: `
public with sharing class Features {
    public static Boolean isOn(String flag) {
        Feature_Flag__mdt f = Feature_Flag__mdt.getInstance(flag);
        return f != null && f.Enabled__c;
    }
}
// usage
if (Features.isOn('Project_Health_V2')) {
    ProjectHealthV2.calculate(projects);
} else {
    ProjectHealth.calculate(projects);
}` }],
      quiz: [
        ['Fastest safe response to a buggy new feature behind a flag?', ['Full rollback deployment', 'Turn the flag off', 'Delete the org', 'Restore backup'], 1, 'Flags give instant mitigation without a deploy.'],
        ['Which change is hardest to roll back?', ['Apex class edit', 'Deleting a field with data', 'LWC CSS change', 'New list view'], 1, 'The data is gone, so you need a backup to recover it.']
      ],
      lab: {
        title: 'Practise the parachute',
        goal: 'Run two rollback drills.',
        steps: [
          'Create a Custom Metadata Type <code>Feature_Flag__mdt</code> with <code>Enabled__c</code>, plus the Features class above.',
          'Wrap a new ProjectHealthV2 calculation in a flag, deploy it, then turn it off in production by editing the CMDT record. (Discuss: should flag changes also go through the pipeline?)',
          'Drill 2: merge a deliberately buggy change, then fix it by opening a <code>git revert</code> PR and redeploying through the pipeline. Time it.',
          'Write <code>docs/runbooks/rollback.md</code> with a decision tree like the diagram above.'
        ],
        verify: 'Both drills succeed, and you record your time to restore for the DORA scorecard.',
        challenge: 'Script a "reverse delta" between two release tags and validate it against acme-prod.'
      },
      teach: ['Run drills as a timed game. The fastest correct restore wins.']
    },
    {
      t: 'Hotfixes, Release Trains & Environment Drift',
      mins: 90, level: 'Advanced', tags: ['hotfix', 'release-train', 'drift', 'sync'],
      obj: ['Run a hotfix without derailing the release train', 'Detect drift between Git and orgs', 'Plan sandbox refresh and sync cycles'],
      analogy: { icon: '🚆', text: 'The release train leaves on schedule. When an emergency happens, an ambulance (hotfix) takes a separate fast lane to production. Afterwards, the ambulance\'s route is added to the train\'s map (back-merge) so the next train does not undo the fix.' },
      diagram: `
gitGraph
  commit id: "v2026.10"
  branch develop
  checkout develop
  commit id: "feature A"
  commit id: "feature B"
  checkout main
  branch hotfix
  checkout hotfix
  commit id: "fix P1 bug"
  checkout main
  merge hotfix tag: "v2026.10.1"
  checkout develop
  merge main id: "back-merge"
  commit id: "feature C"
  checkout main
  merge develop tag: "v2026.11"`,
      concepts: [
        ['Hotfix lane', 'Branch from main (or the production tag), validate against production with RunSpecifiedTests or RunLocalTests, use an expedited approval, then back-merge into develop and release branches immediately.'],
        ['Drift detection', 'Schedule a nightly full <code>deploy validate</code> of main against production (no changes are saved). Failures or differences reveal drift. You can also retrieve by manifest and run <code>git diff</code>.'],
        ['Refresh cadence', 'Refresh UAT after each release, re-seed data and re-run post-copy scripts. Developer sandboxes are refreshed per sprint or on demand.'],
        ['Release calendar', 'Account for Salesforce\'s seasonal releases (sandbox preview windows). Validate pipelines against preview sandboxes early.']
      ],
      quiz: [
        ['After a hotfix reaches prod, what must happen next?', ['Nothing', 'Back-merge to develop/release branches', 'Delete main', 'Refresh all sandboxes immediately'], 1, 'Otherwise, the next release overwrites the fix.'],
        ['A cheap way to detect drift between main and prod?', ['Manual comparison', 'Scheduled full validation (check-only) of main against prod', 'Change sets', 'Reading debug logs'], 1, 'Validation surfaces differences without changing the org.']
      ],
      lab: {
        title: 'P1 incident hotfix',
        goal: 'Deliver a hotfix while a release is in progress, then detect drift.',
        steps: [
          'While a feature sits in release/*, create <code>hotfix/PROJ-99</code> from main and fix a validation rule message.',
          'Run it through the hotfix path (PR to main with an expedited approval).',
          'Back-merge main into develop and release/*.',
          'Make a manual change in acme-prod (a field help text), then run a full validation or retrieve-and-diff of main to detect it.',
          'Add a nightly drift-detection job to your CI tool of choice.'
        ],
        verify: 'The hotfix is in prod and in develop, and the drift job flags the manual change.',
        challenge: 'Automate the back-merge PR creation after every production hotfix deploy.'
      },
      teach: ['Simulate the incident with urgency: a Slack "P1!" message and a timer on screen.']
    },
    {
      t: 'Monitoring & Observability After Deployment',
      mins: 75, level: 'Advanced', tags: ['monitoring', 'logging', 'smoke-tests', 'dora'],
      obj: ['Add post-deploy smoke tests', 'Centralise Apex error logging', 'Automate DORA metric collection'],
      analogy: { icon: '🩺', text: 'Deployment is the surgery; monitoring is the recovery ward. You check the patient\'s heartbeat right after (smoke tests), keep monitors attached (logging and alerts) and track how quickly patients recover over time (DORA metrics).' },
      diagram: `
flowchart LR
  DEP["🚀 Deploy"] --> SMK["💨 Smoke tests<br/>key Apex tests + UI check"]
  SMK --> LOG["📒 Error logging<br/>Nebula Logger / Platform Events"]
  LOG --> AL["🚨 Alerts → Teams / Slack / PagerDuty"]
  DEP --> MET["📊 DORA metrics<br/>from CI + Git + Boards"]
  AL --> INC["🔥 Incident → MTTR"] --> MET`,
      concepts: [
        ['Smoke tests', 'Run a small, critical test suite right after a deploy (<code>sf apex run test --tests SmokeSuite</code>), plus an optional UI check with Playwright or Copado Robotic Testing.'],
        ['Logging frameworks', 'Open-source Nebula Logger (or a custom Log__c with Platform Events) captures Apex, Flow and LWC errors with context.'],
        ['Platform signals', 'Event Monitoring, Apex exception emails, Flow error emails and Scale Center (for performance) feed your operations view.'],
        ['Automating DORA', 'Deployment frequency and lead time come from pipeline runs and commit dates. Failure rate and MTTR come from incidents linked to releases.']
      ],
      quiz: [
        ['When should smoke tests run?', ['Before writing code', 'Immediately after deployment', 'Once a year', 'Only in scratch orgs'], 1, 'They confirm the system is healthy right after a change.'],
        ['Which open-source tool is popular for Salesforce logging?', ['Nebula Logger', 'Log4Apex Pro', 'sfdx-logger', 'Splunk only'], 0, 'Nebula Logger is widely used and actively maintained.']
      ],
      lab: {
        title: 'Watch the patient',
        goal: 'Add smoke tests and a simple DORA report.',
        steps: [
          'Create an Apex test suite <code>SmokeSuite</code> with 2–3 critical tests.',
          'Add a post-deploy smoke step to both your GHA and ADO production jobs.',
          'Install Nebula Logger in a dev org (optional), log an error from ProjectService, and view it.',
          'Export your pipeline run history (GitHub API or ADO Analytics) and calculate deployment frequency and lead time for the course period.',
          'Update the Day 5 DORA scorecard with real data.'
        ],
        verify: 'Smoke tests run after each prod deploy, and your scorecard shows improvement versus Day 5.',
        challenge: 'Build a small dashboard (Power BI, Looker Studio or a CRM Analytics/Salesforce report) for DORA metrics.'
      },
      teach: ['Ask learners to present their before-and-after DORA numbers. It makes the progress visible.']
    },
    {
      t: 'AI-Assisted DevOps & Deploying AI Metadata',
      mins: 75, level: 'Advanced', tags: ['ai', 'agentforce', 'copilot', 'future'],
      obj: ['Use AI assistants responsibly for Apex, tests and pipeline YAML', 'Add AI-assisted review to PRs', 'Plan DevOps for AI and agent metadata'],
      analogy: { icon: '🧑‍✈️', text: 'AI is a co-pilot, not the pilot. It can read the checklist, suggest a route and spot a warning light. But the licensed pilot (you) still flies the plane, checks its suggestions and is accountable for landing safely.' },
      diagram: `
flowchart LR
  DEV["👩‍💻 Dev + AI assistant<br/>Agentforce for Developers / Copilot / Cursor"] --> CODE["Apex, LWC, tests, YAML drafts"]
  CODE --> PR["🔀 PR"]
  PR --> AIR["🤖 AI review suggestions"]
  PR --> GATES["🛡️ Same gates: scans, tests, human review"]
  AIR & GATES --> MERGE["✅ Merge"]`,
      concepts: [
        ['Good uses', 'Generating test data factories and test cases, explaining legacy Apex, drafting pipeline YAML, writing release notes and summarising failed logs.'],
        ['Guardrails', 'Never paste secrets or customer data into tools that are not approved. Treat AI output as untrusted code: the same scans, tests and reviews apply.'],
        ['AI metadata in DevOps', 'Agent and prompt-related metadata (e.g., prompt templates, agent definitions and their actions) should be source-controlled, reviewed and promoted like any other metadata. Check the Metadata Coverage Report for current support.'],
        ['Testing AI behaviour', 'Plan for testing agent responses in lower environments with representative but masked data before promoting.']
      ],
      quiz: [
        ['Should AI-generated Apex skip code review?', ['Yes, AI is accurate', 'No, the same gates and human review apply'], 1, 'Accountability stays with the team.'],
        ['What must you never paste into an unapproved AI tool?', ['Public docs', 'Secrets, keys and customer data', 'Generic YAML questions', 'Error messages without data'], 1, 'Data protection rules apply to AI tools too.']
      ],
      lab: {
        title: 'Co-pilot, not autopilot',
        goal: 'Use an AI assistant to speed up DevOps work and critically review the result.',
        steps: [
          'Ask your AI assistant to generate an Apex test class for ProjectService with bulk and negative tests.',
          'Run Code Analyzer and the tests. Record what the AI got wrong.',
          'Ask it to convert your GitHub Actions PR validation workflow into Azure Pipelines YAML, then compare the result with your Day 42 version.',
          'Ask it to summarise a failed deploy log from your CI history.',
          'Write team guidelines in <code>docs/ai-usage.md</code>, covering what is allowed, what is forbidden and the review rules.'
        ],
        verify: 'You have a list of AI mistakes you caught, plus the guidelines document.',
        challenge: 'Add an AI review step to PRs using a tool your company approves, and evaluate its signal-to-noise ratio.'
      },
      teach: ['Keep this session balanced. Show impressive wins and also the real failures.']
    },
    {
      t: 'Capstone Build: End-to-End DevOps for "Acme Projects"',
      mins: 240, level: 'Advanced', tags: ['capstone', 'project'],
      obj: ['Apply every module in one realistic project', 'Work as a team with roles', 'Produce a working, documented pipeline in both GitHub Actions and Azure DevOps'],
      analogy: { icon: '🏗️', text: 'You have learned to lay bricks, wire lights and fit pipes. Now your team builds the whole house, from the foundation (repo and environments) to the keys handed to the owner (production release), with an inspector (the trainer) checking it.' },
      diagram: `
flowchart TB
  subgraph TEAM["👥 Team roles"]
    R1["Product owner: Boards backlog"]
    R2["Developers: Apex/LWC + tests"]
    R3["Admin: declarative + DevOps Center"]
    R4["DevOps engineer: pipelines"]
    R5["Release manager: approvals & notes"]
  end
  TEAM --> REPO["🌿 Repo + branching strategy + hygiene"]
  REPO --> CI["🔍 Static + PR validation (GHA & ADO)"]
  CI --> CD["🚀 Multi-env CD, approvals, quick deploy, artifacts"]
  CD --> OPS["🩺 Smoke tests, drift job, rollback runbook, DORA"]`,
      concepts: [
        ['Scope', 'Build a "Project Portfolio" app: Project__c, Milestone__c, a health LWC, an Apex service with 85%+ coverage, a Flow, permission sets and seed data.'],
        ['Required pipeline features', 'Static checks, delta PR validation with test reports, QA → UAT → Prod with approvals, validate + quick deploy, release notes, notifications, a smoke suite and drift detection.'],
        ['Both platforms', 'Implement PR validation in both GitHub Actions and Azure DevOps. Choose one for full CD and justify the choice.'],
        ['Documentation', 'README, branching strategy, pipeline diagram, secrets inventory (names only), runbooks (rollback, hotfix) and audit evidence.']
      ],
      quiz: [
        ['Which artifact proves to auditors what reached prod?', ['Slack message', 'Release tag + pipeline run + approval record', 'Developer\'s memory', 'Sandbox'], 1, 'An immutable, linked trail of evidence.'],
        ['What should the capstone measure at the end?', ['Lines of YAML', 'DORA metrics vs Day 5 baseline', 'Number of branches', 'Number of tools used'], 1, 'Outcomes, not activity.']
      ],
      lab: {
        title: 'Capstone sprint',
        goal: 'Deliver the Project Portfolio app to "production" through your pipelines in one sprint.',
        steps: [
          'Form teams of 3–5 and assign roles (rotate roles if you are working solo).',
          'Create the Boards backlog with at least 6 stories and acceptance criteria.',
          'Set up the repo, branches, protection and CODEOWNERS.',
          'Implement the features with tests, and use delta PR validation on every PR.',
          'Release through QA → UAT → Prod with approval and quick deploy.',
          'Run a hotfix drill and a rollback drill.',
          'Prepare documentation and the final DORA scorecard.'
        ],
        verify: 'Trainer checklist: all required pipeline features demonstrated live, with docs merged to main.',
        challenge: 'Add unlocked packaging or scratch-org CI to the capstone.'
      },
      teach: ['Use 2 sessions if needed. Check in with each team every 45 minutes.', 'Grading rubric: pipeline completeness 40%, quality and tests 20%, documentation 20%, teamwork and demo 20%.']
    },
    {
      t: 'Demo Day, Career Path & Teaching Others',
      mins: 120, level: 'Advanced', tags: ['demo', 'career', 'interview', 'teaching'],
      obj: ['Demo your pipeline to a mixed technical and business audience', 'Prepare for Salesforce DevOps interviews', 'Plan how to teach and roll out DevOps at your company'],
      analogy: { icon: '🎤', text: 'A chef\'s final exam is serving the meal to real guests and explaining it in their language. Today you show your pipeline to people who care about results ("we release weekly with fewer bugs"), not just ingredients ("we use sgd").' },
      diagram: `
flowchart LR
  D1["📊 Day 1 pain points<br/>+ Day 5 DORA baseline"] --> D60["📈 Day 60 results"]
  D60 --> DEMO["🎤 5-min demo<br/>story → prod live"]
  DEMO --> CAREER["🚀 Next steps<br/>certs, portfolio, roll-out plan"]`,
      concepts: [
        ['Demo structure', 'Problem (Day 1 pain points) → live story-to-prod flow → evidence (approvals, tests) → results (DORA before and after) → next steps.'],
        ['Interview topics', 'Branching strategy trade-offs, delta vs full deploys, JWT setup, test levels and quick deploy, destructive changes, profiles vs permission sets, rollback strategy, GHA vs ADO, and Copado vs DevOps Center.'],
        ['Credentials & portfolio', 'Development Lifecycle and Deployment Architect (Salesforce), Copado Fundamentals I and II, GitHub Actions certification, and Microsoft AZ-400. Your public capstone repo is your strongest proof.'],
        ['Teaching & roll-out', 'Start with one team, show quick wins (PR validation), measure, then scale with shared templates. Use this course\'s Trainer mode to run your own cohort.']
      ],
      quiz: [
        ['Best opening for a demo to business stakeholders?', ['YAML walkthrough', 'The problem and the outcome (faster, safer releases)', 'Git internals', 'Agent pool config'], 1, 'Lead with value, then show how it works.'],
        ['A strong portfolio artifact for DevOps roles is…', ['A certificate PDF only', 'A public repo with working pipelines, docs and runbooks', 'A list of tools', 'Screenshots of Setup'], 1, 'Working, documented pipelines speak for themselves.']
      ],
      lab: {
        title: 'Demo, reflect, plan',
        goal: 'Close the course with a demo, a retrospective and a 90-day plan.',
        steps: [
          'Deliver a 5-minute live demo of your capstone.',
          'Revisit your Day 1 pain points. Which ones are solved, and which remain?',
          'Answer 10 mock interview questions with a partner (use the interview topics above).',
          'Write a 90-day roll-out plan for your workplace: pilot team, first pipeline, metrics and training plan.',
          'Optional: run Day 1 of this course for a colleague using Trainer mode.'
        ],
        verify: 'Demo delivered, retrospective written and 90-day plan shared with your manager or mentor.',
        challenge: 'Publish a blog post or LinkedIn article on "What I learned building Salesforce CI/CD in GitHub Actions and Azure DevOps".'
      },
      teach: ['Celebrate. Invite managers to Demo Day.', 'Collect feedback per module to improve the next cohort.']
    }
  ]
});
