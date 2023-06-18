import { error } from '@sveltejs/kit';
//igore typescirp 
// @ts-ignore
import {herbStore, herbIoTData, currentWaterLevel} from "/src/stores/herbStore.ts";
import { get } from 'svelte/store';

export async function load({fetch, params }) {
    const response = await fetch('api/supa/getHerbs');
    const data = await response.json();
    herbStore.set(data ?? []);
    const sensorResponse = await fetch('api/supa/getIoT');
    const iotData = await sensorResponse.json();
    herbIoTData.set(iotData ?? []);
    //create the function that will set the current water level

    setWaterLevels(get(herbIoTData));
    
    if (response.ok && sensorResponse.ok) {
        return {
            props: {
                herbs: data,
                iotData: iotData
            }
        };
    }
    

}

function setWaterLevels(hertIotData: any[]){
    //get last ofject of the array
    const lastObj = hertIotData[hertIotData.length - 1];
    //get soilmoisture value
    const soilMoisture = lastObj.soil_moisture;
    //conver to float 
    const soilMoistureFloat = parseFloat(soilMoisture);
    //the rules are as follows:
    //if the moisturefloat is less than 30 then water level is minimum whish will have value 10
    //if the moisturefloat is greater the 50 then water level is maximum which will have value 100
    //if the moisturefloat is between 30 and 50 then water level is medium which will have value between 10 and 100
    //the formula is as follows:
    let waterLevel = 10
    if(soilMoistureFloat < 30){
        waterLevel = 10;
    }else if(soilMoistureFloat > 50){
        waterLevel = 100;
    }else{
        waterLevel = 10 + (soilMoistureFloat - 30) * (100 - 10) / (50 - 30);
    }
    //set the water level
    currentWaterLevel.set({"herbObject": lastObj, "waterLevel": waterLevel});
    console.log("water level set to", waterLevel, get(currentWaterLevel));
}


