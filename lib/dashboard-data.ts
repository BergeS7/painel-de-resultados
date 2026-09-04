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
  revenue: 10884010.20,
  ticket: 20810.73,
  referenceDate: '2026-08-31',
  updatedAt: '2026-09-04T12:00:00-03:00',
  sourceFile: 'Painel de resultados — 31/08/2026',
  categories: [
    {id:'motos',label:'Motos',short:'MO',icon:'🏍',metrics:[{name:'Vendas 0 km',target:490,actual:523,previous:460,lastYear:446,unit:'count'},{name:'Seminovas',target:10,actual:4,previous:7,lastYear:4,unit:'count'}]},
    {id:'forca',label:'Produtos de Força',short:'PF',icon:'⚡',metrics:[{name:'Produtos de força',target:3,actual:0,previous:0,lastYear:0,unit:'count'}]},
    {id:'financeiro',label:'Financeiro',short:'FI',icon:'＄',metrics:[{name:'Banco Honda',target:50,actual:105,previous:77,lastYear:36,unit:'count'},{name:'Cartão parcelado',target:10,actual:6,previous:2,lastYear:7,unit:'count'},{name:'CDCT',target:27,actual:2,previous:1,lastYear:2,unit:'count'},{name:'À vista',target:90,actual:181,previous:164,lastYear:93,unit:'count'}]},
    {id:'seguro',label:'Seguro Honda',short:'SH',icon:'◆',metrics:[{name:'Seguro Honda',target:150,actual:131,previous:null,lastYear:null,unit:'count'}]},
    {id:'cnh',label:'CNH',short:'CN',icon:'▣',metrics:[{name:'Cotas',target:460,actual:458,previous:457,lastYear:397,unit:'count'},{name:'Entregas',target:300,actual:229,previous:216,lastYear:308,unit:'count'}]},
    {id:'pecas',label:'Peças',short:'PE',icon:'⚙',metrics:[{name:'Peças oficina',target:170000,actual:211937.70,previous:186189,lastYear:156686,unit:'money'},{name:'Peças balcão',target:45000,actual:42909.58,previous:52173,lastYear:59330,unit:'money'},{name:'Peças atacado',target:1300000,actual:1090639.75,previous:null,lastYear:null,unit:'money'}]},
    {id:'oficina',label:'Oficina',short:'OF',icon:'🔧',metrics:[{name:'Passagens',target:1214,actual:1227,previous:1054,lastYear:1161,unit:'count'},{name:'Faturamento',target:100000,actual:109119.03,previous:92921,lastYear:82592,unit:'money'}]},
    {id:'outros',label:'Outros indicadores',short:'OI',icon:'✦',metrics:[{name:'Pacotes de serviços',target:12,actual:22,previous:null,lastYear:null,unit:'count'},{name:'Kit lubrificação',target:1,actual:0,previous:null,lastYear:null,unit:'count'}]},
  ],
};

export const emptyDashboard: DashboardPayload = {
  revenue: 0,
  ticket: 0,
  referenceDate: '',
  updatedAt: '',
  categories: [],
};
