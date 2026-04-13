import { useState } from "react";
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts";

const months = ["Jan", "Fév", "Mar", "Avr", "Mai", "Jun", "Jul", "Aoû", "Sep", "Oct", "Nov", "Déc"];

const initialData = [
  { mois: "Jan", ca: 18400, charges: 14200, tresorerie: 8200, resultat: 4200 },
  { mois: "Fév", ca: 21000, charges: 15100, tresorerie: 11300, resultat: 5900 },
  { mois: "Mar", ca: 19500, charges: 16800, tresorerie: 9200, resultat: 2700 },
  { mois: "Avr", ca: 23800, charges: 15400, tresorerie: 13600, resultat: 8400 },
  { mois: "Mai", ca: 22100, charges: 17200, tresorerie: 10400, resultat: 4900 },
  { mois: "Jun", ca: 26500, charges: 16900, tresorerie: 15800, resultat: 9600 },
  { mois: "Jul", ca: 20300, charges: 15600, tresorerie: 12100, resultat: 4700 },
  { mois: "Aoû", ca: 17200, charges: 13800, tresorerie: 9800, resultat: 3400 },
  { mois: "Sep", ca: 25600, charges: 17500, tresorerie: 14200, resultat: 8100 },
  { mois: "Oct", ca: 28900, charges: 18200, tresorerie: 17400, resultat: 10700 },
  { mois: "Nov", ca: 27400, charges: 19100, tresorerie: 15600, resultat: 8300 },
  { mois: "Déc", ca: 31200, charges: 20400, tresorerie: 18900, resultat: 10800 },
];

const fmt = (n) => new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(n);
const pct = (a, b) => b === 0 ? 0 : Math.round(((a - b) / b) * 100);

const Signal = ({ value, seuils }) => {
  let color, label;
  if (value >= seuils.green) { color = "#22c55e"; label = "BON"; }
  else if (value >= seuils.orange) { color = "#f59e0b"; label = "ATTENTION"; }
  else { color = "#ef4444"; label = "ALERTE"; }
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", color }}>
      <span style={{ width: 8, height: 8, borderRadius: "50%", background: color, boxShadow: `0 0 6px ${color}` }} />
      {label}
    </span>
  );
};

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: "#0f1419", border: "1px solid #1e2d3d", borderRadius: 8, padding: "10px 14px", fontSize: 12 }}>
      <div style={{ color: "#64748b", marginBottom: 6, fontWeight: 600 }}>{label}</div>
      {payload.map((p, i) => (
        <div key={i} style={{ color: p.color, marginBottom: 2 }}>{p.name} : <strong>{fmt(p.value)}</strong></div>
      ))}
    </div>
  );
};

export default function Dashboard() {
  const [data, setData] = useState(initialData);
  const [moisCourant, setMoisCourant] = useState(11);
  const [commentaire, setCommentaire] = useState("Excellente fin d'année portée par les contrats signés en T3. Surveiller la hausse des charges en décembre (+6,8%). Trésorerie au plus haut : anticiper les investissements T1.");
  const [nomEntreprise, setNomEntreprise] = useState("Dupont & Fils SARL");
  const [editingField, setEditingField] = useState(null);

  const current = data[moisCourant];
  const prev = moisCourant > 0 ? data[moisCourant - 1] : data[0];
  const marginRate = Math.round((current.resultat / current.ca) * 100);

  const updateValue = (field, value) => {
    const updated = [...data];
    const num = parseInt(value.replace(/\D/g, "")) || 0;
    updated[moisCourant] = {
      ...updated[moisCourant],
      [field]: num,
      resultat: field === "ca" ? num - updated[moisCourant].charges : updated[moisCourant].ca - (field === "charges" ? num : updated[moisCourant].charges)
    };
    setData(updated);
  };

  const KpiCard = ({ label, value, prevVal, field, seuils }) => {
    const delta = pct(value, prevVal);
    const isEditing = editingField === field;
    const scoreVal = field === "marge"
      ? value
      : Math.round((value / (field === "tresorerie" ? 20000 : field === "ca" ? 35000 : field === "charges" ? 25000 : 15000)) * 100);

    return (
      <div style={{ background: "linear-gradient(135deg, #111827 0%, #0f1923 100%)", border: "1px solid #1e2d3d", borderRadius: 12, padding: "20px 22px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: 0, right: 0, width: 60, height: 60, background: "radial-gradient(circle, rgba(56,189,248,0.06) 0%, transparent 70%)", borderRadius: "0 12px 0 60px" }} />
        <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.14em", color: "#475569", marginBottom: 10, textTransform: "uppercase" }}>{label}</div>
        <Signal value={scoreVal} seuils={seuils} />
        <div style={{ marginTop: 10, display: "flex", alignItems: "flex-end", gap: 8 }}>
          {isEditing ? (
            <input
              autoFocus
              defaultValue={value}
              onBlur={(e) => { updateValue(field, e.target.value); setEditingField(null); }}
              onKeyDown={(e) => { if (e.key === "Enter") { updateValue(field, e.target.value); setEditingField(null); } }}
              style={{ background: "transparent", border: "none", borderBottom: "1px solid #38bdf8", color: "#f1f5f9", fontSize: 26, fontWeight: 800, fontFamily: "inherit", width: "100%", outline: "none" }}
            />
          ) : (
            <div
              onClick={() => field !== "marge" && setEditingField(field)}
              style={{ fontSize: 26, fontWeight: 800, color: "#f1f5f9", letterSpacing: "-0.02em", cursor: field !== "marge" ? "pointer" : "default", fontVariantNumeric: "tabular-nums" }}
              title={field !== "marge" ? "Cliquer pour modifier" : ""}
            >
              {field === "marge" ? `${value}%` : fmt(value)}
            </div>
          )}
        </div>
        <div style={{ marginTop: 8, fontSize: 11, color: delta >= 0 ? "#22c55e" : "#ef4444", fontWeight: 600 }}>
          {delta >= 0 ? "▲" : "▼"} {Math.abs(delta)}% vs mois préc.
        </div>
      </div>
    );
  };

  return (
    <div style={{ minHeight: "100vh", background: "#080d13", color: "#e2e8f0", fontFamily: "'DM Mono', 'Courier New', monospace", padding: 0 }}>

      {/* Header */}
      <div style={{ background: "linear-gradient(180deg, #0a1628 0%, #080d13 100%)", borderBottom: "1px solid #1e2d3d", padding: "20px 32px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ width: 36, height: 36, borderRadius: 8, background: "linear-gradient(135deg, #38bdf8, #0ea5e9)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, fontWeight: 900, color: "#fff" }}>◈</div>
          <div>
            <div style={{ fontSize: 10, letterSpacing: "0.2em", color: "#38bdf8", fontWeight: 700, textTransform: "uppercase" }}>Reporting Dirigeant</div>
            <input
              value={nomEntreprise}
              onChange={e => setNomEntreprise(e.target.value)}
              style={{ background: "transparent", border: "none", color: "#f1f5f9", fontSize: 18, fontWeight: 800, fontFamily: "inherit", outline: "none", letterSpacing: "-0.01em", width: 260 }}
            />
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ fontSize: 10, color: "#475569", letterSpacing: "0.1em", textTransform: "uppercase" }}>Mois affiché</div>
          <select
            value={moisCourant}
            onChange={e => setMoisCourant(+e.target.value)}
            style={{ background: "#111827", border: "1px solid #1e2d3d", color: "#f1f5f9", padding: "6px 12px", borderRadius: 8, fontSize: 13, fontFamily: "inherit", fontWeight: 600, cursor: "pointer" }}
          >
            {months.map((m, i) => <option key={i} value={i}>{m} 2024</option>)}
          </select>
        </div>
      </div>

      <div style={{ padding: "28px 32px", maxWidth: 1200, margin: "0 auto" }}>

        {/* KPI Row */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 28 }}>
          <KpiCard label="Chiffre d'affaires" value={current.ca} prevVal={prev.ca} field="ca" seuils={{ green: 70, orange: 40 }} />
          <KpiCard label="Charges totales" value={current.charges} prevVal={prev.charges} field="charges" seuils={{ green: 60, orange: 35 }} />
          <KpiCard label="Trésorerie" value={current.tresorerie} prevVal={prev.tresorerie} field="tresorerie" seuils={{ green: 65, orange: 40 }} />
          <KpiCard label="Taux de marge" value={marginRate} prevVal={Math.round((prev.resultat / prev.ca) * 100)} field="marge" seuils={{ green: 70, orange: 40 }} />
        </div>

        {/* Charts Row */}
        <div style={{ display: "grid", gridTemplateColumns: "1.6fr 1fr", gap: 16, marginBottom: 28 }}>
          <div style={{ background: "linear-gradient(135deg, #111827 0%, #0f1923 100%)", border: "1px solid #1e2d3d", borderRadius: 12, padding: "20px 22px" }}>
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.14em", color: "#475569", marginBottom: 16, textTransform: "uppercase" }}>Évolution CA vs Charges — 12 mois</div>
            <ResponsiveContainer width="100%" height={180}>
              <AreaChart data={data} margin={{ top: 5, right: 5, left: 5, bottom: 0 }}>
                <defs>
                  <linearGradient id="gCA" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#38bdf8" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="gCH" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e2d3d" />
                <XAxis dataKey="mois" tick={{ fill: "#475569", fontSize: 10, fontFamily: "inherit" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "#475569", fontSize: 10, fontFamily: "inherit" }} axisLine={false} tickLine={false} tickFormatter={v => `${(v / 1000).toFixed(0)}k`} />
                <Tooltip content={<CustomTooltip />} />
                <ReferenceLine x={data[moisCourant].mois} stroke="#38bdf8" strokeDasharray="4 4" strokeOpacity={0.5} />
                <Area type="monotone" dataKey="ca" name="CA" stroke="#38bdf8" strokeWidth={2} fill="url(#gCA)" dot={false} />
                <Area type="monotone" dataKey="charges" name="Charges" stroke="#f59e0b" strokeWidth={2} fill="url(#gCH)" dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div style={{ background: "linear-gradient(135deg, #111827 0%, #0f1923 100%)", border: "1px solid #1e2d3d", borderRadius: 12, padding: "20px 22px" }}>
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.14em", color: "#475569", marginBottom: 16, textTransform: "uppercase" }}>Résultat mensuel</div>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={data} margin={{ top: 5, right: 5, left: 5, bottom: 0 }} barSize={14}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e2d3d" vertical={false} />
                <XAxis dataKey="mois" tick={{ fill: "#475569", fontSize: 9, fontFamily: "inherit" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "#475569", fontSize: 9, fontFamily: "inherit" }} axisLine={false} tickLine={false} tickFormatter={v => `${(v / 1000).toFixed(0)}k`} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="resultat" name="Résultat" fill="#22c55e" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Bottom Row */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          <div style={{ background: "linear-gradient(135deg, #111827 0%, #0f1923 100%)", border: "1px solid #1e2d3d", borderRadius: 12, padding: "20px 22px" }}>
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.14em", color: "#475569", marginBottom: 16, textTransform: "uppercase" }}>Synthèse du mois</div>
            {[
              { label: "Résultat net", value: fmt(current.resultat), ok: current.resultat > 0 },
              { label: "Taux de marge", value: `${marginRate}%`, ok: marginRate > 20 },
              { label: "Cumul CA annuel", value: fmt(data.slice(0, moisCourant + 1).reduce((s, d) => s + d.ca, 0)), ok: true },
              { label: "Cumul résultat annuel", value: fmt(data.slice(0, moisCourant + 1).reduce((s, d) => s + d.resultat, 0)), ok: data.slice(0, moisCourant + 1).reduce((s, d) => s + d.resultat, 0) > 0 },
              { label: "Ratio charges / CA", value: `${Math.round((current.charges / current.ca) * 100)}%`, ok: (current.charges / current.ca) < 0.75 },
            ].map((item, i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "9px 0", borderBottom: i < 4 ? "1px solid #1e2d3d" : "none" }}>
                <span style={{ fontSize: 12, color: "#94a3b8" }}>{item.label}</span>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ fontSize: 13, fontWeight: 700, color: "#f1f5f9", fontVariantNumeric: "tabular-nums" }}>{item.value}</span>
                  <span style={{ width: 7, height: 7, borderRadius: "50%", background: item.ok ? "#22c55e" : "#ef4444", boxShadow: `0 0 5px ${item.ok ? "#22c55e" : "#ef4444"}`, flexShrink: 0 }} />
                </div>
              </div>
            ))}
          </div>

          <div style={{ background: "linear-gradient(135deg, #111827 0%, #0f1923 100%)", border: "1px solid #1e2d3d", borderRadius: 12, padding: "20px 22px", display: "flex", flexDirection: "column" }}>
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.14em", color: "#475569", marginBottom: 12, textTransform: "uppercase" }}>
              Analyse & recommandations
              <span style={{ marginLeft: 10, color: "#38bdf8", fontSize: 9 }}>— éditable</span>
            </div>
            <textarea
              value={commentaire}
              onChange={e => setCommentaire(e.target.value)}
              placeholder="Saisissez votre analyse du mois, points d'attention et recommandations..."
              style={{ flex: 1, background: "#080d13", border: "1px solid #1e2d3d", borderRadius: 8, color: "#cbd5e1", fontSize: 13, fontFamily: "inherit", lineHeight: 1.7, padding: 14, resize: "none", outline: "none", minHeight: 160 }}
            />
            <div style={{ marginTop: 10, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: 10, color: "#334155" }}>Rédigé par votre assistant financier</span>
              <button
                onClick={() => window.print()}
                style={{ background: "linear-gradient(135deg, #0ea5e9, #38bdf8)", border: "none", borderRadius: 6, color: "#fff", fontSize: 11, fontWeight: 700, padding: "7px 16px", cursor: "pointer", letterSpacing: "0.08em", fontFamily: "inherit" }}
              >
                ↓ IMPRIMER
              </button>
            </div>
          </div>
        </div>

        <div style={{ marginTop: 20, textAlign: "center", fontSize: 10, color: "#1e2d3d", letterSpacing: "0.12em" }}>
          CONFIDENTIEL · {nomEntreprise} · Reporting {months[moisCourant]} 2024
        </div>
      </div>
    </div>
  );
}
