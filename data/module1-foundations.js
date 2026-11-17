COURSE.modules.push({
  title: 'Foundations of Salesforce DevOps',
  icon: '🏗️',
  color: '#0b5cab',
  summary: 'What Salesforce is (for everyone), real use cases, core building blocks, then why DevOps, environments, metadata, change sets and delivery metrics.',
  days: [
    {
      t: 'What is Salesforce? (for everyone)',
      mins: 75, level: 'Beginner', tags: ['salesforce', 'crm', 'intro', 'non-it'],
      obj: [
        'Explain Salesforce in one plain sentence to a non-IT colleague',
        'Describe what a CRM does using an everyday analogy',
        'Name the main "clouds" and what job each helps with'
      ],
      analogy: { icon: '📒', text: 'Imagine every salesperson keeps customer notes in a different notebook, every support agent uses a different spreadsheet, and marketing has its own email list. Nobody sees the full story of a customer. Salesforce is the shared digital notebook in the cloud: one place where the company remembers who the customer is, what they bought, what they asked for help with, and what happens next.' },
      diagramTitle: 'Picture — Salesforce as the company customer hub',
      diagram: `
flowchart TB
  subgraph PEOPLE["👥 People who use it"]
    S["Sales reps"]
    SV["Support agents"]
    M["Marketing"]
    MGR["Managers"]
  end
  HUB["☁️ Salesforce<br/>Shared customer hub"]
  S --> HUB
  SV --> HUB
  M --> HUB
  MGR --> HUB
  HUB --> OUT["One clear picture:<br/>who the customer is · deals · tickets · emails · next steps"]`,
      diagramCaption: 'Salesforce is not "only for IT". It is the shared workplace system for customer work.',
      images: [
        {
          title: 'Classroom poster — What is Salesforce?',
          text: 'Start here if you are new. Salesforce sits in the middle as the <b>customer hub</b>. The surrounding boxes are everyday business jobs — not programming languages.',
          src: 'assets/images/what-is-salesforce.jpg',
          alt: 'Infographic showing Salesforce as a customer hub with Sales Service Marketing Commerce Analytics and Apps',
          caption: 'If you remember only one thing today: Salesforce = shared cloud toolbox for knowing customers and running work.'
        },
        {
          title: 'Sharp SVG poster (projector / print)',
          text: 'Same idea as a clean classroom poster — useful on a big screen.',
          src: 'assets/images/salesforce-hub.svg',
          alt: 'SVG poster: Salesforce customer hub with six surrounding use areas',
          caption: 'Sales · Service · Marketing · Commerce · Analytics · Apps & automation'
        }
      ],
      diagrams: [
        {
          title: 'Graph — Where companies typically start',
          caption: 'Most teams begin with Sales or Service, then grow into other clouds. Exact mix varies by industry.',
          src: `
pie showData
  title Typical first Salesforce focus (illustrative)
  "Sales / pipeline" : 40
  "Service / cases" : 25
  "Marketing" : 15
  "Custom apps / ops" : 12
  "Commerce / other" : 8`
        }
      ],
      walkthrough: [
        {
          title: 'Say it in one sentence',
          text: 'Practice aloud: <b>"Salesforce is a cloud system where our company keeps customer information and the work we do with them — sales, support, marketing and more."</b>',
          tip: 'Avoid jargon on day one: skip "metadata", "org", "Apex" until the next lessons.'
        },
        {
          title: 'CRM in plain English',
          text: '<b>CRM</b> = Customer Relationship Management. It means: remember the relationship, not just the last email.',
          diagram: `
flowchart LR
  B4["Before CRM<br/>scattered notes"] --> AFTER["With CRM<br/>one shared timeline"]
  AFTER --> W["Who is the customer?"]
  AFTER --> H["What happened?"]
  AFTER --> N["What is next?"]`
        },
        {
          title: 'Cloud = rented software, not weather',
          text: 'You log in with a browser. Salesforce hosts the app. Your company does not install a giant program on every laptop.',
          diagram: `
flowchart LR
  U["👤 You<br/>browser / phone"] --> SF["☁️ Salesforce cloud"]
  SF --> D["Your company's data<br/>& configuration"]`
        }
      ],
      concepts: [
        ['Salesforce in one line', 'A <b>cloud CRM and app platform</b> where companies manage customers, deals, service cases and custom business processes.'],
        ['CRM', 'Customer Relationship Management — a shared system of record for people, companies and interactions.'],
        ['Cloud (business meaning)', 'Software you use over the internet. Updates and hosting are handled by the vendor (Salesforce).'],
        ['Multi-cloud product family', 'Sales Cloud, Service Cloud, Marketing Cloud, Commerce Cloud, Experience Cloud, Analytics / Tableau, plus custom apps built on the platform.'],
        ['Why this course starts here', 'You cannot automate "releases" until everyone shares the same picture of what Salesforce <b>is</b> and what a change means for users.']
      ],
      pitfall: 'Calling Salesforce "just a database" or "just for sales". It is a full business platform — sales is only the most famous starting point.',
      quiz: [
        ['Which sentence best describes Salesforce for a non-IT person?', ['A programming language', 'A shared cloud system for customer work and company processes', 'Only an email tool', 'A local Excel file'], 1, 'Salesforce is a cloud CRM/platform — shared by many teams, accessed in a browser.'],
        ['What does CRM stand for?', ['Computer Resource Module', 'Customer Relationship Management', 'Code Release Manager', 'Cloud Remote Machine'], 1, 'CRM = Customer Relationship Management.']
      ],
      lab: {
        title: 'Explain Salesforce to a non-IT friend',
        goal: 'Write a 5-sentence "elevator explanation" a business manager would understand.',
        steps: [
          'Write one sentence: what Salesforce is (no jargon).',
          'Write one sentence: what problem it solves (scattered customer info).',
          'List 3 teams in a company that might use it (e.g., Sales, Support, Finance ops).',
          'Draw a simple hub-and-spoke sketch (paper or Miro) like the poster above.',
          'Read your explanation to a colleague who is not in IT and note which words they found confusing.'
        ],
        verify: 'You have a 5-sentence explanation plus a simple sketch, and at least one piece of feedback from a non-IT person.',
        challenge: 'Rewrite the same explanation for a CEO in under 30 seconds (about 70 words).'
      },
      teach: [
        'Start with the shared-notebook analogy before any Salesforce UI demo.',
        'Show the hub poster full-screen; ask learners which spoke matches their job.',
        'Optional live demo: open a Trailhead Playground and click around Accounts/Contacts only — no Setup yet.',
        'Discussion: "Where does customer truth live in YOUR company today — Salesforce, Excel, email, or someone\'s head?"'
      ]
    },
    {
      t: 'Salesforce Use Cases — Everyday Business Stories',
      mins: 90, level: 'Beginner', tags: ['use-cases', 'sales', 'service', 'marketing', 'non-it'],
      obj: [
        'Map six common Salesforce use cases to real business outcomes',
        'Match a business request to the right "cloud" or capability',
        'Explain why every use case still needs careful change delivery (DevOps later)'
      ],
      analogy: { icon: '🏪', text: 'Think of a busy shopping mall. One building, many shops: a clothing store, a help desk, a café, a cinema. Salesforce is the mall. Sales Cloud is one shop, Service Cloud another, Marketing another. Customers (your company\'s users) walk between shops — but they are still in the same mall, with the same customer ID on their loyalty card.' },
      diagramTitle: 'Picture — One platform, many jobs',
      diagram: `
flowchart TB
  SF["☁️ Salesforce Platform"]
  SF --> SALES["🛒 Sales<br/>Leads → Opportunities → Closed Won"]
  SF --> SVC["🎧 Service<br/>Cases → SLAs → Happy customer"]
  SF --> MKT["📣 Marketing<br/>Campaigns → Engagement"]
  SF --> COM["🛍️ Commerce<br/>Catalog → Cart → Order"]
  SF --> AN["📊 Analytics<br/>Dashboards & insights"]
  SF --> APP["🧩 Custom apps<br/>HR, Inventory, Partners…"]`,
      diagramCaption: 'Your company may use one shop or many. DevOps is how changes to any shop reach production safely.',
      images: [
        {
          title: 'Illustrated use-case board',
          text: 'Six everyday stories. Read the labels first — this is business language, not IT slang.',
          src: 'assets/images/salesforce-use-cases.jpg',
          alt: 'Infographic of six Salesforce use cases: sales service marketing commerce analytics custom apps',
          caption: 'If you can tell these stories, you already understand why Salesforce matters to the business.'
        },
        {
          title: 'SVG classroom cards',
          text: 'Printable / projector version with a short example under each use case.',
          src: 'assets/images/salesforce-use-cases.svg',
          alt: 'Six Salesforce use-case cards in plain English',
          caption: 'Pick one card that matches your company and keep it for the lab.'
        }
      ],
      diagrams: [
        {
          title: 'Graph — Example weekly work mix in a mid-size org',
          caption: 'Illustrative only: service tickets and sales updates often dominate daily clicks; analytics and custom apps spike around releases.',
          src: `
xychart-beta
  title "Example: relative weekly activity by area"
  x-axis ["Sales", "Service", "Marketing", "Commerce", "Analytics", "Custom apps"]
  y-axis "Relative activity" 0 --> 100
  bar [85, 90, 45, 30, 40, 55]`
        },
        {
          title: 'Story map — Lead becomes a customer, then a case',
          caption: 'One customer journey can touch several clouds. That is why shared data and careful deployments matter.',
          src: `
flowchart LR
  L["🆕 Lead<br/>website form"] --> C["👤 Contact<br/>+ Account"]
  C --> O["💰 Opportunity<br/>proposal"]
  O --> W["✅ Closed Won"]
  W --> ORD["📦 Order"]
  ORD --> CASE["🎫 Case<br/>'Where is my order?'"]`
        }
      ],
      walkthrough: [
        {
          title: 'Sales story',
          text: 'A rep logs a Lead, converts it to Account + Contact + Opportunity, moves stages, and closes the deal. Managers watch a pipeline dashboard.',
          tip: 'Key objects you will hear forever: <b>Account, Contact, Opportunity, Lead</b>.'
        },
        {
          title: 'Service story',
          text: 'A customer emails "I cannot log in." That becomes a <b>Case</b>, gets an owner, priority and SLA clock. Agents work the Case until Closed.',
          diagram: `
flowchart LR
  E["📧 Email / chat"] --> CS["🎫 Case created"]
  CS --> OWN["👤 Assigned"]
  OWN --> FIX["🔧 Work + updates"]
  FIX --> CL["✅ Closed"]`
        },
        {
          title: 'Custom app story',
          text: 'Not everything is "sales". Companies build Project trackers, partner portals, or inventory apps with objects + Flows — still Salesforce.',
          warn: 'Custom apps are where DevOps pain often starts: many admins clicking in production without a release process.'
        }
      ],
      concepts: [
        ['Sales Cloud', 'Pipeline and customer accounts — Leads, Opportunities, Quotes, forecasts.'],
        ['Service Cloud', 'Cases, queues, knowledge articles, omni-channel support.'],
        ['Marketing / Commerce / Experience', 'Campaigns and journeys; online stores; portals and communities for customers or partners.'],
        ['Analytics', 'Reports, dashboards, CRM Analytics / Tableau — turn records into decisions.'],
        ['AppExchange & custom apps', 'Ready-made apps from partners, or your own objects/Flows/Apex/LWC for unique processes.'],
        ['Why DevOps cares', 'Every use case above is built from <b>metadata</b> (fields, flows, layouts…). Changing them without a process risks breaking live customer work.']
      ],
      pitfall: 'Buying five clouds and enabling everything on day one. Start with one clear business outcome, then expand.',
      quiz: [
        ['A support ticket that tracks "customer cannot log in" is usually a…', ['Opportunity', 'Lead', 'Case', 'Campaign'], 2, 'Cases track service issues. Opportunities track sales deals.'],
        ['Why do Salesforce use cases matter for DevOps?', ['They do not', 'Because changes to those processes are configuration/code that must reach production safely', 'Because DevOps only means writing Apex', 'Because marketing emails need Git'], 1, 'Use cases are powered by metadata and apps — DevOps is how those changes are delivered safely.']
      ],
      lab: {
        title: 'Map three use cases for your company',
        goal: 'Connect Salesforce capabilities to real outcomes in your workplace (or a fictional company).',
        steps: [
          'Pick a company (yours or fictional): industry, size, main customers.',
          'Choose 3 use cases from the poster (e.g., Sales, Service, Custom app).',
          'For each: write the business goal in one sentence, the main users, and 2–3 key records they care about.',
          'Circle which use case would hurt most if a bad release broke it on Monday morning.',
          'Share with a partner: can they understand your map without IT jargon?'
        ],
        verify: 'A one-page use-case map with 3 stories and one "highest risk if broken" highlight.',
        challenge: 'Add a fourth use case that would need a custom object (not a standard Sales/Service object).'
      },
      teach: [
        'Have learners stand by the poster area that matches their job — instant icebreaker.',
        'Use the lead→case journey diagram to show cross-cloud data sharing.',
        'Collect "Monday morning risk" answers on the whiteboard; revisit when you introduce pipelines.'
      ]
    },
    {
      t: 'Basic Concepts You Need Before Salesforce DevOps',
      mins: 90, level: 'Beginner', tags: ['concepts', 'metadata', 'objects', 'org', 'non-it'],
      obj: [
        'Explain Org, Object, Field and Record with a filing-cabinet analogy',
        'Tell the difference between metadata (blueprint) and data (content)',
        'Name who builds with clicks vs code, and why that matters for releases'
      ],
      analogy: { icon: '🗄️', text: 'Picture an office building (the Org). Inside are filing cabinets (Objects like Account or Case). Each cabinet has blank forms with labeled blanks (Fields like Name, Amount, Status). Filled-in forms are Records (Acme Corp, Case #1024). The blank form design is the blueprint (metadata). The filled-in answers are the content (data). DevOps mostly moves blueprints between buildings — carefully — so live paperwork keeps working.' },
      diagramTitle: 'Picture — Nested building blocks',
      diagram: `
flowchart TB
  ORG["🏢 Org<br/>Your company's Salesforce space"]
  ORG --> OBJ["📂 Objects<br/>Account · Contact · Case · Project__c"]
  OBJ --> FLD["🏷️ Fields<br/>Name · Email · Amount · Status"]
  FLD --> REC["📄 Records<br/>Acme Corp · Jane · Case #1024"]
  ORG --> META["📐 Metadata = blueprint<br/>(objects, fields, flows, Apex…)"]
  ORG --> DATA["🗃️ Data = content<br/>(the actual customer rows)"]`,
      diagramCaption: 'Memorise this stack: Org → Object → Field → Record. Then: Metadata vs Data.',
      images: [
        {
          title: 'Building blocks illustration',
          text: 'Use this when someone says "we deployed the field but the records look wrong" — that sentence mixes blueprint and content.',
          src: 'assets/images/salesforce-building-blocks.jpg',
          alt: 'Nested Salesforce building blocks: Org Objects Fields Records with metadata vs data callouts',
          caption: 'DevOps pipelines mostly deploy metadata. Data usually moves with import/export tools.'
        },
        {
          title: 'SVG poster — Building blocks',
          text: 'Hang this next to the DevOps infinity loop later in the module.',
          src: 'assets/images/salesforce-building-blocks.svg',
          alt: 'SVG poster of Org Object Field Record and metadata vs data',
          caption: 'Blueprint vs content is the #1 concept non-IT learners need before Git and pipelines.'
        },
        {
          title: 'Why teams add DevOps',
          text: 'Left = messy Friday-night deploys. Right = a calm, repeatable path. You will build that path over the rest of the course.',
          src: 'assets/images/why-salesforce-devops.jpg',
          alt: 'Before and after comparison of Salesforce delivery with and without DevOps',
          caption: 'Keep this picture in mind when we talk about Git, CI and environments.'
        }
      ],
      diagrams: [
        {
          title: 'Graph — Cost of fixing a mistake (why process matters)',
          caption: 'Illustrative: the later you find a bad change, the more expensive it is. DevOps "shifts left" — catch issues in sandbox/PR, not in production.',
          src: `
xychart-beta
  title "Relative cost to fix a Salesforce change"
  x-axis ["On laptop / sandbox", "In peer review", "In UAT", "In production"]
  y-axis "Relative cost" 0 --> 100
  bar [10, 20, 45, 95]`
        },
        {
          title: 'Who builds what?',
          caption: 'Both admins and developers create metadata. DevOps must work for clicks AND code.',
          src: `
flowchart LR
  subgraph ADMIN["🖱️ Admin / declarative"]
    A1["Objects & fields"]
    A2["Flows"]
    A3["Page layouts<br/>Permission sets"]
  end
  subgraph DEV["💻 Developer / code"]
    D1["Apex"]
    D2["LWC / Aura"]
    D3["Integrations"]
  end
  ADMIN --> META["📐 Metadata in the org"]
  DEV --> META
  META --> REL["🚀 Needs a release path<br/>(this course!)"]`
        }
      ],
      walkthrough: [
        {
          title: 'Org',
          text: 'An <b>org</b> is one Salesforce environment — like one office building. Production is the live building. Sandboxes are practice buildings.',
          tip: 'Login URLs and usernames often include the org/sandbox name. Mixing them up is a classic beginner mistake.'
        },
        {
          title: 'Object → Field → Record',
          text: 'Object = type of thing. Field = detail about that thing. Record = one real example.',
          diagram: `
flowchart LR
  O["Object: Account"] --> F["Field: AnnualRevenue"]
  F --> R["Record: Acme Corp<br/>AnnualRevenue = 5,000,000"]`
        },
        {
          title: 'Metadata vs data (the DevOps hinge)',
          text: 'Adding a new field <code>Budget__c</code> is a metadata change. Typing "$50,000" into that field on Acme Corp is a data change.',
          warn: 'Change sets and Git deploy metadata. They do not "move all your customers" unless you also run a data plan.'
        },
        {
          title: 'Declarative vs code',
          text: '<b>Declarative</b> = clicks (Setup, Flow Builder). <b>Code</b> = Apex, LWC. Both become metadata files when you retrieve them for Git.',
          tip: 'Non-IT learners: you do not need to write code to understand DevOps — you need to know that clicks also create deployable changes.'
        }
      ],
      concepts: [
        ['Org', 'One Salesforce environment with its own users, data and configuration.'],
        ['Object / Field / Record', 'Table / column / row — the core data model everyone must understand.'],
        ['Metadata vs data', 'Blueprint vs content. DevOps focuses on moving blueprints safely; data has its own tools and rules.'],
        ['Declarative vs programmatic', 'Clicks (Flow, objects) vs code (Apex, LWC). Both need versioning and testing in mature teams.'],
        ['Setup vs app', 'Setup is where builders configure. The app (Lightning pages) is where end users work.'],
        ['Why this unlocks DevOps', 'Once you see that every feature is metadata, "release process" stops being mysterious IT magic and becomes: build → review → test → deploy.']
      ],
      pitfall: 'Editing important Flows or fields directly in production "just this once". That skips history, review and a safe rollback path.',
      quiz: [
        ['Creating a new custom field on Account is primarily a change to…', ['Data', 'Metadata', 'A sandbox refresh', 'A user password'], 1, 'Fields are metadata (blueprint). The values users type later are data.'],
        ['Which analogy is best for a Salesforce Org?', ['A single email', 'One office building / environment for the company', 'One spreadsheet cell', 'A keyboard shortcut'], 1, 'An org is a whole environment — production or a sandbox copy.']
      ],
      lab: {
        title: 'Label the building blocks',
        goal: 'Prove you can spot Org, Object, Field, Record, Metadata and Data in plain scenarios.',
        steps: [
          'Open your Developer Edition org (or Trailhead Playground). Go to an Account record.',
          'Write down: which parts are the Object, which are Fields, which is the Record.',
          'In Setup, find Object Manager → Account → Fields. Note one Standard field and (if you create one) one Custom field.',
          'Create a 2-column table: left = Metadata examples, right = Data examples (at least 5 each).',
          'Write one paragraph: "If we break a Flow in production, which use case from yesterday gets hurt — and how would users notice?"'
        ],
        verify: 'Your table has 5+ items per column, and you can explain Object/Field/Record using a real Account screen.',
        challenge: 'Find one change that is NOT deployable as metadata (hint: some Setup settings). Add it to a "manual steps" sticky note.'
      },
      teach: [
        'Use physical props if possible: a folder (object), a blank form (fields), a filled form (record).',
        'Do not rush into Git yet — confirm every learner can say "metadata vs data" correctly.',
        'Preview tomorrow: "Now that we know what we are changing, we learn how teams deliver those changes — DevOps."'
      ]
    },
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
      images: [
        {
          title: 'Before vs after DevOps (reminder poster)',
          text: 'You already saw the building blocks. This poster is the "why": calm, repeatable delivery instead of Friday-night fire drills.',
          src: 'assets/images/why-salesforce-devops.jpg',
          alt: 'Before and after Salesforce delivery with DevOps',
          caption: 'Culture + process + tools — not tools alone.'
        }
      ],
      concepts: [
        ['DevOps = Culture + Process + Tools', 'Tools (Git, CI) are only one third. Without shared ownership and agreed process, tools just automate chaos.'],
        ['Why Salesforce is different', 'Much of the "code" is configuration built with clicks. Admins and developers share the same orgs, and some metadata is not deployable. Production also enforces 75% Apex test coverage.'],
        ['Source of truth', 'In mature teams, <b>Git</b>, not an org, is the source of truth. The org is the result of deploying what is in Git.'],
        ['Your course journey', 'Salesforce basics → DevOps foundations → Git → Salesforce CLI → Quality gates → GitHub Actions → Azure DevOps → Copado & DevOps Center → Advanced topics & capstone.']
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
          'List your top 3 release pain points. You will revisit them in the final module.'
        ],
        verify: 'You have a one-page diagram (paper, draw.io or Miro) and a list of 3 pain points.',
        challenge: 'Interview a business user: what is the cost to them of a failed or delayed release?'
      },
      teach: [
        '⏱️ 10 min icebreaker: "Tell us about your worst deployment night."',
        'Draw the infinity loop on the whiteboard and ask learners to place their current tools on it.',
        'Set expectations: ~90-minute sessions with a lab every day. Labs are where the learning happens.',
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
        verify: 'You recorded the number of clicks and minutes. Keep these numbers, because you will compare them with a CLI deploy on Day 19.',
        challenge: 'List 5 metadata changes from your real projects that would have been painful with change sets.'
      },
      teach: [
        'Do not bash change sets. They are fine for small orgs. The goal is to show when you outgrow them.',
        'Time the class doing the lab, and write the average on the board for comparison on Day 19.'
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
