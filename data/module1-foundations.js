COURSE.modules.push({
  title: 'Foundations of Salesforce DevOps',
  icon: '🏗️',
  color: '#0b5cab',
  summary: 'Why DevOps matters for Salesforce, environments, metadata, change sets and how to measure delivery.',
  days: [
    {
      t: 'Welcome: What DevOps Really Means for Salesforce',
      mins: 75, level: 'Beginner', tags: ['devops', 'culture', 'intro'],
      obj: [
        'Explain DevOps in one sentence to a non-technical stakeholder',
        'Describe the Salesforce release lifecycle from idea to production',
        'Identify the most common release pain points in Salesforce teams'
      ],
      analogy: { icon: '🍕', text: 'Think of a pizza restaurant. Without DevOps, each chef makes pizzas their own way, and the manager checks every pizza by hand before it leaves. Some arrive burnt, some late. With DevOps, there is one shared recipe book (Git), a conveyor oven that cooks every pizza the same way (the pipeline), and a quality check at each station (automated tests). The pizzas come out faster, more consistently, and with fewer complaints.' },
      diagramTitle: 'The DevOps infinity loop',
      diagram: `
flowchart LR
  P["📝 Plan<br/>User stories"] --> C["💻 Code<br/>Build in sandbox"]
  C --> B["📦 Build<br/>Commit to Git"]
  B --> T["🧪 Test<br/>Apex & validation"]
  T --> R["🏷️ Release<br/>Approve"]
  R --> D["🚀 Deploy<br/>Production"]
  D --> O["⚙️ Operate<br/>Users work"]
  O --> M["📊 Monitor<br/>Feedback"]
  M --> P`,
      diagramCaption: 'DevOps is a continuous loop, not a one-time project.',
      concepts: [
        ['DevOps = Culture + Process + Tools', 'Tools (Git, CI) are only one third. Without shared ownership and agreed process, tools just automate chaos.'],
        ['Why Salesforce is different', 'Much of the "code" is configuration built with clicks. Admins and developers share the same orgs, and some metadata is not deployable. Production also enforces 75% Apex test coverage.'],
        ['Source of truth', 'In mature teams, <b>Git</b>, not an org, is the source of truth. The org is the result of deploying what is in Git.'],
        ['Your 60-day journey', 'Foundations → Git → Salesforce CLI → Quality gates → GitHub Actions → Azure DevOps → Copado & DevOps Center → Advanced topics & capstone.']
      ],
      pitfall: 'Buying a DevOps tool before agreeing on a branching strategy and environment plan. The tool will encode whatever mess already exists.',
      quiz: [
        ['Which is the BEST definition of DevOps?', ['A tool you install', 'A culture and set of practices that use automation to deliver change quickly and safely', 'A job title for release managers', 'Another name for change sets'], 1, 'DevOps is about people, process and tools working together. Tools alone are not DevOps.'],
        ['In a mature Salesforce DevOps setup, what is the source of truth?', ['The production org', 'The developer\'s sandbox', 'The Git repository', 'An Excel tracker'], 2, 'Git holds the versioned, reviewable history. Orgs are deployment targets.']
      ],
      lab: {
        title: 'Map your current release process',
        goal: 'Create a "current state" map of how changes reach production today (at your job or a fictional company).',
        steps: [
          'List every environment you use (Dev sandboxes, QA, UAT, Prod).',
          'Draw arrows showing how a change moves between them and what tool is used (change set, manual, ANT, Copado…).',
          'Mark each manual step with a 🖐️ and each step that has failed in the past with a 🔥.',
          'Write down the average time from "story done" to "in production".',
          'List your top 3 release pain points. You will revisit them on Day 60.'
        ],
        verify: 'You have a one-page diagram (paper, draw.io or Miro) and a list of 3 pain points.',
        challenge: 'Interview a business user: what is the cost to them of a failed or delayed release?'
      },
      teach: [
        '⏱️ 10 min icebreaker: "Tell us about your worst deployment night."',
        'Draw the infinity loop on the whiteboard and ask learners to place their current tools on it.',
        'Set expectations: 60 sessions of about 90 minutes each, with a lab every day. Labs are where the learning happens.',
        'Discussion prompt: "If Git were the source of truth, what would change for your admins?"'
      ]
    },
    {
      t: 'Salesforce Environments & Sandbox Strategy',
      mins: 90, level: 'Beginner', tags: ['sandbox', 'environments', 'scratch-org'],
      obj: [
        'Compare Developer, Developer Pro, Partial Copy and Full sandboxes',
        'Design an environment strategy for a team of 10',
        'Understand where scratch orgs fit'
      ],
      analogy: { icon: '🎭', text: 'A theatre company does not rehearse on opening night. Actors practise alone (Developer sandbox), then rehearse scenes together (Integration/QA), then hold a dress rehearsal with costumes and lights (UAT/Full sandbox), and only then perform for the audience (Production). Each stage catches different problems.' },
      diagram: `
flowchart LR
  subgraph DEV["Developer stage"]
    D1["👩‍💻 Dev Sandbox A"]
    D2["👨‍💻 Dev Sandbox B"]
    S1["🧪 Scratch Orgs"]
  end
  D1 --> INT["🔗 Integration / QA<br/>Developer Pro"]
  D2 --> INT
  S1 --> INT
  INT --> UAT["🎭 UAT<br/>Partial Copy"]
  UAT --> STG["🏁 Staging<br/>Full Sandbox"]
  STG --> PROD["🌍 Production"]
  PROD -. "hotfix path" .-> HF["🚑 Hotfix Sandbox"]
  HF -.-> PROD`,
      concepts: [
        ['Sandbox types', '<b>Developer</b>: metadata only, 200 MB, refresh daily. <b>Developer Pro</b>: 1 GB, refresh daily. <b>Partial Copy</b>: sample data via a template, refresh every 5 days. <b>Full</b>: full data copy, refresh every 29 days.'],
        ['Scratch orgs', 'Disposable orgs (1–30 days) created from a JSON definition. They are ideal for source-driven and package development and for CI test runs.'],
        ['Environment drift', 'Over time, sandboxes diverge from production because of hotfixes and direct changes. A good strategy plans refreshes and back-promotions.'],
        ['Sandbox naming & post-copy', 'Use short, consistent names (e.g., <code>qa</code>, <code>uat</code>) because they become part of usernames. Use a SandboxPostCopy Apex class to mask data and reset settings automatically.']
      ],
      code: [{ title: 'SandboxPostCopy example (Apex)', src: `
global class PrepareSandbox implements SandboxPostCopy {
    global void runApexClass(SandboxContext ctx) {
        // Mask emails so sandboxes never email real customers
        List<Contact> cs = [SELECT Id, Email FROM Contact WHERE Email != null LIMIT 10000];
        for (Contact c : cs) { c.Email = c.Email + '.invalid'; }
        update cs;
    }
}` }],
      pitfall: 'Testing integrations in a Full sandbox that still points at production endpoints. Always reset Named Credentials after a refresh.',
      quiz: [
        ['Which sandbox type contains a full copy of production data?', ['Developer', 'Developer Pro', 'Partial Copy', 'Full'], 3, 'Only Full sandboxes copy all data. Partial Copy uses a sandbox template with a sample of records.'],
        ['What is the main advantage of scratch orgs in CI?', ['They hold production data', 'They are disposable and created from config, so every run starts clean', 'They never expire', 'They skip Apex tests'], 1, 'Scratch orgs give repeatable, clean environments created from source.']
      ],
      lab: {
        title: 'Design an environment strategy',
        goal: 'Design and document an environment plan for "Acme Corp": 6 developers, 2 admins, 1 QA team, monthly releases and occasional hotfixes.',
        steps: [
          'Choose the sandbox type for each stage and justify the choice (cost, data and refresh interval).',
          'Define a refresh calendar (e.g., UAT is refreshed after every release).',
          'Define a hotfix path that does not disturb the next release.',
          'In your Developer org, go to Setup → Sandboxes and note which types your edition allows.',
          'Write a SandboxPostCopy class idea list: what should be masked or reset after a refresh?'
        ],
        verify: 'You have a diagram like the one above, customised for Acme, plus a refresh calendar.',
        challenge: 'Estimate how many days per year Acme loses to sandbox drift and propose a fix.'
      },
      teach: [
        'Show the sandbox limits table from Salesforce Help live, because limits change by edition.',
        'Ask: "Who has had a sandbox email real customers?" Then explain why post-copy scripts matter.',
        'Pair exercise: each pair designs a strategy, then pairs swap and critique each other\'s design.'
      ]
    },
    {
      t: 'Metadata Deep Dive: What Actually Gets Deployed',
      mins: 90, level: 'Intermediate', tags: ['metadata', 'source-format', 'mdapi'],
      obj: [
        'Distinguish metadata from data',
        'Compare Metadata API format and source (decomposed) format',
        'Know which components are not supported by the Metadata API'
      ],
      analogy: { icon: '🏠', text: 'Metadata is the blueprint of a house: rooms, doors and wiring. Data is the furniture and the people living there. When you deploy, you send the blueprint changes (add a room), not the furniture. Some things, like the exact paint colour a tenant chose, are not on the blueprint at all. In Salesforce, those are the "unsupported" metadata items that you change by hand.' },
      diagram: `
flowchart TB
  ORG["☁️ Salesforce Org"] --> MD["📐 Metadata<br/>Objects, Fields, Flows,<br/>Apex, LWC, Profiles"]
  ORG --> DATA["🗃️ Data<br/>Accounts, Contacts,<br/>Custom records"]
  MD --> API["Metadata API<br/>retrieve / deploy"]
  API --> SRC["📁 Source format<br/>force-app/main/default/..."]
  API --> MDF["📦 MDAPI format<br/>package.xml + one big file per object"]
  DATA --> DAPI["Data API / Bulk API<br/>sf data import / export"]`,
      concepts: [
        ['Source format (DX)', 'Large files are decomposed. For example, <code>Account.object</code> becomes a folder with one file per field (<code>fields/Rating__c.field-meta.xml</code>). This makes Git diffs and merges much easier.'],
        ['Metadata API format', 'The classic format with <code>package.xml</code> and one XML file per object. It is used by ANT and change sets and is still the deployment payload under the hood.'],
        ['Unsupported metadata', 'Some settings cannot be deployed (check the Metadata Coverage Report). Keep a <b>manual steps runbook</b> for them.'],
        ['Profiles vs Permission Sets', 'Profiles deploy only the parts relevant to the components in the package, which causes surprises. Modern practice: minimal profiles, with access granted through permission sets and permission set groups.']
      ],
      code: [{ title: 'Source format folder layout', src: `
force-app/main/default/
├── classes/
│   ├── AccountService.cls
│   └── AccountService.cls-meta.xml
├── objects/
│   └── Account/
│       ├── fields/Rating__c.field-meta.xml
│       └── listViews/MyAccounts.listView-meta.xml
├── flows/Lead_Assignment.flow-meta.xml
├── lwc/accountCard/
└── permissionsets/Sales_User.permissionset-meta.xml` }],
      pitfall: 'Committing whole Profiles retrieved from production. They contain thousands of lines and cause endless merge conflicts. Prefer permission sets.',
      quiz: [
        ['Why is source format better for Git?', ['It is smaller', 'It decomposes big files so diffs and merges are per component', 'It includes data', 'It skips tests'], 1, 'One file per field or list view means two people editing different fields will not conflict.'],
        ['Where do you check if a component type can be deployed?', ['Trailhead', 'Metadata Coverage Report', 'Setup Audit Trail', 'Debug logs'], 1, 'The Metadata Coverage Report lists support per channel (Metadata API, unlocked packages and more).']
      ],
      lab: {
        title: 'Explore metadata in your org',
        goal: 'Create a few components by clicks and see how they look as metadata files.',
        steps: [
          'In your Dev org, create a custom object <code>Project__c</code> with fields <code>Status__c</code> (picklist) and <code>Budget__c</code> (currency).',
          'Create a permission set <code>Project_User</code> that grants access to the object and fields.',
          'Open Workbench (workbench.developerforce.com) → Info → Metadata Types & Components, and browse <code>CustomObject</code>.',
          'Open the Metadata Coverage Report and find two metadata types that are <b>not</b> supported by the Metadata API.',
          'Start a "Manual Steps Runbook" document that lists those types.'
        ],
        verify: 'You can find Project__c in Workbench metadata, and your runbook has at least 2 entries.',
        challenge: 'Find out what happens when you deploy a Profile that references a field not in the package.'
      },
      teach: [
        'Use the house blueprint analogy, then show a real field-meta.xml so learners see that "clicks become XML".',
        'Demo the difference between a Profile and a Permission Set file size.',
        'Keep the Project__c object, because it is reused in later labs.'
      ]
    },
    {
      t: 'Change Sets, Their Limits & the Case for Source-Driven Development',
      mins: 75, level: 'Beginner', tags: ['change-sets', 'org-based', 'source-driven'],
      obj: [
        'Deploy using an outbound and an inbound change set',
        'List the limitations of org-based development',
        'Explain the source-driven development model'
      ],
      analogy: { icon: '📮', text: 'A change set is like posting a parcel by hand. You pack each item yourself, write the address, walk to the post office and hope nothing is missing. If it gets lost, there is no tracking number and no copy. Source-driven development is like a warehouse with barcodes: every item is scanned, tracked and packed the same way by machines, and you can always resend an exact copy.' },
      diagram: `
flowchart LR
  subgraph OLD["😓 Org-based (change sets)"]
    A1["Sandbox"] -- "manual pick list" --> A2["Outbound change set"] -- "upload" --> A3["Prod: inbound, deploy by hand"]
  end
  subgraph NEW["😎 Source-driven"]
    B1["Sandbox / Scratch"] -- "sf retrieve" --> B2["Git repo"] -- "PR + review" --> B3["CI pipeline"] -- "sf deploy" --> B4["Prod"]
  end`,
      concepts: [
        ['Change set limits', 'No version history, no deletions (destructive changes), they only work between connected orgs, components are picked manually, rollback is hard, and they cannot be automated.'],
        ['Org-based development', 'The org is the source of truth. It is fine for small admin teams, but it breaks down with parallel work.'],
        ['Source-driven development', 'Git is the source of truth. Every change is reviewed in a PR, validated automatically and deployed by a pipeline.'],
        ['Migration path', 'Change sets → Salesforce CLI with a manifest → Git with manual deploys → CI validation on PR → full CI/CD. Each step adds value on its own.']
      ],
      quiz: [
        ['Which is NOT possible with change sets?', ['Deploying Apex classes', 'Running tests on deploy', 'Deleting components', 'Deploying custom fields'], 2, 'Change sets cannot delete components. That needs destructiveChanges.xml through the Metadata API or CLI.'],
        ['What is a key benefit of source-driven development?', ['No tests needed', 'Full history, review and repeatable automated deploys', 'Works without Git', 'Deploys data automatically'], 1, 'Versioned source plus automation gives traceability and repeatability.']
      ],
      lab: {
        title: 'Feel the pain: a change set deployment',
        goal: 'Use a change set to move Project__c between two connected orgs (use a sandbox if your org allows it; otherwise follow the walkthrough and document it).',
        steps: [
          'In the source org: Setup → Outbound Change Sets → New → add Project__c, its fields and the Project_User permission set.',
          'Click "View/Add Dependencies" and note what you would have missed.',
          'Upload to the target org (Deployment Settings must allow the inbound connection).',
          'In the target org: validate first, then deploy. Time the whole process.',
          'Now try to <b>delete</b> the Budget__c field through a change set and note why it fails.'
        ],
        verify: 'You recorded the number of clicks and minutes. Keep these numbers, because you will compare them with a CLI deploy on Day 16.',
        challenge: 'List 5 metadata changes from your real projects that would have been painful with change sets.'
      },
      teach: [
        'Do not bash change sets. They are fine for small orgs. The goal is to show when you outgrow them.',
        'Time the class doing the lab, and write the average on the board for comparison on Day 16.'
      ]
    },
    {
      t: 'Measuring DevOps: ALM, Release Management & DORA Metrics',
      mins: 90, level: 'Intermediate', tags: ['dora', 'alm', 'metrics', 'release'],
      obj: [
        'Explain the Salesforce Application Lifecycle Management (ALM) stages',
        'Define and calculate the four DORA metrics',
        'Create a DevOps maturity baseline for your team'
      ],
      analogy: { icon: '🏃', text: 'You cannot get fitter if you never time your run. DORA metrics are a stopwatch and health check for software teams. They measure how often you ship, how long a change takes to reach users, how often releases break, and how fast you recover when they do.' },
      diagram: `
flowchart TB
  subgraph SPEED["⚡ Speed"]
    DF["Deployment Frequency<br/>How often do we release?"]
    LT["Lead Time for Changes<br/>Commit → Production"]
  end
  subgraph STAB["🛡️ Stability"]
    CFR["Change Failure Rate<br/>% of releases causing issues"]
    MTTR["Time to Restore<br/>How fast we recover"]
  end
  SPEED --- STAB`,
      concepts: [
        ['ALM stages', 'Plan → Develop → Test → Build → Release → Monitor. Salesforce\'s own ALM guide maps these to org types and tools.'],
        ['Release cadence models', '<b>Release train</b>: fixed dates, bundled features. <b>Continuous</b>: ship each story when ready. Most enterprises run a train with a hotfix lane.'],
        ['DORA elite benchmarks', 'Elite teams deploy on demand (many times a day), have lead time under a day, change failure rate of 0–15%, and restore service in under an hour.'],
        ['Release management roles', 'Release manager, approvers and CAB (Change Advisory Board). Automation should make CAB approvals faster and evidence-based, not remove governance.']
      ],
      quiz: [
        ['Which DORA metric measures stability?', ['Deployment frequency', 'Lead time', 'Change failure rate', 'Story points'], 2, 'Change failure rate and time to restore measure stability. The other two measure speed.'],
        ['Lead time for changes is measured from…', ['Idea to design', 'Commit to running in production', 'Sprint start to sprint end', 'Bug report to fix'], 1, 'DORA defines lead time as code committed to code running in production.']
      ],
      lab: {
        title: 'Baseline your DORA metrics',
        goal: 'Build a simple DORA scorecard for your team (or Acme Corp) to track throughout the course.',
        steps: [
          'Create a spreadsheet with columns: Release date, # stories, commit date of oldest story, failed? (Y/N), time to fix.',
          'Fill in the last 5 releases (use real or realistic data).',
          'Calculate deployment frequency (releases per month) and average lead time.',
          'Calculate change failure rate = failed releases ÷ total releases.',
          'Rate your team as Low, Medium, High or Elite for each metric.',
          'Write one improvement goal for each metric that you expect this course to help with.'
        ],
        verify: 'Your scorecard shows all four metrics and a maturity level.',
        challenge: 'Propose how you would collect these metrics automatically from Git and the CI tool.'
      },
      teach: [
        'Module 1 wrap-up: run a 10-minute recap quiz in Kahoot or Mentimeter.',
        'Ask each learner to share their baseline. Keep it anonymous if people are sensitive about it.',
        'Preview Module 2: "Tomorrow we put everything into Git."'
      ]
    }
  ]
});
