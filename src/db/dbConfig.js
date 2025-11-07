import pg from "pg";

const db = new pg.Client({
    connectionString: "postgresql://postgres:1969Reserva12@db.bopxidzuvdolvnffcnzn.supabase.co:5432/postgres",
    ssl: {
        rejectUnauthorized: false,
    },
});

await db.connect();

const result = await db.query('INSERT INTO tables (seats, active) VALUES ($1, $2);', [4, true]);

console.log(result.rows);

await db.end();