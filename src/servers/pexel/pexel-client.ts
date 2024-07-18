import { env } from "@/env";
import { createClient } from "pexels";

const pexelAPIKey = env.PEXEL_API_KEY;

export const pexel = createClient(pexelAPIKey);
