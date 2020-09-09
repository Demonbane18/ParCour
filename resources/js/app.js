import axios from 'axios'

console.log('hello from app.js')
document.addEventListener('DOMContentLoaded', () => {
    let addToParcel = document.querySelectorAll('#add-to-parcel')

    function updateParcel(parcel) {
        axios.post('/update-parcel', parcel).then(res => {
            console.log(res)
        })
    }

    addToParcel.forEach((btn) => {
        btn.addEventListener('click', (e) => {
            let parcel = JSON.parse(btn.dataset.parcel)
            // console.log(parcel)
            updateParcel(parcel)
        })
    })

})