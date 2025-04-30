# Gym Occupancy Notifier Bot

A lightweight Node.js bot that scrapes the occupancy rate of your favorite gym (Fit-Star Neuhausen) and sends scheduled email reports to one or more recipients.

## Features

- Scrape live and historical occupancy data from Fit-Star's website.
- Send daily or custom-scheduled email reports via SMTP.
- Support multiple recipients with independent schedules.
- Configurable entirely via GitHub Actions and repository secrets.

## Prerequisites

- Node.js (v14+)
- A GitHub repository for hosting the code and workflows
- SMTP credentials for an email account (e.g., Gmail app password) with:
  - `SMTP_HOST`
  - `SMTP_PORT`
  - `SMTP_USER`
  - `SMTP_PASS`

## Installation

1. Clone this repository:
   ```bash
   git clone https://github.com/Neowasheree/gym_scraping.git
   cd gym_scraping
   ```
2. Install dependencies:
   ```bash
   npm install
   ```

## Configuration

### 1. GitHub Secrets

In your repository settings, add the following **Actions** secrets:

- `SMTP_HOST` — your SMTP server (e.g., `smtp.gmail.com`)
- `SMTP_PORT` — SMTP port (e.g., `587`)
- `SMTP_USER` — your email address
- `SMTP_PASS` — your email password or app-specific password
- `ALICE_EMAIL` — recipient Alice's email
- `BOB_EMAIL` — recipient Bob's email

### 2. Workflows

Each recipient has a dedicated workflow YAML in `.github/workflows/`:

- `send-alice.yml` triggers at Alice's chosen time and uses `ALICE_EMAIL`
- `send-bob.yml` triggers at Bob's chosen time and uses `BOB_EMAIL`

You can add more by duplicating a workflow file and updating:

```yaml
on:
  schedule:
    - cron: 'CRON_EXPRESSION'  # set your desired time (in UTC)
env:
  TO_EMAIL: ${{ secrets.YOUR_NEW_SECRET }}
```

## Usage

- **Testing manually**:
  - Navigate to the **Actions** tab in GitHub.
  - Select your workflow and click **Run workflow**.

- **Automated**:
  - The workflows will run on their defined `cron` schedules and email the latest occupancy report.

## Scripts

- `getOccupancy.js` — core scraper & mailer script.
- `package.json` — project metadata & dependencies.

## Customization

- Modify `getOccupancy.js` to scrape a different studio or format the email content.
- Add new recipients by creating additional workflow files and secrets.

## License

MIT © 2025 Neowasheree

