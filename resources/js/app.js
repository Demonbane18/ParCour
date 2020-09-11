import axios from 'axios';
import Noty from 'noty';

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

    addToParcel.forEach((btn) => {
        btn.addEventListener('click', (e) => {
            let parcel = JSON.parse(btn.dataset.parcel);
            // console.log(parcel)
            updateParcel(parcel);
        });
    });
});