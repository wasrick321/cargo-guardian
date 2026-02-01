import { RotateCcw, TrendingUp, AlertTriangle, Clock, Leaf, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ScatterChart, Scatter, PieChart, Pie, Cell } from "recharts";

interface ResultsPanelProps {
  result: any;
  onReset: () => void;
}

const riskColors: Record<string, string> = {
  HIGH: "bg-red-500 text-white",
  "HIGH (especially for ripe tomatoes)": "bg-red-500 text-white",
  "MEDIUM-HIGH": "bg-orange-500 text-white",
  "Medium-High": "bg-orange-500 text-white",
  MEDIUM: "bg-yellow-400 text-black",
  "Medium": "bg-yellow-400 text-black",
  LOW: "bg-green-500 text-white",
};

const riskBgColors: Record<string, string> = {
  HIGH: "from-red-500/10 to-red-500/5 border-red-200",
  "HIGH (especially for ripe tomatoes)": "from-red-500/10 to-red-500/5 border-red-200",
  "MEDIUM-HIGH": "from-orange-500/10 to-orange-500/5 border-orange-200",
  "Medium-High": "from-orange-500/10 to-orange-500/5 border-orange-200",
  MEDIUM: "from-yellow-500/10 to-yellow-500/5 border-yellow-200",
  "Medium": "from-yellow-500/10 to-yellow-500/5 border-yellow-200",
  LOW: "from-green-500/10 to-green-500/5 border-green-200",
};

function RiskBadge({ level }: { level: string }) {
  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-bold ${
        riskColors[level] ?? "bg-gray-400 text-white"
      }`}
    >
      {level}
    </span>
  );
}

export function ResultsPanel({ result, onReset }: ResultsPanelProps) {
  if (!result) return null;

  const crops = result.crops_analysis ?? [];

  // Fallback: plain text
  if (typeof result === "string") {
    return (
      <div className="space-y-4">
        <pre className="whitespace-pre-wrap bg-gray-100 p-4 rounded text-sm leading-relaxed">
          {result}
        </pre>
        <Button onClick={onReset} variant="outline" className="w-full">
          <RotateCcw className="mr-2 h-4 w-4" />
          Run Again
        </Button>
      </div>
    );
  }

  if (crops.length === 0) {
    return (
      <div className="space-y-4">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h3 className="text-sm font-semibold text-yellow-900 mb-2">📊 Result Received (No Crops Parsed):</h3>
          <div className="bg-gray-900 rounded p-3 overflow-auto max-h-96 border border-gray-700">
            <pre className="text-xs font-mono text-green-400 whitespace-pre-wrap break-words">
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        </div>
        <Button onClick={onReset} variant="outline" className="w-full">
          <RotateCcw className="mr-2 h-4 w-4" />
          Run Again
        </Button>
      </div>
    );
  }

  // ==================== STATS CALCULATION ====================
  const riskCounts = {
    HIGH: crops.filter(c => c.risk_level?.toUpperCase().includes("HIGH")).length,
    MEDIUM: crops.filter(c => c.risk_level?.toUpperCase().includes("MEDIUM")).length,
    LOW: crops.filter(c => c.risk_level?.toUpperCase().includes("LOW")).length,
  };

  const avgTransportRisk = Math.round(
    crops.reduce((sum, c) => sum + (c.transport_risk_score || 0), 0) / crops.length
  );

  const avgStorageRisk = Math.round(
    crops.reduce((sum, c) => sum + (c.storage_risk_score || 0), 0) / crops.length
  );

  // Chart data
  const riskChartData = crops.map((c) => ({
    name: c.crop_name.substring(0, 10),
    transport: c.transport_risk_score || 0,
    storage: c.storage_risk_score || 0,
  }));

  const riskDistribution = [
    { name: "High Risk", value: riskCounts.HIGH, fill: "#ef4444" },
    { name: "Medium Risk", value: riskCounts.MEDIUM, fill: "#f59e0b" },
    { name: "Low Risk", value: riskCounts.LOW, fill: "#10b981" },
  ];

  return (
    <div className="space-y-6">
      {/* 🎯 SUMMARY STATS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="pt-6">
            <div className="text-center">
              <Leaf className="h-8 w-8 mx-auto text-blue-600 mb-2" />
              <p className="text-3xl font-bold text-blue-900">{crops.length}</p>
              <p className="text-xs text-blue-700">Total Crops</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200">
          <CardContent className="pt-6">
            <div className="text-center">
              <AlertTriangle className="h-8 w-8 mx-auto text-red-600 mb-2" />
              <p className="text-3xl font-bold text-red-900">{riskCounts.HIGH}</p>
              <p className="text-xs text-red-700">High Risk</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
          <CardContent className="pt-6">
            <div className="text-center">
              <TrendingUp className="h-8 w-8 mx-auto text-orange-600 mb-2" />
              <p className="text-3xl font-bold text-orange-900">{avgTransportRisk}</p>
              <p className="text-xs text-orange-700">Avg Transport</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="pt-6">
            <div className="text-center">
              <Zap className="h-8 w-8 mx-auto text-purple-600 mb-2" />
              <p className="text-3xl font-bold text-purple-900">{avgStorageRisk}</p>
              <p className="text-xs text-purple-700">Avg Storage</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 📊 CHARTS */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Risk Comparison Chart */}
        <Card className="border-slate-200 shadow-lg">
          <CardHeader>
            <CardTitle className="text-lg">Risk Score Comparison</CardTitle>
            <CardDescription>Transport vs Storage Risk</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={riskChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="name" fontSize={12} />
                <YAxis fontSize={12} />
                <Tooltip contentStyle={{ backgroundColor: "#f3f4f6", border: "1px solid #d1d5db" }} />
                <Legend />
                <Bar dataKey="transport" fill="#f97316" radius={[8, 8, 0, 0]} />
                <Bar dataKey="storage" fill="#8b5cf6" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Risk Distribution Pie */}
        <Card className="border-slate-200 shadow-lg">
          <CardHeader>
            <CardTitle className="text-lg">Risk Distribution</CardTitle>
            <CardDescription>Crop breakdown by risk level</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={riskDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {riskDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* 🌾 CROP-BY-CROP DETAILED CARDS */}
      <div>
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <Leaf className="h-6 w-6 text-green-600" />
          Crop Risk Assessment
        </h2>
        <div className="grid md:grid-cols-2 gap-4">
          {crops.map((crop: any, idx: number) => {
            const riskColor = crop.risk_level ? Object.keys(riskBgColors).find(k => crop.risk_level.includes(k)) : "MEDIUM";
            const bgClass = riskBgColors[riskColor || "MEDIUM"] || "from-gray-50 to-gray-100 border-gray-200";

            return (
              <Card key={idx} className={`bg-gradient-to-br ${bgClass} border-l-4 shadow-md hover:shadow-lg transition`}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-xl">{crop.crop_name}</CardTitle>
                      <p className="text-sm text-gray-600 mt-1">Days before spoilage: {crop.estimated_days_before_spoilage}</p>
                    </div>
                    <RiskBadge level={crop.risk_level} />
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Risk Scores */}
                  <div className="grid grid-cols-2 gap-2">
                    <div className="bg-white/60 rounded p-2">
                      <p className="text-xs text-gray-600">Transport Risk</p>
                      <p className="text-lg font-bold text-orange-600">{crop.transport_risk_score}/100</p>
                      <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                        <div
                          className="bg-orange-500 h-1.5 rounded-full"
                          style={{ width: `${crop.transport_risk_score}%` }}
                        ></div>
                      </div>
                    </div>
                    <div className="bg-white/60 rounded p-2">
                      <p className="text-xs text-gray-600">Storage Risk</p>
                      <p className="text-lg font-bold text-purple-600">{crop.storage_risk_score}/100</p>
                      <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                        <div
                          className="bg-purple-500 h-1.5 rounded-full"
                          style={{ width: `${crop.storage_risk_score}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>

                  {/* Preventive Actions */}
                  {crop.preventive_actions && crop.preventive_actions.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        Preventive Actions
                      </h4>
                      <ul className="space-y-1">
                        {crop.preventive_actions.slice(0, 4).map((action: string, i: number) => (
                          <li key={i} className="text-sm text-gray-700 flex gap-2">
                            <span className="text-green-600 font-bold">✓</span>
                            <span>{action}</span>
                          </li>
                        ))}
                      </ul>
                      {crop.preventive_actions.length > 4 && (
                        <p className="text-xs text-gray-500 mt-2">+{crop.preventive_actions.length - 4} more actions</p>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Action Button */}
      <Button onClick={onReset} variant="outline" className="w-full py-6 text-base font-semibold hover:bg-slate-100">
        <RotateCcw className="mr-2 h-5 w-5" />
        Run New Analysis
      </Button>
    </div>
  );
}
