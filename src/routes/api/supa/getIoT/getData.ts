import pgPromise from 'pg-promise';

// Create an instance of pg-promise
const pgp = pgPromise();
const supaDBPass = import.meta.env.VITE_SUPA_DB_PASS as string;
const supaDBUrl = import.meta.env.VITE_SUPA_DB_URL as string;

// Configure the database connection
const db = pgp(`postgres://postgres:${supaDBPass}@${supaDBUrl}:5432/postgres`);

export async function getData() {
  try {
    // Run the SQL query
    const data = await db.any(`
      SELECT *
      FROM (
        SELECT *, ROW_NUMBER() OVER (ORDER BY created_at) AS row_num
        FROM herbsiot
      ) AS subquery
    `);
    console.log(data, "data111");

    return data;
  } catch (error) {
    throw new Error(`Failed to retrieve data: ${error}`);
  }
}