import { PrismaClient } from '@prisma/client';
import pg from 'pg';

const { Client } = pg;

// Connexion à PostgreSQL pour créer la base de données
const client = new Client({
  host: 'localhost',
  port: 5432,
  user: 'postgres',
  password: 'j20023700',
  database: 'postgres', // On se connecte à la base par défaut
});

async function createDatabase() {
  try {
    await client.connect();
    console.log('✅ Connecté à PostgreSQL');

    // Vérifier si la base de données existe
    const result = await client.query(
      "SELECT 1 FROM pg_database WHERE datname = '2nb_digital'"
    );

    if (result.rows.length === 0) {
      // Créer la base de données
      await client.query('CREATE DATABASE "2nb_digital"');
      console.log('✅ Base de données "2nb_digital" créée avec succès!');
    } else {
      console.log('ℹ️  La base de données "2nb_digital" existe déjà');
    }

    await client.end();
  } catch (error) {
    console.error('❌ Erreur:', error.message);
    process.exit(1);
  }
}

createDatabase();

