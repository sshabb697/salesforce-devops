COURSE.modules.push({
  title: 'Copado & Salesforce DevOps Center',
  icon: '🧭',
  color: '#00a1e0',
  summary: 'Click-based, Salesforce-native DevOps: Copado user stories, promotions and quality gates; DevOps Center work items and pipelines; choosing the right tool.',
  days: [
    {
      t: 'Copado Architecture: Credentials, Environments & Pipelines',
      mins: 90, level: 'Intermediate', tags: ['copado', 'pipeline', 'architecture'],
      obj: ['Explain how Copado works on top of Git and Salesforce', 'Configure credentials, environments and a pipeline', 'Map Copado concepts to what you built in Modules 5–6'],
      analogy: { icon: '🚌', text: 'If GitHub Actions and Azure DevOps are like building your own car, Copado is a bus service with fixed routes. You do not build the engine. You decide the stops (environments), the route (pipeline) and who rides (user stories). Copado drives, using Git and the Salesforce APIs under the hood.' },
      diagram: `
flowchart LR
  subgraph COPADO["🧭 Copado (managed package in a Salesforce org)"]
    US["📝 User Stories"] --> PRM["🚚 Promotions"]
    PIPE["🛤️ Pipeline<br/>Dev → QA → UAT → Prod"]
    CRED["🔑 Credentials<br/>one per org"]
  end
  US -- "commit" --> GIT["🌿 Git repo<br/>feature/US-0001 branches"]
  PRM -- "deploy" --> ORGS["☁️ QA / UAT / Prod orgs"]
  PIPE --- PRM
  CRED --- ORGS`,
      concepts: [
        ['Where Copado runs', 'Copado is installed as a managed package in a Salesforce org (often production or a dedicated Copado org), with a backend that runs the Git and deploy jobs.'],
        ['Core records', '<b>Credential</b> (an authenticated org), <b>Environment</b>, <b>Git Repository</b>, <b>Pipeline</b> with Pipeline Connections (source → destination + branch), <b>Project</b>, <b>Release</b> and <b>User Story</b>.'],
        ['Branch model', 'Environment branches (dev, qa, uat, main) plus a feature branch per user story. This is the "environment branches" strategy from Day 10.'],
        ['Concept mapping', 'User story ≈ feature branch + PR · Promotion ≈ merge + deploy job · Quality gate ≈ required status check · Back-promotion ≈ back-merge.']
      ],
      quiz: [
        ['In Copado, what represents an authenticated Salesforce org?', ['Pipeline', 'Credential', 'Release', 'Project'], 1, 'Credentials store the org connection.'],
        ['Copado\'s default branching model is closest to…', ['Trunk-based', 'Environment branches', 'No Git at all', 'Forking'], 1, 'Each environment maps to a long-lived branch.']
      ],
      lab: {
        title: 'Set up a Copado pipeline',
        goal: 'Configure Copado for Acme (use a Copado trial, or follow the instructor demo and document each record).',
        steps: [
          'Create Credentials for Dev, QA (or UAT) and Production orgs.',
          'Connect your Git repository (GitHub or Azure Repos) and create the branches dev, uat and main.',
          'Create a Pipeline with connections Dev → UAT → Production, each mapped to a branch.',
          'Create a Project linked to the Pipeline.',
          'Draw the setup and label each Copado record with its equivalent from GitHub Actions or ADO.'
        ],
        verify: 'The pipeline shows the "Pipeline Manager" view with 3 environments.',
        challenge: 'Find where Copado stores the deployment job logs and compare them with ADO run logs.'
      },
      teach: ['Many enterprise learners use Copado at work. Invite them to share their real pipeline (sanitised).']
    },
    {
      t: 'Copado User Stories, Commits, Promotions & Back-Promotions',
      mins: 120, level: 'Intermediate', tags: ['copado', 'user-story', 'promotion', 'back-promotion'],
      obj: ['Commit metadata to a user story', 'Promote and deploy through environments', 'Back-promote to keep lower environments in sync'],
      analogy: { icon: '📦', text: 'A user story is a labelled parcel. You put your changes in it (commit), the parcel moves from depot to depot (promotion), and a copy is sent back to the earlier depots (back-promotion) so every depot has the same stock.' },
      diagram: `
flowchart LR
  DEV["🧪 Dev org"] -- "1️⃣ Commit changes<br/>to US-0042" --> FB["🌿 feature/US-0042"]
  FB -- "2️⃣ Promote & Deploy" --> UAT["🎭 UAT (uat branch)"]
  UAT -- "3️⃣ Promote & Deploy" --> PROD["🌍 Prod (main)"]
  PROD -. "4️⃣ Back-promote" .-> DEV2["🧪 Other Dev orgs"]`,
      concepts: [
        ['Commit Changes page', 'Select metadata from the org (by type and name, or recently changed), then Copado commits it to the story\'s feature branch.'],
        ['Promotion', 'Groups one or more user stories from a source to a destination environment. Copado merges the branches and deploys.'],
        ['Validation', 'Run "Validate" on a user story or promotion (a check-only deploy) before promoting.'],
        ['Back-promotion', 'Pushes stories that are already in a higher environment down to other environments, which reduces drift and conflicts.']
      ],
      pitfall: 'Committing whole Profiles from the Commit Changes page. Use Copado\'s permission handling features or commit permission sets instead, just as on Day 3.',
      quiz: [
        ['What does a promotion contain?', ['One org credential', 'One or more user stories moving source → destination', 'A Git repo', 'A Copado license'], 1, 'Promotions batch stories for a hop.'],
        ['Why back-promote?', ['To delete stories', 'To keep lower environments in sync and avoid conflicts', 'To skip testing', 'Required by Salesforce'], 1, 'In-sync environments mean fewer surprise conflicts later.']
      ],
      lab: {
        title: 'Ship US-0042 with Copado',
        goal: 'Promote a user story from Dev to Production.',
        steps: [
          'Create user story US-0042, "Add Project Priority picklist", in your Copado project.',
          'Build the field in the Dev org, then use Commit Changes to commit it to the story.',
          'Validate the story against UAT, then promote and deploy it.',
          'Promote from UAT to Production.',
          'Back-promote the story to a second Dev environment (if configured).',
          'Open the Git repo and find the feature branch and merge commits that Copado created.'
        ],
        verify: 'The field is in Production, and Git shows the Copado-created history.',
        challenge: 'Create a deliberate conflict between two stories and use Copado\'s conflict resolution.'
      },
      teach: ['Show the Git history Copado produces, so learners see that no magic is involved. It is the same Git you learned in Module 2.']
    },
    {
      t: 'Copado Quality Gates, Automated Testing & Data Deploy',
      mins: 90, level: 'Advanced', tags: ['copado', 'quality-gates', 'robotic-testing', 'data-deploy'],
      obj: ['Configure quality gates (static analysis, tests, approvals)', 'Understand Copado Robotic Testing and CI integrations', 'Move reference data with Copado Data Deploy'],
      analogy: { icon: '🚧', text: 'Quality gates are toll booths on the bus route. At each booth, the bus must show a valid ticket: tests passed, code scanned, manager approved. No ticket, no passage.' },
      diagram: `
flowchart LR
  US["📝 User Story"] --> G1{"🔍 Static analysis<br/>(PMD / Code Analyzer)"}
  G1 --> G2{"🧪 Apex tests ≥ threshold"}
  G2 --> G3{"🤖 Robotic UI tests"}
  G3 --> G4{"🧑‍⚖️ Approval"}
  G4 --> PROMO["🚚 Promote"]
  DD["🗃️ Data Deploy<br/>reference data templates"] --> PROMO`,
      concepts: [
        ['Quality gate rules', 'Attach checks such as static code analysis, Apex test coverage thresholds, Copado Robotic Testing suites and manual approvals to pipeline stages or actions (commit, promote, deploy).'],
        ['Robotic testing', 'Copado Robotic Testing uses Robot Framework (QWords) to automate UI regression tests, which closes the top layer of the test pyramid.'],
        ['Data deploy', 'Data templates move related records (e.g., CPQ configuration and product catalogue) between orgs, with external ID matching.'],
        ['Extending Copado', 'Copado functions and job templates can call custom scripts (e.g., your sgd or Code Analyzer commands) inside Copado pipelines.']
      ],
      quiz: [
        ['Which layer of the test pyramid does Copado Robotic Testing target?', ['Unit', 'Integration', 'UI / end-to-end', 'None'], 2, 'It automates browser-based UI tests.'],
        ['What is a common Data Deploy use case?', ['Moving Apex', 'Moving CPQ configuration / reference data between orgs', 'Creating scratch orgs', 'Git merges'], 1, 'Config-as-data is a classic Salesforce challenge.']
      ],
      lab: {
        title: 'Gate the UAT → Prod hop',
        goal: 'Add quality gates and a data template.',
        steps: [
          'Add a static analysis gate and an Apex test gate (coverage threshold of 80%) on promotions to Production.',
          'Add a manual approval gate for the Release Manager.',
          'Try to promote a story with a PMD violation and confirm that it is blocked.',
          'Create a Data Deploy template for Account → Project__c reference records.',
          'Deploy the template from UAT to a Dev org.'
        ],
        verify: 'The gate blocks the bad story, and the data template moves related records.',
        challenge: 'Record a simple Robotic Testing script that creates a Project and checks the Health field.'
      },
      teach: ['Ask learners: "Which of these gates did you build yourself in GitHub Actions and ADO?" (All of them.)']
    },
    {
      t: 'Salesforce DevOps Center: Work Items, Pipelines & Promotion',
      mins: 90, level: 'Intermediate', tags: ['devops-center', 'work-items', 'admins'],
      obj: ['Install and configure DevOps Center', 'Track changes with work items', 'Promote through pipeline stages, with bundling'],
      analogy: { icon: '🎛️', text: 'DevOps Center is Salesforce\'s own simple control panel for DevOps. Admins who never use a command line can click "track my changes" and "promote", while Git quietly keeps the history in the background, like a dashcam recording every journey.' },
      diagram: `
flowchart LR
  WI["📝 Work Item WI-000003"] --> DEV["🧪 Dev sandbox<br/>pull changes"]
  DEV -- "commit" --> GH["🐙 GitHub / Bitbucket<br/>feature branch"]
  GH -- "review & merge PR" --> INT["🔗 Integration stage"]
  INT -- "promote" --> UAT["🎭 UAT stage<br/>(bundling)"]
  UAT -- "promote" --> PROD["🌍 Production"]`,
      concepts: [
        ['What it is', 'A free Salesforce app (enabled in Setup and installed as a package) that provides work items, pipelines and source-tracked change capture, using GitHub or Bitbucket as the repo.'],
        ['Work item lifecycle', 'New → In Progress (with a dev environment assigned) → Ready to Promote → Promoted. Changes are captured with source tracking from the developer sandbox.'],
        ['Bundling', 'From a chosen stage onward, work items are versioned together as a bundle. This suits release trains.'],
        ['Coexistence with pro-code', 'Developers can work with the CLI on the same branches. DevOps Center sees those commits, and you can add GitHub Actions checks on its PRs.']
      ],
      quiz: [
        ['Which Git providers does DevOps Center support?', ['Only Azure Repos', 'GitHub and Bitbucket', 'None, it has no Git', 'Only GitLab'], 1, 'GitHub was first, and Bitbucket support followed.'],
        ['What does bundling do?', ['Deletes work items', 'Versions work items together from a stage onward', 'Creates scratch orgs', 'Encrypts metadata'], 1, 'Bundles move together as a versioned set.']
      ],
      lab: {
        title: 'Admin-friendly DevOps',
        goal: 'Deliver a change through DevOps Center the way an admin would.',
        steps: [
          'In production (acme-prod): Setup → DevOps Center → Enable, then install the DevOps Center package and assign permission sets.',
          'Create a DevOps Center project connected to a new GitHub repo.',
          'Create a pipeline: Integration → UAT → Production (using available sandboxes, or Developer orgs as stand-ins where allowed).',
          'Create a work item, make a change in the dev environment by clicks (a list view or layout tweak), pull the changes and commit.',
          'Promote the change through each stage.',
          'Add a GitHub Actions static-check workflow to the DevOps Center repo and watch it run on the DevOps Center PR.'
        ],
        verify: 'The work item shows Promoted to Production, and GitHub shows the PR with your Actions check.',
        challenge: 'Make a CLI commit to a DevOps Center feature branch and see how DevOps Center reflects it.'
      },
      teach: ['Great for mixed classrooms: admins drive, developers observe, then they swap.']
    },
    {
      t: 'Choosing Your Toolchain: Native, Commercial or Custom',
      mins: 75, level: 'Advanced', tags: ['tool-selection', 'architecture', 'strategy'],
      obj: ['Compare change sets, DevOps Center, Copado and other commercial tools, and custom CI/CD', 'Use a weighted decision matrix', 'Design hybrid toolchains'],
      analogy: { icon: '🧰', text: 'Choosing DevOps tools is like choosing transport for a company. You can use public buses (native tools), hire a full-service coach company (commercial platforms like Copado or Gearset) or run your own fleet (custom pipelines). Each is right for some trips, and many companies use a mix.' },
      diagram: `
quadrantChart
  title Control vs Ease of adoption
  x-axis Low ease of adoption --> High ease of adoption
  y-axis Low flexibility --> High flexibility
  quadrant-1 Easy and flexible
  quadrant-2 Powerful, needs skills
  quadrant-3 Limited
  quadrant-4 Easy, opinionated
  Change Sets: [0.75, 0.1]
  DevOps Center: [0.8, 0.35]
  Copado: [0.6, 0.65]
  Gearset: [0.7, 0.6]
  GitHub Actions custom: [0.3, 0.9]
  Azure DevOps custom: [0.25, 0.88]`,
      concepts: [
        ['Native', 'Change sets (simple, no Git) and DevOps Center (free, Git-backed, admin-friendly, fewer advanced features).'],
        ['Commercial', 'Copado, Gearset, Flosum, AutoRABIT, Blue Canvas and others. They are fast to adopt and include compliance features, but cost licences and are opinionated.'],
        ['Custom', 'GitHub Actions or Azure DevOps with the sf CLI. They offer maximum control and low licence cost, but you need DevOps engineers to build and maintain them.'],
        ['Decision criteria', 'Team skills (admin-heavy vs dev-heavy), compliance needs, budget, existing enterprise tooling, scale and release cadence.']
      ],
      quiz: [
        ['An admin-heavy team of 4 with no budget. Best start?', ['Custom ADO with templates', 'DevOps Center', 'Build your own CLI tool', 'Stay on change sets forever'], 1, 'It is free, Git-backed and click-friendly.'],
        ['Main trade-off of custom pipelines?', ['No Git', 'Maximum control but you own the maintenance', 'Cannot run tests', 'Only for packages'], 1, 'Flexibility comes with engineering cost.']
      ],
      lab: {
        title: 'Tool selection recommendation',
        goal: 'Produce a decision matrix and recommendation for two scenarios.',
        steps: [
          'Scenario A: a 4-admin nonprofit with monthly changes. Scenario B: a 60-person bank with SOX compliance and 3 Salesforce orgs.',
          'Create a weighted matrix (criteria × weight × score) for DevOps Center, Copado, a commercial alternative, GitHub Actions and ADO.',
          'Recommend a toolchain for each scenario, including any hybrid (e.g., DevOps Center + GitHub Actions checks).',
          'List the migration steps from change sets to your recommendation.',
          'Module 7 wrap-up: present your recommendation in 5 slides.'
        ],
        verify: 'Both recommendations are justified with scores and risks.',
        challenge: 'Estimate the 3-year total cost of ownership for scenario B.'
      },
      teach: ['Stay vendor-neutral. Learners will work in many different stacks.', 'The quadrant positions are discussion starters, not facts, so ask learners to move them.']
    }
  ]
});
