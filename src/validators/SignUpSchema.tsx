import { z } from "zod";

// Define the password validation schema
const passwordSchema = z.string()
  .emoji()
  .min(8, "Password must be at least 8 characters long")
  .max(32, "Password must not exceed 32 characters")
  .regex(/[a-z]/, "Password must contain at least one lowercase letter")
  .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
  .regex(/[0-9]/, "Password must contain at least one digit")
  .regex(/[@$!%*?&#]/, "Password must contain at least one special character");


// Define a schema for the whole form, including the password
const registerSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: passwordSchema,
});

export default registerSchema;