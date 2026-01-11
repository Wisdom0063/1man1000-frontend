import { z } from "zod";

export const questionSchema = z.object({
  questionText: z.string().min(5, "Question must be at least 5 characters"),
  questionType: z.enum([
    "multiple_choice_single",
    "multiple_choice_multiple",
    "yes_no",
    "rating_stars",
    "rating_scale",
    "likert",
    "short_text",
    "long_text",
    "image_selection",
  ]),
  questionOrder: z.number().min(1),
  isRequired: z.boolean(),
  options: z.array(z.string()).optional(),
  imageUrls: z.array(z.string()).optional(),
  ratingScaleType: z.enum(["stars_1_5", "scale_1_10", "likert"]).optional(),
});

export const surveyFormSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters").max(100),
  description: z.string().optional(),
  targetResponses: z.number().min(10, "Minimum 10 responses").max(10000),
  isAnonymous: z.boolean(),
  ageRange: z.string().optional(),
  genderFilter: z.string().optional(),
  locationFilter: z.array(z.string()).optional(),
  paymentPerResponse: z.number().optional(),
  questions: z.array(questionSchema).min(1, "At least one question required"),
});

export type SurveyFormData = z.infer<typeof surveyFormSchema>;
export type QuestionFormData = z.infer<typeof questionSchema>;
