class JsDictionary {
    constructor(defaultFiller){
        this.defaultFiller = defaultFiller || []
        // [["key1", "valu1"],["key2", "value2"]]
    }

    set(key, value){
        const __mutatedMap = this.defaultFiller.push([key, value])
        return __mutatedMap
    }

    get(){

    }

    delete(key){
        const __indexofKeyToDelete = this.defaultFiller.findIndex( e => e[0] === key )
        const __mutatedMap = this.defaultFiller.splice(__indexofKeyToDelete, 1)
        return __mutatedMap
    }

}

export default new JsDictionary([])