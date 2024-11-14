export default {
    getNumberFormatted(val) {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
}