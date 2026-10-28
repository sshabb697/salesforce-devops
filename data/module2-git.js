COURSE.modules.push({
  title: 'Git & Version Control for Salesforce',
  icon: '🌿',
  color: '#2e844a',
  summary: 'Local repo → GitHub remote → PRs → branching → how each Salesforce sandbox maps to a branch. Step-by-step with visuals.',
  days: [
    {
      t: 'Create a Local Git Repository (Step by Step)',
      mins: 90, level: 'Beginner', tags: ['git', 'local-repo', 'commit', 'basics'],
      obj: [
        'Explain the three areas of Git with a picture',
        'Create a local repository from scratch with git init',
        'Stage files, commit them, and read history'
      ],
      analogy: { icon: '📸', text: 'Git is a photo album on your laptop. The working folder is your desk (messy drafts). Staging is choosing which photos go on the next page. A commit is gluing that page into the album with a caption. Nothing has been shared with the team yet — the album is still only on your laptop.' },
      diagramTitle: 'Picture 1 — The three areas (still on YOUR laptop only)',
      diagram: `
flowchart LR
  subgraph LAPTOP["💻 Your laptop"]
    WD["📝 Working folder<br/>files you edit"]
    ST["🗂️ Staging area<br/>chosen for next photo"]
    REPO["📚 Local repository<br/>.git / history"]
  end
  WD -- "1. git add" --> ST
  ST -- "2. git commit" --> REPO
  REPO -. "git restore" .-> WD`,
      diagramCaption: 'Today we only use the green LOCAL half. Push to Remote comes on Day 8.',
      images: [
        {
          title: 'Classic Git Workflow chart (start here)',
          text: 'Memorise the <b>four boxes</b> left to right: Working Directory → Staging Area → Local Repository → Remote Repository. Colour rows = command families (save, clone, undo, get changes, stash). Today you only use the first three boxes (Local). Remote is Day 8.',
          src: 'assets/images/git-workflow-reference.jpg',
          alt: 'Git Workflow chart showing Working Directory Staging Local Remote and commands between them',
          caption: 'Saving changes: git add → git commit → git push. Getting changes: git fetch → git merge (or git pull).',
          credit: 'Teaching reference (ByteByteGo-style Git Workflow).'
        },
        {
          title: 'Salesforce edition of the same map',
          text: 'Working Directory is where <code>sf project retrieve</code> drops metadata from a sandbox. Remote is the team source of truth on GitHub or Azure Repos — not the sandbox itself.',
          src: 'assets/images/git-workflow-salesforce.jpg',
          alt: 'Git Workflow for Salesforce DevOps infographic',
          caption: 'Hang this next to your sandbox ↔ branch map (Day 11).'
        },
        {
          title: 'Classroom poster (SVG — sharp on any screen)',
          text: 'Same four boxes as a clean projector poster you can also print.',
          src: 'assets/images/git-workflow.svg',
          alt: 'Git Workflow poster SVG',
          caption: 'Colour key: orange = save · blue = clone/checkout · green = undo · purple = get changes · pink = stash'
        }
      ],
      walkthrough: [
        {
          title: 'Create a project folder',
          text: 'Pick an empty folder. This will become your Salesforce project home.',
          diagram: `
flowchart LR
  A["📂 Desktop / projects"] --> B["📂 acme-salesforce<br/>(empty folder)"]`,
          code: { title: 'Terminal / PowerShell', src: `mkdir acme-salesforce
cd acme-salesforce
pwd   # confirm you are inside the folder` }
        },
        {
          title: 'Turn the folder into a Git repository',
          text: '<code>git init</code> creates a hidden <code>.git</code> folder. That folder IS the local repository (the photo album).',
          diagram: `
flowchart TB
  F["📂 acme-salesforce"] --> G["📂 .git  ← local repo lives here<br/>(do not edit by hand)"]
  F --> R["📄 README.md (you will create next)"]`,
          code: { title: 'Initialise', src: `git init
git status
# Expect: "On branch main" (or "master") and "No commits yet"` },
          tip: 'If Git says "master", rename once: <code>git branch -M main</code>. Teams standardise on <code>main</code>.'
        },
        {
          title: 'Create a file, then see Git notice it',
          text: 'Any new file starts as <b>untracked</b> (Git sees it but has not photographed it yet).',
          diagram: `
flowchart LR
  WD["Working folder<br/>README.md = untracked"] --> ST["Staging<br/>(empty)"]
  ST --> REPO["Local repo<br/>(no commits)"]`,
          code: { title: 'Create README', src: `echo "# Acme Salesforce" > README.md
git status
# Expect: Untracked files: README.md` }
        },
        {
          title: 'Stage → Commit (take the photo)',
          text: '<code>git add</code> chooses what goes in the next snapshot. <code>git commit</code> saves it forever in local history.',
          diagram: `
flowchart LR
  WD["Working"] -- "git add README.md" --> ST["Staging<br/>README.md"]
  ST -- "git commit -m ..." --> REPO["Local repo<br/>commit #1"]`,
          code: { title: 'First commit', src: `git add README.md
git status          # "Changes to be committed"
git commit -m "docs: add README"
git log --oneline   # one commit with a short id like a1b2c3d` }
        },
        {
          title: 'Make more commits so history has a story',
          text: 'Each commit should answer: what changed and why? Good messages help the whole team.',
          code: { title: 'More practice commits', src: `mkdir notes
echo "Dev, QA, UAT, Prod" > notes/environments.md
git add notes/environments.md
git commit -m "docs: capture environment list"

# Edit README.md in VS Code — add a one-line project description — then:
git add README.md
git commit -m "docs: expand README overview"

git log --oneline --graph` },
          tip: 'Message style: <code>feat:</code> / <code>fix:</code> / <code>docs:</code> + short description. Example: <code>feat(PROJ-12): add Budget__c</code>.'
        }
      ],
      concepts: [
        ['Working directory', 'The normal files you open in VS Code. Edit freely here.'],
        ['Staging area', 'A shopping basket of changes for the next commit. You can add only some files.'],
        ['Local repository (.git)', 'The full history on your machine. Commits stay here until you push (Day 8).'],
        ['HEAD', 'A pointer that says "you are currently looking at this commit / branch".']
      ],
      code: [{ title: 'Cheat sheet for today', src: `
git init
git status
git add <file-or-folder>
git commit -m "type: short message"
git log --oneline --graph
git diff                 # unstaged edits
git diff --staged        # staged edits
git restore <file>       # discard unstaged edits` }],
      quiz: [
        ['After `git commit`, where do the changes live?', ['Only on GitHub', 'In the local repository (.git) on your laptop', 'Deleted', 'In Salesforce'], 1, 'Commit is local. Push uploads later.'],
        ['What does `git add` do?', ['Uploads to GitHub', 'Moves changes into the staging area', 'Creates a branch', 'Deploys to a sandbox'], 1, 'Staging selects what the next commit will include.']
      ],
      lab: {
        title: 'Build a 4-commit local album',
        goal: 'Create acme-salesforce locally with at least 4 meaningful commits. Do NOT create GitHub yet.',
        steps: [
          ['Create folder and init.', 'mkdir acme-salesforce && cd acme-salesforce\ngit init\ngit branch -M main'],
          ['Commit README.', 'echo "# Acme Salesforce" > README.md\ngit add README.md\ngit commit -m "docs: add README"'],
          'Add <code>notes/environments.md</code> with your Day 2 environment ideas and commit.',
          'Edit README twice more; commit after each edit with clear messages.',
          ['Show the album.', 'git log --oneline --graph'],
          'Edit a file, then discard the edit with <code>git restore</code>.'
        ],
        verify: '<code>git log --oneline</code> shows ≥ 4 commits. There is still no GitHub remote (<code>git remote -v</code> is empty).',
        challenge: 'Use <code>git add -p</code> to stage only part of a file.'
      },
      teach: [
        'Open the master poster full-screen first. Point to each of the four boxes before any commands.',
        'Cover the Remote box with a sticky note for Day 6 — reveal it on Day 8.',
        'Draw three boxes on the whiteboard and move sticky notes: Working → Staging → Repo.',
        'Say out loud: "Commit is NOT upload." Repeat until the class nods.',
        'Optional live demo of VS Code Source Control panel next to the terminal commands.'
      ]
    },
    {
      t: 'Branches: Parallel Work Without Breaking main',
      mins: 90, level: 'Beginner', tags: ['git', 'branch', 'merge'],
      obj: [
        'Create and switch branches safely',
        'Explain feature branches with a picture',
        'Merge a finished feature back into main'
      ],
      analogy: { icon: '🛤️', text: 'main is the busy highway. A branch is a side road where you build a new exit without closing the highway. When the exit is ready and inspected, you open it onto the highway (merge). Other drivers keep moving the whole time.' },
      diagramTitle: 'Picture — Feature branch beside main',
      diagram: `
gitGraph
  commit id: "start"
  commit id: "README"
  branch feature-project
  checkout feature-project
  commit id: "add Project object"
  commit id: "add fields"
  checkout main
  commit id: "docs tweak"
  merge feature-project
  commit id: "ready"`,
      walkthrough: [
        {
          title: 'See where you are',
          text: 'Always know your current branch before editing.',
          code: { title: 'Check branch', src: `git branch
git status
# Expect: "* main" (the star = current branch)` }
        },
        {
          title: 'Create a feature branch and switch to it',
          text: 'Name branches by story: <code>feature/PROJ-12-project-object</code>. Short-lived branches are easier to merge.',
          diagram: `
flowchart LR
  M["main"] --> F["feature/PROJ-12-project-object<br/>(you work here)"]
  M --> M2["main stays untouched"]`,
          code: { title: 'Create + switch', src: `git switch -c feature/PROJ-12-project-object
git branch
# Expect: * feature/PROJ-12-project-object` }
        },
        {
          title: 'Commit work only on the feature branch',
          text: 'Edits + commits on the feature branch do not change main until you merge.',
          code: { title: 'Work on the branch', src: `echo "Project__c coming soon" >> README.md
git add README.md
git commit -m "docs: note Project object work"
git log --oneline --graph --all` }
        },
        {
          title: 'Merge into main (join the side road to the highway)',
          text: 'Switch back to main, then merge the feature branch. If main had no new commits, Git may fast-forward.',
          diagram: `
flowchart LR
  F["feature/..."] -- "git merge" --> M["main"]`,
          code: { title: 'Merge', src: `git switch main
git merge feature/PROJ-12-project-object
git log --oneline --graph --all
git branch -d feature/PROJ-12-project-object   # delete only after merge` }
        },
        {
          title: 'Naming rules for Salesforce teams',
          text: 'Use prefixes so pipelines and humans understand intent: <code>feature/</code>, <code>bugfix/</code>, <code>hotfix/</code>. Long-lived environment branches (<code>develop</code>, <code>uat</code>, <code>main</code>) come on Day 11.',
          tip: 'Never do large unfinished work directly on <code>main</code>. That is how releases break.'
        }
      ],
      concepts: [
        ['Branch', 'A movable label pointing at a commit. Cheap to create.'],
        ['Fast-forward merge', 'main simply moves forward when nothing else changed on main.'],
        ['Three-way merge', 'When both branches moved, Git creates a merge commit with two parents.'],
        ['Why branches matter for Salesforce', 'Two admins can build different features in different sandboxes, and Git still keeps one shared history when both merge.']
      ],
      code: [{ title: 'Branch cheat sheet', src: `
git switch -c feature/PROJ-1-short-name
git switch main
git merge feature/PROJ-1-short-name
git branch -d feature/PROJ-1-short-name
git log --oneline --graph --all` }],
      quiz: [
        ['Why create a feature branch?', ['To deploy faster', 'To isolate work without disturbing main', 'GitHub requires it for login', 'To skip tests'], 1, 'Isolation is the point of branches.'],
        ['When does a fast-forward happen?', ['Always', 'When the target branch has no new commits since you branched', 'Only on conflicts', 'Never'], 1, 'No divergence → Git just moves the pointer.']
      ],
      lab: {
        title: 'Two features in parallel',
        goal: 'Simulate two developers with two branches, then merge both into main.',
        steps: [
          'From main, create <code>feature/PROJ-1-readme-badges</code>, edit README, commit.',
          'Switch to main, create <code>feature/PROJ-2-env-docs</code>, edit notes/environments.md, commit.',
          'Merge PROJ-1 into main.',
          'Merge PROJ-2 into main.',
          ['Draw the result.', 'git log --oneline --graph --all'],
          'Delete both feature branches after successful merge.'
        ],
        verify: 'Graph shows both features in main history.',
        challenge: 'Repeat one merge with <code>git merge --no-ff</code> and compare the graph.'
      },
      teach: [
        'Use <a href="https://learngitbranching.js.org" target="_blank">learngitbranching.js.org</a> for 10 minutes live.',
        'Ask: "What goes wrong if everyone commits only to main?" Write answers on the board.'
      ]
    },
    {
      t: 'Create a Remote Repo & Connect Local ↔ GitHub',
      mins: 100, level: 'Beginner', tags: ['github', 'remote', 'push', 'pull', 'origin'],
      obj: [
        'Create an empty repository on GitHub',
        'Connect local repo to remote with git remote add',
        'Push and pull confidently and explain fetch vs pull'
      ],
      analogy: { icon: '☁️', text: 'Your laptop album is private. GitHub is the shared family album in the cloud. Connecting them is writing the cloud album\'s address in your address book (remote name: origin). Push uploads your new pages. Pull downloads everyone else\'s pages.' },
      diagramTitle: 'Picture — Local and remote are two copies of the same album',
      diagram: `
flowchart LR
  subgraph LOCAL["💻 Local (your laptop)"]
    L["📚 .git history<br/>branch: main"]
  end
  subgraph REMOTE["☁️ GitHub remote"]
    R["📚 acme-salesforce.git<br/>branch: main"]
  end
  L -- "git push" --> R
  R -- "git pull / fetch" --> L
  L -. "git remote add origin URL" .- R`,
      diagramCaption: 'Connectivity = telling local Git the remote URL, then push/pull.',
      images: [
        {
          title: 'Classic chart — focus on push / fetch / pull',
          text: 'Cover the Local-only rows with your hand. Trace <b>orange git push</b> (Saving changes) and <b>purple git fetch / merge / pull</b> (Getting changes). That is today\'s connectivity.',
          src: 'assets/images/git-workflow-reference.jpg',
          alt: 'Classic Git workflow showing push fetch pull',
          caption: 'push uploads commits. fetch downloads info. pull = fetch + merge into your working files.',
          credit: 'Teaching reference (ByteByteGo-style Git Workflow).'
        },
        {
          title: 'Salesforce edition — where Remote fits',
          text: 'After push, GitHub/Azure Repos holds the shared history. Later, CI clones/pulls this remote and deploys to QA/UAT/Prod sandboxes.',
          src: 'assets/images/git-workflow-salesforce.jpg',
          alt: 'Git Workflow for Salesforce showing remote repository',
          caption: 'Remote ≠ Salesforce org. Remote is Git. Orgs are deployment targets (Day 11 map).'
        },
        {
          title: 'Classroom poster (SVG)',
          text: 'Same map as a sharp projector/print poster.',
          src: 'assets/images/git-workflow.svg',
          alt: 'Git Workflow poster highlighting local to remote push and pull',
          caption: 'Trace: commit stays local → push uploads → fetch/pull downloads.'
        }
      ],
      walkthrough: [
        {
          title: 'Create an EMPTY repo on GitHub (do this first)',
          text: 'On github.com → New repository. Name: <code>acme-salesforce</code>. Visibility: Private is fine. <b>Do not</b> add README, .gitignore, or license — your local repo already has commits. Adding a README creates a different first commit and causes a push rejection.',
          diagram: `
flowchart TB
  A["GitHub → New repository"] --> B["Name: acme-salesforce"]
  B --> C["❌ Uncheck README / .gitignore / license"]
  C --> D["Create repository"]
  D --> E["Copy the HTTPS URL<br/>https://github.com/YOU/acme-salesforce.git"]`,
          tip: 'If you accidentally created a README on GitHub, either delete that file on GitHub or use <code>git pull origin main --allow-unrelated-histories</code> once (advanced). Prefer empty remote.'
        },
        {
          title: 'Add the remote address to your local repo',
          text: '<code>origin</code> is just a nickname for the GitHub URL. You can have more remotes later (Azure DevOps as <code>ado</code>, for example).',
          diagram: `
flowchart LR
  L["💻 Local repo"] -- "git remote add origin URL" --> BOOK["Address book<br/>origin = GitHub URL"]`,
          code: { title: 'Connect', src: `cd acme-salesforce
git remote add origin https://github.com/<YOUR_USER>/acme-salesforce.git
git remote -v
# Expect two lines (fetch + push) pointing at the same URL` }
        },
        {
          title: 'Push local main to GitHub (first upload)',
          text: '<code>-u</code> sets upstream tracking so later you can type just <code>git push</code> / <code>git pull</code>.',
          diagram: `
sequenceDiagram
  participant L as 💻 Local main
  participant G as ☁️ GitHub
  L->>G: git push -u origin main
  G-->>L: main is now on GitHub`,
          code: { title: 'First push', src: `git push -u origin main
# Refresh github.com/.../acme-salesforce — you should see your files` },
          warn: 'Authentication: GitHub no longer accepts account passwords for Git. Use a Personal Access Token (HTTPS) or SSH keys. VS Code / Git Credential Manager will prompt you.'
        },
        {
          title: 'Prove the two-way connection (pull / fetch)',
          text: 'Make a tiny edit on GitHub in the browser (edit README → Commit). Then bring it down to your laptop.',
          diagram: `
flowchart LR
  G["☁️ GitHub<br/>README edited in browser"] -- "git pull" --> L["💻 Local<br/>updated README"]`,
          code: { title: 'Fetch vs pull', src: `git fetch origin          # download info, do not change your files yet
git status               # may say "Your branch is behind"
git pull                 # fetch + merge into your current branch
# Now local README matches GitHub` },
          tip: '<b>fetch</b> = look at the cloud album without changing yours. <b>pull</b> = look and also paste the new pages into yours.'
        },
        {
          title: 'Everyday sync picture (memorise this)',
          text: 'Before starting work: pull. After finishing commits: push. Never leave commits only on one laptop for days.',
          diagram: `
flowchart TB
  S["🌅 Start of day"] --> P["git pull"]
  P --> W["💻 Work + commit"]
  W --> U["git push"]
  U --> E["🌆 End of day — team can see it"]`
        }
      ],
      concepts: [
        ['Remote', 'A server copy of the repo (usually GitHub or Azure Repos).'],
        ['origin', 'Default nickname for your main remote URL.'],
        ['Upstream (-u)', 'Links your local branch to origin/branch so push/pull know the destination.'],
        ['Clone vs init', '<code>git clone URL</code> downloads an existing remote AND sets origin for you. Today you used init + remote add because the local repo already existed.']
      ],
      code: [{ title: 'Remote cheat sheet', src: `
git remote add origin https://github.com/USER/REPO.git
git remote -v
git push -u origin main
git fetch origin
git pull
git clone https://github.com/USER/REPO.git   # alternative starting point` }],
      pitfall: 'Pushing when GitHub already has a different first commit (README created on website). Always create an empty remote when connecting an existing local repo.',
      quiz: [
        ['What does `git remote add origin URL` do?', ['Uploads files', 'Saves the remote URL under the name origin', 'Creates a branch', 'Deploys to Salesforce'], 1, 'It only writes the address. Push uploads.'],
        ['`git fetch` vs `git pull`?', ['They are identical', 'fetch downloads without merging; pull = fetch + merge', 'pull deletes remote', 'fetch uploads'], 1, 'fetch is safe inspection; pull updates your branch.']
      ],
      lab: {
        title: 'Wire laptop ↔ GitHub',
        goal: 'Connect your Day 6 local repo to a brand-new empty GitHub repo and sync both ways.',
        steps: [
          'Create empty GitHub repo <code>acme-salesforce</code> (no README).',
          ['Add origin and push main.', 'git remote add origin https://github.com/<YOU>/acme-salesforce.git\ngit push -u origin main'],
          'Confirm files appear on GitHub in the browser.',
          'Edit README on GitHub in the browser and commit.',
          ['Pull the browser change locally.', 'git pull'],
          'Make a local commit, push, and refresh GitHub.'
        ],
        verify: '<code>git remote -v</code> shows origin. Local and GitHub README match. History exists on both sides.',
        challenge: 'Create a second remote named <code>backup</code> pointing at another empty repo and <code>git push backup main</code>.'
      },
      teach: [
        'Bring back the Day 6 poster and uncover the Remote box with a flourish.',
        'Live-create the GitHub repo on the projector. Emphasise "no README".',
        'Help each student through auth (PAT vs SSH) — this is the #1 classroom blocker.',
        'Ask a student to explain fetch vs pull in one sentence to a non-technical peer while pointing at the purple arrows.'
      ]
    },
    {
      t: 'Pull Requests End-to-End (Create, Review, Merge)',
      mins: 100, level: 'Beginner', tags: ['pull-request', 'code-review', 'github'],
      obj: [
        'Open a Pull Request from a feature branch',
        'Review a PR using a Salesforce-aware checklist',
        'Merge with squash and update local main'
      ],
      analogy: { icon: '🛂', text: 'A Pull Request is a passport control gate. You finished building on a side road (feature branch). Before joining the highway (main), an officer reviews your papers (diff), scanners run (CI checks), and only then the barrier lifts (merge).' },
      diagramTitle: 'Picture — The PR lifecycle',
      diagram: `
sequenceDiagram
  participant Dev as 👩‍💻 You
  participant GH as ☁️ GitHub
  participant Rev as 🧑‍⚖️ Reviewer
  participant CI as ⚙️ Checks
  Dev->>Dev: git switch -c feature/...
  Dev->>Dev: commit work
  Dev->>GH: git push -u origin feature/...
  Dev->>GH: Open Pull Request → main
  GH->>CI: run checks
  CI-->>GH: pass / fail
  Rev->>GH: review comments + approve
  GH->>GH: Merge (squash)
  Dev->>Dev: git switch main && git pull`,
      walkthrough: [
        {
          title: 'Start from an up-to-date main',
          text: 'Always branch from the latest shared main so your PR is small and clean.',
          code: { title: 'Update then branch', src: `git switch main
git pull
git switch -c feature/PROJ-3-contributing` }
        },
        {
          title: 'Commit your change on the feature branch',
          text: 'Example: add team rules in CONTRIBUTING.md (branch naming, PR rules).',
          code: { title: 'Commit', src: `# Create CONTRIBUTING.md in VS Code with:
#   # Contributing
#   - Branch: feature/PROJ-##-name
#   - Open a PR for every change
#   - Squash merge into main
git add CONTRIBUTING.md
git commit -m "docs: add contributing guide"` }
        },
        {
          title: 'Push the branch to GitHub',
          text: 'The branch must exist on the remote before GitHub can open a PR.',
          diagram: `
flowchart LR
  L["💻 feature/PROJ-3-..."] -- "git push -u origin HEAD" --> G["☁️ same branch on GitHub"]`,
          code: { title: 'Push branch', src: `git push -u origin feature/PROJ-3-contributing
# GitHub often prints a "create a pull request" URL — open it` }
        },
        {
          title: 'Open the Pull Request on GitHub',
          text: 'base = <code>main</code> (where changes go). compare = your feature branch. Fill What / Why / How to test.',
          diagram: `
flowchart LR
  C["compare: feature/PROJ-3"] --> PR["🔀 Pull Request"]
  PR --> B["base: main"]`,
          tip: 'Good PR description example:<br/>What: Add CONTRIBUTING.md<br/>Why: Standardise branch and PR habits<br/>How to test: Read the file; no Salesforce deploy needed.'
        },
        {
          title: 'Review (human + checklist)',
          text: 'Reviewer opens Files changed, comments on lines, then Approves. For Salesforce metadata later, check: hardcoded IDs, SOQL in loops, missing tests, huge Profiles, unexpected files.',
          code: { title: 'Salesforce PR review checklist (save this)', src: `
[ ] No hardcoded record IDs
[ ] No SOQL/DML inside loops
[ ] Tests included for Apex changes
[ ] Permission sets preferred over fat Profiles
[ ] Only intended metadata in the diff
[ ] Destructive intent called out if deleting components` }
        },
        {
          title: 'Merge, then update your laptop',
          text: 'Prefer Squash and merge for feature work (one clean commit on main). Delete the branch on GitHub when offered.',
          diagram: `
flowchart LR
  PR["PR approved"] --> M["Squash merge into main"]
  M --> L["💻 git switch main && git pull"]`,
          code: { title: 'After merge on GitHub', src: `git switch main
git pull
git branch -d feature/PROJ-3-contributing
git log --oneline -5` }
        }
      ],
      concepts: [
        ['Pull Request (PR)', 'A request to merge one branch into another with discussion, review and checks.'],
        ['Base vs compare', 'Base = destination branch. Compare = source branch with your commits.'],
        ['Squash merge', 'Combines your feature commits into one commit on main — cleaner history for features.'],
        ['Why PRs matter in Salesforce DevOps', 'They are the audit trail and quality gate before anything reaches a shared sandbox or production via CI.']
      ],
      quiz: [
        ['In a PR, the base branch is…', ['Your feature branch', 'The branch you want to merge INTO (e.g. main)', 'Always develop', 'The remote URL'], 1, 'Base is the destination.'],
        ['After a PR merges on GitHub, your laptop main is updated by…', ['Magic', 'git switch main && git pull', 'git init', 'Opening Salesforce'], 1, 'You must pull the merged result.']
      ],
      lab: {
        title: 'Your first real PR cycle',
        goal: 'Push a feature branch, open a PR, review, squash-merge, and sync local main.',
        steps: [
          'Update main, create <code>feature/PROJ-3-contributing</code>, add CONTRIBUTING.md, commit.',
          'Push the branch and open a PR into main.',
          'Write What / Why / How to test in the PR body.',
          'Have a classmate review (or self-review with an inline comment, then resolve it).',
          'Squash and merge; delete the remote branch.',
          ['Sync local.', 'git switch main && git pull && git branch -d feature/PROJ-3-contributing']
        ],
        verify: 'GitHub shows a merged PR. Local main contains CONTRIBUTING.md.',
        challenge: 'Add <code>.github/pull_request_template.md</code> with What/Why/How to test headings.'
      },
      teach: [
        'Pair students as author/reviewer and swap.',
        'Show Merge / Squash / Rebase options and the resulting history on a second projector tab.'
      ]
    },
    {
      t: 'Merge Conflicts in Salesforce Metadata (and how to resolve them)',
      mins: 120, level: 'Intermediate', tags: ['conflicts', 'rebase', 'xml', 'salesforce'],
      obj: [
        'Cause and resolve a real XML conflict',
        'Know which Salesforce files conflict most',
        'Choose merge vs rebase safely'
      ],
      analogy: { icon: '✍️', text: 'Two people edit the same sentence. One writes Blue, the other Green. Git cannot pick a colour, so it highlights both and asks a human. Conflicts are normal — they mean two people cared about the same file.' },
      diagramTitle: 'Picture — Two branches editing the same picklist',
      diagram: `
flowchart TB
  M["main: Status = Open, Closed"] --> A["Dev A branch: adds On Hold"]
  M --> B["Dev B branch: adds Cancelled"]
  A --> X{"⚔️ Conflict in<br/>Status__c.field-meta.xml"}
  B --> X
  X --> R["🧑 Resolve: keep all four values"]
  R --> OK["✅ Commit the resolution"]`,
      walkthrough: [
        {
          title: 'Recognise conflict markers',
          text: 'When Git stops a merge, open the file. Markers show both sides.',
          code: { title: 'Markers you will see', src: `<<<<<<< HEAD
    (your current branch version)
=======
    (incoming branch version)
>>>>>>> feature/other-branch` }
        },
        {
          title: 'Salesforce hot-spot files (teach this list)',
          text: 'These conflict often because many people touch the same XML: Profiles, Permission Set Groups sometimes, Layouts, FlexiPages, Custom Labels, picklist fields, Flows. Prefer permission sets over profiles; assign Flow ownership per sprint.',
          warn: 'After resolving XML, always validate or deploy — a "both sides kept" merge can produce invalid XML.'
        },
        {
          title: 'Resolve in VS Code Merge Editor',
          text: 'Accept Current / Incoming / Both, then delete leftover markers, save, <code>git add</code> the file, <code>git commit</code>.'
        },
        {
          title: 'Rebase rule of thumb',
          text: 'Rebase your own unpushed (or sole-owner) feature branch onto latest main for a straight history. Never rebase a shared branch others already pulled.',
          code: { title: 'Safe rebase pattern', src: `git fetch origin
git switch feature/my-only-branch
git rebase origin/main
# fix conflicts if any → git add → git rebase --continue
git push --force-with-lease   # only because YOU own this branch` }
        }
      ],
      concepts: [
        ['Conflict', 'Same lines changed differently on two branches. Human must choose.'],
        ['Merge vs rebase', 'Merge preserves branch topology. Rebase replays your commits on top of another branch.'],
        ['force-with-lease', 'Safer than --force: refuses to overwrite if someone else pushed to your branch.'],
        ['Prevention', 'Small PRs, frequent pulls, avoid fat Profiles, one person per Flow when possible.']
      ],
      code: [{ title: 'Conflict recovery', src: `
git switch feature/PROJ-5
git merge main                 # or: git rebase origin/main
# edit files, remove markers
git add path/to/resolved.xml
git commit                     # if merging
# git rebase --continue        # if rebasing` }],
      pitfall: 'Keeping both conflict blocks without checking the XML is still valid.',
      quiz: [
        ['When must you NOT rebase?', ['On your private feature branch', 'On a shared branch others pulled', 'Before a PR', 'On a docs-only change'], 1, 'Rewriting shared history breaks teammates.'],
        ['Which metadata conflicts most?', ['Apex test classes', 'Profiles, layouts, labels, picklists, Flows', 'README only', 'Static resources'], 1, 'Shared XML blobs are hot spots.']
      ],
      lab: {
        title: 'Create and fix a picklist conflict',
        goal: 'Intentionally conflict on Status__c and resolve to four values.',
        steps: [
          ['On main, add Status__c with Open + Closed and commit.', `mkdir -p force-app/main/default/objects/Project__c/fields
# create Status__c.field-meta.xml with Open and Closed, then:
git add force-app && git commit -m "feat: add Status__c picklist"`],
          'Branch <code>feature/on-hold</code>: insert On Hold, commit.',
          'From main, branch <code>feature/cancelled</code>: insert Cancelled, commit.',
          'Merge on-hold into main, then merge cancelled → conflict.',
          'Resolve so values are Open, On Hold, Cancelled, Closed with no markers.',
          'Optional: repeat with rebase instead of merge.'
        ],
        verify: 'File has four values, no markers. <code>git log --graph</code> shows the resolution.',
        challenge: 'Configure VS Code as the merge tool.'
      },
      teach: [
        'Normalise fear: conflicts are a communication signal.',
        'Live-resolve one conflict with the class calling out which side to keep.'
      ]
    },
    {
      t: 'Branching Strategy & How Salesforce Sandboxes Link to Branches',
      mins: 120, level: 'Advanced', tags: ['branching-strategy', 'sandbox', 'environment-branches', 'salesforce'],
      obj: [
        'Map each long-lived Git branch to a Salesforce org/sandbox',
        'Explain the promote path: feature → develop → uat → main',
        'Document a hotfix path that does not break the release train'
      ],
      analogy: { icon: '🏭', text: 'Think of a factory line. Each Git branch is a conveyor belt. Each Salesforce sandbox is a workstation on that belt. Work starts on a developer\'s private belt (feature branch + Dev sandbox), moves to the QA workstation (develop → QA sandbox), then UAT, then the customer floor (main → Production). The belt and the workstation must stay in sync, or you ship the wrong product.' },
      diagramTitle: 'Picture 1 — The golden map: Branch ↔ Salesforce org',
      diagram: `
flowchart TB
  subgraph GIT["🌿 GitHub branches"]
    F["feature/PROJ-12<br/>short-lived"]
    D["develop"]
    U["uat / release/*"]
    M["main"]
    H["hotfix/*"]
  end
  subgraph SF["☁️ Salesforce orgs"]
    DEV["👩‍💻 Dev sandbox / Scratch org"]
    QA["🧪 QA / Integration sandbox"]
    UATS["🎭 UAT sandbox"]
    PROD["🌍 Production"]
  end
  F -->|"retrieve / deploy while building"| DEV
  F -->|"PR merge"| D
  D -->|"CI deploys on merge"| QA
  D -->|"PR promote"| U
  U -->|"CI deploys"| UATS
  U -->|"PR promote"| M
  M -->|"CI deploys"| PROD
  H -->|"emergency PR"| M
  M -. "back-merge hotfix" .-> D`,
      diagramCaption: 'One long-lived branch ↔ one shared environment. Feature branches are temporary and usually pair with a personal Dev sandbox or scratch org.',
      images: [
        {
          title: 'How this connects to the Day 6 Git poster',
          text: 'On the Git Workflow poster, <b>Remote Repository</b> holds branches (<code>develop</code>, <code>uat</code>, <code>main</code>). Each of those branches is what CI deploys into the matching sandbox below. The poster moves files inside Git; this map moves Git into Salesforce.',
          src: 'assets/images/git-workflow.svg',
          alt: 'Git Workflow poster linking remote repo to Salesforce environments',
          caption: 'Remote (Git) ≠ sandbox (Salesforce). Pipelines bridge them with sf project deploy.'
        }
      ],
      diagrams: [
        {
          title: 'Picture 2 — What happens when a developer starts a story',
          src: `
sequenceDiagram
  participant Dev as 👩‍💻 Developer
  participant Git as 🌿 GitHub
  participant SB as 💻 Dev sandbox
  Dev->>Git: git switch main && git pull
  Dev->>Git: git switch -c feature/PROJ-12
  Dev->>SB: Build clicks / Apex in Dev sandbox
  Dev->>Dev: sf project retrieve start (pull metadata to laptop)
  Dev->>Git: git add / commit / push feature branch
  Dev->>Git: Open PR → develop`,
          caption: 'Sandbox holds the live metadata while you build. Git holds the versioned source of truth after you retrieve and commit.'
        },
        {
          title: 'Picture 3 — Promotion through environments (release train)',
          src: `
flowchart LR
  A["✅ PR merge to develop"] --> B["🤖 CI deploys → QA sandbox"]
  B --> C["✅ PR develop → uat"]
  C --> D["🤖 CI deploys → UAT sandbox"]
  D --> E["🛂 Approval"]
  E --> F["✅ PR uat → main"]
  F --> G["🤖 CI deploys → Production"]`
        }
      ],
      walkthrough: [
        {
          title: 'Write the mapping table (do this with your team)',
          text: 'Print this table and hang it near the team. Every Salesforce DevOps conversation starts here.',
          code: { title: 'Branch ↔ Org map (Acme example)', src: `
Git branch          Salesforce org              Who merges / deploys
---------------     --------------------------  -------------------------
feature/*           Personal Dev sandbox or     Developer (retrieve/commit)
                    scratch org
develop             QA / Integration sandbox    Team via PR; CI auto-deploy
uat (or release/*)  UAT sandbox                 Release manager via PR; CI
main                Production                  Release manager + approval; CI
hotfix/*            from main → Prod fast       On-call + approval; then
                                                back-merge to develop/uat` }
        },
        {
          title: 'Create the long-lived branches once',
          text: 'These branches live for months/years. Feature branches are created/deleted every story.',
          diagram: `
gitGraph
  commit id: "init"
  branch develop
  checkout develop
  commit id: "qa baseline"
  checkout main
  branch uat
  checkout uat
  commit id: "uat baseline"
  checkout main
  commit id: "prod baseline"`,
          code: { title: 'Create environment branches', src: `git switch main
git pull
git switch -c develop
git push -u origin develop
git switch main
git switch -c uat
git push -u origin uat
# main already exists and tracks Production` }
        },
        {
          title: 'Story flow (happy path) — follow with your finger on Picture 1',
          text: '1) Branch from develop (or main in trunk-based). 2) Build in Dev sandbox. 3) Retrieve → commit → push. 4) PR into develop → CI deploys QA. 5) After QA sign-off, PR develop→uat → CI deploys UAT. 6) After business sign-off, PR uat→main → CI deploys Prod.',
          tip: 'Admins: you still use sandboxes for clicks. The new habit is: retrieve the change into Git before asking anyone to promote it.'
        },
        {
          title: 'Hotfix path (ambulance lane)',
          text: 'Production is broken. Do not wait for the full train.',
          diagram: `
flowchart LR
  P["main / Prod bug"] --> H["hotfix/PROJ-99 from main"]
  H --> PR["PR → main (expedited review)"]
  PR --> DEP["CI → Production"]
  DEP --> BM["Back-merge main → uat and develop"]`,
          warn: 'If you skip the back-merge, the next normal release can overwrite the hotfix.'
        },
        {
          title: 'Why Git is the source of truth (not the sandbox)',
          text: 'Sandboxes get refreshed, overwritten and drifted. Git remembers every reviewed change. Pipelines deploy FROM Git TO the org. That is why we map branches carefully: the branch says what SHOULD be in that org.',
          diagram: `
flowchart LR
  G["🌿 Git branch uat<br/>source of truth"] -- "sf project deploy" --> O["☁️ UAT sandbox<br/>deployment target"]
  O -. "refresh / manual clicks can drift" .-> G`
        }
      ],
      concepts: [
        ['Environment branch', 'A long-lived branch that mirrors one shared Salesforce environment (develop↔QA, uat↔UAT, main↔Prod).'],
        ['Feature branch', 'Short-lived. Usually paired with a personal Dev sandbox or scratch org. Deleted after merge.'],
        ['Promotion', 'Moving work to the next environment by merging Git branches (and letting CI deploy), not by rebuilding with change sets.'],
        ['Back-merge / back-promotion', 'Copying production hotfixes back into lower branches/orgs so they stay aligned.'],
        ['Drift', 'When an org no longer matches its branch (manual Setup changes, missed deploys). Detect with validate/retrieve diffs later in the course.']
      ],
      code: [{ title: 'docs/branching-strategy.md (starter)', src: `
# Acme branching strategy

## Branch ↔ org
| Branch | Org | Deploy trigger |
|--------|-----|----------------|
| feature/* | Dev sandbox / scratch | Manual (dev) |
| develop | QA | PR merge → CI |
| uat | UAT | PR merge → CI |
| main | Production | PR merge → CI + approval |

## Rules
1. No direct commits to develop, uat, or main.
2. Every change goes through a Pull Request.
3. Hotfixes branch from main and back-merge to uat + develop the same day.
4. Sandbox refreshes follow the release calendar; re-deploy from Git after refresh.` }],
      pitfall: 'Treating each sandbox as its own source of truth and only "remembering" to commit later. Two people will overwrite each other and Git will not save you if the work never entered Git.',
      quiz: [
        ['In the environment-branch model, `main` usually maps to…', ['A personal Dev sandbox', 'QA', 'UAT', 'Production'], 3, 'main is the production line.'],
        ['After a hotfix reaches Production, you must…', ['Delete develop', 'Back-merge into uat and develop', 'Refresh Production', 'Disable CI'], 1, 'Lower branches must receive the fix or the next release undoes it.'],
        ['Feature branches are best paired with…', ['Production', 'A personal Dev sandbox or scratch org', 'Only UAT', 'No org at all'], 1, 'Build in an isolated org, commit to an isolated branch.']
      ],
      lab: {
        title: 'Stand up the Salesforce branch ↔ sandbox map',
        goal: 'Create environment branches, document the map, and simulate one feature + one hotfix.',
        steps: [
          'Write <code>docs/branching-strategy.md</code> using the starter table (customise names to your real sandboxes).',
          ['Create and push <code>develop</code> and <code>uat</code>.', 'git switch main\ngit switch -c develop && git push -u origin develop\ngit switch main\ngit switch -c uat && git push -u origin uat'],
          'Simulate a feature: branch from develop → commit a doc change → PR into develop → merge.',
          'Promote: open PR develop → uat → merge. Then PR uat → main → merge.',
          'Simulate hotfix: branch from main, commit, PR to main, merge, then merge main back into uat and develop.',
          'Draw your final map on paper: each branch box linked to a sandbox box (like Picture 1).'
        ],
        verify: 'GitHub has develop, uat, main. Docs describe the map. Hotfix exists on all three long-lived branches.',
        challenge: 'Add a section: "What we do after a Full sandbox refresh" (redeploy from the matching branch).'
      },
      teach: [
        'Print Picture 1 full-screen. Have learners walk a sticky note (a user story) along the arrows.',
        'Debate: environment branches vs trunk-based. For most Salesforce admin-heavy teams, environment branches are easier to start with.',
        'Ask each student to fill the mapping table for THEIR company sandboxes.'
      ]
    },
    {
      t: 'Git Hygiene for Salesforce: Ignore Files, Protection & CODEOWNERS',
      mins: 90, level: 'Intermediate', tags: ['forceignore', 'gitignore', 'codeowners', 'branch-protection'],
      obj: [
        'Configure .gitignore and .forceignore correctly',
        'Lock main/develop with branch protection',
        'Route sensitive metadata reviews with CODEOWNERS'
      ],
      analogy: { icon: '🧹', text: 'Ignore files are a do-not-pack list when moving house. Branch protection is a door that needs two keys. CODEOWNERS says the electrician must sign off before anyone rewires the house.' },
      diagramTitle: 'Picture — Protected merge into main',
      diagram: `
flowchart LR
  PR["🔀 PR → main"] --> G1{"Reviews ≥ 1?"}
  G1 -- yes --> G2{"CODEOWNERS OK?"}
  G2 -- yes --> G3{"CI green?"}
  G3 -- yes --> M["✅ Merge"]
  G1 -- no --> X["⛔"]
  G2 -- no --> X
  G3 -- no --> X`,
      walkthrough: [
        {
          title: 'Add .gitignore (Git should not track junk)',
          text: 'Keeps local tool folders and secrets patterns out of Git history.',
          code: { title: '.gitignore', src: `
.sf/
.sfdx/
node_modules/
coverage/
test-results/
*.log
.DS_Store
*.key
server.key
.env` }
        },
        {
          title: 'Add .forceignore (CLI should not deploy junk)',
          text: 'Different file! Git ignore ≠ Salesforce deploy ignore.',
          code: { title: '.forceignore', src: `
**/jsconfig.json
**/.eslintrc.json
**/__tests__/**
**/*.dup
# **/profiles/**   # uncomment if you manage access via permission sets only` },
          tip: '<code>.gitignore</code> = what Git stores. <code>.forceignore</code> = what <code>sf project retrieve/deploy</code> includes.'
        },
        {
          title: 'Turn on branch protection for main (and develop)',
          text: 'GitHub → Settings → Branches → Add rule: require PR, require 1 approval, block force pushes. Optionally require status checks once CI exists (Module 5).'
        },
        {
          title: 'Add CODEOWNERS for sensitive paths',
          text: 'Permission sets and profiles need security eyes.',
          code: { title: '.github/CODEOWNERS', src: `
*                                       @your-username
/force-app/main/default/permissionsets/ @your-username
/force-app/main/default/profiles/       @your-username
/.github/workflows/                     @your-username` }
        }
      ],
      concepts: [
        ['.gitignore', 'Stops files entering Git.'],
        ['.forceignore', 'Stops files entering Salesforce retrieve/deploy.'],
        ['Branch protection', 'Enforces PR + review (+ CI) before merge.'],
        ['CODEOWNERS', 'Auto-requests reviewers for matching paths.']
      ],
      quiz: [
        ['Which file controls Salesforce retrieve/deploy exclusion?', ['.gitignore', '.forceignore', 'CODEOWNERS', 'README'], 1, '.forceignore is for the Salesforce CLI.'],
        ['Branch protection should block…', ['All commits everywhere', 'Direct pushes / force pushes to main without a PR', 'Feature branches', 'Scratch orgs'], 1, 'Protect shared environment branches.']
      ],
      lab: {
        title: 'Lock the repo like a professional team',
        goal: 'Apply ignore files, CODEOWNERS and branch protection.',
        steps: [
          'Add .gitignore and .forceignore; commit via a PR (not direct to main if protection is already on).',
          'Add .github/CODEOWNERS.',
          'Enable branch protection on main and develop.',
          'Try <code>git push origin main</code> with a direct commit — confirm rejection.',
          'Open a PR instead and merge properly.',
          'Tag <code>v0.2.0</code> for Module 2 complete.'
        ],
        verify: 'Direct push rejected. PR path works. Ignore files present on main.',
        challenge: 'Add a PR template referencing the Salesforce review checklist from Day 9.'
      },
      teach: [
        'Module 2 assessment: give a broken repo (conflict + missing ignore + unprotected main) to fix in 30 minutes.',
        'Revisit the sandbox↔branch poster before Module 3 (CLI).'
      ]
    }
  ]
});
