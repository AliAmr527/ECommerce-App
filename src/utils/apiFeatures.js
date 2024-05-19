export class apiFeatures {
    constructor(mongooseQuery, queryData) {
        this.mongooseQuery = mongooseQuery
        this.queryData = queryData
    }

    //to divide the products into pages
    pagination = () => {//http://localhost:5000/product/getProducts?page=2&size=5
        let page = this.queryData.page
        let size = this.queryData.size
        if (page <= 0 || !page) { page = 1 }
        if (size <= 0 || !size) { size = 5 } //limit = size
        const skip = size * (page - 1) // how many document will be skipped within the collection
        this.mongooseQuery.skip(skip).limit(size)
        return this
    }

    //to fiter the items based on price, name etc...
    filter = () => {//http://localhost:5000/product/getProducts?price[gte]=100
        const exclude = ["sort", "page", "size", "fields", "searchKey"] //creates a constant without page or sort etc to be able to find with in collection
        let queryFields = { ...this.queryData }
        exclude.forEach(ele => {
            delete queryFields[ele]
        })
        queryFields = JSON.stringify(queryFields).replace(/lte|lt|gte|gt/g, (match) => {
            return `$${match}`
        })
        queryFields = JSON.parse(queryFields)
        this.mongooseQuery.find(queryFields)
        return this
    }

    //to find according to a specific search
    search = () => {//http://localhost:5000/product/getProducts?searchKey=1st
        if (this.queryData.searchKey!=undefined) {
            this.mongooseQuery.find({
                $or: [
                    { name: { $regex: `${this.queryData.searchKey}` } }, { description: { $regex: `${this.queryData.searchKey}` } }
                ]
            })
            return this
        }
        return this
    }

    //to sort ascendingly ex:sort=price to sort desc ex:sort=-price to add to two things ex:sort=price,sort
    sort = ()=>{//http://localhost:5000/product/getProducts?sort=name
        this.mongooseQuery.sort(this.queryData.sort?.replace(/,/g, " "))
        return this
    }

    //to select only a few fields to be visible during get this way is used to be able to write multiple selects
    select = ()=>{//http://localhost:5000/product/getProducts?fields=name
        this.mongooseQuery.select(this.queryData.fields?.replace(/,/g, " "))
        return this
    }

    numberOfProducts = () => {
        const exclude = ["sort", "page", "size", "fields", "searchKey"] //creates a constant without page or sort etc to be able to find with in collection
        let queryFields = { ...this.queryData }
        exclude.forEach(ele => {
            delete queryFields[ele]
        })
        queryFields = JSON.stringify(queryFields).replace(/lte|lt|gte|gt/g, (match) => {
            return `$${match}`
        })

        queryFields = JSON.parse(queryFields)
        this.mongooseQuery.find(queryFields).count()
        this.mongooseQuery.find({ $or: [{ name: { $regex: this.queryData.searchKey || " " } }, { description: { $regex: this.queryData.searchKey || " "} }] }).count()
        return this
    }
}

// export const numberOfPages = (mongooseQuery, queryData)=>{
//     const productCount = mongooseQuery.count()
//     //console.log({queryData:queryData.size})
//     return  {numberOfPages: Math.ceil(productCount / queryData.size),productCount:productCount}
// }