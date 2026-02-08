import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    // If Supabase is not configured, store in memory or return success
    if (!supabase) {
      console.log('Supabase not configured, logging submission:', body)
      return NextResponse.json({ 
        success: true, 
        message: 'Submission logged (database not yet configured)',
        data: body 
      })
    }
    
    const totalComp = body.baseSalary + (body.equity || 0) / 4 + (body.bonus || 0)
    
    const { data, error } = await supabase
      .from('user_submissions')
      .insert({
        email: body.email || null,
        base_salary: body.baseSalary,
        equity: body.equity || 0,
        bonus: body.bonus || 0,
        total_comp: totalComp,
        company: body.company,
        role: body.role,
        location: body.location,
        level: body.level,
        years_exp: body.yearsExp || null,
        status: 'pending',
        weight: 0.5
      })
      .select()
    
    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    
    return NextResponse.json({ success: true, data })
  } catch (err) {
    console.error('API error:', err)
    return NextResponse.json({ error: 'Failed to submit' }, { status: 500 })
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const role = searchParams.get('role')
  const location = searchParams.get('location')
  const level = searchParams.get('level')
  
  // If Supabase not configured, return empty data
  if (!supabase) {
    return NextResponse.json({ count: 0, message: 'Database not yet configured' })
  }
  
  try {
    let query = supabase
      .from('salaries')
      .select('*, companies(name), roles(title), locations(city, state, metro)')
      .eq('verified', true)
    
    if (role) {
      query = query.eq('roles.title', role)
    }
    
    if (location) {
      query = query.eq('locations.metro', location)
    }
    
    if (level) {
      query = query.eq('level', level)
    }
    
    const { data, error } = await query
    
    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    
    // Calculate stats
    const salaries = data?.map((s: { total_comp: number }) => s.total_comp) || []
    const count = salaries.length
    
    if (count === 0) {
      return NextResponse.json({ count: 0, message: 'No data available' })
    }
    
    const sorted = salaries.sort((a: number, b: number) => a - b)
    const median = sorted[Math.floor(count / 2)]
    const p25 = sorted[Math.floor(count * 0.25)]
    const p75 = sorted[Math.floor(count * 0.75)]
    const p90 = sorted[Math.floor(count * 0.9)]
    
    return NextResponse.json({
      count,
      median,
      p25,
      p75,
      p90,
      data
    })
  } catch (err) {
    console.error('API error:', err)
    return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 })
  }
}
