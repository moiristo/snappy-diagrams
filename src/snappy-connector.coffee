class SnappyConnector
  constructor: (@diagram, @cellStart, @cellEnd, @options = {}) ->
    @

  horizontalLabel: (diff) ->
    if diff > 1 then 'left' else if diff < -1 then 'right' else 'middle'

  verticalLabel: (diff) ->
    if diff > 1 then 'top' else if diff < -1 then 'bottom' else 'middle'

  draw: ->
    startLabel =  @options.startAnchor  || [ @verticalLabel(@cellStart.cellY - @cellEnd.cellY), @horizontalLabel(@cellStart.cellX - @cellEnd.cellX) ].join('-')
    endLabel =    @options.endAnchor    || [ @verticalLabel(@cellEnd.cellY - @cellStart.cellY), @horizontalLabel(@cellEnd.cellX - @cellStart.cellX) ].join('-')

    startAnchor = @cellStart.anchorCoords startLabel
    endAnchor = @cellEnd.anchorCoords endLabel

    attrs = {}
    attrs.markerEnd   = @diagram.markerEnd   unless @options.style == 'line'
    attrs.markerStart = @diagram.markerStart if     @options.style == 'double'
    attrs.class = 'snappy-connector'

    line = @diagram.snap.line(startAnchor.x, startAnchor.y, endAnchor.x, endAnchor.y).attr(attrs)

  toString: ->
    connector = switch @options.style
      when 'line' then '-'
      when 'double' then '<->'
      else  '->'

    "SnappyConnector:(#{@cellStart.toString()})#{connector}(#{@cellEnd.toString()})"

