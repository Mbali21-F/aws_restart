import React, { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { base44 } from "@/api/base44Client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, Users, TrendingUp, Activity, ArrowLeft, ShieldAlert, User as UserIcon } from "lucide-react";

const riskConfig = {
  low: { label: "Low", color: "text-emerald-600", bg: "bg-emerald-50", dot: "bg-emerald-500" },
  moderate: { label: "Moderate", color: "text-amber-600", bg: "bg-amber-50", dot: "bg-amber-500" },
  high: { label: "High", color: "text-orange-600", bg: "bg-orange-50", dot: "bg-orange-500" },
  urgent: { label: "Urgent", color: "text-red-600", bg: "bg-red-50", dot: "bg-red-500" },
};

const ageLabels = {
  under_18: "Under 18", "18_30": "18–30", "31_45": "31–45", "46_60": "46–60", over_60: "Over 60"
};

export default function Community() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await base44.entities.HealthRecord.filter({ is_shared: true }, "-created_date", 100);
        setRecords(res || []);
      } catch (e) {
        setRecords([]);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const stats = useMemo(() => {
    const total = records.length;
    const counts = { low: 0, moderate: 0, high: 0, urgent: 0 };
    const conditionMap = {};
    records.forEach((r) => {
      if (counts[r.risk_level] !== undefined) counts[r.risk_level]++;
      (r.predicted_conditions || []).forEach((c) => {
        conditionMap[c] = (conditionMap[c] || 0) + 1;
      });
    });
    const topConditions = Object.entries(conditionMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([name, count]) => ({ name, count }));
    return { total, counts, topConditions };
  }, [records]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-teal-50/40 to-white">
        <Loader2 className="w-8 h-8 text-teal-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-50/40 via-white to-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
        <div className="flex items-center justify-between mb-6">
          <Link to="/predict" className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-teal-600 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to prediction
          </Link>
          <Link to="/" className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-slate-200 text-slate-600 text-xs font-medium hover:border-teal-300 hover:text-teal-600 transition-colors shadow-sm">
            <UserIcon className="w-3.5 h-3.5" /> Profile
          </Link>
        </div>

        <div className="mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-teal-100/70 text-teal-700 text-xs font-medium mb-4">
            <Users className="w-3.5 h-3.5" /> Community Health Pulse
          </div>
          <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-slate-900 mb-3">
            What your community is experiencing
          </h1>
          <p className="text-slate-500 max-w-2xl leading-relaxed">
            Anonymized, aggregated insights from shared health assessments — helping spot trends and common conditions across the community.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-10">
          <Card className="p-5 rounded-2xl border-slate-200/70 shadow-sm">
            <p className="text-3xl font-semibold text-slate-900">{stats.total}</p>
            <p className="text-xs text-slate-500 mt-1">Total Assessments</p>
          </Card>
          {Object.entries(riskConfig).map(([key, cfg]) => (
            <Card key={key} className="p-5 rounded-2xl border-slate-200/70 shadow-sm">
              <div className="flex items-center gap-2 mb-1">
                <span className={`w-2 h-2 rounded-full ${cfg.dot}`} />
                <span className={`text-2xl font-semibold ${cfg.color}`}>{stats.counts[key]}</span>
              </div>
              <p className="text-xs text-slate-500">{cfg.label} Risk</p>
            </Card>
          ))}
        </div>

        {/* Top conditions */}
        {stats.topConditions.length > 0 && (
          <Card className="p-6 rounded-2xl border-slate-200/70 shadow-sm mb-10">
            <div className="flex items-center gap-2 mb-5">
              <TrendingUp className="w-4 h-4 text-teal-600" />
              <h2 className="text-sm font-semibold text-slate-700">Most Common Predicted Conditions</h2>
            </div>
            <div className="space-y-3">
              {stats.topConditions.map((c, i) => {
                const pct = stats.total ? Math.round((c.count / stats.total) * 100) : 0;
                return (
                  <div key={i}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-slate-600 font-medium">{c.name}</span>
                      <span className="text-slate-400">{c.count} reports · {pct}%</span>
                    </div>
                    <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${pct}%` }}
                        transition={{ duration: 0.6, delay: i * 0.08 }}
                        className="h-full rounded-full bg-teal-500"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        )}

        {/* Recent records */}
        <h2 className="text-sm font-semibold text-slate-700 mb-4 flex items-center gap-2">
          <Activity className="w-4 h-4 text-teal-600" /> Recent Community Reports
        </h2>
        {records.length === 0 ? (
          <Card className="p-10 rounded-2xl border-dashed border-slate-200 text-center">
            <ShieldAlert className="w-8 h-8 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-500 text-sm">No community reports yet. Be the first to share your health assessment.</p>
            <Link to="/predict">
              <Button className="mt-4 bg-teal-600 hover:bg-teal-700 text-white rounded-xl">Create an Assessment</Button>
            </Link>
          </Card>
        ) : (
          <div className="grid sm:grid-cols-2 gap-3">
            {records.map((r) => {
              const cfg = riskConfig[r.risk_level] || riskConfig.low;
              return (
                <Card key={r.id} className="p-5 rounded-2xl border-slate-200/70 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-3">
                    <div className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full ${cfg.bg} ${cfg.color} text-xs font-medium`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} /> {cfg.label} Risk
                    </div>
                    <span className="text-xs text-slate-400">{ageLabels[r.age_range] || "—"}</span>
                  </div>
                  <p className="text-sm text-slate-700 leading-relaxed line-clamp-3 mb-3">{r.prediction}</p>
                  {r.predicted_conditions?.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {r.predicted_conditions.slice(0, 3).map((c, i) => (
                        <span key={i} className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-500 text-xs">{c}</span>
                      ))}
                    </div>
                  )}
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
