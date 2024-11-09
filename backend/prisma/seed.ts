import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    // Create users
    const user1 = await prisma.user.create({
        data: {
            vorname: 'John',
            nachname: 'Doe',
            role: 'Developer',
            arbeitszeit: 40,
            login: {
                create: {
                    username: 'john.doe',
                    password: 'password123',
                },
            },
        },
    });

    const user2 = await prisma.user.create({
        data: {
            vorname: 'Jane',
            nachname: 'Smith',
            role: 'PO',
            arbeitszeit: 35,
            login: {
                create: {
                    username: 'jane.smith',
                    password: 'password123',
                },
            },
        },
    });

    const user3 = await prisma.user.create({
        data: {
            vorname: 'Master',
            nachname: 'Scrum',
            role: 'SM',
            arbeitszeit: 35,
            login: {
                create: {
                    username: 'sm',
                    password: 'test',
                },
            },
        },
    });
    const user4 = await prisma.user.create({
        data: {
            vorname: 'admin',
            nachname: 'test',
            role: 'Admin',
            arbeitszeit: 35,
            login: {
                create: {
                    username: 'admin',
                    password: 'test',
                },
            },
        },
    });

    // Create roadmap
    const roadmap = await prisma.roadmap.create({
        data: {},
    });

    // Create team and link roadmap and users
    const team = await prisma.team.create({
        data: {
            name: 'Development Team',
            roadmap: {
                connect: { id: roadmap.id },
            },
            members: {
                connect: [{ id: user1.id }, { id: user2.id }],
            },
        },
    });

    // Create project and link to team and roadmap
    const project = await prisma.project.create({
        data: {
            name: 'New Project',
            description: 'A new project description',
            estimationDays: 30,
            startDate: new Date(2020, 11, 20), // December 20, 2020
            endDate: new Date(2024, 9, 10),    // October 10, 2024
            team: {
                connect: { id: team.id },
            },
            roadmap: {
                connect: { id: roadmap.id },
            },
        },
    });

    console.log({ user1, user2,user3,user4, roadmap, team, project });
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
