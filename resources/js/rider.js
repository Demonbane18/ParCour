import axios from 'axios'
import moment from 'moment'
import Noty from 'noty';

// prettier-ignore
export function initR(socket) {
  const orderTableBody = document.querySelector('#orderTableBody');
  const orderTableBodyCompleted = document.querySelector('#orderTableBodycomp');
  const orderTableBodyCancelled = document.querySelector('#orderTableBodyCancelled');
  let orders = [];
  let completed_orders = [];
  let cancelled_orders = [];
  let markup;
  let completed_markup;
  let cancelled_markup;
  //http request
  axios
    .get('/rider/orders', {
      headers: {
        'X-Requested-With': 'XMLHttpRequest',
      },
    })
    .then((res) => {
      orders = res.data;
      //return html in form of array
      markup = generateMarkup(orders);
      orderTableBody.innerHTML = markup;
    })
    .catch((err) => {
      console.log(err);
    });

  //prettier-ignore
  axios.get('/rider/completed_orders', {
         headers: {
             "X-Requested-With": 'XMLHttpRequest'
         }
     }).then(res => {
         completed_orders = res.data;
         //return html in form of array
       completed_markup = generateMarkup(completed_orders);
       orderTableBodyCompleted.innerHTML = completed_markup;
     }).catch(err => {
         console.log(err)
     })

  //prettier-ignore
  axios.get('/rider/cancelled_orders', {
         headers: {
             "X-Requested-With": 'XMLHttpRequest'
         }
     }).then(res => {
         cancelled_orders = res.data;
         //return html in form of array
       cancelled_markup = generateMarkup(cancelled_orders);
       orderTableBodyCancelled.innerHTML = cancelled_markup;
     }).catch(err => {
         console.log(err)
     })

  // prettier-ignore
  function renderItems(items) {
        let parsedItems = Object.values(items)
        return parsedItems.map((menuItem) => {
            return `
                <p>${ menuItem.info.vehicle_type }</p>
            `
        }).join('')
    }
    function renderParcel(items) {
        let parsedItems = Object.values(items)
        return parsedItems.map((menuItem) => {
            return `
                <div>Item Name: ${ menuItem.item1.item_name }</div>
                <div>Quantity:  ${ menuItem.item1.item_qty }</div>
                <div>Perishable:  ${ menuItem.item1.perishable_check }</div>
                <div>Weight:  ${ menuItem.item1.item_weight}</div>

                
            `
        }).join('')
    }


  // prettier-ignore
  function generateMarkup(orders) {
        return orders.map(order => {
            return `
                <tr>
    <td class="border px-4 py-2 text-green-900">
        <p><a class="link focus:outline-none text-green-600" href="/trackParcel/${ order.tracking_id }">${ order.tracking_id }</a></p>
        <div>${ renderItems(order.items) }</div>

</div>
    </td>
    <td class="border px-4 py-2">${ order.supplier_id.name }</td>
    <td class="border px-4 py-2">${ order.supplier_id.company_name }</td>
    <td class="border px-4 py-2">${ order.phone }</td>
    <td class="border px-4 py-2">${ order.pickup_address }</td>
    <td class="border px-4 py-2">${ order.dropoff_address }</td>
    <td class="border px-4 py-2">
        <div class="inline-block relative w-64">
            <form action="/rider/order/status" method="POST">
                <input type="hidden" name="order_id" value="${ order._id }">
                <select name="status" onchange="this.form.submit()" 
                class="block appearance-none w-full bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline">
                    <option value="confirmed" ${ order.status==='confirmed' ? 'selected' : '' }>
                        Confirmed</option>
                    <option value="vehicle_ready" ${ order.status==='vehicle_ready' ? 'selected' : '' }>
                        Out for delivery</option>
                    <option value="arriving" ${ order.status==='arriving' ? 'selected' : '' }>
                        Arriving at pickup point</option>
                    <option value="pickup_point" ${ order.status==='pickup_point' ? 'selected' : '' }>
                        Loading</option>
                    <option value="shipping" ${ order.status==='shipping' ? 'selected' : '' }>
                        Shipping</option>
                    <option value="delivered" ${ order.status==='delivered' ? 'selected' : '' }>
                        Delivered
                    </option>
                </select>
            </form>
            <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <svg class="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                </svg>
            </div>
        </div>
    </td>
    <td class="border px-4 py-2">
        ${ moment(order.createdAt).format('ddd MMM Do, hh:mm A') }
    </td>
</tr>

        `
        }).join('')
    }

  //Socket change this later
  socket.on('parcelDelivery', (order) => {
    new Noty({
      type: 'success',
      timeout: 1000,
      progressBar: false,
      text: 'New Delivery added!',
      progressBar: false,
    }).show();
    orders.unshift(order);
    orderTableBody.innerHTML = '';
    orderTableBody.innerHTML = generateMarkup(orders);
  });
}