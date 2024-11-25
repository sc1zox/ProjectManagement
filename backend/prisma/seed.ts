import { PrismaClient } from '@prisma/client';
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
    // Erstelle Skills
    const skill1 = await prisma.skill.create({ data: { name: 'JavaScript' } });
    const skill2 = await prisma.skill.create({ data: { name: 'TypeScript' } });
    const skill3 = await prisma.skill.create({ data: { name: 'React' } });
    const skill4 = await prisma.skill.create({ data: { name: 'Node.js' } });
    const skill5 = await prisma.skill.create({ data: { name: 'GraphQL' } });

    const hashedpw1 = await bcrypt.hash('test', 10);

    // Erstelle Benutzer
    const user1 = await prisma.user.create({
        data: {
            vorname: 'John',
            nachname: 'Doe',
            role: 'Developer',
            arbeitszeit: 40,
            login: { create: { username: 'dev', password: hashedpw1 } },
            skills: { connect: [{ id: skill1.id }, { id: skill2.id }] },
            urlaubstage: 35,
        },
    });

    const user2 = await prisma.user.create({
        data: {
            vorname: 'Jane',
            nachname: 'Smith',
            role: 'PO',
            arbeitszeit: 35,
            login: { create: { username: 'po', password: hashedpw1 } },
            skills: { connect: [{ id: skill3.id }, { id: skill4.id }] },
            urlaubstage: 28,
        },
    });

    const user3 = await prisma.user.create({
        data: {
            vorname: 'Master',
            nachname: 'Scrum',
            role: 'SM',
            arbeitszeit: 35,
            login: { create: { username: 'sm', password: hashedpw1 } },
            skills: { connect: [{ id: skill1.id }, { id: skill5.id }] },
            urlaubstage: 28,
        },
    });

    const user4 = await prisma.user.create({
        data: {
            vorname: 'admin',
            nachname: 'test',
            role: 'Admin',
            arbeitszeit: 35,
            login: { create: { username: 'admin', password: hashedpw1 } },
            skills: { connect: [{ id: skill2.id }, { id: skill4.id }] },
            urlaubstage: 50,
        },
    });

    const user5 = await prisma.user.create({
        data: {
            vorname: 'Alice',
            nachname: 'Wonderland',
            role: 'Developer',
            arbeitszeit: 40,
            login: { create: { username: 'alice.wonderland', password: hashedpw1 } },
            skills: { connect: [{ id: skill3.id }, { id: skill5.id }] },
            urlaubstage: 20,
        },
    });

    const user6 = await prisma.user.create({
        data: {
            vorname: 'Bob',
            nachname: 'Builder',
            role: 'Bereichsleiter',
            arbeitszeit: 42,
            login: { create: { username: 'bob.builder', password: hashedpw1 } },
            skills: { connect: [{ id: skill1.id }, { id: skill4.id }] },
            urlaubstage: 28,
        },
    });

    // Erstelle Roadmaps
    const roadmap1 = await prisma.roadmap.create({ data: {} });
    const roadmap2 = await prisma.roadmap.create({ data: {} });
    const roadmap3 = await prisma.roadmap.create({ data: {} });
    const roadmap4 = await prisma.roadmap.create({ data: {} });
    const roadmap5 = await prisma.roadmap.create({ data: {} });

    // Erstelle Teams
    const team1 = await prisma.team.create({
        data: {
            name: 'Development Team',
            roadmap: { connect: { id: roadmap1.id } },
            members: { connect: [{ id: user1.id }, { id: user2.id }, { id: user5.id }] },
        },
    });

    const team2 = await prisma.team.create({
        data: {
            name: 'QA Team',
            roadmap: { connect: { id: roadmap2.id } },
            members: { connect: [{ id: user3.id }, { id: user4.id }, { id: user6.id }] },
        },
    });

    const team3 = await prisma.team.create({
        data: {
            name: 'Design Team',
            roadmap: { connect: { id: roadmap3.id } },
            members: { connect: [{ id: user3.id }] },
        },
    });

    const team4 = await prisma.team.create({
        data: {
            name: 'Product Team',
            roadmap: { connect: { id: roadmap4.id } },
            members: { connect: [{ id: user3.id }] },
        },
    });

    const team5 = await prisma.team.create({
        data: {
            name: 'Marketing Team',
            roadmap: { connect: { id: roadmap5.id } },
            members: { connect: [{ id: user3.id }] },
        },
    });

    // Erstelle Projekte und ordne sie den Roadmaps zu (mindestens 2 Projekte pro Roadmap)
    const project1 = await prisma.project.create({
        data: {
            name: 'New Development Project',
            description: 'A new project for development team',
            startDate: new Date(2023, 4, 1),
            endDate: new Date(2023, 9, 1),
            team: { connect: { id: team1.id } },
            projectStatus: 'offen',
            roadmap: { connect: { id: roadmap1.id } },
            priorityPosition: 1,
        },
    });

    const project2 = await prisma.project.create({
        data: {
            name: 'QA Testing Project',
            description: 'A project for quality assurance testing',
            startDate: new Date(2023, 5, 15),
            endDate: new Date(2023, 10, 15),
            projectStatus: 'offen',
            team: { connect: { id: team2.id } },
            roadmap: { connect: { id: roadmap2.id } },
            priorityPosition: 1,
        },
    });

    const project3 = await prisma.project.create({
        data: {
            name: 'Design Sprint',
            description: 'A design-focused sprint for UI/UX improvement',
            startDate: new Date(2023, 6, 1),
            endDate: new Date(2023, 7, 1),
            team: { connect: { id: team3.id } },
            projectStatus: 'inBearbeitung',
            roadmap: { connect: { id: roadmap3.id } },
            priorityPosition: 1,
        },
    });

    const project4 = await prisma.project.create({
        data: {
            name: 'Product Development',
            description: 'A project focused on product improvements',
            startDate: new Date(2023, 7, 15),
            endDate: new Date(2023, 12, 15),
            team: { connect: { id: team4.id } },
            projectStatus: 'geschlossen',
            roadmap: { connect: { id: roadmap4.id } },
            priorityPosition: 1,
        },
    });

    const project5 = await prisma.project.create({
        data: {
            name: 'Marketing Strategy',
            description: 'A project focused on developing marketing strategies',
            startDate: new Date(2023, 5, 1),
            endDate: new Date(2023, 6, 30),
            team: { connect: { id: team5.id } },
            projectStatus: 'offen',
            roadmap: { connect: { id: roadmap5.id } },
            priorityPosition: 1,
        },
    });

    // Erstelle Estimations und ordne sie den Projekten zu
    await prisma.estimation.createMany({
        data: [
            { hours: 45, projectId: project1.id, userId: user1.id },
            { hours: 50, projectId: project1.id, userId: user5.id },
        ],
    });

    console.log({
        user1,
        user2,
        user3,
        user4,
        user5,
        user6,
        skill1,
        skill2,
        skill3,
        skill4,
        skill5,
        roadmap1,
        roadmap2,
        roadmap3,
        roadmap4,
        roadmap5,
        project1,
        project2,
        project3,
        project4,
        project5,
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