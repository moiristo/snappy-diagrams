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

class @SnappyCell
  constructor: (@diagram, @cellX, @cellY, @options = {}) ->
    @options.shape ||= 'box'
    @options.attrs ||= {}
    @

  x: -> @cellX * @diagram.cellWidth
  y: -> @cellY * @diagram.cellHeight

  anchorCoords: (anchor) ->
    offset = @diagram.options.cellSpacing / 2
    boxRadiusOffset = @diagram.options.boxRadius / 3

    switch anchor
      when 'top-left'
        x: @x() + offset + boxRadiusOffset
        y: @y() + offset + boxRadiusOffset
      when 'top-middle'
        x: @x() + @diagram.cellWidth / 2
        y: @y() + offset
      when 'top-right'
        x: @x() + @diagram.cellWidth - offset - boxRadiusOffset
        y: @y() + offset + boxRadiusOffset
      when 'middle-left'
        x: @x() + offset
        y: @y() + @diagram.cellHeight / 2
      when 'middle-right'
        x: @x() + @diagram.cellWidth - offset
        y: @y() + (@diagram.cellHeight / 2)
      when 'bottom-left'
        x: @x() + offset + boxRadiusOffset
        y: @y() + @diagram.cellHeight - offset - boxRadiusOffset
      when 'bottom-middle'
        x: @x() + (@diagram.cellWidth / 2)
        y: @y() + @diagram.cellHeight - offset
      when 'bottom-right'
        x: @x() + @diagram.cellWidth - offset - boxRadiusOffset
        y: @y() + @diagram.cellHeight - offset - boxRadiusOffset
      else
        x: @x() + (@diagram.cellWidth / 2)
        y: @y() + (@diagram.cellHeight / 2)

  cellAttrs: (className) ->
    attrs = @options.attrs
    attrs.class = [@options.attrs.class, className].join(' ')
    attrs

  draw: ->
    switch @options.shape
      when 'circle' then @drawCircle()
      else @drawBox()
    @element = @diagram.snap.g(@element, @drawText()) if @options.text

  drawBox: ->
    x = @x() + @diagram.options.cellSpacing / 2
    y = @y() + @diagram.options.cellSpacing / 2
    width = @diagram.cellWidth - @diagram.options.cellSpacing
    height = @diagram.cellHeight - @diagram.options.cellSpacing
    @element = @diagram.snap.rect(x, y, width, height, @diagram.options.boxRadius).attr @cellAttrs('snappy-cell-box')

  drawCircle: ->
    x = @x() + @diagram.cellWidth / 2
    y = @y() + @diagram.cellHeight / 2
    radius = (Math.min(@diagram.cellWidth, @diagram.cellHeight) - @diagram.options.cellSpacing) / 2
    @element = @diagram.snap.circle(x, y, radius).attr @cellAttrs('snappy-cell-box')

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

