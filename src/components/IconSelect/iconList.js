import {TypeUtil} from "@/utils/TypeUtil";

const iconData = [
     // 前面为源码中在线加载的字体图标，后面为本地资源加载的字体图标
    // "iconfont icon-zhongyingwen",
    "iconfont iconicon_zhongyingwenqiehuan", // 自己新增的内容，上面为源代码
    // "iconfont icon-caidan",
    "iconfont iconicon-caidan", // 自己新增的内容，上面为源代码
    // "iconfont icon-rizhi1",
    "iconfont iconorder", // 自己新增的内容，上面为源代码
    // "iconfont icon-zhuti",
    "iconfont iconzhuti", // 自己新增的内容，上面为源代码
    // "iconfont icon-suoping",
    "iconfont iconsuoping", // 自己新增的内容，上面为源代码
    // "iconfont icon-bug",
    "iconfont iconbug", // 自己新增的内容，上面为源代码
    // "iconfont icon-qq1",
    "iconfont iconqq", // 自己新增的内容，上面为源代码
    // "iconfont icon-weixin1",
    "iconfont iconweixin", // 自己新增的内容，上面为源代码
    // "iconfont icon-shouji",
    "iconfont iconshouji", // 自己新增的内容，上面为源代码
    // "iconfont icon-mima",
    "iconfont iconmima", // 自己新增的内容，上面为源代码
    // "iconfont icon-yonghu",
    "iconfont iconyonghu", // 自己新增的内容，上面为源代码
    // "iconfont icon-yanzhengma",
    "iconfont iconyanzhengma", // 自己新增的内容，上面为源代码
    // "iconfont icon-canshu",
    "iconfont iconcanshu1", // 自己新增的内容，上面为源代码
    // "iconfont icon-dongtai",
    "iconfont icondongtai", // 自己新增的内容，上面为源代码
    // "iconfont icon-iconset0265",
    "iconfont iconiconset", // 自己新增的内容，上面为源代码
    // "iconfont icon-shujuzhanshi2",
    "iconfont iconshujuzhanshi", // 自己新增的内容，上面为源代码
    // "iconfont icon-tuichuquanping",
    "iconfont tuichuquanping", // 自己新增的内容，上面为源代码
    // "iconfont icon-rizhi",
    "iconfont iconri_zhi", // iconri_zhi
    // "iconfont icon-cuowutishitubiao",
    "iconfont iconcuowutishitubiao", // 自己新增的内容，上面为源代码
    // "iconfont icon-debug",
    "iconfont icondebug", // 自己新增的内容，上面为源代码
    // "iconfont icon-iconset0216",
    "iconfont iconiconset1", // 自己新增的内容，上面为源代码
    // "iconfont icon-quanxian",
    "iconfont iconquanxian1", // 自己新增的内容，上面为源代码
    // "iconfont icon-shuaxin",
    "iconfont iconshuaxin", // 自己新增的内容，上面为源代码
    // "iconfont icon-bofangqi-suoping",
    "iconfont iconbofangqi-suoping", // 自己新增的内容，上面为源代码
    // "iconfont icon-quanping",
    "iconfont iconquanping", // 自己新增的内容，上面为源代码
    // "iconfont icon-navicon",
    "iconfont iconnavicon", // 自己新增的内容，上面为源代码
    // "iconfont icon-biaodan",
    "iconfont iconbiaodan", // 自己新增的内容，上面为源代码
    // "iconfont icon-liuliangyunpingtaitubiao08",
    "iconfont iconliuliangyunpingtaitubiao01", // 自己新增的内容，上面为源代码
    // "iconfont icon-caidanguanli",
    "iconfont iconcaidanguanli", // 自己新增的内容，上面为源代码
    // "iconfont icon-cuowu",
    "iconfont iconcuowu", // 自己新增的内容，上面为源代码
    // "iconfont icon-wxbgongju",
    "iconfont iconwxbgongju", // 自己新增的内容，上面为源代码
    // "iconfont icon-tuichu",
    "iconfont icontuichu", // 自己新增的内容，上面为源代码
    // "iconfont icon-daohanglanmoshi02",
    "iconfont icondaohanglanmoshi", // 自己新增的内容，上面为源代码
    // "iconfont icon-changyonglogo27",
    "iconfont iconchangyonglogo", // 自己新增的内容，上面为源代码
    // "iconfont icon-biaoge",
    "iconfont iconbiaoge", // 自己新增的内容，上面为源代码
    // "iconfont icon-baidu1",
    "iconfont iconbaidu", // 自己新增的内容，上面为源代码
    // "iconfont icon-tubiao",
    "iconfont icontubiao", // 自己新增的内容，上面为源代码
    // "iconfont icon-souhu",
    "iconfont iconsouhu", // 自己新增的内容，上面为源代码
    // "iconfont icon-msnui-360",
    "iconfont iconmsnui-", // 自己新增的内容，上面为源代码
    // "iconfont icon-iframe",
    "iconfont iconiframe", // 自己新增的内容，上面为源代码
    // "iconfont icon-huanyingye",
    "iconfont iconhuanyingye", // 自己新增的内容，上面为源代码
    // "iconfont icon-zhuangtaixiugai"
    "iconfont iconzhuangtaixiugai", // 自己新增的内容，上面为源代码
    // 此处的字体图标名称，需要在数据库中进行同步修改才能生效
    // 被注释掉的代码为源代码，下面一行代码为 自己添加的代码
    "iconfont iconicon_roundadd",
    "iconfont iconicon_compile",
    "iconfont iconicon_glass",
    "iconfont iconicon_roundclose",
    "iconfont iconicon_roundreduce",
    // "iconfont iconicon_delete",
    "iconfont iconshanchu", // 自己新增的内容，上面为源代码
    "iconfont iconicon_shakehands",
    "iconfont iconicon_task_done",
    "iconfont iconicon_voipphone",
    // "iconfont iconicon_safety",
    "iconfont iconicon_safetycode", // 自己新增的内容，上面为源代码
    "iconfont iconicon_work",
    "iconfont iconicon_study",
    // "iconfont iconicon_task",
    "iconfont iconicon_task_done", // 自己新增的内容，上面为源代码
    // "iconfont iconicon_subordinate",
    "iconfont iconsubordinate", // 自己新增的内容，上面为源代码
    // "iconfont iconicon_star",
    "iconfont iconstare", // 自己新增的内容，上面为源代码
    // "iconfont iconicon_setting",
    "iconfont iconsetting", // 自己新增的内容，上面为源代码
    "iconfont iconicon_sms",
    "iconfont iconicon_share",
    "iconfont iconicon_secret",
    "iconfont iconicon_scan_namecard",
    "iconfont iconicon_principal",
    "iconfont iconicon_group",
    "iconfont iconicon_send",
    "iconfont iconicon_scan",
    // "iconfont iconicon_search",
    "iconfont iconicon-search", // 自己新增的内容，上面为源代码
    "iconfont iconicon_refresh",
    "iconfont iconicon_savememo",
    "iconfont iconicon_QRcode",
    "iconfont iconicon_im_keyboard",
    "iconfont iconicon_redpacket",
    "iconfont iconicon_photo",
    // "iconfont iconicon_qq",
    "iconfont iconicon-qq", // 自己新增的内容，上面为源代码
    // "iconfont iconicon_wechat",
    "iconfont iconwechat", // 自己新增的内容，上面为源代码
    "iconfont iconicon_phone",
    "iconfont iconicon_namecard",
    "iconfont iconicon_notice",
    "iconfont iconicon_next_arrow",
    // "iconfont iconicon_left",
    "iconfont iconleft", // 自己新增的内容，上面为源代码
    // "iconfont iconicon_more",
    "iconfont iconicon_", // 自己新增的内容，上面为源代码
    // "iconfont iconicon_details",
    "iconfont iconinfo", // 自己新增的内容，上面为源代码
    "iconfont iconicon_message",
    // "iconfont iconicon_mobilephone",
    "iconfont iconicon_mobilephonecopy", // 自己新增的内容，上面为源代码
    "iconfont iconicon_im_voice",
    "iconfont iconicon_GPS",
    "iconfont iconicon_ding",
    "iconfont iconicon_exchange",
    "iconfont iconicon_cspace",
    "iconfont iconicon_doc",
    "iconfont iconicon_dispose",
    "iconfont iconicon_discovery",
    "iconfont iconicon_community_line",
    "iconfont iconicon_cloud_history",
    "iconfont iconicon_coinpurse_line",
    "iconfont iconicon_airplay",
    "iconfont iconicon_at",
    // "iconfont iconicon_addressbook",
    "iconfont iconaddress-book", // 自己新增的内容，上面为源代码
    "iconfont iconicon_boss",
    "iconfont iconicon_addperson",
    "iconfont iconicon_affiliations_li",
    "iconfont iconicon_addmessage",
    "iconfont iconicon_addresslist",
    // "iconfont iconicon_add",
    "iconfont iconadd", // 自己新增的内容，上面为源代码
    // "iconfont icongithub",
    "iconfont iconicongithub", // 自己新增的内容，上面为源代码
    // "iconfont icongitee2",
    "iconfont icongitee", // icongitee

    //2019.10.12 新增
    "iconfont iconshangpinzhongshu",
    "iconfont icondaikuanxiane",
    "iconfont iconchanpin",
    "iconfont iconzibenshili",
    "iconfont iconcanshu",
    "iconfont iconzhengce",
    "iconfont iconquanxian",
    "iconfont iconwenjianjia",
    "iconfont iconziyuan1",
    "iconfont iconeduguanli",
    "iconfont iconzhongzhi",
    "iconfont iconquancun",
    "iconfont icondongjiejine",
    "iconfont iconduiwaidanbao",
    "iconfont icondisanfangdanbao",
    "iconfont iconjiekou",
    "iconfont iconzhongduanshenqing",
    "iconfont iconnavicon-fwpzpz",
    "iconfont iconjiaoyijilu",
    "iconfont iconkehufuwu",
    "iconfont iconziyuan",
    "iconfont iconkehuguanli",
    "iconfont iconnavicon-grkh",
    "iconfont iconshitumoshi",
    "iconfont iconjituankehuguanli",
    "iconfont iconyujing2",
    "iconfont iconfenxi1",
    "iconfont icontaizhangguanli",
    "iconfont iconweb-icon-",
    "iconfont iconwinfo-icon-yaosuguanli"
  ];

const add = function (list, item) {
    let arr = [];
    if (item && TypeUtil.isArray(item)) {
        arr = list.concat(item);
    } else if (item && TypeUtil.isString(item)) {
        arr = arr.concat(list);
        arr.push(item);
    }
    return arr;
};

const remove = function (list, item) {
    if (item && TypeUtil.isArray(item)) {
        for (let i = 0; i < item.length; i++) {
            for (let j = 0; j < list.length; j++) {
                if (list[j] === item[i]) {
                    list.splice(j, 1);
                    j--;
                }
            }
        }
    } else if (item && TypeUtil.isString(item)) {
        list = list.filter(function (i) {
            return i !== item;
        })
    }
    return list;
};

const iconList = {
    list: [],
    /**
     * 全局添加图标
     * @param item
     */
    addIcon: function (item) {
        this.list = add(this.list, item);
    },
    /**
     * 全局删除
     * @param item
     */
    removeIcon: function (item) {
        this.list = remove(this.list, item);
    }
};

export {iconData}
export default iconList
