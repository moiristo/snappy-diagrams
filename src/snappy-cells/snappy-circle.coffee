class SnappyCircle extends SnappyCell

  drawElement: ->
    centerPoint = @centerPoint()
    @element = @diagram.snap.circle(centerPoint.x, centerPoint.y, @radius()).attr @cellAttrs('snappy-cell-circle')

  xOffset: (anchor) ->
    offset = @spacingOffset()

    if @diagram.cellWidth > @diagram.cellHeight && ['top-left', 'top-right', 'bottom-left', 'bottom-right', 'middle-left', 'middle-right'].indexOf(anchor) >= 0
      offset += (@diagram.cellWidth - @diagram.cellHeight) / 2

    if ['top-left', 'top-right', 'bottom-left', 'bottom-right'].indexOf(anchor) >= 0
      offset += @radius() * (1 - Math.cos(Math.PI / 4))

    offset

  yOffset: (anchor) ->
    offset = @spacingOffset()

    if @diagram.cellHeight > @diagram.cellWidth && ['top-left', 'top-right', 'bottom-left', 'bottom-right', 'middle-left', 'middle-right'].indexOf(anchor) >= 0
      offset += (@diagram.cellHeight - @diagram.cellWidth) / 2

    if ['top-left', 'top-right', 'bottom-left', 'bottom-right'].indexOf(anchor) >= 0
      offset += @radius() * (1 - Math.sin(Math.PI / 4))

    offset

  radius: -> (Math.min(@diagram.cellWidth, @diagram.cellHeight) - @diagram.options.cellSpacing) / 2
