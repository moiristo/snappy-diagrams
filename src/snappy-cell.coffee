class SnappyCell
  constructor: (@diagram, @cellX, @cellY, @options = {}) ->
    throw new Error("Can't instantiate abstract class SnappyCell") if @constructor == SnappyCell
    @sourceConnections = []
    @targetConnections = []
    @options.attrs ||= {}
    @

  x: -> @currentX || @cellX * @diagram.cellWidth
  y: -> @currentY || @cellY * @diagram.cellHeight

  anchorCoords: (anchor) ->
    xOffset = @xOffset(anchor)
    yOffset = @yOffset(anchor)

    switch anchor
      when 'top-left'
        x: @x() + xOffset
        y: @y() + yOffset
      when 'top-middle'
        x: @x() + @diagram.cellWidth / 2
        y: @y() + yOffset
      when 'top-right'
        x: @x() + @diagram.cellWidth - xOffset
        y: @y() + yOffset
      when 'middle-left'
        x: @x() + xOffset
        y: @y() + @diagram.cellHeight / 2
      when 'middle-right'
        x: @x() + @diagram.cellWidth - xOffset
        y: @y() + @diagram.cellHeight / 2
      when 'bottom-left'
        x: @x() + xOffset
        y: @y() + @diagram.cellHeight - yOffset
      when 'bottom-middle'
        x: @x() + @diagram.cellWidth / 2
        y: @y() + @diagram.cellHeight - yOffset
      when 'bottom-right'
        x: @x() + @diagram.cellWidth - xOffset
        y: @y() + @diagram.cellHeight - yOffset


  boxWidth:  -> @diagram.cellWidth - @diagram.options.cellSpacing
  boxHeight: -> @diagram.cellHeight - @diagram.options.cellSpacing

  xOffset: -> @diagram.options.cellSpacing / 2
  yOffset: -> @diagram.options.cellSpacing / 2
  spacingOffset: -> @diagram.options.cellSpacing / 2

  cellAttrs: (className) ->
    attrs = @options.attrs
    classes = [@options.attrs.class, 'snappy-cell', className]
    classes.push('draggable') if @diagram.options.allowDrag
    attrs.class = classes.join(' ')
    attrs

  centerPoint: ->
    x: @x() + @diagram.cellWidth / 2
    y: @y() + @diagram.cellHeight / 2

  boxPoints: ->
    x = @x() + @diagram.options.cellSpacing / 2
    y = @y() + @diagram.options.cellSpacing / 2

    x1: x
    y1: y
    x2: x + @boxWidth()
    y2: y + @boxHeight()

  connections: -> @sourceConnections.concat(@targetConnections)

  draw: ->
    @element = @drawElement()
    @element = @diagram.snap.g(@element, @drawText()) if @options.text
    @element.drag @moveHandler, @moveStartHandler, @moveStopHandler if @diagram.options.allowDrag
    @element

  drawElement: -> throw new Error 'Abstract method'

  drawText: -> @diagram.snap.multitext(@x() + @diagram.options.cellSpacing / 2, @y(), @options.text, @boxWidth(), @boxHeight())

  moveHandler: (dx, dy) =>
    @element.attr { transform: "#{@origTransform}#{ if @origTransform? then 'T' else 't' }#{ [dx, dy].join(',') }" }
    for connector in @sourceConnections
      connector.element.attr { x1: connector.currentCoords.x1 + dx , y1: connector.currentCoords.y1 + dy }
    for connector in @targetConnections
      connector.element.attr { x2: connector.currentCoords.x2 + dx , y2: connector.currentCoords.y2 + dy }

  moveStartHandler: =>
    @origTransform = @element.transform().local
    @diagram.snap.node.appendChild connector.element.node for connector in @connections()
    @diagram.snap.node.appendChild @element.node

  moveStopHandler: =>
    @updateCurrentCoords()
    connector.updateCurrentCoords() for connector in @connections()

  updateCurrentCoords: ->
    newBBox = @element.getBBox()
    @currentX = newBBox.x
    @currentY = newBBox.y

  toString: ->
    representation = "#{@constructor.name}@#{@cellX},#{@cellY}"
    representation += ":#{@options.text}" if @options.text
    representation
