import { createClient } from '@supabase/supabase-js';
//import {Herb, HerbType} from "$lib/herbObjects";
//import get
import { get } from 'svelte/store';
import type { RequestEvent } from "./$types";
import pgPromise from 'pg-promise';

// Create an instance of pg-promise
const pgp = pgPromise();
const supaKey = import.meta.env.VITE_SUPA_DB_KEY as string;
const supaUrl = import.meta.env.VITE_SUPA_PROJECT_URL as string;

const supabase = createClient(supaUrl, supaKey);

export async function POST({ request }: RequestEvent) {
    const body = await request.json();
    const table = "HerboriumProject";
    const column = "feeded";
    const newFeed = body
    const feedInterface = {
        "feedArray": [
            {
                "water": 400,
                "fertilizer": 5,
                "herbInstance": "Basil0",
                "herbName": "Basil",
                "timestamp": "2023-04-09T16:12:30+00:00"

            }
        ]
    }

    const feeded = await getFeeded(newFeed.herbName);

    const updatedHerb = { ...feeded }.feeded;
    //console.log(updatedHerb, "feeded......");
    updatedHerb.feedArray.push(newFeed);
    //console.log(updatedHerb, "feeded post");

    const { data, error } = await supabase
        .from(table)
        .update({ "feeded": updatedHerb }) //newFeed  updatedHerb
        .eq("herb_name", newFeed.herbName);

    if (error) {
        console.error(error, "error here");
        return {
            status: 500,
            body: { message: 'Failed to update the row in the table' }
        };
    }
    const res = {
        body: body,
    };
    console.log(res, "data.......");
    return new Response(JSON.stringify(res), { status: 200 });

}


async function getFeeded(herb_name: string) {
    // Run the SQL query
    const { data, error } = await supabase
        .from("HerboriumProject")
        .select("feeded")
        .eq("herb_name", herb_name);

    if (error) {
        console.error(error);
        return {
            status: 500,
            body: { message: 'Failed to update the row in the table' }
        };
    }
    return data[0];
}