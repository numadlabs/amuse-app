import { z } from "zod";

// Email validation schema
const emailSchema = z.string().email("Please provide valid email address");
const nicknameSchema = z.string().emoji();
// Password validation schema (you can keep this for later use)
const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters long")
  .max(32, "Password must not exceed 32 characters")
  .regex(/[a-z]/, "Password must contain at least one lowercase letter")
  .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
  .regex(/[0-9]/, "Password must contain at least one digit")
  .regex(/[@$!%*?&#]/, "Password must contain at least one special character");

// Register schema combining email and password
const registerSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

export { emailSchema, passwordSchema, registerSchema, nicknameSchema };
