"use client";

import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { surveyFormSchema, type SurveyFormData } from "@/lib/survey-schemas";
import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import { Textarea } from "@workspace/ui/components/textarea";
import { Switch } from "@workspace/ui/components/switch";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@workspace/ui/components/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select";
import { Badge } from "@workspace/ui/components/badge";
import {
  Plus,
  Trash2,
  GripVertical,
  Star,
  Image as ImageIcon,
  Type,
  CheckCircle2,
} from "lucide-react";
import { cn } from "@workspace/ui/lib/utils";

interface SurveyFormProps {
  defaultValues?: Partial<SurveyFormData>;
  onSubmit: (data: SurveyFormData) => void;
  submitLabel?: string;
  cancelHref?: string;
  isSubmitting?: boolean;
  isError?: boolean;
  errorText?: string;
}

const QUESTION_TYPES = [
  {
    value: "multiple_choice_single",
    label: "Multiple Choice (Single)",
    icon: Type,
  },
  {
    value: "multiple_choice_multiple",
    label: "Multiple Choice (Multiple)",
    icon: Type,
  },
  { value: "yes_no", label: "Yes/No", icon: CheckCircle2 },
  { value: "rating_stars", label: "Star Rating", icon: Star },
  { value: "rating_scale", label: "Rating Scale", icon: Star },
  { value: "likert", label: "Likert Scale", icon: Star },
  { value: "short_text", label: "Short Text", icon: Type },
  { value: "long_text", label: "Long Text", icon: Type },
  { value: "image_selection", label: "Image Selection", icon: ImageIcon },
] as const;

const AGE_RANGES = ["All", "13-17", "18-24", "25-34", "35-44", "45-54", "55+"];
const GENDER_OPTIONS = ["All", "Male", "Female"];

export function SurveyForm({
  defaultValues,
  onSubmit,
  submitLabel = "Create Survey",
  cancelHref,
  isSubmitting = false,
  isError = false,
  errorText,
}: SurveyFormProps) {
  const form = useForm<SurveyFormData>({
    resolver: zodResolver(surveyFormSchema),
    defaultValues: defaultValues || {
      title: "",
      description: "",
      targetResponses: 100,
      isAnonymous: true,
      questions: [],
    },
  });

  const { fields, append, remove, move } = useFieldArray({
    control: form.control,
    name: "questions",
  });

  const addQuestion = (type: string = "multiple_choice_single") => {
    const newQuestion: any = {
      questionText: "",
      questionType: type,
      questionOrder: fields.length + 1,
      isRequired: true,
    };

    if (type === "yes_no") {
      newQuestion.options = ["Yes", "No"];
    } else if (
      type === "multiple_choice_single" ||
      type === "multiple_choice_multiple"
    ) {
      newQuestion.options = ["Option 1", "Option 2"];
    }

    if (type === "rating_stars") {
      newQuestion.ratingScaleType = "stars_1_5";
    } else if (type === "rating_scale") {
      newQuestion.ratingScaleType = "scale_1_10";
    } else if (type === "likert") {
      newQuestion.ratingScaleType = "likert";
    }

    append(newQuestion);
  };

  const addOption = (questionIndex: number) => {
    const currentOptions =
      form.getValues(`questions.${questionIndex}.options`) || [];
    form.setValue(`questions.${questionIndex}.options`, [
      ...currentOptions,
      `Option ${currentOptions.length + 1}`,
    ]);
  };

  const removeOption = (questionIndex: number, optionIndex: number) => {
    const currentOptions =
      form.getValues(`questions.${questionIndex}.options`) || [];
    if (currentOptions.length > 2) {
      form.setValue(
        `questions.${questionIndex}.options`,
        currentOptions.filter((_, i) => i !== optionIndex),
      );
    }
  };

  const targetResponses = form.watch("targetResponses");
  const questionsCount = fields.length;
  const estimatedCost = questionsCount * targetResponses * 0.5;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
            <CardDescription>
              Essential details about your survey
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Survey Title *</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter survey title..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe the purpose of this survey..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="targetResponses"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Target Responses *</FormLabel>
                    <Select
                      value={field.value?.toString()}
                      onValueChange={(v) => field.onChange(Number(v))}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select target" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="100">100 responses</SelectItem>
                        <SelectItem value="500">500 responses</SelectItem>
                        <SelectItem value="1000">1,000 responses</SelectItem>
                        <SelectItem value="5000">5,000 responses</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="isAnonymous"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                    <div className="space-y-0.5">
                      <FormLabel>Anonymous Responses</FormLabel>
                      <FormDescription className="text-xs">
                        Hide respondent identities
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Target Audience</CardTitle>
            <CardDescription>
              Define who should take this survey
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="ageRange"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Age Range</FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select age range" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {AGE_RANGES.map((range) => (
                          <SelectItem key={range} value={range}>
                            {range}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="genderFilter"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Gender</FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select gender" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {GENDER_OPTIONS.map((gender) => (
                          <SelectItem key={gender} value={gender}>
                            {gender}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Questions</CardTitle>
                <CardDescription>
                  Add questions to your survey ({fields.length})
                </CardDescription>
              </div>
              <Select value="" onValueChange={addQuestion}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Add Question" />
                </SelectTrigger>
                <SelectContent>
                  {QUESTION_TYPES.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {fields.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                No questions added yet. Use the dropdown above to add your first
                question.
              </div>
            )}

            {fields.map((field, index) => {
              const questionType = form.watch(
                `questions.${index}.questionType`,
              );
              const requiresOptions =
                questionType === "multiple_choice_single" ||
                questionType === "multiple_choice_multiple" ||
                questionType === "yes_no";
              const requiresRating =
                questionType === "rating_stars" ||
                questionType === "rating_scale" ||
                questionType === "likert";

              return (
                <Card key={field.id}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-2">
                      <GripVertical className="h-4 w-4 text-muted-foreground" />
                      <Badge variant="outline">Q{index + 1}</Badge>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => remove(index)}
                        className="ml-auto"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <FormField
                      control={form.control}
                      name={`questions.${index}.questionText`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Question Text *</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter your question..."
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name={`questions.${index}.questionType`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Question Type</FormLabel>
                            <Select
                              value={field.value}
                              onValueChange={field.onChange}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {QUESTION_TYPES.map((type) => (
                                  <SelectItem
                                    key={type.value}
                                    value={type.value}
                                  >
                                    {type.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name={`questions.${index}.isRequired`}
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                            <FormLabel>Required</FormLabel>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>

                    {requiresOptions && (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <FormLabel>Options</FormLabel>
                          {questionType !== "yes_no" && (
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => addOption(index)}
                            >
                              <Plus className="h-4 w-4 mr-1" />
                              Add Option
                            </Button>
                          )}
                        </div>
                        {questionType === "yes_no" ? (
                          <div className="text-sm text-muted-foreground p-3 bg-muted/50 rounded">
                            Yes/No questions have fixed options
                          </div>
                        ) : (
                          <div className="space-y-2">
                            {(
                              form.watch(`questions.${index}.options`) || []
                            ).map((_, optionIndex) => (
                              <div key={optionIndex} className="flex gap-2">
                                <Input
                                  value={
                                    form.watch(
                                      `questions.${index}.options.${optionIndex}`,
                                    ) || ""
                                  }
                                  onChange={(e) =>
                                    form.setValue(
                                      `questions.${index}.options.${optionIndex}`,
                                      e.target.value,
                                    )
                                  }
                                  placeholder={`Option ${optionIndex + 1}`}
                                />
                                {(
                                  form.watch(`questions.${index}.options`) || []
                                ).length > 2 && (
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={() =>
                                      removeOption(index, optionIndex)
                                    }
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}

                    {requiresRating && (
                      <FormField
                        control={form.control}
                        name={`questions.${index}.ratingScaleType`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Rating Scale</FormLabel>
                            <Select
                              value={field.value}
                              onValueChange={field.onChange}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="stars_1_5">
                                  1-5 Stars
                                </SelectItem>
                                <SelectItem value="scale_1_10">
                                  1-10 Scale
                                </SelectItem>
                                <SelectItem value="likert">
                                  Likert Scale
                                </SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Cost Estimate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Questions:</span>
                <span className="font-medium">{questionsCount}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Target Responses:</span>
                <span className="font-medium">{targetResponses}</span>
              </div>
              <div className="flex justify-between text-lg font-bold pt-2 border-t">
                <span>Estimated Cost:</span>
                <span className="text-green-600">
                  GH₵{estimatedCost.toFixed(2)}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {isError && (
          <div className="rounded-lg bg-destructive/10 p-4 text-sm text-destructive">
            {errorText || "An error occurred. Please try again."}
          </div>
        )}

        <div className="flex gap-4">
          {cancelHref && (
            <Button type="button" variant="outline" asChild className="flex-1">
              <a href={cancelHref}>Cancel</a>
            </Button>
          )}
          <Button type="submit" disabled={isSubmitting} className="flex-1">
            {isSubmitting ? "Submitting..." : submitLabel}
          </Button>
        </div>
      </form>
    </Form>
  );
}
