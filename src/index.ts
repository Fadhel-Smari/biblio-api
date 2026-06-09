import prisma from "../utils/prisma.js";

async function seed() {

    await prisma.livre.createMany({
        data: [
            {
                titre: "Le Petit Prince",
                auteur: "Antoine de Saint-Exupéry",
                annee: 1943,
                disponible: true,
            },
            {
                titre: "1984",
                auteur: "George Orwell",
                annee: 1949,
                disponible: true,
            },
            {
                titre: "Le Hobbit",
                auteur: "J.R.R. Tolkein",
                annee: 1937,
                disponible: true,
            },
            {
                titre: "Harry Potter à l'école des sorciers",
                auteur: "J.K. Rowling",
                annee: 1997,
                disponible: true,
            },
            {
                titre: "Le Seigneur des Anneaux",
                auteur: "J.R.R. Tolkein",
                annee: 1954,
                disponible: true,
            }
        ]
    });
}

async function main() {
    await seed();
    await prisma.$disconnect();
}
main().catch((e) => {
    console.error(e);
    process.exit(1);
});