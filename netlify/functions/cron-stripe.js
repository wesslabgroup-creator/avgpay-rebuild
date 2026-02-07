import { Handler } from '@netlify/functions'
import Stripe from 'stripe'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', { apiVersion: '2024-10-01' })

export const handler: Handler = async (event, context) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' }
  }

  try {
    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)
    const today = new Date()
    const yesterdayUnix = Math.floor(yesterday.getTime() / 1000)
    const todayUnix = Math.floor(today.getTime() / 1000)

    const charges = await stripe.charges.list({
      created: { gte: yesterdayUnix, lt: todayUnix },
      limit: 100,
    })

    let revenue = 0
    for (const charge of charges.data) {
      if (charge.status === 'succeeded' && charge.amount_captured) {
        revenue += charge.amount_captured
      }
    }

    const date = yesterday

    await prisma.metrics.upsert({
      where: {
        date_source: {
          date,
          source: 'Stripe'
        }
      },
      update: {
        revenue: revenue / 100,  // cents to dollars
        createdAt: new Date()
      },
      create: {
        date,
        source: 'Stripe',
        revenue: revenue / 100
      }
    })

    await prisma.$disconnect()
    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, revenue: revenue / 100, charges: charges.data.length })
    }
  } catch (error) {
    console.error(error)
    await prisma?.$disconnect()
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    }
  }
}