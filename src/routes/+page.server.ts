
// +page.server.js
import { redirect } from '@sveltejs/kit'
import type { Actions, PageServerLoad } from './$types'

/** @type {import('./$types').Actions} */
export const actions: Actions = {
    feed: async ({ request }) => {
      const formData = await request.formData()
      const data = Object.fromEntries(formData)
  
      // do whatever you want still not loading data 
      //still re loading scenes on send 
      console.log(data, "data from server", formData)
  
      //throw redirect(303, '/')
    },
  }