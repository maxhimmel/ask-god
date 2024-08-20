import { db } from "../src/server/db";

let deityId = 1;
const deities = [
    { id: `${deityId++}`, name: "Jesus", description: "Christianity", image: "" },
    { id: `${deityId++}`, name: "Buddha", description: "Buddhism", image: "" },
    { id: `${deityId++}`, name: "Krishna", description: "Hinduism", image: "" },
    { id: `${deityId++}`, name: "Allah", description: "Islam", image: "" },
    { id: `${deityId++}`, name: "The Tao", description: "Taoism", image: "" },
    { id: `${deityId++}`, name: "Alchoholics Anonymous", description: "12 Step Program", image: "" },
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