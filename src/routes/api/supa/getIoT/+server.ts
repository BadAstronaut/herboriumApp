//import env variables 
import { get } from 'svelte/store';
import {getData} from "./getData.ts";

//interface for the iot object
interface IoTType {
    
        id: string,
        created_at: Date,
        battery: string,
        linkquality: string,
        soil_moisture: string,
        temperature: Float32Array,
        sensorid: string
      }

export async function GET({url}): Promise<Response> {
    const herb= url.searchParams.get('herb');
    const  data  = await getData();
    //later need to add row level security to supaBase
    //_herbs =[]: HerbType[];
    return new Response(JSON.stringify(data));
}