import { Handler } from '@netlify/functions'

export const handler: Handler = async (event, context) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' }
  }

  try {
    // Get popular OEWS series IDs (top wages)
    const popularRes = await fetch('https://api.bls.gov/publicAPI/v2/timeseries/popular?survey=OE');
    const popularData = await popularRes.json();
    const seriesIDs = popularData.Results.series.map((s) => s.seriesID).slice(0, 25); // Public API limit ~25

    // Fetch data with catalog for occupation titles
    const dataRes = await fetch('https://api.bls.gov/publicAPI/v2/timeseries/data/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        seriesid: seriesIDs,
        catalog: true
      })
    });

    const data = await dataRes.json();

    if (data.status !== 'REQUEST_SUCCEEDED') {
      throw new Error(data.message ? data.message.join(', ') : 'API error');
    }

    const metrics = [];
    for (const result of data.Results) {
      for (const series of result.series) {
        const latestData = series.data.find(d => d.latest === 'true');
        if (latestData && series.catalog) {
          const title = series.catalog.series_title || series.catalog.occupation || series.seriesID;
          if (title && latestData.value !== '***') {
            metrics.push({
              seriesID: series.seriesID,
              occupation: title,
              meanAnnual: parseInt(latestData.value),
              year: parseInt(latestData.year),
              source: 'BLS',
              area: series.catalog.area || 'national'
            });
          }
        }
      }
    }

    // H1B TODO: Fetch latest USCIS CSV e.g. https://www.uscis.gov/sites/default/files/document/data/h1b_employer_data_fy2025q1.xlsx
    // Parse with XLSX lib, filter SOC 29-XXXX healthcare, avg WAGE_LOW by job title

    console.log(`Processed ${metrics.length} BLS metrics.`);

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        success: true,
        processed: metrics.length,
        timestamp: new Date().toISOString(),
        year: new Date().getFullYear(),
        sample: metrics.slice(0, 5),
        // allData for test
        data: metrics
      })
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: error.message })
    };
  }
};

// Local test
if (import.meta.url === `file://${process.argv[1]}`) {
  handler({ httpMethod: 'POST' }, {}).then(({ body }) => console.log(JSON.parse(body)));
}