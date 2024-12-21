import app from './app';

// https://github.com/rafaelmfranca/express-prisma-jwt-auth/tree/main

const PORT = process.env.PORT || 3010;

app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));