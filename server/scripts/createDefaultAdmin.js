import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function createDefaultAdmin() {
  try {
    const username = 'christian';
    const password = 'j20023700';

    // Vérifier si l'admin existe déjà
    const existingAdmin = await prisma.admin.findUnique({
      where: { username },
    });

    if (existingAdmin) {
      console.log('✅ L\'administrateur "christian" existe déjà');
      await prisma.$disconnect();
      return;
    }

    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);

    // Créer l'admin
    const admin = await prisma.admin.create({
      data: {
        username,
        password: hashedPassword,
        email: null,
      },
    });

    console.log('✅ Administrateur par défaut créé avec succès!');
    console.log(`Username: ${admin.username}`);
    console.log(`ID: ${admin.id}`);

    await prisma.$disconnect();
  } catch (error) {
    console.error('Erreur lors de la création de l\'administrateur:', error);
    await prisma.$disconnect();
    process.exit(1);
  }
}

createDefaultAdmin();
