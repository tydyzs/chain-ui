var getListData = function (val) {

  let dataArray = [

  ];
  val.forEach(function (item) {
    item.label = item.dictValue

  })

  val.forEach(function (data) {

    let id = data.id;

    if (id == '431573451080582005') {
      let objTemp = {
        id: data.id,
        parentId: data.parentId,
        code: data.code,
        codeCn: data.codeCn,
        dictKey: data.dictKey,
        dictValue: data.dictValue,
        sort: data.sort,
        remark: data.remark,
        isDeleted: data.isDeleted,
        label: data.label,
        children: []
      }
      dataArray.push(objTemp);
    }
  })

 data2treeDG(val, dataArray)

  return dataArray

}
var data2treeDG = function (datas, dataArray) {

  for (let j = 0; j < dataArray.length; j++) {
    var dataArrayIndex = dataArray[j];
    var childrenArray = [];
    let Id = dataArrayIndex.id;
    for (let i = 0; i < datas.length; i++) {
      let data = datas[i];

      let parentId = data.parentId;
      if (parentId == Id) {//判断是否为儿子节点
        let objTemp = {
          id: data.id,
          parentId: data.parentId,
          code: data.code,
          codeCn: data.codeCn,
          dictKey: data.dictKey,
          dictValue: data.dictValue,
          sort: data.sort,
          remark: data.remark,
          isDeleted: data.isDeleted,
          label: data.label
        }
        childrenArray.push(objTemp);

      }
    }
    dataArrayIndex.children = childrenArray;
    if (childrenArray.length > 0) {//有儿子节点则递归
      data2treeDG(datas, childrenArray)
    }
  }
  return childrenArray
}



export {
  getListData
}
