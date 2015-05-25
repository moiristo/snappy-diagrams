class SnappyConnector
  constructor: (@diagram, @cellStart, @cellEnd, @options = {}) ->
    @

  horizontalLabel: (diff) ->
    if diff >= 1 then 'left' else if diff <= -1 then 'right' else 'middle'

  verticalLabel: (diff) ->
    if diff > 1 then 'top' else if diff < -1 then 'bottom' else 'middle'

  draw: ->
    startLabel =  @options.startAnchor  || [ @verticalLabel(@cellStart.cellY - @cellEnd.cellY), @horizontalLabel(@cellStart.cellX - @cellEnd.cellX) ].join('-')
    endLabel =    @options.endAnchor    || [ @verticalLabel(@cellEnd.cellY - @cellStart.cellY), @horizontalLabel(@cellEnd.cellX - @cellStart.cellX) ].join('-')

    startAnchor = @cellStart.anchorCoords startLabel
    endAnchor = @cellEnd.anchorCoords endLabel

    @currentCoords = @originalCoords = { x1: startAnchor.x, y1: startAnchor.y, x2: endAnchor.x, y2: endAnchor.y }

    attrs = {}
    attrs.markerEnd   = @diagram.markerEnd   unless @options.style == 'line'
    attrs.markerStart = @diagram.markerStart if     @options.style == 'double'
    attrs.class = 'snappy-connector'

    @element = @diagram.snap.line(startAnchor.x, startAnchor.y, endAnchor.x, endAnchor.y).attr(attrs)

  updateCurrentCoords: ->
    @currentCoords =
      x1: +@element.attr('x1')
      y1: +@element.attr('y1')
      x2: +@element.attr('x2')
      y2: +@element.attr('y2')

  toString: ->
    connector = switch @options.style
      when 'line' then '-'
      when 'double' then '<->'
      else  '->'

    "SnappyConnector:(#{@cellStart.toString()})#{connector}(#{@cellEnd.toString()})"

