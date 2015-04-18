class SnappyCircle extends SnappyCell

  drawElement: ->
    centerPoint = @centerPoint()
    @element = @diagram.snap.circle(centerPoint.x, centerPoint.y, @radius()).attr @cellAttrs('snappy-cell-circle')

  xOffset: (anchor) ->
    offset = @spacingOffset()
    if @diagram.cellWidth > @diagram.cellHeight && ['top-left', 'top-right', 'bottom-left', 'bottom-right', 'middle-left', 'middle-right'].indexOf(anchor) >= 0
      offset += (@diagram.cellWidth - @diagram.cellHeight ) / 2

    offset += @radius() * 0.2626 if ['top-left', 'top-right', 'bottom-left', 'bottom-right'].indexOf(anchor) >= 0
    if offset? then offset else @spacingOffset()

  yOffset: (anchor) ->
    offset = @spacingOffset()
    if @diagram.cellHeight > @diagram.cellWidth && ['top-left', 'top-right', 'bottom-left', 'bottom-right', 'middle-left', 'middle-right'].indexOf(anchor) >= 0
      offset += (@diagram.cellHeight - @diagram.cellWidth ) / 2

    offset += @radius() * 0.2626 if ['top-left', 'top-right', 'bottom-left', 'bottom-right'].indexOf(anchor) >= 0
    if offset? then offset else @spacingOffset()

  radius: ->
    (Math.min(@diagram.cellWidth, @diagram.cellHeight) - @diagram.options.cellSpacing) / 2