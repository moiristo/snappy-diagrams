class SnappyBox extends SnappyCell

  drawElement: ->
    points = @boxPoints()
    @element = @diagram.snap.rect(points.x1, points.y1, points.x2 - points.x1, points.y2 - points.y1, @diagram.options.boxRadius).attr @cellAttrs('snappy-cell-box')

  xOffset: (anchor) ->
    if ['top-left', 'top-right', 'bottom-left', 'bottom-right'].indexOf(anchor) >= 0
      @diagram.options.boxRadius / 3 + @spacingOffset()
    else
      @spacingOffset()

  yOffset: (anchor) -> @xOffset(anchor)