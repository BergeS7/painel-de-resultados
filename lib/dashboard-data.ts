export type Unit = 'count' | 'money';
export type Metric = { name: string; target: number; actual: number; previous: number | null; lastYear: number | null; unit: Unit };
export type DashboardCategory = { id: string; label: string; short: string; icon: string; metrics: Metric[] };
export type DashboardPayload = {
  revenue: number;
  ticket: number;
  referenceDate: string;
  updatedAt: string;
  sourceFile?: string;
  categories: DashboardCategory[];
};

export const defaultDashboard: DashboardPayload = {
  revenue: 5624850.58,
  ticket: 19875.797102473498,
  referenceDate: '2026-08-25',
  updatedAt: '2026-08-25T12:00:00-03:00',
  sourceFile: 'PAINEL_DE_RESULTADOS_NOVO.xlsx',
  categories: [
    {id:'motos',label:'Motos',short:'MO',icon:'🏍',metrics:[{name:'Vendas 0 km',target:490,actual:283,previous:287,lastYear:296,unit:'count'},{name:'Seminovas',target:10,actual:4,previous:6,lastYear:2,unit:'count'}]},
    {id:'forca',label:'Produtos de Força',short:'PF',icon:'⚡',metrics:[{name:'Produtos de força',target:3,actual:0,previous:0,lastYear:0,unit:'count'}]},
    {id:'financeiro',label:'Financeiro',short:'FI',icon:'＄',metrics:[{name:'Banco Honda',target:50,actual:81,previous:67,lastYear:23,unit:'count'},{name:'Cartão parcelado',target:10,actual:4,previous:2,lastYear:5,unit:'count'},{name:'CDCT',target:27,actual:2,previous:0,lastYear:1,unit:'count'},{name:'À vista',target:90,actual:25,previous:38,lastYear:35,unit:'count'}]},
    {id:'seguro',label:'Seguro Honda',short:'SH',icon:'◆',metrics:[{name:'Seguro Honda',target:150,actual:103,previous:null,lastYear:null,unit:'count'}]},
    {id:'cnh',label:'CNH',short:'CN',icon:'▣',metrics:[{name:'Cotas',target:460,actual:344,previous:376,lastYear:314,unit:'count'},{name:'Entregas',target:300,actual:171,previous:180,lastYear:232,unit:'count'}]},
    {id:'pecas',label:'Peças',short:'PE',icon:'⚙',metrics:[{name:'Peças oficina',target:170000,actual:112107,previous:103850,lastYear:114236,unit:'money'},{name:'Peças balcão',target:45000,actual:29432,previous:39282,lastYear:41169,unit:'money'},{name:'Peças atacado',target:1300000,actual:698846,previous:901574,lastYear:645323,unit:'money'}]},
    {id:'oficina',label:'Oficina',short:'OF',icon:'🔧',metrics:[{name:'Passagens',target:1214,actual:812,previous:798,lastYear:887,unit:'count'},{name:'Faturamento',target:100000,actual:69913.12,previous:65697,lastYear:67353,unit:'money'}]},
    {id:'outros',label:'Outros indicadores',short:'OI',icon:'✦',metrics:[{name:'Pacotes de serviços',target:12,actual:20,previous:null,lastYear:null,unit:'count'},{name:'Kit lubrificação',target:1,actual:0,previous:null,lastYear:null,unit:'count'}]},
  ],
};
