COURSE.modules.push({
  title: 'Salesforce CLI Hands-On',
  icon: '⌨️',
  color: '#032d60',
  summary: 'Projects, authentication, retrieve/deploy, manifests, destructive changes, scratch orgs, JWT, data and tests from the command line.',
  days: [
    {
      t: 'Salesforce CLI & DX Projects',
      mins: 90, level: 'Beginner', tags: ['sf-cli', 'sfdx-project', 'auth'],
      obj: ['Install and update the sf CLI', 'Create a DX project and understand sfdx-project.json', 'Authorize orgs with web login and manage aliases'],
      analogy: { icon: '🎮', text: 'Setup menus in Salesforce are like using a TV with its buttons. The CLI is the universal remote: one device and short commands that can control every org you own. You can even program it to run sequences automatically.' },
      diagram: `
flowchart LR
  CLI["⌨️ sf CLI"] -- "org login web" --> DEV["🧪 Dev org<br/>alias: acme-dev"]
  CLI -- "org login web" --> PROD["🌍 Prod / Dev Hub<br/>alias: acme-prod"]
  CLI --> PRJ["📁 DX Project<br/>sfdx-project.json<br/>force-app/"]
  PRJ <-- "retrieve / deploy" --> DEV`,
      concepts: [
        ['sf vs sfdx', '<code>sf</code> (v2) is the current CLI. The old <code>sfdx force:*</code> commands are deprecated, so learn <code>sf</code> syntax.'],
        ['sfdx-project.json', 'Defines package directories, the default path, <code>sourceApiVersion</code> and the namespace.'],
        ['Aliases & defaults', 'Use <code>--alias</code> and <code>--set-default</code>, or <code>sf config set target-org=acme-dev</code>.'],
        ['Auth storage', 'Tokens are stored encrypted in your home directory. Never commit them. <code>sf org display --verbose</code> reveals the token, so treat it as a secret.']
      ],
      code: [{ title: 'Getting started', src: `
sf update
sf project generate --name acme-salesforce --template standard
cd acme-salesforce
sf org login web --alias acme-dev --set-default
sf org login web --alias acme-prod --set-default-dev-hub
sf org list
sf org open --target-org acme-dev` }],
      quiz: [
        ['Which file defines package directories in a DX project?', ['package.xml', 'sfdx-project.json', '.forceignore', 'project-scratch-def.json'], 1, 'sfdx-project.json is the project config. package.xml is a manifest.'],
        ['Modern equivalent of `sfdx force:source:deploy`?', ['sf deploy', 'sf project deploy start', 'sf org deploy', 'sf push'], 1, 'Commands are now grouped under topics such as project, org and data.']
      ],
      lab: {
        title: 'Set up your DX project',
        goal: 'Create a DX project inside your Git repo and connect both orgs.',
        steps: [
          'Inside your acme-salesforce repo, run <code>sf project generate</code> (or move the generated files into the repo).',
          'Open <code>sfdx-project.json</code> and set <code>sourceApiVersion</code> to the latest version.',
          'Log in to your Dev org as <code>acme-dev</code> and your second org as <code>acme-prod</code>.',
          'Run <code>sf org list</code> and take a screenshot.',
          'Commit the project skeleton on a feature branch and open a PR.'
        ],
        verify: '<code>sf org list</code> shows both aliases as Connected.',
        challenge: 'Explore <code>sf commands --json</code> and <code>sf search</code> to discover commands.'
      },
      teach: ['Check that everyone completed setup before class. CLI install issues on corporate laptops eat time.']
    },
    {
      t: 'Retrieving Metadata: Components, Manifests & Source Tracking',
      mins: 90, level: 'Intermediate', tags: ['retrieve', 'package.xml', 'source-tracking'],
      obj: ['Retrieve specific components, folders or manifests', 'Generate a package.xml from an org', 'Understand source tracking'],
      analogy: { icon: '🛒', text: 'Retrieving is grocery shopping from your org. You can grab one item ("just the Account Rating field"), use a shopping list (package.xml), or, with source tracking, have the shop remember what changed since your last visit and bag only that.' },
      diagram: `
flowchart LR
  ORG["☁️ acme-dev"] -- "--metadata CustomObject:Project__c" --> LOCAL["📁 force-app"]
  ORG -- "--manifest manifest/package.xml" --> LOCAL
  ORG -- "source tracking<br/>(only changes)" --> LOCAL
  ORG -- "manifest generate --from-org" --> PKG["📝 package.xml"]`,
      concepts: [
        ['Retrieve by metadata', '<code>--metadata ApexClass:AccountService</code>. Wildcards work: <code>--metadata "CustomField:Project__c.*"</code>.'],
        ['Retrieve by manifest', 'Repeatable and reviewable, and ideal for onboarding an existing org into Git.'],
        ['Source tracking', 'Available in scratch orgs and in sandboxes with tracking enabled. <code>sf project retrieve preview</code> shows changes before you retrieve them.'],
        ['Onboarding an existing org', 'Generate a manifest from the org, prune it, retrieve, then commit in logical chunks.']
      ],
      code: [{ title: 'Retrieve commands', src: `
sf project retrieve start --metadata CustomObject:Project__c --target-org acme-dev
sf project retrieve start --metadata "ApexClass:*" "LightningComponentBundle:*"
sf project manifest generate --from-org acme-dev --output-dir manifest --name full-package.xml
sf project retrieve start --manifest manifest/package.xml
sf project retrieve preview          # source-tracked orgs
sf project retrieve start            # retrieve tracked changes` }],
      pitfall: 'Retrieving with a wildcard on Profiles pulls in permissions for everything in the org, which bloats your repo.',
      quiz: [
        ['Which flag retrieves using a package.xml?', ['--metadata', '--manifest', '--source-dir', '--package'], 1, '--manifest points to a package.xml file.'],
        ['Source tracking is available in…', ['All orgs incl. production', 'Scratch orgs & tracking-enabled sandboxes', 'Only production', 'Only Full sandboxes'], 1, 'Production does not support source tracking.']
      ],
      lab: {
        title: 'Bring Project__c into Git',
        goal: 'Retrieve the metadata you built on Day 3 and commit it.',
        steps: [
          'Retrieve <code>CustomObject:Project__c</code> and <code>PermissionSet:Project_User</code>.',
          'Inspect the decomposed folder structure in VS Code.',
          ['Create <code>manifest/package.xml</code> that lists them, then retrieve again using the manifest.', `<?xml version="1.0" encoding="UTF-8"?>
<Package xmlns="http://soap.sforce.com/2006/04/metadata">
    <types><members>Project__c</members><name>CustomObject</name></types>
    <types><members>Project_User</members><name>PermissionSet</name></types>
    <version>62.0</version>
</Package>`],
          'Generate a full manifest from the org with <code>manifest generate --from-org</code> and note how many types it contains.',
          'Commit the metadata on <code>feature/PROJ-10-project-object</code> and open a PR.'
        ],
        verify: 'The PR shows Project__c files in source format.',
        challenge: 'Enable source tracking on a Developer sandbox (Setup → Dev Hub → Enable Source Tracking in Developer and Developer Pro Sandboxes) and try <code>retrieve preview</code>.'
      },
      teach: ['Remind learners that the <code>version</code> in package.xml should match the API version.']
    },
    {
      t: 'Deploying: Test Levels, Validation & Quick Deploy',
      mins: 120, level: 'Intermediate', tags: ['deploy', 'validate', 'quick-deploy', 'test-level'],
      obj: ['Deploy with the correct test level', 'Validate (check-only) and quick deploy', 'Read deploy reports and errors'],
      analogy: { icon: '✈️', text: 'Validation is the pre-flight checklist: the pilot checks everything without taking off. Quick deploy is taking off right after a successful check, because you do not need to repeat it. Test levels decide how many checks to run: a few critical ones (RunSpecifiedTests) or every single one (RunLocalTests).' },
      diagram: `
flowchart TB
  A["📦 Deploy package"] --> V{"validate?"}
  V -- "sf project deploy validate" --> T["🧪 Run tests<br/>no changes saved"]
  T --> OK{"Passed & ≥75% coverage?"}
  OK -- yes --> JOB["🆔 Job ID (valid 10 days)"]
  JOB -- "sf project deploy quick" --> PROD["🚀 Production in minutes"]
  OK -- no --> FIX["🔧 Fix & retry"]
  V -- "sf project deploy start" --> FULL["Deploy + tests in one go"]`,
      concepts: [
        ['Test levels', '<code>NoTestRun</code> (not allowed in production for Apex), <code>RunSpecifiedTests</code>, <code>RunLocalTests</code> (the production default) and <code>RunAllTestsInOrg</code>.'],
        ['RunSpecifiedTests coverage', 'Each Apex class and trigger in the package needs at least 75% coverage from the specified tests. This is stricter per class than RunLocalTests.'],
        ['Validate + quick deploy', 'Validate during the day and quick deploy in the release window. The validation stays valid for 10 days, or until any other Apex deploy happens.'],
        ['Async & reports', 'Use <code>--async</code>, then <code>sf project deploy report --job-id</code>, or <code>resume</code>.']
      ],
      code: [{ title: 'Deploy commands', src: `
sf project deploy start --source-dir force-app --target-org acme-dev
sf project deploy start --manifest manifest/package.xml --test-level RunLocalTests --target-org acme-prod
sf project deploy validate --manifest manifest/package.xml --test-level RunSpecifiedTests \\
   --tests ProjectServiceTest --target-org acme-prod
sf project deploy quick --job-id 0Af... --target-org acme-prod
sf project deploy report --job-id 0Af...
sf project deploy start --source-dir force-app --dry-run   # same as validate` }],
      pitfall: 'Using RunSpecifiedTests with only a "happy path" test. The deploy passes, but you have weak tests in production.',
      quiz: [
        ['How long is a validated deployment eligible for quick deploy?', ['1 hour', '24 hours', '10 days', 'Forever'], 2, 'Up to 10 days, provided no other Apex changes are deployed in the meantime.'],
        ['Default test level for production deploys containing Apex?', ['NoTestRun', 'RunLocalTests', 'RunAllTestsInOrg', 'RunSpecifiedTests'], 1, 'Production defaults to RunLocalTests.']
      ],
      lab: {
        title: 'Deploy Project__c to "Prod" with validation',
        goal: 'Write an Apex service with a test, validate it against acme-prod and quick deploy it.',
        steps: [
          ['Create an Apex class.', 'sf apex generate class --name ProjectService --output-dir force-app/main/default/classes'],
          ['Implement it.', `public with sharing class ProjectService {
    public static void validateBudgets(List<Project__c> projects) {
        for (Project__c p : projects) {
            if (p.Budget__c != null && p.Budget__c < 0) {
                p.Budget__c.addError('Budget cannot be negative');
            }
        }
    }
}`],
          ['Create <code>ProjectServiceTest</code>.', `@IsTest
private class ProjectServiceTest {
    @IsTest static void rejectsNegativeBudget() {
        Project__c p = new Project__c(Name = 'Test', Budget__c = -5);
        ProjectService.validateBudgets(new List<Project__c>{ p });
        System.assert(p.hasErrors(), 'Expected an error');
    }
}`],
          'Deploy to acme-dev and run the test there.',
          'Validate against acme-prod with RunSpecifiedTests, and note the Job ID.',
          'Quick deploy using the Job ID, then check Setup → Deployment Status in acme-prod.'
        ],
        verify: 'Deployment Status in acme-prod shows a validation and a quick deploy that both succeeded.',
        challenge: 'Make the validation fail deliberately (remove the test) and read the coverage error.'
      },
      teach: ['Show the Deployment Status page side by side with CLI output.', 'Explain why quick deploy matters for release nights: it saves the 1–3 hours that tests can take in big orgs.']
    },
    {
      t: 'Manifest Deployments & Destructive Changes',
      mins: 90, level: 'Intermediate', tags: ['destructive-changes', 'package.xml', 'delete'],
      obj: ['Delete metadata with destructiveChanges (pre and post)', 'Build release manifests', 'Compare a CLI deploy against the Day 4 change set'],
      analogy: { icon: '🗑️', text: 'A normal deploy says "add or update these things". Destructive changes are a removal list: "take these things out". Pre-destructive removes things before the new things arrive, like clearing a shelf before restocking. Post-destructive removes them after, like taking away old signs once new ones are up.' },
      diagram: `
flowchart LR
  PRE["🗑️ destructiveChangesPre.xml<br/>delete first"] --> DEP["📦 package.xml<br/>add / update"] --> POST["🗑️ destructiveChangesPost.xml<br/>delete after"]`,
      concepts: [
        ['When to use pre vs post', 'Use <b>Pre</b> when the new version conflicts with the old component (for example, deleting a field that a replacement depends on being gone). Use <b>Post</b> when you remove references first and then delete, which is the most common case (for example, removing a field after updating the Apex that used it).'],
        ['CLI flags', '<code>--pre-destructive-changes</code> and <code>--post-destructive-changes</code> alongside <code>--manifest</code>. You can also use <code>sf project delete source</code>.'],
        ['Purge on delete', '<code>--purge-on-delete</code> skips the recycle bin in sandboxes and Developer orgs.'],
        ['Release manifest', 'Each release has its own reviewed package.xml stored in Git (e.g., <code>releases/2026.11/package.xml</code>).']
      ],
      code: [{ title: 'Delete a field after removing its reference', src: `
# destructiveChangesPost.xml
<?xml version="1.0" encoding="UTF-8"?>
<Package xmlns="http://soap.sforce.com/2006/04/metadata">
    <types><members>Project__c.Legacy_Code__c</members><name>CustomField</name></types>
    <version>62.0</version>
</Package>

sf project deploy start --manifest manifest/package.xml \\
  --post-destructive-changes manifest/destructiveChangesPost.xml \\
  --target-org acme-prod --test-level RunLocalTests` }],
      quiz: [
        ['You need to delete a field still referenced by Apex that you are updating in the same deploy. Which file?', ['destructiveChangesPre', 'destructiveChangesPost', 'package.xml', '.forceignore'], 1, 'Post runs after the Apex update removes the reference.'],
        ['Can change sets delete components?', ['Yes', 'No'], 1, 'Only the Metadata API, CLI or tools built on them can delete components.']
      ],
      lab: {
        title: 'Add, then remove a field via CLI',
        goal: 'Deploy a field, use it in Apex, then remove both safely.',
        steps: [
          'Create <code>Legacy_Code__c</code> (Text) on Project__c in acme-dev, retrieve it, reference it in ProjectService, and deploy to acme-prod.',
          'Remove the reference from Apex.',
          'Create <code>destructiveChangesPost.xml</code> that lists the field.',
          'Validate, then deploy to acme-prod with the post-destructive manifest.',
          'Time the whole flow and compare it with your Day 4 change set timing.'
        ],
        verify: 'The field is gone from acme-prod (check the Object Manager and Deleted Fields).',
        challenge: 'Try the same with pre-destructive and explain the error you get.'
      },
      teach: ['Write the Day 4 vs Day 16 times on the board. The comparison is a strong motivator.']
    },
    {
      t: 'Scratch Orgs & Dev Hub',
      mins: 120, level: 'Intermediate', tags: ['scratch-org', 'dev-hub', 'source-tracking'],
      obj: ['Create scratch orgs from a definition file', 'Use source tracking to push and pull changes', 'Script a one-command developer setup'],
      analogy: { icon: '🧫', text: 'A scratch org is a fresh Petri dish in a lab. Every experiment starts on a clean, identical dish made from the same recipe (the definition file). When you are done, you throw it away and start the next one fresh, so nothing left over from yesterday spoils today\'s results.' },
      diagram: `
flowchart LR
  HUB["🏛️ Dev Hub<br/>(acme-prod)"] -- "org create scratch" --> SO["🧫 Scratch org<br/>7–30 days"]
  DEF["📄 project-scratch-def.json"] --> SO
  REPO["📁 Git source"] -- "deploy start (tracked)" --> SO
  SO -- "retrieve start (tracked)" --> REPO
  SO -- "org delete scratch" --> BIN["🗑️"]`,
      concepts: [
        ['Definition file', 'Sets the edition, features (e.g., <code>Communities</code>, <code>PersonAccounts</code>) and settings (e.g., <code>lightningExperienceSettings</code>).'],
        ['Limits', 'Active and daily scratch org limits depend on your Dev Hub edition. Delete orgs you no longer need.'],
        ['Scratch org snapshots & org shapes', 'Snapshots capture a configured org for fast re-creation. Org shape copies the features and settings of an existing org.'],
        ['Setup script', 'A single command that creates the org, deploys source, assigns permission sets and imports data. Onboarding drops from days to minutes.']
      ],
      code: [
        { title: 'config/project-scratch-def.json', src: `
{
  "orgName": "Acme Dev",
  "edition": "Developer",
  "features": ["EnableSetPasswordInApi"],
  "settings": {
    "lightningExperienceSettings": { "enableS1DesktopEnabled": true },
    "mobileSettings": { "enableS1EncryptedStoragePref2": false }
  }
}` },
        { title: 'scripts/setup-scratch.sh', src: `
#!/usr/bin/env bash
set -euo pipefail
ALIAS=\${1:-acme-scratch}
sf org create scratch --definition-file config/project-scratch-def.json \\
  --alias "$ALIAS" --duration-days 7 --set-default --target-dev-hub acme-prod
sf project deploy start --target-org "$ALIAS"
sf org assign permset --name Project_User --target-org "$ALIAS"
sf org open --target-org "$ALIAS"` }
      ],
      quiz: [
        ['Which org creates scratch orgs?', ['Any sandbox', 'The Dev Hub', 'The scratch org itself', 'Trailhead'], 1, 'Dev Hub owns scratch orgs and tracks limits.'],
        ['Maximum scratch org duration?', ['7 days', '30 days', '90 days', 'Unlimited'], 1, '1 to 30 days, with a default of 7.']
      ],
      lab: {
        title: 'One-command developer environment',
        goal: 'Build and run a setup script that creates a working scratch org with your project.',
        steps: [
          'Enable Dev Hub in acme-prod (Setup → Dev Hub).',
          'Create <code>config/project-scratch-def.json</code>.',
          'Create <code>scripts/setup-scratch.sh</code> (or a .ps1 equivalent) and run it.',
          'Create a field in the scratch org by clicks, then run <code>sf project retrieve preview</code> and <code>retrieve start</code>.',
          'Commit, then delete the scratch org with <code>sf org delete scratch</code>.'
        ],
        verify: 'Running the script on a clean machine gives a working org with Project__c and the permission set assigned.',
        challenge: 'Write the PowerShell version for Windows users.'
      },
      teach: ['Show <code>sf org list --all</code> to inspect scratch org limits.']
    },
    {
      t: 'JWT Authentication for Automation',
      mins: 120, level: 'Advanced', tags: ['jwt', 'connected-app', 'security', 'ci'],
      obj: ['Create a certificate and private key', 'Configure a Connected App or External Client App for the JWT bearer flow', 'Log in headlessly, as a pipeline will'],
      analogy: { icon: '🪪', text: 'A pipeline is a robot and cannot type a password or approve a phone notification. JWT is like giving the robot a tamper-proof employee badge. Salesforce holds the matching badge reader (the certificate) and trusts any request signed by that badge. You can deactivate it at any time without changing anyone\'s password.' },
      diagram: `
sequenceDiagram
  participant P as 🤖 Pipeline
  participant SF as ☁️ Salesforce
  Note over P: Holds server.key (secret)
  P->>P: Build JWT (client id, user, audience) & sign with server.key
  P->>SF: POST /services/oauth2/token (JWT)
  SF->>SF: Verify signature with uploaded server.crt
  SF-->>P: Access token
  P->>SF: sf project deploy ... (uses token)`,
      concepts: [
        ['Pieces you need', 'A private key (<code>server.key</code>, which stays secret), a certificate (<code>server.crt</code>, uploaded to the app), the consumer key (client ID) and an integration username.'],
        ['Connected App vs External Client App', 'External Client Apps are the newer, packageable model. Connected Apps still work widely. In both cases, enable OAuth, upload the cert and use the scopes <code>api</code>, <code>refresh_token</code> and <code>web</code>.'],
        ['Pre-authorise', 'Set "Admin approved users are pre-authorized" and assign a profile or permission set to the integration user.'],
        ['Least privilege', 'Use a dedicated integration user per environment with only the permissions it needs to deploy.']
      ],
      code: [{ title: 'Create the key & log in', src: `
openssl genrsa -out server.key 2048
openssl req -new -key server.key -out server.csr -subj "/CN=acme-ci"
openssl x509 -req -sha256 -days 365 -in server.csr -signkey server.key -out server.crt

sf org login jwt --client-id <CONSUMER_KEY> --jwt-key-file server.key \\
  --username ci.user@acme.com.prod --alias acme-prod-ci \\
  --instance-url https://login.salesforce.com      # test.salesforce.com for sandboxes` }],
      pitfall: 'Committing server.key to Git. Add <code>*.key</code> to .gitignore NOW. If a key leaks, replace the certificate immediately.',
      quiz: [
        ['Which file is uploaded to Salesforce?', ['server.key', 'server.crt', 'server.csr', '.env'], 1, 'The certificate (public part) is uploaded. The key never leaves your secret store.'],
        ['Instance URL for a sandbox JWT login?', ['login.salesforce.com', 'test.salesforce.com (or My Domain)', 'dev.azure.com', 'github.com'], 1, 'Use test.salesforce.com or the sandbox My Domain URL.']
      ],
      lab: {
        title: 'Headless login to acme-prod',
        goal: 'Authenticate with JWT, exactly as CI will from Day 29 onward.',
        steps: [
          'Generate server.key and server.crt with OpenSSL (outside your repo folder).',
          'Create the app: Setup → App Manager → New Connected App (or External Client App). Enable OAuth with callback <code>http://localhost:1717/OauthRedirect</code>, select "Use digital signatures", upload server.crt and add the scopes.',
          'Manage → Edit Policies: set "Admin approved users are pre-authorized" and add your System Administrator profile (later, a dedicated permission set).',
          'Copy the Consumer Key.',
          'Log out of the web alias, then log in with <code>sf org login jwt</code>.',
          'Run <code>sf org display --target-org acme-prod-ci</code>.'
        ],
        verify: 'JWT login succeeds without a browser popup.',
        challenge: 'Repeat for acme-dev, and base64-encode the key (<code>base64 -w0 server.key</code>) ready for CI secrets.'
      },
      teach: ['This is the number one CI blocker. Allow extra time and troubleshoot "user hasn\'t approved this consumer" together.', 'Common errors: wrong login URL, the app not yet propagated (wait 2–10 minutes), or the user not pre-authorised.']
    },
    {
      t: 'Data Management with the CLI',
      mins: 90, level: 'Intermediate', tags: ['data', 'bulk', 'seed', 'soql'],
      obj: ['Query and export data with SOQL', 'Seed scratch orgs with related records using data tree', 'Bulk upsert with external IDs'],
      analogy: { icon: '🧳', text: 'Metadata builds the empty hotel; data are the guests. To test properly, you need realistic guests in the rooms. Data tree commands pack guests together with their family relationships (an Account with its Contacts), so they arrive together in any new hotel (org).' },
      diagram: `
flowchart LR
  SRC["☁️ Source org"] -- "data export tree --plan" --> FILES["📄 JSON files + plan"]
  FILES -- "data import tree --plan" --> SO["🧫 Scratch / QA org"]
  CSV["📊 CSV (10k+ rows)"] -- "data upsert bulk<br/>--external-id" --> QA["🧪 QA org"]`,
      concepts: [
        ['data query', 'Ad-hoc SOQL, output as human-readable, CSV or JSON.'],
        ['data tree', 'Exports or imports up to about 200 records per file, preserving relationships with reference IDs. Ideal for seed data in Git.'],
        ['Bulk API 2.0', '<code>sf data upsert bulk</code> handles large volumes. Use external IDs so the load can be re-run safely.'],
        ['Reference data', 'Records that configure behaviour (e.g., tax rates) often belong in Custom Metadata Types instead, because those are deployable as metadata.']
      ],
      code: [{ title: 'Data commands', src: `
sf data query --query "SELECT Id, Name, Budget__c FROM Project__c" --target-org acme-dev
sf data export tree --query "SELECT Name, (SELECT Name, Budget__c FROM Projects__r) FROM Account" \\
   --plan --output-dir data --target-org acme-dev
sf data import tree --plan data/Account-Project__c-plan.json --target-org acme-scratch
sf data upsert bulk --sobject Project__c --file data/projects.csv --external-id Project_Code__c --wait 10` }],
      quiz: [
        ['Best way to keep config-like reference data deployable?', ['CSV in Git', 'Custom Metadata Types', 'Manual entry', 'Data tree'], 1, 'Custom Metadata records are metadata, so they travel with deployments.'],
        ['Why use an external ID for bulk upserts?', ['Faster queries', 'Idempotent loads without knowing Salesforce IDs', 'Required by Salesforce', 'Encrypts data'], 1, 'Re-running the load updates existing records instead of creating duplicates.']
      ],
      lab: {
        title: 'Seed your scratch org',
        goal: 'Add realistic seed data to the setup script.',
        steps: [
          'Add a lookup from Project__c to Account (relationship name: Projects), then create 3 Accounts with 2 Projects each in acme-dev.',
          'Export them with <code>data export tree --plan</code> into <code>data/</code>.',
          'Add <code>sf data import tree --plan ...</code> to scripts/setup-scratch.sh.',
          'Create a fresh scratch org with the script and confirm the data is present.',
          'Commit the data files and script.'
        ],
        verify: 'A new scratch org shows 3 Accounts each with 2 related Projects.',
        challenge: 'Look into Snowfakery or the sfdmu plugin for complex data sets and masking.'
      },
      teach: ['Discuss GDPR: never copy production personal data into lower environments without masking it.']
    },
    {
      t: 'Running Apex Tests & Scripting a Deployment',
      mins: 120, level: 'Intermediate', tags: ['apex-tests', 'coverage', 'junit', 'scripting'],
      obj: ['Run tests and capture coverage from the CLI', 'Produce JUnit results for CI dashboards', 'Use --json output in scripts'],
      analogy: { icon: '🔬', text: 'Tests are the safety inspections on a production line. Running them from the CLI means a machine can do the inspection every time and print an official report (JUnit) that the pipeline dashboard can read, so nobody has to say "I tested it" from memory.' },
      diagram: `
flowchart LR
  RUN["sf apex run test"] --> RES["📊 Results"]
  RES --> HUM["👀 human output"]
  RES --> JU["🧾 junit.xml<br/>→ CI test tab"]
  RES --> COV["📈 coverage json<br/>→ quality gate"]
  RES --> JSON["🤖 --json<br/>→ scripts (jq)"]`,
      concepts: [
        ['Test commands', '<code>sf apex run test --test-level RunLocalTests --code-coverage --result-format junit --output-dir test-results --wait 20</code>.'],
        ['--json everywhere', 'Every sf command supports <code>--json</code>. Parse it with <code>jq</code> to build scripts that make decisions.'],
        ['Exit codes', 'A failed command returns a non-zero exit code, which fails the CI step. That is what you want.'],
        ['Test data best practice', 'Use <code>@TestSetup</code>, test data factories, <code>System.runAs</code>, and never <code>SeeAllData=true</code>.']
      ],
      code: [{ title: 'scripts/validate.sh', src: `
#!/usr/bin/env bash
set -euo pipefail
ORG=\${1:?target org alias required}
sf project deploy validate --source-dir force-app --target-org "$ORG" \\
  --test-level RunLocalTests --coverage-formatters cobertura --junit \\
  --results-dir test-results --wait 60 --json > deploy-result.json
STATUS=$(jq -r '.result.status' deploy-result.json)
echo "Validation status: $STATUS"
[ "$STATUS" = "Succeeded" ]` }],
      quiz: [
        ['Which output format is read by CI test dashboards?', ['CSV', 'JUnit XML', 'PDF', 'Markdown'], 1, 'GitHub Actions and Azure DevOps both ingest JUnit XML.'],
        ['Why avoid SeeAllData=true?', ['It is slower and depends on org data, so tests are not repeatable', 'It is deprecated', 'It increases coverage', 'It is required for triggers'], 0, 'Tests must create their own data so they pass in every org.']
      ],
      lab: {
        title: 'A reusable validation script',
        goal: 'Write the script that the pipelines will call in Modules 5 and 6.',
        steps: [
          'Create a <code>ProjectTestDataFactory</code> class and refactor ProjectServiceTest to use @TestSetup.',
          'Run tests in acme-dev with coverage and JUnit output.',
          'Create <code>scripts/validate.sh</code> as shown above.',
          'Run it against acme-prod and open the JUnit XML.',
          'Add <code>test-results/</code> and <code>deploy-result.json</code> to .gitignore and commit the script.',
          'Module 3 wrap-up: merge to main and tag <code>v0.3.0</code>.'
        ],
        verify: 'The script exits 0 on success and non-zero when you break a test.',
        challenge: 'Print the Apex class with the lowest coverage using jq.'
      },
      teach: ['Module 3 assessment: learners deploy a new feature end to end using only the CLI, timed.']
    }
  ]
});
