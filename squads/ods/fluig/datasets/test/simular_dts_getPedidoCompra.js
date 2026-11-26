// Executa o dataset de PC fora do Fluig com uma resposta simulada do Protheus.
// Uso: node test/simular_dts_getPedidoCompra.js dts_getPedidoCompra_JYNX_test.js
const fs=require('fs'),vm=require('vm');
const linhas=["HEADER",
 "I82810;000181;01;20261126;FLU1G;104281;30000;2;0;0;3;0;;;;1",
 "I82807;000146;01;20261020;2000;104278;12000;1;0;0;1;0;;L;;1",
 "I82807;000146;01;20261020;2000;104278;8000;1;0;1;1;0;;L;;1",
 "I82805;000010;01;20260920;2000;104270;500;1;0;0;1;0;S;;;1"];
const rows=[];const cols=[];let usuario=process.env.WKUSER||'admin';
const ctx={log:{info:console.log,warn:console.log,error:console.log},
 addColumn:c=>cols.push(c),setKey:k=>console.log('key',k),
 getValue:k=>k==='WKUser'?usuario:null,
 DatasetBuilder:{newDataset:()=>({addColumn:c=>cols.push(c),addRow:r=>rows.push(r),addOrUpdateRow:r=>rows.push(r)})},
 DatasetFactory:{getDataset:()=>({rowsCount:1,getValue:()=>"x"})},
 ServiceManager:{getService:()=>({getBean:()=>({instantiate:()=>({getINTERFACEMFXSOAP:()=>({getRequestContext:()=>({put(){}}),execqry:()=>({getSTRING:()=>({size:()=>linhas.length,get:i=>linhas[i]})})}),setCUSER(){},setCPASSW(){},setCKEY(){}})})})},
 org:{apache:{cxf:{frontend:{ClientProxy:{getClient:()=>{throw 'sem cxf'}}}}}}};
vm.createContext(ctx);vm.runInContext(fs.readFileSync(process.argv[2],'utf8'),ctx);
if(ctx.defineStructure){ctx.defineStructure();ctx.onSync(null);}else{ctx.createDataset(null,null,null);}
console.log('usuario='+usuario+' linhas='+rows.length);
rows.forEach(r=>{const o=Object.fromEntries(cols.map((c,i)=>[c,r[i]]));console.log(o.C7_NUM,o.C7_TOTAL,o.C7_STATUS,o.C7_COR_STATUS)});
