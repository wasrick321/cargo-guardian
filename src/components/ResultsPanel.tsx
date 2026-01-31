import { CheckCircle2, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface ResultsPanelProps {
  result: { text?: string } | null;
  onReset: () => void;
}

export function ResultsPanel({ result, onReset }: ResultsPanelProps) {
  if (!result) return null;

  const hasData = result.text && result.text.trim().length > 0;

  return (
    <Card className="border-primary/20 bg-primary/5">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-primary">
          <CheckCircle2 className="h-5 w-5" />
          Risk Analysis Results
        </CardTitle>
        <CardDescription>
          AI-powered spoilage risk assessment for your shipment
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {hasData ? (
          <div className="rounded-lg border bg-card p-4">
            <p className="whitespace-pre-wrap text-sm leading-relaxed">{result.text}</p>
          </div>
        ) : (
          <div className="rounded-lg border border-dashed bg-muted/50 p-4 text-center">
            <p className="text-muted-foreground">No data returned from the analysis.</p>
          </div>
        )}
        
        <Button onClick={onReset} variant="outline" className="w-full">
          <RotateCcw className="mr-2 h-4 w-4" />
          Run Again
        </Button>
      </CardContent>
    </Card>
  );
}
