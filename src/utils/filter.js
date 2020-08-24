// 过滤器定制

const dictionary = (name, val) => {
  var rangeCountry_dictionary = ['036','702','156','410','392','826','840','608']
  var currency_dictionary = ['36','756','156','344','392','752','702','826','840','959','978']

  var dictionaryArr = eval(name + '_dictionary')

  var needDate = []
  if(dictionaryArr.length>0){
    needDate = val.filter(item => {
      return dictionaryArr.indexOf(item.dictKey) !== -1
    })
  }else{
    needDate=val
  }
if(name==='rangeIndustry'){

  getListData(val)

}
  return needDate

}

export {
  dictionary
}
