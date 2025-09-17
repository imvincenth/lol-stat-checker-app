import { z } from "zod";

export const riotIdSchema = z.object({
  riotId: z.string()
    .min(7, "Riot ID must be at least 7 characters long.")
    .refine((val) => val.includes('#'), { message: "Riot ID must include a '#' separating name and tag." })
    .refine((val) => {
      const parts = val.split('#');
      return parts.length === 2 && parts[0].length > 0 && parts[0].length < 16 && parts[1].length > 0 && parts[1].length < 16;
    }, { message: "Riot ID must be in the format 'Name#Tag'." }),
  platform: z.string(),
});
