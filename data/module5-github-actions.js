COURSE.modules.push({
  title: 'CI/CD with GitHub Actions',
  icon: '🐙',
  color: '#24292f',
  summary: 'Workflows, secrets, JWT, PR validation, environments with approvals, quick deploy, reusable workflows, scratch-org CI and releases.',
  days: [
    {
      t: 'GitHub Actions Fundamentals',
      mins: 90, level: 'Beginner', tags: ['github-actions', 'yaml', 'workflow'],
      obj: ['Understand workflows, events, jobs, steps and runners', 'Write and trigger your first workflow', 'Read workflow logs'],
      analogy: { icon: '🤖', text: 'GitHub Actions is a robot assistant that lives in your repository. You give it written instructions (a YAML file) like "whenever someone opens a pull request, check their work". The robot borrows a clean computer (a runner), follows the steps exactly, and reports back with a green tick or a red cross.' },
      diagram: `
flowchart LR
  EV["⚡ Event<br/>push / pull_request / schedule / manual"] --> WF["📄 Workflow<br/>.github/workflows/ci.yml"]
  WF --> J1["🧱 Job: lint<br/>runs-on ubuntu-latest"]
  WF --> J2["🧱 Job: test<br/>needs: lint"]
  J1 --> S1["Step: checkout"] --> S2["Step: run npm ci"]
  J2 --> S3["Step: run tests"]`,
      concepts: [
        ['Workflow', 'A YAML file in <code>.github/workflows/</code>. One repo can have many workflows.'],
        ['Events (on:)', '<code>push</code>, <code>pull_request</code>, <code>workflow_dispatch</code> (a manual button), <code>schedule</code> (cron) and more. Filter them with <code>branches</code> and <code>paths</code>.'],
        ['Jobs & runners', 'Jobs run in parallel unless linked with <code>needs</code>. Each job gets a fresh VM (GitHub-hosted), or you can use self-hosted runners.'],
        ['Actions', 'Reusable steps from the Marketplace, e.g., <code>actions/checkout@v4</code>. Pin versions (or SHAs) for security.']
      ],
      code: [{ title: '.github/workflows/hello.yml', src: `
name: Hello CI
on:
  push:
    branches: [ main ]
  pull_request:
  workflow_dispatch:

jobs:
  hello:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Say hello
        run: |
          echo "Hello from \${{ github.actor }} on \${{ github.ref_name }}"
          ls -la` }],
      quiz: [
        ['Where do workflow files live?', ['/workflows', '.github/workflows/', 'force-app/', '.sfdx/'], 1, 'GitHub only reads workflows from .github/workflows/.'],
        ['How do you make job B wait for job A?', ['depends: A', 'needs: A', 'after: A', 'wait: A'], 1, 'Use <code>needs</code> to create job dependencies.']
      ],
      lab: {
        title: 'Your first workflow',
        goal: 'Create, trigger and debug a simple workflow.',
        steps: [
          'Add <code>.github/workflows/hello.yml</code> and push it to a branch.',
          'Open a PR and watch the check run in the Actions tab.',
          'Add a second job that <code>needs</code> the first and prints <code>node --version</code>.',
          'Break the YAML indentation, push, and read the error. Then fix it.',
          'Run it manually using "Run workflow" (workflow_dispatch).'
        ],
        verify: 'The Actions tab shows a successful run with 2 jobs in sequence.',
        challenge: 'Add a <code>paths</code> filter so it only runs when <code>force-app/**</code> changes.'
      },
      teach: ['YAML indentation errors are the number one beginner problem. Recommend the VS Code YAML and GitHub Actions extensions.']
    },
    {
      t: 'CI Without an Org: Install sf CLI, Cache, Lint, Scan & Jest',
      mins: 90, level: 'Intermediate', tags: ['github-actions', 'cache', 'code-analyzer', 'jest'],
      obj: ['Install the Salesforce CLI in a runner', 'Cache dependencies for speed', 'Run static analysis and Jest on every PR'],
      analogy: { icon: '🏭', text: 'Before sending a product to the customer\'s shop (an org), the factory runs its own inspections in-house: is it the right shape, is the paint even, does it switch on? These checks need no customer at all, and they catch most problems cheaply.' },
      diagram: `
flowchart LR
  PR["🔀 PR opened"] --> SETUP["⚙️ setup-node + cache"]
  SETUP --> CLI["⌨️ npm i -g @salesforce/cli"]
  CLI --> LINT["🧹 Prettier + ESLint"]
  CLI --> JEST["🃏 LWC Jest"]
  CLI --> SCAN["🔍 Code Analyzer → SARIF"]
  LINT & JEST & SCAN --> STATUS["✅/❌ PR check"]`,
      concepts: [
        ['Fail fast', 'Org-free checks take 1–3 minutes. Run them before slow org validations.'],
        ['Caching', '<code>actions/setup-node</code> with <code>cache: npm</code> caches node_modules downloads. You can also cache <code>~/.local/share/sf</code> for plugins.'],
        ['SARIF upload', '<code>github/codeql-action/upload-sarif</code> shows Code Analyzer findings in the Security tab and on PR diffs.'],
        ['Concurrency', '<code>concurrency: group: ci-\${{ github.ref }}</code> with <code>cancel-in-progress: true</code> cancels outdated runs.']
      ],
      code: [{ title: '.github/workflows/static-checks.yml', src: `
name: Static checks
on:
  pull_request:
    paths: [ 'force-app/**', 'package.json' ]
concurrency:
  group: static-\${{ github.ref }}
  cancel-in-progress: true
permissions:
  contents: read
  security-events: write
jobs:
  static:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 20, cache: npm }
      - run: npm ci
      - run: npm run prettier:verify
      - run: npm run lint
      - run: npm run test:unit -- --coverage
      - name: Install sf CLI + Code Analyzer
        run: |
          npm install --global @salesforce/cli
          sf plugins install code-analyzer
      - name: Code Analyzer
        run: |
          mkdir -p reports
          sf code-analyzer run --workspace force-app --rule-selector Recommended \\
            --severity-threshold 2 --output-file reports/ca.sarif
      - uses: github/codeql-action/upload-sarif@v3
        if: always()
        with: { sarif_file: reports/ca.sarif }` }],
      quiz: [
        ['Why run static checks before org validation?', ['They are required by Salesforce', 'They are fast and catch many issues cheaply', 'They deploy code', 'They replace Apex tests'], 1, 'Fail fast with cheap checks first.'],
        ['What does `if: always()` on the SARIF upload do?', ['Always skips', 'Uploads results even if the scan step failed', 'Runs on schedule', 'Runs only on main'], 1, 'You want to see the findings especially when the gate fails.']
      ],
      lab: {
        title: 'Static checks on every PR',
        goal: 'Add org-free quality gates to your repo.',
        steps: [
          'Add <code>static-checks.yml</code> as shown above.',
          'Open a PR containing the old BadExample code and watch it fail.',
          'View the findings in the Security → Code scanning tab.',
          'Fix the code and confirm that the check turns green.',
          'In branch protection, mark "Static checks / static" as a required status check.'
        ],
        verify: 'The PR cannot be merged while the static check is failing.',
        challenge: 'Cache the sf CLI installation to cut a minute off the run.'
      },
      teach: ['Show the run timings before and after caching.']
    },
    {
      t: 'Secrets & JWT Authentication in GitHub Actions',
      mins: 90, level: 'Advanced', tags: ['secrets', 'jwt', 'environments', 'security'],
      obj: ['Store certificates and IDs as secrets', 'Authenticate to Salesforce from a workflow', 'Scope secrets per environment'],
      analogy: { icon: '🔐', text: 'GitHub Secrets is a locked safe. You put the robot\'s badge (private key) inside, and only workflows you allow can open it. Even then the badge is hidden in the logs, shown as ***. Environment secrets are separate safes for each building (QA, UAT, Prod).' },
      diagram: `
flowchart LR
  subgraph GH["🐙 GitHub"]
    RS["🔑 Repo secrets"]
    ES1["🔑 env: uat secrets"]
    ES2["🔑 env: production secrets"]
  end
  ES2 --> JOB["🤖 deploy job<br/>environment: production"]
  JOB -- "decode key + sf org login jwt" --> SF["☁️ acme-prod"]`,
      concepts: [
        ['Secrets to create', '<code>SF_CLIENT_ID</code>, <code>SF_USERNAME</code>, <code>SF_JWT_KEY_B64</code> (base64 of server.key), and the variable <code>SF_INSTANCE_URL</code>.'],
        ['Environment secrets', 'Create GitHub environments (uat, production) with their own secrets. A job only gets them when it declares <code>environment:</code>.'],
        ['Masking', 'Secrets are masked in logs, but do not echo them in encoded or transformed form.'],
        ['Fork PRs', 'Secrets are not available to workflows triggered from forks. This is by design.']
      ],
      code: [{ title: 'Reusable auth step', src: `
- name: Authenticate to Salesforce (JWT)
  env:
    SF_JWT_KEY_B64: \${{ secrets.SF_JWT_KEY_B64 }}
    SF_CLIENT_ID:   \${{ secrets.SF_CLIENT_ID }}
    SF_USERNAME:    \${{ secrets.SF_USERNAME }}
    SF_INSTANCE_URL: \${{ vars.SF_INSTANCE_URL }}
  run: |
    echo "$SF_JWT_KEY_B64" | base64 --decode > server.key
    sf org login jwt --client-id "$SF_CLIENT_ID" --jwt-key-file server.key \\
      --username "$SF_USERNAME" --instance-url "$SF_INSTANCE_URL" --alias target --set-default
    rm -f server.key
    sf org display --target-org target` }],
      pitfall: 'Using the same integration user and key for every environment. If the key leaks, all your orgs are exposed. Use one per environment.',
      quiz: [
        ['How does a job get environment-scoped secrets?', ['Automatically', 'By declaring environment: <name>', 'Via env: block only', 'Using a PAT'], 1, 'Declaring the environment unlocks its secrets and protection rules.'],
        ['Why base64-encode the key?', ['Encryption', 'To store a multi-line file safely as a single-line secret', 'Salesforce requires it', 'To compress it'], 1, 'base64 is encoding, not encryption. The secret store provides the protection.']
      ],
      lab: {
        title: 'Connect GitHub to Salesforce',
        goal: 'Authenticate from a workflow using your Day 18 JWT setup.',
        steps: [
          'Base64-encode server.key (<code>base64 -w0 server.key</code>, or in PowerShell <code>[Convert]::ToBase64String([IO.File]::ReadAllBytes("server.key"))</code>).',
          'Create GitHub environments <code>uat</code> (acme-dev) and <code>production</code> (acme-prod).',
          'Add the 3 secrets and 1 variable to each environment.',
          'Create a <code>workflow_dispatch</code> workflow with an <code>environment</code> input that authenticates and runs <code>sf org display</code>.',
          'Run it for both environments.'
        ],
        verify: 'The logs show a successful login and org details, with secrets masked.',
        challenge: 'Check whether the key file is left on the runner. How would this matter on a self-hosted runner?'
      },
      teach: ['Security moment: show how a leaked key in a public repo is found by bots within minutes.']
    },
    {
      t: 'PR Validation Pipeline with Delta & Test Results',
      mins: 120, level: 'Advanced', tags: ['pr-validation', 'delta', 'junit', 'github-actions'],
      obj: ['Validate only changed metadata against the target org on each PR', 'Publish Apex test results to the PR', 'Comment the deploy summary on the PR'],
      analogy: { icon: '🧾', text: 'Before a new dish goes on the menu, the head chef tastes just the new dish, not the whole menu, in the real kitchen. A PR validation does a test deploy of only the changed parts into the real target org, without actually changing it.' },
      diagram: `
sequenceDiagram
  participant Dev as 👩‍💻 Dev
  participant GH as 🐙 GitHub Actions
  participant SF as ☁️ Target org (UAT)
  Dev->>GH: PR → develop
  GH->>GH: checkout (fetch-depth 0)
  GH->>GH: sgd delta (merge-base → HEAD)
  GH->>SF: sf project deploy validate (delta, RunLocalTests)
  SF-->>GH: result + JUnit
  GH-->>Dev: ✅ check + test report + PR comment`,
      concepts: [
        ['fetch-depth: 0', 'sgd needs the full history to compute diffs. The default shallow clone breaks it.'],
        ['Base reference', 'For PRs, diff against <code>origin/\${{ github.base_ref }}</code>.'],
        ['Empty delta', 'If package.xml has no types (e.g., a docs-only PR), skip the validation step.'],
        ['Test reporting', 'Publish the JUnit XML with a test-reporter action so failures show on the PR.']
      ],
      code: [{ title: '.github/workflows/pr-validate.yml', src: `
name: PR Validate
on:
  pull_request:
    branches: [ develop, 'release/**', main ]
    paths: [ 'force-app/**' ]
permissions:
  contents: read
  checks: write
  pull-requests: write
jobs:
  validate:
    runs-on: ubuntu-latest
    environment: \${{ github.base_ref == 'main' && 'production' || 'uat' }}
    steps:
      - uses: actions/checkout@v4
        with: { fetch-depth: 0 }
      - uses: actions/setup-node@v4
        with: { node-version: 20 }
      - name: Install CLI & plugins
        run: |
          npm install --global @salesforce/cli
          echo y | sf plugins install sfdx-git-delta
      - name: Authenticate
        env:
          KEY: \${{ secrets.SF_JWT_KEY_B64 }}
        run: |
          echo "$KEY" | base64 --decode > server.key
          sf org login jwt --client-id "\${{ secrets.SF_CLIENT_ID }}" --jwt-key-file server.key \\
            --username "\${{ secrets.SF_USERNAME }}" --instance-url "\${{ vars.SF_INSTANCE_URL }}" --alias target
          rm server.key
      - name: Build delta
        id: delta
        run: |
          mkdir -p changed
          sf sgd source delta --from "origin/\${{ github.base_ref }}" --to HEAD --output-dir changed
          if grep -q "<types>" changed/package/package.xml; then echo "has=true" >> $GITHUB_OUTPUT; fi
      - name: Validate
        if: steps.delta.outputs.has == 'true'
        run: |
          sf project deploy validate --manifest changed/package/package.xml \\
            --post-destructive-changes changed/destructiveChanges/destructiveChanges.xml \\
            --target-org target --test-level RunLocalTests --junit --results-dir results \\
            --coverage-formatters cobertura --wait 90
      - uses: EnricoMi/publish-unit-test-result-action@v2
        if: always() && steps.delta.outputs.has == 'true'
        with: { files: 'results/junit/*.xml' }` }],
      quiz: [
        ['Why is fetch-depth: 0 required for sgd?', ['Speed', 'sgd needs full Git history to compare commits', 'Security', 'Salesforce requires it'], 1, 'A shallow clone does not contain the base commit.'],
        ['A PR changes only README.md. What should happen?', ['Full deploy', 'Skip validation (empty delta)', 'Fail', 'Deploy to prod'], 1, 'The paths filter and the empty-delta check avoid wasted runs.']
      ],
      lab: {
        title: 'Validate PRs against UAT',
        goal: 'Get a working delta PR validation with test results on the PR.',
        steps: [
          'Create <code>pr-validate.yml</code> as shown above.',
          'Open a PR to develop that modifies ProjectService.',
          'Watch the delta step and confirm that only ProjectService is in the package.',
          'Check the test results summary on the PR.',
          'Break a test, push, and confirm that the PR is blocked with a readable failure.',
          'Make "PR Validate / validate" a required check on develop and main.'
        ],
        verify: 'A failing Apex test blocks the merge, and fixing it unblocks the merge.',
        challenge: 'Post a PR comment listing the components in the delta (use <code>actions/github-script</code>).'
      },
      teach: ['This is the core pipeline of the course. Make sure every learner gets it green before moving on.']
    },
    {
      t: 'Deploy on Merge: Environments & Approval Gates',
      mins: 90, level: 'Advanced', tags: ['cd', 'environments', 'approvals'],
      obj: ['Deploy automatically when PRs merge', 'Require manual approval for production', 'Use deployment history for audits'],
      analogy: { icon: '🛂', text: 'Passport control: anyone can walk from the plane to the gate (merging into develop deploys to QA automatically), but to enter the country (production) an officer must stamp your passport. That stamp is the approval in a GitHub environment.' },
      diagram: `
flowchart LR
  M1["merge → develop"] --> QA["🧪 Deploy QA<br/>auto"]
  M2["merge → release/*"] --> UAT["🎭 Deploy UAT<br/>auto"]
  M3["merge → main"] --> AP{"🛂 Approval<br/>release managers"}
  AP -- approved --> PROD["🌍 Deploy Production"]
  AP -- rejected --> STOP["⛔"]`,
      concepts: [
        ['Protection rules', 'Environments can require reviewers, a wait timer, and restrict which branches can deploy to them.'],
        ['Deployment history', 'GitHub records who approved what and when, which is useful for SOX and ISO audits.'],
        ['Branch → environment mapping', 'Use a single workflow with <code>on: push</code> and choose the environment from the branch name.'],
        ['Track the last deployed commit', 'After a successful deploy, move a tag (<code>deployed/uat</code>) so the next delta starts from it.']
      ],
      code: [{ title: '.github/workflows/deploy.yml (core)', src: `
name: Deploy
on:
  push:
    branches: [ develop, 'release/**', main ]
    paths: [ 'force-app/**' ]
jobs:
  deploy:
    runs-on: ubuntu-latest
    environment: \${{ github.ref_name == 'main' && 'production' || (startsWith(github.ref_name, 'release/') && 'uat' || 'qa') }}
    permissions: { contents: write }
    steps:
      - uses: actions/checkout@v4
        with: { fetch-depth: 0 }
      # ... install CLI + sgd, authenticate (same as Day 30) ...
      - name: Delta since last deploy
        run: |
          ENV_TAG="deployed/\${{ github.ref_name == 'main' && 'production' || 'nonprod' }}"
          FROM=$(git rev-parse -q --verify "refs/tags/$ENV_TAG" || git rev-list --max-parents=0 HEAD)
          mkdir -p changed && sf sgd source delta --from "$FROM" --to HEAD --output-dir changed
      - name: Deploy
        run: |
          sf project deploy start --manifest changed/package/package.xml \\
            --post-destructive-changes changed/destructiveChanges/destructiveChanges.xml \\
            --target-org target --test-level RunLocalTests --wait 120
      - name: Move deployed tag
        run: |
          git tag -f "deployed/\${{ github.ref_name == 'main' && 'production' || 'nonprod' }}"
          git push -f origin --tags` }],
      quiz: [
        ['Where are production approvers configured?', ['In the YAML', 'GitHub → Settings → Environments → production → Required reviewers', 'In Salesforce', 'In CODEOWNERS'], 1, 'Protection rules are configured on the environment.'],
        ['Why move a tag after each deploy?', ['Decoration', 'So the next delta starts from what is actually deployed', 'GitHub requires it', 'To trigger the next run'], 1, 'It guarantees accurate deltas.']
      ],
      lab: {
        title: 'Continuous delivery with a gate',
        goal: 'Merge into main and deploy to acme-prod after an approval.',
        steps: [
          'Create <code>deploy.yml</code> by combining the auth and install steps from Day 30.',
          'Add yourself (or a classmate) as a required reviewer on the <code>production</code> environment.',
          'Merge a small change to develop and watch it auto-deploy.',
          'Merge to main. The run pauses for approval, so approve it and watch the deploy.',
          'Check Environments → production for the deployment history.'
        ],
        verify: 'The change is in acme-prod, and the history shows who approved it.',
        challenge: 'Use separate tags per environment (qa, uat, production) instead of a shared nonprod tag.'
      },
      teach: ['Role-play: one learner is the release manager approving or rejecting with a comment.']
    },
    {
      t: 'Validate-then-Quick-Deploy Pattern for Release Nights',
      mins: 90, level: 'Advanced', tags: ['quick-deploy', 'release', 'job-outputs'],
      obj: ['Pass the validation Job ID between jobs', 'Quick deploy after approval', 'Handle the 10-day validity window'],
      analogy: { icon: '🧳', text: 'Airport security first, boarding later. You get through security (validation) in the afternoon. In the evening, when your flight is called (the approval), you walk straight onto the plane (quick deploy) without queueing again.' },
      diagram: `
flowchart LR
  V["🧪 Job 1: validate<br/>outputs.jobId = 0Af..."] --> A{"🛂 Job 2 env: production<br/>approval"}
  A --> Q["⚡ sf project deploy quick<br/>--job-id 0Af..."]
  Q --> T["🏷️ tag release"]`,
      concepts: [
        ['Job outputs', 'Write to <code>$GITHUB_OUTPUT</code> in a step, expose it via the job <code>outputs:</code>, and read it with <code>needs.validate.outputs.jobId</code>.'],
        ['Invalidation', 'Any Apex deployment to the org after validation invalidates the quick deploy, so freeze other deploys during the window.'],
        ['Fallback', 'If quick deploy fails because of an expired validation, fall back to a full deploy with tests.'],
        ['Timing', 'Validate during the day, quick deploy during the change window. Quick deploys typically take minutes.']
      ],
      code: [{ title: '.github/workflows/release.yml', src: `
name: Release to Production
on: workflow_dispatch
jobs:
  validate:
    runs-on: ubuntu-latest
    environment: production-validate
    outputs:
      jobId: \${{ steps.v.outputs.jobId }}
    steps:
      - uses: actions/checkout@v4
      # ... install + auth ...
      - id: v
        run: |
          sf project deploy validate --source-dir force-app --target-org target \\
            --test-level RunLocalTests --wait 120 --json > v.json
          echo "jobId=$(jq -r '.result.id' v.json)" >> "$GITHUB_OUTPUT"
  deploy:
    needs: validate
    runs-on: ubuntu-latest
    environment: production        # requires approval
    steps:
      # ... install + auth ...
      - run: sf project deploy quick --job-id "\${{ needs.validate.outputs.jobId }}" --target-org target --wait 30` }],
      quiz: [
        ['What invalidates a validated deployment?', ['Time of day', 'Another Apex deployment to the org, or 10 days passing', 'Reading the job ID', 'Logging in'], 1, 'Any Apex change resets eligibility.'],
        ['How do jobs share a value?', ['Environment variables only', 'Job outputs via $GITHUB_OUTPUT + needs.<job>.outputs', 'Files on the runner', 'They cannot'], 1, 'Jobs run on different VMs, so use outputs (or artifacts).']
      ],
      lab: {
        title: 'Release-night simulation',
        goal: 'Validate in the "afternoon" and quick deploy in the "evening".',
        steps: [
          'Create environments <code>production-validate</code> (no approval) and <code>production</code> (approval required).',
          'Create <code>release.yml</code>.',
          'Run it, let validation finish, and wait 5 minutes before approving.',
          'Approve the run and time the quick deploy.',
          'Experiment: validate, deploy any Apex change manually, then approve. Observe the failure.'
        ],
        verify: 'The quick deploy completes in a fraction of the validation time.',
        challenge: 'Add a fallback step: <code>if: failure()</code> runs a full deploy.'
      },
      teach: ['Show real numbers: a 70-minute validation versus a 2-minute quick deploy in a large org.']
    },
    {
      t: 'Reusable Workflows, Composite Actions & Matrices',
      mins: 90, level: 'Advanced', tags: ['reusable-workflows', 'composite', 'matrix', 'dry'],
      obj: ['Remove duplicated YAML with composite actions', 'Call reusable workflows with inputs and secrets', 'Fan out with a matrix'],
      analogy: { icon: '🍳', text: 'Instead of writing the full omelette recipe on every menu, the kitchen keeps one master recipe card and every dish says "see omelette card". Reusable workflows and composite actions are those recipe cards: write once, use everywhere, and fix in one place.' },
      diagram: `
flowchart TB
  CA["🧩 .github/actions/sf-auth<br/>(composite)"]
  RW["♻️ .github/workflows/_deploy.yml<br/>(workflow_call)"]
  RW --> CA
  QA["deploy-qa"] --> RW
  UAT["deploy-uat"] --> RW
  PROD["deploy-prod"] --> RW`,
      concepts: [
        ['Composite action', 'Bundles steps into <code>action.yml</code>. Use it for installing the CLI and authenticating.'],
        ['Reusable workflow', 'Triggered by <code>on: workflow_call</code>, with typed <code>inputs</code> and <code>secrets</code> (or <code>secrets: inherit</code>).'],
        ['Matrix', 'Runs the same job for several values, e.g., validating against several sandboxes in parallel.'],
        ['Org-wide templates', 'Put reusable workflows in a central repo (e.g., <code>acme/devops-templates</code>) so all Salesforce repos share one standard.']
      ],
      code: [{ title: '.github/actions/sf-setup/action.yml', src: `
name: sf-setup
description: Install sf CLI + plugins and authenticate with JWT
inputs:
  client-id:    { required: true }
  username:     { required: true }
  jwt-key-b64:  { required: true }
  instance-url: { required: true }
runs:
  using: composite
  steps:
    - shell: bash
      run: |
        npm install --global @salesforce/cli
        echo y | sf plugins install sfdx-git-delta
        echo "\${{ inputs.jwt-key-b64 }}" | base64 --decode > server.key
        sf org login jwt --client-id "\${{ inputs.client-id }}" --jwt-key-file server.key \\
          --username "\${{ inputs.username }}" --instance-url "\${{ inputs.instance-url }}" --alias target --set-default
        rm server.key` },
        { title: 'Using it with a matrix', src: `
jobs:
  smoke:
    strategy:
      matrix:
        env: [ qa, uat ]
    runs-on: ubuntu-latest
    environment: \${{ matrix.env }}
    steps:
      - uses: actions/checkout@v4
      - uses: ./.github/actions/sf-setup
        with:
          client-id: \${{ secrets.SF_CLIENT_ID }}
          username: \${{ secrets.SF_USERNAME }}
          jwt-key-b64: \${{ secrets.SF_JWT_KEY_B64 }}
          instance-url: \${{ vars.SF_INSTANCE_URL }}
      - run: sf apex run test --test-level RunLocalTests --wait 30` }],
      quiz: [
        ['Which trigger makes a workflow reusable?', ['workflow_dispatch', 'workflow_call', 'repository_dispatch', 'push'], 1, 'workflow_call lets other workflows call it.'],
        ['Composite actions are defined in…', ['action.yml', 'ci.yml', 'package.json', 'sfdx-project.json'], 0, 'action.yml with <code>runs.using: composite</code>.']
      ],
      lab: {
        title: 'Refactor to DRY pipelines',
        goal: 'Replace the copy-pasted auth and install steps with a composite action.',
        steps: [
          'Create <code>.github/actions/sf-setup/action.yml</code>.',
          'Refactor pr-validate.yml, deploy.yml and release.yml to use it.',
          'Create <code>_deploy.yml</code> as a reusable workflow with inputs <code>environment</code> and <code>test-level</code>.',
          'Add a nightly <code>schedule</code> workflow running Apex tests in qa and uat using a matrix.',
          'Confirm that all workflows still pass.'
        ],
        verify: 'Auth logic exists in exactly one file.',
        challenge: 'Move the composite action to a separate repo and reference it by tag.'
      },
      teach: ['Show the line count before and after the refactor. Learners like seeing the duplication disappear.']
    },
    {
      t: 'Scratch-Org CI & Automated Package Versions',
      mins: 120, level: 'Advanced', tags: ['scratch-org', 'packages', 'ci'],
      obj: ['Spin up an ephemeral scratch org per PR', 'Run the full test suite in isolation', 'Create package versions automatically on merge'],
      analogy: { icon: '🧪', text: 'For each new recipe, the kitchen sets up a brand-new pop-up kitchen, cooks the dish, tastes it and then dismantles the kitchen. Nobody else\'s leftovers can affect the result. That is a scratch org per PR.' },
      diagram: `
flowchart LR
  PR["🔀 PR"] --> AUTH["🏛️ auth Dev Hub"]
  AUTH --> CREATE["🧫 create scratch org"]
  CREATE --> DEP["📦 deploy source / install deps"]
  DEP --> TEST["🧪 run all tests"]
  TEST --> DEL["🗑️ delete scratch org (always)"]
  MERGE["✅ merge main"] --> PV["🧩 package version create --code-coverage"]`,
      concepts: [
        ['Always clean up', 'Use <code>if: always()</code> on the delete step so scratch orgs do not pile up against limits.'],
        ['Dev Hub auth', 'CI authenticates to the Dev Hub (JWT) and uses <code>--target-dev-hub</code>.'],
        ['Speed tips', 'Org shapes and scratch org snapshots reduce setup time for complex orgs.'],
        ['Package automation', 'On merge to main, create a version with <code>--code-coverage</code> and commit the updated alias back with a bot commit or a PR.']
      ],
      code: [{ title: 'Scratch org job (excerpt)', src: `
- name: Create scratch org
  run: |
    sf org create scratch --definition-file config/project-scratch-def.json \\
      --alias ci-scratch --duration-days 1 --target-dev-hub target --wait 15
- name: Deploy & test
  run: |
    sf project deploy start --target-org ci-scratch --wait 30
    sf org assign permset --name Project_User --target-org ci-scratch
    sf apex run test --target-org ci-scratch --test-level RunLocalTests \\
      --code-coverage --result-format junit --output-dir results --wait 30
- name: Delete scratch org
  if: always()
  run: sf org delete scratch --target-org ci-scratch --no-prompt` }],
      quiz: [
        ['Why `if: always()` on deleting the scratch org?', ['Faster', 'So it runs even when tests fail, freeing limits', 'Required syntax', 'To skip on success'], 1, 'Failed runs would otherwise leak orgs.'],
        ['Which org do you authenticate to for creating scratch orgs?', ['Any sandbox', 'The Dev Hub', 'The scratch org', 'UAT'], 1, 'The Dev Hub creates and owns scratch orgs.']
      ],
      lab: {
        title: 'Ephemeral test environment',
        goal: 'Run your tests in a fresh scratch org on every PR.',
        steps: [
          'Add Dev Hub JWT secrets (acme-prod) to a <code>devhub</code> environment.',
          'Create <code>scratch-ci.yml</code> triggered on pull_request.',
          'Include create, deploy, seed data (from Day 19), test and delete steps.',
          'Open a PR and watch the full lifecycle.',
          'Run <code>sf org list --all</code> locally to confirm that no orphaned scratch org remains.'
        ],
        verify: 'Each PR run creates and deletes exactly one scratch org.',
        challenge: 'Add a job that creates an unlocked package version on merge to main.'
      },
      teach: ['Discuss the trade-off: scratch-org CI is clean but slower and limit-bound. Sandbox validation is closer to production.']
    },
    {
      t: 'Release Automation: Tags, Changelogs & Notifications',
      mins: 75, level: 'Intermediate', tags: ['releases', 'changelog', 'notifications'],
      obj: ['Create GitHub Releases with generated notes', 'Notify Slack or Teams on deploy results', 'Version releases consistently'],
      analogy: { icon: '📣', text: 'After every flight lands, the airline announces it and logs the passenger list. Release automation does the same: it writes down exactly what shipped (release notes), stamps it with a version, and tells everyone who needs to know.' },
      diagram: `
flowchart LR
  DEP["🚀 Prod deploy success"] --> TAG["🏷️ tag v2026.11.0"]
  TAG --> REL["📘 GitHub Release<br/>auto-generated notes"]
  DEP --> MSG["💬 Slack / Teams message"]
  FAIL["❌ deploy failed"] --> ALERT["🚨 alert + link to run"]`,
      concepts: [
        ['Versioning', 'Calendar versioning (<code>v2026.11.0</code>) suits release trains. SemVer suits packages.'],
        ['Generated notes', '<code>gh release create --generate-notes</code> builds notes from merged PR titles, which is one more reason to write good titles.'],
        ['Notifications', 'Use incoming webhooks for Slack and Teams, stored as secrets.'],
        ['Traceability', 'Link story IDs (Jira or ADO) in PR titles so release notes map to business value.']
      ],
      code: [{ title: 'Post-deploy steps', src: `
- name: Create GitHub release
  env: { GH_TOKEN: \${{ secrets.GITHUB_TOKEN }} }
  run: |
    VERSION="v$(date +%Y.%m).\${{ github.run_number }}"
    gh release create "$VERSION" --generate-notes --title "Release $VERSION"
- name: Notify Teams
  if: always()
  run: |
    curl -H "Content-Type: application/json" -d \\
    "{\\"text\\": \\"Prod deploy \${{ job.status }}: \${{ github.server_url }}/\${{ github.repository }}/actions/runs/\${{ github.run_id }}\\"}" \\
    "\${{ secrets.TEAMS_WEBHOOK_URL }}"` }],
      quiz: [
        ['What makes generated release notes useful?', ['Long commit hashes', 'Descriptive PR titles with story IDs', 'Emoji', 'Branch names'], 1, 'Notes are built from PR titles.'],
        ['Where should the webhook URL be stored?', ['In the YAML', 'As a secret', 'In README', 'In package.xml'], 1, 'Webhook URLs allow anyone to post, so treat them as secrets.']
      ],
      lab: {
        title: 'Ship with a story',
        goal: 'Automatically create a release and notify on every production deploy.',
        steps: [
          'Add the release step to the production deploy job (it needs <code>contents: write</code> permission).',
          'Create a Slack or Teams incoming webhook and store it as a secret.',
          'Add the notification step with <code>if: always()</code>.',
          'Deploy to production and check the release page and channel message.'
        ],
        verify: 'A GitHub Release exists with notes, and the channel received a message.',
        challenge: 'Configure <code>.github/release.yml</code> to group notes by labels (feature, bug, chore).'
      },
      teach: ['Show stakeholders an automated release page. This is a business-facing win.']
    },
    {
      t: 'GitHub Actions Capstone: End-to-End Pipeline & Troubleshooting',
      mins: 150, level: 'Advanced', tags: ['capstone', 'troubleshooting', 'github-actions'],
      obj: ['Assemble the full pipeline from PR to production', 'Diagnose common failures quickly', 'Document the pipeline for the team'],
      analogy: { icon: '🏁', text: 'You have built every station of the assembly line. Today you switch the whole factory on, run a product from start to finish, and learn to read the warning lights when a station stops.' },
      diagram: `
flowchart LR
  F["🌿 feature/*"] -- PR --> SC["🔍 static checks"]
  SC --> PV["🧪 PR validate (delta)"]
  PV -- merge --> D["develop → QA auto"]
  D -- PR --> R["release/* → UAT auto"]
  R -- PR --> M["main"]
  M --> V["validate prod"] --> AP{"🛂 approve"} --> Q["⚡ quick deploy"] --> REL["📘 release + 📣 notify"]`,
      concepts: [
        ['Troubleshooting: auth', '<code>invalid_grant</code> usually means the wrong login URL, the user is not pre-authorised, or the cert and key do not match.'],
        ['Troubleshooting: delta', 'An empty package usually comes from a shallow clone or the wrong <code>--from</code>. Missing dependencies call for <code>--include</code> files.'],
        ['Troubleshooting: deploy', 'Missing references usually mean a component is not in the delta. Coverage errors mean you need better tests or a different test level. "INVALID_CROSS_REFERENCE_KEY" points to org-specific IDs.'],
        ['Debugging tools', 'Re-run with debug logging (<code>ACTIONS_STEP_DEBUG</code> secret = true), add <code>sf ... --json</code> output, and use the <code>act</code> CLI to run workflows locally.']
      ],
      quiz: [
        ['JWT login fails with invalid_grant on a sandbox. First thing to check?', ['Node version', 'Instance URL is test.salesforce.com / sandbox My Domain', 'Branch name', 'Prettier config'], 1, 'The wrong login URL is the most common cause.'],
        ['sgd produced an empty package although files changed. Likely cause?', ['Shallow clone (fetch-depth 1)', 'Too many files', 'Wrong Node version', 'Missing README'], 0, 'Without history, the diff base is missing.']
      ],
      lab: {
        title: 'Full flow + README',
        goal: 'Deliver a feature from branch to production through the whole pipeline, then document it.',
        steps: [
          'Create a story: "Add Project Health indicator" (formula field and LWC update).',
          'Branch from develop, build it, and open a PR. Static checks and validation should pass.',
          'Merge to develop (QA), raise a PR to release/* (UAT), then to main.',
          'Run the release with validation, approval and quick deploy.',
          'Write <code>docs/pipeline.md</code> with a diagram, secrets list, environment table and troubleshooting tips.',
          'Module 5 wrap-up: tag <code>v0.5.0</code>.'
        ],
        verify: 'The feature is live in acme-prod with a GitHub Release, and the docs are merged.',
        challenge: 'Measure your new lead time and update the DORA scorecard from Day 5.'
      },
      teach: ['Run a "chaos" session: secretly break something (an expired cert, a wrong secret) and let teams diagnose it.', 'Module 5 assessment: a demo of their pipeline in 5 minutes.']
    }
  ]
});
