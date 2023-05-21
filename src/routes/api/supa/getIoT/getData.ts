import pgPromise from 'pg-promise';

// Create an instance of pg-promise
const pgp = pgPromise();

// Configure the database connection
const db = pgp('postgres://postgres:HerbsApp2021@db.vwbflnlqzqzswrqrrgjs.supabase.co:5432/postgres');

export async function getData() {
  try {
    // Run the SQL query
    const data = await db.any(`
      SELECT *
      FROM (
        SELECT *, ROW_NUMBER() OVER (ORDER BY created_at) AS row_num
        FROM herbsiot
      ) AS subquery
      WHERE (row_num - 1) % 80 = 0;
    `);
    console.log(data, "data111");

    return data;
  } catch (error) {
    throw new Error(`Failed to retrieve data: ${error}`);
  }
}