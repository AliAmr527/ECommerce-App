export const paginate = (page,size)=>{
    if (page <= 0 || !page) {page = 1} 
    if (size <= 0 || !size) {size = 5} //limit = size
    const skip = size * (page - 1) // how many document will be skipped within the collection
    return {skip:skip,limit:size}
    //say for example size is 3 and page is 2 so (3*(2-1)) is 3 so i will skip products 1 2 3 and show products 4 5 6
}
