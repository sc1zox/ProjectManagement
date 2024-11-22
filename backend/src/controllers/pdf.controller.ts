import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
const PDFDocument = require('pdfkit');
import prisma from '../lib/prisma';

class PDFController {
    async exportUserPDF(req: Request, res: Response, next: NextFunction): Promise<void> {
        const userId: number = Number(req.params.id);

        if(!userId){
            return next({
                status: StatusCodes.BAD_REQUEST,
                message: 'provide a valid id'
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

            doc.fontSize(20).text('Benutzerdaten', { align: 'center' });
            doc.moveDown(2);

            doc.fontSize(12).text('ID: ' + user.id);
            doc.text('Vorname: ' + user.vorname);
            doc.text('Nachname: ' + user.nachname);
            doc.text('Rolle: ' + user.role);
            doc.text('Arbeitszeit: ' + user.arbeitszeit + ' Stunden');
            doc.text('Urlaubstage: ' + user.urlaubstage);
            doc.moveDown(1);

            if (user.skills.length > 0) {
                doc.text('Skills:');
                user.skills.forEach((skill) => {
                    doc.text('  - ' + skill.name);
                });
                doc.moveDown(1);
            }

            if (user.teams.length > 0) {
                doc.text('Teams:');
                user.teams.forEach((team) => {
                    doc.text('  - ' + team.name);
                });
                doc.moveDown(1);
            }

            if (user.estimations.length > 0) {
                doc.text('Schätzungen:');
                user.estimations.forEach((estimation) => {
                    doc.text('  Projekt: ' + estimation.project.name);
                    doc.text('  Geschätzte Stunden: ' + estimation.hours);
                    doc.moveDown(1);
                });
            }

            doc.end();
        } catch (error) {
            console.error("Error during PDF generation:", error);
            next(error);
        }
    }
}

export default new PDFController();
