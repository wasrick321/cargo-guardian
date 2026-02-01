import { AlertCircle, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface ErrorPanelProps {
  error: string;
  statusCode?: number;
  onRetry: () => void;
  debug?: any;
}

export function ErrorPanel({ error, statusCode, onRetry, debug }: ErrorPanelProps) {
  return (
    <Card className="border-destructive/20 bg-destructive/5">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-destructive">
          <AlertCircle className="h-5 w-5" />
          Request Failed
        </CardTitle>
        <CardDescription>
          There was a problem connecting to the analysis service
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="rounded-lg border border-destructive/20 bg-card p-4">
          <p className="text-sm text-muted-foreground whitespace-pre-wrap">
            {statusCode && (
              <span className="font-medium">Status {statusCode}: </span>
            )}
            {error}
          </p>
        </div>

        {debug && (
          <div className="rounded-lg bg-gray-900 p-4 border border-gray-700 overflow-auto max-h-96">
            <p className="text-xs font-mono text-yellow-400 font-semibold mb-2">Debug Info:</p>
            <pre className="text-xs font-mono text-gray-300 whitespace-pre-wrap break-words">
              {typeof debug === "string" ? debug : JSON.stringify(debug, null, 2)}
            </pre>
          </div>
        )}
        
        <Button onClick={onRetry} variant="outline" className="w-full">
          <RotateCcw className="mr-2 h-4 w-4" />
          Try Again
        </Button>
      </CardContent>
    </Card>
  );
}
