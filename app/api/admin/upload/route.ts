import { put } from '@vercel/blob';
import { parseDashboardWorkbook } from '../../../../lib/parse-dashboard';

export const runtime='nodejs';
export async function POST(request:Request){
  if(!process.env.ADMIN_PASSWORD||!process.env.BLOB_READ_WRITE_TOKEN) return Response.json({error:'Configure ADMIN_PASSWORD e o Vercel Blob nas variáveis do projeto.'},{status:503});
  if(request.headers.get('x-admin-password')!==process.env.ADMIN_PASSWORD) return Response.json({error:'Senha administrativa incorreta.'},{status:401});
  const form=await request.formData(); const file=form.get('file');
  if(!(file instanceof File)) return Response.json({error:'Selecione uma planilha .xlsx.'},{status:400});
  if(!file.name.toLowerCase().endsWith('.xlsx')) return Response.json({error:'O arquivo precisa estar no formato .xlsx.'},{status:400});
  if(file.size>10*1024*1024) return Response.json({error:'A planilha deve ter no máximo 10 MB.'},{status:400});
  try{
    const buffer=Buffer.from(await file.arrayBuffer());
    const payload=await parseDashboardWorkbook(buffer,file.name);
    const stamp=new Date().toISOString().replace(/[:.]/g,'-');
    await Promise.all([
      put('dashboard/latest.json',JSON.stringify(payload),{access:'public',addRandomSuffix:false,allowOverwrite:true,contentType:'application/json'}),
      put(`dashboard/history/${stamp}.json`,JSON.stringify(payload),{access:'public',addRandomSuffix:false,contentType:'application/json'}),
    ]);
    return Response.json({ok:true,payload});
  }catch(error){return Response.json({error:error instanceof Error?error.message:'Não foi possível processar a planilha.'},{status:400})}
}
