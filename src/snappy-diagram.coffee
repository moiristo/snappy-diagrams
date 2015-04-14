class @SnappyDiagram
  constructor: (@options = {}) ->
    @cellCount = 0
    @rowCount = 0
    @cells = []
    @connectors = []

    defaults =
      width: 1000
      height: 500
      cellSpacing: 10
      boxRadius: 5
      markerWidth: 7
      markerHeight: 10

    for key, value of defaults
      @options[key] = value unless @options[key]?

    @snap = Snap(@options.width, @options.height).attr(class: 'snappy-diagram')
    @markerEnd = @triangleMarker(@options.markerWidth, @options.markerHeight)
    @markerStart = @triangleMarker(@options.markerWidth, @options.markerHeight, true)

  triangleMarker: (width, height, reverse = false) ->
    connectorPathString = "M 0 0 L #{height} #{width / 2} L 0 #{width} z"
    path = @snap.path(connectorPathString)
    path = path.transform('r180') if reverse
    path = path.marker(0, 0, height, width, (if reverse then 1 else height), width / 2)
    path

  addCell: (cellX, cellY, options = {}) ->
    @cellCount = Math.max cellX + 1, @cellCount
    @rowCount = Math.max cellY + 1, @rowCount
    @cells[cellX] = [] unless @cells[cellX]?

    cell = new SnappyCell(@, cellX, cellY, options)
    @cells[cellX].push cell
    cell

  addConnector: (cellStart, cellEnd, options = {}) ->
    connector = new SnappyConnector(@, cellStart, cellEnd, options)
    @connectors.push connector
    connector

  setDimensions: ->
    @cellWidth = @options.width / @cellCount
    @cellHeight = @options.height / @rowCount

  draw: ->
    @setDimensions()
    @drawCells()
    @drawConnectors()

  drawCells: ->
    @setDimensions()
    for row in @cells
      if row?
        cell.draw() for cell in row

  drawConnectors: ->
    @setDimensions()
    connector.draw() for connector in @connectors


# ---------------------------------------------------------
#
# shape options: box || circle || ellipsis || parallelogram
#
# ---------------------------------------------------------

class @SnappyCell
  constructor: (@diagram, @cellX, @cellY, @options = {}) ->
    @options.shape ||= 'box'
    @options.attrs ||= {}
    @

  x: -> @cellX * @diagram.cellWidth
  y: -> @cellY * @diagram.cellHeight

  anchorCoords: (anchor) ->
    xOffset = if @["#{@options.shape}XOffset"]? then @["#{@options.shape}XOffset"](anchor) else @diagram.options.cellSpacing / 2
    yOffset = if @["#{@options.shape}YOffset"]? then @["#{@options.shape}YOffset"](anchor) else @diagram.options.cellSpacing / 2

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

  spacingOffset: ->
    @diagram.options.cellSpacing / 2

  circleRadius: ->
    (Math.min(@diagram.cellWidth, @diagram.cellHeight) - @diagram.options.cellSpacing) / 2

  boxXOffset: (anchor) ->
    if ['top-left', 'top-right', 'bottom-left', 'bottom-right'].indexOf(anchor) >= 0
      @diagram.options.boxRadius / 3 + @spacingOffset()
    else
      @spacingOffset()
  boxYOffset: (anchor) ->
    @boxXOffset(anchor)

  parallelogramXOffset: (anchor) ->
    if ['top-left', 'bottom-right'].indexOf(anchor) >= 0
      @parallelogramOffset() + @spacingOffset()
    else if ['middle-left', 'middle-right'].indexOf(anchor) >= 0
      @parallelogramOffset() / 2 + @spacingOffset()
    else
      @spacingOffset()

  ellipseXOffset: (anchor) ->
    if ['top-left', 'top-right', 'bottom-left', 'bottom-right'].indexOf(anchor) >= 0
      @spacingOffset() + @diagram.cellWidth * 0.1313
    else
      @spacingOffset()

  ellipseYOffset: (anchor) ->
    if ['top-left', 'top-right', 'bottom-left', 'bottom-right'].indexOf(anchor) >= 0
      @spacingOffset() + @diagram.cellHeight * 0.1313
    else
      @spacingOffset()

  circleXOffset: (anchor) ->
    offset = @spacingOffset()
    if @diagram.cellWidth > @diagram.cellHeight && ['top-left', 'top-right', 'bottom-left', 'bottom-right', 'middle-left', 'middle-right'].indexOf(anchor) >= 0
      offset += (@diagram.cellWidth - @diagram.cellHeight ) / 2

    offset += @circleRadius() * 0.2626 if ['top-left', 'top-right', 'bottom-left', 'bottom-right'].indexOf(anchor) >= 0
    if offset? then offset else @spacingOffset()

  circleYOffset: (anchor) ->
    offset = @spacingOffset()
    if @diagram.cellHeight > @diagram.cellWidth && ['top-left', 'top-right', 'bottom-left', 'bottom-right', 'middle-left', 'middle-right'].indexOf(anchor) >= 0
      offset += (@diagram.cellHeight - @diagram.cellWidth ) / 2

    offset += @circleRadius() * 0.2626 if ['top-left', 'top-right', 'bottom-left', 'bottom-right'].indexOf(anchor) >= 0
    if offset? then offset else @spacingOffset()

  cellAttrs: (className) ->
    attrs = @options.attrs
    attrs.class = [@options.attrs.class, 'snappy-cell', className].join(' ')
    attrs

  centerPoint: ->
    x: @x() + @diagram.cellWidth / 2
    y: @y() + @diagram.cellHeight / 2

  boxPoints: ->
    x = @x() + @diagram.options.cellSpacing / 2
    y = @y() + @diagram.options.cellSpacing / 2

    x1: x
    y1: y
    x2: x + @diagram.cellWidth - @diagram.options.cellSpacing
    y2: y + @diagram.cellHeight - @diagram.options.cellSpacing

  draw: ->
    switch @options.shape
      when 'circle' then @drawCircle()
      when 'ellipse' then @drawEllipse()
      when 'parallelogram' then @drawParallelogram()
      else @drawBox()
    @element = @diagram.snap.g(@element, @drawText()) if @options.text

  drawBox: ->
    points = @boxPoints()
    @element = @diagram.snap.rect(points.x1, points.y1, points.x2 - points.x1, points.y2 - points.y1, @diagram.options.boxRadius).attr @cellAttrs('snappy-cell-box')

  drawCircle: ->
    centerPoint = @centerPoint()
    @element = @diagram.snap.circle(centerPoint.x, centerPoint.y, @circleRadius()).attr @cellAttrs('snappy-cell-box')

  drawEllipse: ->
    centerPoint = @centerPoint()
    xRadius = (@diagram.cellWidth  - @diagram.options.cellSpacing) / 2
    yRadius = (@diagram.cellHeight - @diagram.options.cellSpacing) / 2
    @element = @diagram.snap.ellipse(centerPoint.x, centerPoint.y, xRadius, yRadius).attr @cellAttrs('snappy-cell-ellipse')

  parallelogramOffset: ->
    offset = @diagram.cellWidth / 10

  drawParallelogram: ->
    offset = @parallelogramOffset()
    points = @boxPoints()
    polygon = [
      points.x1 + offset, # p1
      points.y1,
      points.x2,          # p2
      points.y1,
      points.x2 - offset, # p3
      points.y2,
      points.x1,          # p4
      points.y2,
      points.x1 + offset, # p1
      points.y1,
    ]
    @element = @diagram.snap.polyline(polygon).attr @cellAttrs('snappy-cell-parallelogram')

  drawText: ->
    x = @x() + @diagram.options.cellSpacing / 2
    y = @y()
    maxWidth = @diagram.cellWidth - @diagram.options.cellSpacing
    maxHeight = @diagram.cellHeight - @diagram.options.cellSpacing
    textElement = @diagram.snap.multitext(x, y, @options.text, maxWidth, maxHeight)


class @SnappyConnector
  constructor: (@diagram, @cellStart, @cellEnd, @options = {}) ->
    @

  horizontalLabel: (diff) ->
    if diff > 1 then 'left' else if diff < -1 then 'right' else 'middle'

  verticalLabel: (diff) ->
    if diff > 1 then 'top' else if diff < -1 then 'bottom' else 'middle'

  draw: ->
    startLabel =  @options.startAnchor  || [ @verticalLabel(@cellStart.cellY - @cellEnd.cellY), @horizontalLabel(@cellStart.cellX - @cellEnd.cellX) ].join('-')
    endLabel =    @options.endAnchor    || [ @verticalLabel(@cellEnd.cellY - @cellStart.cellY), @horizontalLabel(@cellEnd.cellX - @cellStart.cellX) ].join('-')

    startAnchor = @cellStart.anchorCoords startLabel
    endAnchor = @cellEnd.anchorCoords endLabel

    attrs = {}
    attrs.markerEnd   = @diagram.markerEnd   unless @options.style == 'line'
    attrs.markerStart = @diagram.markerStart if     @options.style == 'double'
    attrs.class = 'snappy-connector'

    line = @diagram.snap.line(startAnchor.x, startAnchor.y, endAnchor.x, endAnchor.y).attr(attrs)

