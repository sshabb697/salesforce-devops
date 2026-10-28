COURSE.modules.push({
  title: 'Quality Gates, Delta Deploys & Packaging',
  icon: '🛡️',
  color: '#a96404',
  summary: 'Test strategy, Code Analyzer, LWC Jest, pre-commit hooks, sfdx-git-delta and unlocked packages.',
  days: [
    {
      t: 'Test Strategy: The Pyramid, Mocks & Meaningful Coverage',
      mins: 90, level: 'Advanced', tags: ['testing', 'mocks', 'coverage'],
      obj: ['Apply the test pyramid to Salesforce', 'Mock callouts and dependencies', 'Write assertions that prove behaviour'],
      analogy: { icon: '🔺', text: 'Imagine checking a new car. You test thousands of small parts quickly (unit tests), then check whole systems like the brakes together (integration tests), and finally take a few full test drives (end-to-end UI tests). Test drives are slow and expensive, so you do fewer of them. That shape is the test pyramid.' },
      diagram: `
flowchart TB
  E2E["🚗 UI / E2E<br/>Provar, UTAM, Playwright — few"]
  INT["🔗 Integration<br/>Apex with DML, Flows — some"]
  UNIT["🔩 Unit<br/>Apex with mocks, LWC Jest — many"]
  E2E --- INT --- UNIT`,
      concepts: [
        ['Coverage ≠ quality', '75% is the deploy minimum, not a goal. Assert outcomes with <code>Assert.areEqual</code>, and cover bulk (200 records), negative paths and permission cases.'],
        ['Callout mocks', 'Implement <code>HttpCalloutMock</code> and use <code>Test.setMock</code>. Tests cannot make real callouts.'],
        ['Stub API / dependency injection', '<code>System.StubProvider</code> or frameworks like fflib/ApexMocks make unit tests fast and isolated.'],
        ['Flow testing', 'Flow tests can be created in Flow Builder and deployed as metadata (<code>FlowTest</code>), and are run with <code>sf flow run test</code>.']
      ],
      code: [{ title: 'Callout mock', src: `
@IsTest
private class WeatherServiceTest {
    private class OkMock implements HttpCalloutMock {
        public HTTPResponse respond(HTTPRequest req) {
            HttpResponse res = new HttpResponse();
            res.setStatusCode(200);
            res.setBody('{"temp": 21}');
            return res;
        }
    }
    @IsTest static void returnsTemperature() {
        Test.setMock(HttpCalloutMock.class, new OkMock());
        Test.startTest();
        Integer t = WeatherService.currentTemp('London');
        Test.stopTest();
        Assert.areEqual(21, t, 'Should parse temperature');
    }
}` }],
      quiz: [
        ['What should form the largest number of tests?', ['UI tests', 'Unit tests', 'Manual tests', 'Load tests'], 1, 'Unit tests are fast and cheap, so they form the base of the pyramid.'],
        ['How do you test a callout in Apex?', ['Use a real endpoint', 'Test.setMock with HttpCalloutMock', 'Skip the test', 'SeeAllData=true'], 1, 'Mocks make callout tests deterministic.']
      ],
      lab: {
        title: 'Bulletproof ProjectService tests',
        goal: 'Raise test quality, not just coverage.',
        steps: [
          'Add a bulk test with 200 Project__c records.',
          'Add a test proving that a positive budget is accepted (no error).',
          'Add a trigger <code>ProjectTrigger</code> that calls ProjectService before insert and update, and test it with real DML.',
          'Run tests with coverage and confirm that each class is above 90%.',
          'Optional: create a simple Flow and a Flow test.'
        ],
        verify: 'All tests pass, each has meaningful asserts, and coverage is above 90%.',
        challenge: 'Introduce a selector class and mock it with the Stub API.'
      },
      teach: ['Code review exercise: show a test with 100% coverage and zero asserts. Ask the class what is wrong with it.']
    },
    {
      t: 'Static Code Analysis with Salesforce Code Analyzer',
      mins: 90, level: 'Intermediate', tags: ['code-analyzer', 'pmd', 'eslint', 'security'],
      obj: ['Install and run Code Analyzer', 'Interpret severities and rules', 'Configure a quality gate threshold'],
      analogy: { icon: '📝', text: 'Static analysis is a spell-checker and grammar-checker for code. It reads your code without running it and underlines likely mistakes, such as a database query inside a loop or a security hole, before anyone ever runs it.' },
      diagram: `
flowchart LR
  SRC["📁 force-app"] --> CA["🔍 Code Analyzer"]
  CA --> PMD["PMD<br/>Apex rules"]
  CA --> ES["ESLint<br/>LWC / JS"]
  CA --> RJ["RetireJS<br/>vulnerable libs"]
  CA --> SFGE["Graph Engine<br/>CRUD/FLS paths"]
  PMD & ES & RJ & SFGE --> REP["📊 Report<br/>html / sarif / csv"]
  REP --> GATE{"Severity ≤ threshold?"}`,
      concepts: [
        ['Engines', 'PMD (Apex and Visualforce), ESLint (LWC/Aura), RetireJS, Regex, CPD (copy-paste detection) and the Salesforce Graph Engine (data-flow security).'],
        ['Severity', '1 (Critical) to 5 (Info). A CI gate commonly fails on severity 1–2.'],
        ['Rule selection', 'Start with the <code>Recommended</code> rules, then add custom PMD rulesets (e.g., ApexCRUDViolation, AvoidSoqlInLoops).'],
        ['SARIF output', 'Uploading SARIF to GitHub code scanning shows findings inline on the PR.']
      ],
      code: [{ title: 'Code Analyzer (v5)', src: `
sf plugins install code-analyzer
sf code-analyzer rules --rule-selector Recommended
sf code-analyzer run --workspace force-app --rule-selector Recommended \\
   --severity-threshold 2 --output-file reports/code-analyzer.html \\
   --output-file reports/code-analyzer.sarif
# older v4 syntax: sf scanner run --target force-app --format html --severity-threshold 2` }],
      quiz: [
        ['Which engine finds CRUD/FLS issues across method calls?', ['ESLint', 'RetireJS', 'Salesforce Graph Engine', 'CPD'], 2, 'Graph Engine performs data-flow analysis across paths.'],
        ['What does --severity-threshold 2 do?', ['Ignores all issues', 'Fails (non-zero exit) if any severity 1–2 violation is found', 'Only reports severity 2', 'Sets log level'], 1, 'It turns the scan into a quality gate.']
      ],
      lab: {
        title: 'Find and fix violations',
        goal: 'Introduce bad code, catch it with the analyzer and fix it.',
        steps: [
          ['Add a deliberately bad method to a new class <code>BadExample</code>.', `public class BadExample {
    public static void bad(List<Account> accts) {
        for (Account a : accts) {
            List<Contact> cs = [SELECT Id FROM Contact WHERE AccountId = :a.Id];
            System.debug(cs);
        }
    }
}`],
          'Run Code Analyzer with the HTML output and open the report.',
          'Find the SOQL-in-loop and debug violations.',
          'Refactor to a single query with a Map, then re-run the scan.',
          'Add <code>npm run scan</code> to <code>package.json</code> scripts.'
        ],
        verify: 'The scan exits 0 at threshold 2 after the fix.',
        challenge: 'Create a custom PMD ruleset XML that bans <code>System.debug</code> in non-test classes.'
      },
      teach: ['Show a real SARIF upload on a GitHub PR, because it impresses stakeholders.']
    },
    {
      t: 'LWC Quality: Jest Tests, ESLint & Prettier',
      mins: 90, level: 'Intermediate', tags: ['lwc', 'jest', 'prettier', 'eslint'],
      obj: ['Write a Jest unit test for an LWC', 'Lint and format consistently', 'Run JS checks locally and in CI'],
      analogy: { icon: '🎨', text: 'Prettier is a style guide that auto-formats, like a newspaper editor making every article use the same font. ESLint is the fact-checker that flags errors. Jest is a rehearsal for each component: you check that it shows the right thing before it goes on stage.' },
      diagram: `
flowchart LR
  LWC["⚡ projectCard LWC"] --> J["🃏 Jest<br/>@salesforce/sfdx-lwc-jest"]
  LWC --> E["🧹 ESLint<br/>@salesforce/eslint-config-lwc"]
  LWC --> P["✨ Prettier<br/>+ prettier-plugin-apex"]
  J & E & P --> OK["✅ npm test / lint / prettier:verify"]`,
      concepts: [
        ['sfdx-lwc-jest', 'Runs LWC tests in Node with mocked Salesforce modules (wire adapters, Apex imports).'],
        ['Wire mocks', 'Use <code>createApexTestWireAdapter</code> or <code>jest.mock</code> for Apex methods.'],
        ['Prettier for Apex & XML', '<code>prettier-plugin-apex</code> and <code>@prettier/plugin-xml</code> keep diffs clean.'],
        ['Project template', 'The standard DX template already ships package.json scripts: <code>lint</code>, <code>test:unit</code>, <code>prettier</code>.']
      ],
      code: [{ title: 'force-app/main/default/lwc/projectCard/__tests__/projectCard.test.js', src: `
import { createElement } from 'lwc';
import ProjectCard from 'c/projectCard';

describe('c-project-card', () => {
  afterEach(() => { while (document.body.firstChild) document.body.removeChild(document.body.firstChild); });

  it('shows the project name', async () => {
    const el = createElement('c-project-card', { is: ProjectCard });
    el.name = 'Website Revamp';
    document.body.appendChild(el);
    await Promise.resolve();
    expect(el.shadowRoot.querySelector('h2').textContent).toBe('Website Revamp');
  });
});` }],
      quiz: [
        ['Where do LWC Jest tests run?', ['In the org', 'Locally in Node.js', 'In Developer Console', 'In a scratch org only'], 1, 'Jest runs locally and in CI with no org needed.'],
        ['Which folder is excluded from deploys by .forceignore?', ['lwc', '__tests__', 'classes', 'objects'], 1, 'Test files must not be deployed.']
      ],
      lab: {
        title: 'Test the projectCard component',
        goal: 'Build a small LWC with tests, lint and formatting.',
        steps: [
          ['Generate the component.', 'sf lightning generate component --type lwc --name projectCard --output-dir force-app/main/default/lwc'],
          'Add an <code>@api name</code> property and render it in an &lt;h2&gt;.',
          ['Install dependencies and add the test above.', 'npm install\nnpm install --save-dev @salesforce/sfdx-lwc-jest prettier prettier-plugin-apex @prettier/plugin-xml'],
          'Run <code>npm run test:unit</code>, <code>npm run lint</code> and <code>npm run prettier:verify</code>.',
          'Break formatting deliberately and fix it with <code>npm run prettier</code>.'
        ],
        verify: 'All three commands pass.',
        challenge: 'Add a wire test that mocks an Apex method returning project records.'
      },
      teach: ['Admins in the class: pair them with developers for this lab.']
    },
    {
      t: 'Shift Left: Pre-commit Hooks with Husky & lint-staged',
      mins: 60, level: 'Intermediate', tags: ['husky', 'hooks', 'shift-left'],
      obj: ['Automate checks before every commit', 'Only check changed files for speed', 'Explain "shift left" economics'],
      analogy: { icon: '🚪', text: 'A pre-commit hook is a doorman checking your shoes before you enter: wipe the mud off here, not after you have walked across the carpet. Fixing a problem on your laptop costs seconds. Fixing it in production can cost days.' },
      diagram: `
flowchart LR
  C["git commit"] --> H["🪝 husky pre-commit"]
  H --> LS["lint-staged<br/>(staged files only)"]
  LS --> PR["prettier --write"]
  LS --> ES["eslint"]
  LS --> JT["jest --findRelatedTests"]
  PR & ES & JT --> OK{"pass?"}
  OK -- yes --> DONE["✅ committed"]
  OK -- no --> NO["⛔ commit blocked"]`,
      concepts: [
        ['Cost of defects', 'The later a defect is found (local → PR → QA → prod), the more expensive it is to fix, often by 10× at each stage.'],
        ['Husky', 'Installs Git hooks from your repo, so the whole team shares them.'],
        ['lint-staged', 'Runs tools only on staged files, which keeps hooks fast (under 10 seconds).'],
        ['Hooks are not enough', 'Hooks can be bypassed with <code>--no-verify</code>, so CI must re-run the same checks.']
      ],
      code: [{ title: 'package.json (excerpt)', src: `
{
  "scripts": { "prepare": "husky" },
  "lint-staged": {
    "**/*.{cls,trigger,cmp,component,html,js,json,md,xml,yaml,yml}": ["prettier --write"],
    "**/{aura,lwc}/**/*.js": ["eslint"],
    "**/lwc/**": ["sfdx-lwc-jest -- --bail --findRelatedTests --passWithNoTests"]
  }
}` }],
      quiz: [
        ['Why must CI repeat pre-commit checks?', ['Hooks can be skipped with --no-verify', 'CI is faster', 'Hooks do not work on Windows', 'It does not need to'], 0, 'Local hooks are a convenience. CI is the enforcement point.'],
        ['lint-staged runs checks on…', ['The whole repo', 'Only staged files', 'Only main branch', 'Only Apex'], 1, 'This keeps hooks fast.']
      ],
      lab: {
        title: 'Install the doorman',
        goal: 'Block badly formatted or broken code from being committed.',
        steps: [
          ['Install the tools.', 'npm install --save-dev husky lint-staged\nnpx husky init'],
          ['Set the hook content.', 'echo "npx lint-staged" > .husky/pre-commit'],
          'Add the lint-staged config to package.json.',
          'Commit a badly formatted Apex file and watch Prettier fix it automatically.',
          'Commit an LWC with a lint error and watch the commit get blocked.'
        ],
        verify: 'The bad commit was rejected, and the formatted commit went through.',
        challenge: 'Add commitlint with a <code>commit-msg</code> hook enforcing conventional commits.'
      },
      teach: ['Show the cost-of-defect chart and ask learners to estimate the cost of their last production bug.']
    },
    {
      t: 'Delta Deployments with sfdx-git-delta',
      mins: 120, level: 'Advanced', tags: ['delta', 'sgd', 'performance'],
      obj: ['Generate a package.xml and destructiveChanges.xml from a Git diff', 'Deploy only what changed', 'Decide when a full deploy is still needed'],
      analogy: { icon: '📬', text: 'When you move house, you do not re-send all your furniture every time you buy a new lamp. Delta deployment only sends the new lamp, and it also notes the old chair you threw away. It is much faster, but every now and then you check the whole house matches the inventory (a full deploy).' },
      diagram: `
flowchart LR
  A["commit A<br/>(last deployed tag)"] --> DIFF["🔍 git diff A..B"]
  B["commit B<br/>(HEAD)"] --> DIFF
  DIFF --> SGD["sf sgd source delta"]
  SGD --> PKG["📦 package/package.xml<br/>added & modified"]
  SGD --> DES["🗑️ destructiveChanges/<br/>destructiveChanges.xml"]
  PKG & DES --> DEP["🚀 sf project deploy start"]`,
      concepts: [
        ['Why delta', 'Large orgs can take an hour or more for a full deploy. A delta deploy of 10 components takes minutes and has a smaller blast radius.'],
        ['What sgd generates', 'An additive package.xml, a destructiveChanges.xml for deletions, and optionally a copy of changed sources (<code>--generate-delta</code>).'],
        ['Choosing --from', 'Use the last successfully deployed commit, stored as a tag (e.g., <code>deployed/uat</code>) or a pipeline variable. For PRs, use the merge base with the target branch.'],
        ['Limits of delta', 'Dependent changes not in the diff (e.g., a profile that needs a field) may need <code>--include</code> files. Run a periodic full deploy or validation to detect drift.']
      ],
      code: [{ title: 'Delta deploy', src: `
sf plugins install sfdx-git-delta
mkdir -p changed-sources
sf sgd source delta --from "origin/main" --to "HEAD" --output-dir changed-sources --generate-delta
cat changed-sources/package/package.xml
cat changed-sources/destructiveChanges/destructiveChanges.xml
sf project deploy start --manifest changed-sources/package/package.xml \\
  --post-destructive-changes changed-sources/destructiveChanges/destructiveChanges.xml \\
  --target-org acme-prod --test-level RunLocalTests --ignore-warnings
git tag -f deployed/prod HEAD && git push -f origin deployed/prod` }],
      pitfall: 'Using <code>HEAD~1</code> as the from-commit. If a pipeline run is skipped or several commits merge together, changes are silently missed. Track the last successful deploy commit instead.',
      quiz: [
        ['What is the safest --from reference for production delta deploys?', ['HEAD~1', 'The commit last successfully deployed to prod (e.g., a tag)', 'The first commit', 'develop branch'], 1, 'Tracking the last deployed state guarantees nothing is skipped.'],
        ['Which file does sgd generate for deletions?', ['package.xml', 'destructiveChanges.xml', '.forceignore', 'sfdx-project.json'], 1, 'Deleted files in the diff are listed in destructiveChanges.xml.']
      ],
      lab: {
        title: 'Deploy only the delta',
        goal: 'Use sgd to deploy a small change and a deletion.',
        steps: [
          'Tag your current main as <code>deployed/prod</code> (assume it matches acme-prod).',
          'On a branch, modify ProjectService, add a new field <code>Priority__c</code>, and delete <code>BadExample.cls</code> along with its meta file.',
          'Commit, then run sgd with <code>--from deployed/prod --to HEAD</code>.',
          'Inspect both manifests: are all 3 changes represented?',
          'Validate against acme-prod with RunLocalTests, then deploy.',
          'Move the <code>deployed/prod</code> tag to HEAD.'
        ],
        verify: 'acme-prod has Priority__c, the updated class and no BadExample class.',
        challenge: 'Write a script that chooses RunSpecifiedTests by finding test classes for the changed Apex classes (naming convention <code>&lt;Class&gt;Test</code>).'
      },
      teach: ['This is the most valuable technical skill for large-org learners. Spend time on the "choosing --from" discussion.']
    },
    {
      t: 'Unlocked Packages: Modular, Versioned Salesforce',
      mins: 120, level: 'Advanced', tags: ['unlocked-packages', '2gp', 'modular'],
      obj: ['Create an unlocked package and versions', 'Install, upgrade and promote versions', 'Plan package dependencies and modular architecture'],
      analogy: { icon: '🧩', text: 'Instead of one giant jigsaw puzzle (the "happy soup" org), unlocked packages split your org into labelled puzzle boxes, such as "Projects", "Billing" and "Common". Each box has version numbers, so you can upgrade one box, or go back to the previous version, without touching the others.' },
      diagram: `
flowchart BT
  CORE["🧩 acme-core<br/>utilities, triggers fw"]
  PROJ["🧩 acme-projects<br/>Project__c, LWC"] --> CORE
  BILL["🧩 acme-billing"] --> CORE
  BILL --> PROJ
  ORG["☁️ Production"] -. "installs" .-> CORE & PROJ & BILL`,
      concepts: [
        ['Package vs version', 'A <b>package</b> is created once (0Ho ID). <b>Versions</b> (04t IDs) are immutable builds such as 1.2.0.NEXT.'],
        ['Beta vs promoted', 'Beta versions install only in scratch orgs and sandboxes. You must <code>promote</code> a version, which requires 75% coverage, before installing in production.'],
        ['Dependencies', 'Declared in sfdx-project.json, and must be installed in order.'],
        ['When to use packages', 'Use them for new, modular development and for shared components across orgs. Migrating a large existing org is a multi-quarter effort, and many teams run a hybrid.']
      ],
      code: [{ title: 'Package lifecycle', src: `
sf package create --name acme-projects --package-type Unlocked --path force-app --no-namespace --target-dev-hub acme-prod
sf package version create --package acme-projects --installation-key-bypass --code-coverage --wait 30
sf package version list --packages acme-projects
sf package install --package acme-projects@1.0.0-1 --target-org acme-scratch --wait 20
sf package version promote --package acme-projects@1.0.0-1
sf package install --package acme-projects@1.0.0-1 --target-org acme-prod --wait 20` },
        { title: 'sfdx-project.json (excerpt)', src: `
{
  "packageDirectories": [
    { "path": "force-app", "package": "acme-projects", "versionName": "Spring", "versionNumber": "1.0.0.NEXT", "default": true }
  ],
  "packageAliases": { "acme-projects": "0Ho..." }
}` }],
      quiz: [
        ['Can a beta package version be installed in production?', ['Yes', 'No, it must be promoted first'], 1, 'Only released (promoted) versions can be installed in production.'],
        ['What is the "happy soup"?', ['A packaging tool', 'Unstructured org metadata with no module boundaries', 'A scratch org feature', 'A Copado term'], 1, 'The term describes one big tangle of metadata.']
      ],
      lab: {
        title: 'Package acme-projects',
        goal: 'Create, version, install and upgrade an unlocked package.',
        steps: [
          'Create the package from <code>force-app</code> (Dev Hub: acme-prod).',
          'Create version 1.0.0 with <code>--code-coverage</code>.',
          'Install it in a fresh scratch org and verify that Project__c exists.',
          'Change the LWC, bump to 1.1.0.NEXT, create a new version and upgrade the scratch org.',
          'Run <code>sf package installed list</code> in the scratch org.',
          'Module 4 wrap-up: tag <code>v0.4.0</code>.'
        ],
        verify: 'The scratch org shows version 1.1.0 installed.',
        challenge: 'Split common code into an <code>acme-core</code> package and declare a dependency.'
      },
      teach: ['Do not oversell packages. Discuss hybrid approaches for brownfield orgs honestly.']
    }
  ]
});
