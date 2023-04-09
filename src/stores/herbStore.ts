import { writable } from 'svelte/store';
//import readable from svelte 
import { readable } from 'svelte/store';

export const herbStore = writable({});

export const herbModels = readable({
    'Basil': '/threemodels/Basil.glb',
    'Mint': '/threemodels/Mint.glb',
})