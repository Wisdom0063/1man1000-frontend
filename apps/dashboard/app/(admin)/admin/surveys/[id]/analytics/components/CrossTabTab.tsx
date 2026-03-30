import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { Button } from "@workspace/ui/components/button";
import { Label } from "@workspace/ui/components/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select";
import { TrendingUp, Download } from "lucide-react";

interface CrossTabTabProps {
  survey: any;
  selectedQuestion: string;
  setSelectedQuestion: (q: string) => void;
  selectedSegment: string;
  setSelectedSegment: (s: any) => void;
  hasResponses: boolean;
  crossTabData?: any;
}

export function CrossTabTab(props: CrossTabTabProps) {
  const {
    survey,
    selectedQuestion,
    setSelectedQuestion,
    selectedSegment,
    setSelectedSegment,
    hasResponses,
    crossTabData,
  } = props;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Cross-Tabulation Analysis</CardTitle>
        <CardDescription>
          Analyze responses by demographic segments
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-3 gap-4 mb-6">
          <div>
            <Label>Select Question</Label>
            <Select
              value={selectedQuestion}
              onValueChange={setSelectedQuestion}
            >
              <SelectTrigger>
                <SelectValue placeholder="Choose a question" />
              </SelectTrigger>
              <SelectContent>
                {survey.answers.map((answer: any, index: number) => (
                  <SelectItem key={answer.questionId} value={answer.questionId}>
                    Q{index + 1}: {answer.questionText.substring(0, 50)}...
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Segment By</Label>
            <Select value={selectedSegment} onValueChange={setSelectedSegment}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="age">Age Range</SelectItem>
                <SelectItem value="gender">Gender</SelectItem>
                <SelectItem value="location">Location</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {/* <div className="flex items-end">
            <Button className="w-full" disabled={!selectedQuestion}>
              <TrendingUp className="h-4 w-4 mr-2" />
              Generate Report
            </Button>
          </div> */}
        </div>
        {crossTabData && crossTabData.breakdowns && (
          <div className="space-y-4 mt-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">
                {crossTabData.questionText}
              </h3>
              {/* <Button size="sm" variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Export Report (PDF)
              </Button> */}
            </div>
            <p className="text-sm text-muted-foreground">
              Segmented by {selectedSegment.replace("_", " ")}
            </p>

            <div className="overflow-x-auto border rounded-lg">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-muted border-b">
                    <th className="p-3 text-left text-sm font-medium border-r">
                      Segment
                    </th>
                    <th className="p-3 text-left text-sm font-medium border-r">
                      Count
                    </th>
                    <th className="p-3 text-left text-sm font-medium border-r">
                      Percentage
                    </th>
                    {Object.keys(
                      crossTabData.breakdowns[0]?.responses || {},
                    ).map((answer) => (
                      <th
                        key={answer}
                        className="p-3 text-left text-sm font-medium border-r last:border-r-0"
                      >
                        {answer}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {crossTabData.breakdowns.map((breakdown: any) => (
                    <tr key={breakdown.segment} className="border-b">
                      <td className="p-3 text-sm font-medium border-r capitalize">
                        {breakdown.segment}
                      </td>
                      <td className="p-3 text-sm border-r">
                        {breakdown.count}
                      </td>
                      <td className="p-3 text-sm border-r">
                        {breakdown.percentage.toFixed(1)}%
                      </td>
                      {Object.entries(breakdown.responses).map(
                        ([answer, count]) => (
                          <td
                            key={answer}
                            className="p-3 text-sm border-r last:border-r-0"
                          >
                            {count as number} (
                            {(
                              ((count as number) / breakdown.count) *
                              100
                            ).toFixed(1)}
                            %)
                          </td>
                        ),
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {!crossTabData && selectedQuestion && (
          <div className="text-center py-8 text-muted-foreground">
            <p>
              Select a question and segment to view cross-tabulation analysis
            </p>
          </div>
        )}

        {hasResponses && !selectedQuestion && (
          <div className="grid md:grid-cols-3 gap-6">
            {Object.keys(survey.demographics.age).length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Age Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  {Object.entries(survey.demographics.age).map(
                    ([age, count]) => (
                      <div key={age} className="flex justify-between">
                        <span className="text-sm">{age}</span>
                        <span className="font-medium">{count as number}</span>
                      </div>
                    ),
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
