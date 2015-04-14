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
