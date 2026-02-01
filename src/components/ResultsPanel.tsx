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
  if (!result) return null;

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

  const crops = result.crops_analysis ?? [];

  return (
    <div className="space-y-4">
      {crops.map((crop: any, idx: number) => (
        <div
          key={idx}
          className="border rounded-lg p-4 shadow-sm bg-white"
        >
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-semibold">{crop.crop_name}</h3>
            <RiskBadge level={crop.risk_level} />
          </div>

          <p className="text-sm text-gray-600 mb-2">
            Estimated spoilage:{" "}
            <strong>{crop.estimated_days_before_spoilage}</strong>
          </p>

          {crop.preventive_actions && (
            <ul className="list-disc list-inside text-sm space-y-1">
              {crop.preventive_actions.map(
                (action: string, i: number) => (
                  <li key={i}>{action}</li>
                )
              )}
            </ul>
          )}
        </div>
      ))}
      
      <Button onClick={onReset} variant="outline" className="w-full">
        <RotateCcw className="mr-2 h-4 w-4" />
        Run Again
      </Button>
    </div>
  );
}
