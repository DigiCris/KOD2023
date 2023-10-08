// Function that will be called when the user clicks on a pagination button
// The function will be passed the page number and the movements array as a parameters and will update the state of the component
// Pagination made from 7 elements per page

export default function paginationController(array, pageNumber) {
    const quantityPerPage = 7;
    const end = quantityPerPage * pageNumber;
    const start = end - quantityPerPage;
    const paginatedArray = array.slice(start, end);
    return paginatedArray;
}
