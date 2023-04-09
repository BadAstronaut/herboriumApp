import { error } from '@sveltejs/kit';
import {herbStore} from "/src/stores/herbStore.ts";

export async function load({fetch, params }) {
    const response = await fetch('api/supa/getHerbs');
    const data = await response.json();
    herbStore.set(data ?? []);
    return response.ok ? data : error(response.status, data);
    

}
