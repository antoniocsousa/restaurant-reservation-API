// const entrada = "25/12/2025 13:35";

// // separa data e hora
// const [dataStr, horaStr] = entrada.split(" ");

// // separa dia, mês, ano
// const [dia, mes, ano] = dataStr.split("/").map(Number);

// // separa hora e minuto
// const [hora, minuto] = horaStr.split(":").map(Number);

// // cria o objeto Date no fuso local
// const data = new Date(ano, mes - 1, dia, hora, minuto);

// console.log(data.toISOString());



// import Table from "./src/models/table.js";
// import Reservation from "./src/models/reservation.js";
// import db from "./src/db/dbConfig.js";

// const date = '2026-01-25';

// const tables = await Table.getTables();
// const reservations = await Reservation.getReservationsByDate(date);

// const reservedTableIds = reservations.map(reservation => reservation.table_id);

// const available = tables.filter(table => !reservedTableIds.includes(table.id));

// console.log(available);