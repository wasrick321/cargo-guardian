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

interface AnalysisResult {
  crops_analysis?: Array<{
    crop_name: string;
    risk_level: string;
    estimated_days_before_spoilage: number | string;
    preventive_actions?: string[];
  }>;
  [key: string]: any;
}

// Helper function to extract analysis from multiple response formats
function extractAnalysisText(responseData: any): any {
  console.log("=== EXTRACTION START ===");
  console.log("Input type:", typeof responseData, "isArray:", Array.isArray(responseData));
  console.log("Input data:", responseData);
  
  // Case 0: Array response - unwrap first element
  if (Array.isArray(responseData)) {
    console.log("→ Case 0: Is array, unwrapping...");
    if (responseData.length === 0) {
      console.log("→ Array is empty, returning null");
      return null;
    }
    const unwrapped = responseData[0];
    console.log("→ Unwrapped first element:", unwrapped);
    return extractAnalysisText(unwrapped);
  }

  // Case 4: Wrapped in output { output: { crops_analysis: [...] } }
  console.log("→ Checking for output.crops_analysis...");
  console.log("  responseData exists?", !!responseData);
  console.log("  responseData.output exists?", !!responseData?.output);
  console.log("  responseData.output.crops_analysis exists?", !!responseData?.output?.crops_analysis);
  
  if (responseData?.output?.crops_analysis) {
    console.log("→ Case 4: Found output.crops_analysis format!");
    console.log("  Returning:", responseData.output);
    return responseData.output;
  }

  // Case 1: Simple format { text: "..." }
  if (responseData?.text) {
    console.log("→ Case 1: Found simple text format");
    return responseData.text;
  }

  // Case 2: Gemini nested format
  if (responseData?.content?.parts?.[0]?.text) {
    console.log("→ Case 2: Found Gemini nested format");
    return responseData.content.parts[0].text;
  }

  // Case 3: Wrapped inside { status, data }
  if (responseData?.data?.text) {
    console.log("→ Case 3: Found wrapped data.text format");
    return responseData.data.text;
  }

  // Case 5: Already structured JSON (best case)
  if (responseData?.crops_analysis) {
    console.log("→ Case 5a: Found structured crops_analysis format");
    return responseData;
  }

  if (responseData?.data?.crops_analysis) {
    console.log("→ Case 5b: Found data.crops_analysis format");
    return responseData.data;
  }

  console.error("✗ Could not extract from any known format");
  console.error("  Response keys:", Object.keys(responseData || {}));
  console.error("  Full response:", responseData);
  return null;
}

const Index = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<ErrorState & { fullResponse?: any } | null>(null);
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
      console.log("Sending payload to webhook:", JSON.stringify(payload, null, 2));
      
      const response = await fetch(WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      console.log("Response status:", response.status, response.statusText);
      console.log("Response headers:", {
        contentType: response.headers.get("content-type"),
        contentLength: response.headers.get("content-length"),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Error response body:", errorText);
        throw new Error(`Server responded with status ${response.status}: ${errorText}`);
      }

      const responseText = await response.text();
      console.log("Raw response text:", responseText);
      
      let responseData;
      try {
        responseData = JSON.parse(responseText);
      } catch (parseErr) {
        console.error("Failed to parse response as JSON:", parseErr);
        throw new Error(`Response is not valid JSON: ${responseText.substring(0, 500)}`);
      }
      
      console.log("Parsed response from webhook:", JSON.stringify(responseData, null, 2));
      
      // DIRECT SIMPLE ACCESS - no extraction function
      let result: any = responseData;
      
      // If it's an array, get first element
      if (Array.isArray(result)) {
        console.log("Is array, taking first element");
        result = result[0];
      }
      
      console.log("After array unwrap:", JSON.stringify(result, null, 2));
      
      // If it has output.crops_analysis, move it to root
      if (result?.output?.crops_analysis) {
        console.log("Found output.crops_analysis, extracting...");
        result = result.output;
      }
      
      // Verify we have crops_analysis
      if (!result?.crops_analysis || !Array.isArray(result.crops_analysis)) {
        console.error("✗ Still no crops_analysis! Result:", result);
        // Display the raw console response on the frontend for debugging per user request
        setResult({ raw_console: responseText } as any);
        // Stop further processing
        return;
      }
      
      console.log("✓ SUCCESS! Crops found:", result.crops_analysis.length);
      setResult(result);
    } catch (err) {
      console.error("Fetch/Processing error:", err);
      const errorMessage = err instanceof Error ? err.message : "An unexpected error occurred";
      const statusMatch = errorMessage.match(/status (\d+)/);
      
      let fullResponse = null;
      try {
        // Try to extract response body if available
        if (err instanceof Error && err.message.includes("Server responded with status")) {
          const bodyMatch = err.message.match(/: (.+)$/);
          if (bodyMatch) {
            fullResponse = bodyMatch[1];
          }
        }
      } catch (e) {
        // ignore
      }
      
      setError({
        message: errorMessage,
        statusCode: statusMatch ? parseInt(statusMatch[1], 10) : undefined,
        fullResponse,
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
          {error && <ErrorPanel error={error.message} statusCode={error.statusCode} onRetry={handleRetry} debug={error.fullResponse} />}
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
