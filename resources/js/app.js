let addParcel = document.querySelectorAll("class", "vehicle-select");


addParcel.forEach((btn) => {
    btn.addEventlistener('click', (e) => {
        console.log(e);
    })
})