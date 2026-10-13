#!/usr/bin/env python3
"""Fetch source-backed capacity observations for the Eucalypso dashboard.

This script deliberately does not calculate an Eucalypso composite. It only
transcribes the latest non-null observations for the declared geographies and
retains source, year, unit, and retrieval metadata.
"""

from __future__ import annotations

import csv
import io
import json
import urllib.request
from datetime import date
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / "data" / "capacity-observations.json"

SERIES = [
    {
        "id": "electricity",
        "label": "Access to electricity",
        "unit": "% of population",
        "slug": "share-of-the-population-with-access-to-electricity",
    },
    {
        "id": "internet",
        "label": "Individuals using the Internet",
        "unit": "% of population",
        "slug": "share-of-individuals-using-the-internet",
    },
    {
        "id": "life-expectancy",
        "label": "Life expectancy at birth",
        "unit": "years",
        "slug": "life-expectancy",
    },
]

SCOPES = {"global": ("World", "OWID_WRL"), "local": ("United States", "USA")}


def fetch_rows(slug: str) -> list[dict[str, str]]:
    url = f"https://ourworldindata.org/grapher/{slug}.csv"
    request = urllib.request.Request(url, headers={"User-Agent": "CastaliaInstitute/Eucalypso-ingest"})
    with urllib.request.urlopen(request, timeout=45) as response:
        return list(csv.DictReader(io.TextIOWrapper(response, encoding="utf-8")))


def latest(rows: list[dict[str, str]], entity: str, code: str) -> tuple[int, float]:
    candidates = [row for row in rows if row.get("Entity") == entity and row.get("Code") == code]
    if not candidates:
        raise RuntimeError(f"No rows for {entity} ({code})")
    value_column = next(column for column in candidates[0] if column not in {"Entity", "Code", "Year"})
    usable = [(int(row["Year"]), float(row[value_column])) for row in candidates if row.get(value_column) not in {None, ""}]
    if not usable:
        raise RuntimeError(f"No usable values for {entity} ({code})")
    return max(usable)


def main() -> None:
    observations = []
    for series in SERIES:
        rows = fetch_rows(series["slug"])
        values = {scope: latest(rows, *identity) for scope, identity in SCOPES.items()}
        observations.append(
            {
                "id": series["id"],
                "label": series["label"],
                "unit": series["unit"],
                "year": values["global"][0],
                "global": values["global"][1],
                "local": values["local"][1],
                "localYear": values["local"][0],
                "sourceUrl": f"https://ourworldindata.org/grapher/{series['slug']}",
            }
        )

    payload = {
        "retrieved": date.today().isoformat(),
        "source": {
            "name": "Our World in Data Grapher",
            "url": "https://ourworldindata.org/grapher/",
            "underlying": "Source attribution is retained on each Grapher metadata page.",
        },
        "scopes": {
            "global": {"label": "World", "code": "OWID_WRL"},
            "local": {"label": "United States", "code": "USA"},
        },
        "observations": observations,
    }
    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    OUTPUT.write_text(json.dumps(payload, indent=2) + "\n", encoding="utf-8")
    print(f"wrote {OUTPUT}")


if __name__ == "__main__":
    main()
