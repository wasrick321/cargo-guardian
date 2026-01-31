import { AlertCircle, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface ErrorPanelProps {
  error: string;
  statusCode?: number;
  onRetry: () => void;
}

export function ErrorPanel({ error, statusCode, onRetry }: ErrorPanelProps) {
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
          <p className="text-sm text-muted-foreground">
            {statusCode && (
              <span className="font-medium">Status {statusCode}: </span>
            )}
            {error}
          </p>
        </div>
        
        <Button onClick={onRetry} variant="outline" className="w-full">
          <RotateCcw className="mr-2 h-4 w-4" />
          Try Again
        </Button>
      </CardContent>
    </Card>
  );
}
