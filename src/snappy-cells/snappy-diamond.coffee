class SnappyDiamond extends SnappyCell

  drawElement: ->
    centerPoint = @centerPoint()
    points = @boxPoints()
    polygon = [
      centerPoint.x,
      points.y1,
      points.x2,
      centerPoint.y,
      centerPoint.x,
      points.y2,
      points.x1,
      centerPoint.y,
      centerPoint.x,
      points.y1,
    ]
    @element = @diagram.snap.polyline(polygon).attr @cellAttrs('snappy-cell-diamond')

  offset: (anchor, axisBoxLength) ->
    if ['top-left', 'top-right', 'bottom-left', 'bottom-right'].indexOf(anchor) >= 0
      @spacingOffset() + axisBoxLength * 0.25
    else
      @spacingOffset()

  xOffset: (anchor) -> @offset anchor, @boxWidth()
  yOffset: (anchor) -> @offset anchor, @boxHeight()
