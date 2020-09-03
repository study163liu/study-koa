const Koa = require('koa');
const app = new Koa();
const router = require('koa-router')()
const bodyParser = require('koa-bodyparser')
const static = require('koa-static')
const axios = require('axios');
const fs = require('fs');
const WXBizDataCrypt = require('./static/js/WXBizDataCrypt');

// 请自行填入总结的小程序信息
const appId = 'xxxx';
const secret = 'xxxxx';

// 示例暂时储存用户数据
const userDataMap = {};

const todos = {};

app.use(static('./static'));

app.use(bodyParser())

// 登录，获取session_key
router.post('/login', async (ctx, next) => {
  const rb = ctx.request.body
  console.log('login request', rb);
  const { code } = rb;
  if(code){
    const url = 'https://api.weixin.qq.com/sns/jscode2session';
    const res = await axios({
      url,
      method: 'GET',
      params: {
        appid: appId,
        secret,
        js_code: code,
        grant_type: 'authorization_code'
      },
    })
    if(res.data && res.data.session_key){
      console.log('jscode2session res', res.data);
      const {openid, session_key} = res.data;
      let userInfo = null;
      if(!userDataMap[openid]){
        console.log('Register user', openid);
        userDataMap[openid] = {
          session_key,
        };
      }else{
        const userData = userDataMap[openid];
        userData.session_key = session_key;
        if(userData.userInfo){
          userInfo = userDataMap[openid].userInfo;
        }
      }
      ctx.response.body = {
        code: 0,
        msg: 'success',
        data: {
          uid: res.data.openid,
          userInfo
        }
      }
    }else{
      ctx.response.body = {
        code: 500,
        msg: 'login failed',
      }
    }
  }else{
    ctx.status = 400;
  }
})

// mock数据，返回书籍列表
router.get('/book', async (ctx) => {
  ctx.response.body = {
    "msg": "成功",
    "code": 0,
    "data": [{
      "book": {
        "bookId": "5532285956340017098",
        "uuid": "c79b852c380f48e8ac57794495483f00_4",
        "title": "挪威的森林",
        "seoTitle": "村上春树 村上春树 村上春树 村上春树",
        "description": "《挪威的森林》是日本作家村上春树所著的一部长篇爱情小说，影响了几代读者的青春名作。故事讲述主角渡边纠缠在情绪不稳定且患有精神疾病的直子和开朗活泼的小林绿子之间，苦闷彷徨，最终展开了自我救赎和成长的旅程。\n\n彻头彻尾的现实笔法，描绘了逝去的青春风景，小说中弥散着特有的感伤和孤独气氛。自1987年在日本问世后，该小说在年轻人中引起共鸣，风靡不息。上海译文出版社于2018年2月，推出该书的全新纪念版。",
        "imageUrl": "https://easyreadfs.nosdn.127.net/27aTZEqoYEf7oqLnPqQ7kg==/8796093024647124849",
        "catalogKey": "s5_nNCucGeg1Wnwk0xNhqg==/8796093024836256995",
        "wordCount": 209894,
        "isbn": "9787532776771",
        "publishTime": 1519833600000,
        "publisher": "上海译文出版社",
        "completeStatus": 1,
        "bookType": 0,
        "pages": 0,
        "pack": "",
        "texture": "",
        "format": "",
        "costCoins": 2500,
        "productId": 0,
        "skuId": "",
        "eBookStatus": 0,
        "vipBook": false
      },
      "recommend": "20多岁时，成长是痛，不成长是不幸。",
      "maleCount": 687,
      "femaleCount": 758,
      "recommendBookId": 5001,
      "authors": [{
        "authorId": 8314,
        "name": "【日】村上春树"
      }, {
        "authorId": 4687,
        "name": "林少华"
      }]
    }, {
      "book": {
        "bookId": "4706826294410004637",
        "uuid": "45820751d3134d5383ec5f7ebcad4c42_4",
        "title": "怦然心动",
        "seoTitle": "",
        "description": "本书是在网络获得极高赞誉的电影《怦然心动》的同名原著，描述了青春期中男孩女孩之间的有趣战争。\r\n\r\n朱莉安娜·贝克虔诚地相信三件事：树是圣洁的，特别是她最爱的无花果树；她在后院里饲养的鸡下的蛋是最卫生的；总有一天她会和布莱斯·罗斯基接吻。二年级时，在看到布莱斯蓝眼睛的那一瞬间，朱莉的心就被他击中了。不幸的是，布莱斯对她从来都没有感觉。而且，他认为朱莉有点怪，怎么会有人把养鸡和坐在树上看成乐趣呢？\r\n\r\n没想到，到了八年级，布莱斯开始觉得朱莉不同寻常的兴趣和对于家庭的自豪感使她显得很有魅力。而朱莉则开始觉得布莱斯漂亮的蓝眼睛也许和他本人一样，其实很空洞。毕竟，怎么会有人不把别人对树和鸡的感觉当回事呢……",
        "imageUrl": "https://easyreadfs.nosdn.127.net/7c4b3ccf0b7b41b0988d217de6e20cba_1565341461145.jpg",
        "catalogKey": "d9R6g8mMd_Ag3t_Q4AOUTg==/8796093024793488105",
        "wordCount": 99819,
        "isbn": "9787511318251",
        "publishTime": 0,
        "publisher": "中国华侨出版社",
        "completeStatus": 1,
        "bookType": 0,
        "pages": 0,
        "pack": "",
        "texture": "",
        "format": "",
        "costCoins": 700,
        "productId": 0,
        "skuId": "",
        "eBookStatus": 0,
        "vipBook": false
      },
      "recommend": "斯人若彩虹，遇上方知有。",
      "maleCount": 221,
      "femaleCount": 257,
      "recommendBookId": 6001,
      "authors": [{
        "authorId": 1380,
        "name": "【美】文德琳·范·德拉安南"
      }]
    }, {
      "book": {
        "bookId": "5532285956340017168",
        "uuid": "e674edc6412b445a984946be66ec0eca_4",
        "title": "且听风吟",
        "seoTitle": "村上春树 村上春树",
        "description": "本书是村上春树的处女作，与后来的《1973年的弹子球》《寻羊冒险记》合称“鼠的三部曲”，描写一个少男在街上“拣”到一个喝醉的少女，把她领回家里，两人发生了一些朦胧的情感，但最终少女还是选择了分手。书中透露出青春的感伤气息，也显示了作者独特的文字技法和文学观念。",
        "imageUrl": "https://easyreadfs.nosdn.127.net/e1LXpIbBnjgnSHgZ5_1o_w==/8796093024647143027",
        "catalogKey": "14m7EQskP2_hPW8OE6ectA==/8796093024806440693",
        "wordCount": 45858,
        "isbn": "9787532777631",
        "publishTime": 1527782400000,
        "publisher": "上海译文出版社",
        "completeStatus": 1,
        "bookType": 0,
        "pages": 0,
        "pack": "",
        "texture": "",
        "format": "",
        "costCoins": 1900,
        "productId": 0,
        "skuId": "",
        "eBookStatus": 0,
        "vipBook": false
      },
      "recommend": "21岁时的偶遇，再也不遇。",
      "maleCount": 263,
      "femaleCount": 316,
      "recommendBookId": 4008,
      "authors": [{
        "authorId": 8314,
        "name": "【日】村上春树"
      }, {
        "authorId": 4687,
        "name": "林少华"
      }]
    }, {
      "book": {
        "bookId": "4707335048700006198",
        "uuid": "bb8c2c7adced47f986360741180be527_4",
        "title": "你今天真好看",
        "seoTitle": "漫画漫画漫画",
        "description": "妹子们都说《你今天真好看》超性感耶！比《秘密花园》更解压。 \r\n\r\n辛普森动画组漫画家莉兹·克里莫首部作品集。收录了莉兹·克里莫150多张逗趣漫画。\r\n\r\n书中集结了所有你能想到的各种萌物，恐龙、棕熊、兔子、企鹅，甚至还有伞蜥、獾、土拨鼠、狐獴……\r\n\r\n在诙谐的对话中，它们展现出一种与生俱来的幽默感和令人艳羡的生活情趣。 你可能是书中任何一个动物，而书中的动物可能是你身边的任何一个人。 \r\n\r\n谁不曾享受过与父母的温情一刻？ 谁没有被朋友的玩笑弄得一时语塞？ 谁不会因自己反应慢半拍而哭笑不得？ 这本书就是有这样的魔力让你不由自主地会心一笑。",
        "imageUrl": "https://easyreadfs.nosdn.127.net/1rYYTCKzWyTEL7U0UWI2Mg==/8796093023054669554",
        "catalogKey": "tvj68nrE-TYgTRY3GWCY8g==/8796093024677557925",
        "wordCount": 2401,
        "isbn": "9787201094359",
        "publishTime": 1438358400000,
        "publisher": "天津人民出版社",
        "completeStatus": 1,
        "bookType": 0,
        "pages": 0,
        "pack": "",
        "texture": "",
        "format": "",
        "costCoins": 1900,
        "productId": 0,
        "skuId": "",
        "eBookStatus": 0,
        "vipBook": false
      },
      "recommend": "听说没，妹子们都说这书超性感耶！",
      "maleCount": 265,
      "femaleCount": 345,
      "recommendBookId": 4009,
      "authors": [{
        "authorId": 4032,
        "name": "【美】莉兹·克里莫"
      }, {
        "authorId": 10017887,
        "name": "周高逸"
      }]
    }, {
      "book": {
        "bookId": "5538288909270000958",
        "uuid": "f4c4f5b283434557bd25e40ba05e4abb_4",
        "title": "舞！舞！舞！",
        "seoTitle": "村上春树 村上春树",
        "description": "本书是村上春树的长篇小说，以其独特风格的两条平行线展开。一条是主人公的同学五反田成了电影明星，但不得不忍受赞助人的各种“包装”，为此精神忧郁，杀死了一名电话应召女郎，最后驾车冲进大海自杀。\n\n另一条是主人公结识的一名孤独女孩，以及她的母亲、母亲的男友，这些人都天性善良，却总是生活在死亡阴影之下。作品对当代资本主义社会在繁荣表象下的不安全感作了深刻的描述。",
        "imageUrl": "https://easyreadfs.nosdn.127.net/OxayxiKZ1zl5ogAviAbQAw==/8796093024651393318",
        "catalogKey": "r3PKc_hia2uZILLMojzDcg==/8796093024769324691",
        "wordCount": 268460,
        "isbn": "9787532777600",
        "publishTime": 1527782400000,
        "publisher": "上海译文出版社",
        "completeStatus": 1,
        "bookType": 0,
        "pages": 0,
        "pack": "",
        "texture": "",
        "format": "",
        "costCoins": 3500,
        "productId": 0,
        "skuId": "",
        "eBookStatus": 0,
        "vipBook": false
      },
      "recommend": "本来就没有意义，跳吧，只要音乐没停，一直跳下去。",
      "maleCount": 67,
      "femaleCount": 93,
      "recommendBookId": 5002,
      "authors": [{
        "authorId": 8314,
        "name": "【日】村上春树"
      }, {
        "authorId": 4687,
        "name": "林少华"
      }]
    }, {
      "book": {
        "bookId": "4707007994760005746",
        "uuid": "b4e3f5fcf79646f981046ad711ceec30_4",
        "title": "岛上书店",
        "seoTitle": "",
        "description": "每个人的生命中，都有最艰难的那一年，将人生变得美好而辽阔。\n\nA.J.费克里，人近中年，在一座与世 隔绝的小岛上，经营一家书店。命运从未眷顾过他，爱妻去世，书店危机，就连唯一值钱的宝贝也遭窃。他的人生陷入僵局，他的内心沦为 荒 岛。\n\n就在此时，一个神秘的包袱出现在书店中，意外地拯救了陷于孤独 绝境中的A.J.，成为了连接他和小姨子伊斯梅、 警长兰比亚斯、出版社女业务员阿米莉娅之间的纽带，为他的生活带来了转机。\n\n没有谁是 一座孤岛，每本书都是一个世界 。小岛上的几个生命紧紧相依，走出了人生的困境，而所有对书和生活的热爱都周而复始，愈加汹涌。",
        "imageUrl": "https://easyreadfs.nosdn.127.net/v7AIPwRaAA5CCJvWD417tA==/8796093023069516813",
        "catalogKey": "--JfF82daxRDrinjmRJ4eg==/8796093024780944892",
        "wordCount": 105932,
        "isbn": "9787539971810",
        "publishTime": 1430409600000,
        "publisher": "江苏凤凰文艺出版社",
        "completeStatus": 1,
        "bookType": 0,
        "pages": 0,
        "pack": "",
        "texture": "",
        "format": "",
        "costCoins": 1700,
        "productId": 0,
        "skuId": "",
        "eBookStatus": 0,
        "vipBook": false
      },
      "recommend": "没有谁是一座孤岛，每本书都是一个世界。",
      "maleCount": 211,
      "femaleCount": 251,
      "recommendBookId": 5003,
      "authors": [{
        "authorId": 2878,
        "name": "【美】加·泽文"
      }, {
        "authorId": 10011643,
        "name": "孙仲旭"
      }, {
        "authorId": 10024710,
        "name": "李玉瑶"
      }]
    }, {
      "book": {
        "bookId": "5619453540530017385",
        "uuid": "1f3418ab276c430eb0f1073a14dd5b2b_4",
        "title": "世界尽头与冷酷仙境",
        "seoTitle": "村上春树 村上春树",
        "description": "本书是村上春树最典型的平行线长篇小说，其他平行线小说发展到后来，两条平行线会交汇到一起，本书的两条平行线始终不交汇，到书末也彼此无关，有如两本不同的书。\n\n一条平行线是“世界尽头”，那是个与世隔绝的村落，宁静而漂浮着百无聊赖的气息，居民没有心，没有目标，生活在死水一潭之中。一条平行线是“冷酷仙境”，两大黑社会组织争夺老科学家发明的控制人脑的装置，男主人公与老科学家及其孙女逃进地底，经过惊心动魄的遁逃才摆脱危险。作者试图通过这样的对比，表达现代人在人生选择上的困惑。",
        "imageUrl": "https://easyreadfs.nosdn.127.net/pnlhBdaIOADrPXVRggeiNw==/8796093024704387621",
        "catalogKey": "WqSzGTlBKfAc-4OewEzZzg==/8796093024777636076",
        "wordCount": 263587,
        "isbn": "9787532777624",
        "publishTime": 1527782400000,
        "publisher": "上海译文出版社",
        "completeStatus": 1,
        "bookType": 0,
        "pages": 0,
        "pack": "",
        "texture": "",
        "format": "",
        "costCoins": 2800,
        "productId": 0,
        "skuId": "",
        "eBookStatus": 0,
        "vipBook": false
      },
      "recommend": "电脑逐步统治世界，人只有靠爱与勇气脱困。",
      "maleCount": 224,
      "femaleCount": 262,
      "recommendBookId": 6002,
      "authors": [{
        "authorId": 8314,
        "name": "【日】村上春树"
      }, {
        "authorId": 4687,
        "name": "林少华"
      }]
    }]
  }
})

// 更新用户数据，下次登录直接返回
router.post('/userInfo', async (ctx) => {
  const rb = ctx.request.body;
  const rh = ctx.request.header;
  const { userInfo } = rb;
  const {uid} = rh;
  console.log('update userInfo', uid, userInfo);
  if(userInfo && uid){
    userDataMap[uid].userInfo = userInfo;
    ctx.response.body = {
      code: 0,
      msg: 'success',
      data: {
        uid,
        userInfo
      },
    }
  }else{
    ctx.status = 400;
  }
})

// 解密数据
router.post('/decrypt', async ctx => {
  const rb = ctx.request.body
  const rh = ctx.request.header;
  console.log('descrypt request', rb);
  const {uid} = rh;
  const {encryptedData, iv} = rb;
  const pc = new WXBizDataCrypt(appId, userDataMap[uid].session_key)

  const data = pc.decryptData(encryptedData , iv)

  console.log('解密后 data: ', data)
  if(data){
    ctx.response.body = {
      code: 0,
      msg: 'success',
      data,
    }
  }else{
    ctx.response.body = {
      code: 500,
      msg: '解密失败'
    }
  }
})

// 获取小程序码
router.get('/qr', async ctx => {
  const rq = ctx.request.query;
  console.log('qr query', rq);
  const {path} = rq;
  // 获取access_token用于生成小程序码，此处处理比较简单，每次都先获取
  const tokenUrl = 'https://api.weixin.qq.com/cgi-bin/token';
  let access_token = '';
  const tokenRes = await axios({
    url: tokenUrl,
    method: 'GET',
    params: {
      appid: appId,
      secret,
      grant_type: 'client_credential'
    },
  })
  if(tokenRes.data){
    access_token = tokenRes.data.access_token;
    const qrUrl = 'https://api.weixin.qq.com/wxa/getwxacode';
    const qrRes = await axios({
      url: qrUrl,
      method: 'POST',
      params: {
        access_token,
      },
      data: {
        path,
      },
      responseType: 'arraybuffer'
    })
    if(qrRes.data){
      console.log('Get qr response');
      const data = qrRes.data;
      const imageName = `qr`;
      fs.writeFileSync(`./static/images/${imageName}.jpeg`, data);
      ctx.response.body = {
        code: 0,
        msg: 'success',
        data: {
          qrUrl: `http://127.0.0.1:3000/images/${imageName}.jpeg`
        }
      }
    }else{
      ctx.status = 500;
    }
  }else{
    ctx.status = 500;
  }
})

// 根据shareTicket，rankId，uid获取该群该书籍排行数据
router.get('/todos', async ctx => {
  const rh = ctx.request.header;
  const {gid} = rh;
  if(!gid){
    ctx.response.body = {
      code: 300,
      msg: 'header中缺少gid参数'
    }
    return;
  }
  const groupData = todos[gid];
  if(!groupData){
    console.log('add new group data');
    todos[gid] = {
      desc: '',
      list: [],
    }
    ctx.response.body = {
      code: 0,
      msg: 'success',
      data: {
        desc: '',
        list: []
      }
    }
  }else{
    console.log('get groupData', groupData);
    const {desc = '', list = []} = groupData;
    ctx.response.body = {
      code: 0,
      msg: 'success',
      data: {
        desc,
        list: list.filter(item => item.status !== -1),
      }
    }
  }
})

router.post('/addTodo', async ctx => {
  const rh = ctx.request.header;
  const rb = ctx.request.body;
  const {uid, gid} = rh;
  if(!uid){
    ctx.status = 401;
    return;
  }
  if(!gid){
    ctx.response.body = {
      code: 300,
      msg: 'header中缺少gid参数'
    }
    return;
  }
  const groupData = todos[gid];
  if(!groupData){
    ctx.response.body = {
      code: 400,
      msg: '没有对应的群聊数据'
    }
    return;
  }else{
    const {todo, userInfo} = rb;
    const {list} = groupData;
    list.push({
      creator: {
        uid: uid,
        info: userInfo
      },
      data: todo,
      status: 0
    })
    console.log('add todo', groupData);
    ctx.response.body = {
      code: 0,
      msg: 'success',
      data: {
        desc: groupData.desc,
        list: list.filter(item => item.status !== -1),
      }
    }
  }
})

router.post('/editDesc', async ctx => {
  const rh = ctx.request.header;
  const rb = ctx.request.body;
  const {uid, gid} = rh;
  if(!uid){
    ctx.status = 401;
    return;
  }
  if(!gid){
    ctx.response.body = {
      code: 300,
      msg: 'header中缺少gid参数'
    }
    return;
  }
  const groupData = todos[gid];
  if(!groupData){
    ctx.response.body = {
      code: 400,
      msg: '没有对应的群聊数据'
    }
    return;
  }else{
    const {desc} = rb;
    groupData.desc = desc;
    console.log('edit desc', groupData);
    ctx.response.body = {
      code: 0,
      msg: 'success',
      data: {
        desc: groupData.desc,
        list: groupData.list.filter(item => item.status !== -1),
      }
    }
  }
})

router.get('/', async (ctx) => {
  ctx.body = 'hello';
})

app.use(router.routes())


app.listen(3000);
console.log(`running on http://127.0.0.1:3000`);