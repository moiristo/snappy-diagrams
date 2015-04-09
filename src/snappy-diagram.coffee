class @SnappyDiagram
  constructor: (@options = {}) ->
    @cellCount = 0
    @rowCount = 0
    @cells = []
    @arrows = []

    defaults =
      width: 1000
      height: 500
      cellSpacing: 10
      boxRadius: 5

    for key, value of defaults
      @options[key] = value unless @options[key]?

    @snap = Snap(@options.width, @options.height).attr(class: 'snappy-diagram')

    arrowPathString = "M 0 2 L 10 5 L 0 8 z";
    @markerStart = @snap.path(arrowPathString).transform('r180').marker(0, 0, 10, 10, 1, 5)
    @markerEnd = @snap.path(arrowPathString).marker(0, 0, 10, 10, 9, 5)

  addCell: (cellX, cellY, options = {}) ->
    @cellCount = Math.max cellX + 1, @cellCount
    @rowCount = Math.max cellY + 1, @rowCount
    @cells[cellX] = [] unless @cells[cellX]?

    cell = new SnappyCell(@, cellX, cellY, options)
    @cells[cellX].push cell
    cell

  addConnector: (cellStart, cellEnd, options = {}) ->
    arrow = new SnappyConnector(@, cellStart, cellEnd, options)
    @arrows.push arrow
    arrow

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
    arrow.draw() for arrow in @arrows

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

class @SnappyConnector
  constructor: (@diagram, @cellStart, @cellEnd, @options = {}) ->
    @

  horizontalLabel: (diff) ->
    if diff > 0 then 'left' else if diff < 0 then 'right' else 'middle'

  verticalLabel: (diff) ->
    if diff > 0 then 'top' else if diff < 0 then 'bottom' else 'middle'

  draw: ->
    startLabel = @options.startAnchor || [ @verticalLabel(@cellStart.y() - @cellEnd.y()), @horizontalLabel(@cellStart.x() - @cellEnd.x()) ].join('-')
    endLabel = @options.endAnchor || [ @verticalLabel(@cellEnd.y() - @cellStart.y()), @horizontalLabel(@cellEnd.x() - @cellStart.x()) ].join('-')

    startAnchor = @cellStart.anchorCoords startLabel
    endAnchor = @cellEnd.anchorCoords endLabel

    attrs = {markerEnd: @diagram.markerEnd}
    attrs.markerStart = @diagram.markerStart if @options.style == 'double'
    attrs.class = 'snappy-arrow'

    line = @diagram.snap.line(startAnchor.x, startAnchor.y, endAnchor.x, endAnchor.y).attr(attrs)

