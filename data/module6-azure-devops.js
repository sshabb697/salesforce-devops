COURSE.modules.push({
  title: 'CI/CD with Azure DevOps',
  icon: '🔷',
  color: '#0078d4',
  summary: 'Boards, Repos, branch policies, YAML pipelines, secure files, variable groups, environments, templates, artifacts and quality dashboards.',
  days: [
    {
      t: 'Azure DevOps Tour: Organizations, Projects & Services',
      mins: 75, level: 'Beginner', tags: ['azure-devops', 'ado', 'overview'],
      obj: ['Navigate Boards, Repos, Pipelines, Test Plans and Artifacts', 'Create an organization and project', 'Import your GitHub repo into Azure Repos'],
      analogy: { icon: '🏢', text: 'If GitHub is a workshop with a robot assistant, Azure DevOps is a whole office building. It has a planning room (Boards), a library of documents (Repos), a factory floor (Pipelines), a testing lab (Test Plans) and a warehouse (Artifacts), all under one roof and one security badge system.' },
      diagram: `
flowchart TB
  ORG["🏢 Organization<br/>dev.azure.com/acme"] --> PRJ["📁 Project: Salesforce-CRM"]
  PRJ --> BO["📋 Boards<br/>epics, stories, sprints"]
  PRJ --> RE["📚 Repos<br/>Git + branch policies"]
  PRJ --> PI["⚙️ Pipelines<br/>YAML CI/CD"]
  PRJ --> TP["🧪 Test Plans<br/>manual UAT"]
  PRJ --> AR["📦 Artifacts<br/>packages / feeds"]`,
      concepts: [
        ['Organization → Project', 'An organization contains projects. Security, agents and service connections are configured at both levels.'],
        ['Repos choice', 'You can keep code in GitHub and use ADO Pipelines and Boards, or move everything to Azure Repos. Both are common. In this module we use Azure Repos.'],
        ['Parallel jobs', 'Free tier private projects need the free grant request (see Setup). Without it, pipelines will not run on Microsoft-hosted agents.'],
        ['Why enterprises choose ADO', 'It integrates with Entra ID (Azure AD), has strong governance and audit features, Test Plans for UAT, and is often already licensed with Microsoft 365 or Azure.']
      ],
      quiz: [
        ['Which ADO service tracks user stories and sprints?', ['Repos', 'Boards', 'Pipelines', 'Artifacts'], 1, 'Boards is ADO\'s agile planning tool.'],
        ['Can ADO Pipelines build code stored in GitHub?', ['No', 'Yes'], 1, 'ADO Pipelines supports GitHub, Azure Repos, Bitbucket and others.']
      ],
      lab: {
        title: 'Set up Azure DevOps',
        goal: 'Create the ADO project and import your repository.',
        steps: [
          'Create an organization at dev.azure.com (if you have not already) and a project named <code>Salesforce-CRM</code> (Git, Agile process).',
          'Check Organization Settings → Parallel jobs: do you have a Microsoft-hosted grant? If not, submit the free grant form.',
          'Repos → Import repository → paste your GitHub acme-salesforce clone URL.',
          'Clone the Azure repo locally into a new folder and add it as a second remote named <code>ado</code>.',
          'Explore each service in the left menu and note one thing that GitHub does differently.'
        ],
        verify: 'Azure Repos shows your full history, branches and tags.',
        challenge: 'Configure <code>git push</code> to push to both remotes at once.'
      },
      teach: ['Many learners\' employers use ADO. Ask who uses it today and pair them with newcomers.']
    },
    {
      t: 'Azure Boards: Stories, Sprints & Traceability',
      mins: 75, level: 'Beginner', tags: ['boards', 'work-items', 'traceability'],
      obj: ['Create epics, features, user stories and tasks', 'Plan a sprint', 'Link commits and PRs to work items with AB#'],
      analogy: { icon: '📌', text: 'Azure Boards is the team\'s pin board of sticky notes. Each note (work item) describes a piece of work and moves across columns: New → Active → Resolved → Closed. By linking each code change to its note, anyone can trace "why did this field appear in production?" back to the original business request.' },
      diagram: `
flowchart LR
  EP["🏔️ Epic<br/>Project Management"] --> FE["🎯 Feature<br/>Project Health"]
  FE --> US["📝 User Story #123<br/>Show health indicator"]
  US --> T1["✅ Task: formula field"]
  US --> T2["✅ Task: LWC update"]
  US -. "AB#123 in commit/PR" .-> PR["🔀 PR → Pipeline → Release"]`,
      concepts: [
        ['Hierarchy', 'Epic → Feature → User Story → Task (Agile process). Bugs can be tracked with requirements or with tasks.'],
        ['Sprints', 'Configure iterations under Project Settings → Team configuration, then drag stories into a sprint.'],
        ['Linking', 'Write <code>AB#123</code> in commit messages or PR descriptions. In Azure Repos, use the PR "Work items" panel or <code>#123</code>.'],
        ['Definition of Done', 'Include "validated in pipeline" and "deployed to UAT" so DevOps becomes part of done.']
      ],
      quiz: [
        ['Which syntax links a GitHub commit to an Azure Boards item?', ['WI-123', 'AB#123', 'JIRA-123', '@123'], 1, 'AB# is recognised once Boards is connected to GitHub.'],
        ['Why link work items to PRs?', ['Required by Git', 'Traceability from business request to deployed change', 'Faster builds', 'Code coverage'], 1, 'This is audit and change-management gold.']
      ],
      lab: {
        title: 'Plan the next sprint',
        goal: 'Create a backlog for the Project Health feature and link it to code.',
        steps: [
          'Create the Epic "Project Management", the Feature "Project Health" and 3 user stories with acceptance criteria.',
          'Create Sprint 1 and assign the stories to it.',
          'On a branch, commit with the message <code>feat: health formula AB#&lt;id&gt;</code> (or link the work item in the PR panel).',
          'Open a PR in Azure Repos and link the work item.',
          'Open the work item and confirm the Development section shows the commit and PR.'
        ],
        verify: 'The work item\'s Development section lists the linked branch, commit and PR.',
        challenge: 'Add a rule (Project settings → Process) that requires "Acceptance Criteria" before a story can be Active.'
      },
      teach: ['Admins and BAs shine in this session, so invite them to lead the backlog writing.']
    },
    {
      t: 'Azure Repos & Branch Policies',
      mins: 90, level: 'Intermediate', tags: ['azure-repos', 'branch-policies', 'governance'],
      obj: ['Protect branches with policies', 'Require reviewers, linked work items and comment resolution', 'Understand build validation as the PR trigger in Azure Repos'],
      analogy: { icon: '🏦', text: 'Branch policies are a bank vault\'s rules: two staff must be present, every withdrawal needs a ticket number (a linked work item), and the alarm system (build validation) must be green before the door opens.' },
      diagram: `
flowchart LR
  PR["🔀 PR → main"] --> P1["👥 Min reviewers: 2"]
  PR --> P2["📌 Linked work item"]
  PR --> P3["💬 Comments resolved"]
  PR --> P4["⚙️ Build validation<br/>sf-pr-validate pipeline"]
  PR --> P5["🧑‍⚖️ Auto-include reviewers<br/>(path: permissionsets/*)"]
  P1 & P2 & P3 & P4 & P5 --> OK["✅ Complete merge"]`,
      concepts: [
        ['Key difference from GitHub', 'For Azure Repos, the YAML <code>pr:</code> trigger is ignored. You run PR pipelines by adding a <b>Build validation</b> branch policy.'],
        ['Merge types', 'You can restrict to squash merge for a clean history.'],
        ['Path-based reviewers', 'Automatically included reviewers per path act like CODEOWNERS.'],
        ['Bypass permissions', 'Limit "Bypass policies" to emergency break-glass accounts and audit their use.']
      ],
      quiz: [
        ['How do you trigger a pipeline on PRs in Azure Repos?', ['pr: in YAML', 'Build validation branch policy', 'CODEOWNERS', 'Webhook'], 1, 'Azure Repos uses branch policies for PR builds.'],
        ['Equivalent of CODEOWNERS in Azure Repos?', ['Automatically included reviewers with path filters', 'Service connection', 'Variable group', 'Wiki'], 0, 'Path filters on required reviewers give the same effect.']
      ],
      lab: {
        title: 'Lock down main and develop',
        goal: 'Configure professional branch policies.',
        steps: [
          'Repos → Branches → main → Branch policies.',
          'Require a minimum of 1 reviewer, linked work items and comment resolution, and allow squash merge only.',
          'Add an automatically included reviewer for path <code>/force-app/main/default/permissionsets/*</code>.',
          'Repeat for develop.',
          'Try a direct push to main and confirm that it is rejected.'
        ],
        verify: 'Direct pushes fail, and PRs show the policy checklist.',
        challenge: 'Create a branch security rule that only allows the release team to create <code>release/*</code> branches.'
      },
      teach: ['Build validation is added on Day 42 once the pipeline exists.']
    },
    {
      t: 'Your First Azure YAML Pipeline',
      mins: 90, level: 'Intermediate', tags: ['azure-pipelines', 'yaml', 'agents'],
      obj: ['Understand stages, jobs, steps, triggers and agents', 'Install the sf CLI on a Microsoft-hosted agent', 'Run org-free checks in ADO'],
      analogy: { icon: '🚂', text: 'An Azure pipeline is a train journey. Stages are the stations (Build, QA, UAT, Prod), jobs are the carriages, and steps are what happens inside each carriage. The agent is the locomotive: Microsoft lends you one, or you bring your own.' },
      diagram: `
flowchart LR
  TR["⚡ trigger: develop, main"] --> S1["🚉 Stage: Build"]
  S1 --> J1["🚃 Job: StaticChecks<br/>vmImage ubuntu-latest"]
  J1 --> ST1["NodeTool@0"] --> ST2["npm ci / lint / jest"] --> ST3["Code Analyzer"]`,
      concepts: [
        ['Hierarchy', 'Pipeline → stages → jobs → steps (tasks or scripts).'],
        ['Variables syntax', '<code>$(var)</code> is a macro (runtime), <code>\${{ var }}</code> is a template expression (compile time) and <code>$[ var ]</code> is a runtime expression.'],
        ['Tasks', 'Built-in tasks such as <code>NodeTool@0</code>, <code>PublishTestResults@2</code>, <code>DownloadSecureFile@1</code>, plus <code>script:</code> or <code>bash:</code> steps.'],
        ['Agents', 'Microsoft-hosted agents give you a fresh VM each run. Self-hosted agents are useful for network access to private systems or for pre-installed tools.']
      ],
      code: [{ title: 'azure-pipelines/ci.yml', src: `
trigger:
  branches:
    include: [ develop, main ]
  paths:
    include: [ force-app/* ]

pool:
  vmImage: ubuntu-latest

stages:
- stage: Build
  jobs:
  - job: StaticChecks
    steps:
    - task: NodeTool@0
      inputs: { versionSpec: '20.x' }
    - script: npm ci
      displayName: Install dependencies
    - script: |
        npm run prettier:verify
        npm run lint
        npm run test:unit
      displayName: Lint & Jest
    - script: |
        npm install --global @salesforce/cli
        sf plugins install code-analyzer
        sf code-analyzer run --workspace force-app --rule-selector Recommended --severity-threshold 2 \\
          --output-file $(Build.ArtifactStagingDirectory)/ca.html
      displayName: Code Analyzer
    - publish: $(Build.ArtifactStagingDirectory)
      artifact: reports
      condition: always()` }],
      quiz: [
        ['Which variable syntax is evaluated at compile (template) time?', ['$(var)', '${{ var }}', '$[ var ]', '%var%'], 1, 'Template expressions are processed before the run starts.'],
        ['What is a stage?', ['A single command', 'A logical phase containing one or more jobs', 'An agent', 'A repo'], 1, 'Stages group jobs and often map to environments.']
      ],
      lab: {
        title: 'Green build in Azure',
        goal: 'Run org-free checks in Azure Pipelines.',
        steps: [
          'Add <code>azure-pipelines/ci.yml</code> to the repo.',
          'Pipelines → New pipeline → Azure Repos Git → Existing YAML file → select it.',
          'Run it and read each step\'s log.',
          'Download the <code>reports</code> artifact and open the HTML report.',
          'Compare the run duration with GitHub Actions for the same checks.'
        ],
        verify: 'The pipeline is green and the reports artifact is downloadable.',
        challenge: 'Add <code>Cache@2</code> for the npm cache.'
      },
      teach: ['Put GitHub Actions YAML and ADO YAML side by side and let learners map the equivalent concepts.']
    },
    {
      t: 'Secure Files, Variable Groups & JWT in Azure Pipelines',
      mins: 90, level: 'Advanced', tags: ['secure-files', 'variable-groups', 'key-vault', 'jwt'],
      obj: ['Store server.key as a Secure File', 'Store IDs in variable groups per environment', 'Optionally link Azure Key Vault'],
      analogy: { icon: '🗄️', text: 'Secure Files is a locked filing cabinet for whole documents (the key file). Variable groups are labelled drawers of settings, one drawer per environment: "UAT drawer", "Prod drawer". The pipeline only gets the drawers it is allowed to open.' },
      diagram: `
flowchart LR
  subgraph LIB["📚 Pipelines → Library"]
    SF1["🔐 Secure file: server-uat.key"]
    SF2["🔐 Secure file: server-prod.key"]
    VG1["🗂️ Variable group: sf-uat"]
    VG2["🗂️ Variable group: sf-prod"]
    KV["🔑 (optional) Azure Key Vault link"]
  end
  VG2 & SF2 --> JOB["🤖 Prod job"]
  JOB --> SFORG["☁️ acme-prod"]`,
      concepts: [
        ['Secure Files', 'Encrypted files that you download into a job with <code>DownloadSecureFile@1</code>. The file is deleted after the job.'],
        ['Variable groups', 'Shared variables. Mark secrets with the lock icon. Secret variables are not automatically mapped into scripts as env vars, so map them explicitly.'],
        ['Pipeline permissions', 'Each secure file and variable group must be authorised for each pipeline. This is a deliberate gate.'],
        ['Key Vault', 'Enterprises often link variable groups to Azure Key Vault for central secret rotation.']
      ],
      code: [{ title: 'templates/steps/sf-auth.yml', src: `
parameters:
- name: keyFile
  type: string

steps:
- task: DownloadSecureFile@1
  name: jwtKey
  inputs:
    secureFile: \${{ parameters.keyFile }}
- script: |
    npm install --global @salesforce/cli
    echo y | sf plugins install sfdx-git-delta
    sf org login jwt --client-id "$SF_CLIENT_ID" --jwt-key-file "$(jwtKey.secureFilePath)" \\
      --username "$SF_USERNAME" --instance-url "$SF_INSTANCE_URL" --alias target --set-default
  displayName: Authenticate to Salesforce
  env:
    SF_CLIENT_ID: $(SF_CLIENT_ID)
    SF_USERNAME: $(SF_USERNAME)
    SF_INSTANCE_URL: $(SF_INSTANCE_URL)` }],
      pitfall: 'Marking SF_CLIENT_ID as secret and then wondering why <code>$SF_CLIENT_ID</code> is empty in the script. Secret variables must be mapped via <code>env:</code>.',
      quiz: [
        ['Which task fetches a Secure File?', ['DownloadSecureFile@1', 'CopyFiles@2', 'PublishPipelineArtifact@1', 'AzureKeyVault@2'], 0, 'It exposes the path as <code>$(name.secureFilePath)</code>.'],
        ['Are secret variables available as environment variables automatically?', ['Yes', 'No, map them with env:'], 1, 'This is a safety feature.']
      ],
      lab: {
        title: 'Authenticate from Azure Pipelines',
        goal: 'Log in to acme-dev (UAT) and acme-prod from ADO.',
        steps: [
          'Pipelines → Library → Secure files: upload <code>server-uat.key</code> and <code>server-prod.key</code> (copies of your Day 18 keys).',
          'Create variable groups <code>sf-uat</code> and <code>sf-prod</code> with SF_CLIENT_ID, SF_USERNAME and SF_INSTANCE_URL.',
          'Create <code>templates/steps/sf-auth.yml</code>.',
          ['Create a test pipeline that uses the group and template.', `variables:
- group: sf-uat
pool: { vmImage: ubuntu-latest }
steps:
- template: ../templates/steps/sf-auth.yml
  parameters: { keyFile: server-uat.key }
- script: sf org display --target-org target`],
          'Run it and click "Permit" for the secure file and variable group when prompted.'
        ],
        verify: 'The org display output appears in the log with no browser login.',
        challenge: 'Link a variable group to an Azure Key Vault (requires an Azure subscription).'
      },
      teach: ['Show the "Pipeline permissions" tab, because learners often get stuck at the authorisation prompt.']
    },
    {
      t: 'PR Validation Pipeline in ADO (Delta + Test Results + Coverage)',
      mins: 120, level: 'Advanced', tags: ['pr-validation', 'build-validation', 'delta', 'coverage'],
      obj: ['Compute the delta against the PR target branch', 'Validate against the target org', 'Publish JUnit and Cobertura results to the Tests and Coverage tabs'],
      analogy: { icon: '🔎', text: 'Like the GitHub version, but now the bank vault (branch policy) itself calls the inspector. Every PR automatically gets a test deploy of only what changed, and the results are pinned to the PR for reviewers to see.' },
      diagram: `
sequenceDiagram
  participant Dev as 👩‍💻 Dev
  participant AR as 📚 Azure Repos
  participant AP as ⚙️ Pipeline
  participant SF as ☁️ UAT org
  Dev->>AR: PR → develop
  AR->>AP: Build validation policy
  AP->>AP: checkout fetchDepth 0, sgd vs target branch
  AP->>SF: deploy validate (delta)
  SF-->>AP: JUnit + Cobertura
  AP-->>AR: ✅ status + Tests tab + Coverage tab`,
      concepts: [
        ['Full history', 'Set <code>fetchDepth: 0</code> on checkout (new pipelines default to a shallow fetch).'],
        ['Target branch', '<code>$(System.PullRequest.TargetBranch)</code> is <code>refs/heads/develop</code>, so strip the prefix to get <code>origin/develop</code>.'],
        ['Tests & coverage tabs', '<code>PublishTestResults@2</code> (JUnit) and <code>PublishCodeCoverageResults@2</code> (Cobertura).'],
        ['One thin pipeline per target org', 'Secure file names and variable groups must be known when the pipeline is authorised, so do not pick them at runtime. Instead, create two small pipelines (UAT and Prod) that call the same job template with different parameters.']
      ],
      code: [
        { title: 'azure-pipelines/pr-validate-uat.yml  (policy on develop; a -prod twin is used for main)', src: `
trigger: none           # run via Build validation policy
pool: { vmImage: ubuntu-latest }
jobs:
- template: ../templates/jobs/sf-pr-validate.yml
  parameters:
    group: sf-uat         # pr-validate-prod.yml: sf-prod
    keyFile: server-uat.key  # pr-validate-prod.yml: server-prod.key` },
        { title: 'templates/jobs/sf-pr-validate.yml', src: `
parameters:
- name: group
  type: string
- name: keyFile
  type: string

jobs:
- job: Validate
  variables:
  - group: \${{ parameters.group }}
  steps:
  - checkout: self
    fetchDepth: 0
  - task: NodeTool@0
    inputs: { versionSpec: '20.x' }
  - template: ../steps/sf-auth.yml
    parameters: { keyFile: \${{ parameters.keyFile }} }
  - bash: |
      TARGET=$(echo "$(System.PullRequest.TargetBranch)" | sed 's#refs/heads/##')
      git fetch origin "$TARGET"
      mkdir -p changed
      sf sgd source delta --from "origin/$TARGET" --to HEAD --output-dir changed
      if grep -q "<types>" changed/package/package.xml; then
        echo "##vso[task.setvariable variable=hasDelta]true"
      fi
    displayName: Build delta
  - bash: |
      sf project deploy validate --manifest changed/package/package.xml \\
        --post-destructive-changes changed/destructiveChanges/destructiveChanges.xml \\
        --target-org target --test-level RunLocalTests --junit --coverage-formatters cobertura \\
        --results-dir results --wait 90
    displayName: Validate delta
    condition: eq(variables.hasDelta, 'true')
  - task: PublishTestResults@2
    condition: and(always(), eq(variables.hasDelta, 'true'))
    inputs: { testResultsFormat: JUnit, testResultsFiles: 'results/junit/*.xml' }
  - task: PublishCodeCoverageResults@2
    condition: and(always(), eq(variables.hasDelta, 'true'))
    inputs: { summaryFileLocation: 'results/coverage/cobertura.xml' }` }],
      pitfall: 'Passing a runtime variable such as <code>$(keyFile)</code> as the secure file name. Authorisation happens before the run starts, so the file "cannot be found". Use compile-time parameters (<code>\${{ parameters.keyFile }}</code>) as shown.',
      quiz: [
        ['Which task publishes Apex test results to the Tests tab?', ['PublishTestResults@2', 'PublishBuildArtifacts@1', 'VSTest@2', 'Npm@1'], 0, 'Use the JUnit format with Salesforce\'s --junit output.'],
        ['How do you set a variable from a bash script for later steps?', ['export VAR', 'echo "##vso[task.setvariable variable=name]value"', 'set VAR', '$GITHUB_OUTPUT'], 1, 'This logging command updates pipeline variables.']
      ],
      lab: {
        title: 'Build validation on develop and main',
        goal: 'Block PRs that would fail deployment.',
        steps: [
          'Add the job template plus <code>pr-validate-uat.yml</code> and <code>pr-validate-prod.yml</code>. Create two pipelines from them: <code>sf-pr-validate-uat</code> and <code>sf-pr-validate-prod</code>.',
          'Repos → Branches → develop → Branch policies → Build validation → add sf-pr-validate-uat (Required).',
          'On main, add sf-pr-validate-prod (Required).',
          'Open a PR with an Apex change and watch the validation run.',
          'Open the Tests and Code Coverage tabs on the run.',
          'Break a test, then confirm that the PR cannot be completed.'
        ],
        verify: 'The PR shows the required check and blocks completion on failure.',
        challenge: 'Post a PR comment listing the delta components using the ADO REST API with <code>$(System.AccessToken)</code>.'
      },
      teach: ['Compare it with Day 30 line by line. The concepts are identical and only the syntax differs.']
    },
    {
      t: 'Multi-Stage CD with Environments, Approvals & Checks',
      mins: 120, level: 'Advanced', tags: ['environments', 'approvals', 'deployment-jobs', 'cd'],
      obj: ['Create ADO environments with approvals and checks', 'Write deployment jobs per stage', 'Gate production by branch and approval'],
      analogy: { icon: '🚦', text: 'Each environment is a level crossing with its own barrier. The QA barrier lifts automatically. The UAT barrier lifts when the business-hours check passes. The Production barrier needs a named person to press the button, and the system writes down who pressed it.' },
      diagram: `
flowchart LR
  B["🚉 Build<br/>delta artifact"] --> QA["🧪 QA stage<br/>env: sf-qa"]
  QA --> UAT["🎭 UAT stage<br/>env: sf-uat<br/>check: business hours"]
  UAT --> GATE{"🛂 sf-production<br/>approval: Release Mgrs<br/>branch control: main"}
  GATE --> PROD["🌍 Prod stage<br/>deployment job"]`,
      concepts: [
        ['Environments', 'Pipelines → Environments. Each one has approvals, branch control, business hours, an exclusive lock and more.'],
        ['Deployment jobs', '<code>- deployment:</code> with <code>environment:</code> and a <code>strategy: runOnce</code>. They record history per environment. Note that they do <b>not</b> check out code automatically, so add <code>- checkout: self</code>.'],
        ['Conditions', '<code>condition: and(succeeded(), eq(variables[\'Build.SourceBranch\'], \'refs/heads/main\'))</code>.'],
        ['Exclusive lock', 'Prevents two runs deploying to the same org at the same time, which avoids Salesforce deployment queue clashes.']
      ],
      code: [{ title: 'azure-pipelines/cd.yml (excerpt)', src: `
trigger:
  branches: { include: [ develop, main ] }
pool: { vmImage: ubuntu-latest }

stages:
- stage: UAT
  condition: eq(variables['Build.SourceBranch'], 'refs/heads/develop')
  variables: [ { group: sf-uat } ]
  jobs:
  - deployment: DeployUAT
    environment: sf-uat
    strategy:
      runOnce:
        deploy:
          steps:
          - checkout: self
            fetchDepth: 0
            persistCredentials: true   # lets the job push the deployed tag
          - template: ../templates/steps/sf-auth.yml
            parameters: { keyFile: server-uat.key }
          - template: ../templates/steps/sf-delta-deploy.yml
            parameters: { tag: deployed/uat }

- stage: Production
  dependsOn: []                       # don't wait for the (skipped) UAT stage
  condition: eq(variables['Build.SourceBranch'], 'refs/heads/main')
  variables: [ { group: sf-prod } ]
  jobs:
  - deployment: DeployProd
    environment: sf-production      # approvals configured in UI
    strategy:
      runOnce:
        deploy:
          steps:
          - checkout: self
            fetchDepth: 0
            persistCredentials: true
          - template: ../templates/steps/sf-auth.yml
            parameters: { keyFile: server-prod.key }
          - template: ../templates/steps/sf-delta-deploy.yml
            parameters: { tag: deployed/prod }` },
        { title: 'templates/steps/sf-delta-deploy.yml', src: `
parameters:
- name: tag
  type: string
- name: testLevel
  type: string
  default: RunLocalTests

steps:
- bash: |
    set -e
    FROM=$(git rev-parse -q --verify "refs/tags/\${{ parameters.tag }}" || git rev-list --max-parents=0 HEAD)
    mkdir -p changed
    sf sgd source delta --from "$FROM" --to HEAD --output-dir changed
    sf project deploy start --manifest changed/package/package.xml \\
      --post-destructive-changes changed/destructiveChanges/destructiveChanges.xml \\
      --target-org target --test-level \${{ parameters.testLevel }} --wait 120
    git tag -f "\${{ parameters.tag }}"
    git push -f origin "refs/tags/\${{ parameters.tag }}"
  displayName: Delta deploy (\${{ parameters.tag }})` }],
      quiz: [
        ['Do deployment jobs check out the repo automatically?', ['Yes', 'No, add - checkout: self'], 1, 'This is a common gotcha in deployment jobs.'],
        ['Where are production approvals configured?', ['In YAML', 'On the Environment → Approvals and checks', 'In branch policy', 'In Boards'], 1, 'Approvals live on the environment resource, not in YAML.']
      ],
      lab: {
        title: 'QA → UAT → Prod in Azure',
        goal: 'Build a multi-stage CD pipeline with a production approval.',
        steps: [
          'Create environments <code>sf-uat</code> and <code>sf-production</code>.',
          'On sf-production, add an Approval (yourself) and Branch control (only <code>refs/heads/main</code>), and enable Exclusive lock.',
          'Create <code>sf-delta-deploy.yml</code> and <code>cd.yml</code>, then create the pipeline.',
          'Grant the build service "Contribute" and "Create tag" permissions on the repo (Project settings → Repositories → Security) so it can push tags.',
          'Merge to develop and watch the UAT deploy. Then merge to main and approve production.',
          'View Environments → sf-production → Deployments.'
        ],
        verify: 'The environment history shows the deployed commit, linked work items and the approver.',
        challenge: 'Add a "Business hours" check on sf-uat.'
      },
      teach: ['Show how linked work items flow through to the environment view. Business stakeholders love this traceability.']
    },
    {
      t: 'Pipeline Templates & Extends for Governance',
      mins: 90, level: 'Advanced', tags: ['templates', 'extends', 'parameters', 'governance'],
      obj: ['Create step, job and stage templates', 'Use typed parameters and conditionals', 'Enforce standards with extends templates in a central repo'],
      analogy: { icon: '📐', text: 'Templates are a franchise operations manual. Every restaurant (Salesforce repo) follows the same core recipe from head office, but can choose a few local options (parameters). An "extends" template is the franchise contract: you must build on head office\'s recipe, so safety checks cannot be skipped.' },
      diagram: `
flowchart TB
  CENTRAL["🏛️ Repo: devops-templates"] --> ST["stages/sf-standard.yml<br/>(extends)"]
  ST --> T1["steps/sf-auth.yml"]
  ST --> T2["steps/sf-delta-deploy.yml"]
  ST --> T3["jobs/static-checks.yml"]
  APP1["📁 crm-repo azure-pipelines.yml"] -- "extends" --> ST
  APP2["📁 service-cloud-repo"] -- "extends" --> ST`,
      concepts: [
        ['Template types', 'Steps, jobs, stages and variables templates, referenced with <code>- template:</code>.'],
        ['Parameters', 'Typed (<code>string</code>, <code>boolean</code>, <code>object</code>, <code>stageList</code>…) with defaults and allowed <code>values</code>.'],
        ['Repository resources', '<code>resources.repositories</code> lets you reference templates from another repo, pinned to a tag.'],
        ['Required template check', 'Environments can require that a pipeline extends an approved template. This enforces governance.']
      ],
      code: [{ title: 'Consumer pipeline using a central template', src: `
resources:
  repositories:
  - repository: templates
    type: git
    name: Salesforce-CRM/devops-templates
    ref: refs/tags/v1.2.0

extends:
  template: stages/sf-standard.yml@templates
  parameters:
    environments:
    - { name: uat, branch: develop, keyFile: server-uat.key, group: sf-uat }
    - { name: production, branch: main, keyFile: server-prod.key, group: sf-prod }
    testLevel: RunLocalTests` },
        { title: 'stages/sf-standard.yml (loop over environments)', src: `
parameters:
- name: environments
  type: object
- name: testLevel
  type: string
  default: RunLocalTests
  values: [ RunLocalTests, RunSpecifiedTests, RunAllTestsInOrg ]

stages:
- stage: Static
  jobs:
  - template: ../jobs/static-checks.yml
- \${{ each env in parameters.environments }}:
  - stage: Deploy_\${{ env.name }}
    dependsOn: Static
    condition: and(succeeded(), eq(variables['Build.SourceBranch'], 'refs/heads/\${{ env.branch }}'))
    variables: [ { group: \${{ env.group }} } ]
    jobs:
    - deployment: Deploy
      environment: sf-\${{ env.name }}
      strategy:
        runOnce:
          deploy:
            steps:
            - checkout: self
              fetchDepth: 0
              persistCredentials: true
            - template: ../steps/sf-auth.yml
              parameters: { keyFile: \${{ env.keyFile }} }
            - template: ../steps/sf-delta-deploy.yml
              parameters: { tag: 'deployed/\${{ env.name }}', testLevel: \${{ parameters.testLevel }} }` }],
      quiz: [
        ['What enforces that pipelines use an approved template?', ['Branch policy', 'Environment check: Required template', 'Secure file', 'Variable group'], 1, 'The Required template check blocks deployments that do not extend it.'],
        ['Which keyword loops in template expressions?', ['for', '${{ each }}', 'foreach', 'matrix'], 1, 'Template-time loops use <code>each</code>.']
      ],
      lab: {
        title: 'Central template repo',
        goal: 'Refactor your pipelines into a reusable, governed template.',
        steps: [
          'Create a new repo <code>devops-templates</code> in the same project.',
          'Move <code>sf-auth.yml</code>, <code>sf-delta-deploy.yml</code> and a <code>static-checks.yml</code> job template into it.',
          'Create <code>stages/sf-standard.yml</code> as shown above, then tag it <code>v1.0.0</code>.',
          'Replace cd.yml in acme-salesforce with the extends version.',
          'On sf-production, add a "Required template" check pointing to sf-standard.yml.'
        ],
        verify: 'The pipeline still deploys, and a pipeline that does not extend the template is blocked at production.',
        challenge: 'Add a boolean parameter <code>runScratchOrgTests</code> that conditionally inserts a scratch-org test stage.'
      },
      teach: ['Platform teams love this pattern. Discuss versioning templates with tags.']
    },
    {
      t: 'Quick Deploy & Release Pattern in ADO (Stage Outputs & Manual Validation)',
      mins: 90, level: 'Advanced', tags: ['quick-deploy', 'output-variables', 'manual-validation'],
      obj: ['Pass the validation Job ID across stages', 'Pause for sign-off with ManualValidation or environment approvals', 'Quick deploy during the change window'],
      analogy: { icon: '🎫', text: 'The validation stage prints a pre-approved boarding pass (Job ID). The pass is handed along to the next stage, and once the gate agent (approver) says go, you board instantly with the pass. No second security check.' },
      diagram: `
flowchart LR
  V["🧪 Stage Validate<br/>sets output jobId"] --> W["⏸️ Stage SignOff<br/>ManualValidation@0 (server)"]
  W --> Q["⚡ Stage QuickDeploy<br/>jobId from stageDependencies"]`,
      concepts: [
        ['Output variables', 'In a step named <code>v</code>: <code>##vso[task.setvariable variable=jobId;isOutput=true]</code>. Read it in another stage with <code>stageDependencies.Validate.ValidateJob.outputs[\'v.jobId\']</code>.'],
        ['ManualValidation@0', 'Runs in an agentless job (<code>pool: server</code>), notifies users and waits up to a timeout. Environment approvals are an alternative.'],
        ['Scheduling', 'Combine this with a <code>schedules:</code> cron for validation, so a validated package is ready for the evening change window.'],
        ['Change records', 'Use the ServiceNow change-management check on environments for ITIL organisations.']
      ],
      code: [{ title: 'azure-pipelines/release.yml', src: `
trigger: none
pool: { vmImage: ubuntu-latest }
variables: [ { group: sf-prod } ]

stages:
- stage: Validate
  jobs:
  - job: ValidateJob
    steps:
    - template: ../templates/steps/sf-auth.yml
      parameters: { keyFile: server-prod.key }
    - bash: |
        sf project deploy validate --source-dir force-app --target-org target \\
          --test-level RunLocalTests --wait 120 --json > v.json
        echo "##vso[task.setvariable variable=jobId;isOutput=true]$(jq -r '.result.id' v.json)"
      name: v

- stage: SignOff
  dependsOn: Validate
  jobs:
  - job: Wait
    pool: server
    timeoutInMinutes: 1440
    steps:
    - task: ManualValidation@0
      inputs:
        notifyUsers: 'release-managers@acme.com'
        instructions: 'Validated. Approve to quick deploy to Production.'

- stage: QuickDeploy
  dependsOn: [ Validate, SignOff ]
  variables:
    jobId: $[ stageDependencies.Validate.ValidateJob.outputs['v.jobId'] ]
  jobs:
  - job: Quick
    steps:
    - template: ../templates/steps/sf-auth.yml
      parameters: { keyFile: server-prod.key }
    - script: sf project deploy quick --job-id "$(jobId)" --target-org target --wait 30` }],
      quiz: [
        ['Which pool does ManualValidation@0 require?', ['ubuntu-latest', 'server (agentless)', 'self-hosted', 'windows-latest'], 1, 'It runs in an agentless job.'],
        ['What flag makes a variable available to other jobs/stages?', ['isSecret=true', 'isOutput=true', 'readonly=true', 'export'], 1, 'isOutput=true plus the step name prefix.']
      ],
      lab: {
        title: 'Change-window release',
        goal: 'Implement validate → sign-off → quick deploy.',
        steps: [
          'Create <code>release.yml</code> and a pipeline from it.',
          'Run it, and check that the Validate stage log shows the job ID.',
          'Approve the ManualValidation step from the run page.',
          'Confirm that the quick deploy succeeded and was fast.',
          'Add a <code>schedules:</code> cron trigger to validate every weekday at 14:00 UTC.'
        ],
        verify: 'Three stages succeed, and the quick deploy stage takes minutes.',
        challenge: 'Add a fallback stage that runs a full deploy if QuickDeploy fails (<code>condition: failed()</code>).'
      },
      teach: ['Ask: when would you choose environment approvals over ManualValidation? (Approvals are reusable and auditable per environment.)']
    },
    {
      t: 'Build Once, Deploy Many: Pipeline Artifacts',
      mins: 90, level: 'Advanced', tags: ['artifacts', 'immutability', 'build-once'],
      obj: ['Package the delta once and promote the same artifact', 'Use pipeline artifacts in deployment jobs', 'Understand immutability for audits'],
      analogy: { icon: '📦', text: 'A factory seals a box once, and the same sealed box travels through quality control, the warehouse and the shop. Nobody repacks it along the way, so what the customer gets is exactly what was inspected. That is "build once, deploy many".' },
      diagram: `
flowchart LR
  B["🏗️ Build stage<br/>sgd + copy sources"] --> ART["📦 Artifact: sf-package<br/>(immutable)"]
  ART --> QA["🧪 QA deploy"]
  ART --> UAT["🎭 UAT deploy"]
  ART --> PROD["🌍 Prod deploy"]`,
      concepts: [
        ['Why', 'It guarantees that production gets exactly what was tested in UAT, even if the branch moves later.'],
        ['PublishPipelineArtifact@1', 'Publish the delta folder (package.xml, destructiveChanges.xml and the delta sources from <code>--generate-delta</code>).'],
        ['Auto-download', 'Deployment jobs download pipeline artifacts from the current run automatically to <code>$(Pipeline.Workspace)/&lt;artifact&gt;</code>.'],
        ['Release-based delta', 'Compute the delta from the last production tag, so the same artifact is valid for every stage of the release train.']
      ],
      code: [{ title: 'Build + consume artifact', src: `
- stage: Build
  jobs:
  - job: Package
    steps:
    - checkout: self
      fetchDepth: 0
    - bash: |
        npm install --global @salesforce/cli && echo y | sf plugins install sfdx-git-delta
        FROM=$(git rev-parse -q --verify refs/tags/deployed/prod || git rev-list --max-parents=0 HEAD)
        mkdir -p $(Build.ArtifactStagingDirectory)/pkg
        sf sgd source delta --from "$FROM" --to HEAD --generate-delta \\
          --output-dir $(Build.ArtifactStagingDirectory)/pkg
        cp sfdx-project.json $(Build.ArtifactStagingDirectory)/pkg/
    - publish: $(Build.ArtifactStagingDirectory)/pkg
      artifact: sf-package

# in each deployment job:
#   steps:
#   - download: current
#     artifact: sf-package
#   - script: |
#       cd $(Pipeline.Workspace)/sf-package
#       sf project deploy start --manifest package/package.xml --target-org target ...` }],
      quiz: [
        ['Main benefit of build-once-deploy-many?', ['Smaller YAML', 'Production receives exactly what was tested', 'No tests needed', 'Free agents'], 1, 'Immutability removes "it worked in UAT" surprises.'],
        ['Where do deployment jobs download current-run artifacts?', ['/tmp', '$(Pipeline.Workspace)/<artifact>', 'force-app/', 'C:\\artifacts'], 1, 'This is the default download location.']
      ],
      lab: {
        title: 'Immutable release package',
        goal: 'Make your CD pipeline promote a single artifact.',
        steps: [
          'Add a Build stage that creates and publishes the <code>sf-package</code> artifact.',
          'Change the UAT and Prod deployment jobs to deploy from the artifact rather than from source.',
          'Run the pipeline and inspect the artifact contents in the run summary.',
          'Push a new commit to main while UAT is waiting, and prove that Prod deploys the original artifact.'
        ],
        verify: 'Both stages deploy identical component lists.',
        challenge: 'Store the artifact in an Azure Artifacts universal package for long-term retention.'
      },
      teach: ['Auditors ask "prove that what went to prod was tested". This pattern is the answer.']
    },
    {
      t: 'Quality Dashboards, SARIF Scans & Notifications in ADO',
      mins: 75, level: 'Intermediate', tags: ['dashboards', 'sarif', 'notifications', 'ado'],
      obj: ['Surface Code Analyzer results in ADO', 'Build a DevOps dashboard', 'Send Teams notifications on pipeline events'],
      analogy: { icon: '📟', text: 'A car dashboard shows speed, fuel and warning lights in one glance. An ADO dashboard does the same for your Salesforce delivery: how many builds passed, test trends, open bugs and deployment history.' },
      diagram: `
flowchart LR
  P["⚙️ Pipelines"] --> TR["🧪 Test results trend"]
  P --> CV["📈 Coverage"]
  P --> SA["🔍 SARIF scans tab"]
  B["📋 Boards"] --> BU["🐞 Bugs burndown"]
  ENV["🌍 Environments"] --> DH["📜 Deploy history"]
  TR & CV & SA & BU & DH --> DASH["📟 Team dashboard"]
  P --> TEAMS["💬 Teams notifications"]`,
      concepts: [
        ['SARIF viewer', 'Install the "SARIF SAST Scans Tab" extension and publish SARIF files as an artifact named <code>CodeAnalysisLogs</code> to get a Scans tab.'],
        ['Dashboards', 'Add widgets for build history, test results trend, deployment status, query tiles and sprint burndown.'],
        ['Notifications', 'Use the Azure Pipelines app for Microsoft Teams (<code>@azure pipelines subscribe</code>) or service hooks.'],
        ['DORA in ADO', 'Use Analytics views or the Power BI connector to calculate deployment frequency and lead time from pipeline runs and work items.']
      ],
      quiz: [
        ['Artifact name the SARIF Scans tab looks for?', ['reports', 'CodeAnalysisLogs', 'sarif', 'drop'], 1, 'The extension reads the CodeAnalysisLogs artifact.'],
        ['Which tool can compute DORA metrics from ADO data?', ['Analytics / Power BI', 'Secure files', 'Branch policies', 'Wiki'], 0, 'The Analytics OData feeds and Power BI cover this.']
      ],
      lab: {
        title: 'Build the team dashboard',
        goal: 'Give stakeholders one place to see delivery health.',
        steps: [
          'Install the SARIF SAST Scans Tab extension (requires org admin rights).',
          'Update ci.yml to output <code>ca.sarif</code> and publish it as <code>CodeAnalysisLogs</code>.',
          'Create a dashboard with build history, test trend, deployment status and sprint burndown widgets.',
          'Connect Teams and subscribe a channel to the CD pipeline.',
          'Share the dashboard with a non-technical colleague and ask what they understood.'
        ],
        verify: 'The dashboard shows live data, and Teams receives a pipeline message.',
        challenge: 'Create a Power BI report showing deployment frequency per month.'
      },
      teach: ['Get the non-technical feedback step done for real. It tests whether learners can communicate value.']
    },
    {
      t: 'Azure DevOps Capstone & GitHub Actions vs ADO',
      mins: 150, level: 'Advanced', tags: ['capstone', 'comparison', 'self-hosted', 'ado'],
      obj: ['Deliver a story end to end in ADO', 'Compare GitHub Actions and Azure DevOps objectively', 'Know when to use self-hosted agents'],
      analogy: { icon: '⚖️', text: 'GitHub Actions and Azure DevOps are like two well-equipped kitchens from different brands. Both cook the same meals. The choice depends on what the rest of your house uses, who the chefs are, and the house rules (governance).' },
      diagram: `
flowchart TB
  subgraph GHA["🐙 GitHub Actions"]
    G1["workflow YAML"] --- G2["jobs / steps / actions"] --- G3["environments + reviewers"] --- G4["secrets / vars"]
  end
  subgraph ADO["🔷 Azure DevOps"]
    A1["pipeline YAML"] --- A2["stages / jobs / tasks"] --- A3["environments + approvals & checks"] --- A4["variable groups / secure files"]
  end
  G1 -. same idea .- A1
  G3 -. same idea .- A3`,
      concepts: [
        ['Concept mapping', 'Action ↔ Task · workflow_call ↔ template · environment reviewers ↔ approvals & checks · secrets ↔ variable groups/secure files · $GITHUB_OUTPUT ↔ ##vso setvariable.'],
        ['When ADO fits', 'Microsoft-centric enterprises that need Boards, Test Plans, strong RBAC, ServiceNow checks or required templates.'],
        ['When GitHub fits', 'Teams that are developer-centric, open source, or use Copilot and Advanced Security, and want a huge Marketplace.'],
        ['Self-hosted agents', 'Use them when you need private network access, persistent caches or pre-installed tools. You must harden and patch them yourself.']
      ],
      quiz: [
        ['GitHub `workflow_call` is closest to which ADO feature?', ['Variable group', 'Templates', 'Secure files', 'Boards'], 1, 'Both enable reusable pipeline definitions.'],
        ['A reason to use self-hosted agents?', ['They are always faster', 'Access to private network resources', 'Required for Salesforce', 'No maintenance'], 1, 'They live inside your network, but you maintain them.']
      ],
      lab: {
        title: 'End-to-end in Azure DevOps',
        goal: 'Deliver the "Project Health" story fully through ADO.',
        steps: [
          'Move story AB#&lt;id&gt; to Active and create a branch from the work item.',
          'Implement the change, then open a PR with the linked work item. The build validation must pass.',
          'Complete the PR, and watch the build-once artifact flow through UAT to Production with approval.',
          'Confirm that the work item shows the deployment status in its Development section.',
          'Write a one-page "GHA vs ADO for Acme" recommendation.',
          'Module 6 wrap-up: tag <code>v0.6.0</code>.'
        ],
        verify: 'The story is closed, the change is in acme-prod, and the environment history links to the story.',
        challenge: 'Install a self-hosted agent on your laptop (Agent pools → New agent) and run one job on it.'
      },
      teach: ['Module 6 assessment: each learner presents their recommendation in 3 minutes, as if talking to a CIO.']
    }
  ]
});
