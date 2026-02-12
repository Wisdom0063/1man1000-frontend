import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@workspace/ui/components/card";
import { Button } from "@workspace/ui/components/button";
import { Badge } from "@workspace/ui/components/badge";
import { BarChart3, Download } from "lucide-react";
import {
  Pie,
  PieChart,
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Cell,
} from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@workspace/ui/components/chart";
import { showCountryNameByAlpha3 } from "@/lib/show-country-name";

interface QuestionAnalytics {
  question: {
    id: string;
    question_text: string;
    question_type: string;
    is_required: boolean;
  };
  totalResponses: number;
  analytics: {
    optionCounts?: Record<string, number>;
    optionPercentages?: Record<string, number>;
    averageRating?: number;
    ratingDistribution?: Record<string, number>;
    textResponses?: string[];
    yesCount?: number;
    noCount?: number;
    yesPercentage?: number;
    noPercentage?: number;
  };
}

interface ChartsGalleryTabProps {
  hasResponses: boolean;
  questionAnalytics: QuestionAnalytics[];
  survey: any;
}

export function ChartsGalleryTab({
  hasResponses,
  questionAnalytics,
  survey,
}: ChartsGalleryTabProps) {
  const getChartColor = (index: number) => `var(--chart-${(index % 5) + 1})`;

  const renderQuestionChart = (qa: QuestionAnalytics) => {
    const questionType = qa.question.question_type;

    // Pie charts for single choice, yes/no, likert, image selection
    if (
      questionType === "multiple_choice_single" ||
      questionType === "yes_no" ||
      questionType === "likert" ||
      questionType === "image_selection"
    ) {
      if (!qa.analytics.optionCounts) return null;

      const chartData = Object.entries(qa.analytics.optionCounts).map(
        ([option, count]) => ({
          name: option,
          value: count,
          percentage: qa.analytics.optionPercentages?.[option] || 0,
        }),
      );

      const chartConfig: ChartConfig = {
        value: { label: "Responses", color: "var(--chart-1)" },
      };

      return (
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[300px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  hideLabel
                  formatter={(value, name, item) => {
                    const data = item.payload as {
                      name: string;
                      value: number;
                      percentage: number;
                    };
                    return `${data.name}: ${data.value} (${data.percentage.toFixed(1)}%)`;
                  }}
                />
              }
            />
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={100}
            >
              {chartData.map((_, index) => (
                <Cell key={`cell-${index}`} fill={getChartColor(index)} />
              ))}
            </Pie>
          </PieChart>
        </ChartContainer>
      );
    }

    // Bar charts for rating questions
    if (questionType === "rating_stars" || questionType === "rating_scale") {
      if (!qa.analytics.ratingDistribution) return null;

      const chartData = Object.entries(qa.analytics.ratingDistribution)
        .sort(([a], [b]) => parseInt(a) - parseInt(b))
        .map(([rating, count]) => ({
          rating,
          count,
        }));

      const chartConfig: ChartConfig = {
        count: { label: "Responses", color: "var(--chart-1)" },
      };

      return (
        <ChartContainer
          config={chartConfig}
          className="mx-auto w-full h-[250px]"
        >
          <BarChart
            data={chartData}
            layout="horizontal"
            margin={{ top: 10, right: 30, bottom: 20, left: 30 }}
          >
            <CartesianGrid vertical={false} stroke="var(--border)" />
            <XAxis
              dataKey="rating"
              tickLine={false}
              axisLine={false}
              tickMargin={10}
            />
            <YAxis tickLine={false} axisLine={false} tickMargin={8} />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar
              dataKey="count"
              fill="var(--color-count)"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ChartContainer>
      );
    }

    // Bar chart for multiple choice multiple
    if (questionType === "multiple_choice_multiple") {
      if (!qa.analytics.optionCounts) return null;

      const chartData = Object.entries(qa.analytics.optionCounts).map(
        ([option, count]) => ({
          option,
          count,
          percentage: qa.analytics.optionPercentages?.[option] || 0,
        }),
      );

      const chartConfig: ChartConfig = {
        count: { label: "Responses", color: "var(--chart-1)" },
      };

      return (
        <ChartContainer
          config={chartConfig}
          className="mx-auto w-full h-[250px]"
        >
          <BarChart
            data={chartData}
            margin={{ top: 10, right: 30, bottom: 40, left: 30 }}
          >
            <CartesianGrid vertical={false} stroke="var(--border)" />
            <XAxis
              dataKey="option"
              tickLine={false}
              axisLine={false}
              tickMargin={10}
              angle={-45}
              textAnchor="end"
              height={80}
              fontSize={11}
            />
            <YAxis tickLine={false} axisLine={false} tickMargin={8} />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  hideLabel
                  formatter={(value, _name, item) => {
                    const data = item.payload as {
                      option: string;
                      count: number;
                      percentage: number;
                    };
                    return `${data.count} (${data.percentage.toFixed(1)}%)`;
                  }}
                />
              }
            />
            <Bar
              dataKey="count"
              fill="var(--color-count)"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ChartContainer>
      );
    }

    return null;
  };

  if (!hasResponses) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <BarChart3 className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <p className="text-muted-foreground">No charts available yet.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      {/* Demographics Charts */}
      <Card>
        <CardHeader>
          <CardTitle>Demographics Overview</CardTitle>
          <CardDescription>
            Distribution by age, gender, and location
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-6">
            {/* Age Distribution */}
            {Object.keys(survey.demographics.age).length > 0 && (
              <Card>
                <CardHeader className="items-center pb-0">
                  <CardTitle className="text-base">Age Distribution</CardTitle>
                </CardHeader>
                <CardContent className="flex-1 pb-0">
                  <ChartContainer
                    config={{ count: { label: "Count" } }}
                    className="mx-auto aspect-square max-h-[200px]"
                  >
                    <PieChart>
                      <ChartTooltip
                        cursor={false}
                        content={<ChartTooltipContent hideLabel />}
                      />
                      <Pie
                        data={Object.entries(survey.demographics.age).map(
                          ([age, count]) => ({
                            name: age,
                            value: count as number,
                          }),
                        )}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                      >
                        {Object.entries(survey.demographics.age).map(
                          (_, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={getChartColor(index)}
                            />
                          ),
                        )}
                      </Pie>
                    </PieChart>
                  </ChartContainer>
                </CardContent>
                <CardFooter className="flex-col gap-2 text-sm">
                  <div className="flex flex-wrap gap-2 justify-center">
                    {Object.entries(survey.demographics.age).map(
                      ([age, _], index) => (
                        <div key={age} className="flex items-center gap-1.5">
                          <div
                            className="h-2 w-2 rounded-full"
                            style={{ backgroundColor: getChartColor(index) }}
                          />
                          <span className="text-xs">{age}</span>
                        </div>
                      ),
                    )}
                  </div>
                </CardFooter>
              </Card>
            )}

            {/* Gender Distribution */}
            {Object.keys(survey.demographics.gender).length > 0 && (
              <Card>
                <CardHeader className="items-center pb-0">
                  <CardTitle className="text-base">
                    Gender Distribution
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex-1 pb-0">
                  <ChartContainer
                    config={{ count: { label: "Count" } }}
                    className="mx-auto aspect-square max-h-[200px]"
                  >
                    <PieChart>
                      <ChartTooltip
                        cursor={false}
                        content={<ChartTooltipContent hideLabel />}
                      />
                      <Pie
                        data={Object.entries(survey.demographics.gender).map(
                          ([gender, count]) => ({
                            name: gender,
                            value: count as number,
                          }),
                        )}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                      >
                        {Object.entries(survey.demographics.gender).map(
                          (_, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={getChartColor(index)}
                            />
                          ),
                        )}
                      </Pie>
                    </PieChart>
                  </ChartContainer>
                </CardContent>
                <CardFooter className="flex-col gap-2 text-sm">
                  <div className="flex flex-wrap gap-2 justify-center">
                    {Object.entries(survey.demographics.gender).map(
                      ([gender, _], index) => (
                        <div key={gender} className="flex items-center gap-1.5">
                          <div
                            className="h-2 w-2 rounded-full"
                            style={{ backgroundColor: getChartColor(index) }}
                          />
                          <span className="text-xs capitalize">{gender}</span>
                        </div>
                      ),
                    )}
                  </div>
                </CardFooter>
              </Card>
            )}

            {/* Location Distribution */}
            {Object.keys(survey.demographics.location).length > 0 && (
              <Card>
                <CardHeader className="items-center pb-0">
                  <CardTitle className="text-base">
                    Location Distribution
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex-1 pb-0">
                  <ChartContainer
                    config={{ count: { label: "Count" } }}
                    className="mx-auto aspect-square max-h-[200px]"
                  >
                    <PieChart>
                      <ChartTooltip
                        cursor={false}
                        content={<ChartTooltipContent hideLabel />}
                      />
                      <Pie
                        data={Object.entries(survey.demographics.location).map(
                          ([location, count]) => ({
                            name: showCountryNameByAlpha3(location) || location,
                            value: count as number,
                          }),
                        )}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                      >
                        {Object.entries(survey.demographics.location).map(
                          (_, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={getChartColor(index)}
                            />
                          ),
                        )}
                      </Pie>
                    </PieChart>
                  </ChartContainer>
                </CardContent>
                <CardFooter className="flex-col gap-2 text-sm">
                  <div className="flex flex-wrap gap-2 justify-center">
                    {Object.entries(survey.demographics.location).map(
                      ([location, _], index) => (
                        <div
                          key={location}
                          className="flex items-center gap-1.5"
                        >
                          <div
                            className="h-2 w-2 rounded-full"
                            style={{ backgroundColor: getChartColor(index) }}
                          />
                          <span className="text-xs">
                            {showCountryNameByAlpha3(location) || location}
                          </span>
                        </div>
                      ),
                    )}
                  </div>
                </CardFooter>
              </Card>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Question Charts Gallery */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Charts & Graphs Gallery</span>
            <Button size="sm" variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Download All
            </Button>
          </CardTitle>
          <CardDescription>
            All survey visualizations in one place
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {questionAnalytics.map((qa, index) => {
              const chart = renderQuestionChart(qa);
              if (!chart) return null;

              return (
                <Card
                  key={qa.question.id}
                  className="hover:shadow-lg transition-shadow"
                >
                  <CardHeader className="pb-4">
                    <CardTitle className="text-base">
                      Q{index + 1}: {qa.question.question_text.substring(0, 50)}
                      {qa.question.question_text.length > 50 && "..."}
                    </CardTitle>
                    <div className="flex justify-between items-center mt-2">
                      <Badge variant="outline" className="text-xs">
                        {qa.question.question_type.replace(/_/g, " ")}
                      </Badge>
                      <Button size="sm" variant="outline">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="min-h-[250px]">{chart}</div>
                    <p className="text-sm text-muted-foreground mt-4">
                      {qa.totalResponses} responses
                      {qa.analytics.averageRating && (
                        <span className="ml-2">
                          • Avg: {qa.analytics.averageRating.toFixed(2)}
                        </span>
                      )}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </>
  );
}
