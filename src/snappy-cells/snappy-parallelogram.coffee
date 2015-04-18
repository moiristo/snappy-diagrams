class SnappyParallelogram extends SnappyCell

  drawElement: ->
    offset = @offset()
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

  offset: -> @diagram.cellWidth / 10

  xOffset: (anchor) ->
    if ['top-left', 'bottom-right'].indexOf(anchor) >= 0
      @offset() + @spacingOffset()
    else if ['middle-left', 'middle-right'].indexOf(anchor) >= 0
      @offset() / 2 + @spacingOffset()
    else
      @spacingOffset()