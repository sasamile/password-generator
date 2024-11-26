import { z } from "zod";


export const formSchema = z.object({
  name: z.string().optional(), 
  numberCard: z.string().optional(), 
  password: z.string().min(1, { message: "Password is required" }), 
  urlWebsite: z.string().optional(),
  notes: z.string().optional(), 
  isFavorite: z.boolean().default(false),
});