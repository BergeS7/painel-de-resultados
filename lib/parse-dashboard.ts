import ExcelJS from 'exceljs';
import { defaultDashboard, type DashboardCategory, type DashboardPayload, type Metric, type Unit } from './dashboard-data';

const clean = (value: unknown) => String(value ?? '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^A-Za-z0-9]+/g, ' ').trim().toUpperCase();
const rawValue = (value: ExcelJS.CellValue): unknown => value && typeof value === 'object' && 'result' in value ? value.result : value;
const numeric = (value: ExcelJS.CellValue): number | null => { const raw=rawValue(value); if(raw===null||raw===undefined||raw==='') return null; const n=Number(raw); return Number.isFinite(n)?n:null; };
const isoDate = (value: ExcelJS.CellValue): string => { const raw=rawValue(value); const date=raw instanceof Date?raw:new Date(String(raw)); return Number.isNaN(date.getTime())?'':date.toISOString().slice(0,10); };

const categoryTemplates = new Map(defaultDashboard.categories.map(c=>[c.id,{...c,metrics:[]} as DashboardCategory]));
const metric = (name:string,target:number|null,actual:number|null,previous:number|null,lastYear:number|null,unit:Unit):Metric=>({name,target:target??0,actual:actual??0,previous,lastYear,unit});

export async function parseDashboardWorkbook(buffer: Buffer, sourceFile: string): Promise<DashboardPayload> {
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.load(buffer as unknown as ExcelJS.Buffer);
  const sheet = workbook.worksheets.find(s=>clean(s.name)==='STA INES');
  if(!sheet) throw new Error('A planilha precisa conter a aba Sta.Inês.');

  const categories = new Map<string,DashboardCategory>();
  const add=(id:string,m:Metric)=>{const base=categoryTemplates.get(id);if(!base)return;const current=categories.get(id)??{...base,metrics:[]};current.metrics.push(m);categories.set(id,current)};
  let revenue=0,ticket=0,referenceDate='';

  sheet.eachRow((row)=>{
    const label=clean(row.getCell(2).value);
    if(label==='RECEITA MENSAL') revenue=numeric(row.getCell(3).value)??revenue;
    if(label==='CONCESSIONARIA') referenceDate=isoDate(row.getCell(8).value)||referenceDate;
    if(clean(row.getCell(6).value)==='TICKET MEDIO MENSAL') ticket=numeric(row.getCell(8).value)??ticket;
    const sub=clean(row.getCell(3).value),target=numeric(row.getCell(4).value),actual=numeric(row.getCell(5).value),previous=numeric(row.getCell(8).value),lastYear=numeric(row.getCell(9).value);
    if(label==='MOTOS'&&sub.includes('OKM')) add('motos',metric('Vendas 0 km',target,actual,previous,lastYear,'count'));
    else if(label==='MOTOS'&&sub.includes('SEMINOVAS')) add('motos',metric('Seminovas',target,actual,previous,lastYear,'count'));
    else if(label==='PRODUTOS DE FORCA') add('forca',metric('Produtos de força',target,actual,previous,lastYear,'count'));
    else if(label==='FINANCEIRO'&&sub==='BANCO HONDA') add('financeiro',metric('Banco Honda',target,actual,previous,lastYear,'count'));
    else if(label==='FINANCEIRO'&&sub==='CARTAO PARCELADO') add('financeiro',metric('Cartão parcelado',target,actual,previous,lastYear,'count'));
    else if(label==='FINANCEIRO'&&sub==='CDCT') add('financeiro',metric('CDCT',target,actual,previous,lastYear,'count'));
    else if(label==='FINANCEIRO'&&sub==='A VISTA') add('financeiro',metric('À vista',target,actual,previous,lastYear,'count'));
    else if(label==='SEGURO HONDA') add('seguro',metric('Seguro Honda',target,actual,previous,lastYear,'count'));
    else if(label==='CNH'&&sub.includes('COTAS')) add('cnh',metric('Cotas',target,actual,previous,lastYear,'count'));
    else if(label==='CNH'&&sub.includes('ENTREGAS')) add('cnh',metric('Entregas',target,actual,previous,lastYear,'count'));
    else if(label==='PECAS'&&sub.includes('OFICINA')) add('pecas',metric('Peças oficina',target,actual,previous,lastYear,'money'));
    else if(label==='PECAS'&&sub.includes('BALCAO')) add('pecas',metric('Peças balcão',target,actual,previous,lastYear,'money'));
    else if(label==='PECAS'&&sub.includes('ATACADO')) add('pecas',metric('Peças atacado',target,actual,previous,lastYear,'money'));
    else if(label==='OFICINA PASSAGEM') add('oficina',metric('Passagens',target,actual,previous,lastYear,'count'));
    else if(label==='OFICINA FATURAMENTO') add('oficina',metric('Faturamento',target,actual,previous,lastYear,'money'));
    else if(label==='OUTROS INDICADORES'&&sub.includes('PAC')) add('outros',metric('Pacotes de serviços',target,actual,previous,lastYear,'count'));
    else if(label==='OUTROS INDICADORES'&&sub.includes('KIT LUB')) add('outros',metric('Kit lubrificação',target,actual,previous,lastYear,'count'));
  });

  const parsed=defaultDashboard.categories.map(c=>categories.get(c.id)).filter((c):c is DashboardCategory=>Boolean(c?.metrics.length));
  if(parsed.length<8) throw new Error(`Foram reconhecidas apenas ${parsed.length} de 8 categorias. Verifique se o modelo da planilha foi alterado.`);
  return {revenue,ticket,referenceDate:referenceDate||new Date().toISOString().slice(0,10),updatedAt:new Date().toISOString(),sourceFile,categories:parsed};
}
