import { useState } from "react";
import { Leaf } from "lucide-react";
import { ShipmentForm, type ShipmentFormData } from "@/components/ShipmentForm";
import { ResultsPanel } from "@/components/ResultsPanel";
import { ErrorPanel } from "@/components/ErrorPanel";

const WEBHOOK_URL = "https://rickyy.app.n8n.cloud/webhook-test/spoilage-risk-v2";

interface AnalysisResult {
  text?: string;
}

interface ErrorState {
  message: string;
  statusCode?: number;
}

const Index = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<ErrorState | null>(null);
  const [lastFormData, setLastFormData] = useState<ShipmentFormData | null>(null);

  const handleSubmit = async (data: ShipmentFormData) => {
    setIsLoading(true);
    setError(null);
    setResult(null);
    setLastFormData(data);

    const payload = {
      truck_id: data.truck_id,
      truck_city: data.truck_city,
      crops: data.crops,
      warehouse_city: data.warehouse_city,
      transport_type: data.transport_type,
      email: data.email,
    };

    try {
      const response = await fetch(WEBHOOK_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`Server responded with status ${response.status}`);
      }

      const responseData = await response.json();
      setResult(responseData);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An unexpected error occurred";
      const statusMatch = errorMessage.match(/status (\d+)/);
      setError({
        message: errorMessage,
        statusCode: statusMatch ? parseInt(statusMatch[1], 10) : undefined,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setResult(null);
    setError(null);
    setLastFormData(null);
  };

  const handleRetry = () => {
    if (lastFormData) {
      handleSubmit(lastFormData);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Leaf className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Crop Spoilage Risk Assessment</h1>
              <p className="text-sm text-muted-foreground">
                AI-powered analysis to predict and prevent crop spoilage during transport
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="mx-auto max-w-2xl space-y-6">
          {/* Form */}
          <ShipmentForm onSubmit={handleSubmit} isLoading={isLoading} />

          {/* Results or Error */}
          {result && <ResultsPanel result={result} onReset={handleReset} />}
          {error && <ErrorPanel error={error.message} statusCode={error.statusCode} onRetry={handleRetry} />}
        </div>
      </main>
    </div>
  );
};

export default Index;
