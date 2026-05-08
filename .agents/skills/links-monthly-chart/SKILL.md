---
name: links-monthly-chart
description: >
  Generates a bar chart PNG showing the number of shortened links created per month over the past 12 months for the Link Shortener project.
  Use this skill whenever the user asks to visualize link creation trends, monthly link stats, link activity charts, or any chart/graph/plot of link data over time.
  Also use it when the user says things like "show me link stats", "how many links were created", "chart the links", or "plot link activity".
---

# Links Monthly Chart

This skill queries the project's Neon PostgreSQL database (via the `DATABASE_URL` in the `.env` file) and produces a bar chart PNG showing how many links were created each month for the past 12 months.

## What this skill does

1. Reads `DATABASE_URL` from the project's `.env` (or `.env.local`) file
2. Runs a SQL query against the `links` table, grouping rows by month for the past 12 months
3. Calls `scripts/plot_links.py` to render a bar chart and save it as a PNG

## Steps to follow

### Step 1 – Locate the .env file

Look for `.env.local` first (Next.js convention), then `.env`. Both files live at the project root. Extract the `DATABASE_URL` value from whichever file exists.

If neither file exists or `DATABASE_URL` is missing, tell the user and stop.

### Step 2 – Install Python dependencies

Run:

```bash
pip install psycopg2-binary matplotlib python-dotenv
```

If `pip` is not available, try `pip3`. If neither works, note the issue to the user and stop.

### Step 3 – Run the plotting script

The script is at `scripts/plot_links.py` relative to this SKILL.md file. Run it from the terminal, passing the database URL and the desired output path:

```bash
python <skill-dir>/scripts/plot_links.py \
  --database-url "<DATABASE_URL>" \
  --output "<output-path>/links_monthly_chart.png"
```

- `<skill-dir>` is the absolute path to this skill's directory
- `<output-path>` is a sensible location — use the current working directory unless the user specified somewhere else
- Wrap the database URL in quotes to handle special characters safely

### Step 4 – Report the result

Tell the user where the PNG was saved. If the script printed any warnings (e.g. months with no data), mention them briefly.

## Error handling

- **Missing .env / DATABASE_URL**: Ask the user to add `DATABASE_URL=<connection-string>` to their `.env.local` file.
- **Connection failure**: Show the error message from Python. Common causes are an invalid connection string or network/firewall restrictions.
- **No data**: The chart will still render with all-zero bars. Mention that no links were found for the queried period.
- **Missing Python packages**: Run the install command from Step 2 and retry.
