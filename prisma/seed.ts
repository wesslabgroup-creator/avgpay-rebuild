import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding database...')
  
  const dummySalaries = [
    {
      locationState: 'CA',
      locationCity: 'San Francisco',
      specialty: 'ICU',
      yearsExperience: 5,
      payRateHourly: 85.50,
      overtimeRateHourly: 128.25,
      stipendWeekly: 500,
      bonusesAnnual: 5000,
    },
    {
      locationState: 'TX',
      locationCity: 'Houston',
      specialty: 'Med-Surg',
      yearsExperience: 2,
      payRateHourly: 38.00,
      overtimeRateHourly: 57.00,
      stipendWeekly: 0,
      bonusesAnnual: 1000,
    },
    {
      locationState: 'NY',
      locationCity: 'New York',
      specialty: 'ER',
      yearsExperience: 8,
      payRateHourly: 72.00,
      overtimeRateHourly: 108.00,
      stipendWeekly: 200,
      bonusesAnnual: 3000,
    },
    {
      locationState: 'FL',
      locationCity: 'Miami',
      specialty: 'L&D',
      yearsExperience: 4,
      payRateHourly: 42.50,
      overtimeRateHourly: 63.75,
      stipendWeekly: 0,
      bonusesAnnual: 1500,
    },
    {
        locationState: 'CA',
        locationCity: 'Los Angeles',
        specialty: 'Pediatrics',
        yearsExperience: 6,
        payRateHourly: 68.00,
        overtimeRateHourly: 102.00,
        stipendWeekly: 300,
        bonusesAnnual: 2500,
    },
    {
        locationState: 'WA',
        locationCity: 'Seattle',
        specialty: 'ICU',
        yearsExperience: 3,
        payRateHourly: 55.00,
        overtimeRateHourly: 82.50,
        stipendWeekly: 100,
        bonusesAnnual: 2000,
    }
  ]

  for (const salary of dummySalaries) {
    await prisma.salary.create({
      data: salary,
    })
  }

  console.log('Seeding finished.')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
