import { z } from "zod";
const salarySchema = z.object({
  locationState: z.string().min(2, { message: "State must be a 2-letter abbreviation." }).max(2),
  locationCity: z.string().min(1, { message: "City is required." }),
  specialty: z.string().min(1, { message: "Specialty is required." }),
  yearsExperience: z.number().int().min(0).max(60),
  payRateHourly: z.number().min(10).max(500),
  overtimeRateHourly: z.number().min(0).max(1e3).optional(),
  stipendWeekly: z.number().min(0).max(1e4).optional(),
  bonusesAnnual: z.number().min(0).max(5e5).optional()
});
export {
  salarySchema as s
};
