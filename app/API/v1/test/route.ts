import npmAggregation from '@/utils/npmAggregation';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    
    const res = await npmAggregation.init('next', '13.4.11')
    return NextResponse.json({...res});
}
