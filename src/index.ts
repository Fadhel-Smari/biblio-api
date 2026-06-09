import prisma from "../utils/prisma.js";


//*********************************** CRUD ***********************************/

/** 
 * CREATE
 * Fonction pour ajouter des livres à la base de données
 */

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

/** 
 * READ
 * Fonctions pour récupérer des livres de la base de données (Lire dans la base de données)
 */

// 1) Tous les livres
async function getTousLesLivres() {
    return prisma.livre.findMany();
}

// 2) Seulement les livres disponibles
async function getLivresDisponibles() {
    return prisma.livre.findMany({
        where: { disponible: true },
    });
}

// 3) Un livre par son id
async function getLivreParId(id: number) {
    return prisma.livre.findUnique({
        where: { id },
    });
}

// 4) Recherche partielle par auteur
async function chercherParAuteur(motCle: string) {
    return prisma.livre.findMany({
        where: {
            auteur: { contains: motCle, mode: "insensitive" },
        },
    });
}

async function main() {
    // await seed();

    // READ - Affichage des résultats
    console.log("\n---Tous les livres---");
    console.log(await getTousLesLivres());

    console.log("\n---Livres disponibles---");
    console.log(await getLivresDisponibles());

    console.log("\n---Livre #1---");
    console.log(await getLivreParId(1));

    console.log("\n---Recherche : ’saint’---");
    console.log(await chercherParAuteur("saint"));

    await prisma.$disconnect();
}
main().catch((e) => {
    console.error(e);
    process.exit(1);
});