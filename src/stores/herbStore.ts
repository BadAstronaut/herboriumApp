import { writable } from 'svelte/store';
//import readable from svelte 
import { readable } from 'svelte/store';

export const herbStore = writable({});

export const herbModels = readable({
    'Basil': '/threemodels/basil/basil_2.glb',
    'Strawberry': '/threemodels/strawberry/strawberry_3.glb',
    'Kale': '/threemodels/kale/kale_2.glb',

})

export let selectedHerbKey = writable('Basil');