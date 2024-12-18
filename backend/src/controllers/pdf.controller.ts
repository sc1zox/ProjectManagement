import {NextFunction, Request, Response} from 'express';
import {StatusCodes} from 'http-status-codes';

const PDFDocument = require('pdfkit');
import prisma from '../lib/prisma';
import path from "node:path";

// Gestaltung ChatGpt
class PDFController {
    async exportUserPDF(req: Request, res: Response, next: NextFunction): Promise<void> {
        const userId: number = Number(req.params.id);

        if (!userId) {
            return next({
                status: StatusCodes.BAD_REQUEST,
                message: 'Provide a valid id',
            });
        }

        try {
            const user = await prisma.user.findUnique({
                where: {id: userId},
                include: {
                    skills: true,
                    teams: true,
                    estimations: {
                        include: {
                            project: true,
                        },
                    },
                },
            });

            if (!user) {
                return next({
                    status: StatusCodes.NOT_FOUND,
                    message: 'Benutzer nicht gefunden.',
                });
            }

            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', `attachment; filename=user_${userId}_data.pdf`);

            const doc = new PDFDocument({margin: 50});
            doc.pipe(res);

            // Logo and Header
            const logoPath = path.join(__dirname, '..', '..', 'src', 'images', 'logo.png');
            doc.image(logoPath, 10, 15, {width: 100});
            doc.moveDown(2);

            // Title
            doc.fontSize(24).fillColor('#283593').text('ProSquadra', {align: 'center'});
            doc.moveDown(0.5);
            doc.fontSize(18).fillColor('#283593').text('Benutzerdaten', {align: 'center', underline: true});
            doc.moveDown(2);

            // User Information
            doc.fontSize(14).fillColor('black').text(`ID: ${user.id}`, {align: 'center'});
            doc.text(`Vorname: ${user.vorname}`, {align: 'center'});
            doc.text(`Nachname: ${user.nachname}`, {align: 'center'});
            doc.text(`Rolle: ${user.role}`, {align: 'center'});
            doc.text(`Arbeitszeit: ${user.arbeitszeit} Stunden`, {align: 'center'});
            doc.text(`Urlaubstage: ${user.urlaubstage}`, {align: 'center'});
            doc.moveDown(2);

            // Skills Section
            if (user.skills.length > 0) {
                doc.fontSize(16).fillColor('#232323').text('Skills:', {underline: true});
                doc.moveDown(1);

                user.skills.forEach((skill) => {
                    doc.fontSize(12).fillColor('black').text(`• ${skill.name}`, {indent: 20});
                });
                doc.moveDown(2);
            }

            // Teams Section
            if (user.teams.length > 0) {
                doc.fontSize(16).fillColor('#232323').text('Teams:', {underline: true});
                doc.moveDown(1);

                user.teams.forEach((team) => {
                    doc.fontSize(12).fillColor('black').text(`• ${team.name}`, {indent: 20});
                });
                doc.moveDown(2);
            }

            // Estimations Section
            if (user.estimations.length > 0) {
                doc.fontSize(16).fillColor('#232323').text('Meine Schätzungen:', {underline: true});
                doc.moveDown(1);

                user.estimations.forEach((estimation) => {
                    doc.fontSize(14).fillColor('#283593').text(`Projekt: ${estimation.project.name}`, {indent: 20});
                    doc.fontSize(12).fillColor('black').text(`  Geschätzte Stunden: ${estimation.hours}`, {indent: 40});
                    doc.moveDown(1);
                });
            }
            doc.addPage();
            // Divider
            doc.moveDown(2);
            doc.fontSize(12).fillColor('gray').text('============================================', {align: 'center'});
            doc.moveDown(1);

            // Summary Section
            doc.fontSize(16).fillColor('#283593').text('Zusammenfassung:', {align: 'center'});
            doc.moveDown(1);

            doc.fontSize(12).fillColor('black').text(`Gesamte Arbeitszeit: ${user.arbeitszeit} Stunden`, {align: 'center'});
            doc.text(`Gesamte Urlaubstage: ${user.urlaubstage} Tage`, {align: 'center'});
            doc.moveDown(1);

            doc.fillColor('gray').text('============================================', {align: 'center'});

            // Footer
            doc.moveDown(2);
            doc.fontSize(10).fillColor('gray').text('© 2024 ProSquadra - All Rights Reserved', {align: 'center'});

            doc.end();
        } catch (error) {
            console.error('Error during PDF generation:', error);
            next(error);
        }
    }

    async exportRoadmapPDF(req: Request, res: Response, next: NextFunction): Promise<void> {
        const userId: number = Number(req.params.id);

        if (!userId) {
            return next({
                status: StatusCodes.BAD_REQUEST,
                message: 'Provide a valid userId',
            });
        }

        try {
            // Retrieve user and associated teams
            const user = await prisma.user.findUnique({
                where: {id: userId},
                include: {
                    teams: {
                        include: {
                            roadmap: {
                                include: {
                                    projects: {
                                        include: {
                                            estimations: true,
                                        },
                                        orderBy: {
                                            priorityPosition: 'asc',
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            });

            if (!user || !user.teams || user.teams.length === 0) {
                return next({
                    status: StatusCodes.NOT_FOUND,
                    message: 'No teams found for the given userId.',
                });
            }

            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', `attachment; filename=user_${userId}_roadmaps.pdf`);

            const doc = new PDFDocument({margin: 50});
            doc.pipe(res);

            // Logo and Header
            const logoPath = path.join(__dirname, '..', '..', 'src', 'images', 'logo.png');
            doc.image(logoPath, 10, 15, {width: 100});
            doc.moveDown(2);

            // Title
            doc.fontSize(24).fillColor('#283593').text('ProSquadra', {align: 'center'});
            doc.moveDown(0.5);
            doc.fontSize(18).fillColor('#283593').text('Roadmap Daten für Benutzer', {
                align: 'center',
                underline: true
            });
            doc.moveDown(2);

            // User Information
            doc.fontSize(14).fillColor('black').text(`Benutzer ID: ${user.id}`, {align: 'center'});
            doc.text(`Name: ${user.vorname} ${user.nachname}`, {align: 'center'});
            doc.moveDown(2);

            // Loop through each team
            for (const team of user.teams) {
                if (!team.roadmap) continue;

                // Team Section
                doc.addPage(); // Add a new page for each team
                doc.fontSize(20).fillColor('#283593').text(`Team: ${team.name}`, {align: 'center', underline: true});
                doc.moveDown(1);

                // Projects Section
                if (team.roadmap.projects.length > 0) {
                    doc.fontSize(16).fillColor('#232323').text('Projekte:', {underline: true});
                    doc.moveDown(1);

                    team.roadmap.projects.forEach((project) => {
                        const startDate = project.startDate ? new Date(project.startDate).toLocaleDateString() : 'N/A';
                        const endDate = project.endDate ? new Date(project.endDate).toLocaleDateString() : 'N/A';

                        // Project Name
                        doc.fontSize(14).fillColor('#283593').text(`• ${project.name}`, {indent: 20});
                        doc.moveDown(0.5);

                        // Project Details
                        doc.fontSize(12).fillColor('black');
                        doc.text(`Beschreibung: ${project.description}`, {indent: 40});
                        doc.text(`Priorität: ${project.priorityPosition}`, {indent: 40});
                        doc.text(`Status: ${project.projectStatus}`, {indent: 40});
                        doc.text(`Startdatum: ${startDate}`, {indent: 40});
                        doc.text(`Enddatum: ${endDate}`, {indent: 40});
                        doc.moveDown(0.5);

                        // Estimations
                        if (project.estimations.length > 0) {
                            doc.fontSize(12).fillColor('#283593').text('Schätzungen:', {indent: 40, underline: true});
                            doc.moveDown(0.5);

                            project.estimations.forEach((estimation) => {
                                doc.fontSize(12).fillColor('black').text(`- ${estimation.hours} Stunden`, {indent: 60});
                            });
                        }

                        doc.moveDown(1);
                    });
                } else {
                    doc.fontSize(12).fillColor('gray').text('Keine Projekte gefunden.', {align: 'center'});
                }
            }

            // Footer
            doc.moveDown(2);
            doc.fontSize(10).fillColor('gray').text('© 2024 ProSquadra - All Rights Reserved', {align: 'center'});

            doc.end();
        } catch (error) {
            console.error('Error during PDF generation:', error);
            next(error);
        }
    }
}

export default new PDFController();
