import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
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

    const user5 = await prisma.user.create({
        data: {
            vorname: 'Alice',
            nachname: 'Wonderland',
            role: 'Developer',
            arbeitszeit: 40,
            login: {
                create: {
                    username: 'alice.wonderland',
                    password: 'alice123',
                },
            },
        },
    });

    const user6 = await prisma.user.create({
        data: {
            vorname: 'Bob',
            nachname: 'Builder',
            role: 'Developer',
            arbeitszeit: 42,
            login: {
                create: {
                    username: 'bob.builder',
                    password: 'bob123',
                },
            },
        },
    });

    const roadmap1 = await prisma.roadmap.create({ data: {} });
    const roadmap2 = await prisma.roadmap.create({ data: {} });
    const roadmap3 = await prisma.roadmap.create({ data: {} });
    const roadmap4 = await prisma.roadmap.create({ data: {} });
    const roadmap5 = await prisma.roadmap.create({ data: {} });

    // Creating teams
    const team1 = await prisma.team.create({
        data: {
            name: 'Development Team',
            roadmap: {
                connect: { id: roadmap1.id },
            },
            members: {
                connect: [{ id: user1.id }, { id: user2.id }, { id: user5.id }],
            },
        },
    });

    const team2 = await prisma.team.create({
        data: {
            name: 'QA Team',
            roadmap: {
                connect: { id: roadmap2.id },
            },
            members: {
                connect: [{ id: user3.id }, { id: user4.id }, { id: user6.id }],
            },
        },
    });

    const team3 = await prisma.team.create({
        data: {
            name: 'Design Team',
            roadmap: {
                connect: { id: roadmap3.id },
            },
            members: {
                connect: { id: user3.id },
            },
        },
    });

    const team4 = await prisma.team.create({
        data: {
            name: 'Product Team',
            roadmap: {
                connect: { id: roadmap4.id },
            },
            members: {
                connect: { id: user3.id },
            },
        },
    });

    const team5 = await prisma.team.create({
        data: {
            name: 'Marketing Team',
            roadmap: {
                connect: { id: roadmap5.id },
            },
            members: {
                connect: { id: user3.id },
            },
        },
    });

    // Create projects with assigned PriorityPosition
    const project1 = await prisma.project.create({
        data: {
            name: 'New Development Project',
            description: 'A new project for development team',
            estimationDays: 30,
            startDate: new Date(2023, 4, 1),
            endDate: new Date(2023, 9, 1),
            team: {
                connect: { id: team1.id },
            },
            roadmap: {
                connect: { id: roadmap1.id },
            },
            PriorityPosition: 1,  // First project in this roadmap
        },
    });

    const project2 = await prisma.project.create({
        data: {
            name: 'QA Testing Project',
            description: 'A project for quality assurance testing',
            estimationDays: 45,
            startDate: new Date(2023, 5, 15),
            endDate: new Date(2023, 10, 15),
            team: {
                connect: { id: team2.id },
            },
            roadmap: {
                connect: { id: roadmap2.id },
            },
            PriorityPosition: 1,  // First project in this roadmap
        },
    });

    const project3 = await prisma.project.create({
        data: {
            name: 'Design Overhaul Project',
            description: 'A design-focused project for UI/UX improvements',
            estimationDays: 60,
            startDate: new Date(2023, 6, 1),
            endDate: new Date(2023, 12, 31),
            team: {
                connect: { id: team3.id },
            },
            roadmap: {
                connect: { id: roadmap3.id },
            },
            PriorityPosition: 1,  // First project in this roadmap
        },
    });

    const project4 = await prisma.project.create({
        data: {
            name: 'Product Launch Project',
            description: 'A project focused on the next product launch',
            estimationDays: 90,
            startDate: new Date(2023, 7, 1),
            endDate: new Date(2024, 3, 1),
            team: {
                connect: { id: team4.id },
            },
            roadmap: {
                connect: { id: roadmap4.id },
            },
            PriorityPosition: 1,  // First project in this roadmap
        },
    });

    const project5 = await prisma.project.create({
        data: {
            name: 'Marketing Campaign Project',
            description: 'A marketing campaign project for the upcoming season',
            estimationDays: 50,
            startDate: new Date(2023, 8, 1),
            endDate: new Date(2023, 12, 31),
            team: {
                connect: { id: team5.id },
            },
            roadmap: {
                connect: { id: roadmap5.id },
            },
            PriorityPosition: 1,  // First project in this roadmap
        },
    });

    console.log({ user1, user2, user3, user4, user5, user6, roadmap1, roadmap2, roadmap3, roadmap4, roadmap5, team1, team2, team3, team4, team5, project1, project2, project3, project4, project5 });
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
