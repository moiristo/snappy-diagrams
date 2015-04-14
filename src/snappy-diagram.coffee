class @SnappyDiagram
  constructor: (@options = {}) ->
    @cellCount = 0
    @rowCount = 0
    @cells = []
    @connectors = []

    defaults =
      width: 1000
      height: 500
      cellSpacing: 10
      boxRadius: 5
      markerWidth: 7
      markerHeight: 10

    for key, value of defaults
      @options[key] = value unless @options[key]?

    @snap = Snap(@options.width, @options.height).attr(class: 'snappy-diagram')
    @markerEnd = @triangleMarker(@options.markerWidth, @options.markerHeight)
    @markerStart = @triangleMarker(@options.markerWidth, @options.markerHeight, true)

  triangleMarker: (width, height, reverse = false) ->
    connectorPathString = "M 0 0 L #{height} #{width / 2} L 0 #{width} z"
    path = @snap.path(connectorPathString)
    path = path.transform('r180') if reverse
    path = path.marker(0, 0, height, width, (if reverse then 1 else height), width / 2)
    path

  addCell: (cellX, cellY, options = {}) ->
    @cellCount = Math.max cellX + 1, @cellCount
    @rowCount = Math.max cellY + 1, @rowCount
    @cells[cellX] = [] unless @cells[cellX]?

    cell = new SnappyCell(@, cellX, cellY, options)
    @cells[cellX].push cell
    cell

  addConnector: (cellStart, cellEnd, options = {}) ->
    connector = new SnappyConnector(@, cellStart, cellEnd, options)
    @connectors.push connector
    connector

  setDimensions: ->
    @cellWidth = @options.width / @cellCount
    @cellHeight = @options.height / @rowCount

  draw: ->
    @setDimensions()
    @drawCells()
    @drawConnectors()

  drawCells: ->
    @setDimensions()
    for row in @cells
      if row?
        cell.draw() for cell in row

  drawConnectors: ->
    @setDimensions()
    connector.draw() for connector in @connectors
