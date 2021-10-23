const mainElement = document.getElementsByClassName("complaints");
const filterButton = document.getElementById("filterbtn");
const checking = () => {
    console.log(mainElement)
    mainElement[0].innerHTML = "aksjdhadkjhsakjdhsakjhd";
}
filterButton.addEventListener("click",checking);