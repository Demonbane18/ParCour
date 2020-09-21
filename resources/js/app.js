import axios from 'axios';
import Noty from 'noty';
import moment from 'moment';
import * as Swal from 'sweetalert2';

//prettier-ignore
import {
    initSP
} from './service_provider';S


console.log('hello from app.js');
document.addEventListener('DOMContentLoaded', () => {
    let addToParcel = document.querySelectorAll('#add-to-parcel');
    let parcelCounter = document.querySelector('#parcelCounter');
    
    function updateParcel(parcel) {
        axios.post('/update-parcel', parcel).then((res) => {
            console.log(res);
            parcelCounter.innerText = res.data.total_qty;
            new Noty({
                type: 'success',
                timeout: 1000,
                progressBar: false,
                text: 'New parcel added to orders'

            }).show();
        }).catch(err => {
            new Noty({
                type: 'error',
                timeout: 1000,
                progressBar: false,
                text: 'Something went wrong'

            }).show();
        });
    }
    //parcel vehicle
    addToParcel.forEach((btn) => {
        btn.addEventListener('click', (e) => {
            let parcel = JSON.parse(btn.dataset.parcel);
            // console.log(parcel)
            updateParcel(parcel);
        });
    });

    // Remove alert message after X seconds 
    const alertMsg = document.querySelector('#success-alert')
    if (alertMsg) {
        setTimeout(() => {
            alertMsg.remove()
        }, 2000)
    }
    
    
    //Change parcel order status
    let statuses = document.querySelectorAll('.status_line')
    let hiddenInput = document.querySelector('#hiddenInput')
    let order = hiddenInput ? hiddenInput.value : null
    order = JSON.parse(order)
    let time = document.createElement('small')

    function updateStatus(order) {
        statuses.forEach((status) => {
            status.classList.remove('step-completed')
            status.classList.remove('current')
        })
        let stepCompleted = true;
        statuses.forEach((status) => {
            let dataProp = status.dataset.status
            if (stepCompleted) {
                status.classList.add('step-completed')
            }
            if (dataProp === order.status) {
                stepCompleted = false
                time.innerText = moment(order.updatedAt).format('hh:mm A')
                status.appendChild(time)
                if (status.nextElementSibling) {
                    status.nextElementSibling.classList.add('current')
                }
            }
        })

    }
    updateStatus(order);

    // Socket
    let socket = io();
    initSP(socket)
    //Join
    if(order) {
        socket.emit('join', `order_${order._id}`)
    //  order_id_key create room
    }
    let spAreaPath = window.location.pathname
    console.log(spAreaPath)
    if(spAreaPath.includes('service_provider')) {
        socket.emit('join', 'spRoom')
    }

    socket.on('parcelUpdated', (data) => {
        const updatedParcel = {...order }
        updatedParcel.updatedAt = moment().format()
        updatedParcel.status = data.status
        updateStatus(updatedParcel)
        new Noty({
            type: 'success',
            timeout: 1000,
            progressBar: false,
            text: 'Parcel updated',
            progressBar: false

        }).show();
    })

    
});

