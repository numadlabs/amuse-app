import { z } from "zod";

const LoginSchema = z.object({
  email: z.string(),
  password: z.string(),
});

export default LoginSchema;
