import express, { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import cors from 'cors';
import { ApiResponse } from './types/api-response';

const app = express();
const prisma = new PrismaClient();

// Middleware for JSON processing
app.use(express.json());
app.use(cors());

// Root route
app.get('/', (req, res) => {
    res.send('Hello, World!');
});

// ======================== User Routes ========================

app.post('/api/users', async (req: Request, res: Response) => {
    const { vorname, nachname, role, token } = req.body;

    try {
        const newUser = await prisma.user.create({
            data: { vorname, nachname, role, token },
        });

        const response: ApiResponse<typeof newUser> = {
            code: 201,
            data: newUser,
            details: null,
            error: null,
        };
        res.status(201).json(response);
    } catch (error) {
        const response: ApiResponse<null> = {
            code: 500,
            data: null,
            details: null,
            error: 'Fehler beim Erstellen des Benutzers',
        };
        res.status(500).json(response);
    }
});

app.get('/api/users', async (req: Request, res: Response) => {
    try {
        const users = await prisma.user.findMany();

        const response: ApiResponse<typeof users> = {
            code: 200,
            data: users,
            details: null,
            error: null,
        };
        res.json(response);
    } catch (error) {
        const response: ApiResponse<null> = {
            code: 500,
            data: null,
            details: null,
            error: 'Fehler beim Abrufen der Benutzer',
        };
        res.status(500).json(response);
    }
});

app.get('/api/users/:id', async (req: Request, res: Response) => {
    const userId = parseInt(req.params.id, 10); // Get the user ID from the route parameter

    try {
        const user = await prisma.user.findUnique({
            where: { id: userId }, // Query the database for the user by ID
        });

        if (user) {
            const response: ApiResponse<typeof user> = {
                code: 200,
                data: user,
                details: null,
                error: null,
            };
            res.json(response);
        } else {
            const response: ApiResponse<null> = {
                code: 404,
                data: null,
                details: `User with ID ${userId} not found`,
                error: null,
            };
            res.status(404).json(response); // Return 404 if user not found
        }
    } catch (error) {
        const response: ApiResponse<null> = {
            code: 500,
            data: null,
            details: null,
            error: 'Internal server error',
        };
        res.status(500).json(response); // Return 500 in case of a server error
    }
});

// ======================== Skill Routes ========================

app.post('/api/skills', async (req: Request, res: Response) => {
    const { name } = req.body;
    try {
        const newSkill = await prisma.skill.create({
            data: { name },
        });

        const response: ApiResponse<typeof newSkill> = {
            code: 201,
            data: newSkill,
            details: null,
            error: null,
        };
        res.status(201).json(response);
    } catch (error) {
        const response: ApiResponse<null> = {
            code: 500,
            data: null,
            details: null,
            error: 'Fehler beim Erstellen der Fähigkeit',
        };
        res.status(500).json(response);
    }
});

app.get('/api/skills', async (req: Request, res: Response) => {
    try {
        const skills = await prisma.skill.findMany();

        const response: ApiResponse<typeof skills> = {
            code: 200,
            data: skills,
            details: null,
            error: null,
        };
        res.json(response);
    } catch (error) {
        const response: ApiResponse<null> = {
            code: 500,
            data: null,
            details: null,
            error: 'Fehler beim Abrufen der Fähigkeiten',
        };
        res.status(500).json(response);
    }
});

// ======================== Team Routes ========================

app.post('/api/teams', async (req: Request, res: Response) => {
    const { name, roadmapId } = req.body;
    try {
        const newTeam = await prisma.team.create({
            data: { name, roadmapId },
        });

        const response: ApiResponse<typeof newTeam> = {
            code: 201,
            data: newTeam,
            details: null,
            error: null,
        };
        res.status(201).json(response);
    } catch (error) {
        const response: ApiResponse<null> = {
            code: 500,
            data: null,
            details: null,
            error: 'Fehler beim Erstellen des Teams',
        };
        res.status(500).json(response);
    }
});

app.get('/api/teams', async (req: Request, res: Response) => {
    try {
        const teams = await prisma.team.findMany();

        const response: ApiResponse<typeof teams> = {
            code: 200,
            data: teams,
            details: null,
            error: null,
        };
        res.json(response);
    } catch (error) {
        const response: ApiResponse<null> = {
            code: 500,
            data: null,
            details: null,
            error: 'Fehler beim Abrufen der Teams',
        };
        res.status(500).json(response);
    }
});

// ======================== Project Routes ========================

app.post('/api/projects', async (req: Request, res: Response) => {
    const { name, description, startDate, endDate, effortEstimation, estimationDays, teamId, roadmapId } = req.body;
    try {
        const newProject = await prisma.project.create({
            data: { name, description, startDate, endDate, effortEstimation, estimationDays, teamId, roadmapId },
        });

        const response: ApiResponse<typeof newProject> = {
            code: 201,
            data: newProject,
            details: null,
            error: null,
        };
        res.status(201).json(response);
    } catch (error) {
        const response: ApiResponse<null> = {
            code: 500,
            data: null,
            details: null,
            error: 'Fehler beim Erstellen des Projekts',
        };
        res.status(500).json(response);
    }
});

app.get('/api/projects', async (req: Request, res: Response) => {
    try {
        const projects = await prisma.project.findMany();

        const response: ApiResponse<typeof projects> = {
            code: 200,
            data: projects,
            details: null,
            error: null,
        };
        res.json(response);
    } catch (error) {
        const response: ApiResponse<null> = {
            code: 500,
            data: null,
            details: null,
            error: 'Fehler beim Abrufen der Projekte',
        };
        res.status(500).json(response);
    }
});

// ======================== Roadmap Routes ========================

app.post('/api/roadmaps', async (req: Request, res: Response) => {
    const { title, teams, projectIds } = req.body;
    try {
        const newRoadmap = await prisma.roadmap.create({
            data: {
                title,
                teams: {
                    connect: teams.map((teamId: number) => ({ id: teamId })),
                },
                projects: {
                    connect: projectIds.map((projectId: number) => ({ id: projectId })),
                },
            },
        });

        const response: ApiResponse<typeof newRoadmap> = {
            code: 201,
            data: newRoadmap,
            details: null,
            error: null,
        };
        res.status(201).json(response);
    } catch (error) {
        const response: ApiResponse<null> = {
            code: 500,
            data: null,
            details: null,
            error: 'Fehler beim Erstellen der Roadmap',
        };
        res.status(500).json(response);
    }
});

app.get('/api/roadmaps', async (req: Request, res: Response) => {
    try {
        const roadmaps = await prisma.roadmap.findMany();

        const response: ApiResponse<typeof roadmaps> = {
            code: 200,
            data: roadmaps,
            details: null,
            error: null,
        };
        res.json(response);
    } catch (error) {
        const response: ApiResponse<null> = {
            code: 500,
            data: null,
            details: null,
            error: 'Fehler beim Abrufen der Roadmaps',
        };
        res.status(500).json(response);
    }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server läuft auf http://localhost:${PORT}`);
});
