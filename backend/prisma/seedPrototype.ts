import { PrismaClient } from '@prisma/client';
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
    const hashedPassword = await bcrypt.hash('test', 10);

    // Create Roadmap
    const roadmap = await prisma.roadmap.create({
        data: {},
    });

    const roadmap2 = await prisma.roadmap.create({
        data: {},
    });

    // Create Users
    const scrumMaster = await prisma.user.create({
        data: {
            vorname: 'Samuel',
            nachname: 'Scrummy',
            role: 'SM',
            arbeitszeit: 35,
            urlaubstage: 25,
            login: { create: { username: 'sm', password: hashedPassword } },
            skills: { create: [{ name: 'Scrum Mastering' }] },
        },
    });

    const productOwner = await prisma.user.create({
        data: {
            vorname: 'Paula',
            nachname: 'Owning',
            role: 'PO',
            arbeitszeit: 35,
            urlaubstage: 28,
            login: { create: { username: 'po', password: hashedPassword } },
            skills: { create: [{ name: 'Agile Methodology' }] },
        },
    });

    const developer = await prisma.user.create({
        data: {
            vorname: 'David',
            nachname: 'Dev',
            role: 'Developer',
            arbeitszeit: 40,
            urlaubstage: 30,
            login: { create: { username: 'dev', password: hashedPassword } },
            skills: { create: [{ name: 'JavaScript' }, { name: 'React' }] },
        },
    });

    const scrumMaster2 = await prisma.user.create({
        data: {
            vorname: 'Simon',
            nachname: 'Schramm',
            role: 'SM',
            arbeitszeit: 35,
            urlaubstage: 25,
            login: { create: { username: 'sm2', password: hashedPassword } },
            skills: { create: [{ name: 'Scrum Managering' }] },
        },
    });

    const productOwner2 = await prisma.user.create({
        data: {
            vorname: 'Paul',
            nachname: 'Ovaness',
            role: 'PO',
            arbeitszeit: 35,
            urlaubstage: 28,
            login: { create: { username: 'po2', password: hashedPassword } },
            skills: { create: [{ name: 'Agile Testing' }] },
        },
    });

    const developer2 = await prisma.user.create({
        data: {
            vorname: 'Daniel',
            nachname: 'Danzig',
            role: 'Developer',
            arbeitszeit: 40,
            urlaubstage: 30,
            login: { create: { username: 'dev2', password: hashedPassword } },
            skills: { create: [{ name: 'Angular' }, { name: 'JS' }] },
        },
    });

    const admin = await prisma.user.create({
        data: {
            vorname: 'Alice',
            nachname: 'Admin',
            role: 'Admin',
            arbeitszeit: 40,
            urlaubstage: 50,
            login: { create: { username: 'admin', password: hashedPassword } },
            skills: { create: [{ name: 'System Administration' }] },
        },
    });

    const bereichsleiter = await prisma.user.create({
        data: {
            vorname: 'Bob',
            nachname: 'Boss',
            role: 'Bereichsleiter',
            arbeitszeit: 45,
            urlaubstage: 35,
            login: { create: { username: 'bl', password: hashedPassword } },
            skills: { create: [{ name: 'Management' }] },
        },
    });

    // Create Teams
    const adminTeam = await prisma.team.create({
        data: {
            name: 'Administrators',
            members: { connect: [{ id: admin.id }, { id: bereichsleiter.id }] },
        },
    });
    
    const devTeam = await prisma.team.create({
        data: {
            name: 'Development Team',
            roadmap: { connect: { id: roadmap.id } },
            members: {
                connect: [
                    { id: scrumMaster.id },
                    { id: productOwner.id },
                    { id: developer.id },
                ],
            },
        },
    });

    const devTeam2 = await prisma.team.create({
        data: {
            name: 'QA Team',
            roadmap: { connect: { id: roadmap2.id } },
            members: {
                connect: [
                    { id: scrumMaster2.id },
                    { id: productOwner2.id },
                    { id: developer2.id },
                ],
            },
        },
    });

    // Create Projects
    const project1 = await prisma.project.create({
        data: {
            name: 'Agile Development Project',
            description: 'Focuses on iterative software development.',
            startDate: null,
            endDate: null,
            team: { connect: { id: devTeam.id } },
            roadmap: { connect: { id: roadmap.id } },
            projectStatus: 'offen',
            priorityPosition: 1,
        },
    });

    const project2 = await prisma.project.create({
        data: {
            name: 'System Migration Project',
            description: 'Aims to migrate systems to a new environment.',
            startDate: null,
            endDate: null,
            team: { connect: { id: devTeam.id } },
            roadmap: { connect: { id: roadmap.id } },
            projectStatus: 'offen',
            priorityPosition: 2,
        },
    });

    const project3 = await prisma.project.create({
        data: {
            name: 'QA Project',
            description: 'Aims to ensure quality in products.',
            startDate: null,
            endDate: null,
            team: { connect: { id: devTeam2.id } },
            roadmap: { connect: { id: roadmap2.id } },
            projectStatus: 'offen',
            priorityPosition: 1,
        },
    });

    console.log({
        roadmap,
        roadmap2,
        devTeam,
        devTeam2,
        adminTeam,
        scrumMaster,
        scrumMaster2,
        productOwner,
        productOwner2,
        developer,
        developer2,
        admin,
        bereichsleiter,
        project1,
        project2,
        project3,
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
