import { useState } from "react";
import { Leaf } from "lucide-react";
import { ShipmentForm, type ShipmentFormData } from "@/components/ShipmentForm";
import { ResultsPanel } from "@/components/ResultsPanel";
import { ErrorPanel } from "@/components/ErrorPanel";

const WEBHOOK_URL = "https://rickyy.app.n8n.cloud/webhook-test/spoilage-risk-v2";

interface ErrorState {
  message: string;
  statusCode?: number;
}

// Helper function to extract analysis from multiple response formats
function extractAnalysisText(responseData: any): any {
  // Case 0: Array response - unwrap first element
  if (Array.isArray(responseData)) {
    return extractAnalysisText(responseData[0]);
  }

  // Case 1: Simple format { text: "..." }
  if (responseData?.text) {
    return responseData.text;
  }

  // Case 2: Gemini nested format
  if (responseData?.content?.parts?.[0]?.text) {
    return responseData.content.parts[0].text;
  }

  // Case 3: Wrapped inside { status, data }
  if (responseData?.data?.text) {
    return responseData.data.text;
  }

  // Case 4: Already structured JSON (best case)
  if (responseData?.data?.crops_analysis || responseData?.crops_analysis) {
    return responseData.data ?? responseData;
  }

  // Fallback
  return null;
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
      email: data.email,
    };

    try {
      const response = await fetch(WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`Server responded with status ${response.status}`);
      }

      const responseData = await response.json();
      console.log("Raw response from webhook:", JSON.stringify(responseData, null, 2));
      
      const extracted = extractAnalysisText(responseData);
      console.log("Extracted data:", extracted);

      if (!extracted) {
        console.error("Failed to extract analysis. Full response:", responseData);
        throw new Error(
          `Unable to extract analysis from response. Response structure: ${JSON.stringify(responseData).substring(0, 200)}...`
        );
      }

      // If extracted is a STRING, try parsing JSON inside it
      let parsedResult;
      if (typeof extracted === "string") {
        try {
          parsedResult = JSON.parse(extracted);
        } catch (parseErr) {
          console.error("Failed to parse JSON string:", parseErr);
          parsedResult = extracted; // fallback to plain text
        }
      } else {
        parsedResult = extracted; // already an object
      }

      setResult(parsedResult);
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
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/30">
      {/* Header */}
      <header className="border-b bg-card/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-5">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-lg">
              <Leaf className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                Crop Spoilage Risk Assessment
              </h1>
              <p className="text-sm text-muted-foreground">
                AI-powered analysis to predict and prevent crop spoilage during transport
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-10">
        <div className="mx-auto max-w-2xl space-y-8">
          {/* Form */}
          <ShipmentForm onSubmit={handleSubmit} isLoading={isLoading} />

          {/* Results or Error */}
          {result && <ResultsPanel result={result} onReset={handleReset} />}
          {error && <ErrorPanel error={error.message} statusCode={error.statusCode} onRetry={handleRetry} />}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t bg-card/50 mt-auto">
        <div className="container mx-auto px-4 py-4 text-center text-sm text-muted-foreground">
          Powered by AI • Protecting your harvest every mile
        </div>
      </footer>
    </div>
  );
};

export default Index;
