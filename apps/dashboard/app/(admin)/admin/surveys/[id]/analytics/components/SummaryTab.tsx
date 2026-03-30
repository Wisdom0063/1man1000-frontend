import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { Button } from "@workspace/ui/components/button";
import { Badge } from "@workspace/ui/components/badge";
import { Download, BarChart3 } from "lucide-react";

interface SummaryTabProps {
  questionAnalytics: any[];
  hasResponses: boolean;
}

export function SummaryTab({
  questionAnalytics,
  hasResponses,
}: SummaryTabProps) {
  if (!hasResponses) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <BarChart3 className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <p className="text-muted-foreground">No responses yet.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {questionAnalytics.map((qa, index) => (
        <Card key={qa.question.id}>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>
                Q{index + 1}: {qa.question.question_text}
              </span>
              {/* <Button size="sm" variant="outline">
                <Download className="h-4 w-4 mr-2" />Download
              </Button> */}
            </CardTitle>
            <CardDescription>{qa.totalResponses} responses</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Object.entries(qa.analytics.optionPercentages).map(
                ([option, percentage]: [string, any]) => (
                  <div key={option} className="space-y-1">
                    <div className="flex justify-between">
                      <span className="text-sm">{option}</span>
                      <span className="text-sm font-medium">
                        {qa.analytics.optionCounts[option]} (
                        {percentage.toFixed(1)}%)
                      </span>
                    </div>
                    <div className="h-2 rounded-full bg-secondary overflow-hidden">
                      <div
                        className="h-full rounded-full bg-primary"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                ),
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
