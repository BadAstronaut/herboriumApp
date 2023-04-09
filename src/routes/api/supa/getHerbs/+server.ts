
import { supabase } from "$lib/supabaseClient";
//import {Herb, HerbType} from "$lib/herbObjects";
//import get
import { get } from 'svelte/store';



export async function GET({url}): Promise<Response> {
    const herb= url.searchParams.get('herb');
    const { data } = await supabase.from("HerboriumProject").select();
    //later need to add row level security to supaBase
    const res = {
      herbs: data ?? [],
    };
    //_herbs =[]: HerbType[];
    
    
    return new Response(JSON.stringify(res));
}