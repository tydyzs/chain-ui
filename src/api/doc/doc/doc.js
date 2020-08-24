import {getToken} from '@/utils/auth';
import website from '@/config/website';
import {Base64} from 'js-base64';
import axios from 'axios'
import request from '@/utils/request'
import defaultSettings from '@/settings'

//获取文档列表数据
export const getList = (current, size, params) => {
  return request({
    url: '/git-doc/query_doc',
    method: 'get',
    params: {
      ...params,
      current,
      size,
    }
  })
}
//获取文档分类下拉选数据
export const getDocType = () => {
  return request({
    url: '/git-system/dict/dictionary?code=docCatalog',
    method: 'get',
  })
}

/*删除文件*/
export const remove = (docId, docTypeName,docName) => {
  return request({
    url: '/git-doc/delete_doc',
    method: 'post',
    params: {
      docId,
      docTypeName,
      docName,
    }
  })
}
/*发布/取消发布*/
export const isReleases = (docId,isRelease) => {
  return request({
    url: '/git-doc/isReleases',
    method: 'post',
    params: {
      "id": docId,
      "isRelease":isRelease,
    }
  })
}
/*文件下载*/
export const dowmdoc = (docTypeName,docName) => {
  var dowmUrl=defaultSettings.baseUrl+"/git-doc/download"
    +"?docName="+encodeURI(docName)+"&docTypeName="+encodeURI(docTypeName)
  ;
  window.open(dowmUrl);
}
/*文件预览*/
export const preview = async (docTypeName, docName, docSuffix) => {
  let is_switch = 1;//0(无需转换pdf预览的文件，1需要转换）
  let not_switch_file = ['pdf'];//无需转换的文件类型
  if (not_switch_file.indexOf(docSuffix) != -1) {
    is_switch = 0;
  }
  var viewUrl=defaultSettings.baseUrl+"/git-doc/preview"+
    "?docName=" + encodeURI(docName)  + "&docTypeName=" + encodeURI(docTypeName) + "&is_switch=" + is_switch;
    window.open(viewUrl);
}
/*发布后新增发布通知*/
export const addNotice = (content) => {
  let date = new Date();
  let y = date.getFullYear();
  let MM = date.getMonth() + 1;
  MM = MM < 10 ? ('0' + MM) : MM;
  let d = date.getDate();
  d = d < 10 ? ('0' + d) : d;
  let h = date.getHours();
  h = h < 10 ? ('0' + h) : h;
  let m = date.getMinutes();
  m = m < 10 ? ('0' + m) : m;
  let s = date.getSeconds();
  s = s < 10 ? ('0' + s) : s;
  let currentdate=y + '-' + MM + '-' + d;
  let row = {
    title: "文档发布通知",
    category: "1",
    releaseTimeRange: "",
    releaseTime: currentdate,
    content: "<p>"+content+"</p>"
  };
  return request({
    url: '/git-desk/notice/submit',
    method: 'post',
    data: row
  })

}

/*elmen上传*/
export const elmen_upload = (file,obj) => {
  const param = new FormData();
  param.append("file", file);
  var uploadUrl="/git-doc/uploadSing?docTypeCode="+obj.form.docTypeData.dictKey+"&docTypeName="+encodeURI(obj.form.docTypeData.dictValue)+"&docAuth=1";
  request({
    url: uploadUrl,
    method: 'post',
    params: param,
    data: param
  }).then(res => {
    obj.onLoad(obj.page);
    obj.$message.success(res.data.msg);
    obj.fileListDel();
    console.log(res);
  });
  return true;//false不会自动上传
}
