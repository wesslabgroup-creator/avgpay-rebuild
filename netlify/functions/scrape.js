import { Handler } from '@netlify/functions'
import AdmZip from 'adm-zip'
import { parse } from 'csv-parse/sync'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const BLS_ZIP_URL = 'https://www.bls.gov/oes/special-requests/oesm24nat.zip'  // Update to current May 2024 nat zip
// Note: Check https://download.bls.gov/pub/time.series/oe/oe.data.0.Current for latest, but for prototype use known.

export const handler: Handler = async (event, context) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' }
  }

  try {
    // Download BLS national OEWS zip
    const response = await fetch('https://www.bls.gov/oes/special-requests/oesm24nat.zip')
    if (!response.ok) throw new Error('Failed to fetch BLS zip')

    const buffer = await response.arrayBuffer()
    const zip = new AdmZip(Buffer.from(buffer))
    const entries = zip.getEntries()

    let csvData
    for (const entry of entries) {
      if (entry.entryName.includes('nat') && entry.entryName.endsWith('.csv')) {
        csvData = parse(entry.getData().toString('utf-8'), { columns: true, skip_empty_lines: true })
        break
      }
    }

    if (!csvData) throw new Error('No CSV found in zip')

    const year = 2024  // May 2024 data
    const processed = []

    for (const row of csvData) {
      const occ_code = row['OCC_CODE']
      const occ_title = row['OCC_TITLE']
      if (occ_code && occ_code !== '00-0000' && row['A_MEAN'] && parseFloat(row['A_MEAN']) > 0) {
        await prisma.aggregateSalary.upsert({
          where: {
            occupation_source_year_area: {
              occupation: occ_title,
              source: 'BLS',
              year,
              area: 'national'
            }
          },
          update: {
            meanAnnual: parseFloat(row['A_MEAN']),
            meanHourly: parseFloat(row['H_MEAN'] || 0),
            createdAt: new Date()
          },
          create: {
            occupation: occ_title,
            meanAnnual: parseFloat(row['A_MEAN']),
            meanHourly: parseFloat(row['H_MEAN'] || 0),
            source: 'BLS',
            year,
            area: 'national'
          }
        })
        processed.push(occ_title)
      }
    }

    // TODO: H1B - find CSV URL, fetch/parse similarly, filter for healthcare SOC, avg by job title/base wage

    await prisma.$disconnect()

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, processed: processed.length, sample: processed.slice(0,5) })
    }
  } catch (error) {
    console.error(error)
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    }
  }
}