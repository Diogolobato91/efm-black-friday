#!/usr/bin/env python3
"""Validate repository setup only; no network access or application audit."""
import ast
import hashlib
import json
from pathlib import Path
import re
import sys
import tomllib
import xml.etree.ElementTree as ET

ROOT = Path(__file__).resolve().parents[1]
SKILLS = {
    "copywriting", "page-cro", "frontend-design", "ui-ux-pro-max",
    "web-performance-optimization", "seo-fundamentals", "webapp-testing",
    "accessibility-compliance-accessibility-audit", "analytics-tracking",
}
AGENTS = {"estrategista", "designer", "frontend", "qualidade", "mensuracao"}

def require(condition, message):
    if not condition:
        raise ValueError(message)

def read_json(path):
    return json.loads((ROOT / path).read_text(encoding="utf-8"))

def main():
    config = tomllib.loads((ROOT / ".codex/config.toml").read_text())
    require(config["agents"]["enabled"] is True, "Delegation disabled")
    require(config["agents"]["max_concurrent_threads_per_session"] == 3, "Unexpected agent limit")
    agents = list((ROOT / ".codex/agents").glob("*.toml"))
    require({p.stem for p in agents} == AGENTS, "Agent set mismatch")
    for path in agents:
        item = tomllib.loads(path.read_text())
        require(item.get("name") == path.stem, f"Agent name mismatch: {path}")
        require(bool(item.get("description")) and bool(item.get("developer_instructions")), f"Incomplete agent: {path}")

    skills = list((ROOT / ".agents/skills").glob("*/SKILL.md"))
    require({p.parent.name for p in skills} == SKILLS, "Skill set mismatch")
    for path in skills:
        text = path.read_text()
        header = re.match(r"^---\nname: ([a-z0-9-]+)\ndescription: (.+)\n---\n", text)
        require(header is not None, f"Unsupported skill metadata: {path}")
        require(header[1] == path.parent.name, f"Skill name mismatch: {path}")
        description = json.loads(header[2])
        require(isinstance(description, str) and 0 < len(description) <= 1024, f"Invalid description: {path}")
        interface = path.parent / "agents/openai.yaml"
        require(interface.is_file() and f"$"+header[1] in interface.read_text(), f"Missing skill interface: {path}")

    lock = read_json("docs/skills-lock.json")
    require(lock["upstreamCommit"] == "48de968b4615c294de601f72268aa7be88dde863", "Unreviewed source revision")
    for record in lock["files"]:
        relative = Path(record["path"])
        require(not relative.is_absolute() and ".." not in relative.parts, "Unsafe lock path")
        path = ROOT / relative
        require(path.is_file(), f"Missing locked file: {relative}")
        require(hashlib.sha256(path.read_bytes()).hexdigest() == record["sha256"], f"Changed bundle: {relative}")
    require(len(list((ROOT / ".agents/skills/ui-ux-pro-max/data").rglob("*.csv"))) == 23, "UI data incomplete")

    campaign = read_json("config/campaign.json")
    require(campaign["whatsapp"]["url"] == "https://wa.me/5591985106086", "WhatsApp mismatch")
    require(campaign["displayClassDuration"] is False, "Do not display class duration")
    require(campaign["giveaway"]["airfareIncluded"] is False, "Airfare must remain excluded")
    require(set(campaign["giveaway"]["eligibleModalities"]) == {"english", "spanish"}, "Eligibility mismatch")
    require(campaign["referral"]["chances"] is None, "Unconfirmed referral chances")
    require(campaign["initialFee"]["amountBRL"] == 199.90, "Initial fee mismatch")
    require(campaign["bonus"]["otherLanguageMonths"] == 1 and campaign["bonus"]["classesPerWeek"] == 1, "Bonus mismatch")
    require(len(campaign["modalities"]) == 2, "Modality mismatch")
    expected_names = {"english": ["Básico", "Pro", "Premium"], "spanish": ["¡Vamos!", "¡Arriba!", "¡Dale!"]}
    for modality in campaign["modalities"]:
        require(modality["id"] in expected_names, "Unknown modality")
        require([p["name"] for p in modality["plans"]] == expected_names[modality["id"]], "Plan names mismatch")
        require([(p["classesPerMonth"], p["monthlyPriceBRL"], p["drawChances"]) for p in modality["plans"]] == [(4, 350, 3), (8, 450, 5), (12, 550, 7)], "Offer mismatch")
    brand = read_json("config/brand.json")
    require(brand["fontFamily"] == "Montserrat", "Font mismatch")
    for logo in brand["logos"].values():
        ET.parse(ROOT / logo)
    for path in ROOT.rglob("*.py"):
        if ".git" not in path.parts:
            ast.parse(path.read_text(), filename=str(path))
    for path in ("AGENTS.md", "docs/briefing.md", "docs/brand.md", "docs/agents.md", "docs/skills.md", ".agents/THIRD_PARTY_LICENSE.txt", "public/brand/tokens.css"):
        require((ROOT / path).is_file(), f"Missing reference: {path}")
    print(json.dumps({"status": "passed", "agents": len(agents), "skills": len(skills), "locked_files": len(lock["files"]), "scope": "project preparation only; application not implemented"}, ensure_ascii=False))

if __name__ == "__main__":
    try:
        main()
    except (ValueError, KeyError, OSError, SyntaxError, ET.ParseError) as exc:
        print(f"Setup validation failed: {exc}", file=sys.stderr)
        sys.exit(1)
