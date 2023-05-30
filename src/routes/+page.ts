import { error } from '@sveltejs/kit';
import {herbStore, herbIoTData} from "/src/stores/herbStore.ts";

export async function load({fetch, params }) {
    const response = await fetch('api/supa/getHerbs');
    const data = await response.json();
    herbStore.set(data ?? []);
    const sensorResponse = await fetch('api/supa/getIoT');
    const iotData = await sensorResponse.json();
    herbIoTData.set(iotData ?? []);
    if (response.ok && sensorResponse.ok) {
        return {
            props: {
                herbs: data,
                iotData: iotData
            }
        };
    }

    

}


