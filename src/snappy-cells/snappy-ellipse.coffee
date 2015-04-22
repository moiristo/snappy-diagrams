class SnappyEllipse extends SnappyCell

  drawElement: ->
    centerPoint = @centerPoint()
    xRadius = (@diagram.cellWidth  - @diagram.options.cellSpacing) / 2
    yRadius = (@diagram.cellHeight - @diagram.options.cellSpacing) / 2
    @element = @diagram.snap.ellipse(centerPoint.x, centerPoint.y, xRadius, yRadius).attr @cellAttrs('snappy-cell-ellipse')

  xOffset: (anchor) ->
    if ['top-left', 'top-right', 'bottom-left', 'bottom-right'].indexOf(anchor) >= 0
      @spacingOffset() + @radius().x * (1 - Math.cos(Math.PI / 4))
    else
      @spacingOffset()

  yOffset: (anchor) ->
    if ['top-left', 'top-right', 'bottom-left', 'bottom-right'].indexOf(anchor) >= 0
      @spacingOffset() + @radius().y * (1 - Math.sin(Math.PI / 4))
    else
      @spacingOffset()

  radius: ->
    x: (@diagram.cellWidth - @diagram.options.cellSpacing) / 2
    y: (@diagram.cellHeight - @diagram.options.cellSpacing) / 2
