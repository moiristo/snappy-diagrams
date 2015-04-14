Snap.plugin (Snap, Element, Paper, glob) ->

  Paper::multitext = (x, y, txt, maxWidth, maxHeight, attributes) ->
    svg = Snap()
    abc = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
    temp = svg.text(0, 0, abc)
    temp.attr attributes
    letterWidth = temp.getBBox().width / abc.length
    svg.remove()

    words = txt.split(' ')
    widthSoFar = 0
    currentLine = 0
    lines = [ '' ]

    i = 0
    while i < words.length
      l = words[i].length
      if widthSoFar + l * letterWidth > maxWidth
        lines.push ''
        currentLine++
        widthSoFar = 0
      widthSoFar += l * letterWidth
      lines[currentLine] += words[i] + ' '
      i++

    t = @text(x, y, lines).attr(attributes)

    y = y + t.getBBox().height

    tspans = t.selectAll('tspan:nth-child(n+2)')
    tspans.attr x: x, dy: '1.3em'

    bbox = t.getBBox()
    if bbox.width < maxWidth
      x = x + (maxWidth - bbox.width) / 2
    if bbox.height < maxHeight
      y = y + (maxHeight - bbox.height) / 2

    t.attr x: x, y: y
    tspans.attr x: x

    t