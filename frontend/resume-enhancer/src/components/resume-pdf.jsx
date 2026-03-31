import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Link,
} from "@react-pdf/renderer";

// ─── Design Tokens ───────────────────────────────────────────────────────────
const C = {
  // Header band
  navyDark:   "#0d2137",   // deep navy for header bg
  navyMid:    "#1a3a56",   // slightly lighter for gradient feel
  white:      "#ffffff",
  headerSub:  "#90bcd8",   // muted sky blue — contact text in header

  // Body palette
  teal:       "#0096b2",   // vivid teal — section labels, accent line, chip text
  tealLight:  "#e0f5f9",   // very light teal — skill chip background
  tealMid:    "#b2dfe9",   // medium teal — chip border
  bodyBg:     "#ffffff",

  // Typography
  bodyDark:   "#1c2b39",   // near-black — primary body text
  bodyMid:    "#3e5468",   // dark-blue-grey — subtitles, companies
  bodyLight:  "#6e8ca0",   // muted — dates, secondary labels
  ruleLine:   "#d0e6ef",   // very subtle teal-tinted divider
};

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  page: {
    fontFamily: "Helvetica",
    fontSize: 10,
    color: C.bodyDark,
    backgroundColor: C.bodyBg,
    // paddingTop here applies to ALL pages (including continuation pages)
    // The headerBand uses a negative marginTop to stay flush with the top edge on page 1
    paddingTop: 28,
  },

  // ── Full-width navy header ─────────────────────────────────────────────────
  headerBand: {
    backgroundColor: C.navyDark,
    marginTop: -28,   // pulls the band back up to the true top edge on page 1
    paddingTop: 36,   // restores the visual breathing room inside the band
    paddingBottom: 26,
    paddingHorizontal: 44,
  },
  headerTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginBottom: 8,
  },
  name: {
    fontSize: 28,
    fontFamily: "Helvetica-Bold",
    color: C.white,
    letterSpacing: 0.6,
  },
  headerTagline: {
    fontSize: 9.5,
    color: C.teal,
    fontFamily: "Helvetica-Oblique",
    textAlign: "right",
    maxWidth: 260,
  },
  contactRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    marginTop: 4,
    gap: 0,
  },
  contactItem: {
    fontSize: 8.5,
    color: C.headerSub,
    textDecoration: "none",
  },
  contactSep: {
    fontSize: 8.5,
    color: "#3d6b8a",
    marginHorizontal: 7,
  },

  // ── Teal accent bar just below the header ─────────────────────────────────
  accentBar: {
    height: 4,
    backgroundColor: C.teal,
  },

  // ── Body content area ─────────────────────────────────────────────────────
  body: {
    paddingHorizontal: 44,
    paddingTop: 22,
    paddingBottom: 36,
  },

  // ── Summary box ───────────────────────────────────────────────────────────
  summaryBox: {
    marginBottom: 20,
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: "#f0fafd",
    borderLeftWidth: 3,
    borderLeftColor: C.teal,
    borderRadius: 2,
  },
  summaryLabel: {
    fontSize: 7.5,
    fontFamily: "Helvetica-Bold",
    color: C.teal,
    textTransform: "uppercase",
    letterSpacing: 1.4,
    marginBottom: 4,
  },
  summaryText: {
    fontSize: 9.5,
    color: C.bodyMid,
    lineHeight: 1.65,
    fontFamily: "Helvetica-Oblique",
  },

  // ── Section ───────────────────────────────────────────────────────────────
  section: {
    marginBottom: 18,
  },
  sectionHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    gap: 10,
  },
  sectionAccentBar: {
    width: 4,
    height: 14,
    backgroundColor: C.teal,
    borderRadius: 2,
  },
  sectionLabel: {
    fontSize: 11,
    fontFamily: "Helvetica-Bold",
    color: C.navyDark,
    textTransform: "uppercase",
    letterSpacing: 1.6,
    flex: 1,
  },
  sectionRule: {
    height: 1,
    backgroundColor: C.ruleLine,
    marginTop: 2,
  },

  // ── Skills chips ─────────────────────────────────────────────────────────
  skillsWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
  },
  chip: {
    backgroundColor: C.tealLight,
    borderWidth: 1,
    borderColor: C.tealMid,
    borderRadius: 100,
    paddingVertical: 3,
    paddingHorizontal: 10,
    fontSize: 8.5,
    fontFamily: "Helvetica-Bold",
    color: C.teal,
  },

  // ── Entry rows ─────────────────────────────────────────────────────────────
  entry: {
    marginBottom: 12,
  },
  entryTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  entryTitle: {
    fontSize: 10.5,
    fontFamily: "Helvetica-Bold",
    color: C.bodyDark,
    flex: 1,
    paddingRight: 8,
  },
  entryDateBadge: {
    fontSize: 8,
    color: C.white,
    backgroundColor: C.teal,
    paddingVertical: 2,
    paddingHorizontal: 7,
    borderRadius: 3,
    fontFamily: "Helvetica-Bold",
    flexShrink: 0,
  },
  entrySubtitle: {
    fontSize: 9.5,
    color: C.bodyMid,
    fontFamily: "Helvetica-Oblique",
    marginTop: 2,
    marginBottom: 5,
  },
  entryGpaRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 3,
  },
  entryGpaLabel: {
    fontSize: 8.5,
    color: C.bodyLight,
  },
  entryGpaValue: {
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
    color: C.teal,
  },

  // ── Bullets ───────────────────────────────────────────────────────────────
  bullet: {
    flexDirection: "row",
    marginTop: 3,
    paddingLeft: 2,
  },
  bulletDot: {
    width: 12,
    fontSize: 12,
    color: C.teal,
    lineHeight: 1.2,
  },
  bulletText: {
    flex: 1,
    fontSize: 9.5,
    color: C.bodyMid,
    lineHeight: 1.55,
  },

  // ── Project paragraph ─────────────────────────────────────────────────────
  paragraph: {
    fontSize: 9.5,
    color: C.bodyMid,
    lineHeight: 1.55,
    marginTop: 3,
  },
});

// ─── Helpers ──────────────────────────────────────────────────────────────────

function SectionTitle({ label }) {
  return (
    <View style={styles.sectionHeaderRow}>
      <View style={styles.sectionAccentBar} />
      <Text style={styles.sectionLabel}>{label}</Text>
    </View>
  );
}

function ContactLine({ contact }) {
  if (!contact) return null;
  const parts = typeof contact === "string"
    ? contact.split(/\s*\|\s*|\s*·\s*/).map((p) => p.trim()).filter(Boolean)
    : [String(contact)];

  return (
    <View style={styles.contactRow}>
      {parts.map((part, i) => {
        const isEmail = part.includes("@");
        const isUrl = part.startsWith("http") || part.includes("linkedin.com") || part.includes("github.com") || part.includes("www.");
        let href = part;
        let display = part;
        if (isEmail) { href = `mailto:${part}`; }
        else if (isUrl && !part.startsWith("http")) { href = `https://${part}`; }
        if (isUrl) display = part.replace("https://", "").replace("http://", "");

        return (
          <React.Fragment key={i}>
            {i > 0 && <Text style={styles.contactSep}>•</Text>}
            {isEmail || isUrl ? (
              <Link src={href} style={styles.contactItem}>{display}</Link>
            ) : (
              <Text style={styles.contactItem}>{part}</Text>
            )}
          </React.Fragment>
        );
      })}
    </View>
  );
}

// ─── Main Document ────────────────────────────────────────────────────────────

export function ResumePDF({ data }) {
  if (!data) return null;

  const {
    name           = "",
    contact        = "",
    summary        = "",
    skills         = [],
    education      = [],
    experience     = [],
    projects       = [],
    certifications = [],
  } = data;

  return (
    <Document title={name || "Resume"} author={name || ""}>
      <Page size="A4" style={styles.page}>

        {/* ══ HEADER BAND ═══════════════════════════════════════════════ */}
        <View style={styles.headerBand}>
          <View style={styles.headerTopRow}>
            <Text style={styles.name}>{name}</Text>
            {summary ? (
              <Text style={styles.headerTagline} numberOfLines={2}>
                {summary.split(".")[0].trim()}
              </Text>
            ) : null}
          </View>
          <ContactLine contact={contact} />
        </View>

        {/* ══ TEAL ACCENT BAR ═══════════════════════════════════════════ */}
        <View style={styles.accentBar} />

        {/* ══ BODY ══════════════════════════════════════════════════════ */}
        <View style={styles.body}>

          {/* ── Professional Profile ──────────────────────────────────── */}
          {summary ? (
            <View style={styles.summaryBox}>
              <Text style={styles.summaryLabel}>Professional Profile</Text>
              <Text style={styles.summaryText}>{summary}</Text>
            </View>
          ) : null}

          {/* ── Skills ────────────────────────────────────────────────── */}
          {skills.length > 0 && (
            <View style={styles.section}>
              <SectionTitle label="Core Skills" />
              <View style={styles.skillsWrap}>
                {skills.map((s, i) => (
                  <Text key={i} style={styles.chip}>
                    {typeof s === "string" ? s : String(s)}
                  </Text>
                ))}
              </View>
            </View>
          )}

          {/* ── Experience ────────────────────────────────────────────── */}
          {experience.length > 0 && (
            <View style={styles.section}>
              <SectionTitle label="Professional Experience" />

              {experience.map((exp, i) => {
                const title   = exp.title || exp.role || exp.position || exp.name || "";
                const company = exp.company || exp.organization || exp.employer || "";
                const years   = exp.years || exp.date || exp.duration || "";
                let resps = exp.responsibilities || exp.bullets || exp.description || exp.details || exp.tasks || [];
                if (typeof resps === "string") resps = resps.split(".").map(s => s.trim()).filter(Boolean);
                if (!Array.isArray(resps)) resps = [];

                return (
                  <View key={i} style={styles.entry} wrap={false}>
                    <View style={styles.entryTopRow}>
                      <Text style={styles.entryTitle}>{title}</Text>
                      {years ? <Text style={styles.entryDateBadge}>{years}</Text> : null}
                    </View>
                    {company ? <Text style={styles.entrySubtitle}>{company}</Text> : null}
                    {resps.map((r, j) => (
                      <View key={j} style={styles.bullet}>
                        <Text style={styles.bulletDot}>›</Text>
                        <Text style={styles.bulletText}>{r}</Text>
                      </View>
                    ))}
                  </View>
                );
              })}
            </View>
          )}

          {/* ── Education ─────────────────────────────────────────────── */}
          {education.length > 0 && (
            <View style={styles.section}>
              <SectionTitle label="Education" />

              {education.map((edu, i) => {
                const degree      = edu.degree || edu.program || edu.title || "";
                const institution = edu.institution || edu.school || edu.university || "";
                const gpa         = edu.gpa || edu.cgpa || edu.cumulative_gpa || edu.grade_point_average || edu.score || edu.grade || "";
                const years       = edu.years || edu.date || edu.duration || "";

                return (
                  <View key={i} style={styles.entry} wrap={false}>
                    <View style={styles.entryTopRow}>
                      <Text style={styles.entryTitle}>{degree}</Text>
                      {years ? <Text style={styles.entryDateBadge}>{years}</Text> : null}
                    </View>
                    {institution ? (
                      <Text style={styles.entrySubtitle}>{institution}</Text>
                    ) : null}
                    {gpa ? (
                      <View style={styles.entryGpaRow}>
                        <Text style={styles.entryGpaLabel}>CGPA  </Text>
                        <Text style={styles.entryGpaValue}>{gpa} / 10.0</Text>
                      </View>
                    ) : null}
                  </View>
                );
              })}
            </View>
          )}

          {/* ── Projects ──────────────────────────────────────────────── */}
          {projects.length > 0 && (
            <View style={styles.section}>
              <SectionTitle label="Selected Projects" />

              {projects.map((proj, i) => {
                const projName = proj.name || proj.title || proj.projectName || "";
                const date     = proj.years || proj.date || "";

                // ── Exhaustive content extraction ──────────────────────────
                // 1. Try all known string keys
                let desc = proj.description || proj.details || proj.summary
                         || proj.content || proj.text || proj.overview || proj.about || "";

                // 2. If still empty, check if any known key is an array and join it
                if (!desc) {
                  const arrVal = proj.description || proj.details || proj.highlights
                               || proj.bullets || proj.achievements || proj.points || [];
                  if (Array.isArray(arrVal) && arrVal.length > 0) {
                    desc = arrVal.join(". ");
                  }
                }

                // 3. Final fallback — scan ALL values in the project object
                if (!desc) {
                  const skipKeys = new Set(["name", "title", "projectName", "years", "date", "duration"]);
                  for (const [k, v] of Object.entries(proj)) {
                    if (skipKeys.has(k)) continue;
                    if (typeof v === "string" && v.length > 0) { desc = v; break; }
                    if (Array.isArray(v) && v.length > 0)      { desc = v.join(". "); break; }
                  }
                }

                return (
                  <View key={i} style={styles.entry} wrap={false}>
                    <View style={styles.entryTopRow}>
                      <Text style={styles.entryTitle}>{projName}</Text>
                      {date ? <Text style={styles.entryDateBadge}>{date}</Text> : null}
                    </View>
                    {desc ? <Text style={styles.paragraph}>{desc}</Text> : null}
                  </View>
                );
              })}
            </View>
          )}

          {/* ── Certifications ────────────────────────────────────────── */}
          {certifications.length > 0 && (
            <View style={styles.section}>
              <SectionTitle label="Certifications" />
              {certifications.map((cert, i) => (
                <View key={i} style={styles.bullet}>
                  <Text style={styles.bulletDot}>›</Text>
                  <Text style={styles.bulletText}>
                    {typeof cert === "string" ? cert : JSON.stringify(cert)}
                  </Text>
                </View>
              ))}
            </View>
          )}

        </View>
      </Page>
    </Document>
  );
}
