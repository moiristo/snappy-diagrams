# ---------------------------------------------------------
#
# shape options: box || circle || ellipsis || parallelogram
#
# ---------------------------------------------------------

class SnappyCell
  constructor: (@diagram, @cellX, @cellY, @options = {}) ->
    throw new Error("Can't instantiate abstract class SnappyCell") if @constructor == SnappyCell
    @options.attrs ||= {}
    @

  x: -> @cellX * @diagram.cellWidth
  y: -> @cellY * @diagram.cellHeight

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

  xOffset: -> @diagram.options.cellSpacing / 2
  yOffset: -> @diagram.options.cellSpacing / 2
  spacingOffset: -> @diagram.options.cellSpacing / 2

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
    @element = @drawElement()
    @element = @diagram.snap.g(@element, @drawText()) if @options.text
    @element

  drawElement: -> throw new Error 'Abstract method'

  drawText: ->
    x = @x() + @diagram.options.cellSpacing / 2
    y = @y()
    maxWidth = @diagram.cellWidth - @diagram.options.cellSpacing
    maxHeight = @diagram.cellHeight - @diagram.options.cellSpacing
    textElement = @diagram.snap.multitext(x, y, @options.text, maxWidth, maxHeight)
