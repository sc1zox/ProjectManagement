import bcrypt from 'bcryptjs';
import prisma from '../src/lib/prisma'; // Adjust path according to your project structure

async function main() {
    const roleDeveloper = 'Developer';
    const rolePO = 'PO';
    const roleSM = 'SM';
    const roleAdmin = 'Admin';

    const skillJavaScript = await prisma.skill.upsert({
        where: { name: 'JavaScript' },
        update: {},
        create: { name: 'JavaScript' },
    });

    const skillTypeScript = await prisma.skill.upsert({
        where: { name: 'TypeScript' },
        update: {},
        create: { name: 'TypeScript' },
    });

    // Create users with vorname and nachname instead of username
    await prisma.user.upsert({
        where: { vorname_nachname: { vorname: 'Alice', nachname: 'Smith' } }, // Adjust this according to your schema
        update: {},
        create: {
            vorname: 'Alice',
            nachname: 'Smith',
            role: rolePO,
            password: bcrypt.hashSync('password', 8),
            skills: {
                connect: [{ id: skillJavaScript.id }, { id: skillTypeScript.id }],
            },
            teams: {
                connect: [],
            },
            projects: {
                connect: [],
            },
            token: null, // or generate a token if required
        },
    });

    await prisma.user.upsert({
        where: { vorname_nachname: { vorname: 'Admin', nachname: 'User' } }, // Adjust this according to your schema
        update: {},
        create: {
            vorname: 'Admin',
            nachname: 'User',
            role: roleAdmin,
            password: bcrypt.hashSync('password', 8),
            skills: {
                connect: [{ id: skillJavaScript.id }, { id: skillTypeScript.id }],
            },
            teams: {
                connect: [],
            },
            projects: {
                connect: [],
            },
            token: null,
        },
    });

    await prisma.user.upsert({
        where: { vorname_nachname: { vorname: 'Bob', nachname: 'Jones' } }, // Adjust this according to your schema
        update: {},
        create: {
            vorname: 'Bob',
            nachname: 'Jones',
            role: roleDeveloper,
            password: bcrypt.hashSync('password', 8),
            skills: {
                connect: [{ id: skillJavaScript.id }],
            },
            teams: {
                connect: [],
            },
            projects: {
                connect: [],
            },
            token: null, // or generate a token if required
        },
    });

    await prisma.user.upsert({
        where: { vorname_nachname: { vorname: 'Carol', nachname: 'Johnson' } }, // Adjust this according to your schema
        update: {},
        create: {
            vorname: 'Carol',
            nachname: 'Johnson',
            role: roleSM,
            password: bcrypt.hashSync('password', 8),
            skills: {
                connect: [{ id: skillTypeScript.id }],
            },
            teams: {
                connect: [],
            },
            projects: {
                connect: [],
            },
            token: null, // or generate a token if required
        },
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
