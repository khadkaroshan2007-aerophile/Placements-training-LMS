"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  Code2,
  Filter,
  Flame,
  Layers,
  Search,
  Sparkles,
  Trophy,
} from "lucide-react";
import { codingProblems, type CodingProblem } from "@/lib/coding-problems-data";
import { getSolvedProblemIds, getStoredSubmissions } from "@/lib/coding-storage";

export function CodingPracticeHub() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Topics");
  const [selectedDifficulty, setSelectedDifficulty] = useState("All Difficulties");
  const [selectedStatus, setSelectedStatus] = useState("All Status");
  const [solvedIds, setSolvedIds] = useState<string[]>([]);

  useEffect(() => {
    setSolvedIds(getSolvedProblemIds());
  }, []);

  const categories = [
    "All Topics",
    ...Array.from(new Set(codingProblems.map((p) => p.category))),
  ];

  const filteredProblems = useMemo(() => {
    return codingProblems.filter((p) => {
      const matchesSearch =
        searchQuery.trim() === "" ||
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.companies.some((c) => c.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesCategory =
        selectedCategory === "All Topics" || p.category === selectedCategory;

      const matchesDifficulty =
        selectedDifficulty === "All Difficulties" || p.difficulty === selectedDifficulty;

      const isSolved = solvedIds.includes(p.id);
      const matchesStatus =
        selectedStatus === "All Status" ||
        (selectedStatus === "Solved" && isSolved) ||
        (selectedStatus === "Unsolved" && !isSolved);

      return matchesSearch && matchesCategory && matchesDifficulty && matchesStatus;
    });
  }, [searchQuery, selectedCategory, selectedDifficulty, selectedStatus, solvedIds]);

  const totalCount = codingProblems.length;
  const solvedCount = solvedIds.length;
  const easyCount = codingProblems.filter((p) => p.difficulty === "Easy").length;
  const easySolved = codingProblems.filter(
    (p) => p.difficulty === "Easy" && solvedIds.includes(p.id)
  ).length;
  const medCount = codingProblems.filter((p) => p.difficulty === "Medium").length;
  const medSolved = codingProblems.filter(
    (p) => p.difficulty === "Medium" && solvedIds.includes(p.id)
  ).length;
  const hardCount = codingProblems.filter((p) => p.difficulty === "Hard").length;
  const hardSolved = codingProblems.filter(
    (p) => p.difficulty === "Hard" && solvedIds.includes(p.id)
  ).length;

  return (
    <div className="content">
      {/* Welcome & Progress Stats Banner */}
      <div className="welcome">
        <div>
          <div className="eyebrow">LEETCODE-STYLE DSA PRACTICE</div>
          <h1>Coding Practice</h1>
          <p>
            Master placement coding rounds with multi-language online execution in{" "}
            <strong>Python</strong>, <strong>Java</strong>, <strong>C++</strong>, and{" "}
            <strong>JavaScript</strong>.
          </p>
        </div>
        <div className="date-pill">
          <Code2 size={16} color="var(--purple)" />
          <span>
            <strong>{solvedCount}</strong> of <strong>{totalCount}</strong> Solved
          </span>
        </div>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid stats-grid" style={{ marginBottom: 24 }}>
        <div className="card stat-card">
          <div className="stat-head">
            <span>Overall Progress</span>
            <div className="stat-icon">
              <Trophy size={16} />
            </div>
          </div>
          <div className="stat-value">
            <strong>
              {totalCount > 0 ? Math.round((solvedCount / totalCount) * 100) : 0}%
            </strong>
            <span className="trend">
              {solvedCount}/{totalCount}
            </span>
          </div>
          <div className="bar" style={{ marginTop: 8 }}>
            <i
              style={{
                width: `${totalCount > 0 ? (solvedCount / totalCount) * 100 : 0}%`,
              }}
            />
          </div>
        </div>

        <div className="card stat-card">
          <div className="stat-head">
            <span>Easy Questions</span>
            <span
              style={{
                fontSize: 10,
                fontWeight: 700,
                color: "#16a34a",
                background: "rgba(22, 163, 74, 0.12)",
                padding: "2px 6px",
                borderRadius: 4,
              }}
            >
              Easy
            </span>
          </div>
          <div className="stat-value">
            <strong style={{ color: "#16a34a" }}>
              {easySolved}/{easyCount}
            </strong>
          </div>
          <div className="stat-foot">Fundamental data structures</div>
        </div>

        <div className="card stat-card">
          <div className="stat-head">
            <span>Medium Questions</span>
            <span
              style={{
                fontSize: 10,
                fontWeight: 700,
                color: "#d97706",
                background: "rgba(217, 119, 6, 0.12)",
                padding: "2px 6px",
                borderRadius: 4,
              }}
            >
              Medium
            </span>
          </div>
          <div className="stat-value">
            <strong style={{ color: "#d97706" }}>
              {medSolved}/{medCount}
            </strong>
          </div>
          <div className="stat-foot">Top placement interview patterns</div>
        </div>

        <div className="card stat-card">
          <div className="stat-head">
            <span>Supported Languages</span>
            <div className="stat-icon">
              <Layers size={16} />
            </div>
          </div>
          <div className="stat-value">
            <strong>4</strong>
            <span className="trend">Python, Java, C++, JS</span>
          </div>
          <div className="stat-foot">Instant test case execution</div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div
        className="card"
        style={{
          padding: "16px 20px",
          marginBottom: 20,
          display: "flex",
          flexWrap: "wrap",
          gap: 12,
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {/* Search */}
        <div
          style={{
            position: "relative",
            flex: "1 1 240px",
            minWidth: 200,
          }}
        >
          <Search
            size={16}
            style={{
              position: "absolute",
              left: 12,
              top: "50%",
              transform: "translateY(-50%)",
              color: "var(--muted)",
            }}
          />
          <input
            type="text"
            placeholder="Search questions by title, topic, or company..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: "100%",
              height: 38,
              paddingLeft: 36,
              paddingRight: 12,
              borderRadius: 8,
              border: "1px solid var(--input-border)",
              background: "var(--input-bg)",
              color: "var(--ink)",
              fontSize: 12,
              outline: "none",
            }}
          />
        </div>

        {/* Dropdown Filters */}
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <select
            value={selectedDifficulty}
            onChange={(e) => setSelectedDifficulty(e.target.value)}
            style={{
              height: 38,
              padding: "0 12px",
              borderRadius: 8,
              border: "1px solid var(--line)",
              background: "var(--card-bg)",
              color: "var(--ink)",
              fontSize: 12,
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            <option value="All Difficulties">All Difficulties</option>
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            style={{
              height: 38,
              padding: "0 12px",
              borderRadius: 8,
              border: "1px solid var(--line)",
              background: "var(--card-bg)",
              color: "var(--ink)",
              fontSize: 12,
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            <option value="All Status">All Status</option>
            <option value="Solved">Solved</option>
            <option value="Unsolved">Unsolved</option>
          </select>
        </div>
      </div>

      {/* Category Filter Chips */}
      <div className="learning-filters" style={{ marginBottom: 20 }}>
        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            className={selectedCategory === cat ? "selected" : ""}
            onClick={() => setSelectedCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Problems List */}
      <div style={{ display: "grid", gap: 10 }}>
        {filteredProblems.length === 0 ? (
          <div className="card learning-empty">
            <Code2 size={40} style={{ margin: "0 auto 12px", color: "var(--muted)" }} />
            <h2>No questions found</h2>
            <p>Try adjusting your search query or filters.</p>
          </div>
        ) : (
          filteredProblems.map((prob, idx) => {
            const isSolved = solvedIds.includes(prob.id);
            const difficultyColor =
              prob.difficulty === "Easy"
                ? "#16a34a"
                : prob.difficulty === "Medium"
                ? "#d97706"
                : "#dc2626";

            return (
              <div
                key={prob.id}
                className="card"
                style={{
                  padding: "16px 20px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 16,
                  flexWrap: "wrap",
                  borderLeft: isSolved
                    ? "4px solid #16a34a"
                    : "4px solid transparent",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 14,
                    flex: "1 1 300px",
                    minWidth: 0,
                  }}
                >
                  <span
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: 8,
                      background: isSolved
                        ? "rgba(22, 163, 74, 0.12)"
                        : "var(--accent-subtle)",
                      color: isSolved ? "#16a34a" : "var(--purple)",
                      display: "grid",
                      placeItems: "center",
                      fontSize: 12,
                      fontWeight: 700,
                      flexShrink: 0,
                    }}
                  >
                    {isSolved ? <CheckCircle2 size={16} /> : idx + 1}
                  </span>

                  <div style={{ minWidth: 0 }}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        flexWrap: "wrap",
                      }}
                    >
                      <Link
                        href={`/coding-practice/${prob.slug}`}
                        style={{
                          fontSize: 14,
                          fontWeight: 700,
                          color: "var(--ink)",
                          transition: "color 0.15s",
                        }}
                      >
                        {prob.title}
                      </Link>
                      <span
                        style={{
                          fontSize: 10,
                          fontWeight: 700,
                          color: difficultyColor,
                          background: `${difficultyColor}18`,
                          padding: "2px 7px",
                          borderRadius: 4,
                        }}
                      >
                        {prob.difficulty}
                      </span>
                      <span className="tag">{prob.category}</span>
                    </div>

                    {/* Companies */}
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 6,
                        marginTop: 6,
                        flexWrap: "wrap",
                      }}
                    >
                      <span style={{ fontSize: 10, color: "var(--muted)" }}>
                        Asked by:
                      </span>
                      {prob.companies.slice(0, 3).map((comp) => (
                        <span
                          key={comp}
                          style={{
                            fontSize: 9,
                            fontWeight: 600,
                            color: "var(--muted)",
                            background: "var(--line)",
                            padding: "2px 6px",
                            borderRadius: 4,
                          }}
                        >
                          {comp}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Acceptance & Action CTA */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 16,
                    flexShrink: 0,
                  }}
                >
                  <div style={{ textAlign: "right", display: "none" }}>
                    <span style={{ fontSize: 11, color: "var(--muted)" }}>
                      Acceptance: {prob.acceptanceRate}
                    </span>
                  </div>

                  <Link
                    href={`/coding-practice/${prob.slug}`}
                    className={`learning-button ${isSolved ? "secondary" : ""}`}
                    style={{ padding: "8px 14px", fontSize: 11 }}
                  >
                    {isSolved ? "Solve Again" : "Solve Challenge"}
                    <ArrowRight size={13} />
                  </Link>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
