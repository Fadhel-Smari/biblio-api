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

/** 
 * UPDATE
 * Fonctions pour mettre à jour un livre dans la base de données
 */

 // Marquer un livre comme indisponible (emprunté)
async function marquerIndisponible(id: number) {
    return prisma.livre.update({
        where: { id },
        data: { disponible: false },
    });
}

// Corriger l’année d’un livre
async function corrigerAnnee(id: number, nouvelleAnnee: number) {
    return prisma.livre.update({
        where: { id },
        data: { annee: nouvelleAnnee },
    });
}

/** 
 * DELETE
 * Fonctions pour supprimer un livre ou plusieurs livres de la base de données
 */

// Supprimer un livre par id
async function supprimerLivre(id: number) {
    return prisma.livre.delete({
        where: { id },
    });
}
// Supprimer tous les livres antérieurs à une année
async function supprimerAnciens(avantAnnee: number) {
    return prisma.livre.deleteMany({
        where: { annee: { lt: avantAnnee } },
    });
}

/**
 * Bonus–Les emprunts et les relations
 */

 // Emprunter un livre
async function emprunterLivre(livreId: number, parQui: string) {
    // 1) Créer l’emprunt
    const emprunt = await prisma.emprunt.create({
        data: { livreId, empruntePar: parQui },
    });
    // 2) Marquer le livre comme indisponible
    await prisma.livre.update({
        where: { id: livreId },
        data: { disponible: false },
    });
    return emprunt;
}

// Lister tous les emprunts AVEC les infos du livre
async function listerEmprunts() {
    return prisma.emprunt.findMany({
        include: { livre: true },
    });
}

// Retourner un livre (rendre l’emprunt)
async function rendreLivre(empruntId: number) {
    const emprunt = await prisma.emprunt.delete({
        where: { id: empruntId },
    });
    await prisma.livre.update({
        where: { id: emprunt.livreId },
        data: { disponible: true },
    });
    return emprunt;
}

/**
 * Fonction principale
 */

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

    // UPDATE - Test des Updates
    console.log(await marquerIndisponible(1));
    console.log(await corrigerAnnee(2, 2024));

    // DELETE - Test des Deletes
    // console.log(await supprimerLivre(3));
    // console.log(await supprimerAnciens(1950));

    // BONUS - Test des emprunts
    // console.log("\n---Emprunter le livre #2---");
    // const emprunt = await emprunterLivre(2, "Alice");
    // console.log(emprunt);
    // console.log("\n---Liste des emprunts---");
    // console.log(await listerEmprunts());
    // console.log("\n---Rendre le livre emprunté---");
    // console.log(await rendreLivre(emprunt.id));

    await prisma.$disconnect();
}
main().catch((e) => {
    console.error(e);
    process.exit(1);
});