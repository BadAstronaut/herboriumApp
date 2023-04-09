import { createClient } from '@supabase/supabase-js'

const supaKey = import.meta.env.VITE_SUPA_DB_KEY as string;
const supaProjectUrl = import.meta.env.VITE_SUPA_PROJECT_URL as string;

//console.log(supaKey, "supaKey..................", supaProjectUrl, "supaProjectUrl");

export const supabase = createClient(supaProjectUrl,supaKey)