// import React from 'react';
// import { Table, TableContainer, TableHead, TableBody, TableRow, TableCell, Paper } from '@mui/material';
// import { OrderHistory } from '@/services/order.service';
// import { formatCurrency, formatDate } from '@/helpers';

// interface StatisticTableProps {
//   orders: OrderHistory[];
//   onRowClick: (order: OrderHistory) => void;
// }

// const StatisticTable: React.FC<StatisticTableProps> = ({ orders, onRowClick }) => {
//   return (
//     <TableContainer component={Paper}>
//       <Table>
//         <TableHead>
//           <TableRow>
//             <TableCell>#</TableCell>
//             <TableCell>Mã đơn hàng</TableCell>
//             <TableCell>Tên khách hàng</TableCell>
//             <TableCell>Ngày đặt hàng</TableCell>
//             <TableCell>Trạng thái</TableCell>
//             <TableCell align="right">Tổng tiền</TableCell>
//           </TableRow>
//         </TableHead>
//         <TableBody>
//           {orders.map((order, index) => (
//             <TableRow hover key={order.orderId} onClick={() => onRowClick(order)}>
//               <TableCell>{index + 1}</TableCell>
//               <TableCell>{order.orderId}</TableCell>
//               <TableCell>{order.customerName}</TableCell>
//               <TableCell>{formatDate(order.createdAt)}</TableCell>
//               <TableCell>{order.status}</TableCell>
//               <TableCell align="right">{formatCurrency(order.totalPrice)}</TableCell>
//             </TableRow>
//           ))}
//         </TableBody>
//       </Table>
//     </TableContainer>
//   );
// };

// export default StatisticTable;
