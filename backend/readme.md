### Linux setup
`mysql -u root -p`
pw: `TW4gc9p9`

### Prisma commands

`-prisma validate` Schema validieren
`-prisma generate` Schema erstellen
`-prisma migrate dev` Schema anwenden
`-prisma studio` Dateneinsicht
`npm run seed` baut eine test db auf

- alte migrations löschen

Wenn das Schema geändert wird muss ein neues erstellt und angewendet werden. Wenn das nicht funktioniert einfach die alten migrations löschen


### Run Backend

`npm run dev`

### Seeding for testdata

Database seeding happens in two ways with Prisma ORM: manually with prisma db seed and automatically in prisma migrate reset and (in some scenarios) `prisma migrate dev`.

With prisma db seed, you decide when to invoke the seed command. It can be useful for a test setup or to prepare a new development environment, for example.

Prisma Migrate also integrates seamlessly with your seeds, assuming you follow the steps in the section below. Seeding is triggered automatically when Prisma Migrate resets the development database.

Prisma Migrate resets the database and triggers seeding in the following scenarios:

You manually run the prisma migrate reset CLI command.
The database is reset interactively in the context of using prisma migrate dev - for example, as a result of migration history conflicts or database schema drift.
The database is actually created by prisma migrate dev, because it did not exist before.
When you want to use prisma migrate dev or prisma migrate reset without seeding, you can pass the --skip-seed flag.

# Thoughts

- Will ich einen check beim Login erstellen machen welche Rolle der authentifizierte Benutzer hat? -> nur admin? Frontend könnte dies vermutlich auch regeln
- Swagger UI benutzen?

# ToDos
- Check all types for ? operator as its used to ease compiling
- Skills impl
- ProjektPrio impl