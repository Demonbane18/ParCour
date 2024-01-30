import axios from 'axios';
import Noty from 'noty';
import moment from 'moment';

//prettier-ignore
import {
    initSP
}
from './service_provider';
import {
    initR
}
from './rider';

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
                timeout: 3000,
                progressBar: false,
                text: 'New parcel added to orders',
                afterClose: setTimeout(window.location.href='/parcel',5000)

            }).show();
        }).catch(err => {
            new Noty({
                type: 'error',
                timeout: 3000,
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
            alertMsg.remove();
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
                time.innerText = moment(order.updatedAt).format('ddd MMM Do, hh:mm A')
                status.appendChild(time)
                if (status.nextElementSibling) {
                    status.nextElementSibling.classList.add('current')
                }
            }
        })

    }
    updateStatus(order);

        let socket = io();
        initSP(socket)
        initR(socket)
    
    //Join
    if(order) {
        socket.emit('join', `order_${order._id}`)
    //  order_id_key create room
    }
    let areaPath = window.location.pathname
    console.log(areaPath)
    if(areaPath.includes('service_provider')) {
        
        socket.emit('join', 'spRoom')
    }
    if(areaPath.includes('rider')) {
        
        socket.emit('join', 'rRoom')
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

    //delete category dialog box
    let deleteCategory = document.querySelectorAll('#deleteCategory');
    deleteCategory.forEach((btn) => {
        btn.addEventListener('click', (e) => {
            let parcel = JSON.parse(btn.dataset.delete);
            console.log(parcel)
            sweetalert(parcel);
        });
    });

    function sweetalert(parcel) {
        Swal.fire({
                title: 'Are you sure?',
                text: "You won't be able to revert this!",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Yes, delete it'
            }).then((result) => {
                    if (result.isConfirmed) {
                        Swal.fire({
                            timer: 1000,
                            showConfirmButton: false,
                            title: 'Category Deleted',
                            text: 'This category has been successfully deleted!',
                            type: 'success',
                            icon: 'success'
                        })
                        setTimeout(() => {
                            document.location.href = "/service_provider/delete_category/" + parcel._id;
                        }, 1500)


            }
            })
            }

             //add dashes automatically on the track number
             const track = document.getElementById('track');

             track.addEventListener("keydown", (e) => {
                         if (e.key === "Backspace" || e.key === "Delete") return;
                         if (e.target.value.length === 4) {
                             track.value = track.value + "-";
                         }
                         if (e.target.value.length === 11) {
                             track.value = track.value + "-";
                 }
             })


});

