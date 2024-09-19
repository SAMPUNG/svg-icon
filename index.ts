const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
svg.setAttribute('style', 'display: none')
svg.setAttribute('version', '1.1')
svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg')
svg.setAttribute('xmlns:xlink', 'http://www.w3.org/1999/xlink')

document.body.appendChild(svg)

function getUrl(fullname: string) {
  const [dir, name] = fullname.split(':')
  const url = new URL(`../../svg/${dir}/${name}.svg?url`, import.meta.url).href
  return url
}

export async function registerSymbol(name: string) {
  if (svg.getElementById(name)) {
    return
  }

  const symbol = document.createElementNS(
    'http://www.w3.org/2000/svg',
    'symbol'
  )
  symbol.setAttribute('id', name)
  symbol.setAttribute('viewBox', '0 0 1024 1024')
  svg.appendChild(symbol)

  const url = getUrl(name)
  const response = await fetch(url)
  const text = await response.text()
  console.info('[svg] scan name ===>', name)
  symbol.append(...scanPath(text))
}

function scanPath(text: string) {
  //! 取出 <svg>...</svg> 中间的元素
  const elements = text.replace(/.+<svg( [^>]+="[^>]+")+>(.+)<\/svg>/, '$2')
  //! 剔除无用的 p-id 及 fill 颜色
  const slimed = elements.replace(/ (p-id|fill)="#*[A-Za-z0-9]+"/g, '')
  //! <path key="value"></path><path key="value" />
  let quotation = -1
  let key = ''
  let piece = ''
  const results: SVGElement[] = []
  let elm: SVGElement | null = null
  for (let index = 0; index < slimed.length; index++) {
    const char = slimed[index]
    switch (char) {
      //? 标签开始或结束
      case '<':
      case '>':
      case '/': {
        key = ''
        piece = ''
        quotation = -1
        break
      }
      //? 疑似键值开始或结束
      case ' ': {
        if (quotation % 2 === 1) {
          key = ''
          piece = ''
        } else if (quotation % 2) {
          console.info('[svg] tag ===>', piece)
          if (elm) {
            results.push(elm)
          }
          elm = document.createElementNS('http://www.w3.org/2000/svg', piece)
          piece = ''
        } else {
          piece += char
        }
        break
      }
      //? 键结束
      case '=': {
        console.info('[svg] key end ===>', piece)
        key = piece
        piece = ''
        break
      }
      //? 值开始或结束
      case '"': {
        if (piece) {
          console.info('[svg] quotation end ===>', piece)
          elm?.setAttribute(key, piece)
        }
        piece = ''
        quotation += 1
        break
      }
      default: {
        piece += char
      }
    }
  }
  if (elm) {
    results.push(elm)
  }
  return results
}
