import { OrderListView } from 'src/sections/order/view';
import OrderClockListView from 'src/sections/order/view/order-clocks-list-view';

// ----------------------------------------------------------------------

export const metadata = {
  title: 'Dashboard: Order Clocks List',
};

export default function OrderClocksListPage() {
  return <OrderClockListView />;
}
