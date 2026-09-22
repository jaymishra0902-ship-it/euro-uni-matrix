import { Router, type IRouter } from "express";
import {
  ConvertGradeBody,
  ConvertGradeResponse,
  ListBridgeCoursesQueryParams,
  ListBridgeCoursesResponse,
  MatchUniversitiesBody,
  MatchUniversitiesResponse,
} from "@workspace/api-zod";
import { bridgeCourses } from "../data/bridge-courses";
import { universities, type University, type UniversityTier } from "../data/universities";

const router: IRouter = Router();

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

function gradeToPercent(value: number, system: string) {
  switch (system) {
    case "US GPA":
      return clamp((value / 4) * 100, 0, 100);
    case "UK Honours":
      if (value <= 1.1) return 90;
      if (value <= 2.1) return 75;
      if (value <= 2.2) return 65;
      return 55;
    case "ECTS":
      if (value <= 1) return 95;
      if (value <= 2) return 85;
      if (value <= 3) return 75;
      if (value <= 4) return 65;
      return 55;
    case "Bavarian":
      return clamp(100 - (value - 1) * 25, 0, 100);
    default:
      return clamp(value, 0, 100);
  }
}

function normalizeBudget(value: number, currency = "EUR") {
  const fx = currency === "GBP" ? 1.17 : currency === "CHF" ? 1.03 : 1;
  return value * fx;
}

function scoreUniversity(
  university: University,
  profile: ReturnType<typeof MatchUniversitiesBody.parse>,
) {
  const gradeScore = gradeToPercent(profile.grade, profile.gradeSystem);
  const englishScore =
    profile.englishTest === "TOEFL"
      ? clamp((profile.englishScore / 120) * 100, 0, 100)
      : clamp((profile.englishScore / 9) * 100, 0, 100);
  const totalCost = university.tuition + university.livingCost;
  const budget = normalizeBudget(profile.budget, profile.currency);
  const budgetScore = clamp(
    totalCost <= budget ? 100 : 100 - ((totalCost - budget) / budget) * 75,
    25,
    100,
  );
  const experienceScore = clamp(58 + profile.experienceYears * 8, 58, 100);
  const fieldScore = university.fields.some((item) =>
    item.toLowerCase().includes(profile.field.toLowerCase()),
  )
    ? 100
    : 64;
  const regionScore =
    profile.region === "All Europe" || university.region === profile.region
      ? 100
      : 72;

  return Math.round(
    university.fitScore * 0.32 +
      gradeScore * 0.22 +
      englishScore * 0.15 +
      budgetScore * 0.12 +
      experienceScore * 0.08 +
      fieldScore * 0.08 +
      regionScore * 0.03,
  );
}

function tierForScore(score: number, acceptanceRate: number): UniversityTier {
  if (score >= 86 && acceptanceRate >= 45) return "safe";
  if (score >= 74) return "target";
  return "reach";
}

router.post("/counselor/match", (req, res) => {
  const profile = MatchUniversitiesBody.parse(req.body);
  const matches = universities
    .map((university) => {
      const fitScore = scoreUniversity(university, profile);
      return {
        ...university,
        fitScore,
        tier: tierForScore(fitScore, university.acceptanceRate),
      };
    })
    .filter((university) => {
      if (profile.region === "All Europe") return true;
      return university.region === profile.region;
    })
    .sort((a, b) => b.fitScore - a.fitScore)
    .slice(0, 18);

  const safeCount = matches.filter((item) => item.tier === "safe").length;
  const targetCount = matches.filter((item) => item.tier === "target").length;
  const reachCount = matches.filter((item) => item.tier === "reach").length;
  const top = matches[0];
  const budget = normalizeBudget(profile.budget, profile.currency);
  const topInsight = top
    ? `${top.name} is your strongest fit at ${top.fitScore}% based on your academic profile, budget, and ${top.country} preference.`
    : "Expand your region preference to unlock more compatible programs.";

  const result = {
    matches,
    summary: {
      profileStrength: Math.round(
        gradeToPercent(profile.grade, profile.gradeSystem) * 0.55 +
          (profile.englishTest === "TOEFL"
            ? clamp((profile.englishScore / 120) * 100, 0, 100)
            : clamp((profile.englishScore / 9) * 100, 0, 100)) *
            0.25 +
          clamp((budget / 30000) * 100, 0, 100) * 0.2,
      ),
      totalMatches: matches.length,
      safeCount,
      targetCount,
      reachCount,
      topInsight,
    },
  };

  res.json(MatchUniversitiesResponse.parse(result));
});

router.post("/counselor/convert-grade", (req, res) => {
  const body = ConvertGradeBody.parse(req.body);
  const percent = gradeToPercent(body.value, body.fromSystem);
  let value = percent;
  let label = `${percent.toFixed(1)}%`;
  let scale = "Percentage scale";

  if (body.toSystem === "US GPA") {
    value = Number(((percent / 100) * 4).toFixed(2));
    label = `${value.toFixed(2)} / 4.00`;
    scale = "US 4.0 scale";
  } else if (body.toSystem === "UK Honours") {
    value = percent >= 70 ? 1 : percent >= 60 ? 2.1 : percent >= 50 ? 2.2 : 3;
    label =
      value === 1
        ? "First-class Honours"
        : value === 2.1
          ? "Upper Second (2:1)"
          : value === 2.2
            ? "Lower Second (2:2)"
            : "Third-class Honours";
    scale = "UK degree classification";
  } else if (body.toSystem === "ECTS") {
    value = percent >= 90 ? 1 : percent >= 80 ? 2 : percent >= 70 ? 3 : percent >= 60 ? 4 : 5;
    label = ["", "A", "B", "C", "D", "E"][value];
    scale = "ECTS grading scale";
  } else if (body.toSystem === "Bavarian") {
    value = Number((1 + (100 - percent) / 25).toFixed(2));
    label = `${value.toFixed(2)} / 5.00`;
    scale = "Modified Bavarian Formula";
  }

  const result = {
    value,
    label,
    explanation: `${body.value} on the ${body.fromSystem} scale is approximately ${percent.toFixed(1)}% and converts to ${label}.`,
    scale,
  };
  res.json(ConvertGradeResponse.parse(result));
});

router.get("/counselor/bridge-courses", (req, res) => {
  const { topic } = ListBridgeCoursesQueryParams.parse(req.query);
  const result = topic
    ? bridgeCourses.filter((course) =>
        `${course.topic} ${course.title}`.toLowerCase().includes(topic.toLowerCase()),
      )
    : bridgeCourses;
  res.json(ListBridgeCoursesResponse.parse(result));
});

export default router;