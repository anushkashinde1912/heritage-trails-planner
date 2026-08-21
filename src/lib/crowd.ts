import { sites, type Site, type CrowdLevel } from "@/data/sites";

function getTimeSlot(date: Date): "morning" | "afternoon" | "evening" {
    const hour = date.getHours();
    if (hour < 12) return "morning";
    if (hour < 17) return "afternoon";
    return "evening";
}

function isWeekend(date: Date): boolean {
    const day = date.getDay();
    return day === 0 || day === 6;
}

export function getCrowdLevel(site: Site, date: Date = new Date()): CrowdLevel {
    const dayType = isWeekend(date) ? "weekend" : "weekday";
    const slot = getTimeSlot(date);
    return site.crowd_pattern[dayType][slot];
}

const levelOrder: CrowdLevel[] = ["low", "medium", "high"];

export function findLeastCrowdedAlternative(
    site: Site,
    date: Date = new Date(),
): Site | null {
    const alternatives: Site[] = [];

    for (const id of site.nearby_alternatives) {
        const found = sites.find((s) => s.id === id);
        if (found) {
            alternatives.push(found);
        }
    }

    if (alternatives.length === 0) {
        return null;
    }

    const [first, ...rest] = alternatives;
    let best: Site = first;

    for (const current of rest) {
        const currentLevel = levelOrder.indexOf(getCrowdLevel(current, date));
        const bestLevel = levelOrder.indexOf(getCrowdLevel(best, date));
        if (currentLevel < bestLevel) {
            best = current;
        }
    }

    return best;
}