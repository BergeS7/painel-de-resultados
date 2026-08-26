import { list } from '@vercel/blob';
import { defaultDashboard } from '../../../lib/dashboard-data';
import type { DashboardPayload } from '../../../lib/dashboard-data';

export const dynamic = 'force-dynamic';
export async function GET(){
  if(!process.env.BLOB_READ_WRITE_TOKEN) return Response.json({...defaultDashboard,storageConfigured:false});
  try{
    const result=await list({prefix:'dashboard/latest.json',limit:1});
    if(!result.blobs[0]) return Response.json({...defaultDashboard,storageConfigured:true});
    const response=await fetch(result.blobs[0].url,{cache:'no-store'});
    if(!response.ok) throw new Error('Falha ao ler os dados armazenados.');
    const data=await response.json() as DashboardPayload;
    return Response.json({...data,storageConfigured:true},{headers:{'Cache-Control':'no-store'}});
  }catch{return Response.json({...defaultDashboard,storageConfigured:true},{headers:{'Cache-Control':'no-store'}})}
}
