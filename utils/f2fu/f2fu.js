class F2fu {
    targetSet
    mySet
    unionSet
    intersectSet

    constructor(targetLists,yourList){
        this.targetSet = new Set()
        for(let targetList of targetLists.values()){
            for(let value of targetList.values()){
                this.targetSet.add(value)
            }
        }
        this.mySet = new Set(yourList)
        this.unionSet = new Set([...this.targetSet,...this.mySet])
        this.intersectSet = new Set([...this.targetSet].filter( x => this.mySet.has(x) ))
    }

    calcJSC(){
        return this.intersectSet.size/this.unionSet.size
    }

    getAddition(){
        return [...this.mySet].filter(x => !this.targetSet.has(x))
    }

    static formateLocalData(rawlist){ //格式化微信小程序api借口获得的数据
        let formated = new Set()
        for(let value of rawlist.values()){
            formated.add(value.BSSID)
        }
        return [...formated]
    }

    static formateServerData(rawlists){ //格式化服务器发送来的数据,为减少服务器负担，服务器对数据不做任何处理
        let formated = []
        for(let i in rawlists){
            formated.push(JSON.parse(rawlists[i]['wifilist']))
        }
        return formated
    }

    static say(){
      console.log("helloworld")
    }

}
export {F2fu}