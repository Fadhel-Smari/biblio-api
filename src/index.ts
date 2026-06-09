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
                titre: "Bilbo le Hobbit",
                auteur: "J.R.R. Tolkien",
                annee: 1937,
                disponible: true,
            },
            {
                titre: "Alice au pays des merveilles ",
                auteur: "Lewis Carroll",
                annee: 1865,
                disponible: true,
            },
            {
                titre: "Moby Dick",
                auteur: "Herman Melville",
                annee: 1851,
                disponible: true,
            },
            {
                titre: "Voyages de Gulliver",
                auteur: "Jonathan Swift",
                annee: 1726,
                disponible: true,
            },
        ],
    });
}

// Étape 4 READ
async function getTousLesLivres(){
    return prisma.livre.findMany();
}

async function getLivresDisponibles() {
    return prisma.livre.findMany({
        where: { disponible: true},
    });
}

async function getLivreParId(id: number){
    return prisma.livre.findUnique({
        where:  { id },
    });
}

async function chercherParAuteur(motCle: string) {
    return prisma.livre.findMany({
        where: {
            auteur: { contains: motCle, mode: "insensitive" },
        },
    });
}

//Étape 5 UPDATE
async function marquerIndisponible(id: number) {
    try {
        return prisma.livre.update({
            where: { id },
            data: { disponible: false },
        });
    } catch (e) {
        console.error(`Livre #${id} non existant.`)
    }
}

async function corrigerAnnee(id: number, nouvelleAnne: number) {
    try {
        return prisma.livre.update({
            where: { id },
            data: { annee: nouvelleAnne },
        });
    } catch (e) {
        console.error(`Livre #${id} non existant.`)
    }
}

async function supprimerLivre(id: number) {
    try {
        return prisma.livre.delete({
            where: { id },
        });
    } catch (e) {
        console.error(`Livre #${id} non existant.`)
    }
}

async function supprimerAnciens(avantAnnee: number) {
    return prisma.livre.deleteMany({
        where: { annee: { lt: avantAnnee} },
    });
}

async function main() {
    // Étape 3
    // console.log("\n--- Étape 3 CREATE ---");
    // await seed();

    // Étape 4
    console.log("\n--- Étape 4 READ ---");
    console.log("\n--- Tous les livres ---");
    console.log(await getTousLesLivres());

    console.log("\n--- Livres Disponibles ---");
    console.log(await getLivresDisponibles());

    console.log("\n--- Livre #1 ---");
    console.log(await getLivreParId(1));

    console.log("\n--- Recherche: 'saint' ---");
    console.log(await chercherParAuteur("saint"));

    // Étape 5 + affichage
    console.log("\n--- Étape 5 UPDATE ---");
    console.log(await marquerIndisponible(1));
    console.log(await corrigerAnnee(2, 2024));

    console.log("\n--- Tous les livres ---");
    console.log(await getTousLesLivres());

    // Étape 6
    // console.log("\n--- Étape 5 DELETE ---");
    // console.log(await supprimerLivre(1));
    // console.log(await supprimerAnciens(1930));



    await prisma.$disconnect();
}

main().catch((e) => {
    console.error(e);
    process.exit(1);
});