import { passwordExtension } from "../extensions/password";

const { Schedule, Criteria, Frequency, PrismaClient } = require("@prisma/client");
const faker = require('@faker-js/faker').faker;

const db = new PrismaClient().$extends(passwordExtension);
const endOfToday = new Date()
endOfToday.setHours(23, 59, 59, 999);

const generateUsers = (count: number, includeTasks: Boolean = true) => {
    return Array.from({ length: count }, () => {
        return {
            email: faker.internet.email(),
            name: faker.person.fullName(),
            password: faker.internet.password(),
            tasks: includeTasks ? {
                create: generateTasks(faker.number.int({ min: 1, max: 10 })),
            } : undefined
        };
    });
};

const generateTasks = (count: number) => {
    return Array.from({ length: count }, () => {
        const frequency: typeof Frequency = faker.helpers.arrayElement([Frequency.Onetime, Frequency.Recurring]);
        const criteria: typeof Criteria = faker.helpers.arrayElement([Criteria.Time, Criteria.Count]);

        const obj = {
            title: faker.lorem.sentence(),
            criteria: criteria,
            frequency: frequency,
            goalTime: null as number | null,
            goalCount: null as number | null,
            dueDate: null as Date | null,
            schedule: undefined as typeof Schedule,
            startDate: null as Date | null,
            endDate: null as Date | null,
        };

        if (criteria === Criteria.Time) {
            obj.goalTime = faker.number.int({ min: 1, max: 24 * 60 * 60 });
        }

        else if (criteria === Criteria.Count) {
            obj.goalCount = faker.number.int({ min: 1, max: 10 });
        }

        if (frequency === Frequency.Onetime) {
            obj.dueDate = endOfToday;
        }
        else if (frequency === Frequency.Recurring) {
            obj.schedule = {
                create: {
                    friday: faker.datatype.boolean(),
                    saturday: faker.datatype.boolean(),
                    sunday: faker.datatype.boolean(),
                    monday: faker.datatype.boolean(),
                    tuesday: faker.datatype.boolean(),
                    wednesday: faker.datatype.boolean(),
                    thursday: faker.datatype.boolean(),
                }
            };
            obj.startDate = new Date()
            obj.endDate = faker.date.soon()
        }


        return obj;
    });
}


async function main() {
    const users = generateUsers(1);
    console.log(users)
    users.map(async (user) => {
        await db.user.create({ data: user })
    });
}

main()
    .then(async () => {
        await db.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await db.$disconnect()
        process.exit(1)
    })