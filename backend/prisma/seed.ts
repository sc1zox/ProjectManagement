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




    await prisma.user.upsert({
        where: { username: 'alice' },
        update: {},
        create: {
            username: 'alice',
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
        where: { username: 'admin' },
        update: {},
        create: {
            username: 'admin',
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
        where: { username: 'bob' },
        update: {},
        create: {
            username: 'bob',
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
        where: { username: 'carol' },
        update: {},
        create: {
            username: 'carol',
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
