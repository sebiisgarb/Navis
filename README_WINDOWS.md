# Comenzi Navis – Quick Start (Windows)

A short guide for developers working on **Comenzi Navis** from **Windows 11/10**. Use it alongside the main roadmap.

---

## 1 · Prerequisites

| Tool               | Recommended install                                                                            | Notes                                                                    |
| ------------------ | ---------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------ |
| **Git**            | [Git for Windows](https://gitforwindows.org/)                                                  | Enable *Git Bash* during install.                                        |
| **Docker Desktop** | [docker.com](https://www.docker.com/products/docker-desktop/)                                  | Make sure **WSL 2 backend** is enabled; share the WSL distro you’ll use. |
| **WSL 2 distro**   | Ubuntu 22.04 from Microsoft Store                                                              | Preferred shell for running `bash` scripts, Python, Node.                |
| **Python 3.11**    | `winget install Python.Python.3.11` or via WSL (`sudo apt install python3.11 python3.11-venv`) | Used for Django + pre‑commit.                                            |
| **Node.js 20 LTS** | `nvm install 20` (`nvm‑windows`) or via WSL (`fnm`, `nvm`)                                     | Builds React frontend.                                                   |
| **OpenJDK 17**     | [Adoptium Temurin 17 MSI](https://adoptium.net)                                                | Android Gradle build.                                                    |
| **pre‑commit**     | `pip install --user pre-commit`                                                                | Global hook runner.                                                      |

> **Tip:** Work primarily inside WSL; Git Bash also works, but WSL gives you a Linux‑like env identical to CI.

---

## 2 · First‑time Setup

```bash
# Inside Windows Terminal → Ubuntu (WSL)

# 1. Clone repo
mkdir -p ~/dev && cd ~/dev
git clone git@github.com:<org>/comenzi-navis.git && cd comenzi-navis

# 2. Install git hooks
pip install --user pre-commit
pre-commit install

# 3. Start local stack (Postgres + Redis)
docker compose -f docker-compose.dev.yml up -d

# 4. Create dev branch (if you cloned just after repo creation)
git checkout -b dev
git push -u origin dev
```

If `pre-commit` complains about missing interpreters (e.g. Node), install them and re‑run:

```bash
pre-commit run --all-files
```

---

## 3 · Daily Workflow (Windows)

```bash
# open Ubuntu (WSL) shell

# sync dev and create a feature branch
git checkout dev && git pull
git checkout -b feat/<scope>

# code… then test
pytest               # backend
npm test --workspace web  # web
./gradlew test       # mobile

# commit & push
git add .
git commit -m "feat: …"
git push -u origin HEAD

# open PR → dev in GitHub UI
```

Docker Desktop shares ports by default, so:

- Django API → [http://localhost:8000](http://localhost:8000)
- React dev → [http://localhost:5173](http://localhost:5173)

---

## 4 · Troubleshooting

| Symptom                                    | Fix                                                                        |
| ------------------------------------------ | -------------------------------------------------------------------------- |
| `docker compose` fails: "… requires WSL 2" | Ensure the distro is set to version 2: `wsl --set-version Ubuntu-22.04 2`. |
| Weird line‑ending diffs                    | Make sure `git config --global core.autocrlf true`.                        |
| License errors in Gradle                   | Run `.​gradlew --refresh-dependencies` in `mobile/` once.                  |
| "pre‑commit: command not found"            | Add Python Scripts dir to PATH or use `pipx`.                              |

---

## 5 · What’s next?

Your local environment matches the Linux dev stack.  Continue with:

1. Follow **Step 1.7 Daily workflow** from the roadmap.
2. Pick your first issue (e.g. scaffold Django models) and create a feature branch.
3. Push, open PR, get review, merge.

Happy shipping! 🚚
