#!/usr/bin/env python3
"""
plot_links.py
Queries the links table in the project's Neon PostgreSQL database and
produces a bar chart showing how many links were created per month over
the past 12 months, saved as a PNG.
"""

import argparse
import sys
from datetime import datetime, timezone

import matplotlib
matplotlib.use("Agg")  # headless – no display required
import matplotlib.pyplot as plt
import matplotlib.ticker as ticker
import psycopg2


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Plot monthly link-creation counts from the database."
    )
    parser.add_argument(
        "--database-url",
        required=True,
        help="PostgreSQL connection string (e.g. postgres://user:pass@host/db)",
    )
    parser.add_argument(
        "--output",
        required=True,
        help="Path for the output PNG file (e.g. links_monthly_chart.png)",
    )
    return parser.parse_args()


def query_monthly_counts(database_url: str) -> list[tuple[str, int]]:
    """
    Returns a list of (month_label, count) tuples for the past 12 calendar
    months (oldest → newest), including months with zero links.
    """
    sql = """
        SELECT
            TO_CHAR(DATE_TRUNC('month', created_at AT TIME ZONE 'UTC'), 'YYYY-MM') AS month,
            COUNT(*)::int AS total
        FROM links
        WHERE created_at >= DATE_TRUNC('month', NOW() AT TIME ZONE 'UTC') - INTERVAL '11 months'
          AND created_at <  DATE_TRUNC('month', NOW() AT TIME ZONE 'UTC') + INTERVAL '1 month'
        GROUP BY month
        ORDER BY month;
    """

    conn = psycopg2.connect(database_url)
    try:
        with conn.cursor() as cur:
            cur.execute(sql)
            rows = cur.fetchall()
    finally:
        conn.close()

    # Build a complete 12-month spine so every month appears even if empty
    now = datetime.now(tz=timezone.utc)
    months: list[str] = []
    for offset in range(11, -1, -1):
        # Calculate the year and month for each of the 12 months
        total_months = now.month - 1 - offset
        year = now.year + total_months // 12
        month = total_months % 12 + 1
        months.append(f"{year:04d}-{month:02d}")

    counts: dict[str, int] = {m: 0 for m in months}
    for row_month, row_count in rows:
        if row_month in counts:
            counts[row_month] = row_count
        else:
            print(f"Warning: month {row_month} outside the expected 12-month window; skipped.")

    return [(m, counts[m]) for m in months]


def friendly_label(ym: str) -> str:
    """Convert '2025-03' → 'Mar 25'."""
    dt = datetime.strptime(ym, "%Y-%m")
    return dt.strftime("%b %y")


def plot_chart(data: list[tuple[str, int]], output_path: str) -> None:
    labels = [friendly_label(ym) for ym, _ in data]
    values = [count for _, count in data]

    fig, ax = plt.subplots(figsize=(12, 6))

    bars = ax.bar(labels, values, color="#4F7BE8", edgecolor="white", linewidth=0.5)

    # Annotate each bar with its count
    for bar, val in zip(bars, values):
        if val > 0:
            ax.text(
                bar.get_x() + bar.get_width() / 2,
                bar.get_height() + max(values) * 0.01,
                str(val),
                ha="center",
                va="bottom",
                fontsize=9,
                color="#333333",
            )

    ax.set_title("Links Created per Month (Past 12 Months)", fontsize=14, fontweight="bold", pad=16)
    ax.set_xlabel("Month", fontsize=11, labelpad=8)
    ax.set_ylabel("Links Created", fontsize=11, labelpad=8)
    ax.yaxis.set_major_locator(ticker.MaxNLocator(integer=True))
    ax.set_ylim(bottom=0, top=max(max(values) * 1.15, 1))
    ax.tick_params(axis="x", labelrotation=45)
    ax.grid(axis="y", linestyle="--", alpha=0.4)
    ax.spines["top"].set_visible(False)
    ax.spines["right"].set_visible(False)

    fig.tight_layout()
    fig.savefig(output_path, dpi=150, bbox_inches="tight")
    print(f"Chart saved to: {output_path}")


def main() -> None:
    args = parse_args()

    print("Connecting to database and querying link counts...")
    try:
        data = query_monthly_counts(args.database_url)
    except psycopg2.OperationalError as exc:
        print(f"Database connection error: {exc}", file=sys.stderr)
        sys.exit(1)
    except psycopg2.Error as exc:
        print(f"Database query error: {exc}", file=sys.stderr)
        sys.exit(1)

    total = sum(count for _, count in data)
    if total == 0:
        print("Warning: no links found for the past 12 months. Chart will show all-zero bars.")

    plot_chart(data, args.output)


if __name__ == "__main__":
    main()
