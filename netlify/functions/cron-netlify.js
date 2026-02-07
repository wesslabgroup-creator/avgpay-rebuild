import { Handler } from '@netlify/functions'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export const handler: Handler = async (event, context) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' }
  }

  try {
    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)
    const fromDate = yesterday.toISOString().split('T')[0]
    const siteId = process.env.NETLIFY_SITE_ID
    const token = process.env.NETLIFY_AUTH_TOKEN

    if (!siteId || !token) {
      throw new Error('Missing NETLIFY_SITE_ID or NETLIFY_AUTH_TOKEN')
    }

    const response = await fetch(`https://api.netlify.com/api/v1/sites/${siteId}/site_usage?from=${fromDate}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })

    if (!response.ok) {
      throw new Error(`Netlify API error: ${response.status}`)
    }

    const data = await response.json()
    // Assuming data has builds, functions: { invocations: [] }
    const builds = data.builds || 0
    const functionsInvoked = data.functions?.invocations?.reduce((sum, f) => sum + (f.usage?.count || 0), 0) || 0

    const date = yesterday

    await prisma.metrics.upsert({
      where: {
        date_source: {
          date,
          source: 'Netlify'
        }
      },
      update: {
        builds,
        functionsInvoked,
        createdAt: new Date()
      },
      create: {
        date,
        source: 'Netlify',
        builds,
        functionsInvoked
      }
    })

    await prisma.$disconnect()
    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, builds, functionsInvoked })
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