import * as _ from 'lodash-es'
import { allCards } from './allCards' //500*726 //250*363  //250*182

// 基类,提供共同的一些函数
class StepBase {
  constructor() {
    this._lastResult = {}
  }

  getLastResult() {
    return this._lastResult
  }

  getSetting() {
    return false
  }

  play(realCards) {
    let cards = _.cloneDeep(realCards)
    cards = this._play(cards)
    if (_.isArray(cards)) {
      this._lastResult = _.cloneDeep(cards.at(-1))
    } else {
      this._lastResult = _.cloneDeep(cards)
    }
    return cards
  }
}

// 卡牌初始化.随机选择四张牌
export class Step10 extends StepBase {
  constructor() {
    super()
  }
  _play() {
    const cards = _.sampleSize(allCards, 4)
    const row1 = cards.map((item) => {
      return {
        id: item,
        part: 'up'
      }
    })
    const row2 = cards.map((item) => {
      return {
        id: item,
        part: 'down'
      }
    })
    return { row1, row2, hasGap: 0, title: '随机选择四张牌[刷新换牌]' }
  }
}

// 洗牌
export class Step20 extends StepBase {
  constructor() {
    super()
  }
  _play(realCards) {
    const cards = _.shuffle(_.shuffle(realCards.row1))
    const row1 = cards.map((item) => {
      return {
        id: item.id,
        part: 'up'
      }
    })
    const row2 = cards.map((item) => {
      return {
        id: item.id,
        part: 'down'
      }
    })
    return { row1, row2, hasGap: 0, title: '洗牌' }
  }
}

// 撕牌
export class Step30 extends StepBase {
  constructor() {
    super()
  }
  _play(realCards) {
    realCards.hasGap = 1
    realCards.title = '撕牌'
    return realCards
  }
}

// 变为一排
export class Step40 extends StepBase {
  constructor() {
    super()
  }
  _play(cards) {
    cards.row1 = [...cards.row1, ...cards.row2]
    cards.row2 = []
    cards.title = '将两排全并为一排'
    return cards
  }
}

// 根据名字将牌放到最后,需要交互
export class Step50 extends StepBase {
  constructor() {
    super()
  }
  getSetting() {
    return {
      title: '请选择你名字的字数',
      btns: [
        {
          text: '2个字',
          option: 2
        },
        {
          text: '3个字',
          option: 3
        },
        {
          text: '4个字',
          option: 4
        },
        {
          text: '5个字',
          option: 5
        },
        {
          text: '6个字',
          option: 6
        },
        {
          text: '7个字',
          option: 7
        }
      ]
    }
  }

  _play(cards) {
    const num = cards.option || 3
    const result = []
    for (let i = 0; i < num; i++) {
      cards.row1 = [...cards.row1.slice(1), cards.row1[0]]
      cards.title = '根据名字字数将前面几张牌放到最后'
      result.push(_.cloneDeep(cards))
    }
    return result
  }
}

// 将最前面的三张插到中间
export class Step60 extends StepBase {
  constructor() {
    super()
  }
  _play(cards) {
    // [1,2,3,4,5,6,7,8] , [4,5,6,7,8] 共四个空,随机选择一个空位
    const before3Cards = cards.row1.slice(0, 3)
    const InserIndex = _.sample([4, 5, 6, 7])
    const leftCards = cards.row1.slice(3, InserIndex)
    const rightCards = cards.row1.slice(InserIndex)
    cards.row1 = [...leftCards, ...before3Cards, ...rightCards]
    cards.title = '将最前面的三张插到中间'
    return cards
  }
}

// 最上面的一张牌藏起来
export class Step70 extends StepBase {
  _play(cards) {
    cards.row2 = cards.row1.slice(0, 1)
    cards.row1 = cards.row1.slice(1)
    cards.title = '最上面的一张牌藏起来'
    return cards
  }
}

// 根据[南方人,北方人,不清楚] 将牌插入中间.需要交互
export class Step80 extends StepBase {
  getSetting() {
    return {
      title: '请选择你的地域',
      btns: [
        {
          text: '南方人',
          option: 1
        },
        {
          text: '北方人',
          option: 2
        },
        {
          text: '不清楚',
          option: 3
        }
      ]
    }
  }
  _play(cards) {
    const num = cards.option || 2
    // 现在第一行还有7张牌 [0,1,2,3,4,5,6]
    const beforeCards = cards.row1.slice(0, num)
    const InserIndex = _.random(num + 1, 6)
    const leftCards = cards.row1.slice(num, InserIndex)
    const rightCards = cards.row1.slice(InserIndex)
    cards.row1 = [...leftCards, ...beforeCards, ...rightCards]
    cards.title = '根据地域将牌插入中间'
    return cards
  }
}

// 需要[男, 女], 将最上面的牌扔掉,需要交互
export class Step90 extends StepBase {
  getSetting() {
    return {
      title: '请选择你的性别',
      btns: [
        {
          text: '男性',
          option: 1
        },
        {
          text: '女性',
          option: 2
        }
      ]
    }
  }
  _play(cards) {
    const num = cards.option || 1
    cards.row1 = cards.row1.slice(num)
    cards.title = '根据性别将最上面的牌扔掉'
    return cards
  }
}

// 见证奇迹的时刻, 每一次都将最上面的放到最下面
export class Step100 extends StepBase {
  _play(cards) {
    const result = []
    const title = '见证奇迹的时刻'
    for (let i = 0; i < 7; i++) {
      cards.row1 = [...cards.row1.slice(1), cards.row1[0]]
      cards.title = '见证奇迹的时刻====' + title[i]
      result.push(_.cloneDeep(cards))
    }
    return result
  }
}

// 好运留下来,烦恼丢出去
export class Step110 extends StepBase {
  _play(cards) {
    const result = []
    function oneCircle() {
      cards.row1 = [...cards.row1.slice(1), cards.row1[0]]
      cards.title = '好运留下来!'
      result.push(_.cloneDeep(cards))
      cards.row1 = cards.row1.slice(1)
      cards.title = '烦恼丢出去...'
      result.push(_.cloneDeep(cards))
      if (cards.row1.length > 1) {
        oneCircle()
      }
    }
    oneCircle()
    return result
  }
}

// 最后合并
export class Step120 extends StepBase {
  _play(cards) {
    cards.hasGap = 0
    cards.title = '完美!!!'
    // bugfix, 最后的时候有可能下半部分在第一行,上半部分在第二行
    if (cards.row1[0].part == 'down') {
      // 需要换顺序
      ;[cards.row1, cards.row2] = [cards.row2, cards.row1]
    }
    return cards
  }
}
