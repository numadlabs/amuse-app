import { z } from 'zod'

const LoginSchema = z.object({
  prefix: z.string(),
  telNumber: z.string(),
  password: z.string(),
});

export default LoginSchema;