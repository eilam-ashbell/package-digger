import githubAggregation from '@/utils/githubAggregation';
import githubService from '@/utils/githubService';
import axios from 'axios';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    
    const owner = request.nextUrl.searchParams.get('owner');
    const repo = request.nextUrl.searchParams.get('repo');    
    const data = await githubAggregation.init(owner, repo);
    // const data = await githubService.getDependentsRepos(owner, repo);
    return NextResponse.json({...data});
}
