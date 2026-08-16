import React,{useEffect,useState} from "react";
import {Button,Paper,Table,TableHead,TableRow,TableCell,TableBody,TextField,MenuItem,Stack} from "@mui/material";
import api from "../api"; import PageTitle from "../components/PageTitle";

export default function GRN(){
 const [orders,setOrders]=useState([]),[products,setProducts]=useState([]),[rows,setRows]=useState([]),[po,setPo]=useState(""),[product,setProduct]=useState(""),[qty,setQty]=useState(1);

 const load=()=>{
   api.get("/purchase-orders").then(r=>setOrders(r.data.filter(x=>x.status!=="Cancelled")));
   api.get("/products?limit=100").then(r=>setProducts(r.data.items));
   api.get("/grn").then(r=>setRows(r.data))
 };

 useEffect(load,[]);

 const save=async()=>{
   await api.post("/grn",{
     purchaseOrder:po,
     receivedProducts:[
       {
         product,
         quantity:Number(qty)
       }
     ]
   });

   setPo("");
   setProduct("");
   setQty(1);
   load();
 };

 return (
   <>
     <PageTitle
       title="Goods Receipt Notes (GRN)"
       action={
         <Button
           variant="contained"
           onClick={save}
         >
           Create GRN
         </Button>
       }
     />

     <Paper sx={{p:2,mb:3}}>
       <Stack
         direction={{xs:"column",md:"row"}}
         spacing={2}
       >
         <TextField
           select
           label="Purchase Order"
           value={po}
           onChange={e=>setPo(e.target.value)}
           sx={{minWidth:220}}
         >
           {orders.map(o=>(
             <MenuItem
               key={o._id}
               value={o._id}
             >
               {o._id.slice(-8)} - {o.supplier?.name}
             </MenuItem>
           ))}
         </TextField>

         <TextField
           select
           label="Product"
           value={product}
           onChange={e=>setProduct(e.target.value)}
           sx={{minWidth:220}}
         >
           {products.map(p=>(
             <MenuItem
               key={p._id}
               value={p._id}
             >
               {p.title}
             </MenuItem>
           ))}
         </TextField>

         <TextField
           label="Received Qty"
           type="number"
           value={qty}
           onChange={e=>setQty(e.target.value)}
         />
       </Stack>
     </Paper>

     <Paper>
       <Table>
         <TableHead>
           <TableRow>
             <TableCell>GRN</TableCell>
             <TableCell>Purchase Order</TableCell>
             <TableCell>Date</TableCell>
           </TableRow>
         </TableHead>

         <TableBody>
           {rows.map(r=>(
             <TableRow key={r._id}>
               <TableCell>
                 {r._id.slice(-8)}
               </TableCell>

               <TableCell>
                 {r.purchaseOrder?._id?.slice(-8)}
               </TableCell>

               <TableCell>
                 {new Date(
                   r.receivedDate
                 ).toLocaleDateString()}
               </TableCell>
             </TableRow>
           ))}
         </TableBody>
       </Table>
     </Paper>
   </>
 );
}