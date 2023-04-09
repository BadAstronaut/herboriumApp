export type HerbType = {
  herb_name: string;
  planted_date: string;
  planned_harvest_date: string;
};
export function Herb(herb_name:string, planted_date:string, planned_harvest_date:string) {
  let herb ={
    herb_name: herb_name,
    planted_date: planted_date,
    planned_harvest_date: planned_harvest_date
  }

  return herb;

  
}