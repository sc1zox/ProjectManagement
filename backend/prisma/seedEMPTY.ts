import { PrismaClient } from '@prisma/client';
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {


    const hashedpw1 = await bcrypt.hash('test', 10);

    const admin = await prisma.user.create({
        data: {
            vorname: 'admin',
            nachname: 'test',
            role: 'Admin',
            arbeitszeit: 0,
            login: { create: { username: 'admin', password: hashedpw1 } },
            urlaubstage: 0,
        },
    });


    const bereichsleiter = await prisma.user.create({
        data: {
            vorname: 'Bob',
            nachname: 'Builder',
            role: 'Bereichsleiter',
            arbeitszeit: 0,
            login: { create: { username: 'bl', password: hashedpw1 } },
            urlaubstage: 0,
        },
    });

    console.log({
        admin,
        bereichsleiter,
    });
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });