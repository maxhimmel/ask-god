import { db } from "../src/server/db";

const deities = [
    { id: "1", name: "Jesus", description: "Christianity", image: "" },
    { id: "2", name: "Buddha", description: "Buddhism", image: "" },
    { id: "3", name: "Krishna", description: "Hinduism", image: "" },
    { id: "4", name: "Allah", description: "Islam", image: "" },
];

async function main() {
    for (const deity of deities) {
        await db.deity.upsert({
            where: { id: deity.id },
            create: deity,
            update: deity,
        });
    }
}

main()
    .then(async () => {
        await db.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await db.$disconnect();
        process.exit(1);
    });