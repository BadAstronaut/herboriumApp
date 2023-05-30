
// +page.server.js

/** @type {import('./$types').Actions} */
export const actions = {
    default: async (event) => {
        //event.preventDefault();need to find a way to prevent default from executing on any input change 
        
        // TODO log the user in
        console.log("default action........");
    }
};