// prisma/seed.ts
import { PrismaClient } from '../generated/prisma';

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Starting database seeding...');

    // Create Standard
    const standard = await prisma.standard.upsert({
        where: { name: 'SusAF' },
        update: {},
        create: {
            name: 'SusAF',
            description: 'Software Sustainability Framework',
        },
    });

    console.log('✅ Standard created:', standard.name);

    // Define dimensions with descriptions
    const dimensionsData = [
        {
            name: 'Environment',
            description:
                'Environmental aspects and impacts including resource usage, energy consumption, and ecological footprint.',
        },
        {
            name: 'Social',
            description:
                'Social responsibility, community engagement, and societal impact of software systems.',
        },
        {
            name: 'Workplace',
            description:
                'Workplace environment, employee welfare, and organizational culture in software development.',
        },
        {
            name: 'Economic',
            description:
                'Economic factors, financial sustainability, and business governance in software projects.',
        },
        {
            name: 'Individual',
            description:
                'Individual health, privacy, personal development, and user empowerment.',
        },
        {
            name: 'Technical',
            description:
                'Technical quality, security, maintainability, and long-term viability of software systems.',
        },
    ];

    // Create dimensions
    const dimensions: any[] = [];
    for (const dimData of dimensionsData) {
        const dimension = await prisma.dimension.upsert({
            where: {
                name_standardId: {
                    // ✅ Use compound unique constraint
                    name: dimData.name,
                    standardId: standard.id,
                },
            },
            update: {},
            create: {
                name: dimData.name,
                standardId: standard.id,
            },
        });
        dimensions.push(dimension);
        console.log('✅ Dimension created:', dimension.name);
    }

    // Define topics with descriptions
    const topicsData = {
        Social: [
            {
                name: 'Sense of community',
                description:
                    'Building and fostering community connections and belonging among users and stakeholders.',
            },
            {
                name: 'diversity & inclusion',
                description:
                    'Promoting diversity and ensuring inclusive practices in software development and usage.',
            },
            {
                name: 'Trust',
                description:
                    'Establishing and maintaining trust between users, developers, and software systems.',
            },
            {
                name: 'Equity',
                description:
                    'Ensuring fair access and treatment for all users regardless of background or circumstances.',
            },
            {
                name: 'Participation',
                description:
                    'Enabling meaningful participation and engagement of all stakeholders in software processes.',
            },
        ],
        Environment: [
            {
                name: 'Material & Resources',
                description:
                    'Efficient use of materials and resources in software development and operation.',
            },
            {
                name: 'Energy',
                description:
                    'Energy consumption optimization and renewable energy usage in software systems.',
            },
            {
                name: 'Biodiversity',
                description:
                    'Impact assessment and protection of biodiversity through sustainable software practices.',
            },
            {
                name: 'Waste & Pollution',
                description:
                    'Minimizing digital waste and reducing pollution from software operations.',
            },
            {
                name: 'Logistics',
                description:
                    'Sustainable logistics and distribution strategies for software products and services.',
            },
        ],
        Economic: [
            {
                name: 'Value',
                description:
                    'Creating sustainable economic value through software solutions and business models.',
            },
            {
                name: 'SupplyChain',
                description:
                    'Sustainable supply chain management and vendor relationships in software development.',
            },
            {
                name: 'Customer Relationship Management',
                description:
                    'Building long-term, sustainable relationships with customers and users.',
            },
            {
                name: 'Innovation',
                description:
                    'Fostering sustainable innovation practices and continuous improvement in software development.',
            },
            {
                name: 'Governance',
                description:
                    'Implementing effective governance structures and decision-making processes for sustainability.',
            },
        ],
        Individual: [
            {
                name: 'Health',
                description:
                    'Protecting and promoting physical and mental health of users and developers.',
            },
            {
                name: 'Privacy & safety',
                description:
                    'Ensuring user privacy protection and safety in digital environments.',
            },
            {
                name: 'lifelong learning',
                description:
                    'Supporting continuous learning and skill development for all stakeholders.',
            },
            {
                name: 'Awareness & FreeWill',
                description:
                    'Promoting awareness and preserving user autonomy and freedom of choice.',
            },
        ],
        Technical: [
            {
                name: 'Maintainability',
                description:
                    'Designing software systems that are easy to maintain and update over time.',
            },
            {
                name: 'scalability',
                description:
                    'Building systems that can scale efficiently without compromising sustainability.',
            },
            {
                name: 'usability',
                description:
                    'Creating user-friendly interfaces and experiences that promote long-term adoption.',
            },
            {
                name: 'adaptability',
                description:
                    'Developing flexible systems that can adapt to changing requirements and environments.',
            },
            {
                name: 'security',
                description:
                    'Implementing robust security measures to protect systems and user data.',
            },
        ],
        Workplace: [
            {
                name: 'Well being of worker',
                description:
                    'Ensuring physical and mental well-being of software development team members.',
            },
            {
                name: 'Participation and voice',
                description:
                    'Providing opportunities for worker participation and voice in decision-making processes.',
            },
            {
                name: 'Diversity and inclusion',
                description:
                    'Creating diverse and inclusive workplace environments in software organizations.',
            },
            {
                name: 'Labour policies',
                description:
                    'Implementing fair and sustainable labor policies and practices in software development.',
            },
        ],
    };

    // Create topics for each dimension
    for (const [dimensionName, topics] of Object.entries(topicsData)) {
        const dimension = dimensions.find((d) => d.name === dimensionName);
        if (!dimension) continue;

        for (const topicData of topics) {
            const topic = await prisma.topic.upsert({
                where: {
                    name_dimensionId: {
                        name: topicData.name,
                        dimensionId: dimension.id,
                    },
                },
                update: {},
                create: {
                    name: topicData.name,
                    description: topicData.description,
                    dimensionId: dimension.id,
                },
            });
            console.log(`✅ Topic created: ${topic.name} (${dimensionName})`);
        }
    }

    console.log('🎉 Database seeding completed successfully!');
}

main()
    .catch((e) => {
        console.error('❌ Error during seeding:', e);
        process.exit(1);
    })
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    .finally(async () => {
        await prisma.$disconnect();
    });
