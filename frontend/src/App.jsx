import { useState, useEffect } from "react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

const defaultForm = {
  gender: "Male", age: 35, country: "USA", city: "New York",
  customer_segment: "Individual", tenure_months: 12,
  signup_channel: "Web", contract_type: "Monthly",
  monthly_logins: 10, weekly_active_days: 3, avg_session_time: 15,
  features_used: 5, usage_growth_rate: 0.05, last_login_days_ago: 5,
  monthly_fee: 30, total_revenue: 360, payment_method: "Card",
  payment_failures: 0, discount_applied: "No", price_increase_last_3m: "No",
  support_tickets: 1, avg_resolution_time: 24, complaint_type: "None",
  csat_score: 4, escalations: 0, email_open_rate: 0.45,
  marketing_click_rate: 0.2, nps_score: 30, survey_response: "Satisfied",
  referral_count: 1,
};

const sections = [
  {
    title: "👤 Customer Profile",
    fields: [
      { key: "gender", label: "Gender", type: "select", options: ["Male", "Female"] },
      { key: "age", label: "Age", type: "number", min: 18, max: 100 },
      { key: "country", label: "Country", type: "select", options: ["Bangladesh","Canada","Germany","Australia","India","USA","UK"] },
      { key: "city", label: "City", type: "select", options: ["London","Sydney","New York","Dhaka","Delhi","Toronto","Berlin"] },
      { key: "customer_segment", label: "Segment", type: "select", options: ["Individual","SME","Enterprise"] },
      { key: "tenure_months", label: "Tenure (months)", type: "number", min: 1, max: 120 },
      { key: "signup_channel", label: "Signup Channel", type: "select", options: ["Web","Mobile","Referral"] },
      { key: "contract_type", label: "Contract Type", type: "select", options: ["Monthly","Quarterly","Yearly"] },
    ]
  },
  {
    title: "📊 Usage & Activity",
    fields: [
      { key: "monthly_logins", label: "Monthly Logins", type: "number", min: 0, max: 100 },
      { key: "weekly_active_days", label: "Weekly Active Days", type: "number", min: 0, max: 7 },
      { key: "avg_session_time", label: "Avg Session Time (min)", type: "number", min: 1, max: 120, step: 0.1 },
      { key: "features_used", label: "Features Used", type: "number", min: 1, max: 20 },
      { key: "usage_growth_rate", label: "Usage Growth Rate", type: "number", min: -1, max: 1, step: 0.01 },
      { key: "last_login_days_ago", label: "Days Since Last Login", type: "number", min: 0, max: 365 },
    ]
  },
  {
    title: "💳 Billing & Revenue",
    fields: [
      { key: "monthly_fee", label: "Monthly Fee ($)", type: "number", min: 0, max: 500 },
      { key: "total_revenue", label: "Total Revenue ($)", type: "number", min: 0, max: 100000 },
      { key: "payment_method", label: "Payment Method", type: "select", options: ["Card","PayPal","Bank Transfer"] },
      { key: "payment_failures", label: "Payment Failures", type: "number", min: 0, max: 20 },
      { key: "discount_applied", label: "Discount Applied", type: "select", options: ["No","Yes"] },
      { key: "price_increase_last_3m", label: "Price Increase (3mo)", type: "select", options: ["No","Yes"] },
    ]
  },
  {
    title: "🎧 Support & Satisfaction",
    fields: [
      { key: "support_tickets", label: "Support Tickets", type: "number", min: 0, max: 50 },
      { key: "avg_resolution_time", label: "Avg Resolution Time (hr)", type: "number", min: 0, max: 200, step: 0.1 },
      { key: "complaint_type", label: "Complaint Type", type: "select", options: ["None","Service","Billing","Technical"] },
      { key: "csat_score", label: "CSAT Score (1-5)", type: "number", min: 1, max: 5, step: 0.5 },
      { key: "escalations", label: "Escalations", type: "number", min: 0, max: 20 },
    ]
  },
  {
    title: "📣 Engagement & Marketing",
    fields: [
      { key: "email_open_rate", label: "Email Open Rate (0-1)", type: "number", min: 0, max: 1, step: 0.01 },
      { key: "marketing_click_rate", label: "Marketing Click Rate (0-1)", type: "number", min: 0, max: 1, step: 0.01 },
      { key: "nps_score", label: "NPS Score (-100 to 100)", type: "number", min: -100, max: 100 },
      { key: "survey_response", label: "Survey Response", type: "select", options: ["Satisfied","Neutral","Unsatisfied"] },
      { key: "referral_count", label: "Referral Count", type: "number", min: 0, max: 50 },
    ]
  }
];

function GaugeChart({ probability }) {
  const angle = probability * 180 - 90;
  const color = probability >= 0.6 ? "#ef4444" : probability >= 0.35 ? "#f59e0b" : "#22c55e";
  const pct = Math.round(probability * 100);

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      <svg width="220" height="130" viewBox="0 0 220 130">
        <defs>
          <linearGradient id="gaugeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#22c55e" />
            <stop offset="50%" stopColor="#f59e0b" />
            <stop offset="100%" stopColor="#ef4444" />
          </linearGradient>
        </defs>
        {/* Background arc */}
        <path d="M 20 110 A 90 90 0 0 1 200 110" fill="none" stroke="#1e293b" strokeWidth="18" strokeLinecap="round"/>
        {/* Colored arc */}
        <path d="M 20 110 A 90 90 0 0 1 200 110" fill="none" stroke="url(#gaugeGrad)" strokeWidth="18" strokeLinecap="round" strokeDasharray={`${probability * 283} 283`}/>
        {/* Needle */}
        <g transform={`rotate(${angle}, 110, 110)`}>
          <line x1="110" y1="110" x2="110" y2="30" stroke="white" strokeWidth="3" strokeLinecap="round"/>
          <circle cx="110" cy="110" r="7" fill="white"/>
        </g>
        {/* Labels */}
        <text x="12" y="128" fill="#64748b" fontSize="11" fontFamily="monospace">Low</text>
        <text x="88" y="24" fill="#64748b" fontSize="11" fontFamily="monospace">Med</text>
        <text x="183" y="128" fill="#64748b" fontSize="11" fontFamily="monospace">High</text>
      </svg>
      <div style={{ fontSize: 48, fontWeight: 900, color, fontFamily: "monospace", lineHeight: 1, marginTop: -10 }}>
        {pct}%
      </div>
      <div style={{ color: "#94a3b8", fontSize: 13, marginTop: 4 }}>churn probability</div>
    </div>
  );
}

function FieldInput({ field, value, onChange }) {
  const style = {
    width: "100%", padding: "9px 12px", borderRadius: 8, border: "1px solid #1e293b",
    background: "#0f172a", color: "#e2e8f0", fontSize: 14, outline: "none",
    boxSizing: "border-box", transition: "border-color 0.2s",
  };
  if (field.type === "select") {
    return (
      <select value={value} onChange={e => onChange(field.key, e.target.value)} style={style}>
        {field.options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
    );
  }
  return (
    <input
      type="number" value={value} min={field.min} max={field.max} step={field.step || 1}
      onChange={e => onChange(field.key, field.step ? parseFloat(e.target.value) : parseInt(e.target.value))}
      style={style}
    />
  );
}

export default function App() {
  const [form, setForm] = useState(defaultForm);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeSection, setActiveSection] = useState(0);

  const handleChange = (key, val) => setForm(f => ({ ...f, [key]: val }));

  const handlePredict = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_URL}/predict`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error(`API error ${res.status}`);
      const data = await res.json();
      setResult(data);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const riskColor = result
    ? result.risk_level === "High" ? "#ef4444"
    : result.risk_level === "Medium" ? "#f59e0b"
    : "#22c55e"
    : "#64748b";

  return (
    <div style={{
      minHeight: "100vh", background: "#020817",
      fontFamily: "'Inter', -apple-system, sans-serif",
      color: "#e2e8f0",
    }}>
      {/* Header */}
      <div style={{
        background: "linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)",
        borderBottom: "1px solid #1e293b", padding: "28px 32px",
        display: "flex", alignItems: "center", gap: 16,
      }}>
        <div style={{
          width: 48, height: 48, borderRadius: 14,
          background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 24, boxShadow: "0 0 20px rgba(99,102,241,0.4)"
        }}>🔮</div>
        <div>
          <h1 style={{ margin: 0, fontSize: 24, fontWeight: 800, letterSpacing: "-0.5px" }}>
            ChurnGuard <span style={{ color: "#6366f1" }}>AI</span>
          </h1>
          <p style={{ margin: 0, color: "#64748b", fontSize: 13 }}>
            Predict customer churn with machine learning · ROC-AUC 80%
          </p>
        </div>
        <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
          <div style={{ padding: "6px 14px", borderRadius: 20, background: "#1e293b", fontSize: 12, color: "#94a3b8" }}>
            🟢 Model Online
          </div>
          <div style={{ padding: "6px 14px", borderRadius: 20, background: "#1e293b", fontSize: 12, color: "#94a3b8" }}>
            📊 10,000 trained samples
          </div>
        </div>
      </div>

      <div style={{ display: "flex", maxWidth: 1400, margin: "0 auto", padding: "24px 24px", gap: 24 }}>
        {/* Left: Form */}
        <div style={{ flex: 1 }}>
          {/* Section tabs */}
          <div style={{ display: "flex", gap: 6, marginBottom: 20, flexWrap: "wrap" }}>
            {sections.map((s, i) => (
              <button key={i} onClick={() => setActiveSection(i)} style={{
                padding: "7px 14px", borderRadius: 8, border: "none", cursor: "pointer",
                background: activeSection === i ? "#6366f1" : "#0f172a",
                color: activeSection === i ? "white" : "#64748b",
                fontSize: 12, fontWeight: 600, transition: "all 0.2s",
                border: activeSection === i ? "none" : "1px solid #1e293b",
              }}>{s.title}</button>
            ))}
          </div>

          {/* Active section fields */}
          <div style={{
            background: "#0f172a", border: "1px solid #1e293b", borderRadius: 16,
            padding: 24, marginBottom: 20,
          }}>
            <h2 style={{ margin: "0 0 20px", fontSize: 16, fontWeight: 700, color: "#cbd5e1" }}>
              {sections[activeSection].title}
            </h2>
            <div style={{
              display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 16
            }}>
              {sections[activeSection].fields.map(field => (
                <div key={field.key}>
                  <label style={{ display: "block", fontSize: 12, color: "#64748b", marginBottom: 6, fontWeight: 500 }}>
                    {field.label}
                  </label>
                  <FieldInput field={field} value={form[field.key]} onChange={handleChange} />
                </div>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <button
              onClick={() => setActiveSection(Math.max(0, activeSection - 1))}
              disabled={activeSection === 0}
              style={{
                padding: "10px 20px", borderRadius: 8, border: "1px solid #1e293b",
                background: "transparent", color: activeSection === 0 ? "#334155" : "#94a3b8",
                cursor: activeSection === 0 ? "not-allowed" : "pointer", fontSize: 14,
              }}
            >← Previous</button>

            <span style={{ color: "#475569", fontSize: 13 }}>
              {activeSection + 1} / {sections.length}
            </span>

            {activeSection < sections.length - 1 ? (
              <button
                onClick={() => setActiveSection(activeSection + 1)}
                style={{
                  padding: "10px 20px", borderRadius: 8, border: "none",
                  background: "#1e293b", color: "#cbd5e1",
                  cursor: "pointer", fontSize: 14,
                }}
              >Next →</button>
            ) : (
              <button
                onClick={handlePredict}
                disabled={loading}
                style={{
                  padding: "12px 32px", borderRadius: 10, border: "none",
                  background: loading ? "#1e293b" : "linear-gradient(135deg, #6366f1, #8b5cf6)",
                  color: loading ? "#64748b" : "white", cursor: loading ? "not-allowed" : "pointer",
                  fontSize: 15, fontWeight: 700, boxShadow: loading ? "none" : "0 0 20px rgba(99,102,241,0.4)",
                  transition: "all 0.2s",
                }}
              >
                {loading ? "⏳ Analyzing..." : "🔮 Predict Churn"}
              </button>
            )}
          </div>

          {error && (
            <div style={{
              marginTop: 16, padding: 14, borderRadius: 10,
              background: "#1a0a0a", border: "1px solid #7f1d1d", color: "#fca5a5", fontSize: 13
            }}>
              ⚠️ {error}. Make sure the backend API is running at <code>{API_URL}</code>
            </div>
          )}
        </div>

        {/* Right: Results */}
        <div style={{ width: 340, flexShrink: 0 }}>
          <div style={{
            background: "#0f172a", border: "1px solid #1e293b", borderRadius: 16,
            padding: 24, position: "sticky", top: 24,
          }}>
            <h2 style={{ margin: "0 0 20px", fontSize: 16, fontWeight: 700, color: "#cbd5e1" }}>
              📈 Prediction Result
            </h2>

            {!result ? (
              <div style={{ textAlign: "center", padding: "40px 20px" }}>
                <div style={{ fontSize: 48, marginBottom: 12 }}>🎯</div>
                <p style={{ color: "#475569", fontSize: 14, lineHeight: 1.6 }}>
                  Fill in customer details and click<br /><strong style={{ color: "#6366f1" }}>Predict Churn</strong> to see results
                </p>
              </div>
            ) : (
              <div>
                {/* Gauge */}
                <GaugeChart probability={result.churn_probability} />

                {/* Risk badge */}
                <div style={{
                  marginTop: 20, padding: "12px 16px", borderRadius: 10,
                  background: `${riskColor}18`, border: `1px solid ${riskColor}40`,
                  display: "flex", alignItems: "center", justifyContent: "space-between"
                }}>
                  <span style={{ fontSize: 14, color: "#94a3b8" }}>Risk Level</span>
                  <span style={{ fontWeight: 800, color: riskColor, fontSize: 18 }}>
                    {result.risk_level === "High" ? "🔴" : result.risk_level === "Medium" ? "🟡" : "🟢"} {result.risk_level}
                  </span>
                </div>

                {/* Retention score */}
                <div style={{
                  marginTop: 12, padding: "12px 16px", borderRadius: 10,
                  background: "#0a1628", border: "1px solid #1e293b",
                  display: "flex", alignItems: "center", justifyContent: "space-between"
                }}>
                  <span style={{ fontSize: 14, color: "#94a3b8" }}>Retention Score</span>
                  <span style={{ fontWeight: 800, color: "#22c55e", fontSize: 18 }}>
                    {result.retention_score}%
                  </span>
                </div>

                {/* Risk factors */}
                {result.risk_factors.length > 0 && (
                  <div style={{ marginTop: 20 }}>
                    <h3 style={{ margin: "0 0 12px", fontSize: 13, color: "#64748b", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                      ⚠️ Risk Factors
                    </h3>
                    {result.risk_factors.map((rf, i) => (
                      <div key={i} style={{
                        padding: "8px 12px", borderRadius: 8, background: "#1a0f0f",
                        border: "1px solid #3b1515", color: "#fca5a5", fontSize: 13, marginBottom: 8
                      }}>
                        • {rf}
                      </div>
                    ))}
                  </div>
                )}

                {/* Verdict */}
                <div style={{
                  marginTop: 20, padding: 16, borderRadius: 10,
                  background: result.churn_prediction === 1 ? "#1a0a0a" : "#0a1a0a",
                  border: `1px solid ${result.churn_prediction === 1 ? "#7f1d1d" : "#14532d"}`,
                }}>
                  <p style={{ margin: 0, fontSize: 14, fontWeight: 700, color: result.churn_prediction === 1 ? "#f87171" : "#4ade80" }}>
                    {result.churn_prediction === 1
                      ? "🚨 This customer is likely to churn. Consider immediate retention action."
                      : "✅ This customer appears stable. Keep up engagement."}
                  </p>
                </div>

                {/* Re-run button */}
                <button onClick={handlePredict} style={{
                  marginTop: 16, width: "100%", padding: "11px", borderRadius: 8,
                  border: "1px solid #334155", background: "transparent",
                  color: "#94a3b8", cursor: "pointer", fontSize: 13, fontWeight: 600
                }}>
                  🔄 Re-analyze
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
