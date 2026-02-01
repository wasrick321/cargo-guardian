import { RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ResultsPanelProps {
  result: any;
  onReset: () => void;
}

const riskColors: Record<string, string> = {
  HIGH: "bg-red-500 text-white",
  "MEDIUM-HIGH": "bg-orange-500 text-white",
  MEDIUM: "bg-yellow-400 text-black",
  LOW: "bg-green-500 text-white",
};

function RiskBadge({ level }: { level: string }) {
  return (
    <span
      className={`px-2 py-1 rounded text-xs font-semibold ${
        riskColors[level] ?? "bg-gray-400 text-white"
      }`}
    >
      {level}
    </span>
  );
}

export function ResultsPanel({ result, onReset }: ResultsPanelProps) {
  console.log("ResultsPanel received result:", JSON.stringify(result, null, 2));
  
  if (!result) {
    console.log("No result, returning null");
    return null;
  }

  const crops = result.crops_analysis ?? [];
  console.log("Crops array length:", crops.length, "Crops:", crops);

  // If no crops found, display entire result as formatted JSON
  if (crops.length === 0) {
    return (
      <div className="space-y-4">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h3 className="text-sm font-semibold text-yellow-900 mb-2">Raw Analysis Data:</h3>
          <pre className="whitespace-pre-wrap bg-white p-4 rounded text-xs overflow-auto max-h-96 border border-yellow-100">
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
        <Button onClick={onReset} variant="outline" className="w-full">
          <RotateCcw className="mr-2 h-4 w-4" />
          Run Again
        </Button>
      </div>
    );
  }

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

  return (
    <div className="space-y-6">
      {/* Summary Section */}
      {result.overall_summary_and_general_recommendations?.summary_statement && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h2 className="text-lg font-semibold text-blue-900 mb-2">Summary</h2>
          <p className="text-sm text-blue-800">
            {result.overall_summary_and_general_recommendations.summary_statement}
          </p>
        </div>
      )}

      {/* Crop Risk Cards */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold">Crop-by-Crop Risk Assessment</h2>
        {crops.map((crop: any, idx: number) => (
          <div
            key={idx}
            className="border rounded-lg p-4 shadow-sm bg-white hover:shadow-md transition"
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold">{crop.crop_name}</h3>
              <RiskBadge level={crop.risk_level} />
            </div>

            <div className="grid grid-cols-2 gap-2 mb-3 text-sm">
              <div>
                <span className="text-gray-600">Spoilage Days:</span>
                <p className="font-semibold text-gray-900">
                  {crop.estimated_days_before_spoilage}
                </p>
              </div>
              {crop.transport_risk_score && (
                <div>
                  <span className="text-gray-600">Transport Risk:</span>
                  <p className="font-semibold text-gray-900">
                    {crop.transport_risk_score}/100
                  </p>
                </div>
              )}
              {crop.storage_risk_score && (
                <div>
                  <span className="text-gray-600">Storage Risk:</span>
                  <p className="font-semibold text-gray-900">
                    {crop.storage_risk_score}/100
                  </p>
                </div>
              )}
            </div>

            {crop.preventive_actions && crop.preventive_actions.length > 0 && (
              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-2">
                  Preventive Actions
                </h4>
                <ul className="list-disc list-inside text-sm space-y-1 text-gray-700">
                  {crop.preventive_actions.map(
                    (action: string, i: number) => (
                      <li key={i}>{action}</li>
                    )
                  )}
                </ul>
              </div>
            )}
          </div>
        ))}
      </div>
      
      <Button onClick={onReset} variant="outline" className="w-full">
        <RotateCcw className="mr-2 h-4 w-4" />
        Run Again
      </Button>
    </div>
  );
}
