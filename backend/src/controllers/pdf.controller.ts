import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
const PDFDocument = require('pdfkit');
import prisma from '../lib/prisma';
import path from "node:path";

class PDFController {
    async exportUserPDF(req: Request, res: Response, next: NextFunction): Promise<void> {
        const userId: number = Number(req.params.id);

        if (!userId) {
            return next({
                status: StatusCodes.BAD_REQUEST,
                message: 'Provide a valid id'
            });
        }

        try {
            const user = await prisma.user.findUnique({
                where: { id: userId },
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

            const doc = new PDFDocument();
            doc.pipe(res);

            const logoPath = path.join(__dirname, '..', '..', 'src', 'images', 'logo.png');
            doc.image(logoPath, 10, 15, { width: 100 });

            doc.fontSize(20).text('ProSquadra', 10, 120,);
            doc.moveDown(1);

            doc.fontSize(20).text('Benutzerdaten', { align: 'center' });
            doc.moveDown(2);

            doc.fontSize(12).text('ID: ' + user.id, { align: 'center' });
            doc.text('Vorname: ' + user.vorname, { align: 'center' });
            doc.text('Nachname: ' + user.nachname, { align: 'center' });
            doc.text('Rolle: ' + user.role, { align: 'center' });
            doc.text('Arbeitszeit: ' + user.arbeitszeit + ' Stunden', { align: 'center' });
            doc.text('Urlaubstage: ' + user.urlaubstage, { align: 'center' });
            doc.moveDown(2);

            if (user.skills.length > 0) {
                doc.text('Skills:',{ align: 'center' });
                user.skills.forEach((skill) => {
                    doc.text('  - ' + skill.name,{ align: 'center' });
                });
                doc.moveDown(2);
            }

            if (user.teams.length > 0) {
                doc.text('Teams:',{ align: 'center' });
                user.teams.forEach((team) => {
                    doc.text('  - ' + team.name,{ align: 'center' });
                });
                doc.moveDown(2);
            }

            if (user.estimations.length > 0) {
                doc.text('Schätzungen:',{ align: 'center' });
                user.estimations.forEach((estimation) => {
                    doc.text('  Projekt: ' + estimation.project.name,{ align: 'center' });
                    doc.text('  Geschätzte Stunden: ' + estimation.hours,{ align: 'center' });
                    doc.moveDown(2);
                });
            }

            doc.moveDown(2);
            doc.text('============================================', { align: 'center' });
            doc.moveDown(1);

            doc.fontSize(14).text('Zusammenfassung:', { align: 'center' });
            doc.moveDown(1);

            doc.fontSize(12).text(`Gesamte Arbeitszeit: ${user.arbeitszeit} Stunden`, { align: 'center' });
            doc.text(`Gesamte Urlaubstage: ${user.urlaubstage} Tage`, { align: 'center' });
            doc.text('============================================', { align: 'center' });

            doc.end();
        } catch (error) {
            console.error("Error during PDF generation:", error);
            next(error);
        }
    }
}

export default new PDFController();
