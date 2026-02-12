import { Card, CardContent, CardHeader, CardTitle } from "@workspace/ui/components/card";
import { Button } from "@workspace/ui/components/button";
import { Badge } from "@workspace/ui/components/badge";
import { Progress } from "@workspace/ui/components/progress";
import { Users, Clock, Calendar, FileText, FileSpreadsheet } from "lucide-react";

interface OverviewCardsProps {
  survey: {
    responsesCollected: number;
    targetResponses: number;
    completionRate: number;
    averageTimeMinutes: number;
    status: string;
    createdAt: string;
  };
  exportLoading: boolean;
  onGeneratePDF: () => void;
  onExportExcel: () => void;
}

export function OverviewCards({ survey, exportLoading, onGeneratePDF, onExportExcel }: OverviewCardsProps) {
  return (
    <div className="grid md:grid-cols-4 gap-6">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Users className="h-4 w-4" />
            Responses
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{survey.responsesCollected}</div>
          <p className="text-sm text-muted-foreground">
            of {survey.targetResponses} target
          </p>
          <Progress value={survey.completionRate} className="mt-2" />
          <p className="text-xs text-muted-foreground mt-1">
            {survey.completionRate.toFixed(1)}% complete
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Avg. Time
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">
            {survey.averageTimeMinutes > 0 ? survey.averageTimeMinutes.toFixed(1) : "N/A"}
          </div>
          <p className="text-sm text-muted-foreground">minutes</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Badge
            className={
              survey.status === "active"
                ? "bg-green-100 text-green-800"
                : survey.status === "completed"
                  ? "bg-blue-100 text-blue-800"
                  : survey.status === "pending"
                    ? "bg-yellow-100 text-yellow-800"
                    : "bg-gray-100 text-gray-800"
            }
          >
            {survey.status}
          </Badge>
          <p className="text-sm text-muted-foreground mt-2">
            Created {new Date(survey.createdAt).toLocaleDateString()}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <Button
            onClick={onGeneratePDF}
            disabled={exportLoading}
            size="sm"
            className="w-full"
          >
            <FileText className="h-4 w-4 mr-2" />
            Download Report
          </Button>
          <Button
            onClick={onExportExcel}
            disabled={exportLoading}
            variant="outline"
            size="sm"
            className="w-full"
          >
            <FileSpreadsheet className="h-4 w-4 mr-2" />
            Export Excel
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
