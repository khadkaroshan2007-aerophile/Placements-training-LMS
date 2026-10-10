"use client";

import React, { useState } from "react";
import {
  Briefcase,
  Building2,
  Calendar,
  CheckCircle2,
  ChevronRight,
  Clock,
  DollarSign,
  ExternalLink,
  Filter,
  GraduationCap,
  MapPin,
  RefreshCw,
  Search,
  Sparkles,
} from "lucide-react";
import {
  filterPlacementJobs,
  placementJobsList,
  type PlacementJob,
} from "@/lib/placement-jobs-data";

export function JobsPortalView() {
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");
  const [locationFilter, setLocationFilter] = useState("All");
  const [batchFilter, setBatchFilter] = useState("All");
  const [isSearching, setIsSearching] = useState(false);
  const [liveJobs, setLiveJobs] = useState<PlacementJob[]>(placementJobsList);

  const filtered = filterPlacementJobs(
    liveJobs,
    searchQuery,
    typeFilter,
    locationFilter,
    batchFilter
  );

  function handleLiveRefresh() {
    setIsSearching(true);
    setTimeout(() => {
      // Simulate live internet drive search fetching fresh openings
      setIsSearching(false);
    }, 600);
  }

  return (
    <div className="animate-fade-in" style={{ display: "grid", gap: 20 }}>
      {/* Top Banner & Stats */}
      <div className="card" style={{ padding: "20px 24px", background: "var(--card-bg)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 14 }}>
          <div>
            <div className="eyebrow">ACTIVE HIRING DRIVES & INTERNSHIPS</div>
            <h2 style={{ fontSize: 22, margin: "6px 0 4px", color: "var(--ink)" }}>
              Live Tech Placement Opportunities
            </h2>
            <p style={{ color: "var(--muted)", margin: 0, fontSize: 13 }}>
              Explore verified software engineering jobs and internships from top product & service companies.
            </p>
          </div>

          <button
            type="button"
            className="learning-button"
            onClick={handleLiveRefresh}
            disabled={isSearching}
            style={{ fontSize: 12, padding: "8px 16px" }}
          >
            <RefreshCw size={13} className={isSearching ? "animate-spin" : ""} />
            {isSearching ? "Searching Web Drives..." : "Refresh Live Opportunities"}
          </button>
        </div>

        {/* Filters and Search Bar */}
        <div
          style={{
            marginTop: 18,
            display: "grid",
            gridTemplateColumns: "1.8fr 1fr 1fr 1fr",
            gap: 12,
            alignItems: "center",
          }}
        >
          {/* Search bar */}
          <div style={{ position: "relative" }}>
            <Search
              size={15}
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
              placeholder="Search by role, company, or skills (e.g. SDE, Python, React)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: "100%",
                padding: "9px 12px 9px 36px",
                borderRadius: 8,
                border: "1px solid var(--input-border)",
                background: "var(--input-bg)",
                color: "var(--ink)",
                fontSize: 12.5,
              }}
            />
          </div>

          {/* Type Filter */}
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            style={{
              padding: "9px 12px",
              borderRadius: 8,
              border: "1px solid var(--input-border)",
              background: "var(--input-bg)",
              color: "var(--ink)",
              fontSize: 12,
            }}
          >
            <option value="All">All Job Types</option>
            <option value="Full-Time">Full-Time (FTE)</option>
            <option value="6-Month Internship">6-Month Internship</option>
            <option value="Summer Internship">Summer Internship</option>
          </select>

          {/* Location Filter */}
          <select
            value={locationFilter}
            onChange={(e) => setLocationFilter(e.target.value)}
            style={{
              padding: "9px 12px",
              borderRadius: 8,
              border: "1px solid var(--input-border)",
              background: "var(--input-bg)",
              color: "var(--ink)",
              fontSize: 12,
            }}
          >
            <option value="All">All Locations</option>
            <option value="Bangalore">Bangalore</option>
            <option value="Hyderabad">Hyderabad</option>
            <option value="Gurgaon">Gurgaon / Delhi NCR</option>
            <option value="Noida">Noida</option>
            <option value="Remote">Remote</option>
          </select>

          {/* Batch Filter */}
          <select
            value={batchFilter}
            onChange={(e) => setBatchFilter(e.target.value)}
            style={{
              padding: "9px 12px",
              borderRadius: 8,
              border: "1px solid var(--input-border)",
              background: "var(--input-bg)",
              color: "var(--ink)",
              fontSize: 12,
            }}
          >
            <option value="All">All Batches</option>
            <option value="2024">2024 Batch</option>
            <option value="2025">2025 Batch</option>
            <option value="2026">2026 Batch</option>
          </select>
        </div>
      </div>

      {/* Jobs Grid */}
      <div style={{ display: "grid", gap: 14 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: 13, color: "var(--muted)", fontWeight: 600 }}>
            Showing <strong>{filtered.length}</strong> active openings
          </span>
          {searchQuery && (
            <button
              type="button"
              className="learning-button secondary"
              style={{ fontSize: 11, padding: "4px 8px" }}
              onClick={() => {
                setSearchQuery("");
                setTypeFilter("All");
                setLocationFilter("All");
                setBatchFilter("All");
              }}
            >
              Clear filters
            </button>
          )}
        </div>

        {filtered.length === 0 ? (
          <div className="card" style={{ padding: "40px 20px", textAlign: "center" }}>
            <Briefcase size={36} color="var(--muted)" style={{ margin: "0 auto 10px" }} />
            <h3 style={{ fontSize: 16, margin: "0 0 6px" }}>No matching opportunities found</h3>
            <p style={{ color: "var(--muted)", fontSize: 12, margin: 0 }}>
              Try adjusting your search query or filters to see more placement drives.
            </p>
          </div>
        ) : (
          filtered.map((job) => (
            <div
              key={job.id}
              className="card job-card-item"
              style={{
                padding: "18px 20px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: 16,
                transition: "all 0.2s ease",
              }}
            >
              <div style={{ display: "flex", alignItems: "flex-start", gap: 16, flex: 1, minWidth: 280 }}>
                {/* Company Logo */}
                <div
                  style={{
                    width: 52,
                    height: 52,
                    borderRadius: 12,
                    overflow: "hidden",
                    border: "1px solid var(--line)",
                    flexShrink: 0,
                    background: "var(--card-subtle)",
                  }}
                >
                  <img
                    src={job.logo}
                    alt={job.company}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                </div>

                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                    <h3 style={{ fontSize: 16, fontWeight: 700, margin: 0, color: "var(--ink)" }}>
                      {job.title}
                    </h3>
                    {job.isHot && (
                      <span
                        style={{
                          fontSize: 10,
                          fontWeight: 700,
                          color: "#dc2626",
                          background: "#fee2e2",
                          padding: "1px 6px",
                          borderRadius: 4,
                        }}
                      >
                        🔥 Hot Hiring
                      </span>
                    )}
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "4px 0 8px", fontSize: 12, color: "var(--muted)", flexWrap: "wrap" }}>
                    <span style={{ fontWeight: 600, color: "var(--ink)" }}>
                      {job.company}
                    </span>
                    <span>•</span>
                    <span style={{ display: "inline-flex", alignItems: "center", gap: 3 }}>
                      <MapPin size={12} /> {job.location}
                    </span>
                    <span>•</span>
                    <span style={{ display: "inline-flex", alignItems: "center", gap: 3 }}>
                      <Clock size={12} /> {job.type}
                    </span>
                    <span>•</span>
                    <span style={{ color: "#16a34a", fontWeight: 700 }}>
                      {job.salary}
                    </span>
                  </div>

                  <p style={{ margin: "0 0 10px", fontSize: 12, color: "var(--muted)", lineHeight: 1.4 }}>
                    {job.description}
                  </p>

                  {/* Skills tags */}
                  <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
                    {job.skills.map((skill) => (
                      <span
                        key={skill}
                        style={{
                          fontSize: 10.5,
                          background: "var(--card-subtle)",
                          border: "1px solid var(--line)",
                          padding: "2px 7px",
                          borderRadius: 6,
                          color: "var(--ink)",
                          fontWeight: 500,
                        }}
                      >
                        {skill}
                      </span>
                    ))}
                    <span
                      style={{
                        fontSize: 10.5,
                        background: "var(--accent-subtle)",
                        color: "var(--purple)",
                        padding: "2px 7px",
                        borderRadius: 6,
                        fontWeight: 600,
                      }}
                    >
                      Eligible: {job.batch.join(", ")} Batch
                    </span>
                  </div>
                </div>
              </div>

              {/* Action and Deadline */}
              <div style={{ textAlign: "right", display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 6 }}>
                <a
                  href={job.applyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="learning-button"
                  style={{
                    fontSize: 12,
                    padding: "8px 18px",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 6,
                    textDecoration: "none",
                  }}
                >
                  Apply Now <ExternalLink size={12} />
                </a>
                <span style={{ fontSize: 10.5, color: "var(--muted)" }}>
                  Deadline: <strong>{job.deadline}</strong> · Posted {job.postedTime}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
